---
title: 정적 사이트 생성
---

SvelteKit을 정적 사이트 생성기(SSG)로 사용하려면 [`adapter-static`](https://github.com/sveltejs/kit/tree/main/packages/adapter-static)을 사용하세요.

이 어댑터는 사이트 전체를 정적 파일 모음으로 프리렌더링합니다. 일부 페이지만 프리렌더링하고 나머지는 서버에서 동적으로 렌더링하고 싶다면, 다른 어댑터를 [`prerender` 옵션](page-options#prerender)과 함께 사용해야 합니다.

## 사용법 <!-- Usage -->

[`npx sv add sveltekit-adapter="adapter:static"`](/docs/cli/sveltekit-adapter)를 실행하거나, `npm i -D @sveltejs/adapter-static`으로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				// default options are shown. On some platforms
				// these options are set automatically — see below
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: false,
				strict: true
			})
		})
	]
});
```

...그리고 루트 레이아웃에 [`prerender`](page-options#prerender) 옵션을 추가합니다:

```js
/// file: src/routes/+layout.js
// If you're using a fallback (i.e. SPA mode) you don't need to prerender all
// pages by setting this here, but should prerender as many as possible to
// avoid large performance and SEO impacts
export const prerender = true;
```

> [!NOTE] SvelteKit의 [`trailingSlash`](page-options#trailingSlash) 옵션이 환경에 맞게 설정되어 있는지 반드시 확인하세요. 호스트가 `/a`에 대한 요청을 받았을 때 `/a.html`을 렌더링하지 않는다면, 루트 레이아웃에 `trailingSlash: 'always'`를 설정해 대신 `/a/index.html`을 만들도록 해야 합니다.

> [!NOTE] SvelteKit의 [`ssr`](page-options#ssr) 옵션이 `false`로 설정되어 있지 않은지 반드시 확인하세요. 그렇지 않으면 프리렌더링 시 완전히 렌더링된 콘텐츠 대신 빈 '셸' 페이지가 저장됩니다.

## 설정 없는 지원 <!-- Zero-config support -->

일부 플랫폼은 설정 없이 바로 지원됩니다(앞으로 더 늘어날 예정입니다):

- [Vercel](https://vercel.com)

이런 플랫폼에서는 `adapter-static`이 최적의 설정을 제공할 수 있도록 어댑터 옵션을 생략해야 합니다:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(---{...}---)
		})
	]
});
```

## 옵션 <!-- Options -->

### pages

프리렌더링된 페이지를 기록할 디렉터리입니다. 기본값은 `build`입니다.

### assets

정적 에셋(`static`의 내용과 SvelteKit이 생성한 클라이언트 사이드 JS 및 CSS)을 기록할 디렉터리입니다. 보통은 `pages`와 같아야 하며 기본값도 `pages`의 값을 따르지만, 드물게 페이지와 에셋을 서로 다른 위치에 출력해야 할 수도 있습니다.

### fallback

[싱글 페이지 앱(SPA)](single-page-apps)을 만들려면 SvelteKit이 생성할 폴백(fallback) 페이지의 이름을 지정해야 합니다. 이 페이지는 프리렌더링되지 않은 URL의 진입점으로 쓰입니다. 보통은 `200.html`이지만 배포 플랫폼에 따라 다를 수 있습니다. 프리렌더링된 홈페이지와 충돌하지 않도록 가능하면 `index.html`은 피하세요.

> [!NOTE] 이 옵션은 성능과 SEO에 큰 악영향을 줍니다. 사이트를 모바일 앱으로 감싸는 경우처럼 특정한 상황에서만 권장합니다. 자세한 내용과 대안은 [싱글 페이지 앱](single-page-apps) 문서를 참고하세요.

### precompress

`true`이면 파일을 brotli와 gzip으로 미리 압축합니다. 그러면 `.br`과 `.gz` 파일이 생성됩니다.

### strict

기본적으로 `adapter-static`은 앱의 모든 페이지와 엔드포인트(있다면)가 프리렌더링되었는지, 또는 `fallback` 옵션이 설정되어 있는지 검사합니다. 이 검사는 최종 결과물에 포함되지 않아 일부에 접근할 수 없는 앱을 실수로 배포하는 일을 막기 위한 것입니다. 이래도 괜찮다는 것을 알고 있다면(예를 들어 특정 페이지가 조건부로만 존재하는 경우) `strict`를 `false`로 설정해 이 검사를 끌 수 있습니다.

## GitHub Pages

[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)용으로 빌드할 때 저장소 이름이 `your-username.github.io`와 같지 않다면, [`config.paths.base`](@sveltejs-kit-vite#paths)를 저장소 이름에 맞게 바꿔야 합니다. 사이트가 루트가 아니라 `https://your-username.github.io/your-repo-name`에서 제공되기 때문입니다.

GitHub Pages가 보여 주는 기본 404 페이지를 대신할 폴백 `404.html` 페이지도 생성하는 것이 좋습니다.

GitHub Pages용 설정은 다음과 같을 것입니다:

```js
// @errors: 2307 2322
/// file: vite.config.js
import process from 'node:process';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				fallback: '404.html'
			}),
			paths: {
				base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
			},
		})
	]
});
```

GitHub Actions를 사용하면 변경 사항이 생길 때 사이트를 GitHub Pages에 자동으로 배포할 수 있습니다. 다음은 워크플로 예시입니다:

```yaml
### file: .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: 'main'

permissions:
  contents: read
  pages: read

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      # If you're using pnpm, add this step then change the commands and cache key below to use `pnpm`
      # - name: Install pnpm
      #   uses: pnpm/action-setup@v6

      - name: Install Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm i

      - name: Configure Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: build
        env:
          BASE_PATH: ${{ steps.pages.outputs.base_path }}
        run: |
          npm run build

      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v5
        with:
          # this should match the `pages` option in your adapter-static options
          path: 'build/'
          # keep dotfiles such as `static/.well-known`
          include-hidden-files: true

  deploy:
    needs: build_site
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

GitHub Actions로 사이트를 배포하지 않는다면(예를 들어 빌드된 사이트를 별도 저장소에 푸시하는 경우), Jekyll이 간섭하지 않도록 `static` 디렉터리에 빈 `.nojekyll` 파일을 추가하세요.
