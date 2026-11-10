---
title: 모범 사례
skill: true
name: svelte-core-bestpractices
description: Guidance on writing fast, robust, modern Svelte code. Load this skill whenever in a Svelte project and asked to write/edit or analyze a Svelte component or module. Covers reactivity, event handling, styling, integration with libraries and more.
---

<!-- llm-ignore-start -->
이 문서는 빠르고 견고한 Svelte 앱을 작성하는 데 도움이 되는 몇 가지 모범 사례를 정리합니다. 에이전트용 `svelte-core-bestpractices` 스킬로도 제공됩니다.
<!-- llm-ignore-end -->

## `$state`

`$state` 룬은 *반응형*이어야 하는 변수, 즉 `$effect`, `$derived`, 템플릿 표현식을 업데이트시키는 변수에만 사용하세요. 나머지는 모두 일반 변수로 두면 됩니다.

객체와 배열(`$state({...})` 또는 `$state([...])`)은 깊은 반응성을 갖게 되어, 변경(mutation)이 업데이트를 일으킵니다. 여기에는 트레이드오프가 있습니다. 세밀한 반응성을 얻는 대가로 객체를 프록시로 감싸야 하므로 성능 오버헤드가 생깁니다. 변경하지 않고 재할당만 하는 큰 객체를 다룬다면 `$state.raw`를 대신 사용하세요. 예를 들어 API 응답이 흔히 이런 경우입니다.

## `$derived`

상태로부터 무언가를 계산할 때는 `$effect`가 아니라 `$derived`를 사용하세요:

```js
// @errors: 2451
let num = 0;
// ---cut---
// do this
let square = $derived(num * num);

// don't do this
let square;

$effect(() => {
	square = num * num;
});
```

> [!NOTE] `$derived`에는 함수가 *아니라* 표현식을 넘깁니다. (예를 들어 표현식이 복잡해서) 함수를 써야 한다면 `$derived.by`를 사용하세요.

파생 상태는 쓰기 가능합니다. `$state`처럼 값을 할당할 수 있으며, 다만 표현식이 바뀌면 다시 평가된다는 점이 다릅니다.

파생 표현식이 객체나 배열이면 그대로 반환되며, 깊은 반응성을 갖게 되지 *않습니다*. 다만 드물게 이것이 필요하다면 `$derived.by` 안에서 `$state`를 사용할 수 있습니다.

## `$effect`

이펙트는 탈출구(escape hatch)이며 대부분 피해야 합니다. 특히 이펙트 안에서 상태를 업데이트하지 마세요.

- D3 같은 외부 라이브러리와 상태를 동기화해야 한다면 [`{@attach ...}`](@attach)를 쓰는 편이 대개 더 깔끔합니다
- 사용자 상호작용에 반응해 어떤 코드를 실행해야 한다면 그 코드를 이벤트 핸들러에 직접 넣거나, 상황에 맞게 [함수 바인딩](bind#Function-bindings)을 사용하세요
- 디버깅을 위해 값을 로그로 남겨야 한다면 [`$inspect`]($inspect)를 사용하세요
- Svelte 바깥의 무언가를 관찰해야 한다면 [`createSubscriber`](svelte-reactivity#createSubscriber)를 사용하세요

이펙트의 내용을 `if (browser) {...}` 같은 것으로 감싸지 마세요. 이펙트는 서버에서 실행되지 않습니다.

## `$props`

props는 바뀔 수 있다고 생각하고 다루세요. 예를 들어 props에 의존하는 값은 보통 `$derived`를 사용해야 합니다:

```js
// @errors: 2451
let { type } = $props();

// do this
let color = $derived(type === 'danger' ? 'red' : 'green');

// don't do this — `color` will not update if `type` changes
let color = type === 'danger' ? 'red' : 'green';
```

## `$inspect.trace`

`$inspect.trace`는 반응성을 위한 디버깅 도구입니다. 무언가가 제대로 업데이트되지 않거나 필요 이상으로 실행된다면, `$effect`나 `$derived.by`(또는 이들이 호출하는 함수)의 첫 줄에 `$inspect.trace(label)`을 추가해 의존성을 추적하고 어떤 의존성이 업데이트를 일으켰는지 알아낼 수 있습니다.

## `#key` 블록 <!-- `#key` block -->

`#key` 블록은 특정 표현식이 바뀔 때 트랜지션/애니메이션을 실행하고 싶을 때 유용하지만, 매번 안에 있는 모든 요소/컴포넌트를 언마운트하므로 비용이 매우 클 수 있습니다. 그러니 아껴서 사용하세요. 예를 들어 자식 컴포넌트의 `<script>` 블록에 있는 표현식을 다시 실행시키려고 `#key`를 쓰는 대신, 그 표현식을 `$derived`로 감싸는 것을 고려하세요.

## 이벤트 <!-- Events -->

`on`으로 시작하는 요소 속성은 모두 이벤트 리스너로 취급됩니다:

```svelte
<button onclick={() => {...}}>click me</button>

<!-- attribute shorthand also works -->
<button {onclick}>...</button>

<!-- so do spread attributes -->
<button {...props}>...</button>
```

`window`나 `document`에 리스너를 붙여야 한다면 `<svelte:window>`와 `<svelte:document>`를 사용할 수 있습니다:

```svelte
<svelte:window onkeydown={...} />
<svelte:document onvisibilitychange={...} />
```

이를 위해 `onMount`나 `$effect`를 사용하지 마세요.

## 스니펫 <!-- Snippets -->

[스니펫](snippet)은 재사용할 수 있는 마크업 조각을 정의하는 방법으로, [`{@render ...}`](@render) 태그로 인스턴스화하거나 컴포넌트에 props로 넘길 수 있습니다. 스니펫은 템플릿 안에서 선언해야 합니다.

```svelte
{#snippet greeting(name)}
  <p>hello {name}!</p>
{/snippet}

{@render greeting('world')}
```

> [!NOTE] 컴포넌트의 최상위(즉 요소나 블록 안이 아닌 곳)에 선언한 스니펫은 `<script>` 안에서 참조할 수 있습니다. 컴포넌트 상태를 참조하지 않는 스니펫은 `<script module>`에서도 사용할 수 있으며, 이 경우 다른 컴포넌트에서 쓸 수 있도록 export할 수 있습니다.

## each 블록 <!-- Each blocks -->

[키 있는 each 블록](each#Keyed-each-blocks)을 사용하는 것이 좋습니다. 기존 항목에 속한 DOM을 업데이트하는 대신 Svelte가 항목을 정확히 골라 삽입하거나 제거할 수 있어 성능이 좋아집니다.

> [!NOTE] 키는 객체를 *반드시* 고유하게 식별해야 합니다. 인덱스를 키로 쓰지 마세요.

(예를 들어 `bind:value={item.count}` 같은 방식으로) 항목을 변경해야 한다면 구조 분해를 피하세요.

## CSS에서 JavaScript 변수 사용하기 <!-- Using JavaScript variables in CSS -->

CSS 안에서 쓰고 싶은 JS 변수가 있다면 `style:` 지시어로 CSS 커스텀 속성을 설정할 수 있습니다.

```svelte
<div style:--columns={columns}>...</div>
```

그러면 컴포넌트의 `<style>` 안에서 `var(--columns)`를 참조할 수 있습니다.

## 자식 컴포넌트 스타일링 <!-- Styling child components -->

컴포넌트의 `<style>`에 있는 CSS는 그 컴포넌트로 범위가 한정됩니다. 부모 컴포넌트가 자식의 스타일을 제어해야 한다면 CSS 커스텀 속성을 사용하는 방법이 좋습니다:

```svelte
<!-- Parent.svelte -->
<Child --color="red" />

<!-- Child.svelte -->
<h1>Hello</h1>

<style>
	h1 {
		color: var(--color);
	}
</style>
```

이 방법이 불가능하다면(예를 들어 자식 컴포넌트가 라이브러리에서 온 경우) `:global`로 스타일을 덮어쓸 수 있습니다:

```svelte
<div>
	<Child />
</div>

<style>
	div :global {
		h1 {
			color: red;
		}
	}
</style>
```

## 컨텍스트 <!-- Context -->

공유 모듈에 상태를 선언하는 대신 컨텍스트 사용을 고려하세요. 이렇게 하면 상태의 범위가 그 상태가 필요한 앱의 일부로 한정되고, 서버 사이드 렌더링 시 상태가 사용자 간에 새어 나갈 가능성이 없어집니다.

`setContext`와 `getContext` 대신 `createContext`를 사용하세요. 타입 안전성을 제공합니다.

## 비동기 Svelte <!-- Async Svelte -->

버전 5.36 이상을 사용한다면 [await 표현식](await-expressions)과 [hydratable](hydratable)을 사용해 컴포넌트 안에서 프로미스를 직접 사용할 수 있습니다. 이 기능들은 아직 완전히 안정적이라고 보지 않으므로 `vite.config.js`의 플러그인 옵션이나 `svelte.config.js`에서 `experimental.async` 옵션을 활성화해야 합니다.

## 레거시 기능 피하기 <!-- Avoid legacy features -->

새 코드에는 항상 룬 모드를 사용하고, 더 현대적인 대체 수단이 있는 기능은 피하세요:

- 암묵적 반응성(예: `let count = 0; count += 1`) 대신 `$state`를 사용하세요
- `$:` 할당과 문 대신 `$derived`와 `$effect`를 사용하세요(단, 더 나은 해결책이 없을 때만 이펙트를 사용하세요)
- `export let`, `$$props`, `$$restProps` 대신 `$props`를 사용하세요
- `on:click={...}` 대신 `onclick={...}`를 사용하세요
- `<slot>`, `$$slots`, `<svelte:fragment>` 대신 `{#snippet ...}`과 `{@render ...}`를 사용하세요
- `<svelte:component this={DynamicComponent}>` 대신 `<DynamicComponent>`를 사용하세요
- `<svelte:self>` 대신 `import Self from './ThisComponent.svelte'`와 `<Self>`를 사용하세요
- 컴포넌트 간에 반응성을 공유할 때는 스토어 대신 `$state` 필드를 가진 클래스를 사용하세요
- `use:action` 대신 `{@attach ...}`를 사용하세요
- `class` 속성에서는 `class:` 지시어 대신 clsx 스타일의 배열과 객체를 사용하세요
