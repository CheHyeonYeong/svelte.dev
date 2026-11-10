---
title: svelte/motion
---



```js
// @noErrors
import {
	Spring,
	Tween,
	prefersReducedMotion,
	spring,
	tweened
} from 'svelte/motion';
```

## Spring

<blockquote class="since note">

5.8.0부터 사용 가능

</blockquote>

스프링처럼 움직이는 값을 감싸는 래퍼입니다. `spring.target`을 바꾸면 `spring.current`가
`spring.stiffness`와 `spring.damping` 매개변수를 반영하며 시간에 걸쳐 그 값으로 다가갑니다.

```svelte
<script>
	import { Spring } from 'svelte/motion';

	const spring = new Spring(0);
</script>

<input type="range" bind:value={spring.target} />
<input type="range" bind:value={spring.current} disabled />
```

<div class="ts-block">

```dts
class Spring<T> {/*…*/}
```

<div class="ts-block-property">

```dts
constructor(value: T, options?: SpringOptions);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
static of<U>(fn: () => U, options?: SpringOptions): Spring<U>;
```

<div class="ts-block-property-details">

값이 `fn`의 반환값에 묶인 스프링을 만듭니다. 이 함수는 반드시
이펙트 루트 안에서(예: 컴포넌트 초기화 중에) 호출해야 합니다.

```svelte
<script>
	import { Spring } from 'svelte/motion';

	let { number } = $props();

	const spring = Spring.of(() => number);
</script>
```

</div>
</div>

<div class="ts-block-property">

```dts
set(value: T, options?: SpringUpdateOptions): Promise<void>;
```

<div class="ts-block-property-details">

`spring.target`을 `value`로 설정하고, `spring.current`가 그 값을 따라잡으면(따라잡는다면) 이행되는 `Promise`를 반환합니다.

`options.instant`가 `true`이면 `spring.current`가 즉시 `spring.target`과 같아집니다.

`options.preserveMomentum`을 지정하면 스프링은 지정한 밀리초 동안
현재 궤적을 그대로 유지합니다. '플링(fling)' 제스처 같은 곳에 유용합니다.

</div>
</div>

<div class="ts-block-property">

```dts
damping: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
precision: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
stiffness: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
target: T;
```

<div class="ts-block-property-details">

스프링의 최종 값입니다.
이 속성은 `Spring` 클래스에만 있으며, 레거시 `spring` 스토어에는 없습니다.

</div>
</div>

<div class="ts-block-property">

```dts
get current(): T;
```

<div class="ts-block-property-details">

스프링의 현재 값입니다.
이 속성은 `Spring` 클래스에만 있으며, 레거시 `spring` 스토어에는 없습니다.

</div>
</div></div>



## Tween

<blockquote class="since note">

5.8.0부터 사용 가능

</blockquote>

목표 값까지 부드럽게 트윈되는 값을 감싸는 래퍼입니다. `tween.target`을 바꾸면 `tween.current`가
`delay`, `duration`, `easing` 옵션을 반영하며 시간에 걸쳐 그 값으로 다가갑니다.

```svelte
<script>
	import { Tween } from 'svelte/motion';

	const tween = new Tween(0);
</script>

<input type="range" bind:value={tween.target} />
<input type="range" bind:value={tween.current} disabled />
```

<div class="ts-block">

```dts
class Tween<T> {/*…*/}
```

<div class="ts-block-property">

```dts
static of<U>(fn: () => U, options?: TweenOptions<U> | undefined): Tween<U>;
```

<div class="ts-block-property-details">

값이 `fn`의 반환값에 묶인 트윈을 만듭니다. 이 함수는 반드시
이펙트 루트 안에서(예: 컴포넌트 초기화 중에) 호출해야 합니다.

```svelte
<script>
	import { Tween } from 'svelte/motion';

	let { number } = $props();

	const tween = Tween.of(() => number);
</script>
```

</div>
</div>

<div class="ts-block-property">

```dts
constructor(value: T, options?: TweenOptions<T>);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
set(value: T, options?: TweenOptions<T> | undefined): Promise<void>;
```

<div class="ts-block-property-details">

`tween.target`을 `value`로 설정하고, `tween.current`가 그 값을 따라잡으면(따라잡는다면) 이행되는 `Promise`를 반환합니다.

`options`를 지정하면 트윈의 기본값을 덮어씁니다.

</div>
</div>

<div class="ts-block-property">

```dts
get current(): T;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
set target(v: T);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
get target(): T;
```

<div class="ts-block-property-details"></div>
</div></div>



## prefersReducedMotion

<blockquote class="since note">

5.7.0부터 사용 가능

</blockquote>

사용자가 [모션 줄이기를 선호](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)하면 일치하는 [미디어 쿼리](/docs/svelte/svelte-reactivity#MediaQuery)입니다.

```svelte
<script>
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>
	toggle
</button>

{#if visible}
	<p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
		flies in, unless the user prefers reduced motion
	</p>
{/if}
```

<div class="ts-block">

```dts
const prefersReducedMotion: MediaQuery;
```

</div>



## spring

<blockquote class="tag deprecated note">

대신 [`Spring`](/docs/svelte/svelte-motion#Spring)을 사용하세요

</blockquote>

Svelte의 spring 함수는 값이 애니메이션되는 스토어를 만들며, 그 움직임은 스프링의 동작을 시뮬레이션합니다. 즉 값이 바뀔 때 일정한 속도로 전환되는 대신, 주어진 물리 매개변수에 따라 스프링처럼 "튕기며" 움직입니다. 이는 트랜지션에 사실감을 더해 사용자 경험을 높여 줄 수 있습니다.

<div class="ts-block">

```dts
function spring<T = any>(
	value?: T | undefined,
	opts?: SpringOptions | undefined
): Spring<T>;
```

</div>



## tweened

<blockquote class="tag deprecated note">

대신 [`Tween`](/docs/svelte/svelte-motion#Tween)을 사용하세요

</blockquote>

Svelte의 tweened 스토어는 시간에 걸쳐 상태 값 사이를 부드럽게 전환해 주는 특별한 종류의 스토어입니다.

<div class="ts-block">

```dts
function tweened<T>(
	value?: T | undefined,
	defaults?: TweenOptions<T> | undefined
): Tweened<T>;
```

</div>



## Spring

<div class="ts-block">

```dts
interface Spring<T> extends Readable<T> {/*…*/}
```

<div class="ts-block-property">

```dts
set(new_value: T, opts?: SpringUpdateOptions): Promise<void>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
update: (fn: Updater<T>, opts?: SpringUpdateOptions) => Promise<void>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 레거시 `spring` 스토어에만 있으며, `Spring` 클래스에는 없습니다

</div>

</div>
</div>

<div class="ts-block-property">

```dts
subscribe(fn: (value: T) => void): Unsubscriber;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 레거시 `spring` 스토어에만 있으며, `Spring` 클래스에는 없습니다

</div>

</div>
</div>

<div class="ts-block-property">

```dts
precision: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
damping: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
stiffness: number;
```

<div class="ts-block-property-details"></div>
</div></div>

## SpringOptions

<div class="ts-block">

```dts
interface SpringOptions {/*…*/}
```

<div class="ts-block-property">

```dts
stiffness?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
damping?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
precision?: number;
```

<div class="ts-block-property-details"></div>
</div></div>

## SpringUpdateOptions

<div class="ts-block">

```dts
interface SpringUpdateOptions {/*…*/}
```

<div class="ts-block-property">

```dts
hard?: any;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> spring 스토어에서만 사용하세요. Spring 클래스에 설정하면 아무 효과가 없습니다

</div>

</div>
</div>

<div class="ts-block-property">

```dts
soft?: string | number | boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> spring 스토어에서만 사용하세요. Spring 클래스에 설정하면 아무 효과가 없습니다

</div>

</div>
</div>

<div class="ts-block-property">

```dts
instant?: boolean;
```

<div class="ts-block-property-details">

Spring 클래스에서만 사용하세요. spring 스토어에 설정하면 아무 효과가 없습니다

</div>
</div>

<div class="ts-block-property">

```dts
preserveMomentum?: number;
```

<div class="ts-block-property-details">

Spring 클래스에서만 사용하세요. spring 스토어에 설정하면 아무 효과가 없습니다

</div>
</div></div>

## TweenOptions

<div class="ts-block">

```dts
interface TweenOptions<T> {/*…*/}
```

<div class="ts-block-property">

```dts
delay?: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
duration?: number | ((from: T, to: T) => number);
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
interpolate?: (a: T, b: T) => (t: number) => T;
```

<div class="ts-block-property-details"></div>
</div></div>

## Tweened

<div class="ts-block">

```dts
interface Tweened<T> extends Readable<T> {/*…*/}
```

<div class="ts-block-property">

```dts
set(value: T, opts?: TweenOptions<T>): Promise<void>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
update(updater: Updater<T>, opts?: TweenOptions<T>): Promise<void>;
```

<div class="ts-block-property-details"></div>
</div></div>

## Updater

<div class="ts-block">

```dts
type Updater<T> = (target_value: T, value: T) => T;
```

</div>


