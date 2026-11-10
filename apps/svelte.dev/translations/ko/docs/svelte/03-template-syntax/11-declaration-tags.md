---
title: {let/const ...}
---

선언 태그는 마크업 안에서 `const`나 `let`으로 지역 변수를 정의합니다:

<!-- codeblock:start {"title":"Declaration tags"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let boxes = [{ width: 10, height: 10 }, { width: 15, height: 15 }];
</script>

{#each boxes as box}
	{const area = box.width * box.height}
	{const label = `${box.width} × ${box.height} = ${area}`}

	<p>{label}</p>
{/each}
```
<!-- codeblock:end -->

> [!NOTE] 선언 태그는 Svelte 5.56부터 사용할 수 있습니다.

> [!NOTE] [`{@const ...}`](@const) 문법은 레거시로 간주됩니다. 대신 선언 태그를 사용하세요.

값이 반응형이어야 한다면 `$state`와 `$derived`를 사용할 수 있습니다:

<!-- codeblock:start {"title":"Reactive declaration tags"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let user = $state({ name: 'Svelte' });
	let editing = $state(false);
</script>

<p>Hello {user.name}</p>
<button onclick={() => editing = true}>edit name</button>

{#if editing}
	{let name = $state(user.name)}
	{const greeting = $derived(`Hello ${name}`)}

	<hr>
	<input bind:value={name} />
	<p>{greeting}</p>

	<button onclick={() => {
		user.name = name;
		editing = false;
	}}>save</button>
{/if}
```
<!-- codeblock:end -->

선언 태그는 컴포넌트 안 어디에서나 사용할 수 있습니다. 선언 태그는 자신의 바깥에서 선언된 값(예를 들어 `<script>` 태그나 `{#each ...}` 블록 안의 값)을 참조할 수 있고, 같은 렉시컬 스코프에 있는 모든 것(즉, 형제 요소와 그 형제 요소의 자식)에서 '보입니다':

<!-- codeblock:start {"title":"Declaration tag scope"} -->
```svelte
<!--- file: App.svelte --->
{const hello = 'hello'}
{hello} <!-- 'hello' -->
<div>
	{const hello = 'hi'}
	{hello} <!-- 'hi' -->
	<div>
		{hello} <!-- 'hi' -->
	</div>
</div>
{hello} <!-- 'hello' -->
```
<!-- codeblock:end -->
