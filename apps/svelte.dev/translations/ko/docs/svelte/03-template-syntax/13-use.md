---
title: use:
---

> [!NOTE]
> Svelte 5.29 이상에서는 더 유연하고 조합하기 쉬운 [어태치먼트](@attach)를 대신 사용하는 것을 고려하세요.

액션은 요소가 마운트될 때 호출되는 함수입니다. 액션은 `use:` 지시어로 추가하며, 보통 요소가 언마운트될 때 상태를 초기화할 수 있도록 `$effect`를 사용합니다:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node) {
		// the node has been mounted in the DOM

		$effect(() => {
			// setup goes here

			return () => {
				// teardown goes here
			};
		});
	}
</script>

<div use:myaction>...</div>
```

액션은 인수와 함께 호출할 수 있습니다:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node, +++data+++) {
		// ...
	}
</script>

<div use:myaction={+++data+++}>...</div>
```

액션은 한 번만 호출되며(서버 사이드 렌더링 중에는 호출되지 않습니다), 인수가 바뀌어도 다시 실행되지 *않습니다*.

> [!LEGACY]
> `$effect` 룬이 나오기 전에는 액션이 `update`와 `destroy` 메서드를 가진 객체를 반환할 수 있었고, 인수가 바뀌면 `update`가 최신 인수 값으로 호출되었습니다. 지금은 이펙트를 사용하는 방식이 권장됩니다.

## 타입 지정 <!-- Typing -->

`Action` 인터페이스는 세 가지 선택적 타입 인수를 받습니다. 노드 타입(액션이 모든 요소에 적용된다면 `Element`일 수 있습니다), 매개변수, 그리고 액션이 만드는 커스텀 이벤트 핸들러입니다:

```svelte
<!--- file: App.svelte --->
<script>
	/**
	 * @type {import('svelte/action').Action<
	 * 	HTMLDivElement,
	 * 	undefined,
	 * 	{
	 * 		onswiperight: (e: CustomEvent) => void;
	 * 		onswipeleft: (e: CustomEvent) => void;
	 * 		// ...
	 * 	}
	 * >}
	 */
	function gestures(node) {
		$effect(() => {
			// ...
			node.dispatchEvent(new CustomEvent('swipeleft'));

			// ...
			node.dispatchEvent(new CustomEvent('swiperight'));
		});
	}
</script>

<div
	use:gestures
	onswipeleft={next}
	onswiperight={prev}
>...</div>
```
