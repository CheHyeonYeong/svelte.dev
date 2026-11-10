---
title: $derived
tags: rune-derived
---

파생 상태는 `$derived` 룬으로 선언합니다:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

`$derived(...)` 안의 표현식에는 부수 효과가 없어야 합니다. Svelte는 파생 표현식 안에서 상태를 변경하는 것(예: `count++`)을 허용하지 않습니다.

`$state`와 마찬가지로 클래스 필드를 `$derived`로 지정할 수 있습니다.

> [!NOTE] Svelte 컴포넌트의 코드는 생성될 때 한 번만 실행됩니다. `$derived` 룬이 없다면 `count`가 바뀌어도 `doubled`는 처음 값을 그대로 유지합니다.

## `$derived.by`

짧은 표현식에 담기 어려운 복잡한 파생 값을 만들어야 할 때도 있습니다. 이럴 때는 함수를 인자로 받는 `$derived.by`를 사용할 수 있습니다.

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

본질적으로 `$derived(expression)`은 `$derived.by(() => expression)`과 같습니다.

## 의존성 이해하기 <!-- Understanding dependencies -->

`$derived` 표현식(또는 `$derived.by` 함수 본문) 안에서 동기적으로 읽는 모든 것은 해당 파생 상태의 *의존성*으로 간주됩니다. 의존하는 상태가 바뀌면 파생 값은 *더티*(dirty)로 표시되고, 다음에 읽힐 때 다시 계산됩니다.

또한 표현식에 [`await`](await-expressions)가 들어 있으면, Svelte는 `await` *뒤에* 오는 상태도 추적되도록 표현식을 변환합니다. 즉, 다음과 같은 경우...

```js
let a = Promise.resolve(1);
let b = 2;
// ---cut---
let total = $derived(await a + b);
```

...`b`는 최초 실행 이후 `a`가 resolve된 다음에야 읽히지만, `a`와 `b` 모두 추적됩니다. (이는 표현식이 호출하는 함수 안의 `await`에는 적용되지 않고, 표현식 자체에만 적용됩니다.)

어떤 상태를 의존성으로 취급하지 않으려면 [`untrack`](svelte#untrack)을 사용하세요.

## 파생 값 덮어쓰기 <!-- Overriding derived values -->

파생 표현식은 의존성이 바뀌면 다시 계산되지만, (`const`로 선언하지 않았다면) 재할당해서 값을 일시적으로 덮어쓸 수 있습니다. 이는 *낙관적 UI*처럼, 값은 '원천 데이터'(source of truth, 예: 서버에서 온 데이터)에서 파생되지만 사용자에게는 즉각적인 피드백을 보여 주고 싶을 때 유용합니다:

```svelte
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// increment the `likes` count immediately...
		likes += 1;

		// and tell the server, which will eventually update `post`
		try {
			await like();
		} catch {
			// failed! roll back the change
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

> [!NOTE] Svelte 5.25 이전에는 파생 값이 읽기 전용이었습니다.

## 파생 값과 반응성 <!-- Deriveds and reactivity -->

객체와 배열을 [깊은 반응성을 가진 프록시]($state#Deep-state)로 변환하는 `$state`와 달리, `$derived` 값은 있는 그대로 둡니다. 예를 들어 [다음과 같은 경우](/playground/untitled#H4sIAAAAAAAAE4VU22rjMBD9lUHd3aaQi9PdstS1A3t5XvpQ2Ic4D7I1iUUV2UjjNMX431eS7TRdSosxgjMzZ45mjt0yzffIYibvy0ojFJWqDKCQVBk2ZVup0LJ43TJ6rn2aBxw-FP2o67k9oCKP5dziW3hRaUJNjoYltjCyplWmM1JIIAn3FlL4ZIkTTtYez6jtj4w8WwyXv9GiIXiQxLVs9pfTMR7EuoSLIuLFbX7Z4930bZo_nBrD1bs834tlfvsBz9_SyX6PZXu9XaL4gOWn4sXjeyzftv4ZWfyxubpzxzg6LfD4MrooxELEosKCUPigQCMPKCZh0OtQE1iSxcsmdHuBvCiHZXALLXiN08EL3RRkaJ_kDVGle0HcSD5TPEeVtj67O4Nrg9aiSNtBY5oODJkrL5QsHtN2cgXp6nSJMWzpWWGasdlsGEMbzi5jPr5KFr0Ep7pdeM2-TCelCddIhDxAobi1jqF3cMaC1RKp64bAW9iFAmXGIHfd4wNXDabtOLN53w8W53VvJoZLh7xk4Rr3CoL-UNoLhWHrT1JQGcM17u96oES5K-kc2XOzkzqGCKL5De79OUTyyrg1zgwXsrEx3ESfx4Bz0M5UjVMHB24mw9SuXtXFoN13fYKOM1tyUT3FbvbWmSWCZX2Er-41u5xPoml45svRahl9Wb9aasbINJixDZwcPTbyTLZSUsAvrg_cPuCR7s782_WU8343Y72Qtlb8OYatwuOQvuN13M_hJKNfxann1v1U_B1KZ_D_mzhzhz24fw85CSz2irtN9w9HshBK7AQAAA==)...

```js
// @errors: 7005
let items = $state([ /*...*/ ]);

let index = $state(0);
let selected = $derived(items[index]);
```

...`selected`의 속성을 변경하면(또는 `bind:`로 바인딩하면) 그 아래의 `items` 배열에도 영향을 줍니다. `items`가 깊은 반응성을 갖지 *않았다면*, `selected`를 변경해도 아무 효과가 없었을 것입니다.

## 구조 분해 <!-- Destructuring -->

`$derived` 선언에서 구조 분해를 사용하면, 그 결과로 나온 변수는 모두 반응형이 됩니다. 다음 코드는...

```js
function stuff() { return { a: 1, b: 2, c: 3 } }
// ---cut---
let { a, b, c } = $derived(stuff());
```

...대략 다음과 같습니다:

```js
function stuff() { return { a: 1, b: 2, c: 3 } }
// ---cut---
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

## 업데이트 전파 <!-- Update propagation -->

Svelte는 *푸시-풀 반응성*(push-pull reactivity)이라는 방식을 사용합니다. 상태가 업데이트되면 그 상태에 (직접 또는 간접적으로) 의존하는 모든 것이 즉시 변경 알림을 받지만('푸시'), 파생 값은 실제로 읽힐 때까지 다시 평가되지 않습니다('풀').

파생 값의 새 값이 이전 값과 참조상 동일하면, 그 아래로 이어지는 업데이트는 건너뜁니다. 즉, 아래 예제에서 `large`는 `count`에 의존하지만, Svelte는 `count`가 바뀔 때가 아니라 `large`가 바뀔 때만 버튼 안의 텍스트를 업데이트합니다:

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
</button>
```
