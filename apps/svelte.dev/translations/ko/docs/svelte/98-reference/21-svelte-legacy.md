---
title: svelte/legacy
---

이 모듈은 마이그레이션 중에 사용할 수 있는 여러 함수를 제공합니다. 일부 기능은 새 기능으로 일대일 대체할 수 없기 때문입니다. 모든 import는 지원 중단(deprecated)으로 표시되어 있으며, 시간을 두고 점차 다른 방식으로 마이그레이션해야 합니다.



```js
// @noErrors
import {
	asClassComponent,
	createBubbler,
	createClassComponent,
	handlers,
	nonpassive,
	once,
	passive,
	preventDefault,
	run,
	self,
	stopImmediatePropagation,
	stopPropagation,
	trusted
} from 'svelte/legacy';
```

## asClassComponent

<blockquote class="tag deprecated note">

명령형 컴포넌트 코드를 Svelte 5로 마이그레이션하기 위한 임시방편으로만 사용하세요.

</blockquote>

컴포넌트 함수를 받아 Svelte 4와 호환되는 컴포넌트 생성자를 반환합니다.

<div class="ts-block">

```dts
function asClassComponent<
	Props extends Record<string, any>,
	Exports extends Record<string, any>,
	Events extends Record<string, any>,
	Slots extends Record<string, any>
>(
	component:
		| SvelteComponent<Props, Events, Slots>
		| Component<Props>
): ComponentType<
	SvelteComponent<Props, Events, Slots> & Exports
>;
```

</div>



## createBubbler

<blockquote class="tag deprecated note">

Svelte 5에서 자동으로 위임되던 이벤트를 마이그레이션하기 위한 임시방편으로만 사용하세요.

</blockquote>

Svelte 4에서 핸들러 없이 쓰던 `on:click`의 동작을 흉내 내는 `bubble` 함수를 만드는 함수입니다.

<div class="ts-block">

```dts
function createBubbler(): (
	type: string
) => (event: Event) => boolean;
```

</div>



## createClassComponent

<blockquote class="tag deprecated note">

명령형 컴포넌트 코드를 Svelte 5로 마이그레이션하기 위한 임시방편으로만 사용하세요.

</blockquote>

Svelte 4 컴포넌트와 같은 옵션과 컴포넌트 함수를 받아 Svelte 4와 호환되는 컴포넌트를 반환합니다.

<div class="ts-block">

```dts
function createClassComponent<
	Props extends Record<string, any>,
	Exports extends Record<string, any>,
	Events extends Record<string, any>,
	Slots extends Record<string, any>
>(
	options: ComponentConstructorOptions<Props> & {
		component:
			| ComponentType<SvelteComponent<Props, Events, Slots>>
			| Component<Props>;
	}
): SvelteComponent<Props, Events, Slots> & Exports;
```

</div>



## handlers

Svelte 4에서 쓸 수 있던 다중 리스너를 흉내 내는 함수입니다

<div class="ts-block">

```dts
function handlers(
	...handlers: EventListener[]
): EventListener;
```

</div>



## nonpassive

`nonpassive` 이벤트 수식어를 대체하며, 액션으로 구현되어 있습니다

<div class="ts-block">

```dts
function nonpassive(
	node: HTMLElement,
	[event, handler]: [
		event: string,
		handler: () => EventListener
	]
): void;
```

</div>



## once

`once` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function once(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## passive

`passive` 이벤트 수식어를 대체하며, 액션으로 구현되어 있습니다

<div class="ts-block">

```dts
function passive(
	node: HTMLElement,
	[event, handler]: [
		event: string,
		handler: () => EventListener
	]
): void;
```

</div>



## preventDefault

`preventDefault` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function preventDefault(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## run

<blockquote class="tag deprecated note">

컴포넌트 코드를 Svelte 5로 마이그레이션하기 위한 임시방편으로만 사용하세요.

</blockquote>

주어진 함수를 서버에서는 즉시 한 번 실행하고, 클라이언트에서는 `$effect.pre`처럼 동작합니다.

<div class="ts-block">

```dts
function run(fn: () => void | (() => void)): void;
```

</div>



## self

`self` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function self(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## stopImmediatePropagation

`stopImmediatePropagation` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function stopImmediatePropagation(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## stopPropagation

`stopPropagation` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function stopPropagation(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## trusted

`trusted` 이벤트 수식어를 대체합니다

<div class="ts-block">

```dts
function trusted(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;
```

</div>



## LegacyComponentType

전환 기간 동안 컴포넌트를 클래스와 함수 양쪽으로 사용할 수 있도록 지원합니다

<div class="ts-block">

```dts
type LegacyComponentType = {
	new (o: ComponentConstructorOptions): SvelteComponent;
	(
		...args: Parameters<Component<Record<string, any>>>
	): ReturnType<
		Component<Record<string, any>, Record<string, any>>
	>;
};
```

</div>


