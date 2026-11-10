---
title: 기본 마크업
---

Svelte 컴포넌트 안의 마크업은 HTML++라고 생각하면 됩니다.

## 태그 <!-- Tags -->

`<div>`처럼 소문자로 된 태그는 일반 HTML 요소를 나타냅니다. `<Widget>`이나 `<my.stuff>`처럼 대문자로 시작하거나 점 표기법을 쓰는 태그는 *컴포넌트*를 나타냅니다.

```svelte
<script>
	import Widget from './Widget.svelte';
</script>

<div>
	<Widget />
</div>
```

## 요소 속성 <!-- Element attributes -->

기본적으로 속성은 HTML의 속성과 똑같이 동작합니다.

```svelte
<div class="foo">
	<button disabled>can't touch this</button>
</div>
```

HTML에서처럼 값에 따옴표를 붙이지 않아도 됩니다.

<!-- prettier-ignore -->
```svelte
<input type=checkbox />
```

속성값에 JavaScript 표현식을 넣을 수 있습니다.

```svelte
<a href="page/{p}">page {p}</a>
```

또는 속성값 자체가 JavaScript 표현식*일* 수도 있습니다.

```svelte
<button disabled={!clickable}>...</button>
```

불리언 속성은 값이 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)이면 요소에 포함되고 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)이면 제외됩니다.

그 밖의 속성은 값이 [nullish](https://developer.mozilla.org/en-US/docs/Glossary/Nullish)(`null` 또는 `undefined`)가 아닌 한 포함됩니다.

```svelte
<input required={false} placeholder="This input field is not required" />
<div title={null}>This div has no title attribute</div>
```

> [!NOTE] 표현식 하나를 따옴표로 감싸도 값을 해석하는 방식은 달라지지 않지만, Svelte 6에서는 값이 문자열로 강제 변환됩니다:
>
> <!-- prettier-ignore -->
> ```svelte
> <button disabled="{number !== 42}">...</button>
> ```

속성 이름과 값이 같다면(`name={name}`) `{name}`으로 줄여 쓸 수 있습니다.

```svelte
<button {disabled}>...</button>
<!-- equivalent to
<button disabled={disabled}>...</button>
-->
```

## 컴포넌트 props <!-- Component props -->

관례적으로 컴포넌트에 전달하는 값은 DOM의 기능인 *속성*(attribute)이 아니라 *프로퍼티*(property) 또는 *props*라고 부릅니다.

요소와 마찬가지로 `name={name}`은 `{name}` 축약형으로 바꿔 쓸 수 있습니다.

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

## 스프레드 속성 <!-- Spread attributes -->

*스프레드 속성*(spread attribute)을 사용하면 여러 속성이나 프로퍼티를 요소나 컴포넌트에 한꺼번에 전달할 수 있습니다.

요소나 컴포넌트에는 스프레드 속성을 여러 개 둘 수 있고, 일반 속성과 섞어 쓸 수도 있습니다. 순서가 중요합니다. `things.a`가 있으면 `a="b"`보다 우선하고, `c="d"`는 `things.c`보다 우선합니다:

```svelte
<Widget a="b" {...things} c="d" />
```

## 이벤트 <!-- Events -->

요소에 `on`으로 시작하는 속성을 추가하면 DOM 이벤트를 수신할 수 있습니다. 예를 들어 `click` 이벤트를 수신하려면 버튼에 `onclick` 속성을 추가합니다:

```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

이벤트 속성은 대소문자를 구분합니다. `onclick`은 `click` 이벤트를, `onClick`은 그와 다른 `Click` 이벤트를 수신합니다. 덕분에 이름에 대문자가 들어간 커스텀 이벤트도 수신할 수 있습니다.

이벤트도 결국 속성이므로 속성과 같은 규칙이 적용됩니다:

- 축약형을 쓸 수 있습니다: `<button {onclick}>click me</button>`
- 스프레드할 수 있습니다: `<button {...thisSpreadContainsEventAttributes}>click me</button>`

실행 시점 측면에서 이벤트 속성은 항상 바인딩에서 발생한 이벤트 다음에 실행됩니다(예: `oninput`은 항상 `bind:value`가 갱신된 뒤에 실행됩니다). 내부적으로 일부 이벤트 핸들러는 `addEventListener`로 직접 연결되고, 나머지는 *위임*됩니다.

`ontouchstart`와 `ontouchmove` 이벤트 속성을 사용하면 성능을 위해 핸들러가 [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)로 등록됩니다. 브라우저가 이벤트 핸들러에서 `event.preventDefault()`를 호출하는지 기다리지 않고 바로 문서를 스크롤할 수 있으므로 반응 속도가 크게 좋아집니다.

아주 드물게 이런 이벤트의 기본 동작을 막아야 한다면 대신 [`on`](svelte-events#on)을 사용하세요(예를 들어 액션 안에서).

### 이벤트 위임 <!-- Event delegation -->

메모리 사용량을 줄이고 성능을 높이기 위해 Svelte는 이벤트 위임이라는 기법을 사용합니다. 아래 목록에 있는 특정 이벤트에 대해서는 애플리케이션 루트에 있는 이벤트 리스너 하나가 이벤트 경로상의 모든 핸들러를 실행하는 역할을 맡는다는 뜻입니다.

주의할 점이 몇 가지 있습니다:

- 위임된 리스너가 있는 이벤트를 직접 디스패치할 때는 `{ bubbles: true }` 옵션을 설정해야 합니다. 그렇지 않으면 이벤트가 애플리케이션 루트에 도달하지 않습니다
- `addEventListener`를 직접 사용할 때는 `stopPropagation`을 호출하지 마세요. 이벤트가 애플리케이션 루트에 도달하지 않아 핸들러가 호출되지 않습니다. 마찬가지로 애플리케이션 루트 안에서 직접 추가한 핸들러는 캡처링과 버블링 단계 모두에서, DOM 더 깊은 곳에 (예: `onclick={...}`로) 선언적으로 추가한 핸들러보다 *먼저* 실행됩니다. 이런 이유로 `addEventListener`보다는 `svelte/events`에서 import한 `on` 함수를 사용하는 것이 좋습니다. 이 함수는 순서가 유지되고 `stopPropagation`이 올바르게 처리되도록 보장합니다.

다음 이벤트 핸들러가 위임됩니다:

- `beforeinput`
- `click`
- `change`
- `dblclick`
- `contextmenu`
- `focusin`
- `focusout`
- `input`
- `keydown`
- `keyup`
- `mousedown`
- `mousemove`
- `mouseout`
- `mouseover`
- `mouseup`
- `pointerdown`
- `pointermove`
- `pointerout`
- `pointerover`
- `pointerup`
- `touchend`
- `touchmove`
- `touchstart`

## 텍스트 표현식 <!-- Text expressions -->

JavaScript 표현식을 중괄호로 감싸면 텍스트로 포함할 수 있습니다.

```svelte
{expression}
```

`null`이나 `undefined`인 표현식은 생략되고, 나머지는 모두 [문자열로 강제 변환](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion)됩니다.

Svelte 템플릿에 중괄호를 넣으려면 [HTML 엔티티](https://developer.mozilla.org/docs/Glossary/Entity) 문자열을 사용하면 됩니다. `{`는 `&lbrace;`, `&lcub;`, `&#123;`로, `}`는 `&rbrace;`, `&rcub;`, `&#125;`로 쓸 수 있습니다.

정규 표현식(`RegExp`)을 [리터럴 표기법](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor)으로 쓴다면 괄호로 감싸야 합니다.

<!-- prettier-ignore -->
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>

<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

표현식은 코드 주입을 막기 위해 문자열로 변환되고 이스케이프됩니다. HTML을 렌더링하고 싶다면 대신 `{@html}` 태그를 사용하세요.

```svelte
{@html potentiallyUnsafeHtmlString}
```

> [!NOTE] 전달하는 문자열을 이스케이프하거나, 직접 통제할 수 있는 값으로만 채워서 [XSS 공격](https://owasp.org/www-community/attacks/xss/)을 막으세요

## 주석 <!-- Comments -->

컴포넌트 안에서 HTML 주석을 사용할 수 있습니다.

```svelte
<!-- this is a comment! --><h1>Hello world</h1>
```

`svelte-ignore`로 시작하는 주석은 바로 다음 마크업 블록에 대한 경고를 끕니다. 대개 접근성 경고인데, 끌 만한 타당한 이유가 있는지 확인하세요.

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input bind:value={name} autofocus />
```

`@component`로 시작하는 특별한 주석을 추가하면 다른 파일에서 컴포넌트 이름에 마우스를 올렸을 때 그 내용이 표시됩니다.

````svelte
<!--
@component
- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```html
  <Main name="Aretha">
  ```
-->
<script>
	let { name } = $props();
</script>

<main>
	<h1>
		Hello, {name}
	</h1>
</main>
````

JavaScript 스타일의 주석을 태그 안 속성 사이에 넣을 수도 있습니다:

```svelte
<div
  // this is a comment!
  data-foo="bar"
>
  foo bar
</div>
```
