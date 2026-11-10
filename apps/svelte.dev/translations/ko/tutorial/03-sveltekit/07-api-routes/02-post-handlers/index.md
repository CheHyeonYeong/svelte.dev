---
title: POST 핸들러
---

`POST`처럼 데이터를 변경하는 핸들러도 추가할 수 있습니다. 하지만 대부분의 경우에는 대신 [폼 액션](the-form-element)을 사용하는 것이 좋습니다. 작성할 코드가 줄어들고, JavaScript 없이도 동작해서 더 탄탄하기 때문입니다.

'add a todo' `<input>`의 `keydown` 이벤트 핸들러 안에서 서버로 데이터를 POST해 봅시다:

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		const input = e.currentTarget;
		const description = input.value;

+++		const response = await fetch('/todo', {
			method: 'POST',
			body: JSON.stringify({ description }),
			headers: {
				'Content-Type': 'application/json'
			}
		});+++

		input.value = '';
	}}
/>
```

여기서는 사용자 쿠키의 `userid`를 사용해 `/todo` API 라우트로 JSON을 POST하고, 응답으로 새로 만들어진 할 일의 `id`를 받습니다.

`src/lib/server/database.js`의 `createTodo`를 호출하는 `POST` 핸들러가 있는 `src/routes/todo/+server.js` 파일을 추가해 `/todo` 라우트를 만들어 보세요:

```js
/// file: src/routes/todo/+server.js
import * as database from '#lib/server/database.js';

export async function POST({ request, cookies }) {
	const { description } = await request.json();

	const userid = cookies.get('userid');
	const { id } = await database.createTodo({ userid, description });

	return Response.json({ id }, { status: 201 });
}
```

`load` 함수나 폼 액션과 마찬가지로 `request`는 표준 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 객체이며, `await request.json()`은 이벤트 핸들러에서 POST한 데이터를 반환합니다.

여기서는 [201 Created](https://http.dog/201) 상태와 함께 데이터베이스에 새로 생성된 할 일의 `id`를 담은 응답을 반환합니다. 이벤트 핸들러로 돌아가서 이 값으로 페이지를 갱신할 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		const input = e.currentTarget;
		const description = input.value;

		const response = await fetch('/todo', {
			method: 'POST',
			body: JSON.stringify({ description }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

+++		const { id } = await response.json();

		const todos = [...data.todos, {
			id,
			description
		}];

		data = { ...data, todos };+++

		input.value = '';
	}}
/>
```

> [!NOTE] `data`는 페이지를 새로고침했을 때와 같은 결과가 나오는 방식으로만 갱신해야 합니다. `data` prop은 *깊은* 반응성을 갖지 않으므로 값을 통째로 교체해야 합니다. `data.todos = todos` 같은 변경으로는 다시 렌더링되지 않습니다.
