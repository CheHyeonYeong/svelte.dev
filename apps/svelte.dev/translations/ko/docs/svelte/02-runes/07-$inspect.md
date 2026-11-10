---
title: $inspect
tags: rune-inspect
---

> [!NOTE] `$inspect`는 개발 중에만 동작합니다. 프로덕션 빌드에서는 아무 일도 하지 않는 코드(no-op)가 됩니다.

`$inspect` 룬은 `console.log`와 대체로 같지만, 인자가 바뀔 때마다 다시 실행된다는 점이 다릅니다. `$inspect`는 반응형 상태를 깊게 추적하므로, 세분화된 반응성을 통해 객체나 배열 안의 무언가를 업데이트해도 다시 실행됩니다:

<!-- codeblock:start {"title":"$inspect(...)"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);
	let message = $state('hello');

	$inspect(count, message); // will console.log when `count` or `message` change
</script>

<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```
<!-- codeblock:end -->

업데이트될 때는 스택 트레이스가 출력되므로 상태 변경이 어디서 시작되었는지 쉽게 찾을 수 있습니다(단, 기술적 한계로 플레이그라운드에서는 출력되지 않습니다).

## $inspect(...).with

`$inspect(...)`는 `with` 메서드가 있는 객체를 반환합니다. 이 메서드에 콜백을 넘겨 호출하면 `console.log` 대신 그 콜백이 호출됩니다. 콜백의 첫 번째 인자는 `"init"` 또는 `"update"`이고, 그다음 인자들은 `$inspect`에 전달된 값입니다:

<!-- codeblock:start {"title":"$inspect(...).with(...)"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);

	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // or `console.trace`, or whatever you want
		}
	});
</script>

<button onclick={() => count++}>Increment</button>
```
<!-- codeblock:end -->

## $inspect.trace(...)

5.14에 추가된 이 룬은 개발 중에 자신을 감싸는 함수를 *추적*하게 합니다. 함수가 [이펙트]($effect)나 [파생 값]($derived)의 일부로 다시 실행될 때마다, 어떤 반응형 상태 때문에 이펙트가 실행되었는지에 대한 정보가 콘솔에 출력됩니다.

```svelte
<script>
	import { doSomeWork } from './elsewhere';

	$effect(() => {
		+++// $inspect.trace must be the first statement of a function body+++
		+++$inspect.trace();+++
		doSomeWork();
	});
</script>
```

`$inspect.trace`는 선택적으로 첫 번째 인자를 받으며, 이 인자는 라벨로 사용됩니다.
