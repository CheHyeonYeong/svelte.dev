---
title: 스토어
---

<!-- - how to use
- how to write
- TODO should the details for the store methods belong to the reference section? -->

*스토어*는 단순한 *스토어 계약*(store contract)을 통해 값에 반응형으로 접근할 수 있게 해 주는 객체입니다. [`svelte/store` 모듈](../svelte-store)에는 이 계약을 충족하는 최소한의 스토어 구현이 들어 있습니다.

스토어에 대한 참조가 있다면 언제든 컴포넌트 안에서 이름 앞에 `$` 문자를 붙여 그 값에 접근할 수 있습니다. 그러면 Svelte는 접두사가 붙은 변수를 선언하고, 컴포넌트 초기화 시점에 스토어를 구독하며, 적절한 때에 구독을 해지합니다.

`$` 접두사가 붙은 변수에 값을 할당하려면 그 변수가 쓰기 가능한 스토어여야 하며, 할당하면 스토어의 `.set` 메서드가 호출됩니다.

스토어는 컴포넌트의 최상위에 선언해야 한다는 점에 유의하세요. 예를 들어 `if` 블록이나 함수 안에 선언하면 안 됩니다.

(스토어 값을 나타내지 않는) 지역 변수에는 `$` 접두사를 붙이면 *안 됩니다*.

```svelte
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);
	console.log($count); // logs 0

	count.set(1);
	console.log($count); // logs 1

	$count = 2;
	console.log($count); // logs 2
</script>
```

## 스토어를 언제 사용할까 <!-- When to use stores -->

Svelte 5 이전에는 컴포넌트 간에 공유하는 반응형 상태를 만들거나 로직을 추출할 때 스토어가 기본 해법이었습니다. 룬이 등장하면서 이런 용도는 크게 줄었습니다.

- 로직을 추출할 때는 룬의 범용 반응성을 활용하는 편이 낫습니다. 룬은 컴포넌트 최상위 밖에서도 쓸 수 있고, JavaScript나 TypeScript 파일에도 넣을 수 있습니다(`.svelte.js` 또는 `.svelte.ts` 확장자 사용)
- 공유 상태를 만들 때는 필요한 값을 담은 `$state` 객체를 만든 다음 그 상태를 조작하면 됩니다

```ts
/// file: state.svelte.js
export const userState = $state({
	name: 'name',
	/* ... */
});
```

```svelte
<!--- file: App.svelte --->
<script>
	import { userState } from './state.svelte.js';
</script>

<p>User name: {userState.name}</p>
<button onclick={() => {
	userState.name = 'new name';
}}>
	change name
</button>
```

복잡한 비동기 데이터 스트림을 다루거나, 값을 업데이트하고 변경을 감지하는 과정을 좀 더 수동으로 제어해야 할 때는 여전히 스토어가 좋은 해법입니다. RxJs에 익숙하고 그 지식을 재사용하고 싶다면 `$`도 유용할 것입니다.

## svelte/store

`svelte/store` 모듈에는 스토어 계약을 충족하는 최소한의 스토어 구현이 들어 있습니다. 외부에서 업데이트할 수 있는 스토어와 내부에서만 업데이트할 수 있는 스토어를 만드는 메서드, 그리고 스토어를 조합하고 파생하는 메서드를 제공합니다.

### `writable`

컴포넌트 '바깥'에서 값을 설정할 수 있는 스토어를 만드는 함수입니다. 추가로 `set`과 `update` 메서드를 가진 객체로 만들어집니다.

`set`은 설정할 값 하나를 인수로 받는 메서드입니다. 스토어 값이 이미 인수 값과 같지 않으면 스토어 값이 인수 값으로 설정됩니다.

`update`는 콜백 하나를 인수로 받는 메서드입니다. 콜백은 기존 스토어 값을 인수로 받아 스토어에 설정할 새 값을 반환합니다.

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
	console.log(value);
}); // logs '0'

count.set(1); // logs '1'

count.update((n) => n + 1); // logs '2'
```

두 번째 인수로 함수를 전달하면, 그 함수는 구독자 수가 0에서 1이 될 때 호출됩니다(1에서 2가 될 때 등에는 호출되지 않습니다). 이 함수에는 스토어 값을 바꾸는 `set` 함수와, 스토어의 `update` 메서드처럼 이전 값으로 새 값을 계산하는 콜백을 받는 `update` 함수가 전달됩니다. 이 함수는 구독자 수가 1에서 0이 될 때 호출되는 `stop` 함수를 반환해야 합니다.

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0, () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});

count.set(1); // does nothing

const unsubscribe = count.subscribe((value) => {
	console.log(value);
}); // logs 'got a subscriber', then '1'

unsubscribe(); // logs 'no more subscribers'
```

`writable`의 값은 제거될 때(예를 들어 페이지를 새로고침할 때) 사라진다는 점에 유의하세요. 하지만 값을 `localStorage` 같은 곳에 동기화하는 로직을 직접 작성할 수 있습니다.

### `readable`

'바깥'에서 값을 설정할 수 없는 스토어를 만듭니다. 첫 번째 인수는 스토어의 초기값이고, `readable`의 두 번째 인수는 `writable`의 두 번째 인수와 같습니다.

```ts
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);

	return () => clearInterval(interval);
});
```

### `derived`

하나 이상의 다른 스토어로부터 스토어를 파생합니다. 콜백은 첫 구독자가 구독할 때 처음 실행되고, 이후에는 스토어 의존성이 바뀔 때마다 실행됩니다.

가장 단순한 형태에서 `derived`는 스토어 하나를 받고, 콜백은 파생된 값을 반환합니다.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const doubled = derived(a, ($a) => $a * 2);
```

콜백은 두 번째 인수 `set`과 선택적인 세 번째 인수 `update`를 받아, 적절한 때 둘 중 하나 또는 둘 다를 호출함으로써 값을 비동기로 설정할 수 있습니다.

이 경우 `derived`에 세 번째 인수로 `set`이나 `update`가 처음 호출되기 전까지 쓰일 파생 스토어의 초기값을 넘길 수도 있습니다. 초기값을 지정하지 않으면 스토어의 초기값은 `undefined`가 됩니다.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// @errors: 18046 2769 7006
// ---cut---
import { derived } from 'svelte/store';

const delayed = derived(
	a,
	($a, set) => {
		setTimeout(() => set($a), 1000);
	},
	2000
);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update((x) => x + 1), 1000);
	// every time $a produces a value, this produces two
	// values, $a immediately and then $a + 1 a second later
});
```

콜백에서 함수를 반환하면, 그 함수는 a) 콜백이 다시 실행될 때나 b) 마지막 구독자가 구독을 해지할 때 호출됩니다.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const frequency: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => {
			set(Date.now());
		}, 1000 / $frequency);

		return () => {
			clearInterval(interval);
		};
	},
	2000
);
```

두 경우 모두 첫 번째 인수로 스토어 하나 대신 인수 배열을 넘길 수 있습니다.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
	const b: Writable<number>;
}

export {};

// @filename: index.ts

// ---cut---
import { derived } from 'svelte/store';

const summed = derived([a, b], ([$a, $b]) => $a + $b);

const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

### `readonly`

이 간단한 헬퍼 함수는 스토어를 읽기 전용으로 만듭니다. 이 새로운 readable 스토어로도 원래 스토어의 변경을 계속 구독할 수 있습니다.

```js
import { readonly, writable } from 'svelte/store';

const writableStore = writable(1);
const readableStore = readonly(writableStore);

readableStore.subscribe(console.log);

writableStore.set(2); // console: 2
// @errors: 2339
readableStore.set(2); // ERROR
```

### `get`

일반적으로 스토어의 값은 구독해서 시간에 따라 바뀌는 값을 사용하는 방식으로 읽어야 합니다. 가끔은 구독하지 않은 스토어의 값을 가져와야 할 때가 있는데, `get`을 쓰면 그렇게 할 수 있습니다.

> [!NOTE] 이 함수는 구독을 만들고 값을 읽은 다음 구독을 해지하는 방식으로 동작합니다. 그래서 자주 실행되는 코드 경로에서는 권장하지 않습니다.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const store: Writable<string>;
}

export {};

// @filename: index.ts
// ---cut---
import { get } from 'svelte/store';

const value = get(store);
```

## 스토어 계약 <!-- Store contract -->

```ts
// @noErrors
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

*스토어 계약*을 구현하면 [`svelte/store`](../svelte-store)에 의존하지 않고도 직접 스토어를 만들 수 있습니다:

1. 스토어에는 구독 함수를 인수로 받는 `.subscribe` 메서드가 있어야 합니다. 이 구독 함수는 `.subscribe`가 호출되는 즉시 스토어의 현재 값으로 동기적으로 호출되어야 합니다. 이후 스토어 값이 바뀔 때마다 활성화된 모든 구독 함수가 동기적으로 호출되어야 합니다.
2. `.subscribe` 메서드는 구독 해지 함수를 반환해야 합니다. 구독 해지 함수를 호출하면 해당 구독이 중지되어야 하며, 스토어는 그에 대응하는 구독 함수를 다시 호출해서는 안 됩니다.
3. 스토어에는 *선택적으로* `.set` 메서드가 있을 수 있습니다. 이 메서드는 스토어의 새 값을 인수로 받아야 하며, 스토어의 활성화된 모든 구독 함수를 동기적으로 호출합니다. 이런 스토어를 *쓰기 가능한 스토어*(writable store)라고 합니다.

RxJS Observable과의 상호 운용을 위해 `.subscribe` 메서드는 구독 해지 함수를 직접 반환하는 대신 `.unsubscribe` 메서드를 가진 객체를 반환해도 됩니다. 다만 `.subscribe`가 구독 함수를 동기적으로 호출하지 않는 한(Observable 명세는 이를 요구하지 않습니다), Svelte는 호출이 일어날 때까지 스토어 값을 `undefined`로 봅니다.
