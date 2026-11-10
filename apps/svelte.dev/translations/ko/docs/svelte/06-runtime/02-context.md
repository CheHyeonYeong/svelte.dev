---
title: 컨텍스트
---

컨텍스트를 사용하면 컴포넌트가 부모 컴포넌트가 가진 값을 props로 전달받지 않고도 접근할 수 있습니다(props로 전달하면 중간 컴포넌트를 여러 겹 거쳐야 할 수도 있는데, 이를 'prop 드릴링'이라고 합니다).

`createContext`로 `[get, set, has]` 세 함수를 만들면, 부모 컴포넌트에서 컨텍스트를 설정하고 자식 컴포넌트에서 가져올 수 있습니다:

<!-- codeblock:start {"title":"Context","selected":"context.ts"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Parent from './Parent.svelte';
	import Child from './Child.svelte';
</script>

<Parent>
	<Child />
</Parent>
```

```svelte
<!--- file: Parent.svelte --->
<script>
	import { setUserContext } from './context';

	let { children } = $props();

	setUserContext({ name: 'world' });
</script>

{@render children()}
```

```svelte
<!--- file: Child.svelte --->
<script>
	import { getUserContext } from './context';

	const user = getUserContext();
</script>

<h1>hello {user.name}, inside Child.svelte</h1>
```

```ts
/// file: context.ts
import { createContext } from 'svelte';

interface User {
	name: string;
}

export const [getUserContext, setUserContext] = createContext<User>();
```
<!-- codeblock:end -->

> [!NOTE] `createContext`는 5.40 버전에서 추가되었습니다. 그 이전 버전의 Svelte를 사용한다면 대신 `setContext`와 `getContext`를 사용해야 합니다.

이 방식은 위 예시처럼 `Parent.svelte`가 `Child.svelte`를 직접 알지 못하고 `children` [스니펫](snippet)의 일부로 렌더링할 때 특히 유용합니다.

## `setContext`와 `getContext` <!-- `setContext` and `getContext` -->

`createContext` 대신 `setContext`와 `getContext`를 직접 사용할 수도 있습니다. 부모 컴포넌트는 `setContext(key, value)`로 컨텍스트를 설정하고...

```svelte
<!--- file: Parent.svelte --->
<script>
	import { setContext } from 'svelte';

	setContext('my-context', 'hello from Parent.svelte');
</script>
```

...자식은 `getContext`로 그 값을 가져옵니다:

```svelte
<!--- file: Child.svelte --->
<script>
	import { getContext } from 'svelte';

	const message = getContext('my-context');
</script>

<h1>{message}, inside Child.svelte</h1>
```

키(위 예시에서는 `'my-context'`)와 컨텍스트 자체는 어떤 JavaScript 값이든 될 수 있습니다.

> [!NOTE] 타입 안전성이 더 좋고 키를 쓸 필요가 없으므로 `createContext`를 권장합니다.

Svelte는 [`setContext`](svelte#setContext)와 [`getContext`](svelte#getContext) 외에도 [`hasContext`](svelte#hasContext)와 [`getAllContexts`](svelte#getAllContexts) 함수를 제공합니다.

## 컨텍스트와 상태 함께 사용하기 <!-- Using context with state -->

컨텍스트에 반응형 상태를 저장할 수 있습니다...

<!-- codeblock:start {"title":"Context with state"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import { setCounter } from './context.ts';
	import Child from './Child.svelte';

	let counter = $state({
		count: 0
	});

	setCounter(counter);
</script>

<button onclick={() => counter.count += 1}>
	increment
</button>

<Child />
<Child />
<Child />

<button onclick={() => counter.count = 0}>
	reset
</button>
```

```svelte
<!--- file: Child.svelte --->
<script>
	import { getCounter } from './context.ts';

	const counter = getCounter();
</script>

<p>{counter.count}</p>
```

```ts
/// file: context.ts
import { createContext } from 'svelte';

interface Counter {
	count: number;
}

export const [getCounter, setCounter] = createContext<Counter>();
```
<!-- codeblock:end -->

...다만 `counter`를 업데이트하는 대신 *재할당*하면 '연결이 끊어진다'는 점에 유의하세요. 다시 말해 이렇게 하는 대신...

```svelte
<button onclick={() => counter = { count: 0 } }>
	reset
</button>
```

...이렇게 해야 합니다:

```svelte
<button onclick={() => +++counter.count = 0+++}>
	reset
</button>
```

잘못 사용하면 Svelte가 경고해 줍니다.

마찬가지로 원시 값을 컨텍스트로 전달하려면 [함수에 상태 전달하기]($state#Passing-state-into-functions)에서 설명한 대로 함수를 사용하세요.

## 컨텍스트와 함께 컴포넌트 마운트하기 <!-- Mounting components with context -->

특정 컨텍스트와 함께 컴포넌트를 마운트하려면, 컴포넌트를 렌더링하기 전에 컨텍스트를 설정하는 래퍼 컴포넌트를 만드세요. 이 방법은 [컴포넌트 테스트](testing#Unit-and-component-tests-with-Vitest-Component-testing)처럼 `mount`를 통해 컨텍스트를 제공해야 하는 모든 상황에서 유용합니다. 5.49 버전부터는 다음과 같이 할 수 있습니다:

```js
import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { setUserContext } from './context';
import MyComponent from './MyComponent.svelte';

test('MyComponent', () => {
	function Wrapper(...args) {
		setUserContext({ name: 'Bob' });
		return MyComponent(...args);
	}

	const component = mount(Wrapper, {
		target: document.body
	});

	expect(document.body.innerHTML).toBe('<h1>Hello Bob!</h1>');

	unmount(component);
});
```

이 방법은 [`hydrate`](imperative-component-api#hydrate)와 [`render`](imperative-component-api#render)에서도 동작합니다.

래퍼가 설정한 컨텍스트는 마운트된 해당 컴포넌트 트리에만 적용됩니다. `mount`, `hydrate`, `render`를 호출할 때마다 별도의 래퍼 인스턴스가 만들어지므로 컨텍스트가 다른 마운트된 컴포넌트로 새어 나가지 않습니다.

## 전역 상태 대체하기 <!-- Replacing global state -->

여러 컴포넌트가 공유하는 상태가 있으면, 그 상태를 별도 모듈에 두고 필요한 곳에서 import하고 싶어질 수 있습니다:

```js
/// file: state.svelte.js
export const myGlobalState = $state({
	user: {
		// ...
	}
	// ...
});
```

대부분은 이렇게 해도 전혀 문제없지만 위험이 하나 있습니다. 서버 사이드 렌더링 중에 상태를 변경하면(권장하지는 않지만 얼마든지 가능합니다!)...

```svelte
<!--- file: App.svelte --->
<script>
	import { myGlobalState } from './state.svelte.js';

	let { data } = $props();

	if (data.user) {
		myGlobalState.user = data.user;
	}
</script>
```

...그 데이터에 *다음* 사용자가 접근할 수 있게 됩니다. 컨텍스트는 요청 간에 공유되지 않으므로 이 문제를 해결해 줍니다.
