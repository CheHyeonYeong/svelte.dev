---
title: props 선언하기
tags: rune-props
---

지금까지는 내부 상태만 다뤘습니다. 즉, 값은 해당 컴포넌트 안에서만 접근할 수 있었습니다.

실제 애플리케이션에서는 한 컴포넌트에서 자식 컴포넌트로 데이터를 전달해야 합니다. 그러려면 보통 'props'로 줄여 부르는 *속성*(properties)을 선언해야 합니다. Svelte에서는 `$props` 룬으로 선언합니다. `Nested.svelte` 컴포넌트를 수정하세요:

```svelte
/// file: Nested.svelte
<script>
	let { answer } = +++$props()+++;
</script>
```
