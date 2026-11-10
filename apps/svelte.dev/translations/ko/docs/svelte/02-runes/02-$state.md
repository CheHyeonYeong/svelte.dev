---
title: $state
tags: rune-state
---

`$state` 룬을 사용하면 *반응형 상태*를 만들 수 있습니다. 즉, 상태가 바뀌면 UI가 그에 *반응*합니다.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

다른 프레임워크와 달리 상태를 다루기 위한 API가 따로 없습니다. `count`는 객체나 함수가 아니라 그냥 숫자이며, 다른 변수와 똑같이 값을 갱신할 수 있습니다.

### 깊은 상태 <!-- Deep state -->

`$state`를 배열이나 단순 객체와 함께 사용하면, 그 결과는 깊은 반응성을 가진 *상태 프록시*가 됩니다. [프록시](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 덕분에 Svelte는 `array.push(...)` 같은 메서드를 통한 경우를 포함해 속성을 읽거나 쓸 때 코드를 실행할 수 있고, 이를 통해 세분화된 업데이트를 일으킵니다.

상태는 Svelte가 배열이나 단순 객체가 아닌 것(클래스나 `Object.create`로 만든 객체 등)을 만날 때까지 재귀적으로 프록시가 됩니다. 다음과 같은 경우...

```js
let todos = $state([
	{
		done: false,
		text: 'add more todos'
	}
]);
```

...개별 할 일의 속성을 수정하면 UI에서 바로 그 속성에 의존하는 모든 부분이 업데이트됩니다:

```js
let todos = [{ done: false, text: 'add more todos' }];
// ---cut---
todos[0].done = !todos[0].done;
```

배열에 새 객체를 push하면, 그 객체도 프록시가 됩니다:

```js
let todos = [{ done: false, text: 'add more todos' }];
// ---cut---
todos.push({
	done: false,
	text: 'eat lunch'
});
```

> [!NOTE] 프록시의 속성을 업데이트해도 원본 객체는 변경되지 *않습니다*. 상태 프록시 안에서 직접 만든 프록시 핸들러를 사용해야 한다면, [객체를 `$state`로 감싼 *뒤에* 감싸야 합니다](https://svelte.dev/playground/hello-world?version=latest#H4sIAAAAAAAACpWR3WoDIRCFX2UqhWyIJL3erAulL9C7XnQLMe5ksbUqOpsfln33YuyGFNJC8UKdc2bOhw7Myk9kJXsJ0nttO9jcR5KEG9AWJDwHdzwxznbaYGTl68Do5JM_FRifuh-9X8Y9Gkq1rYx4q66cJbQUWcmqqIL2VDe2IYMEbvuOikBADi-GJDSkXG-phId0G-frye2DO2psQYDFQ0Ys8gQO350dUkEydEg82T0GOs0nsSG9g2IqgxACZueo2ZUlpdvoDC6N64qsg1QKY8T2bpZp8gpIfbCQ85Zn50Ud82HkeY83uDjspenxv3jXcSDyjPWf9L1vJf0GH666J-jLu1ery4dV257IWXBWGa0-xFDMQdTTn2ScxWKsn86ROsLwQxqrVR5QM84Ij8TKFD2-cUZSm4O2LSt30kQcvwCgCmfZnAIAAA==).

반응형 값을 구조 분해하면, 그렇게 얻은 참조는 반응형이 아니라는 점에 유의하세요. 일반 JavaScript와 마찬가지로 구조 분해하는 시점에 평가됩니다:

```js
let todos = [{ done: false, text: 'add more todos' }];
// ---cut---
let { done, text } = todos[0];

// this will not affect the value of `done`
todos[0].done = !todos[0].done;
```

### 클래스 <!-- Classes -->

클래스 인스턴스는 프록시가 되지 않습니다. 대신 클래스 필드(public이든 private이든)에서 `$state`를 사용하거나, `constructor` 안에서 속성에 처음 할당할 때 바로 사용할 수 있습니다:

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```

> [!NOTE] 컴파일러는 `done`과 `text`를 private 필드를 참조하는 클래스 프로토타입의 `get`/`set` 메서드로 변환합니다. 따라서 이 속성들은 열거할 수 없습니다.

JavaScript에서 메서드를 호출할 때는 [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)의 값이 중요합니다. 다음 코드는 동작하지 않는데, `reset` 메서드 안의 `this`가 `Todo`가 아니라 `<button>`이 되기 때문입니다:

```svelte
<button onclick={todo.reset}>
	reset
</button>
```

인라인 함수를 사용하거나...

```svelte
<button onclick=+++{() => todo.reset()}>+++
	reset
</button>
```

...클래스 정의에서 화살표 함수를 사용하세요:

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	+++reset = () => {+++
		this.text = '';
		this.done = false;
	}
}
```

### 내장 클래스 <!-- Built-in classes -->

Svelte는 `Set`, `Map`, `Date`, `URL` 같은 내장 클래스의 반응형 구현을 제공하며, [`svelte/reactivity`](svelte-reactivity)에서 import할 수 있습니다.

## `$state.raw`

객체와 배열이 깊은 반응성을 갖지 않기를 원한다면 `$state.raw`를 사용할 수 있습니다.

`$state.raw`로 선언한 상태는 변경할 수 없고 *재할당*만 할 수 있습니다. 다시 말해, 값을 업데이트하려면 객체의 속성에 할당하거나 `push` 같은 배열 메서드를 사용하는 대신 객체나 배열 전체를 교체해야 합니다:

```js
let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
	name: 'Heraclitus',
	age: 50
};
```

어차피 변경할 계획이 없던 큰 배열과 객체라면 반응형으로 만드는 비용을 피할 수 있어 성능이 좋아질 수 있습니다. raw 상태도 반응형 상태를 *포함*할 수는 있다는 점에 유의하세요(예: 반응형 객체를 담은 raw 배열).

`$state`와 마찬가지로 `$state.raw`를 사용해 클래스 필드를 선언할 수 있습니다.

## `$state.snapshot`

깊은 반응성을 가진 `$state` 프록시의 정적 스냅샷을 얻으려면 `$state.snapshot`을 사용하세요:

```svelte
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

`structuredClone`처럼 프록시를 예상하지 않는 외부 라이브러리나 API에 상태를 넘길 때 유용합니다.

값에 `toJSON` 메서드가 있으면, 스냅샷은 원본 객체 대신 `toJSON`이 반환한 값을 복제합니다.

## `$state.eager`

상태가 `await` 표현식에서 사용된다면, 상태가 바뀌어도 UI에 즉시 반영되지 않을 수 있습니다. [업데이트가 동기화되기](await-expressions#Synchronized-updates) 때문입니다.

상태가 바뀌자마자 UI를 업데이트하고 싶은 경우도 있습니다. 예를 들어 사용자가 링크를 클릭하면 새 페이지가 로드되기를 기다리는 동안 시각적 피드백을 주도록 내비게이션 바를 업데이트하고 싶을 수 있습니다. 이럴 때는 `$state.eager(value)`를 사용하세요:

```svelte
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
	<a href="/about" aria-current={$state.eager(pathname) === '/about' ? 'page' : null}>about</a>
</nav>
```

이 기능은 아껴서, 사용자 동작에 대한 피드백을 줄 때만 사용하세요. 일반적으로는 Svelte가 업데이트를 조율하도록 두는 편이 더 나은 사용자 경험을 제공합니다.

## 함수에 상태 전달하기 <!-- Passing state into functions -->

JavaScript는 *값에 의한 전달*(pass-by-value) 언어입니다. 함수를 호출하면 인자로 *변수*가 아니라 *값*이 전달됩니다. 즉:

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
	return a + b;
}

let a = 1;
let b = 2;
let total = add(a, b);
console.log(total); // 3

a = 3;
b = 4;
console.log(total); // still 3!
```

`add`가 `a`와 `b`의 *현재* 값에 접근하고 현재 `total` 값을 반환하게 하려면, 대신 함수를 사용해야 합니다:

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {() => number} getA
 * @param {() => number} getB
 */
function add(+++getA, getB+++) {
	return +++() => getA() + getB()+++;
}

let a = 1;
let b = 2;
let total = add+++(() => a, () => b)+++;
console.log(+++total()+++); // 3

a = 3;
b = 4;
console.log(+++total()+++); // 7
```

Svelte의 상태도 다르지 않습니다. `$state` 룬으로 선언한 것을 참조하면...

```js
let a = +++$state(1)+++;
let b = +++$state(2)+++;
```

...그 *현재 값*에 접근하게 됩니다.

여기서 '함수'는 넓은 의미입니다. 프록시의 속성과 [`get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)/[`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 속성도 포함합니다...

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {{ a: number, b: number }} input
 */
function add(input) {
	return {
		get value() {
			return input.a + input.b;
		}
	};
}

let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3

input.a = 3;
input.b = 4;
console.log(total.value); // 7
```

...다만 이런 코드를 작성하고 있다면 대신 [클래스](#Classes)를 사용하는 것을 고려해 보세요.

## 모듈 간에 상태 전달하기 <!-- Passing state across modules -->

`.svelte.js`와 `.svelte.ts` 파일에서 상태를 선언할 수 있지만, 그 상태를 *export*할 수 있는 것은 직접 재할당되지 않는 경우뿐입니다. 즉, 다음과 같이 할 수는 없습니다:

```js
/// file: state.svelte.js
export let count = $state(0);

export function increment() {
	count += 1;
}
```

`count`에 대한 모든 참조가 Svelte 컴파일러에 의해 변환되기 때문입니다. 위 코드는 대략 다음과 같습니다:

```js
/// file: state.svelte.js (compiler output)
// @filename: index.ts
interface Signal<T> {
	value: T;
}

interface Svelte {
	state<T>(value?: T): Signal<T>;
	get<T>(source: Signal<T>): T;
	set<T>(source: Signal<T>, value: T): void;
}
declare const $: Svelte;
// ---cut---
export let count = $.state(0);

export function increment() {
	$.set(count, $.get(count) + 1);
}
```

> [!NOTE] [플레이그라운드](/playground)에서 'JS Output' 탭을 클릭하면 Svelte가 생성하는 코드를 볼 수 있습니다.

컴파일러는 한 번에 한 파일만 처리하므로, 다른 파일이 `count`를 import하면 Svelte는 각 참조를 `$.get`과 `$.set`으로 감싸야 한다는 사실을 알 수 없습니다:

```js
// @filename: state.svelte.js
export let count = 0;

// @filename: index.js
// ---cut---
import { count } from './state.svelte.js';

console.log(typeof count); // 'object', not 'number'
```

따라서 모듈 간에 상태를 공유하는 방법은 두 가지입니다. 재할당하지 않거나...

```js
// This is allowed — since we're updating
// `counter.count` rather than `counter`,
// Svelte doesn't wrap it in `$.state`
export const counter = $state({
	count: 0
});

export function increment() {
	counter.count += 1;
}
```

...직접 export하지 않는 것입니다:

```js
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```
