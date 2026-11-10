---
title: 리디렉션
---

`redirect` 메커니즘을 사용하면 한 페이지에서 다른 페이지로 리디렉션할 수 있습니다.

`src/routes/a/+page.server.js`에 새 `load` 함수를 만들어 보세요:

```js
/// file: src/routes/a/+page.server.js
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(307, '/b');
}
```

이제 `/a`로 이동하면 곧바로 `/b`로 넘어갑니다.

`redirect(...)`는 `load` 함수, 폼 액션, API 라우트, 그리고 이후 챕터에서 다룰 `handle` 훅 안에서 사용할 수 있습니다.

가장 자주 쓰게 될 상태 코드는 다음과 같습니다:

- `303` — 폼 액션에서 제출이 성공한 뒤
- `307` — 임시 리디렉션
- `308` — 영구 리디렉션

> [!NOTE] `redirect(...)`는 `error(...)`처럼 예외를 throw합니다. 즉, 리디렉션 *이후의* 코드는 실행되지 않습니다.
