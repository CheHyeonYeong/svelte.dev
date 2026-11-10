---
title: 무효화
path: /Europe/London
---

사용자가 한 페이지에서 다른 페이지로 이동하면 SvelteKit은 `load` 함수를 호출하는데, 무언가 바뀌었다고 판단할 때만 호출합니다.

이 예제에서는 시간대 사이를 이동하면 `params.timezone`이 바뀌므로 `src/routes/[...timezone]/+page.js`의 `load` 함수가 다시 실행됩니다. 하지만 `src/routes/+layout.js`의 `load` 함수는 다시 실행되지 *않습니다*. SvelteKit이 보기에는 내비게이션으로 무효화되지 않았기 때문입니다.

[`invalidate(...)`](/docs/kit/$app-navigation#invalidate) 함수로 직접 무효화하면 이 문제를 해결할 수 있습니다. 이 함수는 URL을 받아 그 URL에 의존하는 모든 `load` 함수를 다시 실행합니다. `src/routes/+layout.js`의 `load` 함수는 `fetch('/api/now')`를 호출하므로 `/api/now`에 의존합니다.

`src/routes/[...timezone]/+page.svelte`에 1초마다 `invalidate('/api/now')`를 호출하는 `onMount` 콜백을 추가하세요:

```svelte
/// file: src/routes/[...timezone]/+page.svelte
<script>
	+++import { onMount } from 'svelte';+++
	+++import { invalidate } from '$app/navigation';+++

	let { data } = $props();

+++	onMount(() => {
		const interval = setInterval(() => {
			invalidate('/api/now');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});+++
</script>

<h1>
	{new Intl.DateTimeFormat([], {
		timeStyle: 'full',
		timeZone: data.timezone
	}).format(new Date(data.now))}
</h1>
```

> [!NOTE] 특정 URL이 아니라 패턴을 기준으로 무효화하고 싶다면 `invalidate`에 함수를 전달할 수도 있습니다
