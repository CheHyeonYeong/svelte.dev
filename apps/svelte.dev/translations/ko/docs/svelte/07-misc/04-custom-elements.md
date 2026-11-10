---
title: 커스텀 엘리먼트
---

<!-- - [basically what we have today](https://svelte.dev/docs/custom-elements-api) -->

`customElement: true` 컴파일러 옵션을 사용하면 Svelte 컴포넌트를 커스텀 엘리먼트(웹 컴포넌트라고도 함)로 컴파일할 수도 있습니다. 컴포넌트의 태그 이름은 `<svelte:options>` [요소](svelte-options)로 지정해야 합니다. 커스텀 엘리먼트 안에서는 [`$host`](https://svelte.dev/docs/svelte/$host) 룬으로 호스트 요소에 접근할 수 있습니다.

```svelte
<svelte:options customElement="my-element" />

<script>
	let { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>
<slot />
```

노출하고 싶지 않은 내부 컴포넌트에는 태그 이름을 생략하고 일반 Svelte 컴포넌트처럼 사용할 수 있습니다. 필요하다면 컴포넌트를 사용하는 쪽에서 나중에 이름을 붙일 수도 있습니다. 이때는 커스텀 엘리먼트 생성자를 담고 있는 정적 `element` 속성을 사용하며, 이 속성은 `customElement` 컴파일러 옵션이 `true`일 때 사용할 수 있습니다.

```js
// @noErrors
import MyElement from './MyElement.svelte';

customElements.define('my-element', MyElement.element);
```

커스텀 엘리먼트를 정의하고 나면 일반 DOM 요소처럼 사용할 수 있습니다:

```js
document.body.innerHTML = `
	<my-element>
		<p>This is some slotted content</p>
	</my-element>
`;
```

모든 [props](basic-markup#Component-props)는 DOM 요소의 프로퍼티로 노출됩니다(가능한 경우 속성으로도 읽고 쓸 수 있습니다).

```js
// @noErrors
const el = document.querySelector('my-element');

// get the current value of the 'name' prop
console.log(el.name);

// set a new value, updating the shadow DOM
el.name = 'everybody';
```

모든 프로퍼티를 명시적으로 나열해야 한다는 점에 유의하세요. 즉 [컴포넌트 옵션](#Component-options)에서 `props`를 선언하지 않고 `let props = $props()`를 쓰면, Svelte는 어떤 props를 DOM 요소의 프로퍼티로 노출해야 할지 알 수 없습니다.

## 컴포넌트 생명주기 <!-- Component lifecycle -->

커스텀 엘리먼트는 래퍼 방식으로 Svelte 컴포넌트에서 만들어집니다. 즉 내부 Svelte 컴포넌트는 자신이 커스텀 엘리먼트라는 사실을 모릅니다. 커스텀 엘리먼트 래퍼가 생명주기를 적절히 처리합니다.

커스텀 엘리먼트가 생성될 때, 그것이 감싸는 Svelte 컴포넌트는 바로 생성되지 *않습니다*. `connectedCallback`이 호출된 뒤 다음 틱에야 생성됩니다. DOM에 삽입되기 전에 커스텀 엘리먼트에 할당된 프로퍼티는 임시로 저장되었다가 컴포넌트가 생성될 때 설정되므로 값이 사라지지 않습니다. 하지만 커스텀 엘리먼트에서 export된 함수를 호출하는 것은 이렇게 동작하지 않으며, 이런 함수는 요소가 마운트된 뒤에만 사용할 수 있습니다. 컴포넌트가 생성되기 전에 함수를 호출해야 한다면 [`extend` 옵션](#Component-options)으로 우회할 수 있습니다.

Svelte로 작성한 커스텀 엘리먼트가 생성되거나 업데이트되면, 섀도 DOM은 즉시가 아니라 다음 틱에 값을 반영합니다. 이렇게 하면 업데이트를 일괄 처리할 수 있고, 요소를 (동기적이지만) 일시적으로 DOM에서 떼어 내는 DOM 이동이 내부 컴포넌트의 언마운트로 이어지지 않습니다.

내부 Svelte 컴포넌트는 `disconnectedCallback`이 호출된 뒤 다음 틱에 파괴됩니다.

## 컴포넌트 옵션 <!-- Component options -->

Svelte 4부터는 커스텀 엘리먼트를 만들 때 `<svelte:options>` 안에서 `customElement`를 객체로 정의해 여러 측면을 조정할 수 있습니다. 이 객체에는 다음 속성을 넣을 수 있습니다:

- `tag: string`: 커스텀 엘리먼트의 이름을 지정하는 선택적 `tag` 속성입니다. 설정하면 이 컴포넌트를 import할 때 이 태그 이름을 가진 커스텀 엘리먼트가 document의 `customElements` 레지스트리에 정의됩니다.
- `shadow`: 섀도 루트 속성을 수정하는 선택적 속성입니다. 다음 값을 받습니다:
  - `"none"`: 섀도 루트를 만들지 않습니다. 이 경우 스타일이 더 이상 캡슐화되지 않으며 슬롯을 사용할 수 없다는 점에 유의하세요.
  - `"open"`: `mode: "open"` 옵션으로 섀도 루트를 만듭니다.
  - [`ShadowRootInit`](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options): 섀도 루트를 만들 때 `attachShadow()`에 넘길 설정 객체를 전달할 수 있습니다.
- `props`: 컴포넌트 프로퍼티의 세부 사항과 동작을 수정하는 선택적 속성입니다. 다음 설정을 제공합니다:
  - `attribute: string`: 커스텀 엘리먼트의 prop을 업데이트하는 방법은 두 가지입니다. 위에서 본 것처럼 커스텀 엘리먼트의 참조에 프로퍼티를 설정하거나, HTML 속성을 사용하는 것입니다. 후자의 경우 기본 속성 이름은 프로퍼티 이름을 소문자로 바꾼 것입니다. `attribute: "<desired name>"`을 지정해 이를 바꿀 수 있습니다.
  - `reflect: boolean`: 기본적으로 업데이트된 prop 값은 DOM에 다시 반영되지 않습니다. 이 동작을 켜려면 `reflect: true`로 설정하세요.
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`: 속성 값을 prop 값으로 변환하고 다시 반영할 때, 기본적으로 prop 값은 `String`이라고 가정합니다. 이 가정이 항상 맞지는 않습니다. 예를 들어 숫자 타입이라면 `type: "Number"`로 정의하세요
    모든 프로퍼티를 나열할 필요는 없으며, 나열하지 않은 프로퍼티는 기본 설정을 사용합니다.
- `extend`: 함수를 인자로 받는 선택적 속성입니다. 이 함수에는 Svelte가 생성한 커스텀 엘리먼트 클래스가 전달되며, 커스텀 엘리먼트 클래스를 반환해야 합니다. 커스텀 엘리먼트의 생명주기에 아주 구체적인 요구 사항이 있거나, 예를 들어 더 나은 HTML 폼 통합을 위해 [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#examples)를 사용하도록 클래스를 확장하고 싶을 때 유용합니다.

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: {
			mode: import.meta.env.DEV ? 'open' : 'closed',
			clonable: true,
			// ...
		},
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		},
		extend: (customElementConstructor) => {
			// Extend the class so we can let it participate in HTML forms
			return class extends customElementConstructor {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}

				// Add the function here, not below in the component so that
				// it's always available, not just when the inner Svelte component
				// is mounted
				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>

<script>
	let { elementIndex, attachedInternals } = $props();
	// ...
	function check() {
		attachedInternals.checkValidity();
	}
</script>

...
```

> [!NOTE] `extend` 함수에서도 TypeScript를 사용할 수 있지만 제약이 있습니다. 스크립트 중 하나에 `lang="ts"`를 설정해야 하고, 그 안에서는 [지울 수 있는 문법(erasable syntax)](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)만 사용할 수 있습니다. 이 코드는 스크립트 전처리기로 처리되지 않습니다.

## 주의 사항과 제약 <!-- Caveats and limitations -->

커스텀 엘리먼트는 일반 HTML, JavaScript는 물론 [대부분의 프레임워크](https://custom-elements-everywhere.com/)와 함께 동작하므로, Svelte가 아닌 앱에서 쓸 컴포넌트를 패키징하는 데 유용할 수 있습니다. 하지만 알아 두어야 할 중요한 차이점이 몇 가지 있습니다:

- (`shadow: "none"`을 설정하지 않는 한) 스타일은 단순히 *범위가 한정되는* 것이 아니라 *캡슐화*됩니다. 즉 컴포넌트 밖의 스타일(예를 들어 `global.css` 파일에 있을 법한 스타일)은 `:global(...)` 수식어가 붙은 스타일을 포함해 커스텀 엘리먼트에 적용되지 않습니다
- 스타일은 별도의 .css 파일로 추출되지 않고 JavaScript 문자열로 컴포넌트에 인라인됩니다
- 섀도 DOM은 JavaScript가 로드될 때까지 보이지 않으므로, 커스텀 엘리먼트는 일반적으로 서버 사이드 렌더링에 적합하지 않습니다
- Svelte에서 슬롯 콘텐츠는 *지연* 렌더링됩니다. DOM에서는 *즉시* 렌더링됩니다. 즉 컴포넌트의 `<slot>` 요소가 `{#if ...}` 블록 안에 있더라도 슬롯 콘텐츠는 항상 생성됩니다. 마찬가지로 `{#each ...}` 블록 안에 `<slot>`을 넣어도 슬롯 콘텐츠가 여러 번 렌더링되지 않습니다
- 지원 중단된 `let:` 지시어는 효과가 없습니다. 커스텀 엘리먼트에는 슬롯을 채우는 부모 컴포넌트로 데이터를 넘길 방법이 없기 때문입니다
- 구형 브라우저를 지원하려면 폴리필이 필요합니다
- 커스텀 엘리먼트 안의 일반 Svelte 컴포넌트 사이에서는 Svelte의 컨텍스트 기능을 사용할 수 있지만, 커스텀 엘리먼트 사이에서는 사용할 수 없습니다. 즉 부모 커스텀 엘리먼트에서 `setContext`를 쓰고 자식 커스텀 엘리먼트에서 `getContext`로 읽을 수는 없습니다.
- `on`으로 시작하는 프로퍼티나 속성은 선언하지 마세요. 이벤트 리스너로 해석되기 때문입니다. 즉 Svelte는 `<custom-element oneworld={true}></custom-element>`를 (`customElement.oneworld = true`가 아니라) `customElement.addEventListener('eworld', true)`로 취급합니다
