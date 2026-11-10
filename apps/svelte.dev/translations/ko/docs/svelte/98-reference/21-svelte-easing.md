---
title: svelte/easing
---

이 모듈은 시간 값을 여러 방식으로 조작할 수 있는 함수들을 제공합니다. 특히 `motion` 모듈과 함께 애니메이션에 사용할 때 유용합니다.



```js
// @noErrors
import {
	backIn,
	backInOut,
	backOut,
	bounceIn,
	bounceInOut,
	bounceOut,
	circIn,
	circInOut,
	circOut,
	cubicIn,
	cubicInOut,
	cubicOut,
	elasticIn,
	elasticInOut,
	elasticOut,
	expoIn,
	expoInOut,
	expoOut,
	linear,
	quadIn,
	quadInOut,
	quadOut,
	quartIn,
	quartInOut,
	quartOut,
	quintIn,
	quintInOut,
	quintOut,
	sineIn,
	sineInOut,
	sineOut
} from 'svelte/easing';
```

## backIn

시작 부분에 반동 효과를 줍니다.

<div class="ts-block">

```dts
function backIn(t: number): number;
```

</div>



## backInOut

값 범위의 시작과 끝 부분에 반동 효과를 줍니다.

<div class="ts-block">

```dts
function backInOut(t: number): number;
```

</div>



## backOut

끝 부분에 반동 효과를 줍니다.

<div class="ts-block">

```dts
function backOut(t: number): number;
```

</div>



## bounceIn

시작 부분에 튕기는 효과를 줍니다.

<div class="ts-block">

```dts
function bounceIn(t: number): number;
```

</div>



## bounceInOut

시작과 끝 부분에 튕기는 효과를 줍니다.

<div class="ts-block">

```dts
function bounceInOut(t: number): number;
```

</div>



## bounceOut

끝 부분에 튕기는 효과를 줍니다.

<div class="ts-block">

```dts
function bounceOut(t: number): number;
```

</div>



## circIn

원형 효과로, 시작 부분에서 가속합니다.

<div class="ts-block">

```dts
function circIn(t: number): number;
```

</div>



## circInOut

원형 효과로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function circInOut(t: number): number;
```

</div>



## circOut

원형 효과로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function circOut(t: number): number;
```

</div>



## cubicIn

3차 함수 스케일링으로, 시작 부분에서 가속합니다

<div class="ts-block">

```dts
function cubicIn(t: number): number;
```

</div>



## cubicInOut

3차 함수 스케일링으로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function cubicInOut(t: number): number;
```

</div>



## cubicOut

3차 함수 스케일링으로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function cubicOut(t: number): number;
```

</div>



## elasticIn

시작 부분에 탄성 효과를 줍니다.

<div class="ts-block">

```dts
function elasticIn(t: number): number;
```

</div>



## elasticInOut

시작과 끝 부분에 탄성 효과를 줍니다.

<div class="ts-block">

```dts
function elasticInOut(t: number): number;
```

</div>



## elasticOut

끝 부분에 탄성 효과를 줍니다.

<div class="ts-block">

```dts
function elasticOut(t: number): number;
```

</div>



## expoIn

시작 부분에 지수 효과를 줍니다.

<div class="ts-block">

```dts
function expoIn(t: number): number;
```

</div>



## expoInOut

시작과 끝 부분에 지수 효과를 줍니다.

<div class="ts-block">

```dts
function expoInOut(t: number): number;
```

</div>



## expoOut

끝 부분에 지수 효과를 줍니다.

<div class="ts-block">

```dts
function expoOut(t: number): number;
```

</div>



## linear

값을 그대로 반환합니다.

<div class="ts-block">

```dts
function linear(t: number): number;
```

</div>



## quadIn

2차 함수 스케일링으로, 시작 부분에서 가속합니다.

<div class="ts-block">

```dts
function quadIn(t: number): number;
```

</div>



## quadInOut

2차 함수 스케일링으로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quadInOut(t: number): number;
```

</div>



## quadOut

2차 함수 스케일링으로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quadOut(t: number): number;
```

</div>



## quartIn

4차 함수 스케일링으로, 시작 부분에서 가속합니다.

<div class="ts-block">

```dts
function quartIn(t: number): number;
```

</div>



## quartInOut

4차 함수 스케일링으로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quartInOut(t: number): number;
```

</div>



## quartOut

4차 함수 스케일링으로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quartOut(t: number): number;
```

</div>



## quintIn

5차 함수 스케일링으로, 시작 부분에서 가속합니다.

<div class="ts-block">

```dts
function quintIn(t: number): number;
```

</div>



## quintInOut

5차 함수 스케일링으로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quintInOut(t: number): number;
```

</div>



## quintOut

5차 함수 스케일링으로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function quintOut(t: number): number;
```

</div>



## sineIn

사인 곡선 효과로, 시작 부분에서 가속합니다.

<div class="ts-block">

```dts
function sineIn(t: number): number;
```

</div>



## sineInOut

사인 곡선 효과로, 시작 부분에서 가속하고 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function sineInOut(t: number): number;
```

</div>



## sineOut

사인 곡선 효과로, 끝으로 갈수록 감속합니다.

<div class="ts-block">

```dts
function sineOut(t: number): number;
```

</div>




