---
title: svelte/reactivity
---

Svelte는 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) 같은 여러 내장 객체의 반응형 버전을 제공합니다. 이들은 네이티브 객체와 똑같이 사용할 수 있으며, 반응성을 다루기 위한 몇 가지 유틸리티도 함께 제공합니다.



```js
// @noErrors
import {
	MediaQuery,
	SvelteDate,
	SvelteMap,
	SvelteSet,
	SvelteURL,
	SvelteURLSearchParams,
	createSubscriber
} from 'svelte/reactivity';
```

## MediaQuery

<blockquote class="since note">

5.7.0부터 사용 가능

</blockquote>

미디어 쿼리를 만들고, 그 쿼리가 일치하는지 여부를 나타내는 `current` 속성을 제공합니다.

주의해서 사용하세요. 서버 사이드 렌더링 중에는 올바른 값을 알 방법이 없으므로, 하이드레이션 시점에 콘텐츠가 바뀔 수 있습니다.
CSS의 미디어 쿼리로 같은 효과를 낼 수 있다면 그렇게 하세요.

```svelte
<script>
	import { MediaQuery } from 'svelte/reactivity';

	const large = new MediaQuery('min-width: 800px');
</script>

<h1>{large.current ? 'large screen' : 'small screen'}</h1>
```

<div class="ts-block">

```dts
class MediaQuery extends ReactiveValue<boolean> {/*…*/}
```

<div class="ts-block-property">

```dts
constructor(query: string, fallback?: boolean | undefined);
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `query` 미디어 쿼리 문자열
- `fallback` 서버에서 사용할 폴백 값

</div>

</div>
</div></div>



## SvelteDate

내장 [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 객체의 반응형 버전입니다.
[이펙트](/docs/svelte/$effect)나 [파생 값](/docs/svelte/$derived) 안에서 날짜를 읽으면(`date.getTime()`, `date.toString()` 같은 메서드로 읽든, [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) 같은 것을 통해 읽든)
날짜 값이 바뀔 때 그 이펙트나 파생 값이
다시 평가됩니다.

```svelte
<script>
	import { SvelteDate } from 'svelte/reactivity';

	const date = new SvelteDate();

	const formatter = new Intl.DateTimeFormat(undefined, {
	  hour: 'numeric',
	  minute: 'numeric',
	  second: 'numeric'
	});

	$effect(() => {
		const interval = setInterval(() => {
			date.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<p>The time is {formatter.format(date)}</p>
```

<div class="ts-block">

```dts
class SvelteDate extends Date {/*…*/}
```

<div class="ts-block-property">

```dts
constructor(...params: any[]);
```

<div class="ts-block-property-details"></div>
</div></div>



## SvelteMap

내장 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 객체의 반응형 버전입니다.
[이펙트](/docs/svelte/$effect)나 [파생 값](/docs/svelte/$derived) 안에서 맵의 내용을 읽으면(아래 [틱택토 예제](/playground/0b0ff4aa49c9443f9b47fe5203c78293)처럼 순회하거나, `map.size`를 읽거나, `map.get(...)`이나 `map.has(...)`를 호출하는 경우)
맵이 갱신될 때 필요에 따라 그 이펙트나 파생 값이 다시 평가됩니다.

반응형 맵의 값이 [깊은 반응성](/docs/svelte/$state#Deep-state)을 갖게 되는 것은 *아니라는* 점에 유의하세요.

```svelte
<script>
	import { SvelteMap } from 'svelte/reactivity';
	import { result } from './game.js';

	let board = new SvelteMap();
	let player = $state('x');
	let winner = $derived(result(board));

	function reset() {
		player = 'x';
		board.clear();
	}
</script>

<div class="board">
	{#each Array(9), i}
		<button
			disabled={board.has(i) || winner}
			onclick={() => {
				board.set(i, player);
				player = player === 'x' ? 'o' : 'x';
			}}
		>{board.get(i)}</button>
	{/each}
</div>

{#if winner}
	<p>{winner} wins!</p>
	<button onclick={reset}>reset</button>
{:else}
	<p>{player} is next</p>
{/if}
```

<div class="ts-block">

```dts
class SvelteMap<K, V> extends Map<K, V> {/*…*/}
```

<div class="ts-block-property">

```dts
constructor(value?: Iterable<readonly [K, V]> | null | undefined);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
getOrInsert(key: K, value: V): V;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
getOrInsertComputed(key: K, callbackFn: (key: K) => V): V;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
set(key: K, value: V): this;
```

<div class="ts-block-property-details"></div>
</div></div>



## SvelteSet

내장 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 객체의 반응형 버전입니다.
[이펙트](/docs/svelte/$effect)나 [파생 값](/docs/svelte/$derived) 안에서 셋의 내용을 읽으면(아래 [예제](/playground/53438b51194b4882bcc18cddf9f96f15)처럼 순회하거나, `set.size`를 읽거나, `set.has(...)`를 호출하는 경우)
셋이 갱신될 때 필요에 따라 그 이펙트나 파생 값이 다시 평가됩니다.

반응형 셋의 값이 [깊은 반응성](/docs/svelte/$state#Deep-state)을 갖게 되는 것은 *아니라는* 점에 유의하세요.

```svelte
<script>
	import { SvelteSet } from 'svelte/reactivity';
	let monkeys = new SvelteSet();

	function toggle(monkey) {
		if (monkeys.has(monkey)) {
			monkeys.delete(monkey);
		} else {
			monkeys.add(monkey);
		}
	}
</script>

{#each ['🙈', '🙉', '🙊'] as monkey}
	<button onclick={() => toggle(monkey)}>{monkey}</button>
{/each}

<button onclick={() => monkeys.clear()}>clear</button>

{#if monkeys.has('🙈')}<p>see no evil</p>{/if}
{#if monkeys.has('🙉')}<p>hear no evil</p>{/if}
{#if monkeys.has('🙊')}<p>speak no evil</p>{/if}
```

<div class="ts-block">

```dts
class SvelteSet<T> extends Set<T> {/*…*/}
```

<div class="ts-block-property">

```dts
constructor(value?: Iterable<T> | null | undefined);
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
add(value: T): this;
```

<div class="ts-block-property-details"></div>
</div></div>



## SvelteURL

내장 [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) 객체의 반응형 버전입니다.
[이펙트](/docs/svelte/$effect)나 [파생 값](/docs/svelte/$derived) 안에서 URL의 속성(`url.href`, `url.pathname` 등)을 읽으면
URL이 바뀔 때 필요에 따라 그 이펙트나 파생 값이 다시 평가됩니다.

`searchParams` 속성은 [SvelteURLSearchParams](/docs/svelte/svelte-reactivity#SvelteURLSearchParams)의 인스턴스입니다.

[예제](/playground/5a694758901b448c83dc40dc31c71f2a):

```svelte
<script>
	import { SvelteURL } from 'svelte/reactivity';

	const url = new SvelteURL('https://example.com/path');
</script>

<!-- changes to these... -->
<input bind:value={url.protocol} />
<input bind:value={url.hostname} />
<input bind:value={url.pathname} />

<hr />

<!-- will update `href` and vice versa -->
<input bind:value={url.href} size="65" />
```

<div class="ts-block">

```dts
class SvelteURL extends URL {/*…*/}
```

<div class="ts-block-property">

```dts
get searchParams(): SvelteURLSearchParams;
```

<div class="ts-block-property-details"></div>
</div></div>



## SvelteURLSearchParams

내장 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 객체의 반응형 버전입니다.
[이펙트](/docs/svelte/$effect)나 [파생 값](/docs/svelte/$derived) 안에서 내용을 읽으면(아래 [예제](/playground/b3926c86c5384bab9f2cf993bc08c1c8)처럼 순회하거나, `params.get(...)`이나 `params.getAll(...)`을 호출하는 경우)
매개변수가 갱신될 때 필요에 따라 그 이펙트나 파생 값이 다시 평가됩니다.

```svelte
<script>
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	const params = new SvelteURLSearchParams('message=hello');

	let key = $state('key');
	let value = $state('value');
</script>

<input bind:value={key} />
<input bind:value={value} />
<button onclick={() => params.append(key, value)}>append</button>

<p>?{params.toString()}</p>

{#each params as [key, value]}
	<p>{key}: {value}</p>
{/each}
```

<div class="ts-block">

```dts
class SvelteURLSearchParams extends URLSearchParams {/*…*/}
```

<div class="ts-block-property">

```dts
[REPLACE](params: URLSearchParams): void;
```

<div class="ts-block-property-details"></div>
</div></div>



## createSubscriber

<blockquote class="since note">

5.7.0부터 사용 가능

</blockquote>

외부의 이벤트 기반 시스템을 Svelte의 반응성과 통합하는 `subscribe` 함수를 반환합니다.
`MediaQuery`, `IntersectionObserver`, `WebSocket` 같은 웹 API와 통합할 때 특히 유용합니다.

이펙트 안에서(예를 들어 getter 안에서처럼 간접적인 경우도 포함) `subscribe`를 호출하면,
`start` 콜백이 `update` 함수를 인자로 받아 호출됩니다. `update`가 호출될 때마다 이펙트가 다시 실행됩니다.

`start`가 정리 함수를 반환하면, 이펙트가 소멸될 때 그 함수가 호출됩니다.

여러 이펙트에서 `subscribe`를 호출하더라도, 이펙트들이 활성 상태인 동안 `start`는 한 번만 호출되며,
반환된 정리(teardown) 함수는 모든 이펙트가 소멸되었을 때에만 호출됩니다.

예제를 보면 가장 쉽게 이해할 수 있습니다. 다음은 [`MediaQuery`](/docs/svelte/svelte-reactivity#MediaQuery)를 구현한 것입니다.

```js
// @errors: 7031
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

export class MediaQuery {
	#query;
	#subscribe;

	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);

		this.#subscribe = createSubscriber((update) => {
			// when the `change` event occurs, re-run any effects that read `this.current`
			const off = on(this.#query, 'change', update);

			// stop listening when all the effects are destroyed
			return () => off();
		});
	}

	get current() {
		// This makes the getter reactive, if read in an effect
		this.#subscribe();

		// Return the current state of the query, whether or not we're in an effect
		return this.#query.matches;
	}
}
```

<div class="ts-block">

```dts
function createSubscriber(
	start: (update: () => void) => (() => void) | void
): () => void;
```

</div>




