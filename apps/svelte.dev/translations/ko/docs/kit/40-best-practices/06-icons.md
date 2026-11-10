---
title: 아이콘
---

## CSS

아이콘을 쓰는 좋은 방법 중 하나는 순수하게 CSS로 정의하는 것입니다. Iconify는 [인기 있는 여러 아이콘 세트](https://icon-sets.iconify.design/)를 지원하며, 이들은 [CSS로 포함할 수 있습니다](https://iconify.design/docs/usage/css/). 이 방법은 Iconify의 [Tailwind CSS 플러그인](https://iconify.design/docs/usage/css/tailwind/)이나 [UnoCSS 플러그인](https://iconify.design/docs/usage/css/unocss/)을 활용해 인기 있는 CSS 프레임워크와 함께 쓸 수도 있습니다. Svelte 컴포넌트 기반 라이브러리와 달리, 아이콘마다 `.svelte` 파일에 import할 필요가 없습니다.

## Svelte

[Svelte용 아이콘 라이브러리](/packages#icons)는 많이 있습니다. 아이콘 라이브러리를 고를 때는 아이콘마다 `.svelte` 파일을 하나씩 제공하는 라이브러리는 피하는 것이 좋습니다. 이런 라이브러리에는 `.svelte` 파일이 수천 개나 있을 수 있어서 [Vite의 의존성 최적화](https://vite.dev/guide/dep-pre-bundling.html)를 크게 느리게 만듭니다. [`vite-plugin-svelte` FAQ에서 설명하듯이](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies) 아이콘을 통합 import와 하위 경로 import 양쪽으로 가져오면 문제가 특히 심각해질 수 있습니다.
