---
title: 폼 액션
tags: forms
---

`+page.server.js` 파일은 *액션*을 내보낼 수 있으며, 액션을 사용하면 `<form>` 요소로 서버에 데이터를 `POST`할 수 있습니다.

`<form>`을 사용할 때 클라이언트 사이드 JavaScript는 선택 사항이지만, JavaScript로 폼 상호작용을 손쉽게 *점진적으로 향상*시켜 최고의 사용자 경험을 제공할 수 있습니다.

> [!NOTE] 실험적 기능인 [`form` 원격 함수](remote-functions#form)는 폼 액션과 같은 용도를 다루면서 타입 안전성과 [단일 왕복 변경(single-flight mutation)](remote-functions#Single-flight-mutations)을 더해 줍니다. 폼 액션은 기능적으로 완성된 상태이며 앞으로도 계속 동작하지만, 새로운 개발은 서버와 통신하는 권장 방식이 될 원격 함수에 집중되고 있습니다. 새 프로젝트라면 원격 함수를 고려해 보세요. 다만 실험적 기능인 동안에는 API가 바뀔 수 있다는 점을 염두에 두세요.

## 기본 액션 <!-- Default actions -->

가장 단순한 경우, 페이지는 `default` 액션을 선언합니다:

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// TODO log the user in
	}
};
```

`/login` 페이지에서 이 액션을 호출하려면 `<form>`만 추가하면 됩니다. JavaScript는 필요 없습니다:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<form method="POST">
	<label>
		Email
		<input name="email" type="email">
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
</form>
```

누군가 버튼을 클릭하면 브라우저는 `POST` 요청으로 폼 데이터를 서버에 보내고, 기본 액션이 실행됩니다.

> [!NOTE] `GET` 요청에는 절대 부수 효과가 있어서는 안 되므로, 액션은 항상 `POST` 요청을 사용합니다.

페이지를 가리키는 `action` 속성을 추가하면 다른 페이지에서도 액션을 호출할 수 있습니다(예를 들어 루트 레이아웃의 내비게이션에 로그인 위젯이 있는 경우):

```html
/// file: src/routes/+layout.svelte
<form method="POST" action="/login">
	<!-- content -->
</form>
```

이 폼을 제출하면 액션의 성공 여부와 관계없이 `/login`으로 이동합니다. 브라우저가 원래 그렇게 동작하고, [`use:enhance`](#Progressive-enhancement-use:enhance)도 이를 그대로 흉내 냅니다. 현재 위치에 머문 채 그 자리에서 결과를 처리하고 싶다면 [점진적 향상](#Progressive-enhancement-use:enhance) 섹션에 그 방법이 나와 있습니다.

## 이름 있는 액션 <!-- Named actions -->

페이지는 `default` 액션 하나 대신 필요한 만큼 이름 있는 액션을 가질 수 있습니다:

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
---	default: async (event) => {---
+++	login: async (event) => {+++
		// TODO log the user in
	},
+++	register: async (event) => {
		// TODO register the user
	}+++
};
```

이름 있는 액션을 호출하려면 액션 이름 앞에 `/` 문자를 붙인 쿼리 매개변수를 추가합니다:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<form method="POST" action="?/register">
```

```svelte
<!--- file: src/routes/+layout.svelte --->
<form method="POST" action="/login?/register">
```

`action` 속성 외에도, 버튼에 `formaction` 속성을 사용하면 같은 폼 데이터를 부모 `<form>`과 다른 액션으로 `POST`할 수 있습니다:

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" +++action="?/login"+++>
	<label>
		Email
		<input name="email" type="email">
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
	+++<button formaction="?/register">Register</button>+++
</form>
```

> [!NOTE] 이름 있는 액션과 기본 액션을 함께 둘 수는 없습니다. 리디렉션 없이 이름 있는 액션으로 POST하면 쿼리 매개변수가 URL에 남아 있게 되고, 그러면 다음 기본 POST가 이전의 이름 있는 액션으로 가 버리기 때문입니다.

## 액션의 구조 <!-- Anatomy of an action -->

각 액션은 `RequestEvent` 객체를 받으므로 `request.formData()`로 데이터를 읽을 수 있습니다. 요청을 처리한 뒤(예를 들어 쿠키를 설정해 사용자를 로그인시킨 뒤), 액션은 데이터로 응답할 수 있습니다. 이 데이터는 다음 업데이트 전까지 해당 페이지의 `form` 속성과 앱 전체의 `page.form`을 통해 사용할 수 있습니다.

```js
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/db.js';

// @filename: index.js
// ---cut---
import * as db from '#lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const user = await db.getUserFromSession(cookies.get('sessionid'));
	return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user));

		return { success: true };
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

```svelte
<!--- file: src/routes/login/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>

{#if form?.success}
	<!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

> [!LEGACY]
> `PageProps`는 2.16.0에서 추가되었습니다. 이전 버전에서는 `data`와 `form` 속성의 타입을 각각 지정해야 했습니다:
> ```js
> /// file: +page.svelte
> /** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
> let { data, form } = $props();
> ```
>
> Svelte 4에서는 속성을 선언할 때 `export let data`와 `export let form`을 사용합니다.

### 유효성 검사 오류 <!-- Validation errors -->

데이터가 유효하지 않아 요청을 처리할 수 없다면, 이전에 제출한 폼 값과 함께 유효성 검사 오류를 사용자에게 돌려주어 다시 시도할 수 있게 할 수 있습니다. `fail` 함수를 사용하면 HTTP 상태 코드(유효성 검사 오류라면 보통 400이나 422)와 함께 데이터를 반환할 수 있습니다. 상태 코드는 `page.status`로, 데이터는 `form`으로 사용할 수 있습니다:

`use:enhance`를 사용할 때(또는 `accept: application/json` 헤더를 붙여 `fetch` 요청을 보낼 때), HTTP 응답 상태 코드는 `fail`에 전달한 상태 코드와 같아집니다. 액션이 데이터를 반환하면 응답 상태는 200이 되고, 아무것도 반환하지 않으면(즉 `undefined`이면) 204가 됩니다. 덕분에 관측 가능성 도구로 폼 제출 결과를 추적하기가 쉬워집니다.

```js
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/db.js';

// @filename: index.js
// ---cut---
+++import { fail } from '@sveltejs/kit';+++
import * as db from '#lib/server/db.js';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

+++		if (!email) {
			return fail(400, { email, missing: true });
		}+++

		const user = await db.getUser(email);

+++		if (!user || user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}+++

		cookies.set('sessionid', await db.createSession(user));

		return { success: true };
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

> [!NOTE] 만일을 위해 페이지에는 비밀번호가 아니라 이메일만 돌려준다는 점에 유의하세요.

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" action="?/login">
+++	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}+++
	<label>
		Email
		<input name="email" type="email" +++value={form?.email ?? ''}+++>
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

반환하는 데이터는 JSON으로 직렬화할 수 있어야 합니다. 그 밖의 구조는 전적으로 여러분이 정하면 됩니다. 예를 들어 페이지에 폼이 여러 개 있다면, `id` 같은 속성을 두어 반환된 `form` 데이터가 어떤 `<form>`에 해당하는지 구분할 수 있습니다.

### 리디렉션 <!-- Redirects -->

리디렉션(과 오류)은 [`load`](load#Redirects)에서와 똑같이 동작합니다:

```js
// @errors: 2345
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/db.js';

// @filename: index.js
// ---cut---
import { fail, +++redirect+++ } from '@sveltejs/kit';
import * as db from '#lib/server/db.js';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request, +++url+++ }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		if (!user) {
			return fail(400, { email, missing: true });
		}

		if (user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user));

+++		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}+++

		return { success: true };
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

## 데이터 로딩 <!-- Loading data -->

액션이 실행되고 나면 (리디렉션이나 예기치 않은 오류가 발생하지 않는 한) 페이지가 다시 렌더링되며, 액션의 반환값은 `form` prop으로 페이지에서 사용할 수 있습니다. 즉, 페이지의 `load` 함수는 액션이 끝난 뒤에 실행됩니다.

`handle`은 액션이 호출되기 전에 실행되고, `load` 함수 전에 다시 실행되지는 않는다는 점에 유의하세요. 따라서 예를 들어 `handle`에서 쿠키를 기반으로 `event.locals`를 채운다면, 액션에서 쿠키를 설정하거나 삭제할 때 `event.locals`도 함께 업데이트해야 합니다:

```js
/// file: src/hooks.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user: {
			name: string;
		} | null
	}
}

// @filename: global.d.ts
declare global {
	function getUser(sessionid: string | undefined): {
		name: string;
	};
}

export {};

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = await getUser(event.cookies.get('sessionid'));
	return resolve(event);
}
```

```js
/// file: src/routes/account/+page.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user: {
			name: string;
		} | null
	}
}

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return {
		user: event.locals.user
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('sessionid');
		event.locals.user = null;
	}
};
```

## 점진적 향상 <!-- Progressive enhancement -->

앞 섹션에서 우리는 [클라이언트 사이드 JavaScript 없이도 동작하는](https://kryogenix.org/code/browser/everyonehasjs.html) `/login` 액션을 만들었습니다. `fetch`는 어디에도 없습니다. 아주 좋지만, JavaScript를 *사용할 수 있을 때*는 폼 상호작용을 점진적으로 향상시켜 더 나은 사용자 경험을 제공할 수 있습니다.

### use:enhance

폼을 점진적으로 향상시키는 가장 쉬운 방법은 `use:enhance` 액션을 추가하는 것입니다:

```svelte
/// file: src/routes/login/+page.svelte
<script>
	+++import { enhance } from '$app/forms';+++

	/** @type {import('./$types').PageProps} */
	let { form } = $props();
</script>

<form method="POST" +++use:enhance+++>
```

> [!NOTE] `use:enhance`는 `method="POST"`이고 `+page.server.js` 파일에 정의된 액션을 가리키는 폼에서만 사용할 수 있습니다. method를 지정하지 않은 폼의 기본값인 `method="GET"`에서는 동작하지 않습니다. `method="POST"`가 아닌 폼이나 `+server.js` 엔드포인트로 제출하는 폼에 `use:enhance`를 사용하려고 하면 오류가 발생합니다.

> [!NOTE] 네, `enhance` 액션과 `<form action>`이 둘 다 '액션'이라고 불리는 건 조금 헷갈립니다. 이 문서는 액션으로 가득하네요. 죄송합니다.

인수 없이 사용하면 `use:enhance`는 브라우저 기본 동작을 흉내 내되, 전체 페이지를 다시 불러오지 않습니다. 다음과 같이 동작합니다:

- 제출하는 페이지에 액션이 있다면, 현재 페이지를 다시 불러오는 것처럼 동작합니다. 성공하거나 유효하지 않은 응답을 받으면 `form` 속성, `page.form`, `page.status`를 업데이트합니다
- 액션이 다른 페이지에 있다면(예를 들어 `<form action="/somewhere/else" ..>`), 성공 _또는_ 유효하지 않은 응답을 받았을 때 액션의 URL로 이동하고, 기본 제출과 마찬가지로 그 페이지의 `form` 속성과 `page.status`를 채웁니다. 새 히스토리 항목이 추가됩니다
- `<form>` 요소를 초기화합니다
- 성공 응답을 받으면 `refreshAll`로 모든 데이터를 새로 고칩니다
- 리디렉션 응답을 받으면 `goto`를 호출합니다
- 예기치 않은 오류가 발생하면 가장 가까운 `+error` 바운더리를 렌더링합니다. 액션이 다른 페이지에 있다면 _액션의_ 라우트에서 가장 가까운 바운더리입니다
- 적절한 요소로 [포커스를 초기화](accessibility#Focus-management)합니다

> [!NOTE] URL과 관련해 알아 둘 만한 세부 사항이 두 가지 있습니다:
>
> 제출이 도착하는 곳은 `result.location`입니다. 이는 폼의 `action`에서 `?/actionName` 매개변수를 뺀 것인데, 액션이 실행되고 나면 그 매개변수는 할 일을 다 했기 때문입니다. `action="/login?/do-login"`은 `/login`에 도착하고, 다른 쿼리 매개변수는 유지되므로 `action="/login?redirectTo=/dashboard&/do-login"`은 `/login?redirectTo=/dashboard`에 도착합니다. 도착한 페이지의 `load` 함수는 `url.search`를 통해 그 URL을 보게 됩니다.
>
> 알아 둘 만한 결과는 두 가지입니다:
>
> - _상대 경로_ 액션은 URL 해석 과정의 부수 효과로 쿼리 문자열 전체를 대체합니다. `/items?page=2`에서 `action="?/delete"`는 `/items?/delete`로 해석되므로, 향상된 제출과 기본 제출 모두 `page=2`를 잃게 됩니다. 이를 유지하려면 `action="?page=2&/delete"`로 작성하세요.
> - JavaScript가 없으면 브라우저는 아무것도 제거할 수 없으므로, 향상되지 않은 제출은 액션 URL 그대로(`/login?/do-login`)에 머무릅니다. 이 URL을 다시 불러오면 일반 `GET` 요청이 되어 액션을 다시 실행하지 않고 페이지를 평소처럼 렌더링하므로, 차이는 겉모습뿐입니다. 하지만 JavaScript를 사용할 수 있는지에 따라 `load` 함수가 보는 `url.search`가 달라질 수 있습니다.

다른 페이지로 제출할 때 이동하지 않기를 원한다면(레이아웃에 있으면서 다른 페이지의 액션으로 제출하는 로그인이나 뉴스레터 위젯에서 흔히 필요합니다), `update`에 `navigate: false`를 전달하세요. 그러면 SvelteKit 2와 같은 동작을 얻을 수 있습니다:

```svelte
<form
	method="POST"
	action="/other/page?/subscribe"
	use:enhance={() => async ({ update }) => {
		await update({ navigate: false });
	}}
>
```

결과는 현재 페이지에 적용됩니다. `form`, `page.form`, `page.status`가 업데이트되고, 오류 결과는 현재 라우트에서 가장 가까운 `+error` 바운더리를 렌더링합니다.

### use:enhance 커스터마이징 <!-- Customising use:enhance -->

동작을 커스터마이징하려면 폼이 제출되기 직전에 실행되고, (선택적으로) `ActionResult`와 함께 실행될 콜백을 반환하는 `SubmitFunction`을 제공하면 됩니다.

```svelte
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}}
>
```

이 함수들을 사용해 로딩 UI를 보여 주거나 숨기는 등의 일을 할 수 있습니다.

콜백을 반환하면 제출 후의 기본 동작을 덮어쓰게 됩니다. 기본 동작을 되살리려면 `navigate`, `refreshAll`, `reset` 매개변수를 받는 `update`를 호출하거나, 결과에 `applyAction`을 사용하세요:

```svelte
/// file: src/routes/login/+page.svelte
<script>
	import { enhance, +++applyAction+++ } from '$app/forms';

	/** @type {import('./$types').PageProps} */
	let { form } = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			// `result` is an `ActionResult` object
+++			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}+++
		};
	}}
>
```

> [!NOTE] `update`는 다음 옵션을 받습니다:
>
> - 제출이 성공한 뒤 `<form>` 값을 초기화하지 않으려면 `reset: false`
> - `refreshAll`은 제출 후 모든 데이터를 새로 고칠지 결정합니다. 기본값은 성공 결과에서는 `true`, 실패 결과에서는 `false`입니다. 제출로 다른 페이지로 이동하는 경우, 이 값을 `false`로 설정해도 도착 페이지 자체의 `load` 함수가 실행되는 것을 막지는 _않습니다_. 공유 레이아웃 데이터를 재사용할 수 있게 해 줄 뿐입니다. `invalidateAll`은 `refreshAll`의 지원 중단(deprecated)된 별칭입니다
> - `navigate: false`는 리디렉션이 아닌 결과를 `result.location`으로 이동하는 대신 현재 페이지에 적용합니다. 리디렉션은 항상 따라갑니다

`applyAction(result)`의 동작은 `result.type`에 따라 달라집니다:

- `success`, `failure` — `page.status`를 `result.status`로 설정하고, `form`과 `page.form`을 `result.data`로 업데이트합니다
- `redirect` — `goto(result.location, { refreshAll: true })`를 호출합니다
- `error` — 현재 라우트에서 가장 가까운 `+error` 바운더리를 `result.error`와 함께 렌더링합니다

어느 경우든 [포커스가 초기화됩니다](accessibility#Focus-management). `applyAction`은 리디렉션이 아닌 결과의 `location`으로 이동하지도, 데이터를 새로 고치지도 않습니다. 다른 페이지로 이동할 때 폼 데이터와 상태를 넘겨주는 것까지 포함해 향상된 기본 동작 전체를 얻으려면 `update`를 사용하세요. 향상 기능을 직접 구현할 때는 `result.location`을 확인하고 상황에 맞게 [`goto`]($app-navigation#goto)나 [`refreshAll`]($app-navigation#refreshAll)을 사용하세요.

### 사용자 정의 이벤트 리스너 <!-- Custom event listener -->

`use:enhance` 없이 `<form>`에 일반 이벤트 리스너를 달아 점진적 향상을 직접 구현할 수도 있습니다:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<script>
	import { refreshAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	/** @type {import('./$types').PageProps} */
	let { form } = $props();

	/** @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget, event.submitter);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		/** @type {import('$app/forms').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type !== 'redirect' && result.location !== undefined) {
			if (result.location === location.pathname + location.search) {
				if (result.type === 'success') await refreshAll();
			} else {
				await goto(result.location, { refreshAll: result.type === 'success' });
			}
		}

		await applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
	<!-- content -->
</form>
```

응답을 더 처리하기 전에 `$app/forms`의 해당 메서드로 응답을 `deserialize`해야 한다는 점에 유의하세요. 폼 액션은 `load` 함수와 마찬가지로 `Date`나 `BigInt` 객체 반환도 지원하므로 `JSON.parse()`로는 충분하지 않습니다.

`+page.server.js` 옆에 `+server.js`가 있다면, `fetch` 요청은 기본적으로 `+server.js`로 라우팅됩니다. 대신 `+page.server.js`의 액션으로 `POST`하려면 사용자 정의 헤더 `x-sveltekit-action`을 사용하세요:

```js
// @errors: 2532 2304
const response = await fetch(this.action, {
	method: 'POST',
	body: data,
+++	headers: {
		'x-sveltekit-action': 'true'
	}+++
});
```

## 대안 <!-- Alternatives -->

폼 액션은 점진적으로 향상시킬 수 있으므로 서버에 데이터를 보내는 데 선호되는 방법이지만, [`+server.js`](routing#server) 파일을 사용해 (예를 들어) JSON API를 노출할 수도 있습니다. 그런 상호작용은 다음과 같은 모습일 수 있습니다:

```svelte
<!--- file: src/routes/send-message/+page.svelte --->
<script>
	function rerun() {
		fetch('/api/ci', {
			method: 'POST'
		});
	}
</script>

<button onclick={rerun}>Rerun CI</button>
```

```js
// @errors: 2355 1360 2322
/// file: src/routes/api/ci/+server.js
/** @type {import('./$types').RequestHandler} */
export function POST() {
	// do something
}
```

## GET과 POST <!-- GET vs POST -->

앞에서 보았듯이 폼 액션을 호출하려면 `method="POST"`를 사용해야 합니다.

어떤 폼은 서버에 데이터를 `POST`할 필요가 없습니다. 검색 입력이 그 예입니다. 이런 폼에는 `method="GET"`(또는 같은 의미로, `method`를 아예 생략)을 사용할 수 있으며, SvelteKit은 이런 폼을 `<a>` 요소처럼 취급해 전체 페이지 내비게이션 대신 클라이언트 사이드 라우터를 사용합니다:

```html
<form action="/search">
	<label>
		Search
		<input name="q">
	</label>
</form>
```

이 폼을 제출하면 `/search?q=...`로 이동해 load 함수를 호출하지만 액션은 호출하지 않습니다. `<a>` 요소와 마찬가지로 `<form>`에 [`data-sveltekit-reload`](link-options#data-sveltekit-reload), [`data-sveltekit-replacestate`](link-options#data-sveltekit-replacestate), [`data-sveltekit-reset`](link-options#data-sveltekit-reset) 속성을 설정해 라우터의 동작을 제어할 수 있습니다.

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 폼](/tutorial/kit/the-form-element)
