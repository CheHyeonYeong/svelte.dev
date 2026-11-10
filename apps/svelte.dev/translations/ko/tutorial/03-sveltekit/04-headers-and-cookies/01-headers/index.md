---
title: 헤더 설정하기
---

`load` 함수 안에서는(나중에 배울 [폼 액션](the-form-element), [훅](handle), [API 라우트](get-handlers)에서도 마찬가지로) `setHeaders` 함수를 사용할 수 있습니다. 이름에서 짐작할 수 있듯이 이 함수로 응답의 헤더를 설정할 수 있습니다.

가장 흔하게는 [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 응답 헤더로 캐싱 동작을 조정할 때 쓰겠지만, 이 튜토리얼에서는 그다지 권장하지 않는, 좀 더 극적인 일을 해 보겠습니다:

```js
/// file: src/routes/+page.server.js
export function load(+++{ setHeaders }+++) {
+++	setHeaders({
		'Content-Type': 'text/plain'
	});+++
}
```

(효과를 보려면 iframe을 새로고침해야 할 수도 있습니다.)
