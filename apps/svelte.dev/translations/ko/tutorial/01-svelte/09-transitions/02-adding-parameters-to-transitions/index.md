---
title: 매개변수 추가하기
---

트랜지션 함수는 매개변수를 받을 수 있습니다. `fade` 트랜지션을 `fly`로 바꾸고...

```svelte
/// file: App.svelte
<script>
	import { +++fly+++ } from 'svelte/transition';

	let visible = $state(true);
</script>
```

...몇 가지 옵션과 함께 `<p>`에 적용하세요:

```svelte
/// file: App.svelte
<p transition:+++fly={{ y: 200, duration: 2000 }}+++>
	+++Flies+++ in and out
</p>
```

트랜지션은 *되돌릴 수 있다*는 점에 주목하세요. 트랜지션이 진행되는 도중에 체크박스를 토글하면 처음이나 끝이 아니라 현재 지점에서부터 트랜지션됩니다.
