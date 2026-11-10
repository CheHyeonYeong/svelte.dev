---
title: svelte/store
---



```js
// @noErrors
import {
	derived,
	fromStore,
	get,
	readable,
	readonly,
	toStore,
	writable
} from 'svelte/store';
```

## derived

하나 이상의 readable 스토어를 동기화하고 입력 값에 집계 함수를 적용해
값을 파생하는 스토어입니다.

<div class="ts-block">

```dts
function derived<S extends Stores, T>(
	stores: S,
	fn: (
		values: StoresValues<S>,
		set: (value: T) => void,
		update: (fn: Updater<T>) => void
	) => Unsubscriber | void,
	initial_value?: T | undefined
): Readable<T>;
```

</div>

<div class="ts-block">

```dts
function derived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T,
	initial_value?: T | undefined
): Readable<T>;
```

</div>



## fromStore

<div class="ts-block">

```dts
function fromStore<V>(store: Writable<V>): {
	current: V;
};
```

</div>

<div class="ts-block">

```dts
function fromStore<V>(store: Readable<V>): {
	readonly current: V;
};
```

</div>



## get

스토어를 구독한 뒤 즉시 구독을 해지해 현재 값을 가져옵니다.

<div class="ts-block">

```dts
function get<T>(store: Readable<T>): T;
```

</div>



## readable

구독으로 값을 읽을 수 있는 `Readable` 스토어를 만듭니다.

<div class="ts-block">

```dts
function readable<T>(
	value?: T | undefined,
	start?: StartStopNotifier<T> | undefined
): Readable<T>;
```

</div>



## readonly

스토어를 받아, 기존 스토어에서 파생된 읽기 전용 스토어를 새로 반환합니다.

<div class="ts-block">

```dts
function readonly<T>(store: Readable<T>): Readable<T>;
```

</div>



## toStore

<div class="ts-block">

```dts
function toStore<V>(
	get: () => V,
	set: (v: V) => void
): Writable<V>;
```

</div>

<div class="ts-block">

```dts
function toStore<V>(get: () => V): Readable<V>;
```

</div>



## writable

구독으로 값을 읽을 수도 있고 업데이트할 수도 있는 `Writable` 스토어를 만듭니다.

<div class="ts-block">

```dts
function writable<T>(
	value?: T | undefined,
	start?: StartStopNotifier<T> | undefined
): Writable<T>;
```

</div>



## Readable

구독을 위한 Readable 인터페이스입니다.

<div class="ts-block">

```dts
interface Readable<T> {/*…*/}
```

<div class="ts-block-property">

```dts
subscribe(this: void, run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `run` 구독 콜백
- `invalidate` 정리 콜백

</div>

값의 변경을 구독합니다.

</div>
</div></div>

## StartStopNotifier

알림 시작 및 중지 콜백입니다.
이 함수는 첫 번째 구독자가 구독할 때 호출됩니다.

<div class="ts-block">

```dts
type StartStopNotifier<T> = (
	set: (value: T) => void,
	update: (fn: Updater<T>) => void
) => void | (() => void);
```

</div>

## Subscriber

값 업데이트를 알리는 콜백입니다.

<div class="ts-block">

```dts
type Subscriber<T> = (value: T) => void;
```

</div>

## Unsubscriber

값 업데이트 구독을 해지합니다.

<div class="ts-block">

```dts
type Unsubscriber = () => void;
```

</div>

## Updater

값을 업데이트하는 콜백입니다.

<div class="ts-block">

```dts
type Updater<T> = (value: T) => T;
```

</div>

## Writable

업데이트와 구독을 모두 지원하는 Writable 인터페이스입니다.

<div class="ts-block">

```dts
interface Writable<T> extends Readable<T> {/*…*/}
```

<div class="ts-block-property">

```dts
set(this: void, value: T): void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `value` 설정할 값

</div>

값을 설정하고 구독자에게 알립니다.

</div>
</div>

<div class="ts-block-property">

```dts
update(this: void, updater: Updater<T>): void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `updater` 콜백

</div>

콜백으로 값을 업데이트하고 구독자에게 알립니다.

</div>
</div></div>


