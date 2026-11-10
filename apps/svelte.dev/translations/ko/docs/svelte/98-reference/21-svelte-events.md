---
title: svelte/events
---



```js
// @noErrors
import { on } from 'svelte/events';
```

## on

window에 이벤트 핸들러를 붙이고, 그 핸들러를 제거하는 함수를 반환합니다. `addEventListener` 대신
이 함수를 사용하면, 성능상의 이유로 이벤트 위임을 사용하는 선언적 핸들러(`onclick` 같은 속성으로 추가한 핸들러)와의
상대적인 순서가 올바르게 유지됩니다

<div class="ts-block">

```dts
function on<Type extends keyof WindowEventMap>(
	window: Window,
	type: Type,
	handler: (
		this: Window,
		event: WindowEventMap[Type] & { currentTarget: Window }
	) => any,
	options?: AddEventListenerOptions | undefined
): () => void;
```

</div>

<div class="ts-block">

```dts
function on<Type extends keyof DocumentEventMap>(
	document: Document,
	type: Type,
	handler: (
		this: Document,
		event: DocumentEventMap[Type] & {
			currentTarget: Document;
		}
	) => any,
	options?: AddEventListenerOptions | undefined
): () => void;
```

</div>

<div class="ts-block">

```dts
function on<
	Element extends HTMLElement,
	Type extends keyof HTMLElementEventMap
>(
	element: Element,
	type: Type,
	handler: (
		this: Element,
		event: HTMLElementEventMap[Type] & {
			currentTarget: Element;
		}
	) => any,
	options?: AddEventListenerOptions | undefined
): () => void;
```

</div>

<div class="ts-block">

```dts
function on<
	Element extends MediaQueryList,
	Type extends keyof MediaQueryListEventMap
>(
	element: Element,
	type: Type,
	handler: (
		this: Element,
		event: MediaQueryListEventMap[Type] & {
			currentTarget: Element;
		}
	) => any,
	options?: AddEventListenerOptions | undefined
): () => void;
```

</div>

<div class="ts-block">

```dts
function on(
	element: EventTarget,
	type: string,
	handler: EventListener,
	options?: AddEventListenerOptions | undefined
): () => void;
```

</div>




