---
title: handleFetch
---

`event` 객체에는 표준 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)처럼 동작하지만 초능력을 갖춘 `fetch` 메서드가 있습니다:

- 들어온 요청의 `cookie`와 `authorization` 헤더를 물려받으므로, 서버에서 자격 증명이 포함된 요청을 보낼 수 있습니다
- 서버에서 상대 경로로 요청할 수 있습니다(보통 서버 환경에서 `fetch`를 쓰려면 출처가 포함된 URL이 필요합니다)
- 서버에서 실행될 때 내부 요청(예: `+server.js` 라우트로 가는 요청)은 HTTP 호출의 오버헤드 없이 핸들러 함수로 바로 전달됩니다

이 동작은 `handleFetch` 훅으로 바꿀 수 있으며, 기본 형태는 다음과 같습니다:

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
	return await fetch(request);
}
```

예를 들어 `src/routes/a/+server.js`로 가는 요청에 `src/routes/b/+server.js`의 응답을 대신 돌려줄 수 있습니다:

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
+++	const url = new URL(request.url);
	if (url.pathname === '/a') {
		return await fetch('/b');
	}+++

	return await fetch(request);
}
```

나중에 [유니버설 `load` 함수](universal-load-functions)를 다룰 때 `event.fetch`를 브라우저에서도 호출할 수 있다는 것을 알게 됩니다. 이때 브라우저에서는 `https://api.yourapp.com` 같은 공개 URL로 보내는 요청을, 서버에서 실행될 때는 (API 서버와 공용 인터넷 사이에 있는 프록시와 로드 밸런서를 건너뛰도록) 내부 URL로 리디렉션해야 한다면 `handleFetch`가 유용합니다.
