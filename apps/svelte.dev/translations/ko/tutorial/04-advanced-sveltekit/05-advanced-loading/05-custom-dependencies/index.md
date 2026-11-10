---
title: 사용자 정의 의존성
path: /Europe/London
---

`load` 함수 안에서 `fetch(url)`를 호출하면 `url`이 의존성으로 등록됩니다. `fetch`를 쓰기 적절하지 않을 때는 [`depends(url)`](/docs/kit/load#Rerunning-load-functions-Manual-invalidation) 함수로 의존성을 직접 지정할 수 있습니다.

`[a-z]+:` 패턴으로 시작하는 문자열은 모두 유효한 URL이므로, `data:now` 같은 사용자 정의 무효화 키를 만들 수 있습니다.

`src/routes/+layout.js`가 `fetch`를 호출하는 대신 값을 직접 반환하도록 수정하고, `depends`를 추가하세요:

```js
/// file: src/routes/+layout.js
export async function load({ +++depends+++ }) {
	+++depends('data:now');+++

	return {
		now: +++Date.now()+++
	};
}
```

이제 `src/routes/[...timezone]/+page.svelte`의 `invalidate` 호출을 수정하세요:

```svelte
/// file: src/routes/[...timezone]/+page.svelte
<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate(+++'data:now'+++);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>
```
