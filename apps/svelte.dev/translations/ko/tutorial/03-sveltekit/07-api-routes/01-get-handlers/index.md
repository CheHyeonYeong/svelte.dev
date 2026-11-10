---
title: GET 핸들러
---

SvelteKit으로는 페이지 말고도 더 많은 것을 만들 수 있습니다. HTTP 메서드(`GET`, `PUT`, `POST`, `PATCH`, `DELETE`)에 대응하는 함수를 export하는 `+server.js` 파일을 추가하면 *API 라우트*도 만들 수 있습니다.

이 앱은 버튼을 클릭하면 `/roll` API 라우트에서 데이터를 가져옵니다. `src/routes/roll/+server.js` 파일을 추가해 이 라우트를 만들어 보세요:

```js
/// file: src/routes/roll/+server.js
export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
```

이제 버튼을 클릭하면 제대로 동작합니다.

요청 핸들러는 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) 객체를 반환해야 합니다. API 라우트에서는 JSON을 반환하는 경우가 많기 때문에, `Response` 객체에는 이런 응답을 만들어 주는 편리한 정적 메서드가 있습니다:

```js
/// file: src/routes/roll/+server.js
export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

---	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});---
+++	return Response.json(number);+++
}
```
