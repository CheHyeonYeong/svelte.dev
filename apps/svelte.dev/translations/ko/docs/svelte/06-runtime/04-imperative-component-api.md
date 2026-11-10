---
title: 명령형 컴포넌트 API
---

<!-- better title needed?

- mount
- unmount
- render
- hydrate
- how they interact with each other -->

모든 Svelte 애플리케이션은 루트 컴포넌트를 명령형으로 생성하는 데서 시작합니다. 클라이언트에서는 이 컴포넌트를 특정 요소에 마운트합니다. 서버에서는 대신 렌더링할 수 있는 HTML 문자열을 돌려받고 싶을 것입니다. 다음 함수들이 이런 작업을 도와줍니다.

## `mount`

컴포넌트를 인스턴스화하고 주어진 대상에 마운트합니다:

```js
// @errors: 2322
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

한 페이지에 여러 컴포넌트를 마운트할 수 있고, 애플리케이션 안에서 마운트할 수도 있습니다. 예를 들어 툴팁 컴포넌트를 만들어 마우스를 올린 요소에 붙일 때가 그렇습니다.

Svelte 4에서 `new App(...)`을 호출하던 것과 달리, 이펙트(`onMount` 콜백과 액션 함수 포함) 같은 것들은 `mount` 중에 실행되지 않는다는 점에 유의하세요. 대기 중인 이펙트를 강제로 실행해야 한다면(예를 들어 테스트에서) `flushSync()`를 사용하면 됩니다.

## `unmount`

이전에 [`mount`](#mount)나 [`hydrate`](#hydrate)로 생성한 컴포넌트를 언마운트합니다.

`options.outro`가 `true`이면 컴포넌트가 DOM에서 제거되기 전에 [트랜지션](transition)이 재생됩니다:

```js
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.body });

// later
unmount(app, { outro: true });
```

`options.outro`가 true이면 트랜지션이 완료된 뒤 resolve되고, 그렇지 않으면 즉시 resolve되는 `Promise`를 반환합니다.

## `render`

서버에서만, 그리고 `server` 옵션으로 컴파일할 때만 사용할 수 있습니다. 컴포넌트를 받아 `body`와 `head` 속성을 가진 객체를 반환하며, 앱을 서버에서 렌더링할 때 이 값으로 HTML을 채울 수 있습니다:

```js
// @errors: 2724 2305 2307
import { render } from 'svelte/server';
import App from './App.svelte';

const result = render(App, {
	props: { some: 'property' }
});
result.body; // HTML for somewhere in this <body> tag
result.head; // HTML for somewhere in this <head> tag
```

## `hydrate`

`mount`와 비슷하지만, 대상 안에 Svelte의 SSR 출력([`render`](#render) 함수)으로 렌더링된 HTML이 있으면 이를 재사용해 상호작용이 가능하게 만듭니다:

```js
// @errors: 2322
import { hydrate } from 'svelte';
import App from './App.svelte';

const app = hydrate(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

`mount`와 마찬가지로 `hydrate` 중에는 이펙트가 실행되지 않습니다. 이펙트가 실행되어야 한다면 바로 뒤에 `flushSync()`를 사용하세요.
