---
title: prerender
---

프리렌더링은 요청마다 동적으로 HTML을 생성하는 대신, 빌드 시점에 페이지의 HTML을 한 번만 생성하는 것을 말합니다.

장점은 정적 데이터를 제공하는 비용이 매우 싸고 성능이 좋아서, (잘못 설정하기 쉬운) cache-control 헤더를 신경 쓰지 않고도 많은 사용자에게 손쉽게 서비스할 수 있다는 것입니다.

대신 빌드 과정이 더 오래 걸리고, 프리렌더링된 콘텐츠는 애플리케이션의 새 버전을 빌드하고 배포해야만 업데이트할 수 있습니다.

페이지를 프리렌더링하려면 `prerender`를 `true`로 설정하세요:

```js
/// file: src/routes/+page.server.js
export const prerender = true;
```

이 튜토리얼에서는 애플리케이션이 `dev` 모드로 실행 중이므로 눈에 띄는 효과는 없습니다.

모든 페이지를 프리렌더링할 수 있는 것은 아닙니다. 기본 규칙은 이렇습니다. 콘텐츠를 프리렌더링하려면 어떤 두 사용자가 직접 접속하더라도 서버에서 같은 콘텐츠를 받아야 하고, 페이지에 폼 액션이 없어야 합니다. 동적 라우트 매개변수가 있는 페이지도 [`prerender.entries`](/docs/kit/@sveltejs-kit-vite#prerender) 설정에 지정되어 있거나, `prerender.entries`에 *있는* 페이지에서 링크를 따라 도달할 수 있다면 프리렌더링할 수 있습니다.

> [!NOTE] 루트 `+layout.server.js`에서 `prerender`를 `true`로 설정하면 사실상 SvelteKit이 정적 사이트 생성기(SSG)가 됩니다.
