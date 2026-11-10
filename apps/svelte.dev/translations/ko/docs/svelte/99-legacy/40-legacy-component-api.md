---
title: 명령형 컴포넌트 API
---

Svelte 3과 4에서는 컴포넌트와 상호작용하는 API가 Svelte 5와 다릅니다. 이 페이지의 내용은 Svelte 5 애플리케이션 안의 레거시 모드 컴포넌트에는 적용되지 *않습니다*.

## 컴포넌트 생성하기 <!-- Creating a component -->

```ts
// @noErrors
const component = new Component(options);
```

클라이언트 사이드 컴포넌트, 즉 `generate: 'dom'`으로(또는 `generate` 옵션을 지정하지 않고) 컴파일한 컴포넌트는 JavaScript 클래스입니다.

```ts
// @noErrors
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		// assuming App.svelte contains something like
		// `export let answer`:
		answer: 42
	}
});
```

다음 초기화 옵션을 전달할 수 있습니다:

| 옵션      | 기본값      | 설명                                                                         |
| --------- | ----------- | ---------------------------------------------------------------------------- |
| `target`  | **없음**    | 렌더링할 대상인 `HTMLElement` 또는 `ShadowRoot`. 필수 옵션입니다             |
| `anchor`  | `null`      | 컴포넌트를 바로 앞에 렌더링할 `target`의 자식                                |
| `props`   | `{}`        | 컴포넌트에 전달할 속성 객체                                                  |
| `context` | `new Map()` | 컴포넌트에 전달할 루트 수준 컨텍스트 키-값 쌍의 `Map`                        |
| `hydrate` | `false`     | 아래 참고                                                                    |
| `intro`   | `false`     | `true`이면 이후의 상태 변경을 기다리지 않고 첫 렌더링 때 트랜지션을 재생합니다 |

`target`의 기존 자식은 그대로 남아 있습니다.

`hydrate` 옵션은 새 요소를 만드는 대신 (보통 서버 사이드 렌더링으로 만들어진) 기존 DOM을 업그레이드하라고 Svelte에 지시합니다. 이 옵션은 컴포넌트를 [`hydratable: true` 옵션](/docs/svelte-compiler#compile)으로 컴파일한 경우에만 동작합니다. `<head>` 요소의 하이드레이션은 서버 사이드 렌더링 코드도 `hydratable: true`로 컴파일한 경우에만 제대로 동작합니다. 이 옵션은 `<head>` 안의 각 요소에 표시를 추가해, 컴포넌트가 하이드레이션 중에 어떤 요소를 제거해야 하는지 알 수 있게 합니다.

보통 `target`의 자식은 그대로 두지만, `hydrate: true`를 쓰면 모든 자식이 제거됩니다. 그래서 `anchor` 옵션은 `hydrate: true`와 함께 사용할 수 없습니다.

기존 DOM이 컴포넌트와 일치할 필요는 없습니다. Svelte가 진행하면서 DOM을 '고쳐' 줍니다.

```ts
/// file: index.js
// @noErrors
import App from './App.svelte';

const app = new App({
	target: document.querySelector('#server-rendered-html'),
	hydrate: true
});
```

> [!NOTE]
> Svelte 5 이상에서는 대신 [`mount`](svelte#mount)를 사용하세요

## `$set`

```ts
// @noErrors
component.$set(props);
```

인스턴스의 props를 프로그래밍 방식으로 설정합니다. `component.$set({ x: 1 })`은 컴포넌트의 `<script>` 블록 안에서 `x = 1`을 하는 것과 같습니다.

이 메서드를 호출하면 다음 마이크로태스크에 업데이트가 예약됩니다. DOM은 동기적으로 업데이트되지 *않습니다*.

```ts
// @noErrors
component.$set({ answer: 42 });
```

> [!NOTE]
> Svelte 5 이상에서는 대신 `$state`로 컴포넌트 props를 만들고 그것을 업데이트하세요
>
> ```js
> // @noErrors
> let props = $state({ answer: 42 });
> const component = mount(Component, { props });
> // ...
> props.answer = 24;
> ```

## `$on`

```ts
// @noErrors
component.$on(ev, callback);
```

컴포넌트가 `event`를 디스패치할 때마다 `callback` 함수가 호출되게 합니다.

호출하면 이벤트 리스너를 제거하는 함수가 반환됩니다.

```ts
// @noErrors
const off = component.$on('selected', (event) => {
	console.log(event.detail.selection);
});

off();
```

> [!NOTE]
> Svelte 5 이상에서는 대신 콜백 props를 전달하세요

## `$destroy`

```js
// @noErrors
component.$destroy();
```

DOM에서 컴포넌트를 제거하고 `onDestroy` 핸들러를 모두 실행합니다.

> [!NOTE]
> Svelte 5 이상에서는 대신 [`unmount`](svelte#unmount)를 사용하세요

## 컴포넌트 props <!-- Component props -->

```js
// @noErrors
component.prop;
```

```js
// @noErrors
component.prop = value;
```

컴포넌트를 `accessors: true`로 컴파일하면 각 인스턴스에 컴포넌트의 각 prop에 대응하는 getter와 setter가 생깁니다. 값을 설정하면 `component.$set(...)`이 일으키는 기본 비동기 업데이트가 아니라 *동기* 업데이트가 일어납니다.

커스텀 엘리먼트로 컴파일하는 경우가 아니라면 `accessors`의 기본값은 `false`입니다.

```js
// @noErrors
console.log(component.count);
component.count += 1;
```

> [!NOTE]
> Svelte 5 이상에서는 이 개념이 더 이상 필요하지 않습니다. 속성을 외부에서 접근할 수 있게 하려면 `export`하세요

## 서버 사이드 컴포넌트 API <!-- Server-side component API -->

```js
// @noErrors
const result = Component.render(...)
```

클라이언트 사이드 컴포넌트와 달리 서버 사이드 컴포넌트는 렌더링한 뒤에 수명이 이어지지 않습니다. 하는 일은 HTML과 CSS를 만드는 것이 전부입니다. 그래서 API가 조금 다릅니다.

서버 사이드 컴포넌트는 props를 선택적으로 넘겨 호출할 수 있는 `render` 메서드를 노출합니다. 이 메서드는 `head`, `html`, `css` 속성을 가진 객체를 반환하며, `head`에는 렌더링 중 만난 모든 `<svelte:head>` 요소의 내용이 담깁니다.

`svelte/register`를 사용하면 Svelte 컴포넌트를 Node로 바로 import할 수 있습니다.

```js
// @noErrors
require('svelte/register');

const App = require('./App.svelte').default;

const { head, html, css } = App.render({
	answer: 42
});
```

`.render()` 메서드는 다음 매개변수를 받습니다:

| 매개변수  | 기본값  | 설명                    |
| --------- | ------- | ----------------------- |
| `props`   | `{}`    | 컴포넌트에 전달할 속성 객체 |
| `options` | `{}`    | 옵션 객체               |

`options` 객체는 다음 옵션을 받습니다:

| 옵션      | 기본값      | 설명                                                  |
| --------- | ----------- | ----------------------------------------------------- |
| `context` | `new Map()` | 컴포넌트에 전달할 루트 수준 컨텍스트 키-값 쌍의 `Map` |

```js
// @noErrors
const { head, html, css } = App.render(
	// props
	{ answer: 42 },
	// options
	{
		context: new Map([['context-key', 'context-value']])
	}
);
```

> [!NOTE]
> Svelte 5 이상에서는 대신 [`render`](svelte-server#render)를 사용하세요
