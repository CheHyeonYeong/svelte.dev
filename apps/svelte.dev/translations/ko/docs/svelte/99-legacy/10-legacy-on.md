---
title: on:
---

룬 모드에서 이벤트 핸들러는 다른 속성이나 prop과 다를 바 없습니다.

레거시 모드에서는 `on:` 지시어를 사용합니다:

```svelte
<!--- file: App.svelte --->
<script>
	let count = 0;

	/** @param {MouseEvent} event */
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	count: {count}
</button>
```

핸들러는 성능 손해 없이 인라인으로 선언할 수 있습니다:

```svelte
<button on:click={() => (count += 1)}>
	count: {count}
</button>
```

`|` 문자로 요소의 이벤트 핸들러에 *수식어*(modifier)를 추가할 수 있습니다.

```svelte
<form on:submit|preventDefault={handleSubmit}>
	<!-- the `submit` event's default is prevented,
	     so the page won't reload -->
</form>
```

사용할 수 있는 수식어는 다음과 같습니다:

- `preventDefault` — 핸들러를 실행하기 전에 `event.preventDefault()`를 호출합니다
- `stopPropagation` — `event.stopPropagation()`을 호출해 이벤트가 다음 요소로 전달되지 않게 합니다
- `stopImmediatePropagation` — `event.stopImmediatePropagation()`을 호출해 같은 이벤트의 다른 리스너가 실행되지 않게 합니다.
- `passive` — 터치/휠 이벤트의 스크롤 성능을 높입니다(안전한 곳에서는 Svelte가 자동으로 추가합니다)
- `nonpassive` — 명시적으로 `passive: false`를 설정합니다
- `capture` — 핸들러를 *버블링* 단계 대신 *캡처* 단계에서 실행합니다
- `once` — 핸들러가 처음 실행된 뒤 제거합니다
- `self` — `event.target`이 요소 자신일 때만 핸들러를 실행합니다
- `trusted` — `event.isTrusted`가 `true`일 때만, 즉 사용자 동작으로 이벤트가 발생했을 때만 핸들러를 실행합니다.

수식어는 `on:click|once|capture={...}`처럼 이어서 쓸 수 있습니다.

`on:` 지시어를 값 없이 사용하면 컴포넌트가 이벤트를 *전달*(forward)합니다. 즉 컴포넌트를 사용하는 쪽에서 그 이벤트를 수신할 수 있습니다.

```svelte
<button on:click>
	The component itself will emit the click event
</button>
```

같은 이벤트에 여러 이벤트 리스너를 둘 수 있습니다:

```svelte
<!--- file: App.svelte --->
<script>
	let count = 0;

	function increment() {
		count += 1;
	}

	/** @param {MouseEvent} event */
	function log(event) {
		console.log(event);
	}
</script>

<button on:click={increment} on:click={log}>
	clicks: {count}
</button>
```

## 컴포넌트 이벤트 <!-- Component events -->

컴포넌트는 초기화될 때 *디스패처*(dispatcher)를 만들어 이벤트를 디스패치할 수 있습니다:

```svelte
<!--- file: Stepper.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>
```

`dispatch`는 [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)를 생성합니다. 두 번째 인자를 넘기면 그 값이 이벤트 객체의 `detail` 속성이 됩니다.

이 컴포넌트를 사용하는 쪽에서는 디스패치된 이벤트를 수신할 수 있습니다:

```svelte
<script>
	import Stepper from './Stepper.svelte';

	let n = 0;
</script>

<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>

<p>n: {n}</p>
```

컴포넌트 이벤트는 버블링되지 않습니다. 부모 컴포넌트는 바로 아래 자식의 이벤트만 수신할 수 있습니다.

`once`를 제외하면 컴포넌트 이벤트 핸들러에는 수식어를 쓸 수 없습니다.

> [!NOTE]
> 나중에 Svelte 5로 마이그레이션할 계획이라면 대신 콜백 props를 사용하세요. `createEventDispatcher`는 지원 중단되었으므로 이렇게 하면 업그레이드가 더 쉬워집니다:
>
> ```svelte
> <!--- file: Stepper.svelte --->
> <script>
> 	export let decrement;
> 	export let increment;
> </script>
>
> <button on:click={decrement}>decrement</button>
> <button on:click={increment}>increment</button>
> ```
