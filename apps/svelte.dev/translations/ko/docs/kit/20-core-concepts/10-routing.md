---
title: 라우팅
tags: routing
---

SvelteKit의 핵심에는 *파일 시스템 기반 라우터*가 있습니다. 앱의 라우트, 즉 사용자가 접근할 수 있는 URL 경로는 코드베이스의 디렉터리로 정의됩니다:

- `src/routes`는 루트 라우트입니다
- `src/routes/about`은 `/about` 라우트를 만듭니다
- `src/routes/blog/[slug]`는 `slug`라는 *매개변수*가 있는 라우트를 만듭니다. 사용자가 `/blog/hello-world` 같은 페이지를 요청하면 이 매개변수로 데이터를 동적으로 불러올 수 있습니다

> [!NOTE] [프로젝트 설정](@sveltejs-kit-vite)을 수정하면 `src/routes`를 다른 디렉터리로 바꿀 수 있습니다.

각 라우트 디렉터리에는 하나 이상의 *라우트 파일*이 들어 있으며, 라우트 파일은 `+` 접두사로 구별할 수 있습니다.

이 파일들은 잠시 후에 자세히 소개하겠지만, 먼저 SvelteKit의 라우팅이 어떻게 동작하는지 기억하는 데 도움이 되는 간단한 규칙 몇 가지를 알아 두세요:

* 모든 파일은 서버에서 실행될 수 있습니다
* `+server` 파일을 제외한 모든 파일은 클라이언트에서 실행됩니다
* `+layout`과 `+error` 파일은 자신이 있는 디렉터리뿐 아니라 하위 디렉터리에도 적용됩니다

> [!NOTE] 페이지 A에서 B로 이동할 때 SvelteKit은 두 페이지에 공통인 컴포넌트를 유지합니다. 자세한 내용은 [여기](state-management#Component-and-page-state-is-preserved)를 보세요.

## +page

### +page.svelte

`+page.svelte` 컴포넌트는 앱의 페이지 하나를 정의합니다. 기본적으로 페이지는 첫 요청에서는 서버([SSR](glossary#SSR))에서, 이후 내비게이션에서는 브라우저([CSR](glossary#CSR))에서 렌더링됩니다.

```svelte
<!--- file: src/routes/+page.svelte --->
<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>
```

```svelte
<!--- file: src/routes/about/+page.svelte --->
<h1>About this site</h1>
<p>TODO...</p>
<a href="/">Home</a>
```

> [!NOTE] SvelteKit은 프레임워크 전용 `<Link>` 컴포넌트 대신 `<a>` 요소로 라우트 사이를 이동합니다.

페이지는 `data` prop을 통해 `load` 함수에서 데이터를 받을 수 있습니다.

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

2.24부터 페이지는 라우트 매개변수를 바탕으로 타입이 지정된 `params` prop도 받습니다. 이는 [원격 함수](remote-functions)와 함께 쓸 때 특히 유용합니다:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	import { getPost } from '../blog.remote';

	/** @type {import('./$types').PageProps} */
	let { params } = $props();

	const post = $derived(await getPost(params.slug));
</script>

<h1>{post.title}</h1>
<div>{@html post.content}</div>
```

> [!LEGACY]
> `PageProps`는 2.16.0에서 추가되었습니다. 이전 버전에서는 대신 `PageData`로 `data` 속성의 타입을 직접 지정해야 했습니다. [$types](#\$types)를 보세요.
>
> Svelte 4에서는 대신 `export let data`를 사용합니다.

### +page.js

페이지를 렌더링하기 전에 데이터를 불러와야 하는 경우가 많습니다. 이를 위해 `load` 함수를 내보내는 `+page.js` 모듈을 추가합니다:

```js
/// file: src/routes/blog/[slug]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	error(404, 'Not found');
}
```

이 함수는 `+page.svelte`와 함께 실행됩니다. 즉, 서버 사이드 렌더링 중에는 서버에서, 클라이언트 사이드 내비게이션 중에는 브라우저에서 실행됩니다. API에 대한 자세한 내용은 [`load`](load)를 보세요.

`+page.js`는 `load` 외에도 페이지의 동작을 설정하는 값을 내보낼 수 있습니다:

- `export const prerender = true` 또는 `false` 또는 `'auto'`
- `export const ssr = true` 또는 `false`
- `export const csr = true` 또는 `false`

이에 대한 자세한 내용은 [페이지 옵션](page-options)에서 확인할 수 있습니다.

### +page.server.js

`load` 함수가 서버에서만 실행될 수 있다면(예를 들어 데이터베이스에서 데이터를 가져와야 하거나 API 키 같은 비공개 [환경 변수](environment-variables)에 접근해야 한다면), `+page.js`의 이름을 `+page.server.js`로 바꾸고 `PageLoad` 타입을 `PageServerLoad`로 바꾸면 됩니다.

```js
/// file: src/routes/blog/[slug]/+page.server.js

// @filename: ambient.d.ts
declare global {
	const getPostFromDatabase: (slug: string) => {
		title: string;
		content: string;
	}
}

export {};

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);

	if (post) {
		return post;
	}

	error(404, 'Not found');
}
```

클라이언트 사이드 내비게이션 중에는 SvelteKit이 이 데이터를 서버에서 불러오므로, 반환값은 [devalue](https://github.com/rich-harris/devalue)로 직렬화할 수 있어야 합니다. API에 대한 자세한 내용은 [`load`](load)를 보세요.

`+page.js`처럼 `+page.server.js`도 [페이지 옵션](page-options)인 `prerender`, `ssr`, `csr`을 내보낼 수 있습니다.

`+page.server.js` 파일은 *액션*도 내보낼 수 있습니다. `load`가 서버에서 데이터를 읽게 해 준다면, `actions`는 `<form>` 요소를 사용해 서버*에* 데이터를 쓰게 해 줍니다. 사용법은 [폼 액션](form-actions) 섹션을 보세요.

## +error

`load` 중에 에러가 발생하면 SvelteKit은 기본 에러 페이지를 렌더링합니다. `+error.svelte` 파일을 추가하면 라우트별로 이 에러 페이지를 커스터마이즈할 수 있습니다:

```svelte
<!--- file: src/routes/blog/[slug]/+error.svelte --->
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

SvelteKit은 가장 가까운 에러 바운더리를 찾아 '트리를 거슬러 올라갑니다'. 위 파일이 없다면 기본 에러 페이지를 렌더링하기 전에 `src/routes/blog/+error.svelte`, 그다음 `src/routes/+error.svelte`를 차례로 시도합니다. *그것마저* 실패하면(또는 루트 `+error`보다 '위'에 있는 루트 `+layout`의 `load` 함수에서 에러가 발생했다면) SvelteKit은 포기하고 정적 폴백 에러 페이지를 렌더링합니다. 이 페이지는 `src/error.html` 파일을 만들어 커스터마이즈할 수 있습니다.

`+layout(.server).js`의 `load` 함수 안에서 에러가 발생하면, 트리에서 가장 가까운 에러 바운더리는 그 레이아웃 옆이 아니라 *위*에 있는 `+error.svelte` 파일입니다.

라우트를 찾을 수 없으면(404) `src/routes/+error.svelte`(이 파일이 없다면 기본 에러 페이지)가 사용됩니다.

> [!NOTE] [`handle`](hooks#handle)이나 [+server.js](#server) 요청 핸들러 안에서 에러가 발생하면 `+error.svelte`는 사용되지 *않습니다*.

에러 처리에 대한 자세한 내용은 [여기](errors)에서 볼 수 있습니다.

## +layout

지금까지는 페이지를 완전히 독립된 컴포넌트로 다뤘습니다. 이동하면 기존 `+page.svelte` 컴포넌트는 제거되고 새 컴포넌트가 그 자리를 차지합니다.

하지만 많은 앱에는 최상위 내비게이션이나 푸터처럼 *모든* 페이지에 보여야 하는 요소가 있습니다. 이런 요소를 모든 `+page.svelte`에서 반복하는 대신 *레이아웃*에 넣을 수 있습니다.

### +layout.svelte

모든 페이지에 적용되는 레이아웃을 만들려면 `src/routes/+layout.svelte` 파일을 만드세요. 기본 레이아웃(직접 만들지 않았을 때 SvelteKit이 사용하는 레이아웃)은 다음과 같습니다...

```svelte
<script>
	let { children } = $props();
</script>

{@render children()}
```

...하지만 원하는 마크업, 스타일, 동작을 얼마든지 추가할 수 있습니다. 유일한 조건은 컴포넌트에 페이지 내용을 위한 `@render` 태그가 있어야 한다는 것입니다. 예를 들어 내비게이션 바를 추가해 봅시다:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/settings">Settings</a>
</nav>

{@render children()}
```

`/`, `/about`, `/settings` 페이지를 만들면...

```html
/// file: src/routes/+page.svelte
<h1>Home</h1>
```

```html
/// file: src/routes/about/+page.svelte
<h1>About</h1>
```

```html
/// file: src/routes/settings/+page.svelte
<h1>Settings</h1>
```

...내비게이션은 항상 보이고, 세 페이지 사이를 클릭해 이동하면 `<h1>`만 바뀝니다.

레이아웃은 *중첩*할 수 있습니다. `/settings` 페이지가 하나만 있는 것이 아니라, 하위 메뉴를 공유하는 `/settings/profile`과 `/settings/notifications` 같은 중첩 페이지가 있다고 해 봅시다(실제 예시는 [github.com/settings](https://github.com/settings)를 보세요).

(최상위 내비게이션이 있는 루트 레이아웃은 그대로 상속하면서) `/settings` 아래의 페이지에만 적용되는 레이아웃을 만들 수 있습니다:

```svelte
<!--- file: src/routes/settings/+layout.svelte --->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<h1>Settings</h1>

<div class="submenu">
	{#each data.sections as section}
		<a href="/settings/{section.slug}">{section.title}</a>
	{/each}
</div>

{@render children()}
```

> [!LEGACY]
> `LayoutProps`는 2.16.0에서 추가되었습니다. 이전 버전에서는 [속성의 타입을 직접 지정해야](#\$types) 했습니다.

`data`가 어떻게 채워지는지는 바로 아래 다음 섹션의 `+layout.js` 예제에서 볼 수 있습니다.

기본적으로 각 레이아웃은 바로 위의 레이아웃을 상속합니다. 이렇게 되기를 원하지 않을 때는 [고급 레이아웃](advanced-routing#Advanced-layouts)이 도움이 됩니다.

### +layout.js

`+page.svelte`가 `+page.js`에서 데이터를 불러오는 것처럼, `+layout.svelte` 컴포넌트도 `+layout.js`의 [`load`](load) 함수에서 데이터를 받을 수 있습니다.

```js
/// file: src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

`+layout.js`가 [페이지 옵션](page-options)인 `prerender`, `ssr`, `csr`을 내보내면, 이 값은 하위 페이지의 기본값으로 사용됩니다.

레이아웃의 `load` 함수가 반환한 데이터는 모든 하위 페이지에서도 사용할 수 있습니다:

```svelte
<!--- file: src/routes/settings/profile/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]
</script>
```

> [!NOTE] 페이지 사이를 이동할 때 레이아웃 데이터는 바뀌지 않는 경우가 많습니다. SvelteKit은 필요할 때만 똑똑하게 [`load`](load) 함수를 다시 실행합니다.

### +layout.server.js

레이아웃의 `load` 함수를 서버에서 실행하려면 `+layout.server.js`로 옮기고 `LayoutLoad` 타입을 `LayoutServerLoad`로 바꾸세요.

`+layout.js`처럼 `+layout.server.js`도 [페이지 옵션](page-options)인 `prerender`, `ssr`, `csr`을 내보낼 수 있습니다.

## +server

페이지뿐 아니라 `+server.js` 파일('API 라우트' 또는 '엔드포인트'라고도 부릅니다)로도 라우트를 정의할 수 있으며, 이 파일로는 응답을 완전히 제어할 수 있습니다. `+server.js` 파일은 `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`, `HEAD`, `QUERY` 같은 HTTP 메서드에 대응하는 함수를 내보냅니다. 이 함수들은 [`RequestEvent`](@sveltejs-kit#RequestEvent) 인자를 받아 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 객체를 반환합니다.

예를 들어 `GET` 핸들러가 있는 `/api/random-number` 라우트를 만들 수 있습니다:

```js
/// file: src/routes/api/random-number/+server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
}
```

`Response`의 첫 번째 인자는 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)일 수 있으므로, 대량의 데이터를 스트리밍하거나 server-sent events를 만들 수 있습니다(AWS Lambda처럼 응답을 버퍼링하는 플랫폼에 배포하는 경우는 제외).

편의를 위해 `@sveltejs/kit`의 [`error`](@sveltejs-kit#error)와 [`redirect`](@sveltejs-kit#redirect) 메서드를 사용할 수 있습니다(꼭 써야 하는 것은 아닙니다).

에러가 발생하면(`error(...)`든 예상치 못한 에러든) `Accept` 헤더에 따라 에러를 JSON으로 표현한 응답이나 폴백 에러 페이지(`src/error.html`로 커스터마이즈 가능)가 응답으로 나갑니다. 이 경우 [`+error.svelte`](#error) 컴포넌트는 렌더링되지 *않습니다*. 에러 처리에 대한 자세한 내용은 [여기](errors)에서 볼 수 있습니다.

> [!NOTE] `OPTIONS` 핸들러를 만들 때는 Vite가 `Access-Control-Allow-Origin`과 `Access-Control-Allow-Methods` 헤더를 주입한다는 점에 유의하세요. 직접 추가하지 않으면 프로덕션에서는 이 헤더들이 없습니다.

> [!NOTE] `+layout` 파일은 `+server.js` 파일에 영향을 주지 않습니다. 매 요청 전에 어떤 로직을 실행하고 싶다면 서버 [`handle`](hooks#handle) 훅에 추가하세요.

### 데이터 받기 <!-- Receiving data -->

`POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD`/`QUERY` 핸들러를 내보내면 `+server.js` 파일로 완전한 API를 만들 수 있습니다:

```svelte
<!--- file: src/routes/add/+page.svelte --->
<script>
	let a = $state(0);
	let b = $state(0);
	let total = $state(0);

	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button onclick={add}>Calculate</button>
```

```js
/// file: src/routes/api/add/+server.js
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return Response.json(a + b);
}
```

> [!NOTE] 일반적으로 브라우저에서 서버로 데이터를 제출할 때는 [폼 액션](form-actions)이 더 좋은 방법입니다.

> [!NOTE] `GET` 핸들러를 내보내면 `HEAD` 요청은 `GET` 핸들러가 반환하는 응답 본문의 `content-length`를 반환합니다.

### 폴백 메서드 핸들러 <!-- Fallback method handler -->

`fallback` 핸들러를 내보내면 처리되지 않은 모든 요청 메서드와 일치합니다. 여기에는 `+server.js`에서 전용으로 내보낼 수 없는 `MOVE` 같은 메서드도 포함됩니다.

```js
/// file: src/routes/api/add/+server.js
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return Response.json(a + b);
}

// This handler will respond to PUT, PATCH, DELETE, etc.
/** @type {import('./$types').RequestHandler} */
export async function fallback({ request }) {
	return new Response(`I caught your ${request.method} request!`);
}
```

> [!NOTE] `HEAD` 요청에서는 `GET` 핸들러가 `fallback` 핸들러보다 우선합니다.

### 콘텐츠 협상 <!-- Content negotiation -->

`+server.js` 파일은 `+page` 파일과 같은 디렉터리에 둘 수 있으므로, 같은 라우트가 페이지일 수도 있고 API 엔드포인트일 수도 있습니다. 어느 쪽인지 정하기 위해 SvelteKit은 다음 규칙을 적용합니다:

- `PUT`/`PATCH`/`DELETE`/`OPTIONS`/`QUERY` 요청은 페이지에 해당하지 않으므로 항상 `+server.js`가 처리합니다
- `GET`/`POST`/`HEAD` 요청은 `accept` 헤더가 `text/html`을 우선한다면(즉, 브라우저의 페이지 요청이라면) 페이지 요청으로 취급하고, 그렇지 않으면 `+server.js`가 처리합니다.
- `GET` 요청에 대한 응답에는 `Vary: Accept` 헤더가 포함되므로, 프록시와 브라우저는 HTML 응답과 JSON 응답을 따로 캐시합니다.

## $types

위 예제 전반에서 `$types.d.ts` 파일의 타입을 가져왔습니다. 이 파일은 TypeScript(또는 JSDoc 타입 주석을 쓰는 JavaScript)를 사용할 때 SvelteKit이 숨겨진 디렉터리에 만들어 주는 파일로, 루트 파일을 다룰 때 타입 안전성을 제공합니다.

예를 들어 `let { data } = $props()`에 `PageProps`(`+layout.svelte` 파일이라면 `LayoutProps`)로 주석을 달면, TypeScript는 `data`의 타입이 `load`가 반환한 값의 타입이라는 것을 알게 됩니다:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>
```

> [!NOTE]
> 2.16.0에서 추가된 `PageProps`와 `LayoutProps` 타입은 `data` prop을 `PageData`나 `LayoutData`로 지정하고, 페이지의 `form`이나 레이아웃의 `children` 같은 다른 prop의 타입까지 지정하는 단축 표현입니다. 이전 버전에서는 이런 속성의 타입을 직접 지정해야 했습니다. 예를 들어 페이지라면 다음과 같습니다:
>
> ```js
> /// file: +page.svelte
> /** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
> let { data, form } = $props();
> ```
>
> 레이아웃이라면 다음과 같습니다:
>
> ```js
> /// file: +layout.svelte
> /** @type {{ data: import('./$types').LayoutData, children: Snippet }} */
> let { data, children } = $props();
> ```

마찬가지로 `load` 함수에 `PageLoad`, `PageServerLoad`, `LayoutLoad`, `LayoutServerLoad`(각각 `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js`용)로 주석을 달면 `params`와 반환값의 타입이 올바르게 지정됩니다.

VS Code나 language server protocol과 TypeScript 플러그인을 지원하는 IDE를 사용한다면 이런 타입을 *완전히* 생략할 수 있습니다! Svelte의 IDE 도구가 올바른 타입을 넣어 주므로, 직접 작성하지 않아도 타입 검사를 받을 수 있습니다. 명령줄 도구인 `svelte-check`에서도 동작합니다.

`$types` 생략에 대한 자세한 내용은 이를 다룬 [블로그 글](/blog/zero-config-type-safety)에서 볼 수 있습니다.

## 기타 파일 <!-- Other files -->

라우트 디렉터리 안의 다른 파일은 SvelteKit이 모두 무시합니다. 따라서 컴포넌트와 유틸리티 모듈을 그것이 필요한 라우트와 함께 둘 수 있습니다.

+page.test.js, +server.spec.ts, +page.stories.svelte 같은 파일도 무시되므로, 테스트와 스토리를 라우트 파일과 함께 둘 수 있습니다.

컴포넌트와 모듈이 여러 라우트에서 필요하다면 [`#lib`]($lib)에 두는 것이 좋습니다.

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 라우팅](/tutorial/kit/pages)
- [튜토리얼: API 라우트](/tutorial/kit/get-handlers)
- [문서: 고급 라우팅](advanced-routing)
