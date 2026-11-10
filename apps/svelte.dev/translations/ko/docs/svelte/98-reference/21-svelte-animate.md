---
title: svelte/animate
---



```js
// @noErrors
import { flip } from 'svelte/animate';
```

## flip

flip 함수는 요소의 시작 위치와 끝 위치를 계산하고, x와 y 값을 이동시키며 두 위치 사이를 애니메이션합니다.
`flip`은 [First, Last, Invert, Play](https://aerotwist.com/blog/flip-your-animations/)의 약자입니다.

<div class="ts-block">

```dts
function flip(
	node: Element,
	{
		from,
		to
	}: {
		from: DOMRect;
		to: DOMRect;
	},
	params?: FlipParams
): AnimationConfig;
```

</div>



## AnimationConfig

<div class="ts-block">

```dts
interface AnimationConfig {/*…*/}
```

<div class="ts-block-property">

```dts
delay?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
duration?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
easing?: (t: number) => number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
css?: (t: number, u: number) => string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
tick?: (t: number, u: number) => void;
```

<div class="ts-block-property-details"></div>
</div></div>

## FlipParams

<div class="ts-block">

```dts
interface FlipParams {/*…*/}
```

<div class="ts-block-property">

```dts
delay?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
duration?: number | ((len: number) => number);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
easing?: (t: number) => number;
```

<div class="ts-block-property-details"></div>
</div></div>


