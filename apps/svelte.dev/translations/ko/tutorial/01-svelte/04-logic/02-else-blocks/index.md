---
title: else 블록
---

JavaScript에서처럼 `if` 블록에는 `else` 블록을 붙일 수 있습니다:

```svelte
/// file: App.svelte
{#if count > 10}
	<p>{count} is greater than 10</p>
+++{:else}
	<p>{count} is between 0 and 10</p>+++
{/if}
```

`{#...}`는 블록을 엽니다. `{/...}`는 블록을 닫습니다. `{:...}`는 블록을 *이어 갑니다*. 축하합니다. Svelte가 HTML에 추가하는 문법을 벌써 거의 다 배웠습니다.
