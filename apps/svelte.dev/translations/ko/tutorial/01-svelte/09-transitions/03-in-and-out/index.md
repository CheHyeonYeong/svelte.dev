---
title: in과 out
---

`transition` 지시어 대신 요소에 `in`이나 `out` 지시어를 주거나, 둘 다 함께 줄 수 있습니다. `fly`와 함께 `fade`를 import하고...

```js
/// file: App.svelte
import { +++fade+++, fly } from 'svelte/transition';
```

...`transition` 지시어를 별도의 `in`과 `out` 지시어로 바꾸세요:

```svelte
/// file: App.svelte
<p +++in+++:fly={{ y: 200, duration: 2000 }} +++out:fade+++>
	Flies in, +++fades out+++
</p>
```

이 경우에는 트랜지션이 되돌려지지 *않습니다*.
