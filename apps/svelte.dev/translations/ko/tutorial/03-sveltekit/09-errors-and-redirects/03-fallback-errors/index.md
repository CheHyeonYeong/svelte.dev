---
title: 폴백 에러
---

루트 레이아웃 데이터를 불러오는 중이나 에러 페이지를 렌더링하는 중에 에러가 발생하는 등 *정말로* 일이 크게 잘못되면, SvelteKit은 정적 에러 페이지로 폴백합니다.

새 `src/routes/+layout.server.js` 파일을 추가해 실제로 확인해 보세요:

```js
/// file: src/routes/+layout.server.js
export function load() {
	throw new Error('yikes');
}
```

폴백 에러 페이지는 커스터마이즈할 수 있습니다. `src/error.html` 파일을 만들어 보세요:

```html
/// file: src/error.html
<h1>Game over</h1>
<p>Code %sveltekit.status%</p>
<p>%sveltekit.error.message%</p>
```

이 파일에는 다음을 넣을 수 있습니다:

- `%sveltekit.status%` — HTTP 상태 코드
- `%sveltekit.error.message%` — 에러 메시지
