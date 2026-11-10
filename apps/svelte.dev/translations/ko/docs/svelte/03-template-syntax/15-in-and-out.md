---
title: in: and out:
tags: transitions
---

`in:`과 `out:` 지시어는 [`transition:`](transition)과 같지만, 만들어지는 트랜지션이 양방향이 아니라는 점이 다릅니다. 트랜지션이 진행되는 도중에 블록이 아웃트로되면, `in` 트랜지션은 거꾸로 되돌아가지 않고 `out` 트랜지션과 함께 계속 '재생'됩니다. out 트랜지션이 중단되면 트랜지션은 처음부터 다시 시작합니다.

```svelte
<script>
  import { fade, fly } from 'svelte/transition';

  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  visible
</label>

{#if visible}
	<div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```
