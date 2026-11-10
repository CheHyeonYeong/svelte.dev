---
title: RequestEvent 객체
---

`handle`에 전달되는 `event` 객체는 [`RequestEvent`](/docs/kit/@sveltejs-kit#RequestEvent)의 인스턴스로, `+server.js` 파일의 [API 라우트](get-handlers), `+page.server.js` 파일의 [폼 액션](the-form-element), 그리고 `+page.server.js`와 `+layout.server.js`의 `load` 함수에 전달되는 것과 같은 객체입니다.

이 객체에는 유용한 속성과 메서드가 많이 있으며, 그중 일부는 이미 살펴봤습니다:

- `cookies` — [쿠키 API](cookies)
- `fetch` — 추가 기능이 더해진 표준 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- `getClientAddress()` — 클라이언트의 IP 주소를 가져오는 함수
- `isDataRequest` — 클라이언트 사이드 내비게이션 중에 브라우저가 페이지 데이터를 요청하면 `true`, 페이지/라우트를 직접 요청하면 `false`
- `locals` — 임의의 데이터를 넣어 두는 곳
- `params` — 라우트 매개변수
- `request` — [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 객체
- `route` — 일치한 라우트를 나타내는 `id` 속성을 가진 객체
- `setHeaders(...)` — 응답에 [HTTP 헤더를 설정](headers)하는 함수
- `url` — 현재 요청을 나타내는 [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) 객체

유용한 패턴 하나는 `handle`에서 `event.locals`에 데이터를 넣어 두고, 이후에 실행되는 `load` 함수에서 읽는 것입니다:

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	+++event.locals.answer = 42;+++
	return await resolve(event);
}
```

```js
/// file: src/routes/+page.server.js
export function load(+++event+++) {
	return {
		message: `the answer is ${+++event.locals.answer+++}`
	};
}
```
