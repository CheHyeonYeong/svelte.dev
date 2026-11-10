---
title: $effect
tags: rune-effect
---

이펙트는 상태가 업데이트될 때 실행되는 함수로, 서드파티 라이브러리 호출, `<canvas>` 요소에 그리기, 네트워크 요청 보내기 등에 사용할 수 있습니다. 이펙트는 브라우저에서만 실행되며, 서버 사이드 렌더링 중에는 실행되지 않습니다.

일반적으로 이펙트 안에서 상태를 업데이트하면 *안 됩니다*. 코드가 더 복잡해지고, 끝없는 업데이트 순환으로 이어지는 경우가 많기 때문입니다. 그렇게 하고 있다면 [`$effect`를 쓰지 말아야 할 때](#When-not-to-use-$effect)를 읽고 대안을 알아보세요.

`$effect` 룬으로 이펙트를 만들 수 있습니다([데모](/playground/untitled#H4sIAAAAAAAAE31S246bMBD9lZF3pSRSAqTVvrCAVPUP2sdSKY4ZwJJjkD0hSVH-vbINuWxXfQH5zMyZc2ZmZLVUaFn6a2R06ZGlHmBrpvnBvb71fWQHVOSwPbf4GS46TajJspRlVhjZU1HqkhQSWPkHIYdXS5xw-Zas3ueI6FRn7qHFS11_xSRZhIxbFtcDtw7SJb1iXaOg5XIFeQGjzyPRaevYNOGZIJ8qogbpe8CWiy_VzEpTXiQUcvPDkSVrSNZz1UlW1N5eLcqmpdXUvaQ4BmqlhZNUCgxuzFHDqUWNAxrYeUM76AzsnOsdiJbrBp_71lKpn3RRbii-4P3f-IMsRxS-wcDV_bL4PmSdBa2wl7pKnbp8DMgVvJm8ZNskKRkEM_OzyOKQFkgqOYBQ3Nq89Ns0nbIl81vMFN-jKoLMTOr-SOBOJS-Z8f5Y6D1wdcR8dFqvEBdetK-PHwj-z-cH8oHPY54wRJ8Ys7iSQ3Bg3VA9azQbmC9k35kKzYa6PoVtfwbbKVnBixBiGn7Pq0rqJoUtHiCZwAM3jdTPWCVtr_glhVrhecIa3vuksJ_b7TqFs4DPyriSjd5IwoNNQaAmNI-ESfR2p8zimzvN1swdCkvJHPH6-_oX8o1SgcIDAAA=)):

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');

	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// this will re-run whenever `color` or `size` change
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte는 이펙트 함수를 실행할 때 어떤 상태(와 파생 상태)에 접근하는지 추적하고([`untrack`](svelte#untrack) 안에서 접근한 경우는 제외), 나중에 그 상태가 바뀌면 함수를 다시 실행합니다.

> [!NOTE] `$effect`가 왜 다시 실행되는지, 또는 왜 실행되지 않는지 이해하기 어렵다면 [의존성 이해하기](#Understanding-dependencies)를 보세요. Svelte 4에서 넘어왔다면 익숙할 `$:` 블록과는 이펙트가 트리거되는 방식이 다릅니다.

### 생명주기 이해하기 <!-- Understanding lifecycle -->

이펙트는 컴포넌트가 DOM에 마운트된 뒤에 실행되고, 상태가 바뀐 뒤에는 [마이크로태스크](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)에서 실행됩니다. 재실행은 일괄 처리되며(즉, `color`와 `size`를 같은 순간에 바꿔도 두 번 따로 실행되지 않습니다), 모든 DOM 업데이트가 적용된 뒤에 일어납니다.

부모 이펙트가 실행되는 중에 호출되기만 하면, `$effect`는 컴포넌트 최상위뿐 아니라 어디서든 사용할 수 있습니다.

> [!NOTE] Svelte는 템플릿의 로직과 표현식을 나타내기 위해 내부적으로 이펙트를 사용합니다. `name`이 바뀔 때 `<h1>hello {name}!</h1>`이 업데이트되는 것도 이 덕분입니다.

이펙트는 이펙트가 다시 실행되기 직전에 실행될 *정리 함수*(teardown function)를 반환할 수 있습니다:

<!-- codeblock:start {"title":"Effect teardown"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// This will be recreated whenever `milliseconds` changes
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// if a teardown function is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```
<!-- codeblock:end -->

정리 함수는 이펙트가 파괴될 때도 실행됩니다. 이펙트는 부모가 파괴될 때(예: 컴포넌트가 언마운트될 때)나 부모 이펙트가 다시 실행될 때 파괴됩니다.

### 의존성 이해하기 <!-- Understanding dependencies -->

`$effect`는 함수 본문 안에서 *동기적으로* 읽는(함수 호출을 통해 간접적으로 읽는 경우도 포함) 모든 반응형 값(`$state`, `$derived`, `$props`)을 자동으로 찾아 의존성으로 등록합니다. 이 의존성이 바뀌면 `$effect`는 재실행을 예약합니다.

`$state`와 `$derived`를 `$effect` 안에서 직접 사용하는 경우(예: [반응형 클래스](https://svelte.dev/docs/svelte/$state#Classes)를 생성할 때), 그 값들은 의존성으로 취급되지 *않습니다*.

*비동기적으로* 읽는 값, 예를 들어 `await` 뒤나 `setTimeout` 안에서 읽는 값은 추적되지 않습니다. 아래 예제에서 캔버스는 `color`가 바뀌면 다시 그려지지만, `size`가 바뀔 때는 다시 그려지지 않습니다([데모](/playground/untitled#H4sIAAAAAAAAE31T246bMBD9lZF3pWSlBEirfaEQqdo_2PatVIpjBrDkGGQPJGnEv1e2IZfVal-wfHzmzJyZ4cIqqdCy9M-F0blDlnqArZjmB3f72XWRHVCRw_bc4me4aDWhJstSlllhZEfbQhekkMDKfwg5PFvihMvX5OXH_CJa1Zrb0-Kpqr5jkiwC48rieuDWQbqgZ6wqFLRcvkC-hYvnkWi1dWqa8ESQTxFRjfQWsOXiWzmr0sSLhEJu3p1YsoJkNUcdZUnN9dagrBu6FVRQHAM10sJRKgUG16bXcGxQ44AGdt7SDkTDdY02iqLHnJVU6hedlWuIp94JW6Tf8oBt_8GdTxlF0b4n0C35ZLBzXb3mmYn3ae6cOW74zj0YVzDNYXRHFt9mprNgHfZSl6mzml8CMoLvTV6wTZIUDEJv5us2iwMtiJRyAKG4tXnhl8O0yhbML0Wm-B7VNlSSSd31BG7z8oIZZ6dgIffAVY_5xdU9Qrz1Bnx8fCfwtZ7v8Qc9j3nB8PqgmMWlHIID6-bkVaPZwDySfWtKNGtquxQ23Qlsq2QJT0KIqb8dL0up6xQ2eIBkAg_c1FI_YqW0neLnFCqFpwmreedJYT7XX8FVOBfwWRhXstZrSXiwKQjUhOZeMIleb5JZfHWn2Yq5pWEpmR7Hv-N_wEqT8hEEAAA=)):

```ts
// @filename: index.ts
declare let canvas: {
	width: number;
	height: number;
	getContext(type: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
};
declare let color: string;
declare let size: number;

// ---cut---
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	// this will re-run whenever `color` changes...
	context.fillStyle = color;

	setTimeout(() => {
		// ...but not when `size` changes
		context.fillRect(0, 0, size, size);
	}, 0);
});
```

이펙트는 읽은 객체 자체가 바뀔 때만 다시 실행되고, 그 안의 속성이 바뀔 때는 다시 실행되지 않습니다. (개발 중에 객체 *내부*의 변화를 관찰하고 싶다면 [`$inspect`]($inspect)를 사용할 수 있습니다.)

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// this will run once, because `state` is never reassigned (only mutated)
	$effect(() => {
		state;
	});

	// this will run whenever `state.value` changes...
	$effect(() => {
		state.value;
	});

	// ...and so will this, because `derived` is a new object each time
	$effect(() => {
		derived;
	});
</script>

<button onclick={() => (state.value += 1)}>
	{state.value}
</button>

<p>{state.value} doubled is {derived.value}</p>
```

이펙트는 마지막으로 실행되었을 때 읽은 값에만 의존합니다. 이 점은 조건부 코드가 있는 이펙트에서 흥미로운 결과를 낳습니다.

예를 들어 아래 코드에서 `condition`이 `true`이면 `if` 블록 안의 코드가 실행되어 `color`가 평가됩니다. 따라서 `condition`이나 `color` 중 어느 쪽이 바뀌어도 [이펙트가 다시 실행됩니다](/playground/untitled#H4sIAAAAAAAAE21RQW6DMBD8ytaNBJHaJFLViwNIVZ8RcnBgXVk1xsILTYT4e20TQg89IOPZ2fHM7siMaJBx9tmaWpFqjQNlAKXEihx7YVJpdIyfRkY3G4gB8Pi97cPanRtQU8AuwuF_eNUaQuPlOMtc1SlLRWlKUo1tOwJflUikQHZtA0klzCDc64Imx0ANn8bInV1CDhtHgjClrsftcSXotluLybOUb3g4JJHhOZs5WZpuIS9gjNqkJKQP5e2ClrR4SMdZ13E4xZ8zTPOTJU2A2uE_PQ9COCI926_hTVarIU4hu_REPlBrKq2q73ycrf1N-vS4TMUsulaVg3EtR8H9rFgsg8uUsT1B2F9eshigZHBRpuaD0D3mY8Qm2BfB5N2YyRzdNEYVDy0Ja-WsFjcOUuP1HvFLWA6H3XuHTUSmmDV2--0TXonxsKbp7G9C6R__NONS-MFNvxj_d6mBAgAA).

반대로 `condition`이 `false`이면 `color`는 평가되지 않으며, 이펙트는 `condition`이 바뀔 때*만* 다시 실행됩니다.

```ts
// @filename: ambient.d.ts
declare module 'canvas-confetti' {
	interface ConfettiOptions {
		colors: string[];
	}

	function confetti(opts?: ConfettiOptions): void;
	export default confetti;
}

// @filename: index.js
// ---cut---
import confetti from 'canvas-confetti';

let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] });
	} else {
		confetti();
	}
});
```

## `$effect.pre`

드물게 DOM이 업데이트되기 *전에* 코드를 실행해야 할 때가 있습니다. 이럴 때는 `$effect.pre` 룬을 사용할 수 있습니다:

```svelte
<script>
	import { tick } from 'svelte';

	let div = $state();
	let messages = $state([]);

	// ...

	$effect.pre(() => {
		if (!div) return; // not yet mounted

		// reference `messages` array length so that this code re-runs whenever it changes
		messages.length;

		// autoscroll when new messages are added
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

`$effect.pre`는 플러시(flush) 중의 모든 DOM 변경보다 먼저가 아니라, 자신보다 뒤에 예약된 DOM 업데이트보다 먼저 실행됩니다. 부모 컴포넌트의 DOM은 이미 업데이트되었을 수 있습니다. [await 표현식](await-expressions)을 사용할 때는 같은 컴포넌트의 `{#if ...}`, `{#each ...}` 같은 블록 업데이트도 `$effect.pre`보다 먼저 실행됩니다.

실행 시점을 제외하면 `$effect.pre`는 `$effect`와 똑같이 동작합니다.

## `$effect.tracking`

`$effect.tracking` 룬은 코드가 이펙트나 템플릿 안처럼 추적 컨텍스트 안에서 실행 중인지 알려 주는 고급 기능입니다:

<!-- codeblock:start {"title":"$effect.tracking()"} -->
```svelte
<!--- file: App.svelte --->
<script>
	console.log('in component setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```
<!-- codeblock:end -->

이 룬은 [`createSubscriber`](/docs/svelte/svelte-reactivity#createSubscriber) 같은 추상화를 구현하는 데 쓰입니다. `createSubscriber`는 반응형 값을 업데이트할 리스너를 만들되, 그 값이 (예를 들어 이벤트 핸들러 안에서 읽히는 것이 아니라) 추적되고 있을 때*만* 만듭니다.

## `$effect.pending`

컴포넌트에서 [`await`](await-expressions)를 사용할 때, `$effect.pending()` 룬은 자식 바운더리를 제외한 현재 [바운더리](svelte-boundary)에서 대기 중인 프로미스가 몇 개인지 알려 줍니다:

<!-- codeblock:start {"title":"$effect.pending"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let a = $state(1);
	let b = $state(2);

	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500)); // artificial delay
		return a + b;
	}
</script>

<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
	<p>pending promises: {$effect.pending()}</p>
{/if}
```
<!-- codeblock:end -->

## `$effect.root`

`$effect.root` 룬은 자동으로 정리되지 않는, 추적되지 않는 스코프를 만드는 고급 기능입니다. 직접 제어하고 싶은 중첩 이펙트에 유용합니다. 이 룬을 사용하면 컴포넌트 초기화 단계 밖에서도 이펙트를 만들 수 있습니다.

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

// later...
destroy();
```

## `$effect`를 쓰지 말아야 할 때 <!-- When not to use `$effect` -->

일반적으로 `$effect`는 자주 써야 하는 도구라기보다는 일종의 탈출구(escape hatch)로 보는 것이 가장 좋습니다. 분석 도구나 직접적인 DOM 조작 같은 일에 유용합니다. 특히 상태를 동기화하는 데 사용하지 마세요. 이렇게 하는 대신...

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	// don't do this!
	$effect(() => {
		doubled = count * 2;
	});
</script>
```

...이렇게 하세요:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

> [!NOTE] `count * 2` 같은 단순한 표현식보다 복잡한 경우에는 `$derived.by`를 사용할 수도 있습니다.

(예를 들어 낙관적 UI를 만들기 위해) 파생 값을 재할당하려고 이펙트를 사용하고 있다면, Svelte 5.25부터는 [파생 값을 직접 덮어쓸 수 있다는 점]($derived#Overriding-derived-values)을 기억하세요.

한 값을 다른 값과 연결하려고 이펙트로 복잡한 일을 하고 싶어질 수도 있습니다. 다음 예제는 서로 연결된 "쓴 돈"과 "남은 돈" 입력 두 개를 보여 줍니다. 하나를 업데이트하면 다른 하나도 그에 맞게 업데이트되어야 합니다. 이를 위해 이펙트를 사용하는 대신...

<!-- codeblock:start {"title":"Setting state in effects (don't do this!)"} -->
```svelte
<!--- file: App.svelte --->
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => {
		left = total - spent;
	});

	$effect(() => {
		spent = total - left;
	});
</script>

<label>
	<input type="range" bind:value={spent} max={total} />
	{spent}/{total} spent
</label>

<label>
	<input type="range" bind:value={left} max={total} />
	{left}/{total} left
</label>

<style>
	label {
		display: flex;
		gap: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

...가능하다면 `oninput` 콜백을 사용하거나, 더 좋은 방법으로 [함수 바인딩](bind#Function-bindings)을 사용하세요:

<!-- codeblock:start {"title":"Setting state with function bindings"} -->
```svelte
<!--- file: App.svelte --->
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

+++	function updateLeft(left) {
		spent = total - left;
	}+++
</script>

<label>
	<input type="range" bind:value={spent} max={total} />
	{spent}/{total} spent
</label>

<label>
	<input type="range" +++bind:value={() => left, updateLeft}+++ max={total} />
	{left}/{total} left
</label>

<style>
	label {
		display: flex;
		gap: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

이펙트 안에서 꼭 `$state`를 업데이트해야 하는데 같은 `$state`를 읽고 쓰다가 무한 루프에 빠진다면, [untrack](svelte#untrack)을 사용하세요.
