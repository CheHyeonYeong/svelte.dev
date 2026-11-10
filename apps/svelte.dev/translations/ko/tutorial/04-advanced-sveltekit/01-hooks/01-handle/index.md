---
title: handle
---

SvelteKit은 프레임워크의 기본 동작을 가로채고 재정의하는 여러 가지 방법, 즉 *훅*(hook)을 제공합니다.

가장 기본적인 훅은 `src/hooks.server.js`에 있는 `handle`입니다. 이 훅은 `event` 객체와 `resolve` 함수를 받아 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 반환합니다.

마법은 `resolve`에서 일어납니다. SvelteKit은 들어온 요청 URL을 앱의 라우트와 맞춰 보고, 관련 코드(`+page.server.js`와 `+page.svelte` 파일 등)를 import하고, 라우트에 필요한 데이터를 불러온 뒤 응답을 생성합니다.

기본 `handle` 훅은 다음과 같습니다:

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	return await resolve(event);
}
```

([API 라우트](get-handlers)가 아닌) 페이지라면 `transformPageChunk`로 생성된 HTML을 수정할 수 있습니다:

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	return await resolve(event, {
+++		transformPageChunk: ({ html }) => html.replace(
			'<body',
			'<body style="color: hotpink"'
		)+++
	});
}
```

완전히 새로운 라우트를 만들 수도 있습니다:

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
+++	if (event.url.pathname === '/ping') {
		return new Response('pong');
	}+++

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace(
			'<body',
			'<body style="color: hotpink"'
		)
	});
}
```
