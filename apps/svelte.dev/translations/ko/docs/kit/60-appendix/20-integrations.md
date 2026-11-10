---
title: 통합
---

## `vitePreprocess`

[`vitePreprocess`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/preprocess.md)는 `.svelte` 파일의 `<style>`과 `<script>` 태그를 전처리합니다.

```js
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess({
				style: true,      // default value
				script: false     // default value
			})
		})
	]
});
```

### `style`

`<style>` 태그에서 CSS 전처리기(PostCSS, SCSS, Less, Stylus, SugarSS)를 사용하려면 `vitePreprocess()`를 사용하세요.

### `script`

다음과 같은 경우에는 `vitePreprocess({ script: true })`를 사용하세요:
- 프로젝트가 Svelte 5 이전 버전인 경우
- 코드를 생성하는 고급 TypeScript 기능을 사용하는 경우 _([`vitePreprocess`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/preprocess.md) 문서를 확인하세요)_

> [!NOTE]
Svelte 5는 TypeScript를 기본으로 지원하므로, Svelte 5를 사용하고 있고 코드를 생성하는 고급 TypeScript 기능을 쓸 필요가 없다면 `vitePreprocess`는 아마 필요 없을 것입니다.

## 애드온 <!-- Add-ons -->

[`npx sv add`](/docs/cli/sv-add)를 실행하면 명령 하나로 다양한 복잡한 통합을 설정할 수 있습니다. 다음과 같은 것들이 있습니다:
- prettier (포매팅)
- eslint (린팅)
- vitest (단위 테스트)
- playwright (e2e 테스트)
- better-auth (인증)
- tailwind (CSS)
- drizzle (DB)
- paraglide (i18n)
- mdsvex (마크다운)
- storybook (프론트엔드 워크숍)
- adapters (호스팅)
- mcp (LLM 도구)

## 패키지 <!-- Packages -->

엄선된 고품질 Svelte 패키지 모음은 [패키지 페이지](/packages)에서 확인하세요. 추가 라이브러리, 템플릿, 자료는 [sveltesociety.dev](https://sveltesociety.dev/)에서도 볼 수 있습니다.

## 추가 통합 <!-- Additional integrations -->

### `svelte-preprocess`

`svelte-preprocess`에는 Pug, Babel, 전역 스타일 지원처럼 `vitePreprocess`에 없는 추가 기능이 있습니다. 하지만 `vitePreprocess`가 더 빠르고 설정도 덜 필요할 수 있으므로 기본으로 사용됩니다. SvelteKit은 CoffeeScript를 [지원하지 않는다](https://github.com/sveltejs/kit/issues/2920#issuecomment-996469815)는 점에 유의하세요.

`npm i -D svelte-preprocess`로 `svelte-preprocess`를 설치하고 [`vite.config.js`에 추가](https://github.com/sveltejs/svelte-preprocess/blob/main/docs/usage.md#with-svelte-config)해야 합니다. 그다음에는 대개 `npm i -D sass`나 `npm i -D less`처럼 [해당 라이브러리를 설치](https://github.com/sveltejs/svelte-preprocess/blob/main/docs/getting-started.md)해야 합니다.

## Vite 플러그인 <!-- Vite plugins -->

SvelteKit 프로젝트는 Vite로 빌드되므로, Vite 플러그인을 사용해 프로젝트를 강화할 수 있습니다. 사용할 수 있는 플러그인 목록은 [`vitejs/awesome-vite`](https://github.com/vitejs/awesome-vite?tab=readme-ov-file#plugins)에서 확인하세요.

## 통합 FAQ <!-- Integration FAQs -->

[SvelteKit FAQ](./faq)에는 SvelteKit으로 어떤 일을 하는 방법에 관한 질문의 답이 많이 있으니, 아직 궁금한 점이 있다면 도움이 될 것입니다.
