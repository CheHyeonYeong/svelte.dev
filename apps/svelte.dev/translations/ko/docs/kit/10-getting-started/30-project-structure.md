---
title: 프로젝트 구조
---

일반적인 SvelteKit 프로젝트는 다음과 같은 모습입니다:

```tree
my-project/
├ src/
│ ├ lib/
│ │ └ [your lib files]
│ ├ routes/
│ │ └ [your routes]
│ ├ service-worker/
│ │ ├ index.js
│ │ └ tsconfig.json
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ ├ instrumentation.server.js
│ └ params.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package.json
├ tsconfig.json
└ vite.config.js
```

이 밖에 `.gitignore`나 `.npmrc` 같은 흔한 파일도 있습니다(`npx sv create`를 실행할 때 해당 옵션을 골랐다면 `.prettierrc`, `eslint.config.js` 등도 있습니다).

## 프로젝트 파일 <!-- Project files -->

### src

`src` 디렉터리에는 프로젝트의 핵심이 들어 있습니다. `src/routes`와 `src/app.html`을 제외한 나머지는 모두 선택 사항입니다.

- `lib`에는 라이브러리 코드(유틸리티와 컴포넌트)가 들어 있으며, [`#lib`]($lib) 별칭으로 가져오거나 [`svelte-package`](packaging)로 패키징해 배포할 수 있습니다
  - 깊이에 상관없이 `server`라는 이름의 디렉터리는 그 안의 모든 코드를 [서버 전용](server-only-modules)으로 표시합니다. SvelteKit은 클라이언트 코드에서 이런 코드를 가져오지 못하게 막습니다.
- `routes`에는 애플리케이션의 [라우트](routing)가 들어 있습니다. 하나의 라우트에서만 쓰는 다른 컴포넌트도 이곳에 함께 둘 수 있습니다
- `service-worker`에는 [서비스 워커](service-workers)가 들어 있습니다
- `app.html`은 페이지 템플릿으로, 다음 플레이스홀더가 들어 있는 HTML 문서입니다:
  - `%sveltekit.head%` — 앱에 필요한 `<link>`와 `<script>` 요소, 그리고 모든 `<svelte:head>` 내용
  - `%sveltekit.body%` — 렌더링된 페이지의 마크업. 브라우저 확장이 주입한 요소가 하이드레이션 과정에서 제거되어 생기는 버그를 막으려면, `<body>` 바로 안이 아니라 `<div>` 같은 요소 안에 두어야 합니다. 그렇지 않으면 SvelteKit이 개발 중에 경고를 표시합니다
  - `%sveltekit.assets%` — 지정했다면 [`paths.assets`](@sveltejs-kit-vite#paths), 아니면 [`paths.base`](@sveltejs-kit-vite#paths)에 대한 상대 경로
  - `%sveltekit.nonce%` — 직접 포함한 링크와 스크립트에 쓰는 [CSP](@sveltejs-kit-vite#csp) nonce(사용하는 경우)
  - `%sveltekit.env.[NAME]%` - 렌더링 시점에 `[NAME]` 환경 변수로 바뀝니다. 이 변수는 `src/env`에 공개 변수로 정의되어 있어야 합니다. 일치하는 변수가 없으면 `''`로 대체됩니다.
  - `%sveltekit.version%` — 앱 버전. [`version`](@sveltejs-kit-vite#version) 설정으로 지정할 수 있습니다
- `error.html`은 다른 모든 것이 실패했을 때 렌더링되는 페이지입니다. 다음 플레이스홀더를 넣을 수 있습니다:
  - `%sveltekit.status%` — HTTP 상태
  - `%sveltekit.error.message%` — 에러 메시지
- `hooks.client.js`에는 클라이언트 [훅](hooks)이 들어 있습니다
- `hooks.server.js`에는 서버 [훅](hooks)이 들어 있습니다
- `params.js`에는 앱에 필요한 [매개변수 매처](advanced-routing#Matching)가 들어 있습니다
- `instrumentation.server.js`에는 [관측 가능성](observability) 설정과 계측 코드가 들어 있습니다
  - 어댑터의 지원이 필요합니다. 어댑터가 지원한다면 애플리케이션 코드를 불러와 실행하기 전에 반드시 먼저 실행됩니다.

(프로젝트에 `.js` 파일이 있는지 `.ts` 파일이 있는지는 프로젝트를 만들 때 TypeScript를 선택했는지에 따라 달라집니다.)

프로젝트를 설정할 때 [Vitest](https://vitest.dev)를 추가했다면 단위 테스트는 `src` 디렉터리 안에 `.test.js` 확장자로 둡니다.

### static

`robots.txt`처럼 이름을 바꾸지 않고 그대로 제공해야 하는 정적 에셋은 이곳에 둡니다. 일반적으로는 `static/`의 에셋 수를 최소한으로 줄이고 대신 `import`로 가져오는 편이 좋습니다. `import`를 사용하면 [Vite의 내장 처리](images#Vite's-built-in-handling)가 에셋 내용의 해시를 바탕으로 고유한 이름을 붙여 주므로 캐시할 수 있습니다.

### tests

프로젝트를 설정할 때 브라우저 테스트용으로 [Playwright](https://playwright.dev/)를 추가했다면 테스트는 이 디렉터리에 둡니다.

### package.json

`package.json` 파일의 `devDependencies`에는 반드시 `@sveltejs/kit`, `svelte`, `vite`가 들어 있어야 합니다.

`npx sv create`로 프로젝트를 만들면 `package.json`에 `"type": "module"`이 들어 있는 것도 볼 수 있습니다. 이는 `.js` 파일을 `import`와 `export` 키워드를 쓰는 네이티브 JavaScript 모듈로 해석한다는 뜻입니다. 레거시 CommonJS 파일에는 `.cjs` 확장자를 붙여야 합니다.

### vite.config.js

SvelteKit 프로젝트는 사실 [`@sveltejs/kit/vite`](@sveltejs-kit-vite) 플러그인과 그 밖의 [Vite 설정](https://vitejs.dev/config/)을 사용하는 [Vite](https://vitejs.dev) 프로젝트일 뿐입니다. 이 플러그인은 Svelte와 SvelteKit [설정](@sveltejs-kit-vite)을 받습니다.

### tsconfig.json

이 파일(`.ts` 파일보다 타입 검사를 하는 `.js` 파일을 선호한다면 `jsconfig.json`)은 `npx sv create`에서 타입 검사를 추가했을 때 TypeScript를 설정합니다. SvelteKit은 특정 설정이 정해진 방식으로 되어 있어야 하므로, 여러분의 설정이 `extends`할 [TypeScript 설정 모듈]($app-tsconfig)을 생성합니다.

## 기타 파일 <!-- Other files -->

### .svelte-kit

프로젝트를 개발하고 빌드하는 동안 SvelteKit은 `.svelte-kit` 디렉터리([`outDir`](@sveltejs-kit-vite#outDir)로 바꿀 수 있음)에 파일을 생성합니다. 이 내용은 무시해도 되며 언제든 지워도 됩니다(다음에 `dev`나 `build`를 실행할 때 다시 생성됩니다).
