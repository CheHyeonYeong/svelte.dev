---
title: 반응형 내장 객체
---

Svelte에는 JavaScript 내장 객체 대신 사용할 수 있는 반응형 클래스가 여러 개 들어 있습니다. 바로 `Map`, `Set`, `Date`, `URL`, `URLSearchParams`입니다.

이 연습 문제에서는 `$state(new Date())`로 `date`를 선언하고 `setInterval` 안에서 다시 할당할 *수도* 있습니다. 하지만 더 나은 방법은 [`svelte/reactivity`](/docs/svelte/svelte-reactivity)의 `SvelteDate`를 사용하는 것입니다:

```svelte
/// file: App.svelte
<script>
	+++import { SvelteDate } from 'svelte/reactivity';+++

	let date = new +++SvelteDate();+++

	// ...
</script>
```
