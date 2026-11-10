---
title: 기타 핸들러
---

마찬가지로 다른 HTTP 메서드에 대한 핸들러도 추가할 수 있습니다. `src/lib/server/database.js`의 `toggleTodo`와 `deleteTodo` 함수를 사용해 할 일을 토글하고 삭제하는 `PUT`과 `DELETE` 핸들러가 있는 `src/routes/todo/[id]/+server.js` 파일을 만들어 `/todo/[id]` 라우트를 추가해 보세요:

```js
/// file: src/routes/todo/[id]/+server.js
import * as database from '#lib/server/database.js';

export async function PUT({ params, request, cookies }) {
	const { done } = await request.json();
	const userid = cookies.get('userid');

	await database.toggleTodo({ userid, id: params.id, done });
	return new Response(null, { status: 204 });
}

export async function DELETE({ params, cookies }) {
	const userid = cookies.get('userid');

	await database.deleteTodo({ userid, id: params.id });
	return new Response(null, { status: 204 });
}
```

브라우저에 실제 데이터를 반환할 필요가 없으므로 [204 No Content](https://http.dog/204) 상태와 함께 빈 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 반환합니다.

이제 이벤트 핸들러 안에서 이 엔드포인트와 상호작용할 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<label>
	<input
		type="checkbox"
		checked={todo.done}
		onchange={async (e) => {
			const done = e.currentTarget.checked;

+++			await fetch(`/todo/${todo.id}`, {
				method: 'PUT',
				body: JSON.stringify({ done }),
				headers: {
					'Content-Type': 'application/json'
				}
			});+++
		}}
	/>
	<span>{todo.description}</span>
	<button
		aria-label="Mark as complete"
		onclick={async (e) => {
+++			await fetch(`/todo/${todo.id}`, {
				method: 'DELETE'
			});

			const todos = data.todos.filter((t) => t !== todo);

			data = { ...data, todos };+++
		}}
	></button>
</label>
```
