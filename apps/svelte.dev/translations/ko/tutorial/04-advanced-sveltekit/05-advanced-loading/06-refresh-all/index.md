---
title: refreshAll
path: /Europe/London
---

마지막으로 최후의 수단인 `refreshAll()`이 있습니다. 이 함수는 무엇에 의존하는지와 상관없이 현재 페이지의 모든 `load` 함수와 현재 활성화된 모든 [원격 함수](/docs/kit/remote-functions)를 가리지 않고 다시 실행합니다. 페이지를 새로고침하는 것과 달리 `page.state`를 초기화하지는 않습니다.

이전 연습의 `src/routes/[...timezone]/+page.svelte`를 수정하세요:

```svelte
/// file: src/routes/[...timezone]/+page.svelte
<script>
	import { onMount } from 'svelte';
	import { +++refreshAll+++ } from '$app/navigation';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			+++refreshAll();+++
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>
```

`src/routes/+layout.js`의 `depends` 호출은 더 이상 필요하지 않습니다:

```js
/// file: src/routes/+layout.js
export async function load(---{ depends }---) {
	---depends('data:now');---

	return {
		now: Date.now()
	};
}
```

> [!NOTE] `invalidate(() => true)`와 `refreshAll()`은 같지 *않습니다*. `invalidate(() => true)`는 URL에 의존하는 `load` 함수만 다시 실행하지만, `refreshAll()`은 현재 페이지의 모든 `load` 함수와 현재 활성화된 모든 원격 함수를 다시 실행합니다. `invalidateAll()`은 SvelteKit 3에서 지원 중단(deprecated)되었습니다.
