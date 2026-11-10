---
title: 접근성
---

SvelteKit은 기본적으로 앱에 접근성 있는 플랫폼을 제공하려고 노력합니다. Svelte의 [컴파일 타임 접근성 검사](../svelte/compiler-warnings)도 여러분이 만드는 모든 SvelteKit 애플리케이션에 적용됩니다.

여기서는 SvelteKit의 내장 접근성 기능이 어떻게 동작하는지, 그리고 이 기능이 최대한 잘 동작하도록 무엇을 해야 하는지 설명합니다. SvelteKit이 접근성 있는 기반을 제공하더라도, 애플리케이션 코드의 접근성을 보장하는 책임은 여전히 여러분에게 있다는 점을 기억하세요. 접근성이 처음이라면 이 가이드의 ["더 읽어보기"](accessibility#Further-reading) 섹션에서 추가 자료를 확인하세요.

접근성을 제대로 갖추기가 어렵다는 것을 잘 알고 있습니다. SvelteKit의 접근성 처리 방식에 대해 개선 사항을 제안하고 싶다면 [GitHub 이슈를 열어 주세요](https://github.com/sveltejs/kit/issues).

## 라우트 안내 <!-- Route announcements -->

전통적인 서버 렌더링 애플리케이션에서는 모든 내비게이션(예: `<a>` 태그 클릭)이 페이지 전체를 다시 로드합니다. 이때 스크린 리더와 그 밖의 보조 기술이 새 페이지의 제목을 읽어 주므로, 사용자는 페이지가 바뀌었다는 것을 알 수 있습니다.

SvelteKit에서는 페이지를 다시 로드하지 않고 페이지 사이를 이동하므로([클라이언트 사이드 라우팅](glossary#Routing)이라고 합니다), SvelteKit은 각 내비게이션 후에 새 페이지 이름을 읽어 주는 [라이브 영역](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)을 페이지에 삽입합니다. 안내할 페이지 이름은 `<title>` 요소를 확인해 결정합니다.

이 동작 때문에 앱의 모든 페이지에는 고유하고 내용을 잘 설명하는 제목이 있어야 합니다. SvelteKit에서는 각 페이지에 `<svelte:head>` 요소를 넣어 제목을 지정할 수 있습니다:

```svelte
<!--- file: src/routes/+page.svelte --->
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

이렇게 하면 스크린 리더와 그 밖의 보조 기술이 내비게이션 후 새 페이지를 식별할 수 있습니다. 내용을 잘 설명하는 제목은 [SEO](seo#Manual-setup-title-and-meta)에도 중요합니다.

## 포커스 관리 <!-- Focus management -->

전통적인 서버 렌더링 애플리케이션에서는 모든 내비게이션이 포커스를 페이지 맨 위로 초기화합니다. 그래서 키보드나 스크린 리더로 웹을 탐색하는 사람도 페이지의 처음부터 상호작용을 시작할 수 있습니다.

클라이언트 사이드 라우팅에서도 이 동작을 흉내 내기 위해, SvelteKit은 각 내비게이션과 [향상된 폼 제출](form-actions#Progressive-enhancement) 후에 `<body>` 요소에 포커스를 줍니다. 예외가 하나 있는데, [`autofocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) 속성이 있는 요소가 있으면 SvelteKit은 대신 그 요소에 포커스를 줍니다. 이 속성을 사용할 때는 [보조 기술에 미치는 영향을 고려하세요](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus#accessibility_considerations).

SvelteKit의 포커스 관리를 사용자 정의하고 싶다면 `afterNavigate` 훅을 사용할 수 있습니다:

```js
/// <reference types="@sveltejs/kit" />
// ---cut---
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	/** @type {HTMLElement | null} */
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

[`goto`]($app-navigation#goto) 함수를 사용해 코드로 다른 페이지로 이동할 수도 있습니다. 기본적으로 이는 링크를 클릭했을 때와 같은 클라이언트 사이드 라우팅 동작을 합니다. 하지만 `goto`는 `reset: false` 옵션도 받는데, 이 옵션을 쓰면 현재 스크롤 위치와 현재 포커스된 요소를 초기화하지 않고 그대로 유지합니다. 이 옵션을 쓴다면 현재 포커스된 요소가 내비게이션 후에도 페이지에 남아 있는지 확인하세요. 요소가 더 이상 존재하지 않으면 사용자의 포커스가 사라져서, 보조 기술 사용자에게 혼란스러운 경험을 주게 됩니다.

## "lang" 속성 <!-- The "lang" attribute -->

기본적으로 SvelteKit의 페이지 템플릿은 문서의 기본 언어를 영어로 설정합니다. 콘텐츠가 영어가 아니라면 `src/app.html`의 `<html>` 요소에 올바른 [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#accessibility) 속성을 지정해야 합니다. 그래야 문서를 읽는 보조 기술이 올바른 발음을 사용합니다. 예를 들어 콘텐츠가 독일어라면 `app.html`을 다음과 같이 수정해야 합니다:

```html
/// file: src/app.html
<html lang="de">
```

콘텐츠를 여러 언어로 제공한다면, 현재 페이지의 언어에 따라 `lang` 속성을 설정해야 합니다. SvelteKit의 [handle 훅](hooks#handle)으로 이렇게 할 수 있습니다:

```html
/// file: src/app.html
<html lang="%lang%">
```

```js
/// file: src/hooks.server.js
// @filename: utils.ts
export function get_lang(event: import('@sveltejs/kit').RequestEvent) {
	return 'en';
}

// @filename: hooks.server.js
import { get_lang } from './utils';
// ---cut---
/** @type {import('@sveltejs/kit/hooks').Handle} */
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```

## 더 읽어보기 <!-- Further reading -->

대부분의 경우, 접근성 있는 SvelteKit 앱을 만드는 것은 접근성 있는 웹 앱을 만드는 것과 같습니다. 다음과 같은 일반적인 접근성 자료의 내용을 여러분이 만드는 어떤 웹 경험에든 적용할 수 있을 것입니다:

- [MDN Web Docs: 접근성](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)
- [The A11y Project](https://www.a11yproject.com/)
- [WCAG를 충족하는 방법 (빠른 참조)](https://www.w3.org/WAI/WCAG21/quickref/)
