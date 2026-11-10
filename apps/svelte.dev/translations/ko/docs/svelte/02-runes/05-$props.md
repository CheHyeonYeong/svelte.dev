---
title: $props
tags: rune-props
---

컴포넌트에 들어가는 입력을 *props*라고 하며, *properties*(속성)의 줄임말입니다. 요소에 속성을 전달하는 것과 똑같이 컴포넌트에 props를 전달합니다:

```svelte
<!--- file: App.svelte --->
<script>
	import MyComponent from './MyComponent.svelte';
</script>

<MyComponent adjective="cool" />
```

반대편인 `MyComponent.svelte` 안에서는 `$props` 룬으로 props를 받을 수 있습니다...

```svelte
<!--- file: MyComponent.svelte --->
<script>
	let props = $props();
</script>

<p>this component is {props.adjective}</p>
```

...다만 보통은 props를 [*구조 분해*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)해서 사용합니다:

```svelte
<!--- file: MyComponent.svelte --->
<script>
	let +++{ adjective }+++ = $props();
</script>

<p>this component is {+++adjective+++}</p>
```

## 폴백 값 <!-- Fallback values -->

구조 분해를 사용하면 폴백 값을 선언할 수 있습니다. 폴백 값은 부모 컴포넌트가 해당 prop을 설정하지 않았을 때(또는 값이 `undefined`일 때) 사용됩니다:

```js
let { adjective = 'happy' } = $props();
```

> [!NOTE] 폴백 값은 반응형 상태 프록시로 바뀌지 않습니다(자세한 내용은 [props 업데이트하기](#Updating-props)를 보세요)

## props 이름 바꾸기 <!-- Renaming props -->

구조 분해 할당으로 props의 이름을 바꿀 수도 있습니다. prop 이름이 유효하지 않은 식별자이거나 `super` 같은 JavaScript 키워드일 때는 이름을 바꿔야 합니다:

```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## 나머지 props <!-- Rest props -->

마지막으로, *나머지 속성*(rest property)을 사용하면 말 그대로 나머지 props를 가져올 수 있습니다:

```js
let { a, b, c, ...others } = $props();
```

## props 업데이트하기 <!-- Updating props -->

컴포넌트 안에서 prop을 참조하는 부분은 prop 자체가 업데이트되면 함께 업데이트됩니다. `App.svelte`에서 `count`가 바뀌면 `Child.svelte` 안에서도 바뀝니다. 하지만 자식 컴포넌트는 prop 값을 일시적으로 덮어쓸 수 있으며, 이는 저장되지 않는 임시 상태에 유용할 수 있습니다:

<!-- codeblock:start {"title":"Temporarily updating props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';

	let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
	clicks (parent): {count}
</button>

<Child {count} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
	clicks (child): {count}
</button>
```
<!-- codeblock:end -->

props를 일시적으로 *재할당*할 수는 있지만, [바인딩 가능한]($bindable) prop이 아니라면 props를 *변경*해서는 안 됩니다.

prop이 일반 객체라면 변경해도 아무 효과가 없습니다:

<!-- codeblock:start {"title":"Non-reactive props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';
</script>

<Child object={{ count: 0 }} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// has no effect
	object.count += 1
}}>
	clicks: {object.count}
</button>
```
<!-- codeblock:end -->

하지만 prop이 반응형 상태 프록시라면 변경이 효과를 *발휘하지만*, 컴포넌트가 자신에게 '속하지' 않은 상태를 변경하는 것이므로 [`ownership_invalid_mutation`](runtime-warnings#Client-warnings-ownership_invalid_mutation) 경고가 표시됩니다:

<!-- codeblock:start {"title":"Invalid mutation","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';

	let object = $state({count: 0});
</script>

<Child {object} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// will cause the count below to update,
	// but with a warning. Don't mutate
	// objects you don't own!
	object.count += 1
}}>
	clicks: {object.count}
</button>
```
<!-- codeblock:end -->

`$bindable`로 선언하지 않은 prop의 폴백 값은 손대지 않은 채로 남습니다. 즉, 반응형 상태 프록시로 바뀌지 않으므로 변경해도 업데이트가 일어나지 않습니다:

<!-- codeblock:start {"title":"Non-reactive fallback props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';
</script>

<Child />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object = { count: 0 } } = $props();
</script>

<button onclick={() => {
	// has no effect if the fallback value is used
	object.count += 1
}}>
	clicks: {object.count}
</button>
```
<!-- codeblock:end -->

정리하면, props를 변경하지 마세요. 콜백 props를 사용해 변경 사항을 전달하거나, 부모와 자식이 같은 객체를 공유해야 한다면 [`$bindable`]($bindable) 룬을 사용하세요.

## 타입 안전성 <!-- Type safety -->

다른 변수 선언과 마찬가지로 props에 타입 주석을 달아 컴포넌트에 타입 안전성을 더할 수 있습니다. TypeScript에서는 다음과 같습니다...

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

...JSDoc에서는 이렇게 할 수 있습니다:

```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

물론 타입 선언을 주석과 분리할 수도 있습니다:

```svelte
<script lang="ts">
	interface Props {
		adjective: string;
	}

	let { adjective }: Props = $props();
</script>
```

> [!NOTE] 네이티브 DOM 요소용 인터페이스는 `svelte/elements` 모듈에서 제공합니다([래퍼 컴포넌트 타입 지정하기](typescript#Typing-wrapper-components) 참고)

컴포넌트가 `children` 같은 [스니펫](snippet) props를 노출한다면, `'svelte'`에서 import한 `Snippet` 인터페이스로 타입을 지정해야 합니다. 예제는 [스니펫 타입 지정하기](snippet#Typing-snippets)를 보세요.

타입을 추가하기를 권장합니다. 컴포넌트를 사용하는 사람이 어떤 props를 제공해야 하는지 쉽게 알 수 있기 때문입니다.


## `$props.id()`

버전 5.20.0에 추가된 이 룬은 현재 컴포넌트 인스턴스에 고유한 ID를 생성합니다. 서버에서 렌더링된 컴포넌트를 하이드레이트할 때 이 값은 서버와 클라이언트에서 일관되게 유지됩니다.

`for`나 `aria-labelledby` 같은 속성으로 요소들을 연결할 때 유용합니다.

```svelte
<script>
	const uid = $props.id();
</script>

<form>
	<label for="{uid}-firstname">First Name: </label>
	<input id="{uid}-firstname" type="text" />

	<label for="{uid}-lastname">Last Name: </label>
	<input id="{uid}-lastname" type="text" />
</form>
```
