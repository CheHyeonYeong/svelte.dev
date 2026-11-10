---
title: 반응형 $: 문
---

룬 모드에서는 상태 업데이트에 대한 반응을 [`$derived`]($derived)와 [`$effect`]($effect) 룬으로 처리합니다.

레거시 모드에서는 최상위 문(즉 블록이나 함수 안에 있지 않은 문)이라면 무엇이든 앞에 `$:` [레이블](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label)을 붙여 반응형으로 만들 수 있습니다. 이런 문은 `<script>`의 다른 코드가 실행된 뒤, 컴포넌트 마크업이 렌더링되기 전에 실행되고, 그 뒤로는 의존하는 값이 바뀔 때마다 실행됩니다.

```svelte
<script>
	let a = 1;
	let b = 2;

	// this is a 'reactive statement', and it will re-run
	// when `a`, `b` or `sum` change
	$: console.log(`${a} + ${b} = ${sum}`);

	// this is a 'reactive assignment' — `sum` will be
	// recalculated when `a` or `b` change. It is
	// not necessary to declare `sum` separately
	$: sum = a + b;
</script>
```

문은 의존성과 할당에 따라 *위상* 순서로 정렬됩니다. `console.log` 문이 `sum`에 의존하므로, 소스에서 더 뒤에 나오더라도 `sum`이 먼저 계산됩니다.

여러 문을 블록에 넣어 하나로 묶을 수 있습니다:

```js
// @noErrors
$: {
	// recalculate `total` when `items` changes
	total = 0;

	for (const item of items) {
		total += item.value;
	}
}
```

반응형 할당의 왼쪽에는 식별자가 올 수도 있고, 구조 분해 할당이 올 수도 있습니다:

```js
// @noErrors
$: ({ larry, moe, curly } = stooges);
```

## 의존성 이해하기 <!-- Understanding dependencies -->

`$:` 문의 의존성은 컴파일 시점에 결정됩니다. 문 안에서 참조되는(하지만 할당되지는 않는) 변수가 의존성이 됩니다.

다시 말해 아래와 같은 문은 `count`가 바뀌어도 다시 실행되지 *않습니다*. 컴파일러가 그 의존성을 '볼' 수 없기 때문입니다:

```js
// @noErrors
let count = 0;
let double = () => count * 2;

$: doubled = double();
```

마찬가지로 의존성을 간접적으로 참조하면 위상 정렬이 제대로 동작하지 않습니다. 아래 예시에서 `z`는 절대 업데이트되지 않는데, 업데이트가 일어날 때 `y`가 '더티(dirty)' 상태로 간주되지 않기 때문입니다. `$: z = y`를 `$: setY(x)` 아래로 옮기면 해결됩니다:

```svelte
<script>
	let x = 0;
	let y = 0;

	$: z = y;
	$: setY(x);

	function setY(value) {
		y = value;
	}
</script>
```

## 브라우저 전용 코드 <!-- Browser-only code -->

반응형 문은 브라우저뿐 아니라 서버 사이드 렌더링 중에도 실행됩니다. 따라서 브라우저에서만 실행해야 하는 코드는 `if` 블록으로 감싸야 합니다:

```js
// @noErrors
$: if (browser) {
	document.title = title;
}
```
