---
title: <form> 요소
---

[데이터 불러오기](page-data) 챕터에서는 서버에서 브라우저로 데이터를 가져오는 방법을 살펴봤습니다. 때로는 반대 방향으로 데이터를 보내야 할 때도 있는데, 이때 웹 플랫폼에서 데이터를 제출하는 방법인 `<form>`이 등장합니다.

할 일 앱을 만들어 봅시다. `src/lib/server/database.js`에는 이미 인메모리 데이터베이스가 준비되어 있고, `src/routes/+page.server.js`의 `load` 함수는 [`cookies`](/docs/kit/load#Cookies) API를 사용해 사용자별 할 일 목록을 다룰 수 있게 해 줍니다. 이제 새 할 일을 만들 `<form>`을 추가해야 합니다:

```svelte
/// file: src/routes/+page.svelte
<h1>todos</h1>

+++<form method="POST">
	<label>
		add a todo:
		<input
			name="description"
			autocomplete="off"
		/>
	</label>
</form>+++

<ul class="todos">
```

`<input>`에 무언가를 입력하고 Enter를 누르면, 브라우저는 (`method="POST"` 속성 때문에) 현재 페이지로 POST 요청을 보냅니다. 하지만 POST 요청을 처리할 서버 측 *액션*을 아직 만들지 않았기 때문에 에러가 발생합니다. 지금 만들어 봅시다:

```js
/// file: src/routes/+page.server.js
import * as db from '#lib/server/database.js';

export function load({ cookies }) {
	// ...
}

+++export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		db.createTodo(cookies.get('userid'), data.get('description'));
	}
};+++
```

`request`는 표준 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 객체이고, `await request.formData()`는 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 인스턴스를 반환합니다.

이제 Enter를 누르면 데이터베이스가 갱신되고 새 데이터로 페이지가 다시 로드됩니다.

`fetch` 코드 같은 것을 전혀 작성하지 않았는데도 데이터가 자동으로 갱신된다는 점에 주목하세요. 그리고 `<form>` 요소를 사용하기 때문에 이 앱은 JavaScript가 비활성화되어 있거나 사용할 수 없는 환경에서도 동작합니다.
