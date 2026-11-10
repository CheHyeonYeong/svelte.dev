---
title: 훅
tags: hooks
---

'훅(hook)'은 직접 선언하는 앱 전역 함수로, SvelteKit이 특정 이벤트에 반응해 호출합니다. 이를 통해 프레임워크의 동작을 세밀하게 제어할 수 있습니다.

훅 파일은 세 가지가 있으며, 모두 선택 사항입니다:

- `src/hooks.server.js` — 앱의 서버 훅
- `src/hooks.client.js` — 앱의 클라이언트 훅
- `src/hooks.js` — 클라이언트와 서버 양쪽에서 실행되는 앱의 훅

이 모듈의 코드는 애플리케이션이 시작될 때 실행되므로, 데이터베이스 클라이언트 초기화 같은 작업에 유용합니다.

## handle

> [!NOTE] `src/hooks.server.js`에 추가할 수 있습니다

이 함수는 SvelteKit 서버가 [요청](web-standards#Fetch-APIs-Request)을 받을 때마다 실행되며(앱이 실행 중일 때든 [프리렌더링](page-options#prerender) 중이든), [응답](web-standards#Fetch-APIs-Response)을 결정합니다. 요청을 나타내는 `event` 객체와, 라우트를 렌더링하고 `Response`를 생성하는 `resolve`라는 함수를 받습니다. 이를 이용해 응답 헤더나 본문을 수정하거나, SvelteKit을 완전히 우회할 수도 있습니다(예를 들어 라우트를 프로그래밍 방식으로 구현할 때).

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
}
```

> [!NOTE] 정적 에셋에 대한 요청(이미 프리렌더링된 페이지 포함)은 SvelteKit이 처리하지 _않습니다_.

클라이언트가 시작한 원격 함수 요청의 일부로 `handle` 훅이 실행되는 경우, `route`, `params`, `url`은 SvelteKit이 원격 함수를 위해 만든 엔드포인트의 URL이 _아니라_ 원격 함수를 호출한 페이지에 해당합니다. 이 값들은 조작될 수 있는 요청의 일부이므로, 사용자가 특정 데이터에 접근할 권한이 있는지 판단하는 데 절대 사용하지 마세요. 또한 쿼리는 사용자가 이동할 때 다시 실행되지 않으므로(내비게이션 결과로 쿼리의 인자가 바뀌지 않는 한), 이 값들을 어떻게 사용할지 신중히 생각해야 합니다.

구현하지 않으면 기본값은 `({ event, resolve }) => resolve(event)`입니다.

프리렌더링하는 동안 SvelteKit은 페이지를 크롤링하며 링크를 찾고, 찾은 라우트를 각각 렌더링합니다. 라우트를 렌더링하면 `handle` 함수(그리고 `load` 같은 라우트의 다른 모든 의존성)가 호출됩니다. 이 단계에서 일부 코드가 실행되지 않게 하려면, 먼저 앱이 [`building`]($app-env#building) 중이 아닌지 확인하세요.

여러 개의 `handle` 함수를 정의하고 [`sequence`](@sveltejs-kit-hooks) 헬퍼 함수로 실행할 수 있습니다.

`resolve`는 응답을 렌더링하는 방식을 더 세밀하게 제어할 수 있는 두 번째 선택적 매개변수도 지원합니다. 이 매개변수는 다음 필드를 가질 수 있는 객체입니다:

- `transformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined>` — HTML에 사용자 정의 변환을 적용합니다. `done`이 true면 마지막 청크입니다. 청크가 올바른 형식의 HTML이라는 보장은 없지만(예를 들어 요소의 여는 태그는 있고 닫는 태그는 없을 수 있습니다), 항상 `%sveltekit.head%`나 레이아웃/페이지 컴포넌트 같은 합리적인 경계에서 나뉩니다.
- `filterSerializedResponseHeaders(name: string, value: string): boolean` — `load` 함수가 `fetch`로 리소스를 불러올 때 직렬화된 응답에 어떤 헤더를 포함할지 결정합니다. 기본적으로는 아무것도 포함하지 않습니다.
- `preload(input: { type: 'js' | 'css' | 'asset', path: string } | { type: 'font', path: string, filename: string }): boolean` — 어떤 파일을 프리로드할지 결정합니다. 파일은 `<head>` 태그에 추가된 `<link>` 태그로 프리로드되며, [`output.linkHeaderPreload`](@sveltejs-kit-vite#output)가 활성화되어 있으면 동적으로 렌더링되는 페이지는 대신 [`Link` 응답 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)를 사용합니다. 이 메서드는 코드 청크를 구성하면서 빌드 시점에 발견된 각 파일에 대해 호출됩니다. 예를 들어 `+page.svelte`에 `import './styles.css`가 있다면, 그 페이지를 방문할 때 해당 CSS 파일의 확인된 경로로 `preload`가 호출됩니다. 개발 모드에서는 빌드 시점의 분석에 의존하므로 `preload`가 호출되지 _않는다는_ 점에 유의하세요. 프리로드는 에셋을 더 빨리 내려받아 성능을 높일 수 있지만, 불필요하게 너무 많이 내려받으면 오히려 성능을 해칠 수도 있습니다. 기본적으로 `js`와 `css` 파일이 프리로드됩니다. `asset` 파일은 현재 전혀 프리로드되지 않지만, 피드백을 검토한 뒤 나중에 추가할 수도 있습니다. `font` 파일의 경우 `input`에 `filename` 속성도 있습니다. 이 속성은 프로젝트 루트를 기준으로 한 원본 파일의 경로명이므로, 필터에서 해시가 붙은 경로 대신 이 값으로 매칭할 수 있습니다.

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
		preload: ({ type, path }) => type === 'js' || path.includes('/important/')
	});

	return response;
}
```

`resolve(...)`는 절대 에러를 던지지 않으며, 항상 적절한 상태 코드와 함께 `Promise<Response>`를 반환한다는 점에 유의하세요. `handle` 중 다른 곳에서 에러가 발생하면 치명적인 에러로 취급되며, SvelteKit은 `Accept` 헤더에 따라 에러의 JSON 표현이나 폴백 에러 페이지로 응답합니다. 폴백 에러 페이지는 `src/error.html`로 바꿀 수 있습니다. 에러 처리에 대한 자세한 내용은 [여기](errors)에서 확인하세요.

### locals

`+server.js`의 핸들러와 서버 `load` 함수에 전달되는 사용자 정의 데이터를 요청에 추가하려면, 아래처럼 `event.locals` 객체에 값을 채우세요.

```js
/// file: src/hooks.server.js
// @filename: ambient.d.ts
type User = {
	name: string;
}

declare namespace App {
	interface Locals {
		user: User;
	}
}

const getUserInformation: (cookie: string | void) => Promise<User>;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = await getUserInformation(event.cookies.get('sessionid'));

	const response = await resolve(event);

	// Note that modifying response headers isn't always safe.
	// Response objects can have immutable headers
	// (e.g. Response.redirect() returned from an endpoint).
	// Modifying immutable headers throws a TypeError.
	// In that case, clone the response or avoid creating a
	// response object with immutable headers.
	response.headers.set('x-custom-header', 'potato');

	return response;
}
```

## handleFetch

> [!NOTE] `src/hooks.server.js`에 추가할 수 있습니다

이 함수를 사용하면 엔드포인트, `load`, `action`, `handle`, `handleError`, `reroute` 안에서 서버에서(또는 프리렌더링 중에) 실행되는 [`event.fetch`](load#Making-fetch-requests) 호출의 결과를 수정(또는 대체)할 수 있습니다.

예를 들어 `load` 함수는 사용자가 해당 페이지로 클라이언트 사이드 내비게이션을 할 때 `https://api.yourapp.com` 같은 공개 URL로 요청을 보낼 수 있지만, SSR 중에는 (API와 공개 인터넷 사이에 있는 프록시나 로드 밸런서를 우회해) API에 직접 요청하는 편이 합리적일 수 있습니다.

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit/hooks').HandleFetch} */
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}

	return fetch(request);
}
```

`event.fetch`로 보낸 요청은 브라우저의 자격 증명(credentials) 모델을 따릅니다. 같은 출처(same-origin) 요청이라면 `credentials` 옵션이 `"omit"`으로 설정되지 않는 한 `cookie`와 `authorization` 헤더가 전달됩니다. 교차 출처(cross-origin) 요청이라면 요청 URL이 앱의 하위 도메인에 속할 때 `cookie`가 포함됩니다. 예를 들어 앱이 `my-domain.com`에 있고 API가 `api.my-domain.com`에 있다면 쿠키가 요청에 포함됩니다.

한 가지 주의할 점이 있습니다. 앱과 API가 형제 하위 도메인(예: `www.my-domain.com`과 `api.my-domain.com`)에 있다면, `my-domain.com` 같은 공통 상위 도메인에 속한 쿠키는 포함되지 _않습니다_. SvelteKit은 그 쿠키가 어느 도메인에 속하는지 알 방법이 없기 때문입니다. 이런 경우에는 `handleFetch`를 사용해 쿠키를 직접 포함해야 합니다:

```js
/// file: src/hooks.server.js
// @errors: 2345
/** @type {import('@sveltejs/kit/hooks').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}

	return fetch(request);
}
```



## handleError

> [!NOTE] `src/hooks.server.js`와 `src/hooks.client.js`에 추가할 수 있습니다

이 함수는 요청을 로드하거나 렌더링하거나 응답하는 동안 발생한 모든 에러에 대해 호출됩니다. 이를 통해 두 가지를 할 수 있습니다:

- 에러를 로그로 남길 수 있습니다
- 메시지나 스택 트레이스 같은 민감한 세부 정보를 빼고, 사용자에게 보여 줘도 안전한 사용자 정의 에러 표현을 생성할 수 있습니다

이 훅은 `event`와 함께, 에러가 어디서 왔는지 알려 주는 `kind` 판별자(discriminant)와 `error` 자체를 받습니다:

- `'app'` — [`error(...)`](@sveltejs-kit#error)를 통해 앱에서 발생한 에러입니다
  - `error`는 [`App.Error`](types#Error)와 일치하는 에러 본문입니다
  - 기본값은 에러 본문 그 자체입니다
- `'framework'` — 404, 405, 413처럼 SvelteKit에서 발생한 에러입니다
  - `error`는 `{ status, message }`이며, `message`는 `Not Found`처럼 안전한 텍스트입니다
  - 기본값은 그 `{ status, message }`와 같습니다
- `'validation'`(서버 전용) — 원격 함수 인자를 [Standard Schema](https://standardschema.dev/)로 검증하다가 발생한 에러입니다
  - `error`는 `{ status: 400, message: 'Bad Request' }`이고, `issues`에 검증 이슈가 담겨 있습니다
  - 기본값은 `error` 객체이며, 이슈를 명시적으로 반환하지 않는 한 노출되지 않습니다
  - 검증 라이브러리 고유의 이슈 속성에 접근하려면 `HandleServerError`에 이슈 타입을 매개변수로 지정하세요. 예: `HandleServerError<CustomIssue>`
- `'unknown'` — 무엇이 잘못되었는지 알 수 없는 경우로, 여러분의 코드나 그 코드가 호출한 코드에서 에러가 발생했습니다
  - `error`는 던져진 값이며, 노출하기에 안전하지 않은 정보가 담겨 있을 수 있습니다
  - 기본값은 `{ status: 500, message: 'Internal Error' }`입니다

다음 섹션인 [에러](errors)에서 다른 분류를 더 자세히 설명합니다. 리디렉션은 에러가 아니므로 이 훅에 절대 도달하지 않습니다.

이 훅은 [`App.Error`](types#Error)와 일치하는 객체를 반환하며, 이 객체에서 `status`와 `message`는 선택 사항입니다. 위 목록의 기본값을 덮어쓸 때만 반환하세요.

> [!NOTE] `App.Error`에 _필수_ 속성을 추가로 확장했다면, 훅은 그 속성을 반환해야 합니다.

타입 안전한 방식으로 `page.error` 객체에 정보를 더 추가하려면, 기존 `App.Error` 인터페이스에 원하는 속성을 추가로 확장하세요. 내장된 `status`와 `message` 속성은 이미 있으므로 다시 선언할 필요가 없습니다. 예를 들어 사용자가 고객 지원에 문의할 때 알려 줄 수 있는 추적 ID를 추가할 수 있습니다:

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
			errorId: string;
		}
	}
}

export {};
```

```js
/// file: src/hooks.server.js
// @errors: 2322 2353
// @filename: ambient.d.ts
declare module '@sentry/sveltekit' {
	export const init: (opts: any) => void;
	export const captureException: (error: any, opts: any) => void;
}

// @filename: index.js
// ---cut---
import * as Sentry from '@sentry/sveltekit';

Sentry.init({/*...*/})

/** @type {import('@sveltejs/kit/hooks').HandleServerError} */
export async function handleError({ kind, error, event }) {
	if (kind === 'app') {
		// you created this error with `error(...)`, so it already
		// matches `App.Error` — pass it through unchanged
		return error;
	}

	const errorId = crypto.randomUUID();

	if (kind === 'framework') {
		// a 404 (or similar) — `error.status` and `error.message` are safe to
		// expose, so we keep them and just add our own property
		return { ...error, errorId };
	}

	// example integration with https://sentry.io/
	Sentry.captureException(error, {
		extra: { event, errorId }
	});

	// `status` and `message` are optional — we only override `message`,
	// so the status stays at its default of 500
	return {
		message: 'Whoops!',
		errorId
	};
}
```

```js
/// file: src/hooks.client.js
// @errors: 2322 2353
// @filename: ambient.d.ts
declare module '@sentry/sveltekit' {
	export const init: (opts: any) => void;
	export const captureException: (error: any, opts: any) => void;
}

// @filename: index.js
// ---cut---
import * as Sentry from '@sentry/sveltekit';

Sentry.init({/*...*/})

/** @type {import('@sveltejs/kit/hooks').HandleClientError} */
export async function handleError({ kind, error, event }) {
	if (kind === 'app') {
		return error;
	}

	const errorId = crypto.randomUUID();

	if (kind === 'framework') {
		return { ...error, errorId };
	}

	// example integration with https://sentry.io/
	Sentry.captureException(error, {
		extra: { event, errorId }
	});

	return {
		message: 'Whoops!',
		errorId
	};
}
```

> [!NOTE] `src/hooks.client.js`에서 `handleError`의 타입은 `HandleServerError`가 아니라 `HandleClientError`이고, `event`는 `RequestEvent`가 아니라 `NavigationEvent`입니다.

서버 사이드 훅에서 이미 변환된 에러는 클라이언트 사이드 훅에 다시 전달되지 않습니다.

개발 중에 Svelte 코드의 구문 오류 때문에 에러가 발생하면, 전달된 에러에 에러 위치를 강조해 보여 주는 `frame` 속성이 추가됩니다.

> [!NOTE] `handleError`는 _절대로_ 에러를 던지지 않도록 하세요

## init

> [!NOTE] `src/hooks.server.js`와 `src/hooks.client.js`에 추가할 수 있습니다

이 함수는 서버가 생성될 때나 브라우저에서 앱이 시작될 때 한 번 실행되며, 데이터베이스 연결 초기화 같은 비동기 작업을 하기에 좋은 곳입니다.

> [!NOTE] 실행 환경이 최상위 await를 지원한다면 `init` 함수는 모듈의 최상위에 초기화 로직을 작성하는 것과 사실상 다르지 않습니다. 하지만 일부 환경(특히 Safari)은 이를 지원하지 않습니다.

```js
// @errors: 2307
/// file: src/hooks.server.js
import * as db from '#lib/server/database.js';

/** @type {import('@sveltejs/kit/hooks').ServerInit} */
export async function init() {
	await db.connect();
}
```

> [!NOTE]
> 브라우저에서는 `init`의 비동기 작업이 하이드레이션을 지연시키므로, 여기에 무엇을 넣을지 신중히 생각하세요.

## reroute

> [!NOTE] `src/hooks.js`에 추가할 수 있으며, 서버와 클라이언트 양쪽에서 실행됩니다

이 함수는 `handle`보다 먼저 실행되며, URL이 라우트로 변환되는 방식을 바꿀 수 있습니다. 반환된 경로명(기본값은 `url.pathname`)은 라우트와 그 매개변수를 선택하는 데 사용됩니다.

예를 들어 `/en/about`, `/de/ueber-uns`, `/fr/a-propos`로 접근할 수 있어야 하는 `src/routes/[[lang]]/about/+page.svelte` 페이지가 있다고 해 봅시다. 이는 `reroute`로 구현할 수 있습니다:

```js
// @errors: 2345 2304
/// file: src/hooks.js

/** @type {Record<string, string>} */
const translated = {
	'/en/about': '/en/about',
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about',
};

/** @type {import('@sveltejs/kit/hooks').Reroute} */
export function reroute({ url }) {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}
```

`lang` 매개변수는 반환된 경로명에서 올바르게 추출됩니다.

`reroute`를 사용해도 브라우저 주소 표시줄의 내용이나 `event.url`의 값은 바뀌지 _않습니다_.

2.18 버전부터 `reroute` 훅은 비동기일 수 있으므로, (예를 들어) 백엔드에서 데이터를 가져와 어디로 리라우트할지 결정할 수 있습니다. 그렇지 않으면 내비게이션이 지연되므로 신중하게 사용하고 빠르게 동작하도록 하세요. 데이터를 가져와야 한다면 인자로 제공되는 `fetch`를 사용하세요. 이 `fetch`는 `load` 함수에 제공되는 `fetch`와 [같은 이점](load#Making-fetch-requests)이 있지만, 라우트가 아직 정해지지 않았으므로 [`handleFetch`](#handleFetch)에서 `params`와 `id`를 사용할 수 없다는 제약이 있습니다.

```js
// @errors: 2345 2304
/// file: src/hooks.js

/** @type {import('@sveltejs/kit/hooks').Reroute} */
export async function reroute({ url, fetch }) {
	// Ask a special endpoint within your app about the destination
	if (url.pathname === '/api/reroute') return;

	const api = new URL('/api/reroute', url);
	api.searchParams.set('pathname', url.pathname);

	const result = await fetch(api).then(r => r.json());
	return result.pathname;
}
```


> [!NOTE] `reroute`는 순수하고 멱등적인 함수로 간주됩니다. 따라서 같은 입력에는 항상 같은 출력을 반환해야 하며 부수 효과가 없어야 합니다. 이 가정에 따라 SvelteKit은 클라이언트에서 `reroute`의 결과를 캐시하므로, 고유한 URL마다 한 번만 호출됩니다.

## transport

> [!NOTE] `src/hooks.js`에 추가할 수 있으며, 서버와 클라이언트 양쪽에서 실행됩니다

이것은 *트랜스포터*(transporter)의 모음으로, `load`와 폼 액션에서 반환된 사용자 정의 타입을 서버/클라이언트 경계 너머로 전달할 수 있게 해 줍니다. 각 트랜스포터에는 서버에서 값을 인코딩하는(그 타입의 인스턴스가 아닌 값에는 falsy 값을 반환하는) `encode` 함수와 그에 대응하는 `decode` 함수가 있습니다:

```js
// @errors: 2307
/// file: src/hooks.js
import { Vector } from '#lib/math.js';

/** @type {import('@sveltejs/kit/hooks').Transport} */
export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```


## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 훅](/tutorial/kit/handle)
