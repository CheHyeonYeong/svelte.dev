---
title: svelte/transition
tags: transitions
---

이 모듈은 [`transition:`](transition) 지시어와 함께 사용할 수 있는 내장 트랜지션 함수를 제공합니다.



```js
// @noErrors
import {
	blur,
	crossfade,
	draw,
	fade,
	fly,
	scale,
	slide
} from 'svelte/transition';
```

## blur

요소의 불투명도와 함께 `blur` 필터를 애니메이션합니다.

<div class="ts-block">

```dts
function blur(
	node: Element,
	{
		delay,
		duration,
		easing,
		amount,
		opacity
	}?: BlurParams | undefined
): TransitionConfig;
```

</div>



## crossfade

`crossfade` 함수는 `send`와 `receive`라는 한 쌍의 [트랜지션](/docs/svelte/transition)을 만듭니다. 요소가 'send'되면 'receive'되는 대응 요소를 찾아, 요소를 그 대응 요소의 위치로 변형하면서 페이드 아웃하는 트랜지션을 생성합니다. 요소가 'receive'될 때는 그 반대가 일어납니다. 대응 요소가 없으면 `fallback` 트랜지션이 사용됩니다.

<div class="ts-block">

```dts
function crossfade({
	fallback,
	...defaults
}: CrossfadeParams & {
	fallback?: (
		node: Element,
		params: CrossfadeParams,
		intro: boolean
	) => TransitionConfig;
}): [
	(
		node: any,
		params: CrossfadeParams & {
			key: any;
		}
	) => () => TransitionConfig,
	(
		node: any,
		params: CrossfadeParams & {
			key: any;
		}
	) => () => TransitionConfig
];
```

</div>



## draw

관 속의 뱀처럼 SVG 요소의 선(stroke)을 애니메이션합니다. `in` 트랜지션은 경로가 보이지 않는 상태에서 시작해 시간에 걸쳐 경로를 화면에 그려 나갑니다. `out` 트랜지션은 보이는 상태에서 시작해 경로를 점차 지워 나갑니다. `draw`는 `<path>`, `<polyline>`처럼 `getTotalLength` 메서드가 있는 요소에서만 동작합니다.

<div class="ts-block">

```dts
function draw(
	node: SVGElement & {
		getTotalLength(): number;
	},
	{
		delay,
		speed,
		duration,
		easing
	}?: DrawParams | undefined
): TransitionConfig;
```

</div>



## fade

`in` 트랜지션에서는 요소의 불투명도를 0에서 현재 불투명도까지, `out` 트랜지션에서는 현재 불투명도에서 0까지 애니메이션합니다.

<div class="ts-block">

```dts
function fade(
	node: Element,
	{ delay, duration, easing }?: FadeParams | undefined
): TransitionConfig;
```

</div>



## fly

요소의 x, y 위치와 불투명도를 애니메이션합니다. `in` 트랜지션은 매개변수로 전달된 값에서 요소의 기본값까지 애니메이션합니다. `out` 트랜지션은 요소의 기본값에서 전달된 값까지 애니메이션합니다.

<div class="ts-block">

```dts
function fly(
	node: Element,
	{
		delay,
		duration,
		easing,
		x,
		y,
		opacity
	}?: FlyParams | undefined
): TransitionConfig;
```

</div>



## scale

요소의 불투명도와 크기(scale)를 애니메이션합니다. `in` 트랜지션은 매개변수로 전달된 값에서 요소의 현재(기본) 값까지 애니메이션합니다. `out` 트랜지션은 요소의 기본값에서 전달된 값까지 애니메이션합니다.

<div class="ts-block">

```dts
function scale(
	node: Element,
	{
		delay,
		duration,
		easing,
		start,
		opacity
	}?: ScaleParams | undefined
): TransitionConfig;
```

</div>



## slide

요소를 슬라이드하며 나타내고 사라지게 합니다.

<div class="ts-block">

```dts
function slide(
	node: Element,
	{
		delay,
		duration,
		easing,
		axis
	}?: SlideParams | undefined
): TransitionConfig;
```

</div>



## BlurParams

<div class="ts-block">

```dts
interface BlurParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
amount?: number | string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
opacity?: number;
```

<div class="ts-block-property-details"></div>
</div></div>

## CrossfadeParams

<div class="ts-block">

```dts
interface CrossfadeParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div></div>

## DrawParams

<div class="ts-block">

```dts
interface DrawParams {/*…*/}
```

<div class="ts-block-property">

```dts
delay?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
speed?: number;
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div></div>

## EasingFunction

<div class="ts-block">

```dts
type EasingFunction = (t: number) => number;
```

</div>

## FadeParams

<div class="ts-block">

```dts
interface FadeParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div></div>

## FlyParams

<div class="ts-block">

```dts
interface FlyParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
x?: number | string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
y?: number | string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
opacity?: number;
```

<div class="ts-block-property-details"></div>
</div></div>

## ScaleParams

<div class="ts-block">

```dts
interface ScaleParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
start?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
opacity?: number;
```

<div class="ts-block-property-details"></div>
</div></div>

## SlideParams

<div class="ts-block">

```dts
interface SlideParams {/*…*/}
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
easing?: EasingFunction;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
axis?: 'x' | 'y';
```

<div class="ts-block-property-details"></div>
</div></div>

## TransitionConfig

<div class="ts-block">

```dts
interface TransitionConfig {/*…*/}
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
easing?: EasingFunction;
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


