---
title: {@const ...}
---

> [!NOTE] `{@const x = y}`는 레거시 문법입니다. 대신 [`{const x = $derived(y)}`](declaration-tags)를 사용하세요

`{@const ...}` 태그는 지역 상수를 정의합니다.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

`{@const}`는 블록(`{#if ...}`, `{#each ...}`, `{#snippet ...}` 등), `<Component />`, `<svelte:boundary>`의 직계 자식으로만 사용할 수 있습니다.
