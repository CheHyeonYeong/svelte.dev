---
title: svelte
---



```js
// @noErrors
import {
	SvelteComponent,
	SvelteComponentTyped,
	afterUpdate,
	beforeUpdate,
	createContext,
	createEventDispatcher,
	createRawSnippet,
	flushSync,
	fork,
	getAbortSignal,
	getAllContexts,
	getContext,
	hasContext,
	hydratable,
	hydrate,
	mount,
	onDestroy,
	onMount,
	setContext,
	settled,
	tick,
	unmount,
	untrack
} from 'svelte';
```

## SvelteComponent

Svelte 4에서 Svelte 컴포넌트의 기본 클래스였습니다. Svelte 5 이상의 컴포넌트는
내부 동작이 완전히 다릅니다. 타입 지정에는 대신 `Component`를 사용하세요.
컴포넌트 인스턴스를 만들려면 대신 `mount`를 사용하세요.
자세한 내용은 [마이그레이션 가이드](/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를 보세요.

<div class="ts-block">

```dts
class SvelteComponent<
	Props extends Record<string, any> = Record<string, any>,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> {/*…*/}
```

<div class="ts-block-property">

```dts
static element?: typeof HTMLElement;
```

<div class="ts-block-property-details">

컴포넌트의 커스텀 엘리먼트 버전입니다. `customElement` 컴파일러 옵션으로 컴파일한 경우에만 존재합니다

</div>
</div>

<div class="ts-block-property">

```dts
[prop: string]: any;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
constructor(options: ComponentConstructorOptions<Properties<Props, Slots>>);
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 생성자는 `asClassComponent` 호환성 헬퍼를 사용할 때만 존재하며, 이 헬퍼는
임시방편일 뿐입니다. 대신 `mount`를 사용하도록 마이그레이션하세요. 자세한 내용은
[마이그레이션 가이드](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를 보세요.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
$destroy(): void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 메서드는 레거시 호환성 헬퍼 중 하나를 사용할 때만 존재하며, 이 헬퍼는
임시방편일 뿐입니다. 자세한 내용은 [마이그레이션 가이드](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를
보세요.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
$on<K extends Extract<keyof Events, string>>(
	type: K,
	callback: (e: Events[K]) => void
): () => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 메서드는 레거시 호환성 헬퍼 중 하나를 사용할 때만 존재하며, 이 헬퍼는
임시방편일 뿐입니다. 자세한 내용은 [마이그레이션 가이드](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를
보세요.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
$set(props: Partial<Props>): void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 메서드는 레거시 호환성 헬퍼 중 하나를 사용할 때만 존재하며, 이 헬퍼는
임시방편일 뿐입니다. 자세한 내용은 [마이그레이션 가이드](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를
보세요.

</div>

</div>
</div></div>



## SvelteComponentTyped

<blockquote class="tag deprecated note">

대신 `Component`를 사용하세요. 자세한 내용은 [마이그레이션 가이드](/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를 보세요.

</blockquote>

<div class="ts-block">

```dts
class SvelteComponentTyped<
	Props extends Record<string, any> = Record<string, any>,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> extends SvelteComponent<Props, Events, Slots> {}
```

</div>



## afterUpdate

<blockquote class="tag deprecated note">

대신 [`$effect`](/docs/svelte/$effect)를 사용하세요

</blockquote>

컴포넌트가 업데이트된 직후에 실행될 콜백을 예약합니다.

콜백은 최초의 `onMount` 이후에 처음 실행됩니다.

룬 모드에서는 대신 `$effect`를 사용하세요.

<div class="ts-block">

```dts
function afterUpdate(fn: () => void): void;
```

</div>



## beforeUpdate

<blockquote class="tag deprecated note">

대신 [`$effect.pre`](/docs/svelte/$effect#$effect.pre)를 사용하세요

</blockquote>

상태가 바뀐 뒤 컴포넌트가 업데이트되기 직전에 실행될 콜백을 예약합니다.

콜백은 최초의 `onMount` 이전에 처음 실행됩니다.

룬 모드에서는 대신 `$effect.pre`를 사용하세요.

<div class="ts-block">

```dts
function beforeUpdate(fn: () => void): void;
```

</div>



## createContext

<blockquote class="since note">

5.40.0부터 사용 가능

</blockquote>

컨텍스트를 타입 안전하게 다루기 위한 세 함수의 묶음 `[get, set, has]`를 반환합니다.

현재 컴포넌트나 그 조상 컴포넌트에서 아직 `set`을 호출하지 않았다면 `get`은
에러를 던집니다.

<div class="ts-block">

```dts
function createContext<T>(): [
	() => T,
	(context: T) => T,
	() => boolean
];
```

</div>



## createEventDispatcher

<blockquote class="tag deprecated note">

대신 콜백 props나 `$host()` 룬, 또는 둘 다를 사용하세요. [마이그레이션 가이드](/docs/svelte/v5-migration-guide#Event-changes-Component-events)를 보세요

</blockquote>

[컴포넌트 이벤트](/docs/svelte/legacy-on#Component-events)를 디스패치하는 데 쓸 수 있는 이벤트 디스패처를 만듭니다.
이벤트 디스패처는 `name`과 `detail` 두 인자를 받을 수 있는 함수입니다.

`createEventDispatcher`로 만든 컴포넌트 이벤트는
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)를 생성합니다.
이 이벤트는 [버블링](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture)되지 않습니다.
`detail` 인자는 [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
속성에 해당하며, 어떤 타입의 데이터든 담을 수 있습니다.

이벤트 디스패처에 타입을 지정하면 허용되는 이벤트 이름과 `detail` 인자의 타입을 좁힐 수 있습니다.
```ts
const dispatch = createEventDispatcher<{
 loaded: null; // does not take a detail argument
 change: string; // takes a detail argument of type string, which is required
 optional: number | null; // takes an optional detail argument of type number
}>();
```

<div class="ts-block">

```dts
function createEventDispatcher<
	EventMap extends Record<string, any> = any
>(): EventDispatcher<EventMap>;
```

</div>



## createRawSnippet

프로그래밍 방식으로 스니펫을 만듭니다

<div class="ts-block">

```dts
function createRawSnippet<Params extends unknown[]>(
	fn: (...params: Getters<Params>) => {
		render: () => string;
		setup?: (element: Element) => void | (() => void);
	}
): Snippet<Params>;
```

</div>



## flushSync

대기 중인 업데이트를 모두 동기적으로 반영(flush)합니다.
콜백을 넘기지 않으면 void를 반환하고, 넘기면 콜백을 호출한 결과를 반환합니다.

<div class="ts-block">

```dts
function flushSync<T = void>(fn?: (() => T) | undefined): T;
```

</div>



## fork

<blockquote class="since note">

5.42부터 사용 가능

</blockquote>

상태 변경을 평가하되 DOM에는 적용하지 않는 '포크(fork)'를 만듭니다.
예를 들어 사용자가 곧 어떤 동작을 하리라 예상될 때 데이터를 미리
불러오는(speculative loading) 데 유용합니다.

SvelteKit 같은 프레임워크는 이를 이용해 사용자가 링크를 터치하거나 링크 위에 마우스를 올렸을 때
데이터를 프리로드할 수 있고, 덕분에 뒤이은 내비게이션이 즉각적으로 느껴집니다.

`fn` 매개변수는 어떤 상태를 변경하는 동기 함수입니다.
이 상태 변경은 포크가 초기화된 뒤 되돌려졌다가, 나중에 포크가 커밋되면
그때 다시 적용됩니다.

포크가 커밋되지 *않을* 것이 분명해지면(예: 사용자가
다른 곳으로 이동한 경우) 메모리 누수를 막기 위해 반드시 폐기해야 합니다.

<div class="ts-block">

```dts
function fork(fn: () => void): Fork;
```

</div>



## getAbortSignal

현재 [파생 상태](/docs/svelte/$derived)나 [이펙트](/docs/svelte/$effect)가 다시 실행되거나 파괴될 때 중단(abort)되는 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)을 반환합니다.

파생 상태나 이펙트가 실행되는 동안 호출해야 합니다.

```svelte
<script>
	import { getAbortSignal } from 'svelte';

	let { id } = $props();

	async function getData(id) {
		const response = await fetch(`/items/${id}`, {
			signal: getAbortSignal()
		});

		return await response.json();
	}

	const data = $derived(await getData(id));
</script>
```

<div class="ts-block">

```dts
function getAbortSignal(): AbortSignal;
```

</div>



## getAllContexts

현재 컴포넌트에 속한 컨텍스트 맵 전체를 가져옵니다. 조상 컴포넌트에서 상속된 항목도
포함합니다. 컴포넌트 초기화 중에 호출해야 합니다. 예를 들어 프로그래밍 방식으로
컴포넌트를 만들면서 기존 컨텍스트를 넘겨주고 싶을 때 유용합니다.

<div class="ts-block">

```dts
function getAllContexts<
	T extends Map<any, any> = Map<any, any>
>(): T;
```

</div>



## getContext

현재 컴포넌트나 그 조상 컴포넌트에서 지정한 `key`로 설정된 컨텍스트를 가져옵니다.
여러 컴포넌트가 같은 key를 설정했다면 가장 가까운 컴포넌트의 값이 반환됩니다.
현재 컴포넌트의 `setContext` 호출은 그 뒤에 실행되는 `getContext` 호출에서만 보입니다.
컴포넌트 초기화 중에 호출해야 합니다.

[`createContext`](/docs/svelte/svelte#createContext)를 쓰면 타입 안전하게 같은 일을 할 수 있습니다.

<div class="ts-block">

```dts
function getContext<T>(key: any): T;
```

</div>



## hasContext

현재 컴포넌트나 그 조상 컴포넌트의 컨텍스트에 주어진 `key`가 설정되어 있는지
확인합니다. 컴포넌트 초기화 중에 호출해야 합니다.

<div class="ts-block">

```dts
function hasContext(key: any): boolean;
```

</div>



## hydratable

<div class="ts-block">

```dts
function hydratable<T>(key: string, fn: () => T): T;
```

</div>



## hydrate

주어진 대상(target)에서 컴포넌트를 하이드레이트하고, 컴포넌트의 export와 경우에 따라 props(`accessors: true`로 컴파일한 경우)를 반환합니다

<div class="ts-block">

```dts
function hydrate<
	Props extends Record<string, any>,
	Exports extends Record<string, any>
>(
	component:
		| ComponentType<SvelteComponent<Props>>
		| Component<Props, Exports, any>,
	options: {} extends Props
		? {
				target: Document | Element | ShadowRoot;
				props?: Props;
				events?: Record<string, (e: any) => any>;
				context?: Map<any, any>;
				intro?: boolean;
				recover?: boolean;
				transformError?: (error: unknown) => unknown;
			}
		: {
				target: Document | Element | ShadowRoot;
				props: Props;
				events?: Record<string, (e: any) => any>;
				context?: Map<any, any>;
				intro?: boolean;
				recover?: boolean;
				transformError?: (error: unknown) => unknown;
			}
): Exports;
```

</div>



## mount

주어진 대상(target)에 컴포넌트를 마운트하고, 컴포넌트의 export와 경우에 따라 props(`accessors: true`로 컴파일한 경우)를 반환합니다.
`intro` 옵션을 `false`로 설정하지 않으면 최초 렌더링 중에 트랜지션이 재생됩니다.

<div class="ts-block">

```dts
function mount<
	Props extends Record<string, any>,
	Exports extends Record<string, any>
>(
	component:
		| ComponentType<SvelteComponent<Props>>
		| Component<Props, Exports, any>,
	options: MountOptions<Props>
): Exports;
```

</div>



## onDestroy

컴포넌트가 언마운트되기 직전에 실행될 콜백을 예약합니다.

`onMount`, `beforeUpdate`, `afterUpdate`, `onDestroy` 중에서
서버 사이드 컴포넌트 안에서 실행되는 것은 이것뿐입니다.

<div class="ts-block">

```dts
function onDestroy(fn: () => any): void;
```

</div>



## onMount

`onMount`는 [`$effect`](/docs/svelte/$effect)처럼, 컴포넌트가 DOM에 마운트되자마자 실행될 함수를 예약합니다.
`$effect`와 달리, 전달한 함수는 한 번만 실행됩니다.

컴포넌트 초기화 중에 호출해야 합니다(하지만 컴포넌트 *안에* 있을 필요는 없으며,
외부 모듈에서 호출해도 됩니다). `onMount`에서 함수를 *동기적으로* 반환하면,
그 함수는 컴포넌트가 언마운트될 때 호출됩니다.

`onMount` 함수는 [서버 사이드 렌더링](/docs/svelte/svelte-server#render) 중에는 실행되지 않습니다.

<div class="ts-block">

```dts
function onMount<T>(
	fn: () =>
		| NotFunction<T>
		| Promise<NotFunction<T>>
		| (() => any)
): void;
```

</div>



## setContext

임의의 `context` 객체를 현재 컴포넌트 및 지정한 `key`와 연결하고
그 객체를 반환합니다. 이렇게 설정한 컨텍스트는 컴포넌트 자신과 모든
자손 컴포넌트(슬롯으로 전달된 콘텐츠 포함)에서 `getContext`로 사용할 수 있습니다.

생명주기 함수와 마찬가지로, 컴포넌트 초기화 중에 호출해야 합니다.

[`createContext`](/docs/svelte/svelte#createContext)를 쓰면 타입 안전하게 같은 일을 할 수 있습니다.

<div class="ts-block">

```dts
function setContext<T>(key: any, context: T): T;
```

</div>



## settled

<blockquote class="since note">

5.36부터 사용 가능

</blockquote>

상태 변경과 그로 인한 비동기 작업이 모두 끝나고
DOM이 업데이트되면 이행되는 프로미스를 반환합니다

<div class="ts-block">

```dts
function settled(): Promise<void>;
```

</div>



## tick

대기 중인 상태 변경이 모두 적용되면 이행되는 프로미스를 반환합니다.

<div class="ts-block">

```dts
function tick(): Promise<void>;
```

</div>



## unmount

이전에 `mount`나 `hydrate`로 마운트한 컴포넌트를 언마운트합니다.

5.13.0부터는 `options.outro`가 `true`이면 컴포넌트가 DOM에서 제거되기 전에 [트랜지션](/docs/svelte/transition)이 재생됩니다.

`options.outro`가 true이면 트랜지션이 끝난 뒤에, 그렇지 않으면 즉시 이행되는 `Promise`를 반환합니다(5.13.0 이전에는 `void`를 반환합니다).

```js
// @errors: 7031
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.body });

// later...
unmount(app, { outro: true });
```

<div class="ts-block">

```dts
function unmount(
	component: Record<string, any>,
	options?:
		| {
				outro?: boolean;
		  }
		| undefined
): Promise<void>;
```

</div>



## untrack

[`$derived`](/docs/svelte/$derived)나 [`$effect`](/docs/svelte/$effect) 안에서 사용하면,
`fn` 안에서 읽은 상태는 의존성으로 취급되지 않습니다.

```ts
$effect(() => {
	// this will run when `data` changes, but not when `time` changes
	save(data, {
		timestamp: untrack(() => time)
	});
});
```

<div class="ts-block">

```dts
function untrack<T>(fn: () => T): T;
```

</div>



## Component

타입이 엄격하게 지정된 Svelte 컴포넌트를 만드는 데 사용할 수 있습니다.

#### Example:

npm에 `component-library`라는 컴포넌트 라이브러리가 있고, 여기서
`MyComponent`라는 컴포넌트를 export한다고 해 봅시다. Svelte+TypeScript 사용자를 위해
타입을 제공하고 싶다면 다음과 같이 `index.d.ts`를 만듭니다.
```ts
import type { Component } from 'svelte';
export declare const MyComponent: Component<{ foo: string }> {}
```
이렇게 타입을 지정하면 Svelte 확장이 설치된 VS Code 같은 IDE가
인텔리센스를 제공할 수 있고, TypeScript를 사용하는 Svelte 파일에서
다음과 같이 컴포넌트를 사용할 수 있습니다.
```svelte
<script lang="ts">
	import { MyComponent } from "component-library";
</script>
<MyComponent foo={'bar'} />
```

<div class="ts-block">

```dts
interface Component<
	Props extends Record<string, any> = {},
	Exports extends Record<string, any> = {},
	Bindings extends keyof Props | '' = string
> {/*…*/}
```

<div class="ts-block-property">

```dts
(
	this: void,
	internals: ComponentInternals,
	props: Props
): {
	/**
	 * @deprecated This method only exists when using one of the legacy compatibility helpers, which
	 * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)
	 * for more info.
	 */
	$on?(type: string, callback: (e: any) => void): () => void;
	/**
	 * @deprecated This method only exists when using one of the legacy compatibility helpers, which
	 * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)
	 * for more info.
	 */
	$set?(props: Partial<Props>): void;
} & Exports;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `internal` Svelte가 사용하는 내부 객체입니다. 사용하거나 수정하지 마세요.
- `props` 컴포넌트에 전달된 props입니다.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
element?: typeof HTMLElement;
```

<div class="ts-block-property-details">

컴포넌트의 커스텀 엘리먼트 버전입니다. `customElement` 컴파일러 옵션으로 컴파일한 경우에만 존재합니다

</div>
</div></div>

## ComponentConstructorOptions

<blockquote class="tag deprecated note">

Svelte 4에서 컴포넌트는 클래스이고, Svelte 5에서는 함수입니다.
컴포넌트 인스턴스를 만들려면 대신 `mount`를 사용하세요.
자세한 내용은 [마이그레이션 가이드](/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)를
보세요.

</blockquote>

<div class="ts-block">

```dts
interface ComponentConstructorOptions<
	Props extends Record<string, any> = Record<string, any>
> {/*…*/}
```

<div class="ts-block-property">

```dts
target: Element | Document | ShadowRoot;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
anchor?: Element;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
props?: Props;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
context?: Map<any, any>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
hydrate?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
intro?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
recover?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
sync?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
idPrefix?: string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
$$inline?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
transformError?: (error: unknown) => unknown;
```

<div class="ts-block-property-details"></div>
</div></div>

## ComponentEvents

<blockquote class="tag deprecated note">

새 `Component` 타입에는 전용 Events 타입이 없습니다. 대신 `ComponentProps`를 사용하세요.

</blockquote>

<div class="ts-block">

```dts
type ComponentEvents<Comp extends SvelteComponent> =
	Comp extends SvelteComponent<any, infer Events>
		? Events
		: never;
```

</div>

## ComponentInternals

환경마다 달라지는 내부 구현 세부 사항

<div class="ts-block">

```dts
type ComponentInternals = Branded<{}, 'ComponentInternals'>;
```

</div>

## ComponentProps

주어진 컴포넌트가 기대하는 props를 가져오는 편의 타입입니다.

예시: 변수가 `MyComponent`가 기대하는 props를 담고 있는지 보장합니다.

```ts
import type { ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

// Errors if these aren't the correct props expected by MyComponent.
const props: ComponentProps<typeof MyComponent> = { foo: 'bar' };
```

> [!NOTE] Svelte 4에서는 `MyComponent`가 클래스였기 때문에 `ComponentProps<MyComponent>`라고 썼습니다.

예시: 컴포넌트를 받아 그 props의 타입을 추론하는 제네릭 함수입니다.

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {};

// Errors if the second argument is not the correct props expected by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });
```

<div class="ts-block">

```dts
type ComponentProps<
	Comp extends SvelteComponent | Component<any, any>
> =
	Comp extends SvelteComponent<infer Props>
		? Props
		: Comp extends Component<infer Props, any>
			? Props
			: never;
```

</div>

## ComponentType

<blockquote class="tag deprecated note">

새 `Component` 타입을 사용할 때는 더 이상 쓸모없는 타입입니다.

</blockquote>

<div class="ts-block">

```dts
type ComponentType<
	Comp extends SvelteComponent = SvelteComponent
> = (new (
	options: ComponentConstructorOptions<
		Comp extends SvelteComponent<infer Props>
			? Props
			: Record<string, any>
	>
) => Comp) & {
	/** The custom element version of the component. Only present if compiled with the `customElement` compiler option */
	element?: typeof HTMLElement;
};
```

</div>

## EventDispatcher

<div class="ts-block">

```dts
interface EventDispatcher<
	EventMap extends Record<string, any>
> {/*…*/}
```

<div class="ts-block-property">

```dts
<Type extends keyof EventMap>(
	...args: null extends EventMap[Type]
		? [type: Type, parameter?: EventMap[Type] | null | undefined, options?: DispatchOptions]
		: undefined extends EventMap[Type]
			? [type: Type, parameter?: EventMap[Type] | null | undefined, options?: DispatchOptions]
			: [type: Type, parameter: EventMap[Type], options?: DispatchOptions]
): boolean;
```

<div class="ts-block-property-details"></div>
</div></div>

## Fork

<blockquote class="since note">

5.42부터 사용 가능

</blockquote>

사용자의 내비게이션을 예상하고 데이터를 미리 불러오는 것처럼
화면 밖에서 일어나는 작업을 나타냅니다

<div class="ts-block">

```dts
interface Fork {/*…*/}
```

<div class="ts-block-property">

```dts
commit(): Promise<void>;
```

<div class="ts-block-property-details">

포크를 커밋합니다. 상태 변경이 적용되면 프로미스가 이행됩니다

</div>
</div>

<div class="ts-block-property">

```dts
discard(): void;
```

<div class="ts-block-property-details">

포크를 폐기합니다

</div>
</div></div>

## MountOptions

`mount()` 함수가 받는 옵션을 정의합니다.

<div class="ts-block">

```dts
type MountOptions<
	Props extends Record<string, any> = Record<string, any>
> = {
	/**
	 * Target element where the component will be mounted.
	 */
	target: Document | Element | ShadowRoot;
	/**
	 * Optional node inside `target`. When specified, it is used to render the component immediately before it.
	 */
	anchor?: Node;
	/**
	 * Allows the specification of events.
	 * @deprecated Use callback props instead.
	 */
	events?: Record<string, (e: any) => any>;
	/**
	 * Can be accessed via `getContext()` at the component level.
	 */
	context?: Map<any, any>;
	/**
	 * Whether or not to play transitions on initial render.
	 * @default true
	 */
	intro?: boolean;
	/**
	 * A function that transforms errors caught by error boundaries before they are passed to the `failed` snippet.
	 * Defaults to the identity function.
	 */
	transformError?: (
		error: unknown
	) => unknown | Promise<unknown>;
} & ({} extends Props
	? {
			/**
			 * Component properties.
			 */
			props?: Props;
		}
	: {
			/**
			 * Component properties.
			 */
			props: Props;
		});
```

</div>

## Snippet

`#snippet` 블록의 타입입니다. 예를 들어 컴포넌트가 특정 타입의 스니펫을 기대한다는 것을 표현할 때 사용할 수 있습니다.
```ts
let { banner }: { banner: Snippet<[{ text: string }]> } = $props();
```
스니펫은 `{@render ...}` 태그로만 호출할 수 있습니다.

자세한 내용은 [스니펫 문서](/docs/svelte/snippet)를 보세요.

<div class="ts-block">

```dts
interface Snippet<Parameters extends unknown[] = []> {/*…*/}
```

<div class="ts-block-property">

```dts
(
	this: void,
	// this conditional allows tuples but not arrays. Arrays would indicate a
	// rest parameter type, which is not supported. If rest parameters are added
	// in the future, the condition can be removed.
	...args: number extends Parameters['length'] ? never : Parameters
): {
	'{@render ...} must be called with a Snippet': "import type { Snippet } from 'svelte'";
} & typeof SnippetReturn;
```

<div class="ts-block-property-details"></div>
</div></div>


