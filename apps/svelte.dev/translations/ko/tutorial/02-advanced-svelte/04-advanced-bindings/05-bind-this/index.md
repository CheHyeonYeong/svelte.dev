---
title: bind:this
---

특별한 `bind:this` 지시어를 사용하면 컴포넌트 안의 요소에 대한 읽기 전용 바인딩을 얻을 수 있습니다.

이 연습 문제의 `$effect`는 캔버스 컨텍스트를 만들려고 하지만, `canvas`가 `undefined`입니다. 먼저 컴포넌트의 최상위에서 `canvas`를 선언하고...

```svelte
/// file: App.svelte
<script>
	import { paint } from './gradient.js';

	+++let canvas;+++

	$effect(() => {
		// ...
	});
</script>
```

...그런 다음 `<canvas>` 요소에 지시어를 추가하세요:

```svelte
/// file: App.svelte
<canvas +++bind:this={canvas}+++></canvas>
```

컴포넌트가 마운트될 때까지 `canvas`의 값은 `undefined`로 남아 있다는 점에 유의하세요. 다시 말해 `$effect`가 실행되기 전에는 접근할 수 없습니다.
