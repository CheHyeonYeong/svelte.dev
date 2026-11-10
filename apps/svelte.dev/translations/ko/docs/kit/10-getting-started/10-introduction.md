---
title: 소개
---

## 시작하기 전에 <!-- Before we begin -->

> [!NOTE] Svelte나 SvelteKit이 처음이라면 [대화형 튜토리얼](/tutorial/kit)을 먼저 살펴보기를 권합니다.
>
> 막히는 부분이 있으면 [Discord 채팅방](/chat)에서 도움을 요청하세요.

## SvelteKit이란? <!-- What is SvelteKit? -->

SvelteKit은 [Svelte](../svelte)를 사용해 견고하고 성능 좋은 웹 애플리케이션을 빠르게 개발하기 위한 프레임워크입니다. React를 써 봤다면 SvelteKit은 Next와 비슷하고, Vue를 써 봤다면 Nuxt와 비슷하다고 생각하면 됩니다.

SvelteKit으로 만들 수 있는 애플리케이션의 종류가 궁금하다면 [프로젝트 유형에 관한 문서](project-types)를 보세요.

## Svelte란? <!-- What is Svelte? -->

간단히 말해 Svelte는 사용자가 브라우저에서 보고 상호작용하는 사용자 인터페이스 컴포넌트(내비게이션 바, 댓글 영역, 문의 양식 등)를 작성하는 방법입니다. Svelte 컴파일러는 컴포넌트를, 페이지의 HTML을 렌더링하도록 실행할 수 있는 JavaScript와 페이지에 스타일을 입히는 CSS로 변환합니다. 이 가이드의 나머지 내용을 이해하는 데 Svelte를 꼭 알아야 하는 것은 아니지만, 알면 도움이 됩니다. 더 알고 싶다면 [Svelte 튜토리얼](/tutorial)을 살펴보세요.

## SvelteKit과 Svelte 비교 <!-- SvelteKit vs Svelte -->

Svelte는 UI 컴포넌트를 렌더링합니다. Svelte만으로도 이런 컴포넌트를 조합해 페이지 전체를 렌더링할 수는 있지만, 앱 전체를 만들려면 Svelte 외에 더 많은 것이 필요합니다.

SvelteKit은 최신 모범 사례를 따르면서 흔히 겪는 개발 문제에 대한 해법을 제공해 웹 앱을 만들도록 도와줍니다. 링크를 클릭하면 UI를 업데이트하는 [라우터](glossary#Routing) 같은 기본 기능부터 더 고급 기능까지 모두 갖추고 있습니다. 꼭 필요한 최소한의 코드만 불러오는 [빌드 최적화](https://vitejs.dev/guide/features.html#build-optimizations), [오프라인 지원](service-workers), 사용자가 이동하기 전에 페이지를 [프리로드](link-options#data-sveltekit-preload-data)하는 기능, 앱의 각 부분을 [SSR](glossary#SSR)로 서버에서, [클라이언트 사이드 렌더링](glossary#CSR)으로 브라우저에서, 또는 [프리렌더링](glossary#Prerendering)으로 빌드 시점에 처리할 수 있는 [설정 가능한 렌더링](page-options), [이미지 최적화](images) 등 다양한 기능을 제공합니다. 최신 모범 사례를 모두 지키며 앱을 만드는 일은 지독하게 복잡하지만, SvelteKit이 지루한 일을 모두 대신해 주므로 여러분은 창의적인 부분에 집중할 수 있습니다.

또한 [Vite](https://vitejs.dev/)와 [Svelte 플러그인](https://github.com/sveltejs/vite-plugin-svelte)을 활용한 [Hot Module Replacement (HMR)](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#hot)로 코드 변경 사항을 브라우저에 즉시 반영하므로, 매우 빠르고 기능이 풍부한 개발 경험을 제공합니다.
