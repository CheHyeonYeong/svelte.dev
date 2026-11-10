---
title: 상태 관리
---

클라이언트 전용 앱을 만드는 데 익숙하다면, 서버와 클라이언트에 걸친 앱의 상태 관리는 어렵게 느껴질 수 있습니다. 이 섹션에서는 흔히 빠지는 함정을 피하는 요령을 소개합니다.

## 서버에서 상태 공유 피하기 <!-- Avoid shared state on the server -->

브라우저는 *상태를 가집니다(stateful)*. 사용자가 애플리케이션과 상호작용하는 동안 상태가 메모리에 저장됩니다. 반면 서버는 *상태를 가지지 않습니다(stateless)*. 응답의 내용은 전적으로 요청의 내용으로 결정됩니다.

어디까지나 개념적으로는 그렇습니다. 실제로 서버는 오래 실행되는 경우가 많고 여러 사용자가 함께 사용합니다. 그래서 공유 변수에 데이터를 저장하지 않는 것이 중요합니다. 예를 들어 다음 코드를 보세요:

```js
// @errors: 7034 7005
/// file: +page.server.js
let user;

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// NEVER DO THIS!
		user = {
			name: data.get('name'),
			embarrassingSecret: data.get('secret')
		};
	}
}
```

`user` 변수는 이 서버에 접속하는 모든 사람이 공유합니다. Alice가 부끄러운 비밀을 제출하고 Bob이 그 뒤에 페이지를 방문하면, Bob은 Alice의 비밀을 알게 됩니다. 게다가 Alice가 그날 늦게 사이트에 다시 왔을 때 서버가 재시작되었다면 Alice의 데이터는 사라져 있을 것입니다.

대신 [`cookies`](load#Cookies)로 사용자를 *인증*하고 데이터를 데이터베이스에 저장해야 합니다.

## load에서 부수 효과 없애기 <!-- No side-effects in load -->

같은 이유로 `load` 함수는 *순수*해야 합니다. 즉, 부수 효과가 없어야 합니다(가끔 쓰는 `console.log(...)` 정도는 예외일 수 있습니다). 예를 들어 컴포넌트에서 값을 쓰려고 `load` 함수 안에서 스토어나 전역 상태에 값을 쓰고 싶어질 수 있습니다:

```js
/// file: +page.js
// @filename: ambient.d.ts
declare module '#lib/user.js' {
	export const user: { set: (value: any) => void };
}

// @filename: index.js
// ---cut---
import { user } from '#lib/user.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/user');

	// NEVER DO THIS!
	user.set(await response.json());
}
```

앞의 예제와 마찬가지로, 이렇게 하면 한 사용자의 정보가 *모든* 사용자가 공유하는 곳에 들어갑니다. 대신 데이터를 그냥 반환하고...

```js
/// file: +page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/user');

+++	return {
		user: await response.json()
	};+++
}
```

...필요한 컴포넌트에 전달하거나 [`page.data`](load#page.data)를 사용하세요.

SSR을 사용하지 않는다면 한 사용자의 데이터가 실수로 다른 사용자에게 노출될 위험은 없습니다. 그래도 `load` 함수에서는 부수 효과를 피하는 것이 좋습니다. 부수 효과가 없으면 애플리케이션의 동작을 이해하기가 훨씬 쉬워집니다.

## 컨텍스트와 함께 상태와 스토어 사용하기 <!-- Using state and stores with context -->

전역 상태를 쓸 수 없다면 `page.data`와 다른 [앱 상태]($app-state)는 어떻게 쓸 수 있는지 궁금할 것입니다. 답은 서버에서 앱 상태와 앱 스토어가 Svelte의 [컨텍스트 API](/tutorial/svelte/context-api)를 사용한다는 것입니다. 상태(또는 스토어)는 `setContext`로 컴포넌트 트리에 붙고, 구독할 때는 `getContext`로 가져옵니다. 우리만의 상태로도 똑같이 할 수 있습니다:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
	import { setContext } from 'svelte';

	/** @type {import('./$types').LayoutProps} */
	let { data } = $props();

	// Pass a function referencing our state
	// to the context for child components to access
	setContext('user', () => data.user);
</script>
```

```svelte
<!--- file: src/routes/user/+page.svelte --->
<script>
	import { getContext } from 'svelte';

	// Retrieve user store from context
	const user = getContext('user');
</script>

<p>Welcome {user().name}</p>
```

> [!NOTE] 경계를 넘어서도 반응성을 유지하기 위해 `setContext`에 함수를 전달하고 있습니다. 자세한 내용은 [여기](/docs/svelte/$state#Passing-state-into-functions)를 보세요

> [!LEGACY]
> 이 용도로 `svelte/store`의 스토어를 쓸 수도 있지만, Svelte 5를 사용한다면 대신 유니버설 반응성을 활용하기를 권합니다.

SSR로 페이지를 렌더링하는 동안 더 깊은 단계의 페이지나 컴포넌트에서 컨텍스트 기반 상태의 값을 업데이트해도 부모 컴포넌트의 값에는 영향을 주지 않습니다. 상태 값이 업데이트될 때는 부모 컴포넌트가 이미 렌더링된 뒤이기 때문입니다. 반면 클라이언트에서는(CSR이 활성화된 경우로, 기본값입니다) 값이 전파되어 계층 구조에서 더 위에 있는 컴포넌트, 페이지, 레이아웃이 새 값에 반응합니다. 따라서 하이드레이션 중 상태 업데이트로 값이 '깜빡이는' 것을 피하려면, 일반적으로 상태를 위로 올려 보내기보다 컴포넌트 아래로 내려 보내는 것이 좋습니다.

SSR을 사용하지 않는다면(그리고 앞으로도 SSR이 필요 없다고 확신할 수 있다면) 컨텍스트 API를 쓰지 않고 공유 모듈에 상태를 두어도 안전합니다.

## 컴포넌트와 페이지 상태는 유지됩니다 <!-- Component and page state is preserved -->

애플리케이션 안에서 이동할 때 SvelteKit은 기존 레이아웃과 페이지 컴포넌트를 재사용합니다. 예를 들어 다음과 같은 라우트가 있다면...

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	// THIS CODE IS BUGGY!
	const wordCount = data.content.split(' ').length;
	const estimatedReadingTime = wordCount / 250;
</script>

<header>
	<h1>{data.title}</h1>
	<p>Reading time: {Math.round(estimatedReadingTime)} minutes</p>
</header>

<div>{@html data.content}</div>
```

...`/blog/my-short-post`에서 `/blog/my-long-post`로 이동해도 레이아웃, 페이지, 그 안의 다른 컴포넌트가 제거되었다가 다시 만들어지지 않습니다. 대신 (다른 Svelte 컴포넌트와 마찬가지로) `data` prop(그리고 그에 따라 `data.title`과 `data.content`)이 업데이트되며, 코드가 다시 실행되지 않으므로 `onMount`와 `onDestroy` 같은 생명주기 메서드도 다시 실행되지 않고 `estimatedReadingTime`도 다시 계산되지 않습니다.

대신 값을 [*반응형*](/tutorial/svelte/state)으로 만들어야 합니다:

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

+++	let wordCount = $derived(data.content.split(' ').length);
	let estimatedReadingTime = $derived(wordCount / 250);+++
</script>
```

> [!NOTE] `onMount`와 `onDestroy`의 코드가 내비게이션 후에 다시 실행되어야 한다면 각각 [afterNavigate]($app-navigation#afterNavigate)와 [beforeNavigate]($app-navigation#beforeNavigate)를 사용하면 됩니다.

이렇게 컴포넌트를 재사용하므로 사이드바의 스크롤 상태 같은 것이 유지되고, 바뀌는 값 사이에 애니메이션도 쉽게 넣을 수 있습니다. 내비게이션할 때 컴포넌트를 완전히 제거하고 다시 마운트해야 한다면 다음 패턴을 사용할 수 있습니다:

```svelte
<script>
	import { page } from '$app/state';
</script>

{#key page.url.pathname}
	<BlogPost title={data.title} content={data.title} />
{/key}
```

## URL에 상태 저장하기 <!-- Storing state in the URL -->

테이블의 필터나 정렬 규칙처럼 새로고침 후에도 남아 있어야 하거나 SSR에 영향을 주어야 하는 상태가 있다면, URL 검색 매개변수(`?sort=price&order=ascending` 등)에 두는 것이 좋습니다. 이 값은 `<a href="...">`나 `<form action="...">` 속성에 넣을 수도 있고, `goto('?key=value')`로 프로그래밍 방식으로 설정할 수도 있습니다. `load` 함수 안에서는 `url` 매개변수로, 컴포넌트 안에서는 `page.url.searchParams`로 접근할 수 있습니다.

## 임시 상태를 스냅샷에 저장하기 <!-- Storing ephemeral state in snapshots -->

'아코디언이 열려 있는가?' 같은 일부 UI 상태는 버려도 되는 것입니다. 사용자가 다른 곳으로 이동하거나 페이지를 새로고침해 상태가 사라져도 상관없습니다. 하지만 사용자가 다른 페이지로 갔다가 돌아왔을 때 데이터가 유지되기를 *원하면서도*, 상태를 URL이나 데이터베이스에 저장하기에는 과한 경우가 있습니다. 이를 위해 SvelteKit은 컴포넌트 상태를 히스토리 항목과 연결할 수 있는 [스냅샷](snapshots)을 제공합니다.
