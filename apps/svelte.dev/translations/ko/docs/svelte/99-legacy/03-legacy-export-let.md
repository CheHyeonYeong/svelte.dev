---
title: export let
---

룬 모드에서는 [컴포넌트 props](basic-markup#Component-props)를 [`$props`]($props) 룬으로 선언하며, 이를 통해 부모 컴포넌트가 데이터를 전달할 수 있습니다.

레거시 모드에서는 props를 `export` 키워드로 표시하며, 기본값을 지정할 수 있습니다:

```svelte
<script>
	export let foo;
	export let bar = 'default value';

	// Values that are passed in as props
	// are immediately available
	console.log({ foo });
</script>
```

기본값은 컴포넌트가 생성될 때 값이 `undefined`인 경우에 사용됩니다.

> [!NOTE] 룬 모드와 달리, 부모 컴포넌트가 prop을 정의된 값에서 `undefined`로 바꿔도 초기값으로 되돌아가지 않습니다.

기본값이 없는 props는 *필수*로 간주되며, 값이 제공되지 않으면 Svelte가 개발 중에 경고를 출력합니다. 기본값으로 `undefined`를 지정하면 이 경고를 없앨 수 있습니다:

```js
export let foo +++= undefined;+++
```

## 컴포넌트 export <!-- Component exports -->

export한 `const`, `class`, `function` 선언은 prop으로 간주되지 *않습니다*. 대신 컴포넌트 API의 일부가 됩니다:

```svelte
<!--- file: Greeter.svelte--->
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

```svelte
<!--- file: App.svelte --->
<script>
	import Greeter from './Greeter.svelte';

	let greeter;
</script>

<Greeter bind:this={greeter} />

<button on:click={() => greeter.greet('world')}>
	greet
</button>
```

## props 이름 바꾸기 <!-- Renaming props -->

`export` 키워드는 선언과 따로 쓸 수도 있습니다. 예를 들어 예약어인 경우처럼 props 이름을 바꿀 때 유용합니다:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {string} */
	let className;

	// creates a `class` property, even
	// though it is a reserved word
	export { className as class };
</script>
```
