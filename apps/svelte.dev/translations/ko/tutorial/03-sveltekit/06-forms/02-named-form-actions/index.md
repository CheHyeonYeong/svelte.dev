---
title: 이름 있는 폼 액션
---

액션이 하나뿐인 페이지는 실제로는 꽤 드뭅니다. 대부분은 한 페이지에 액션이 여러 개 필요합니다. 이 앱에서도 할 일을 만드는 것만으로는 부족합니다. 완료한 할 일은 삭제할 수 있어야 하니까요.

먼저 `default` 액션을 `create`와 `delete`라는 이름 있는 액션으로 바꿔 보세요:

```js
/// file: src/routes/+page.server.js
export const actions = {
	+++create+++: async ({ cookies, request }) => {
		const data = await request.formData();
		db.createTodo(cookies.get('userid'), data.get('description'));
	}+++,+++

+++	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		db.deleteTodo(cookies.get('userid'), data.get('id'));
	}+++
};
```

> [!NOTE] 기본 액션은 이름 있는 액션과 함께 존재할 수 없습니다.

`<form>` 요소에는 선택적인 `action` 속성이 있으며, 이는 `<a>` 요소의 `href` 속성과 비슷합니다. 기존 폼이 새 `create` 액션을 가리키도록 수정해 보세요:

```svelte
/// file: src/routes/+page.svelte
<form method="POST" +++action="?/create"+++>
	<label>
		add a todo:
		<input
			name="description"
			autocomplete="off"
		/>
	</label>
</form>
```

> [!NOTE] `action` 속성에는 어떤 URL이든 쓸 수 있습니다. 액션이 다른 페이지에 정의되어 있다면 `/todos?/create`처럼 쓸 수 있습니다. 여기서는 액션이 *이* 페이지에 있으므로 경로를 완전히 생략할 수 있고, 그래서 맨 앞에 `?` 문자가 붙습니다. 네이티브 폼 제출과 마찬가지로, 다른 페이지의 액션으로 제출하면 그 페이지로 이동합니다.

다음으로, 할 일마다 폼을 하나씩 만들고 각 할 일을 고유하게 식별하는 숨겨진 `<input>`을 넣어 보세요:

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	{#each data.todos as todo (todo.id)}
		<li>
+++			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={todo.id} />
				<span>{todo.description}</span>
				<button aria-label="Mark as complete"></button>
			</form>+++
		</li>
	{/each}
</ul>
```
