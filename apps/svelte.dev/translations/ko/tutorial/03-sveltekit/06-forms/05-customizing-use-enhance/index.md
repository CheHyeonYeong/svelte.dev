---
title: use:enhance 커스터마이징
---

`use:enhance`를 사용하면 브라우저의 네이티브 동작을 흉내 내는 것보다 더 많은 일을 할 수 있습니다. 콜백을 전달하면 **대기 상태**나 **낙관적 UI** 같은 것을 추가할 수 있습니다. 두 액션에 인위적인 지연을 넣어 느린 네트워크를 흉내 내 봅시다:

```js
/// file: src/routes/+page.server.js
export const actions = {
	create: async ({ cookies, request }) => {
		+++await new Promise((fulfil) => setTimeout(fulfil, 1000));+++
		...
	},

	delete: async ({ cookies, request }) => {
		+++await new Promise((fulfil) => setTimeout(fulfil, 1000));+++
		...
	}
};
```

이제 항목을 만들거나 삭제하면 UI가 갱신되기까지 꼬박 1초가 걸려서, 사용자는 뭔가 잘못한 건 아닌지 궁금해집니다. 이 문제를 해결하기 위해 로컬 상태를 추가하고...

```svelte
/// file: src/routes/+page.svelte
<script>
	import { fly, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

+++	let creating = $state(false);
	let deleting = $state([]);+++
</script>
```

...첫 번째 `use:enhance` 안에서 `creating`을 토글해 보세요:

```svelte
/// file: src/routes/+page.svelte
<form
	method="POST"
	action="?/create"
+++	use:enhance={() => {
		creating = true;

		return async ({ update }) => {
			await update();
			creating = false;
		};
	}}+++
>
	<label>
		add a todo:
		<input
			+++disabled={creating}+++
			name="description"
			value={form?.description ?? ''}
			autocomplete="off"
			required
		/>
	</label>
</form>
```

그러면 데이터를 저장하는 동안 메시지를 보여 줄 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	<!-- ... -->
</ul>

+++{#if creating}
	<span class="saving">saving...</span>
{/if}+++
```

삭제의 경우에는 서버가 무언가를 검증할 때까지 기다릴 필요가 없습니다. UI를 바로 갱신하면 됩니다:

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	{#each +++data.todos.filter((todo) => !deleting.includes(todo.id))+++ as todo (todo.id)}
		<li in:fly={{ y: 20 }} out:slide>
			<form
				method="POST"
				action="?/delete"
				+++use:enhance={() => {
					deleting = [...deleting, todo.id];
					return async ({ update }) => {
						await update();
						deleting = deleting.filter((id) => id !== todo.id);
					};
				}}+++
			>
				<input type="hidden" name="id" value={todo.id} />
				<button aria-label="Mark as complete">✔</button>

				{todo.description}
			</form>
		</li>
	{/each}
</ul>
```

> [!NOTE] `use:enhance`는 매우 유연하게 커스터마이즈할 수 있습니다. 제출을 `cancel()`하거나, 리디렉션을 처리하거나, 폼을 초기화할지 제어하는 등의 일을 할 수 있습니다. 자세한 내용은 [문서를 보세요](/docs/kit/$app-forms#enhance).
