---
title: 유효성 검사
---

사용자는 기회만 있으면 온갖 말도 안 되는 데이터를 제출하는 짓궂은 존재입니다. 이들이 혼란을 일으키지 못하게 하려면 폼 데이터의 유효성을 검사하는 것이 중요합니다.

첫 번째 방어선은 브라우저의 [내장 폼 유효성 검사](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#using_built-in_form_validation)입니다. 이를 사용하면 예를 들어 `<input>`을 필수 항목으로 쉽게 지정할 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/create">
	<label>
		add a todo
		<input
			name="description"
			autocomplete="off"
			+++required+++
		/>
	</label>
</form>
```

`<input>`이 비어 있는 상태에서 Enter를 눌러 보세요.

이런 유효성 검사는 도움이 되지만 충분하지는 않습니다. 어떤 유효성 검사 규칙(예: 고유성)은 `<input>` 속성으로 표현할 수 없고, 어차피 사용자가 뛰어난 해커라면 브라우저 개발자 도구로 속성을 지워 버릴 수도 있습니다. 이런 장난을 막으려면 항상 서버 측 유효성 검사를 사용해야 합니다.

`src/lib/server/database.js`에서 설명이 존재하고 고유한지 검사해 보세요:

```js
/// file: src/lib/server/database.js
export function createTodo(userid, description) {
+++	if (description === '') {
		throw new Error('todo must have a description');
	}+++

	const todos = db.get(userid);

+++	if (todos.find((todo) => todo.description === description)) {
		throw new Error('todos must be unique');
	}+++

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}
```

중복된 할 일을 제출해 보세요. 이런! SvelteKit이 불친절해 보이는 에러 페이지로 이동시킵니다. 서버에서는 'todos must be unique' 에러가 보이지만, 알 수 없는 에러 메시지에는 민감한 데이터가 담긴 경우가 많기 때문에 SvelteKit은 이를 사용자에게 숨깁니다.

같은 페이지에 머무르면서 무엇이 잘못됐는지 알려 주어 사용자가 고칠 수 있게 하는 편이 훨씬 낫습니다. 이를 위해 `fail` 함수를 사용하면 액션에서 적절한 HTTP 상태 코드와 함께 데이터를 반환할 수 있습니다:

```js
/// file: src/routes/+page.server.js
+++import { fail } from '@sveltejs/kit';+++
import * as db from '#lib/server/database.js';

export function load({ cookies }) {...}

export const actions = {
	create: async ({ cookies, request }) => {
		const data = await request.formData();

+++		try {+++
			db.createTodo(cookies.get('userid'), data.get('description'));
+++		} catch (error) {
			return fail(422, {
				description: data.get('description'),
				error: error.message
			});
		}+++
	}
```

`src/routes/+page.svelte`에서는 `form` prop으로 반환된 값에 접근할 수 있습니다. 이 prop은 폼을 제출한 뒤에만 값이 채워집니다:

```svelte
/// file: src/routes/+page.svelte
<script>
	let { data, +++form+++ } = $props();
</script>

<div class="centered">
	<h1>todos</h1>

	+++{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}+++

	<form method="POST" action="?/create">
		<label>
			add a todo:
			<input
				name="description"
				+++value={form?.description ?? ''}+++
				autocomplete="off"
				required
			/>
		</label>
	</form>
```

> [!NOTE] 액션에서 `fail`로 감싸지 *않고* 데이터를 반환할 수도 있습니다. 예를 들어 데이터가 저장되었을 때 '성공!' 메시지를 보여 주는 경우인데, 이 데이터도 `form` prop으로 사용할 수 있습니다.
