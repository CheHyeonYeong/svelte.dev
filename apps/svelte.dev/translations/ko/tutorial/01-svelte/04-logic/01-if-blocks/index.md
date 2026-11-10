---
title: if 블록
tags: template-if
---

HTML에는 조건문이나 반복문 같은 *로직*을 표현할 방법이 없습니다. Svelte에는 있습니다.

마크업을 조건부로 렌더링하려면 `if` 블록으로 감쌉니다. `count`가 `10`보다 클 때 나타나는 텍스트를 추가해 봅시다:

```svelte
/// file: App.svelte
<button onclick={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

+++{#if count > 10}
	<p>{count} is greater than 10</p>
{/if}+++
```

직접 해 보세요. 컴포넌트를 수정한 다음 버튼을 몇 번 클릭해 보세요.
