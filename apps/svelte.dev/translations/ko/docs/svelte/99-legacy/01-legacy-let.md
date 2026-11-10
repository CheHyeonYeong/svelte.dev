---
title: 반응형 let/var 선언
---

룬 모드에서는 반응형 상태를 [`$state` 룬]($state)으로 명시적으로 선언합니다.

레거시 모드에서는 컴포넌트 최상위에 선언한 변수가 자동으로 *반응형*으로 간주됩니다. 이런 변수를 재할당하거나 변경하면(`count += 1` 또는 `object.x = y`) UI가 업데이트됩니다.

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

Svelte 레거시 모드의 반응성은 *할당*을 기반으로 하기 때문에, `.push()`나 `.splice()` 같은 배열 메서드를 사용해도 업데이트가 자동으로 일어나지 않습니다. UI를 업데이트하라고 컴파일러에게 '알려 주려면' 이어서 할당을 해야 합니다:

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		// this method call does not trigger an update
		numbers.push(numbers.length + 1);

		// this assignment will update anything
		// that depends on `numbers`
		numbers = numbers;
	}
</script>
```
