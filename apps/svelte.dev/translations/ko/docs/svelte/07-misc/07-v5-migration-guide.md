---
title: Svelte 5 마이그레이션 가이드
---

버전 5에서는 문법과 반응성 시스템이 전면 개편되었습니다. 처음에는 달라 보일 수 있지만 곧 비슷한 점이 많다는 것을 알게 될 것입니다. 이 가이드는 변경 사항을 자세히 살펴보고 업그레이드하는 방법을 보여 줍니다. 아울러 이런 변경을 *왜* 했는지에 대한 설명도 함께 담았습니다.

새 문법으로 당장 마이그레이션할 필요는 없습니다. Svelte 5는 여전히 이전 Svelte 4 문법을 지원하며, 새 문법을 쓰는 컴포넌트와 이전 문법을 쓰는 컴포넌트를 섞어 쓸 수 있고 그 반대도 마찬가지입니다. 많은 분들이 처음에는 코드 몇 줄만 바꿔도 업그레이드할 수 있을 것으로 예상합니다. 이런 단계 중 상당수를 자동으로 처리해 주는 [마이그레이션 스크립트](#Migration-script)도 있습니다.

## 반응성 문법 변경 <!-- Reactivity syntax changes -->

Svelte 5의 핵심은 새로운 룬 API입니다. 룬은 기본적으로 반응성에 대해 Svelte에 알려 주는 컴파일러 지시문입니다. 문법적으로 룬은 달러 기호로 시작하는 함수입니다.

### let → $state

Svelte 4에서는 컴포넌트 최상위의 `let` 선언이 암묵적으로 반응형이었습니다. Svelte 5에서는 더 명시적입니다. 변수는 `$state` 룬으로 만들었을 때 반응형이 됩니다. 카운터를 `$state`로 감싸 룬 모드로 마이그레이션해 봅시다:

```svelte
<script>
	let count = +++$state(0)+++;
</script>
```

그 밖에는 바뀌는 것이 없습니다. `count`는 여전히 숫자 그 자체이며, `.value`나 `getCount()` 같은 래퍼 없이 직접 읽고 씁니다.

> [!DETAILS] 이렇게 바꾼 이유
> 최상위의 `let`이 암묵적으로 반응형인 방식은 잘 동작했지만, 반응성이 제한된다는 뜻이기도 했습니다. 다른 곳에 있는 `let` 선언은 반응형이 아니었습니다. 그래서 재사용을 위해 코드를 컴포넌트 최상위 밖으로 리팩터링할 때는 스토어에 기댈 수밖에 없었습니다. 완전히 별개의 반응성 모델을 배워야 했고, 그 결과물은 다루기에 썩 좋지 않은 경우가 많았습니다. Svelte 5에서는 반응성이 더 명시적이므로 컴포넌트 최상위 밖에서도 같은 API를 계속 사용할 수 있습니다. 더 알아보려면 [튜토리얼](/tutorial)로 가 보세요.

### $: → $derived/$effect

Svelte 4에서는 컴포넌트 최상위의 `$:` 문으로 파생 값, 즉 다른 상태를 계산한 결과로만 정의되는 상태를 선언할 수 있었습니다. Svelte 5에서는 `$derived` 룬으로 이를 구현합니다:

```svelte
<script>
	let count = $state(0);
	---$:--- +++const+++ double = +++$derived(count * 2)+++;
</script>
```

`$state`와 마찬가지로 그 밖에는 바뀌는 것이 없습니다. `double`은 여전히 숫자 그 자체이며, `.value`나 `getDouble()` 같은 래퍼 없이 직접 읽습니다.

`$:` 문은 부수 효과를 만드는 데도 쓸 수 있었습니다. Svelte 5에서는 `$effect` 룬으로 이를 구현합니다:

```svelte
<script>
	let count = $state(0);

	---$:---+++$effect(() =>+++ {
		if (count > 5) {
			alert('Count is too high!');
		}
	}+++);+++
</script>
```

[`$effect`가 실행되는 시점]($effect#Understanding-dependencies)은 `$:`가 실행되는 시점과 다르다는 점에 유의하세요.

> [!DETAILS] 이렇게 바꾼 이유
> `$:`는 훌륭한 축약 문법이었고 시작하기도 쉬웠습니다. 대부분의 코드 앞에 `$:`를 붙이기만 하면 어떻게든 동작했습니다. 하지만 이런 직관성은 코드가 복잡해질수록 단점이 되었는데, 코드를 이해하기가 그만큼 쉽지 않았기 때문입니다. 이 코드의 의도는 파생 값을 만드는 것일까요, 부수 효과를 만드는 것일까요? `$derived`와 `$effect`를 쓰면 미리 결정해야 할 것이 조금 더 생기지만(스포일러: 90%의 경우에는 `$derived`가 필요합니다), 미래의 여러분과 팀의 다른 개발자들은 훨씬 수월해집니다.
>
> 알아차리기 어려운 함정도 있었습니다:
>
> - `$:`는 렌더링 직전에만 업데이트되었으므로, 다시 렌더링되는 사이에 오래된 값을 읽을 수 있었습니다
> - `$:`는 틱(tick)마다 한 번만 실행되었으므로, 생각보다 문이 덜 자주 실행될 수 있었습니다
> - `$:`의 의존성은 정적 분석으로 결정되었습니다. 대부분의 경우에는 잘 동작했지만, 리팩터링 중에 예를 들어 의존성이 함수 안으로 옮겨져 더 이상 보이지 않게 되면 미묘하게 깨질 수 있었습니다
> - `$:` 문의 순서도 의존성의 정적 분석으로 정해졌습니다. 경우에 따라 우선순위가 같아서 순서가 잘못 정해질 수 있었고, 그러면 직접 손봐야 했습니다. 코드를 리팩터링하다가 일부 의존성이 더 이상 보이지 않게 되어 순서가 깨질 수도 있었습니다.
>
> 마지막으로, TypeScript 친화적이지 않았습니다(에디터 도구가 TypeScript에서 유효하게 만들려고 여러 우회책을 써야 했습니다). 이는 Svelte의 반응성 모델을 진정으로 범용적으로 만드는 데 걸림돌이었습니다.
>
> `$derived`와 `$effect`는 다음과 같은 방식으로 이 모든 문제를 해결합니다
>
> - 항상 최신 값을 반환합니다
> - 안정될 때까지 필요한 만큼 자주 실행됩니다
> - 런타임에 의존성을 결정하므로 리팩터링에 영향을 받지 않습니다
> - 필요할 때 의존성을 실행하므로 순서 문제가 생기지 않습니다
> - TypeScript 친화적입니다

### export let → $props

Svelte 4에서는 컴포넌트의 속성을 `export let`으로 선언했습니다. 속성 하나가 선언 하나였습니다. Svelte 5에서는 모든 속성을 `$props` 룬으로, 구조 분해를 통해 선언합니다:

```svelte
<script>
	---export let optional = 'unset';---
	---export let required;---
	+++let { optional = 'unset', required } = $props();+++
</script>
```

`export let` 선언 몇 개를 두는 것보다 속성 선언이 덜 간단해지는 경우가 여럿 있습니다:

- 속성 이름을 바꾸고 싶을 때. 예를 들어 이름이 예약된 식별자인 경우(예: `class`)
- 어떤 다른 속성이 들어올지 미리 알 수 없을 때
- 모든 속성을 다른 컴포넌트로 넘기고 싶을 때

Svelte 4에서는 이런 경우마다 특별한 문법이 필요합니다:

- 이름 바꾸기: `export { klass as class}`
- 다른 속성: `$$restProps`
- 모든 속성: `$$props`

Svelte 5에서는 `$props` 룬 덕분에 Svelte 전용 문법 없이도 간단하게 할 수 있습니다:

- 이름 바꾸기: 속성 이름 바꾸기 문법을 사용합니다 `let { class: klass } = $props();`
- 다른 속성: 스프레드를 사용합니다 `let { foo, bar, ...rest } = $props();`
- 모든 속성: 구조 분해하지 않습니다 `let props = $props();`

```svelte
<script>
	---let klass = '';---
	---export { klass as class};---
	+++let { class: klass, ...rest } = $props();+++
</script>
<button class={klass} {...---$$restProps---+++rest+++}>click me</button>
```

> [!DETAILS] 이렇게 바꾼 이유
> `export let`은 논란이 많았던 API 결정 중 하나였으며, 속성을 `export`하는 것으로 생각해야 하는지 `import`하는 것으로 생각해야 하는지를 두고 많은 논쟁이 있었습니다. `$props`에는 이런 문제가 없습니다. 다른 룬들과도 일관되며, 전체적인 사고방식이 "Svelte에서 반응성과 관련된 특별한 것은 모두 룬이다"로 단순해집니다.
>
> 또한 `export let`에는 제약이 많아서, 위에서 본 것처럼 추가 API가 필요했습니다. `$props`는 이를 일반 JavaScript 구조 분해 문법에 크게 기대는 하나의 문법 개념으로 통합합니다.

## 이벤트 변경 <!-- Event changes -->

Svelte 5에서는 이벤트 핸들러가 새롭게 단장했습니다. Svelte 4에서는 요소에 이벤트 리스너를 붙일 때 `on:` 지시어를 사용했지만, Svelte 5에서는 이벤트 핸들러도 다른 속성과 똑같은 속성입니다(다시 말해 콜론을 지우면 됩니다):

```svelte
<script>
	let count = $state(0);
</script>

<button on---:---click={() => count++}>
	clicks: {count}
</button>
```

그냥 속성이므로 일반적인 축약 문법을 쓸 수 있습니다...

```svelte
<script>
	let count = $state(0);

	function onclick() {
		count++;
	}
</script>

<button {onclick}>
	clicks: {count}
</button>
```

...다만 이름이 있는 이벤트 핸들러 함수를 쓸 때는 보통 더 설명적인 이름을 붙이는 편이 낫습니다.

### 컴포넌트 이벤트 <!-- Component events -->

Svelte 4에서는 컴포넌트가 `createEventDispatcher`로 디스패처를 만들어 이벤트를 내보낼 수 있었습니다.

이 함수는 Svelte 5에서 지원 중단되었습니다. 대신 컴포넌트는 *콜백 props*를 받아야 합니다. 즉 이런 컴포넌트에 함수를 속성으로 전달합니다:

```svelte
<!--- file: App.svelte --->
<script>
	import Pump from './Pump.svelte';

	let size = $state(15);
	let burst = $state(false);

	function reset() {
		size = 15;
		burst = false;
	}
</script>

<Pump
	---on:---inflate={(power) => {
		size += power---.detail---;
		if (size > 75) burst = true;
	}}
	---on:---deflate={(power) => {
		if (size > 0) size -= power---.detail---;
	}}
/>

{#if burst}
	<button onclick={reset}>new balloon</button>
	<span class="boom">💥</span>
{:else}
	<span class="balloon" style="scale: {0.01 * size}">
		🎈
	</span>
{/if}
```

```svelte
<!--- file: Pump.svelte --->
<script>
	---import { createEventDispatcher } from 'svelte';---
	---const dispatch = createEventDispatcher();---

	+++let { inflate, deflate } = $props();+++
	let power = $state(5);
</script>

<button onclick={() => ---dispatch('inflate', power)---+++inflate(power)+++}>
	inflate
</button>
<button onclick={() => ---dispatch('deflate', power)---+++deflate(power)+++}>
	deflate
</button>
<button onclick={() => power--}>-</button>
Pump power: {power}
<button onclick={() => power++}>+</button>
```

### 이벤트 버블링 <!-- Bubbling events -->

요소의 이벤트를 컴포넌트로 '전달'하기 위해 `<button on:click>`을 쓰는 대신, 컴포넌트가 `onclick` 콜백 prop을 받아야 합니다:

```svelte
<script>
	+++let { onclick } = $props();+++
</script>

<button ---on:click--- +++{onclick}+++>
	click me
</button>
```

이는 각 이벤트를 하나하나 번거롭게 전달하는 대신, 이벤트 핸들러를 다른 props와 함께 요소에 '스프레드'할 수 있다는 뜻이기도 합니다:

```svelte
<script>
	let props = $props();
</script>

<button ---{...$$props} on:click on:keydown on:all_the_other_stuff--- +++{...props}+++>
	click me
</button>
```

### 이벤트 수식어 <!-- Event modifiers -->

Svelte 4에서는 핸들러에 이벤트 수식어를 추가할 수 있습니다:

```svelte
<button on:click|once|preventDefault={handler}>...</button>
```

수식어는 `on:` 전용이므로 최신 이벤트 핸들러에서는 동작하지 않습니다. 핸들러 안에 `event.preventDefault()` 같은 코드를 직접 넣는 편이 바람직합니다. 로직이 핸들러와 수식어로 나뉘지 않고 한곳에 모이기 때문입니다.

이벤트 핸들러는 그냥 함수이므로 필요에 따라 직접 래퍼를 만들 수 있습니다:

```svelte
<script>
	function once(fn) {
		return function (event) {
			if (fn) fn.call(this, event);
			fn = null;
		};
	}

	function preventDefault(fn) {
		return function (event) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<button onclick={once(preventDefault(handler))}>...</button>
```

`capture`, `passive`, `nonpassive` 세 수식어는 래퍼 함수로 표현할 수 없습니다. 핸들러가 실행될 때가 아니라 이벤트 핸들러가 바인딩될 때 적용되어야 하기 때문입니다.

`capture`는 이벤트 이름에 수식어를 붙입니다:

```svelte
<button onclickcapture={...}>...</button>
```

한편 이벤트 핸들러의 [`passive`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) 옵션을 바꾸는 일은 가볍게 할 일이 아닙니다. 그럴 필요가 있다면(아마 없을 것입니다!) 액션을 사용해 이벤트 핸들러를 직접 적용해야 합니다.

### 여러 이벤트 핸들러 <!-- Multiple event handlers -->

Svelte 4에서는 다음과 같이 할 수 있습니다:

```svelte
<button on:click={one} on:click={two}>...</button>
```

요소에 같은 속성을 중복해서 쓰는 것은 허용되지 않으며, 이제 이벤트 핸들러도 여기에 포함됩니다. 대신 다음과 같이 하세요:

```svelte
<button
	onclick={(e) => {
		one(e);
		two(e);
	}}
>
	...
</button>
```

props를 스프레드할 때 로컬 이벤트 핸들러는 스프레드 *뒤에* 와야 합니다. 그렇지 않으면 덮어쓰일 위험이 있습니다:

```svelte
<button
	{...props}
	onclick={(e) => {
		doStuff(e);
		props.onclick?.(e);
	}}
>
	...
</button>
```

> [!DETAILS] 이렇게 바꾼 이유
> `createEventDispatcher`는 늘 보일러플레이트가 좀 많았습니다:
>
> - 함수를 import합니다
> - 함수를 호출해 dispatch 함수를 얻습니다
> - 그 dispatch 함수를 문자열과, 경우에 따라 페이로드와 함께 호출합니다
> - 이벤트가 항상 `CustomEvent`였기 때문에, 받는 쪽에서는 `.detail` 속성으로 그 페이로드를 꺼냅니다
>
> 컴포넌트 콜백 props는 예전부터 쓸 수 있었지만, DOM 이벤트는 `on:`으로 수신해야 했기 때문에 문법의 일관성을 위해 컴포넌트 이벤트에도 `createEventDispatcher`를 쓰는 것이 합리적이었습니다. 이제 이벤트 속성(`onclick`)이 생겼으니 상황이 반대가 되었습니다. 이제는 콜백 props가 더 합리적인 선택입니다.
>
> 이벤트 수식어의 축약 문법을 좋아했던 분들에게는 이벤트 수식어 제거가 뒷걸음질처럼 보이는 변경일 수 있습니다. 하지만 자주 쓰이지 않는 기능이었기 때문에, 더 명시적인 방식을 택하고 API 표면적을 줄였습니다. 게다가 수식어는 대부분 DOM 요소에서만 쓸 수 있어서 일관성도 없었습니다.
>
> 같은 이벤트에 여러 리스너를 두는 것도 더 이상 할 수 없지만, 어차피 가독성을 해치는 일종의 안티패턴이었습니다. 속성이 많으면 두 핸들러가 바로 붙어 있지 않은 한 핸들러가 두 개라는 것을 알아차리기 어렵습니다. 또한 두 핸들러가 독립적인 것처럼 보이지만, 실제로는 `one` 안에서 `event.stopImmediatePropagation()` 같은 코드를 호출하면 `two`가 호출되지 않습니다.
>
> `createEventDispatcher`와 `on:` 지시어를 지원 중단하고 콜백 props와 일반 요소 속성을 쓰게 함으로써, 다음을 이룹니다:
>
> - Svelte의 학습 곡선을 낮춥니다
> - 특히 `createEventDispatcher` 주변의 보일러플레이트를 없앱니다
> - 리스너가 없을 수도 있는 이벤트를 위해 `CustomEvent` 객체를 만드는 오버헤드를 없앱니다
> - 이벤트 핸들러를 스프레드할 수 있게 됩니다
> - 컴포넌트에 어떤 이벤트 핸들러가 전달되었는지 알 수 있게 됩니다
> - 특정 이벤트 핸들러가 필수인지 선택인지 표현할 수 있게 됩니다
> - 타입 안전성이 높아집니다(이전에는 컴포넌트가 특정 이벤트를 내보내지 않는다는 것을 Svelte가 보장하기가 사실상 불가능했습니다)

## 슬롯 대신 스니펫 <!-- Snippets instead of slots -->

Svelte 4에서는 슬롯을 사용해 컴포넌트에 콘텐츠를 전달할 수 있습니다. Svelte 5는 슬롯을 더 강력하고 유연한 스니펫으로 대체하며, 그래서 Svelte 5에서 슬롯은 지원 중단되었습니다.

그래도 슬롯은 계속 동작하며, 슬롯을 사용하는 컴포넌트에 스니펫을 전달할 수도 있습니다:

```svelte
<!--- file: Child.svelte --->
<slot />
<hr />
<slot name="foo" message="hello" />
```

```svelte
<!--- file: Parent.svelte --->
<script>
	import Child from './Child.svelte';
</script>

<Child>
	default child content

	{#snippet foo({ message })}
		message from child: {message}
	{/snippet}
</Child>
```

(반대는 성립하지 않습니다. [`{@render ...}`](/docs/svelte/@render) 태그를 사용하는 컴포넌트에는 슬롯 콘텐츠를 전달할 수 없습니다.)

커스텀 엘리먼트를 사용할 때는 여전히 이전처럼 `<slot />`을 사용해야 합니다. 향후 버전에서 Svelte가 내부 슬롯 구현을 제거하면, 이런 슬롯은 변환하지 않고 그대로 둡니다. 즉 일반 DOM 태그로 출력합니다.

### 기본 콘텐츠 <!-- Default content -->

Svelte 4에서 자식에게 UI 조각을 전달하는 가장 쉬운 방법은 `<slot />`을 사용하는 것이었습니다. Svelte 5에서는 대신 `children` prop을 사용하고, 이를 `{@render children()}`으로 보여 줍니다:

```svelte
<script>
	+++let { children } = $props();+++
</script>

---<slot />---
+++{@render children?.()}+++
```

### 여러 콘텐츠 자리 <!-- Multiple content placeholders -->

UI를 넣을 자리가 여러 개 필요하다면 이름 있는 슬롯을 사용해야 했습니다. Svelte 5에서는 대신 props를 사용해 원하는 대로 이름을 붙이고 `{@render ...}`로 렌더링하세요:

```svelte
<script>
	+++let { header, main, footer } = $props();+++
</script>

<header>
	---<slot name="header" />---
	+++{@render header()}+++
</header>

<main>
	---<slot name="main" />---
	+++{@render main()}+++
</main>

<footer>
	---<slot name="footer" />---
	+++{@render footer()}+++
</footer>
```

### 데이터를 위로 전달하기 <!-- Passing data back up -->

Svelte 4에서는 `<slot />`에 데이터를 전달한 다음 부모 컴포넌트에서 `let:`으로 꺼냈습니다. Svelte 5에서는 스니펫이 그 역할을 맡습니다:

```svelte
<!--- file: App.svelte --->
<script>
	import List from './List.svelte';
</script>

<List items={['one', 'two', 'three']} ---let:item--->
	+++{#snippet item(text)}+++
		<span>{text}</span>
	+++{/snippet}+++
	---<span slot="empty">No items yet</span>---
	+++{#snippet empty()}
		<span>No items yet</span>
	{/snippet}+++
</List>
```

```svelte
<!--- file: List.svelte --->
<script>
	let { items, +++item, empty+++ } = $props();
</script>

{#if items.length}
	<ul>
		{#each items as entry}
			<li>
				---<slot item={entry} />---
				+++{@render item(entry)}+++
			</li>
		{/each}
	</ul>
{:else}
	---<slot name="empty" />---
	+++{@render empty?.()}+++
{/if}
```

> [!DETAILS] 이렇게 바꾼 이유
> 슬롯은 시작하기는 쉬웠지만, 사용 사례가 고급스러워질수록 문법이 복잡하고 헷갈려졌습니다:
>
> - 다른 `:` 지시어는 모두 변수를 *받는* 반면 `let:` 문법은 변수를 *만들기* 때문에 많은 사람들이 헷갈려했습니다
> - `let:`으로 선언한 변수의 스코프가 명확하지 않았습니다. 위 예시에서는 `empty` 슬롯에서 `item` 슬롯 prop을 쓸 수 있을 것처럼 보이지만, 그렇지 않습니다
> - 이름 있는 슬롯은 `slot` 속성으로 요소에 적용해야 했습니다. 요소를 만들고 싶지 않은 경우도 있어서 `<svelte:fragment>` API를 추가해야 했습니다
> - 이름 있는 슬롯은 컴포넌트에도 적용할 수 있었는데, 그러면 `let:` 지시어를 쓸 수 있는 위치의 의미가 달라졌습니다(지금도 메인테이너인 저희조차 어느 쪽으로 동작하는지 모를 때가 많습니다)
>
> 스니펫은 훨씬 읽기 쉽고 명확해서 이 모든 문제를 해결합니다. 동시에 더 강력하기도 합니다. 컴포넌트에 props로 전달하는 데 그치지 않고, *어디서든* 렌더링할 수 있는 UI 구역을 정의할 수 있기 때문입니다.

## 마이그레이션 스크립트 <!-- Migration script -->

이제 변경 전후의 모습과 이전 문법이 새 문법과 어떻게 대응하는지 꽤 잘 이해했을 것입니다. 또한 이런 마이그레이션의 상당수가 꽤 기계적이고 반복적이라서 손으로 하고 싶지 않은 일이라는 것도 분명해졌을 것입니다.

저희도 같은 생각이었기에, 마이그레이션의 대부분을 자동으로 처리하는 마이그레이션 스크립트를 제공합니다. `npx sv migrate svelte-5`로 프로젝트를 업그레이드할 수 있습니다. 이 명령은 다음을 수행합니다:

- `package.json`의 핵심 의존성 버전을 올립니다
- 룬으로 마이그레이션합니다(`let` → `$state` 등)
- DOM 요소의 이벤트를 이벤트 속성으로 마이그레이션합니다(`on:click` → `onclick`)
- 슬롯 생성을 render 태그로 마이그레이션합니다(`<slot />` → `{@render children()}`)
- 슬롯 사용을 스니펫으로 마이그레이션합니다(`<div slot="x">...</div>` → `{#snippet x()}<div>...</div>{/snippet}`)
- 명백한 컴포넌트 생성 코드를 마이그레이션합니다(`new Component(...)` → `mount(Component, ...)`)

VS Code에서는 `Migrate Component to Svelte 5 Syntax` 명령으로, Playground에서는 `Migrate` 버튼으로 컴포넌트 하나만 마이그레이션할 수도 있습니다.

모든 것을 자동으로 마이그레이션할 수 있는 것은 아니며, 일부 마이그레이션은 나중에 직접 정리해야 합니다. 다음 섹션에서 이를 자세히 설명합니다.

### run

마이그레이션 스크립트가 일부 `$:` 문을 `svelte/legacy`에서 import한 `run` 함수로 바꾸는 것을 볼 수 있습니다. 마이그레이션 스크립트가 그 문을 `$derived`로 확실하게 마이그레이션할 수 없어서 부수 효과라고 판단한 경우입니다. 이 판단이 틀린 경우도 있으니, 그럴 때는 `$derived`를 쓰도록 바꾸는 것이 가장 좋습니다. 판단이 맞는 경우도 있지만, `$:` 문은 서버에서도 실행된 반면 `$effect`는 그렇지 않으므로 그대로 변환하는 것은 안전하지 않습니다. 그래서 임시방편으로 `run`을 사용합니다. `run`은 서버에서 한 번 실행되고 클라이언트에서는 `$effect.pre`로 실행된다는 점에서 `$:`의 특성 대부분을 흉내 냅니다(`$effect.pre`는 변경 사항이 DOM에 적용되기 *전에* 실행됩니다. 대개는 `$effect`를 쓰는 편이 맞을 것입니다).

```svelte
<script>
	---import { run } from 'svelte/legacy';---
	---run(() => {---
	+++$effect(() => {+++
		// some side effect code
	})
</script>
```

### 이벤트 수식어 <!-- Event modifiers -->

이벤트 수식어는 이벤트 속성에 적용할 수 없습니다(예: `onclick|preventDefault={...}`처럼 쓸 수 없습니다). 그래서 이벤트 지시어를 이벤트 속성으로 마이그레이션할 때는 이런 수식어를 대신할 함수가 필요합니다. 이 함수들은 `svelte/legacy`에서 import하며, 이후에는 예를 들어 그냥 `event.preventDefault()`를 쓰는 방식으로 옮겨 가야 합니다.

```svelte
<script>
	---import { preventDefault } from 'svelte/legacy';---
</script>

<button
	onclick={---preventDefault---((event) => {
		+++event.preventDefault();+++
		// ...
	})}
>
	click me
</button>
```

### 자동으로 마이그레이션되지 않는 것 <!-- Things that are not automigrated -->

마이그레이션 스크립트는 `createEventDispatcher`를 변환하지 않습니다. 이 부분은 직접 고쳐야 합니다. 컴포넌트를 사용하는 쪽이 깨질 수 있는데 마이그레이션 스크립트로는 이를 알아낼 수 없어 너무 위험하기 때문입니다.

마이그레이션 스크립트는 `beforeUpdate/afterUpdate`를 변환하지 않습니다. 코드의 실제 의도를 판단하는 것이 불가능하기 때문입니다. 경험적으로는 `$effect.pre`(`beforeUpdate`와 같은 시점에 실행됩니다)와 `tick`(`svelte`에서 import하며, 변경 사항이 DOM에 적용될 때까지 기다린 다음 작업을 할 수 있게 해 줍니다)을 조합하면 되는 경우가 많습니다.

## 컴포넌트는 더 이상 클래스가 아닙니다 <!-- Components are no longer classes -->

Svelte 3과 4에서 컴포넌트는 클래스입니다. Svelte 5에서는 함수이며 인스턴스화하는 방식도 다릅니다. 컴포넌트를 직접 인스턴스화해야 한다면 대신 (`svelte`에서 import한) `mount`나 `hydrate`를 사용해야 합니다. SvelteKit을 쓰다가 이 에러를 보았다면, 먼저 Svelte 5 지원이 추가된 최신 버전의 SvelteKit으로 업데이트해 보세요. SvelteKit 없이 Svelte를 쓰고 있다면 아마 `main.js` 파일(또는 비슷한 파일)이 있을 텐데, 이를 다음과 같이 고쳐야 합니다:

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });---
+++const app = mount(App, { target: document.getElementById("app") });+++

export default app;
```

`mount`와 `hydrate`의 API는 완전히 같습니다. 차이점은 `hydrate`는 대상 안에 있는, Svelte가 서버에서 렌더링한 HTML을 가져와 하이드레이트한다는 것입니다. 둘 다 컴포넌트의 export와, 경우에 따라(`accessors: true`로 컴파일한 경우) 속성 접근자를 담은 객체를 반환합니다. 클래스 컴포넌트 API에서 익숙했을 `$on`, `$set`, `$destroy` 메서드는 없습니다. 대신 다음과 같이 대체합니다:

`$on`은 이벤트를 수신하는 대신 옵션 인자의 `events` 속성으로 이벤트를 전달합니다.

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });
app.$on('event', callback);---
+++const app = mount(App, { target: document.getElementById("app"), events: { event: callback } });+++
```

> [!NOTE] `events`를 사용하는 것은 권장하지 않습니다. 대신 [콜백을 사용하세요](#Event-changes)

`$set`은 대신 `$state`로 반응형 속성 객체를 만들어 조작합니다. 이 작업을 `.js`나 `.ts` 파일 안에서 한다면 확장자에 `.svelte`가 들어가도록, 즉 `.svelte.js`나 `.svelte.ts`로 바꾸세요.

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app"), props: { foo: 'bar' } });
app.$set({ foo: 'baz' });---
+++const props = $state({ foo: 'bar' });
const app = mount(App, { target: document.getElementById("app"), props });
props.foo = 'baz';+++
```

`$destroy`는 대신 `unmount`를 사용합니다.

```js
+++import { mount, unmount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app"), props: { foo: 'bar' } });
app.$destroy();---
+++const app = mount(App, { target: document.getElementById("app") });
unmount(app);+++
```

임시방편으로, (`svelte/legacy`에서 import한) `createClassComponent`나 `asClassComponent`를 대신 사용해 인스턴스화한 뒤에도 Svelte 4에서 익숙한 API를 그대로 유지할 수도 있습니다.

```js
+++import { createClassComponent } from 'svelte/legacy';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });---
+++const app = createClassComponent({ component: App, target: document.getElementById("app") });+++

export default app;
```

이 컴포넌트를 여러분이 제어할 수 없다면 `compatibility.componentApi` 컴파일러 옵션을 사용해 하위 호환성을 자동으로 적용할 수 있습니다. 그러면 `new Component(...)`를 쓰는 코드가 수정 없이 계속 동작합니다(다만 컴포넌트마다 약간의 오버헤드가 추가됩니다). 이 옵션은 `bind:this`로 얻는 모든 컴포넌트 인스턴스에 `$set`과 `$on` 메서드도 추가합니다.

```js
/// svelte.config.js
export default {
	compilerOptions: {
		compatibility: {
			componentApi: 4
		}
	}
};
```

`mount`와 `hydrate`는 동기적이지 *않다는* 점에 유의하세요. 그래서 함수가 반환될 때 `onMount` 같은 것은 아직 호출되지 않았고, 프로미스의 대기 블록도 아직 렌더링되지 않았습니다(`#await`는 즉시 resolve될 수도 있는 프로미스를 기다리기 위해 마이크로태스크 하나만큼 기다리기 때문입니다). 이런 보장이 필요하다면 `mount/hydrate`를 호출한 뒤 (`'svelte'`에서 import한) `flushSync`를 호출하세요.

### 서버 API 변경 <!-- Server API changes -->

마찬가지로 서버 사이드 렌더링용으로 컴파일한 컴포넌트에는 더 이상 `render` 메서드가 없습니다. 대신 `svelte/server`의 `render`에 함수를 전달하세요:

```js
+++import { render } from 'svelte/server';+++
import App from './App.svelte';

---const { html, head } = App.render({ props: { message: 'hello' }});---
+++const { html, head } = render(App, { props: { message: 'hello' }});+++
```

Svelte 4에서는 컴포넌트를 문자열로 렌더링하면 모든 컴포넌트의 CSS도 함께 반환되었습니다. Svelte 5에서는 기본적으로 더 이상 그렇지 않은데, 대부분의 경우 (SvelteKit처럼) 다른 방식으로 이를 처리해 주는 도구 체인을 사용하기 때문입니다. `render`에서 CSS를 반환받아야 한다면 `css` 컴파일러 옵션을 `'injected'`로 설정하세요. 그러면 `head`에 `<style>` 요소가 추가됩니다.

### 컴포넌트 타입 변경 <!-- Component typing changes -->

클래스에서 함수로 바뀐 점은 타입에도 반영됩니다. Svelte 4의 기본 클래스인 `SvelteComponent`는 지원 중단되었고, 대신 Svelte 컴포넌트의 함수 형태를 정의하는 새 `Component` 타입을 사용합니다. `d.ts` 파일에서 컴포넌트 형태를 직접 정의하려면 다음과 같이 합니다:

```ts
import type { Component } from 'svelte';
export declare const MyComponent: Component<{
	foo: string;
}>;
```

특정 타입의 컴포넌트가 필요하다고 선언하려면 다음과 같이 합니다:

```js
import { ComponentA, ComponentB } from 'component-library';
---import type { SvelteComponent } from 'svelte';---
+++import type { Component } from 'svelte';+++

---let C: typeof SvelteComponent<{ foo: string }> = $state(---
+++let C: Component<{ foo: string }> = $state(+++
	Math.random() ? ComponentA : ComponentB
);
```

두 유틸리티 타입 `ComponentEvents`와 `ComponentType`도 지원 중단되었습니다. 이제 이벤트는 콜백 props로 정의하므로 `ComponentEvents`는 더 이상 필요하지 않고, 새 `Component` 타입이 이미 컴포넌트 타입이므로 `ComponentType`도 더 이상 필요하지 않습니다(즉 `ComponentType<SvelteComponent<{ prop: string }>>`는 `Component<{ prop: string }>`와 같습니다).

### bind:this 변경 <!-- bind:this changes -->

컴포넌트가 더 이상 클래스가 아니므로, `bind:this`를 사용해도 더 이상 `$set`, `$on`, `$destroy` 메서드가 있는 클래스 인스턴스가 반환되지 않습니다. 인스턴스의 export(`export function/const`)와, `accessors` 옵션을 쓰는 경우 각 속성에 대한 getter/setter 쌍만 반환됩니다.

## `<svelte:component>`는 더 이상 필요하지 않습니다 <!-- `<svelte:component>` is no longer necessary -->

Svelte 4에서 컴포넌트는 *정적*입니다. `<Thing>`을 렌더링한 뒤 `Thing`의 값이 바뀌어도 [아무 일도 일어나지 않습니다](/playground/7f1fa24f0ab44c1089dcbb03568f8dfa?version=4.2.18). 동적으로 만들려면 `<svelte:component>`를 사용해야 했습니다.

Svelte 5에서는 더 이상 그렇지 않습니다:

```svelte
<script>
	import A from './A.svelte';
	import B from './B.svelte';

	let Thing = $state();
</script>

<select bind:value={Thing}>
	<option value={A}>A</option>
	<option value={B}>B</option>
</select>

<!-- these are equivalent -->
<Thing />
<svelte:component this={Thing} />
```
마이그레이션할 때 컴포넌트 이름은 요소와 구분되도록 대문자로 시작해야 한다는 점(`Thing`)을 기억하세요. 단, 점 표기법을 쓰는 경우는 예외입니다.

### 점 표기법은 컴포넌트를 나타냅니다 <!-- Dot notation indicates a component -->

Svelte 4에서 `<foo.bar>`는 태그 이름이 `"foo.bar"`인 요소를 만들었습니다. Svelte 5에서는 대신 `foo.bar`를 컴포넌트로 취급합니다. 이는 특히 `each` 블록 안에서 유용합니다:

```svelte
{#each items as item}
	<item.component {...item.props} />
{/each}
```

## 공백 처리 변경 <!-- Whitespace handling changed -->

이전에 Svelte는 공백을 유지할지 말지 결정하는 데 매우 복잡한 알고리즘을 사용했습니다. Svelte 5는 이를 단순화해 개발자가 이해하기 쉽게 만들었습니다. 규칙은 다음과 같습니다:

- 노드 사이의 공백은 공백 하나로 합쳐집니다
- 태그의 시작과 끝에 있는 공백은 완전히 제거됩니다

  이 새 동작은 네이티브 HTML 렌더링과 약간 다릅니다. 예를 들어 `<p>foo<span> - bar</span></p>`는 다음과 같이 렌더링됩니다:

  - HTML에서는 `foo - bar`
  - Svelte 5에서는 `foo- bar`

  빠진 공백은 `<span>` 밖으로 옮겨서 다시 넣을 수 있습니다...

  ```svelte
  <p>foo <span>- bar</span></p>
  ```

  ...또는 스타일 때문에 필요하다면 표현식으로 넣을 수도 있습니다:

  ```svelte
  <p>foo<span>{' '}- bar</span></p>
  ```

- `pre` 태그 안의 공백을 유지하는 것처럼 몇 가지 예외가 있습니다

이전과 마찬가지로 컴파일러 설정에서, 또는 `<svelte:options>`에서 컴포넌트별로 `preserveWhitespace` 옵션을 설정해 공백 제거를 끌 수 있습니다.

## 최신 브라우저 필요 <!-- Modern browser required -->

Svelte 5는 여러 이유로 최신 브라우저(다시 말해 Internet Explorer가 아닌 브라우저)가 필요합니다:

- [`Proxies`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를 사용합니다
- `clientWidth`/`clientHeight`/`offsetWidth`/`offsetHeight` 바인딩이 있는 요소는 복잡한 `<iframe>` 꼼수 대신 [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)를 사용합니다
- `<input type="range" bind:value={...} />`는 폴백으로 `change` 이벤트까지 수신하지 않고 `input` 이벤트 리스너만 사용합니다

더 크지만 IE에서 동작하는 코드를 생성하던 `legacy` 컴파일러 옵션은 더 이상 존재하지 않습니다.

## 컴파일러 옵션 변경 <!-- Changes to compiler options -->

- `css` 옵션의 유효한 값에서 (이전부터 지원 중단되었던) `false`/`true`와 `"none"`이 제거되었습니다
- `legacy` 옵션은 다른 용도로 바뀌었습니다
- `hydratable` 옵션이 제거되었습니다. 이제 Svelte 컴포넌트는 항상 하이드레이트할 수 있습니다
- `enableSourcemap` 옵션이 제거되었습니다. 이제 소스 맵은 항상 생성되며, 도구가 이를 무시할지 선택할 수 있습니다
- `tag` 옵션이 제거되었습니다. 대신 컴포넌트 안에서 `<svelte:options customElement="tag-name" />`을 사용하세요
- `loopGuardTimeout`, `format`, `sveltePath`, `errorMode`, `varsReport` 옵션이 제거되었습니다

## `children` prop은 예약되어 있습니다 <!-- The `children` prop is reserved -->

컴포넌트 태그 안의 콘텐츠는 `children`이라는 스니펫 prop이 됩니다. 같은 이름의 prop을 따로 둘 수 없습니다.

## 룬 모드에서 호환성이 깨지는 변경 <!-- Breaking changes in runes mode -->

일부 호환성이 깨지는 변경은 컴포넌트가 룬 모드일 때만 적용됩니다.

### 컴포넌트 export에 바인딩할 수 없습니다 <!-- Bindings to component exports are not allowed -->

룬 모드 컴포넌트의 export에는 직접 바인딩할 수 없습니다. 예를 들어 컴포넌트 `A`에 `export const foo = ...`가 있을 때 `<A bind:foo />`를 쓰면 에러가 발생합니다. 대신 `bind:this`를 사용해 `<A bind:this={a} />`처럼 쓰고, export에는 `a.foo`로 접근하세요. 이 변경은 props와 export를 명확히 분리하므로 코드를 이해하기 더 쉬워집니다.

### 바인딩은 `$bindable()`로 명시적으로 정의해야 합니다 <!-- Bindings need to be explicitly defined using `$bindable()` -->

Svelte 4 문법에서는 (`export let`으로 선언한) 모든 속성이 바인딩 가능합니다. 즉 `bind:`할 수 있습니다. 룬 모드에서 속성은 기본적으로 바인딩할 수 없으며, 바인딩 가능한 props는 `$bindable` 룬으로 표시해야 합니다.

바인딩 가능한 속성에 기본값이 있다면(예: `let { foo = $bindable('bar') } = $props();`), 그 속성에 바인딩할 때 `undefined`가 아닌 값을 전달해야 합니다. 이렇게 하면 부모와 자식이 같은 값을 가져야 하므로 동작이 모호해지지 않고, 성능도 좋아집니다(Svelte 4에서는 기본값이 부모에게 반영되어 불필요한 렌더링 사이클이 추가로 생겼습니다).

### `accessors` 옵션은 무시됩니다 <!-- `accessors` option is ignored -->

`accessors` 옵션을 `true`로 설정하면 컴포넌트 인스턴스에서 컴포넌트의 속성에 직접 접근할 수 있습니다.

```svelte
<svelte:options accessors={true} />

<script>
	// available via componentInstance.name
	export let name;
</script>
```

룬 모드에서는 컴포넌트 인스턴스에서 속성에 절대 접근할 수 없습니다. 외부에 노출해야 한다면 대신 컴포넌트 export를 사용할 수 있습니다.

```svelte
<script>
	let { name } = $props();
	// available via componentInstance.getName()
	export const getName = () => name;
</script>
```

또는 인스턴스화하는 곳을 여러분이 제어할 수 있다면, `.js/.ts` 파일의 확장자에 `.svelte`가 들어가도록, 즉 `.svelte.js`나 `.svelte.ts`로 바꿔서 그 안에서 룬을 사용하고 `$state`를 쓸 수도 있습니다:

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app"), props: { foo: 'bar' } });
app.foo = 'baz'---
+++const props = $state({ foo: 'bar' });
const app = mount(App, { target: document.getElementById("app"), props });
props.foo = 'baz';+++
```

### `immutable` 옵션은 무시됩니다 <!-- `immutable` option is ignored -->

룬 모드에서는 `immutable` 옵션을 설정해도 아무 효과가 없습니다. 이 개념은 `$state`와 그 변형들이 동작하는 방식으로 대체되었습니다.

### 클래스는 더 이상 "자동 반응형"이 아닙니다 <!-- Classes are no longer "auto-reactive" -->

Svelte 4에서는 다음 코드가 반응성을 트리거했습니다:

```svelte
<script>
	let foo = new Foo();
</script>

<button on:click={() => (foo.value = 1)}>{foo.value}</button
>
```

Svelte 컴파일러가 `foo.value`에 대한 할당을 `foo`를 참조하는 모든 것을 업데이트하라는 지시로 취급했기 때문입니다. Svelte 5에서는 반응성이 컴파일 시점이 아니라 런타임에 결정되므로, `Foo` 클래스에 `value`를 반응형 `$state` 필드로 정의해야 합니다. `new Foo()`를 `$state(...)`로 감싸도 아무 효과가 없습니다. 깊은 반응형이 되는 것은 일반 객체와 배열뿐입니다.

### 터치 이벤트는 passive입니다 <!-- Touch events are passive -->

`ontouchstart`와 `ontouchmove` 이벤트 속성을 사용할 때, 핸들러는 브라우저 기본 동작에 맞춰 [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)로 등록됩니다. 이벤트 핸들러가 `event.preventDefault()`를 호출하는지 기다리지 않고 브라우저가 문서를 바로 스크롤할 수 있으므로 반응성이 크게 좋아집니다.

이런 이벤트의 기본 동작을 막아야 하는 아주 드문 경우에는 (예를 들어 액션 안에서) 대신 [`on`](/docs/svelte/svelte-events#on)을 사용해야 합니다.

### 속성/prop 문법이 더 엄격해졌습니다 <!-- Attribute/prop syntax is stricter -->

Svelte 4에서는 복잡한 속성 값을 따옴표로 감싸지 않아도 되었습니다:

<!-- prettier-ignore -->
```svelte
<Component prop=this{is}valid />
```

이는 실수하기 쉬운 함정입니다. 룬 모드에서는 무언가를 이어 붙이려면 값을 따옴표로 감싸야 합니다:

```svelte
<Component prop="this{is}valid" />
```

Svelte 5는 `answer="{42}"`처럼 표현식 하나를 따옴표로 감싼 경우에도 경고를 표시한다는 점에 유의하세요. Svelte 6에서는 이렇게 하면 값이 숫자로 전달되지 않고 문자열로 변환됩니다.

### HTML 구조가 더 엄격해졌습니다 <!-- HTML structure is stricter -->

Svelte 4에서는 서버 사이드 렌더링할 때 브라우저가 고쳐 주는 HTML 코드를 작성할 수 있었습니다. 예를 들어 이렇게 쓸 수 있었고...

```svelte
<table>
	<tr>
		<td>hi</td>
	</tr>
</table>
```

... 그러면 브라우저가 `<tbody>` 요소를 자동으로 삽입했습니다:

```svelte
<table>
	<tbody>
		<tr>
			<td>hi</td>
		</tr>
	</tbody>
</table>
```

Svelte 5는 HTML 구조에 더 엄격하며, 브라우저가 DOM을 고칠 만한 경우에는 컴파일러 에러를 던집니다.

## 그 밖의 호환성이 깨지는 변경 <!-- Other breaking changes -->

### `@const` 할당 유효성 검사가 더 엄격해졌습니다 <!-- Stricter `@const` assignment validation -->

`@const` 선언에서 구조 분해한 부분에 할당하는 것은 더 이상 허용되지 않습니다. 애초에 이것이 허용되었던 것이 실수였습니다.

### :is(...), :has(...), :where(...)에 스코프가 적용됩니다 <!-- :is(...), :has(...), and :where(...) are scoped -->

이전에 Svelte는 `:is(...)`, `:has(...)`, `:where(...)` 안의 선택자를 분석하지 않았고, 사실상 전역으로 취급했습니다. Svelte 5는 이를 현재 컴포넌트의 맥락에서 분석합니다. 따라서 이런 처리 방식에 기대고 있던 일부 선택자는 이제 사용되지 않는 것으로 취급될 수 있습니다. 이를 해결하려면 `:is(...)/:has(...)/:where(...)` 선택자 안에서 `:global(...)`을 사용하세요.

Tailwind의 `@apply` 지시어를 사용할 때는 `:global` 선택자를 추가해, Tailwind가 생성한 `:is(...)` 선택자를 쓰는 규칙이 유지되도록 하세요:

<!-- prettier-ignore -->
```css
main +++:global+++ {
	@apply bg-blue-100 dark:bg-blue-900;
}
```

### CSS 해시 위치가 더 이상 결정적이지 않습니다 <!-- CSS hash position no longer deterministic -->

이전에 Svelte는 항상 CSS 해시를 마지막에 넣었습니다. Svelte 5에서는 더 이상 이를 보장하지 않습니다. 이는 [아주 특이한 CSS 선택자를 쓰는](https://stackoverflow.com/questions/15670631/does-the-order-of-classes-listed-on-an-item-affect-the-css) 경우에만 호환성을 깨뜨립니다.

### 스코프 CSS는 :where(...)를 사용합니다 <!-- Scoped CSS uses :where(...) -->

예측할 수 없는 명시도 변화로 인한 문제를 피하기 위해, 이제 스코프 CSS 선택자는 `.svelte-xyz123`과 함께 `:where(.svelte-xyz123)` 선택자 수식어를 사용합니다(`xyz123`은 이전과 마찬가지로 `<style>` 내용의 해시입니다). 자세한 내용은 [여기](https://github.com/sveltejs/svelte/pull/10443)에서 볼 수 있습니다.

`:where`를 구현하지 않은 아주 오래된 브라우저를 지원해야 한다면, 예측할 수 없는 명시도 변화를 감수하고 출력된 CSS를 직접 수정할 수 있습니다:

```js
// @errors: 2552
css = css.replace(/:where\((.+?)\)/, '$1');
```

### 에러/경고 코드의 이름이 바뀌었습니다 <!-- Error/warning codes have been renamed -->

에러와 경고 코드의 이름이 바뀌었습니다. 이전에는 단어를 대시로 구분했지만, 이제는 밑줄을 사용합니다(예: foo-bar는 foo_bar가 됩니다). 또한 일부 코드는 표현이 조금 바뀌었습니다.

### 네임스페이스 수가 줄었습니다 <!-- Reduced number of namespaces -->

`namespace` 컴파일러 옵션에 전달할 수 있는 유효한 네임스페이스가 `html`(기본값), `mathml`, `svg`로 줄었습니다.

`foreign` 네임스페이스는 Svelte Native에서만 쓸모가 있었는데, Svelte Native는 5.x 마이너 버전에서 다른 방식으로 지원할 계획입니다.

### beforeUpdate/afterUpdate 변경 <!-- beforeUpdate/afterUpdate changes -->

`beforeUpdate`가 템플릿에서 참조하는 변수를 수정하더라도, 더 이상 첫 렌더링 때 두 번 실행되지 않습니다.

이제 부모 컴포넌트의 `afterUpdate` 콜백은 모든 자식 컴포넌트의 `afterUpdate` 콜백이 실행된 뒤에 실행됩니다.

컴포넌트에 `<slot>`이 있고 그 콘텐츠가 업데이트될 때, `beforeUpdate/afterUpdate`는 더 이상 실행되지 않습니다.

두 함수 모두 룬 모드에서는 사용할 수 없습니다. 대신 `$effect.pre(...)`와 `$effect(...)`를 사용하세요.

### `contenteditable` 동작 변경 <!-- `contenteditable` behavior change -->

`contenteditable` 노드에 대응하는 바인딩이 있고 *동시에* 그 안에 반응형 값이 있다면(예: `<div contenteditable=true bind:textContent>count is {count}</div>`), contenteditable 안의 값은 `count`가 업데이트되어도 업데이트되지 않습니다. 바인딩이 즉시 콘텐츠를 완전히 제어하며, 콘텐츠는 바인딩을 통해서만 업데이트되어야 하기 때문입니다.

### `oneventname` 속성은 더 이상 문자열 값을 받지 않습니다 <!-- `oneventname` attributes no longer accept string values -->

Svelte 4에서는 HTML 요소의 이벤트 속성을 문자열로 지정할 수 있었습니다:

```svelte
<button onclick="alert('hello')">...</button>
```

이 방식은 권장되지 않으며, `onclick` 같은 속성이 `on:click`을 대신해 이벤트 핸들러를 추가하는 방법이 된 Svelte 5에서는 더 이상 쓸 수 없습니다.

### `null`과 `undefined`는 빈 문자열이 됩니다 <!-- `null` and `undefined` become the empty string -->

Svelte 4에서는 `null`과 `undefined`가 그에 해당하는 문자열로 출력되었습니다. 100번 중 99번은 빈 문자열이 되기를 원할 것이고, 다른 프레임워크도 대부분 그렇게 합니다. 그래서 Svelte 5에서는 `null`과 `undefined`가 빈 문자열이 됩니다.

### `bind:files` 값은 `null`, `undefined`, `FileList`만 될 수 있습니다 <!-- `bind:files` values can only be `null`, `undefined` or `FileList` -->

이제 `bind:files`는 양방향 바인딩입니다. 따라서 값을 설정할 때는 falsy 값(`null` 또는 `undefined`)이거나 `FileList` 타입이어야 합니다.

### 바인딩이 이제 폼 초기화에 반응합니다 <!-- Bindings now react to form resets -->

이전에는 바인딩이 폼의 `reset` 이벤트를 고려하지 않았기 때문에 값이 DOM과 어긋날 수 있었습니다. Svelte 5는 document에 `reset` 리스너를 두고 필요한 곳에서 바인딩을 호출해 이 문제를 해결합니다.

### `walk`는 더 이상 export되지 않습니다 <!-- `walk` no longer exported -->

`svelte/compiler`는 편의를 위해 `estree-walker`의 `walk`를 다시 export했습니다. Svelte 5에서는 더 이상 그렇지 않으므로, 필요하다면 해당 패키지에서 직접 import하세요.

### `svelte:options` 안의 콘텐츠는 금지됩니다 <!-- Content inside `svelte:options` is forbidden -->

Svelte 4에서는 `<svelte:options />` 태그 안에 콘텐츠를 넣을 수 있었습니다. 무시되긴 했지만 무언가를 쓸 수는 있었습니다. Svelte 5에서는 그 태그 안의 콘텐츠가 컴파일러 에러입니다.

### 선언적 섀도 루트 안의 `<slot>` 요소는 유지됩니다 <!-- `<slot>` elements in declarative shadow roots are preserved -->

Svelte 4는 모든 곳의 `<slot />` 태그를 자체 슬롯 구현으로 바꿨습니다. Svelte 5는 `<template shadowrootmode="...">` 요소의 자식인 경우에는 이를 그대로 유지합니다.

### `<svelte:element>` 태그는 표현식이어야 합니다 <!-- `<svelte:element>` tag must be an expression -->

Svelte 4에서 `<svelte:element this="div">`는 유효한 코드입니다. 하지만 별 의미가 없습니다. 그냥 `<div>`를 쓰면 됩니다. 어떤 이유로든 리터럴 값을 *꼭* 써야 하는 극히 드문 경우에는 다음과 같이 할 수 있습니다:

```svelte
<svelte:element this=+++{+++"div"+++}+++>
```

Svelte 4는 어떤 `bind:` 지시어를 적용할 수 있는지 판단할 때 (예를 들어) `<svelte:element this="input">`을 `<input>`과 똑같이 취급했지만, Svelte 5는 그렇지 않다는 점에 유의하세요.

### `mount`는 기본적으로 트랜지션을 재생합니다 <!-- `mount` plays transitions by default -->

컴포넌트 트리를 렌더링하는 데 쓰는 `mount` 함수는 `intro` 옵션을 `false`로 설정하지 않는 한 기본적으로 트랜지션을 재생합니다. 이는 직접 인스턴스화했을 때 기본적으로 트랜지션을 재생하지 않던 레거시 클래스 컴포넌트와 다릅니다.

### `<img src={...}>`와 `{@html ...}`의 하이드레이션 불일치는 고쳐지지 않습니다 <!-- `<img src={...}>` and `{@html ...}` hydration mismatches are not repaired -->

Svelte 4에서는 `src` 속성이나 `{@html ...}` 태그의 값이 서버와 클라이언트에서 다르면(이른바 하이드레이션 불일치) 그 불일치를 고쳤습니다. 이는 비용이 매우 큽니다. (결과가 같더라도) `src` 속성을 설정하면 이미지와 iframe이 다시 로드되고, 큰 HTML 덩어리를 다시 삽입하는 것은 느립니다.

이런 불일치는 극히 드물기 때문에 Svelte 5는 값이 바뀌지 않았다고 가정하지만, 개발 중에는 값이 다르면 경고를 표시합니다. 강제로 업데이트하려면 다음과 같이 할 수 있습니다:

```svelte
<script>
	let { markup, src } = $props();

	if (typeof window !== 'undefined') {
		// stash the values...
		const initial = { markup, src };

		// unset them...
		markup = src = undefined;

		$effect(() => {
			// ...and reset after we've mounted
			markup = initial.markup;
			src = initial.src;
		});
	}
</script>

{@html markup}
<img {src} />
```

### 하이드레이션 방식이 달라졌습니다 <!-- Hydration works differently -->

Svelte 5는 서버 사이드 렌더링 중에 주석을 사용하며, 이 주석은 클라이언트에서 더 견고하고 효율적인 하이드레이션을 하는 데 쓰입니다. 따라서 HTML 출력을 하이드레이트할 생각이라면 주석을 제거하면 안 되며, Svelte 컴포넌트가 하이드레이트할 HTML을 직접 작성했다면 그 HTML의 올바른 위치에 해당 주석이 들어가도록 고쳐야 합니다.

### `onevent` 속성은 위임됩니다 <!-- `onevent` attributes are delegated -->

이벤트 속성이 이벤트 지시어를 대체합니다. `on:click={handler}` 대신 `onclick={handler}`를 씁니다. 하위 호환성을 위해 `on:event` 문법도 여전히 지원되며 Svelte 4와 똑같이 동작합니다. 다만 일부 `onevent` 속성은 위임되므로, 그런 이벤트의 전파를 직접 막지 않도록 주의해야 합니다. 전파를 막으면 루트에 있는 해당 이벤트 타입의 리스너에 이벤트가 영영 도달하지 못할 수 있습니다.

### `--style-props`는 다른 요소를 사용합니다 <!-- `--style-props` uses a different element -->

Svelte 5는 CSS 커스텀 속성을 사용할 때 컴포넌트를 감싸는 데 `<div>` 대신 별도의 `<svelte-css-wrapper>` 요소를 사용합니다.

<!-- TODO in final docs, add link to corresponding section for more details -->
