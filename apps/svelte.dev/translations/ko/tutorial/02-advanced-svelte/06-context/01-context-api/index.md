---
title: setContext와 getContext
---

컨텍스트 API는 데이터와 함수를 props로 주고받거나 이벤트를 잔뜩 디스패치하지 않고도 컴포넌트끼리 '대화'할 수 있는 방법을 제공합니다. 고급 기능이지만 유용합니다. 이 연습 문제에서는 컨텍스트 API를 사용해 제너러티브 아트의 선구자 중 한 명인 George Nees의 [Schotter](https://collections.vam.ac.uk/item/O221321/schotter-print-nees-georg/)를 재현해 보겠습니다.

`Canvas.svelte` 안에는 캔버스에 항목을 추가하는 `addItem` 함수가 있습니다. `setContext`를 사용하면 이 함수를 `<Square>`처럼 `<Canvas>` 안에 있는 컴포넌트에서 사용할 수 있게 만들 수 있습니다:

```js
/// file: Canvas.svelte
+++import { setContext } from 'svelte';+++
import { SvelteSet } from 'svelte/reactivity';

let { width = 100, height = 100, children } = $props();

let canvas;
let items = new SvelteSet();

+++setContext('canvas', { addItem });+++

function addItem(fn) {
	$effect(() => {
		items.add(fn);
		return () => items.delete(fn);
	});
}
```

이제 자식 컴포넌트 안에서는, 말 그대로 `getContext`로 컨텍스트를 가져올 수 있습니다:

```js
/// file: Square.svelte
+++import { getContext } from 'svelte';+++

let { x, y, size, rotate } = $props();

+++getContext('canvas').addItem(draw);+++
```

지금까지는... 지루하네요. 그리드에 무작위성을 더해 봅시다:

```svelte
/// file: App.svelte
<div class="container">
	<Canvas width={800} height={1200}>
		{#each Array(12) as _, c}
			{#each Array(22) as _, r}
				<Square
					x={180 + c * 40+++ + jitter(r * 2)+++}
					y={180 + r * 40+++ + jitter(r * 2)+++}
					size={40}
					+++rotate={jitter(r * 0.05)}+++
				/>
			{/each}
		{/each}
	</Canvas>
</div>
```

컨텍스트가 올바르게 연결되도록 `setContext`와 `getContext`는 컴포넌트 초기화 중에 호출해야 합니다. 키(여기서는 `'canvas'`)는 문자열이 아닌 값을 포함해 무엇이든 될 수 있으며, 이는 누가 컨텍스트에 접근할 수 있는지 제어할 때 유용합니다.

> [!NOTE] 컨텍스트 객체에는 반응형 상태를 포함해 무엇이든 담을 수 있습니다. 이를 통해 시간에 따라 바뀌는 값을 자식 컴포넌트에 전달할 수 있습니다:
>
> ```js
> // in a parent component
> import { setContext } from 'svelte';
>
> let context = $state({...});
> setContext('my-context', context);
> ```
>
> ```js
> // in a child component
> import { getContext } from 'svelte';
>
> const context = getContext('my-context');
> ```
