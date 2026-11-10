---
title: transition 지시어
tags: transitions
---

요소가 DOM에 들어오고 나갈 때 부드럽게 트랜지션을 적용하면 더 매력적인 사용자 인터페이스를 만들 수 있습니다. Svelte에서는 `transition` 지시어로 아주 쉽게 할 수 있습니다.

먼저 `svelte/transition`에서 `fade` 함수를 import하고...

```svelte
/// file: App.svelte
<script>
	+++import { fade } from 'svelte/transition';+++

	let visible = $state(true);
</script>
```

...`<p>` 요소에 추가하세요:

```svelte
/// file: App.svelte
<p +++transition:fade+++>
	Fades in and out
</p>
```
