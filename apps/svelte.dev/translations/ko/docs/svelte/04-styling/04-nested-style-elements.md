---
title: 중첩된 <style> 요소
---

컴포넌트마다 최상위 `<style>` 태그는 하나만 있을 수 있습니다.

하지만 다른 요소나 로직 블록 안에 `<style>` 태그를 중첩해서 넣을 수는 있습니다.

이 경우 `<style>` 태그는 있는 그대로 DOM에 삽입되며, 해당 `<style>` 태그에는 스코프 지정이나 다른 처리가 전혀 이루어지지 않습니다.

```svelte
<div>
	<style>
		/* this style tag will be inserted as-is */
		div {
			/* this will apply to all `<div>` elements in the DOM */
			color: red;
		}
	</style>
</div>
```
