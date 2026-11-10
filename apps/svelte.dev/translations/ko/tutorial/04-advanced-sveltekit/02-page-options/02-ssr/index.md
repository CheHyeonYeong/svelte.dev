---
title: ssr
---

서버 사이드 렌더링(SSR)은 서버에서 HTML을 생성하는 과정으로, SvelteKit이 기본으로 하는 일입니다. SSR은 성능과 [회복력](https://kryogenix.org/code/browser/everyonehasjs.html)에 중요하고 검색 엔진 최적화(SEO)에도 매우 유리합니다. 일부 검색 엔진은 브라우저에서 JavaScript로 렌더링된 콘텐츠도 색인할 수 있지만, 그 빈도와 신뢰도가 더 낮습니다.

그렇긴 하지만, 일부 컴포넌트는 서버에서 렌더링할 *수 없습니다*. 예를 들어 `window` 같은 브라우저 전역 객체에 곧바로 접근할 수 있다고 가정하는 경우입니다. 가능하다면 그런 컴포넌트가 서버에서 렌더링될 *수 있도록* 고치는 것이 좋지만, 그럴 수 없다면 SSR을 끌 수 있습니다:

```js
/// file: src/routes/+page.server.js
export const ssr = false;
```

> [!NOTE] 루트 `+layout.server.js`에서 `ssr`을 `false`로 설정하면 사실상 앱 전체가 싱글 페이지 앱(SPA)이 됩니다.
