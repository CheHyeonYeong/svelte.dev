---
title: 데이터 불러오기
tags: load
---

[`+page.svelte`](routing#page-page.svelte) 컴포넌트(와 이를 감싸는 [`+layout.svelte`](routing#layout-layout.svelte) 컴포넌트)를 렌더링하려면 먼저 데이터를 가져와야 하는 경우가 많습니다. 이 작업은 `load` 함수를 정의해서 합니다.

## 페이지 데이터 <!-- Page data -->

`+page.svelte` 파일 옆에 `load` 함수를 내보내는 `+page.js`를 둘 수 있으며, 이 함수의 반환값은 `data` prop을 통해 페이지에서 사용할 수 있습니다:

```js
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

> [!LEGACY]
> 2.16.0 이전 버전에서는 페이지와 레이아웃의 prop 타입을 각각 지정해야 했습니다:
> ```js
> /// file: +page.svelte
> /** @type {{ data: import('./$types').PageData }} */
> let { data } = $props();
> ```
>
> Svelte 4에서는 대신 `export let data`를 사용합니다.

생성된 `$types` 모듈 덕분에 완전한 타입 안전성을 얻을 수 있습니다.

`+page.js` 파일의 `load` 함수는 서버와 브라우저 양쪽에서 실행됩니다(`export const ssr = false`와 함께 쓰면 [브라우저에서만 실행됩니다](page-options#ssr)). `load` 함수가 *항상* 서버에서 실행되어야 한다면(예를 들어 비공개 환경 변수를 사용하거나 데이터베이스에 접근하기 때문에) 대신 `+page.server.js`에 두면 됩니다.

서버에서만 실행되면서 데이터베이스에서 데이터를 가져오는, 좀 더 현실적인 블로그 글 `load` 함수는 다음과 같을 것입니다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '#lib/server/database.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

타입이 `PageLoad`에서 `PageServerLoad`로 바뀐 것에 주목하세요. 서버 `load` 함수는 추가 인자에 접근할 수 있기 때문입니다. 언제 `+page.js`를 쓰고 언제 `+page.server.js`를 써야 하는지는 [유니버설 vs 서버](load#Universal-vs-server)를 보세요.

## 레이아웃 데이터 <!-- Layout data -->

`+layout.svelte` 파일도 `+layout.js`나 `+layout.server.js`를 통해 데이터를 불러올 수 있습니다.

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '#lib/server/database.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+layout.svelte --->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<main>
	<!-- +page.svelte is `@render`ed here -->
	{@render children()}
</main>

<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					{post.title}
				</a>
			</li>
		{/each}
	</ul>
</aside>
```

> [!LEGACY]
> `LayoutProps`는 2.16.0에서 추가되었습니다. 이전 버전에서는 속성의 타입을 각각 지정해야 했습니다:
> ```js
> /// file: +layout.svelte
> /** @type {{ data: import('./$types').LayoutData, children: Snippet }} */
> let { data, children } = $props();
> ```

레이아웃 `load` 함수가 반환한 데이터는 그 레이아웃이 '소유한' 레이아웃 자신뿐 아니라 하위 `+layout.svelte` 컴포넌트와 `+page.svelte` 컴포넌트에서도 사용할 수 있습니다.

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	+++import { page } from '$app/state';+++

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

+++	// we can access `data.posts` because it's returned from
	// the parent layout `load` function
	let index = $derived(data.posts.findIndex(post => post.slug === page.params.slug));
	let next = $derived(data.posts[index + 1]);+++
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

+++{#if next}
	<p>Next post: <a href="/blog/{next.slug}">{next.title}</a></p>
{/if}+++
```

> [!NOTE] 여러 `load` 함수가 같은 키로 데이터를 반환하면 마지막 것이 '이깁니다'. 레이아웃 `load`가 `{ a: 1, b: 2 }`를 반환하고 페이지 `load`가 `{ b: 3, c: 4 }`를 반환하면 결과는 `{ a: 1, b: 3, c: 4 }`가 됩니다.

## page.data

`+page.svelte` 컴포넌트와 그 위의 각 `+layout.svelte` 컴포넌트는 자신의 데이터와 부모의 모든 데이터에 접근할 수 있습니다.

때로는 그 반대가 필요할 수도 있습니다. 부모 레이아웃이 페이지 데이터나 하위 레이아웃의 데이터에 접근해야 하는 경우입니다. 예를 들어 루트 레이아웃에서 `+page.js`나 `+page.server.js`의 `load` 함수가 반환한 `title` 속성에 접근하고 싶을 수 있습니다. 이럴 때는 `page.data`를 사용합니다:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

`page.data`의 타입 정보는 `App.PageData`가 제공합니다.

## 유니버설 vs 서버 <!-- Universal vs server -->

앞서 본 것처럼 `load` 함수에는 두 종류가 있습니다:

* `+page.js`와 `+layout.js` 파일은 서버와 브라우저 양쪽에서 실행되는 *유니버설* `load` 함수를 내보냅니다
* `+page.server.js`와 `+layout.server.js` 파일은 서버에서만 실행되는 *서버* `load` 함수를 내보냅니다

개념적으로는 같은 것이지만, 알아 두어야 할 중요한 차이가 몇 가지 있습니다.

### 어떤 load 함수가 언제 실행되나요? <!-- When does which load function run? -->

서버 `load` 함수는 *항상* 서버에서 실행됩니다.

기본적으로 유니버설 `load` 함수는 사용자가 페이지를 처음 방문할 때 SSR 중에 서버에서 실행됩니다. 그다음 하이드레이션 중에 다시 실행되는데, 이때 [fetch 요청](#Making-fetch-requests)의 응답은 재사용합니다. 이후의 모든 유니버설 `load` 함수 호출은 브라우저에서 일어납니다. 이 동작은 [페이지 옵션](page-options)으로 바꿀 수 있습니다. [서버 사이드 렌더링](page-options#ssr)을 끄면 SPA가 되고, 유니버설 `load` 함수는 *항상* 클라이언트에서 실행됩니다.

라우트에 유니버설 `load` 함수와 서버 `load` 함수가 모두 있으면 서버 `load`가 먼저 실행됩니다.

`load` 함수는 런타임에 호출됩니다. 단, 페이지를 [프리렌더](page-options#prerender)하는 경우에는 빌드 시점에 호출됩니다.

### 입력 <!-- Input -->

유니버설 `load` 함수와 서버 `load` 함수 모두 요청을 설명하는 속성(`params`, `route`, `url`)과 여러 함수(`fetch`, `setHeaders`, `parent`, `depends`, `untrack`)에 접근할 수 있습니다. 이에 대해서는 이어지는 섹션에서 설명합니다.

서버 `load` 함수는 `ServerLoadEvent`와 함께 호출되며, 이 객체는 `RequestEvent`로부터 `cookies`, `getClientAddress`, `locals`, `platform`, `request`를 상속합니다.

유니버설 `load` 함수는 `data` 속성이 있는 `LoadEvent`와 함께 호출됩니다. `+page.js`와 `+page.server.js`(또는 `+layout.js`와 `+layout.server.js`) 양쪽에 `load` 함수가 있다면, 서버 `load` 함수의 반환값이 유니버설 `load` 함수 인자의 `data` 속성이 됩니다.

### 출력 <!-- Output -->

유니버설 `load` 함수는 사용자 정의 클래스나 컴포넌트 생성자 같은 것을 포함해 어떤 값이든 담은 객체를 반환할 수 있습니다.

서버 `load` 함수는 네트워크로 전송할 수 있도록 [devalue](https://github.com/rich-harris/devalue)로 직렬화할 수 있는 데이터를 반환해야 합니다. JSON으로 표현할 수 있는 모든 것에 더해 `BigInt`, `Date`, `Map`, `Set`, `RegExp`, 그리고 반복/순환 참조까지 가능합니다. 데이터에 [프로미스](#Streaming-with-promises)를 포함할 수도 있으며, 이 경우 브라우저로 스트리밍됩니다. 사용자 정의 타입을 직렬화/역직렬화해야 한다면 [transport 훅](hooks#transport)을 사용하세요.

### 언제 무엇을 쓸까 <!-- When to use which -->

서버 `load` 함수는 데이터베이스나 파일 시스템에서 데이터에 직접 접근해야 하거나 비공개 환경 변수를 사용해야 할 때 편리합니다.

유니버설 `load` 함수는 비공개 자격 증명 없이 외부 API에서 데이터를 `fetch`해야 할 때 유용합니다. SvelteKit이 서버를 거치지 않고 API에서 직접 데이터를 가져올 수 있기 때문입니다. 또한 Svelte 컴포넌트 생성자처럼 직렬화할 수 없는 것을 반환해야 할 때도 유용합니다.

드물게 둘을 함께 써야 할 때도 있습니다. 예를 들어 서버의 데이터로 초기화한 사용자 정의 클래스의 인스턴스를 반환해야 할 수 있습니다. 둘을 함께 쓰면 서버 `load`의 반환값은 페이지로 바로 전달되지 *않고*, 유니버설 `load` 함수에 (`data` 속성으로) 전달됩니다:

```js
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		serverMessage: 'hello from server load function'
	};
}
```

```js
/// file: src/routes/+page.js
// @errors: 18047
/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal load function'
	};
}
```

## URL 데이터 사용하기 <!-- Using URL data -->

`load` 함수는 어떤 식으로든 URL에 의존하는 경우가 많습니다. 이를 위해 `load` 함수에는 `url`, `route`, `params`가 제공됩니다.

### url

[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)의 인스턴스로, `origin`, `hostname`, `pathname`, `searchParams`(파싱된 쿼리 문자열을 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 객체로 담고 있음) 같은 속성이 있습니다. `url.hash`는 서버에서 사용할 수 없으므로 `load` 중에는 접근할 수 없습니다.

> [!NOTE] 일부 환경에서는 서버 사이드 렌더링 중에 이 값을 요청 헤더에서 추출합니다. 예를 들어 [adapter-node](adapter-node)를 사용한다면 URL이 올바르도록 어댑터를 설정해야 할 수도 있습니다.

### route

`src/routes`를 기준으로 한 현재 라우트 디렉터리의 이름이 들어 있습니다:

```js
/// file: src/routes/a/[b]/[...c]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ route }) {
	console.log(route.id); // '/a/[b]/[...c]'
}
```

### params

`params`는 `url.pathname`과 `route.id`로부터 만들어집니다.

`route.id`가 `/a/[b]/[...c]`이고 `url.pathname`이 `/a/x/y/z`라면 `params` 객체는 다음과 같습니다:

```json
{
	"b": "x",
	"c": "y/z"
}
```

## fetch 요청 보내기 <!-- Making fetch requests -->

외부 API나 `+server.js` 핸들러에서 데이터를 가져오려면 제공되는 `fetch` 함수를 사용할 수 있습니다. 이 함수는 [네이티브 `fetch` 웹 API](https://developer.mozilla.org/en-US/docs/Web/API/fetch)와 똑같이 동작하면서 몇 가지 기능이 추가되어 있습니다:

- 페이지 요청의 `cookie`와 `authorization` 헤더를 상속하므로, 서버에서 자격 증명을 포함한 요청을 보낼 수 있습니다.
- 서버에서 상대 경로로 요청할 수 있습니다(보통 서버 환경에서 `fetch`를 쓰려면 origin이 포함된 URL이 필요합니다).
- 서버에서 실행될 때 내부 요청(예: `+server.js` 라우트로 보내는 요청)은 HTTP 호출의 오버헤드 없이 핸들러 함수로 바로 갑니다.
- 서버 사이드 렌더링 중에는 `Response` 객체의 `text`, `json`, `arrayBuffer` 메서드에 개입해 응답을 가로채고 렌더링된 HTML에 인라인으로 넣습니다. [`filterSerializedResponseHeaders`](hooks#handle)로 명시적으로 포함하지 않는 한 헤더는 직렬화되지 *않는다는* 점에 유의하세요.
- 하이드레이션 중에는 응답을 HTML에서 읽으므로 일관성이 보장되고 추가 네트워크 요청도 생기지 않습니다. `load`의 `fetch` 대신 브라우저의 `fetch`를 썼을 때 브라우저 콘솔에 경고가 표시되었다면 이 때문입니다.

```js
/// file: src/routes/items/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	const item = await res.json();

	return { item };
}
```

## 쿠키 <!-- Cookies -->

서버 `load` 함수는 아래처럼 [`cookies`](@sveltejs-kit#Cookies)를 가져올 수 있습니다. 쿠키를 설정할 때 SvelteKit은 보안과 개발자 경험을 개선하기 위해 [API 문서](@sveltejs-kit#Cookies)에 설명된 대로 `httpOnly`, `secure`, `path`의 기본값을 제공합니다.

```js
/// file: src/routes/+layout.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getUser(sessionid: string | undefined): Promise<{ name: string, avatar: string }>
}

// @filename: index.js
// ---cut---
import * as db from '#lib/server/database.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');

	return {
		user: await db.getUser(sessionid)
	};
}
```

쿠키는 대상 호스트가 SvelteKit 애플리케이션과 같거나 그보다 더 구체적인 서브도메인일 때만 제공되는 `fetch` 함수를 통해 전달됩니다.

예를 들어 SvelteKit이 my.domain.com을 제공하고 있다면:
- domain.com은 쿠키를 받지 않습니다
- my.domain.com은 쿠키를 받습니다
- api.domain.com은 쿠키를 받지 않습니다
- sub.my.domain.com은 쿠키를 받습니다

`credentials: 'include'`를 설정해도 다른 쿠키는 전달되지 않습니다. SvelteKit은 어떤 쿠키가 어느 도메인에 속하는지 알 수 없으므로(브라우저가 이 정보를 넘겨주지 않습니다) 어떤 쿠키든 전달하는 것이 안전하지 않기 때문입니다. 이 문제를 우회하려면 [handleFetch 훅](hooks#handleFetch)을 사용하세요.

## 헤더 <!-- Headers -->

서버 `load` 함수와 유니버설 `load` 함수 모두 `setHeaders` 함수에 접근할 수 있으며, 이 함수는 서버에서 실행될 때 응답 헤더를 설정합니다. (브라우저에서 실행될 때 `setHeaders`는 아무 효과가 없습니다.) 예를 들어 페이지를 캐시하고 싶을 때 유용합니다:

```js
// @errors: 2322 1360
/// file: src/routes/products/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/products.json`;
	const response = await fetch(url);

	// Headers are only set during SSR, caching the page's HTML
	// for the same length of time as the underlying data.
	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

같은 헤더를 여러 번 설정하면(서로 다른 `load` 함수에서라도) 에러가 발생합니다. `setHeaders` 함수로 특정 헤더는 한 번만 설정할 수 있습니다. `setHeaders`로 `set-cookie` 헤더를 추가할 수는 없으며, 대신 `cookies.set(name, value, options)`를 사용하세요.

## 부모 데이터 사용하기 <!-- Using parent data -->

`load` 함수에서 부모 `load` 함수의 데이터에 접근하면 유용할 때가 있습니다. 이는 `await parent()`로 할 수 있습니다:

```js
/// file: src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return { a: 1 };
}
```

```js
/// file: src/routes/abc/+layout.js
/** @type {import('./$types').LayoutLoad} */
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}
```

```js
/// file: src/routes/abc/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
```

```svelte
<!--- file: src/routes/abc/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<!-- renders `1 + 2 = 3` -->
<p>{data.a} + {data.b} = {data.c}</p>
```

> [!NOTE] `+page.js`의 `load` 함수는 바로 위의 부모뿐 아니라 두 레이아웃 `load` 함수의 데이터가 합쳐진 결과를 받는다는 점에 주목하세요.

`+page.server.js`와 `+layout.server.js` 안에서 `parent`는 부모 `+layout.server.js` 파일의 데이터를 반환합니다.

`+page.js`나 `+layout.js`에서는 부모 `+layout.js` 파일의 데이터를 반환합니다. 다만 `+layout.js`가 없으면 `({ data }) => data` 함수로 취급하므로, `+layout.js` 파일에 '가려지지' 않은 부모 `+layout.server.js` 파일의 데이터도 반환합니다

`await parent()`를 쓸 때는 워터폴이 생기지 않도록 주의하세요. 예를 들어 여기서 `getData(params)`는 `parent()` 호출 결과에 의존하지 않으므로, 렌더링이 늦어지지 않도록 먼저 호출해야 합니다.

```js
/// file: +page.js
// @filename: ambient.d.ts
declare function getData(params: Record<string, string>): Promise<{ meta: any }>

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	---const parentData = await parent();---
	const data = await getData(params);
	+++const parentData = await parent();+++

	return {
		...data,
		meta: { ...parentData.meta, ...data.meta }
	};
}
```

## 에러 <!-- Errors -->

`load` 중에 에러가 발생하면 가장 가까운 [`+error.svelte`](routing#error)가 렌더링됩니다. [앱 에러](errors#App-errors)의 경우 `@sveltejs/kit`의 `error` 헬퍼로 HTTP 상태 코드와 선택적 메시지를 지정하세요:

```js
/// file: src/routes/admin/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user?: {
			name: string;
			isAdmin: boolean;
		}
	}
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}

	if (!locals.user.isAdmin) {
		error(403, 'not an admin');
	}
}
```

`error(...)`를 호출하면 예외가 발생하므로, 헬퍼 함수 안에서도 쉽게 실행을 멈출 수 있습니다.

모든 에러는 [`handleError`](hooks#handleError) 훅으로 전달됩니다. [알 수 없는 에러](errors#Unknown-errors)는 훅이 달리 정하지 않는 한 500 Internal Error로 취급됩니다.

> [!NOTE] [SvelteKit 1.x에서는](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) 에러를 직접 `throw`해야 했습니다

## 리디렉션 <!-- Redirects -->

사용자를 리디렉션하려면 `@sveltejs/kit`의 `redirect` 헬퍼로 `3xx` 상태 코드와 함께 이동할 위치를 지정하세요. `error(...)`와 마찬가지로 `redirect(...)`를 호출하면 예외가 발생하므로, 헬퍼 함수 안에서도 쉽게 실행을 멈출 수 있습니다.

```js
/// file: src/routes/user/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user?: {
			name: string;
		}
	}
}

// @filename: index.js
// ---cut---
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

> [!NOTE] `try {...}` 블록 안에서는 `redirect()`를 사용하지 마세요. 리디렉션이 곧바로 catch 문을 실행시킵니다.

브라우저에서는 `load` 함수 밖에서도 [`$app.navigation`]($app-navigation)의 [`goto`]($app-navigation#goto)로 프로그래밍 방식으로 이동할 수 있습니다.

> [!NOTE] [SvelteKit 1.x에서는](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) `redirect`를 직접 `throw`해야 했습니다

## 프로미스로 스트리밍하기 <!-- Streaming with promises -->

서버 `load`를 사용하면 프로미스가 이행되는 대로 브라우저로 스트리밍됩니다. 느리지만 꼭 필요하지는 않은 데이터가 있을 때 유용합니다. 모든 데이터가 준비되기 전에 페이지 렌더링을 시작할 수 있기 때문입니다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare global {
	const loadPost: (slug: string) => Promise<{ title: string, content: string }>;
	const loadComments: (slug: string) => Promise<{ content: string }>;
}

export {};

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		// make sure the `await` happens at the end, otherwise we
		// can't start loading comments until we've loaded the post
		comments: loadComments(params.slug),
		post: await loadPost(params.slug)
	};
}
```

예를 들어 스켈레톤 로딩 상태를 만들 때 유용합니다:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

{#await data.comments}
	Loading comments...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{:catch error}
	<p>error loading comments: {error.message}</p>
{/await}
```

데이터를 스트리밍할 때는 프로미스 거부(rejection)를 올바르게 처리하도록 주의하세요. 구체적으로는, 지연 로드되는 프로미스가 렌더링 시작 전에(렌더링이 시작되면 에러가 잡힙니다) 실패하고 그 에러를 어떤 식으로도 처리하지 않으면 서버가 "unhandled promise rejection" 에러로 중단될 수 있습니다. `load` 함수에서 SvelteKit의 `fetch`를 직접 사용하면 SvelteKit이 이 경우를 대신 처리해 줍니다. 다른 프로미스라면 아무것도 하지 않는 `catch`를 붙여 처리된 것으로 표시하면 충분합니다.

```js
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export function load({ fetch }) {
	const ok_manual = Promise.reject();
	ok_manual.catch(() => {});

	return {
		ok_manual,
		ok_fetch: fetch('/fetch/that/could/fail'),
		dangerous_unhandled: Promise.reject()
	};
}
```

> [!NOTE] AWS Lambda나 Firebase처럼 스트리밍을 지원하지 않는 플랫폼에서는 응답이 버퍼링됩니다. 즉, 모든 프로미스가 이행된 뒤에야 페이지가 렌더링됩니다. 프록시(예: NGINX)를 사용한다면 프록시된 서버의 응답을 버퍼링하지 않는지 확인하세요.

> [!NOTE] 데이터 스트리밍은 JavaScript가 활성화되어 있을 때만 동작합니다. 페이지가 서버에서 렌더링된다면 유니버설 `load` 함수에서 프로미스를 반환하지 않는 것이 좋습니다. 이런 프로미스는 스트리밍되지 *않고*, 브라우저에서 함수가 다시 실행될 때 프로미스가 새로 만들어집니다.

> [!NOTE] 응답의 헤더와 상태 코드는 응답 스트리밍이 시작된 뒤에는 바꿀 수 없으므로, 스트리밍되는 프로미스 안에서는 `setHeaders`를 호출하거나 리디렉션을 발생시킬 수 없습니다.

> [!NOTE] [SvelteKit 1.x에서는](migrating-to-sveltekit-2#Top-level-promises-are-no-longer-awaited) 최상위 프로미스를 자동으로 기다렸고, 중첩된 프로미스만 스트리밍되었습니다.

## 병렬 로딩 <!-- Parallel loading -->

페이지를 렌더링할 때(또는 페이지로 이동할 때) SvelteKit은 모든 `load` 함수를 동시에 실행해 요청 워터폴을 피합니다. 클라이언트 사이드 내비게이션 중에는 여러 서버 `load` 함수를 호출한 결과를 하나의 응답으로 묶습니다. 모든 `load` 함수가 반환되면 페이지가 렌더링됩니다.

## load 함수 다시 실행하기 <!-- Rerunning load functions -->

SvelteKit은 내비게이션 중에 `load` 함수를 불필요하게 다시 실행하지 않도록 각 `load` 함수의 의존성을 추적합니다.

예를 들어 다음과 같은 `load` 함수 한 쌍이 있다면...

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '#lib/server/database.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '#lib/server/database.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

...`/blog/trying-the-raw-meat-diet`에서 `/blog/i-regret-my-choices`로 이동할 때 `params.slug`가 바뀌었으므로 `+page.server.js`의 함수는 다시 실행됩니다. `+layout.server.js`의 함수는 데이터가 여전히 유효하므로 다시 실행되지 않습니다. 즉, `db.getPostSummaries()`를 두 번 호출하지 않습니다.

`await parent()`를 호출하는 `load` 함수는 부모 `load` 함수가 다시 실행될 때도 다시 실행됩니다.

의존성 추적은 `load` 함수가 반환된 *뒤에는* 적용되지 않습니다. 예를 들어 중첩된 [프로미스](#Streaming-with-promises) 안에서 `params.x`에 접근하면, `params.x`가 바뀌어도 함수가 다시 실행되지 않습니다. (걱정하지 마세요. 실수로 이렇게 하면 개발 중에 경고가 표시됩니다.) 대신 `load` 함수의 본문에서 매개변수에 접근하세요.

검색 매개변수는 URL의 나머지 부분과 따로 추적됩니다. 예를 들어 `load` 함수 안에서 `event.url.searchParams.get("x")`에 접근하면, `?x=1`에서 `?x=2`로 이동할 때는 그 `load` 함수가 다시 실행되지만 `?x=1&y=1`에서 `?x=1&y=2`로 이동할 때는 다시 실행되지 않습니다.

### 의존성 추적 제외하기 <!-- Untracking dependencies -->

드물게 의존성 추적 메커니즘에서 무언가를 제외하고 싶을 수 있습니다. 이때는 제공되는 `untrack` 함수를 사용하면 됩니다:

```js
/// file: src/routes/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ untrack, url }) {
	// Untrack url.pathname so that path changes don't trigger a rerun
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

### 수동 무효화 <!-- Manual invalidation -->

현재 페이지에 적용되는 `load` 함수는 [`invalidate(url)`]($app-navigation#invalidate)과 [`refreshAll()`]($app-navigation#refreshAll)로 직접 다시 실행할 수도 있습니다. `invalidate(url)`은 `url`에 의존하는 모든 `load` 함수를 다시 실행하고, `refreshAll()`은 모든 `load` 함수와 활성화된 모든 쿼리를 다시 실행합니다. 서버 load 함수는 비밀 정보가 클라이언트로 새어 나가지 않도록, fetch한 `url`에 자동으로 의존하는 일이 절대 없습니다.

> [!NOTE] `refreshAll`은 지원 중단된 이전 버전인 `invalidateAll`과 달리 `page.state`를 초기화하지 *않습니다*.

`load` 함수가 `fetch(url)`이나 `depends(url)`을 호출하면 그 함수는 `url`에 의존합니다. `url`은 `[a-z]:`로 시작하는 사용자 정의 식별자일 수도 있습니다:

```js
/// file: src/routes/random-number/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
	// load reruns when `invalidate('https://api.example.com/random-number')` is called...
	const response = await fetch('https://api.example.com/random-number');

	// ...or when `invalidate('app:random')` is called
	depends('app:random');

	return {
		number: await response.json()
	};
}
```

```svelte
<!--- file: src/routes/random-number/+page.svelte --->
<script>
	import { invalidate, refreshAll } from '$app/navigation';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	function rerunLoadFunction() {
		// any of these will cause the `load` function to rerun
		invalidate('app:random');
		invalidate('https://api.example.com/random-number');
		invalidate(url => url.href.includes('random-number'));
		refreshAll();
	}
</script>

<p>random number: {data.number}</p>
<button onclick={rerunLoadFunction}>Update random number</button>
```

### load 함수는 언제 다시 실행되나요? <!-- When do load functions rerun? -->

정리하면 `load` 함수는 다음과 같은 상황에서 다시 실행됩니다:

- 값이 바뀐 `params`의 속성을 참조하는 경우
- 값이 바뀐 `url`의 속성(`url.pathname`이나 `url.search` 등)을 참조하는 경우. `request.url`의 속성은 추적되지 *않습니다*
- `url.searchParams.get(...)`, `url.searchParams.getAll(...)`, `url.searchParams.has(...)`를 호출했고 해당 매개변수가 바뀐 경우. `url.searchParams`의 다른 속성에 접근하는 것은 `url.search`에 접근하는 것과 같은 효과를 냅니다.
- `await parent()`를 호출하고 부모 `load` 함수가 다시 실행된 경우
- 하위 서버 `load` 함수가 `await parent()`를 호출하면서 다시 실행되고 있고, 부모도 서버 `load` 함수인 경우. `await parent()`를 호출하는 유니버설 `load` 함수는 대신 부모의 기존 데이터를 재사용합니다
- [`fetch`](#Making-fetch-requests)(유니버설 load만 해당)나 [`depends`](@sveltejs-kit#LoadEvent)로 특정 URL에 대한 의존성을 선언했고, 그 URL이 [`invalidate(url)`]($app-navigation#invalidate)로 무효화된 경우
- [`refreshAll()`]($app-navigation#refreshAll)로 활성화된 모든 `load` 함수를 강제로 다시 실행한 경우

`params`와 `url`은 `<a href="..">` 링크 클릭, [`<form>` 상호작용](form-actions#GET-vs-POST), [`goto`]($app-navigation#goto) 호출, [`redirect`](@sveltejs-kit#redirect)에 따라 바뀔 수 있습니다.

`load` 함수를 다시 실행하면 해당 `+layout.svelte`나 `+page.svelte` 안의 `data` prop이 업데이트될 뿐, 컴포넌트가 다시 만들어지지는 *않습니다*. 따라서 내부 상태는 유지됩니다. 이를 원하지 않는다면 [`afterNavigate`]($app-navigation#afterNavigate) 콜백 안에서 초기화가 필요한 것을 초기화하거나, 컴포넌트를 [`{#key ...}`](../svelte/key) 블록으로 감싸세요.

## 인증에 미치는 영향 <!-- Implications for authentication -->

데이터 불러오기의 몇 가지 특징은 인증 검사에 중요한 영향을 미칩니다:
- 레이아웃 `load` 함수는 하위 라우트 사이의 클라이언트 사이드 내비게이션 중처럼 매 요청마다 실행되지는 않습니다. [(load 함수는 언제 다시 실행되나요?)](load#Rerunning-load-functions-When-do-load-functions-rerun)
- 레이아웃과 페이지의 `load` 함수는 `await parent()`를 호출하지 않는 한 동시에 실행됩니다. 레이아웃 `load`가 에러를 던져도 페이지 `load` 함수는 실행되지만, 클라이언트는 반환된 데이터를 받지 못합니다.

보호된 코드보다 인증 검사가 먼저 이루어지도록 보장하는 전략이 몇 가지 있습니다.

데이터 워터폴을 막고 레이아웃 `load` 캐시를 유지하려면:
- [훅](hooks)을 사용해 `load` 함수가 실행되기 전에 여러 라우트를 보호하세요
- 라우트별로 보호하려면 `+page.server.js`의 `load` 함수에서 직접 인증 가드를 사용하세요

`+layout.server.js`에 인증 가드를 두면 모든 하위 페이지가 보호된 코드보다 먼저 `await parent()`를 호출해야 합니다. 모든 하위 페이지가 `await parent()`가 반환하는 데이터에 의존하는 것이 아니라면 다른 방법이 성능 면에서 더 낫습니다.

## `getRequestEvent` 사용하기 <!-- Using `getRequestEvent` -->

서버 `load` 함수를 실행할 때, 인자로 함수에 전달되는 `event` 객체는 [`getRequestEvent`]($app-server#getRequestEvent)로도 가져올 수 있습니다. 덕분에 (인증 가드 같은) 공유 로직이 현재 요청에 대한 정보를 일일이 전달받지 않고도 접근할 수 있습니다.

예를 들어 사용자의 로그인을 요구하고, 로그인하지 않았다면 `/login`으로 리디렉션하는 함수가 있다고 해 봅시다:

```js
/// file: src/lib/server/auth.js
// @filename: ambient.d.ts
interface User {
	name: string;
}

declare namespace App {
	interface Locals {
		user?: User;
	}
}

// @filename: index.ts
// ---cut---
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	// assume `locals.user` is populated in `handle`
	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		const params = new URLSearchParams({ redirectTo });

		redirect(303, `/login?${params}`);
	}

	return locals.user;
}
```

이제 어떤 `load` 함수(또는 예를 들어 [폼 액션](form-actions))에서든 `requireLogin`을 호출해 사용자가 로그인했음을 보장할 수 있습니다:

```js
/// file: +page.server.js
// @filename: ambient.d.ts

declare module '#lib/server/auth.js' {
	interface User {
		name: string;
	}

	export function requireLogin(): User;
}

// @filename: index.ts
// ---cut---
import { requireLogin } from '#lib/server/auth.js';

export function load() {
	const user = requireLogin();

	// `user` is guaranteed to be a user object here, because otherwise
	// `requireLogin` would throw a redirect and we wouldn't get here
	return {
		message: `hello ${user.name}!`
	};
}
```

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 데이터 불러오기](/tutorial/kit/page-data)
- [튜토리얼: 에러와 리디렉션](/tutorial/kit/error-basics)
- [튜토리얼: 고급 로딩](/tutorial/kit/await-parent)
