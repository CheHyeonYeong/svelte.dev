---
title: <svelte:self>
---

`<svelte:self>` 요소를 사용하면 컴포넌트가 자기 자신을 재귀적으로 포함할 수 있습니다.

무한 루프를 막기 위해 이 요소는 마크업의 최상위에 올 수 없으며, if 블록이나 each 블록 안에 있거나 컴포넌트의 슬롯으로 전달되어야 합니다.

```svelte
<script>
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

> [!NOTE]
> 컴포넌트가 자기 자신을 import할 수 있으므로 이 개념은 더 이상 필요하지 않습니다:
> ```svelte
> <!--- file: App.svelte --->
> <script>
> 	import Self from './App.svelte'
> 	export let count;
> </script>
>
> {#if count > 0}
> 	<p>counting down... {count}</p>
> 	<Self count={count - 1} />
> {:else}
> 	<p>lift-off!</p>
> {/if}
> ```
