---
title: 스타일링
tags: styles-scoped
---

HTML에서처럼 컴포넌트에 `<style>` 태그를 추가할 수 있습니다. `<p>` 요소에 스타일을 추가해 봅시다:

```svelte
/// file: App.svelte
<p>This is a paragraph.</p>

<style>
+++	p {
		color: goldenrod;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}+++
</style>
```

중요한 점은 이 규칙들이 *컴포넌트 범위로 한정*된다는 것입니다. 다음 단계에서 보겠지만, 앱의 다른 곳에 있는 `<p>` 요소의 스타일이 실수로 바뀌는 일은 없습니다.
