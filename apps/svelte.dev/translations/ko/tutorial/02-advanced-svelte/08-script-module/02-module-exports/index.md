---
title: 모듈 export
---

`module` script 블록에서 export한 것은 모두 모듈 자체의 export가 됩니다. `pauseAll` 함수를 export해 봅시다:

```svelte
/// file: AudioPlayer.svelte
<script module>
	let current;

+++	export function pauseAll() {
		current?.pause();
	}+++
</script>
```

이제 `App.svelte`에서 `pauseAll`을 import하고...

```svelte
/// file: App.svelte
<script>
	import AudioPlayer, +++{ pauseAll }+++ from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>
```

...이벤트 핸들러에서 사용할 수 있습니다:

```svelte
/// file: App.svelte
<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}

+++	<button onclick={pauseAll}>
		pause all
	</button>+++
</div>
```

> [!NOTE] 컴포넌트 자체가 기본 export이므로 기본 export를 따로 둘 수는 없습니다.
