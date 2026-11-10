---
title: TypeScript
---

<!-- - [basically what we have today](https://svelte.dev/docs/typescript)
- built-in support, but only for type-only features
- generics
- using `Component` and the other helper types
- using `svelte-check` -->

Svelte 컴포넌트 안에서 TypeScript를 사용할 수 있습니다. [Svelte VS Code 확장](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) 같은 IDE 확장을 쓰면 에디터에서 바로 에러를 잡을 수 있고, [`svelte-check`](https://www.npmjs.com/package/svelte-check)는 같은 일을 명령줄에서 해 주므로 CI에 통합할 수 있습니다.

## `<script lang="ts">`

Svelte 컴포넌트 안에서 TypeScript를 사용하려면 `script` 태그에 `lang="ts"`를 추가하세요:

```svelte
<script lang="ts">
	let name: string = 'world';

	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>
```

이렇게 하면 TypeScript의 *타입 전용* 기능을 사용할 수 있습니다. 즉 타입 표기나 인터페이스 선언처럼 JavaScript로 트랜스파일할 때 그냥 사라지는 기능은 모두 쓸 수 있습니다. TypeScript 컴파일러가 실제 코드를 출력해야 하는 기능은 지원하지 않습니다. 여기에는 다음이 포함됩니다:

- enum 사용
- 생성자 함수에서 `private`, `protected`, `public` 제어자를 초기화와 함께 사용
- 아직 ECMAScript 표준에 포함되지 않아(즉 TC39 프로세스의 4단계가 아니어서) Svelte가 JavaScript를 파싱하는 데 쓰는 파서인 Acorn에 아직 구현되지 않은 기능 사용

이런 기능 중 하나를 사용하고 싶다면 `script` 전처리기를 설정해야 합니다.

## 전처리기 설정 <!-- Preprocessor setup -->

Svelte 컴포넌트 안에서 타입 전용이 아닌 TypeScript 기능을 사용하려면, TypeScript를 JavaScript로 바꿔 주는 전처리기를 추가해야 합니다.

### Vite 사용하기 <!-- Using Vite -->

SvelteKit을 사용하거나 SvelteKit *없이* Vite를 사용한다면, 설정 파일에서 `@sveltejs/vite-plugin-svelte`의 `vitePreprocess`를 사용할 수 있습니다:

```ts
/// file: svelte.config.js
// @noErrors
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	// Note the additional `{ script: true }`
	preprocess: vitePreprocess({ script: true })
};

export default config;
```

### 다른 빌드 도구 사용하기 <!-- Using other build tools -->

대신 Rollup([rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) 사용)이나 Webpack([svelte-loader](https://github.com/sveltejs/svelte-loader) 사용) 같은 도구를 쓴다면 `typescript`와 `svelte-preprocess`를 설치하고 플러그인 설정에 전처리기를 추가하세요. 자세한 내용은 각 플러그인의 README를 참고하세요.

> [!NOTE] 새 프로젝트를 시작한다면 SvelteKit이나 Vite를 대신 사용하기를 권장합니다

## tsconfig.json 설정 <!-- tsconfig.json settings -->

TypeScript를 사용할 때는 `tsconfig.json`이 올바르게 설정되어 있는지 확인하세요.

- 클래스가 함수로 컴파일되지 않도록 [`target`](https://www.typescriptlang.org/tsconfig/#target)을 최소 `ES2015`로 지정하세요
- import가 그대로 남도록 [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax)를 `true`로 설정하세요
- 각 파일을 독립적으로 살펴보도록 [`isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules)를 `true`로 설정하세요. TypeScript에는 파일 간 분석과 컴파일이 필요한 기능이 몇 가지 있는데, Svelte 컴파일러와 Vite 같은 도구는 이를 수행하지 않습니다.

## `$props` 타입 지정 <!-- Typing `$props` -->

`$props`는 특정 속성을 가진 일반 객체처럼 타입을 지정하면 됩니다.

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}

	let {
		requiredProperty,
		optionalProperty,
		snippetWithStringArgument,
		eventHandler,
		...everythingElse
	}: Props = $props();
</script>

<button onclick={() => eventHandler('clicked button')}>
	{@render snippetWithStringArgument('hello')}
</button>
```

## 제네릭 `$props` <!-- Generic `$props` -->

컴포넌트는 속성 사이의 제네릭 관계를 선언할 수 있습니다. 예를 들어 항목 목록과, 목록의 항목 하나를 받는 콜백 속성을 받는 제네릭 리스트 컴포넌트가 있습니다. `items` 속성과 `select` 콜백이 같은 타입을 다룬다고 선언하려면 `script` 태그에 `generics` 속성을 추가하세요:

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

`generics`의 내용은 제네릭 함수의 `<...>` 태그 사이에 넣는 것과 같습니다. 즉 여러 제네릭, `extends`, 폴백 타입을 사용할 수 있습니다.

## 래퍼 컴포넌트 타입 지정 <!-- Typing wrapper components -->

네이티브 요소를 감싸는 컴포넌트를 작성한다면, 그 아래 요소의 모든 속성을 사용자에게 노출하고 싶을 수 있습니다. 이 경우 `svelte/elements`가 제공하는 인터페이스 중 하나를 사용(또는 확장)하세요. 다음은 `Button` 컴포넌트의 예입니다:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children?.()}
</button>
```

모든 요소에 전용 타입 정의가 있는 것은 아닙니다. 전용 타입 정의가 없는 요소에는 `SvelteHTMLElements`를 사용하세요:

```svelte
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	{@render children?.()}
</div>
```

## `$state` 타입 지정 <!-- Typing `$state` -->

`$state`는 다른 변수와 마찬가지로 타입을 지정할 수 있습니다.

```ts
let count: number = $state(0);
```

`$state`에 초깃값을 주지 않으면 타입의 일부가 `undefined`가 됩니다.

```ts
// @noErrors
// Error: Type 'number | undefined' is not assignable to type 'number'
let count: number = $state();
```

이를 안전하게 처리하려면 타입을 제네릭 매개변수로 직접 넘길 수 있습니다. TypeScript는 변수를 `number | undefined`로 추론합니다.

```ts
let count = $state<number>();
```

변수를 처음 사용하기 전에 값이 *반드시* 정의된다는 것을 안다면 `as` 캐스팅을 사용하세요. 특히 클래스에서 유용합니다:

```ts
class Counter {
	count = $state() as number;
	constructor(initial: number) {
		this.count = initial;
	}
}
```

## `Component` 타입 <!-- The `Component` type -->

Svelte 컴포넌트의 타입은 `Component`입니다. 이 타입과 관련 타입을 사용해 다양한 제약을 표현할 수 있습니다.

동적 컴포넌트와 함께 사용해 넘길 수 있는 컴포넌트의 종류를 제한하는 예입니다:

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		// only components that have at most the "prop"
		// property required can be passed
		DynamicComponent: Component<{ prop: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

> [!LEGACY] Svelte 4에서는 컴포넌트의 타입이 `SvelteComponent`였습니다

컴포넌트에서 속성을 추출하려면 `ComponentProps`를 사용하세요.

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {}

// Errors if the second argument is not the correct props expected
// by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });
```

변수가 컴포넌트의 생성자 타입이나 인스턴스 타입을 받는다고 선언하려면 다음과 같이 합니다:

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';

	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

## 내장 DOM 타입 확장하기 <!-- Enhancing built-in DOM types -->

Svelte는 존재하는 모든 HTML DOM 타입을 최대한 제공하려고 합니다. 때로는 실험적인 속성이나 액션에서 오는 커스텀 이벤트를 사용하고 싶을 수 있습니다. 이런 경우 TypeScript는 이 타입을 모른다며 타입 에러를 냅니다. 실험적이지 않은 표준 속성/이벤트라면 [HTML 타입 정의](https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts)에서 빠진 것일 가능성이 큽니다. 그렇다면 이슈를 열거나 이를 고치는 PR을 보내 주세요.

커스텀 또는 실험적인 속성/이벤트라면 다음과 같이 `svelte/elements` 모듈을 보강(augment)해 타입 정의를 확장할 수 있습니다:

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	// add a new element
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	// add a new global attribute that is available on all html elements
	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}

	// add a new attribute for button elements
	export interface HTMLButtonAttributes {
		veryexperimentalattribute?: string;
	}
}

export {}; // ensure this is not an ambient module, else types will be overridden instead of augmented
```

그런 다음 `tsconfig.json`에서 해당 `d.ts` 파일을 참조하는지 확인하세요. `"include": ["src/**/*"]`처럼 되어 있고 `d.ts` 파일이 `src` 안에 있다면 동작할 것입니다. 변경 사항을 적용하려면 다시 불러와야 할 수도 있습니다.
