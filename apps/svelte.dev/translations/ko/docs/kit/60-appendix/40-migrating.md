---
title: Sapper에서 마이그레이션하기
rank: 1
---

SvelteKit은 Sapper의 후속 프레임워크이며 설계의 많은 요소를 공유합니다.

기존 Sapper 앱을 SvelteKit으로 마이그레이션할 계획이라면 바꿔야 할 부분이 여럿 있습니다. 마이그레이션하는 동안 [몇 가지 예제](additional-resources#Examples)를 살펴보면 도움이 될 수 있습니다.

## package.json

### type: "module"

`package.json`에 `"type": "module"`을 추가하세요. Sapper 0.29.3 이상을 사용한다면 점진적 마이그레이션의 일환으로 이 단계를
나머지와 따로 진행할 수 있습니다.

### dependencies

`polka`나 `express`를 사용하고 있다면 제거하고, `sirv`나 `compression` 같은 미들웨어도 모두 제거하세요.

### devDependencies

`devDependencies`에서 `sapper`를 제거하고, 대신 `@sveltejs/kit`과 사용할 [어댑터](adapters)를 추가하세요([다음 섹션](migrating#Project-files-Configuration) 참고).

### scripts

`sapper`를 참조하는 스크립트는 모두 업데이트해야 합니다:

- `sapper build`는 Node [어댑터](adapters)를 사용하는 `vite build`가 됩니다
- `sapper export`는 static [어댑터](adapters)를 사용하는 `vite build`가 됩니다
- `sapper dev`는 `vite dev`가 됩니다
- `node __sapper__/build`는 `node build`가 됩니다

## 프로젝트 파일 <!-- Project files -->

`src/routes`에 있는 앱의 대부분은 그대로 두어도 되지만, 몇몇 프로젝트 파일은 옮기거나 업데이트해야 합니다.

### 설정 <!-- Configuration -->

`webpack.config.js`나 `rollup.config.js`는 [여기](@sveltejs-kit-vite)에 설명된 대로 `vite.config.js`로 바꿔야 합니다. Svelte 전처리기 옵션은 SvelteKit 플러그인의 `config.preprocess` 설정으로 옮겨야 합니다.

[어댑터](adapters)를 추가해야 합니다. `sapper build`는 대략 [adapter-node](adapter-node)에, `sapper export`는 대략 [adapter-static](adapter-static)에 해당하지만, 배포할 플랫폼을 위해 설계된 어댑터를 쓰는 편이 나을 수도 있습니다.

[Vite](https://vitejs.dev)가 자동으로 처리하지 않는 파일 형식을 위한 플러그인을 사용하고 있었다면, 이에 해당하는 Vite 플러그인을 찾아 [Vite 설정](project-structure#Project-files-vite.config.js)에 추가해야 합니다.

### src/client.js

이 파일은 SvelteKit에 대응하는 것이 없습니다. (`sapper.start(...)` 외의) 사용자 정의 로직은 `+layout.svelte` 파일의 `onMount` 콜백 안에 작성해야 합니다.

### src/server.js

`adapter-node`를 사용한다면 [사용자 정의 서버](adapter-node#Custom-server)가 이에 해당합니다. 그렇지 않다면 이 파일에 직접 대응하는 것은 없습니다. SvelteKit 앱은 서버리스 환경에서도 실행될 수 있기 때문입니다.

### src/service-worker.js

`@sapper/service-worker`에서 가져오던 import 대부분은 [`$service-worker`]($service-worker)에 대응하는 것이 있습니다:

- `files`는 그대로입니다
- `routes`는 제거되었습니다
- `shell`은 이제 `build`입니다
- `timestamp`는 이제 `version`입니다

### src/template.html

`src/template.html` 파일의 이름을 `src/app.html`로 바꿔야 합니다.

`%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`를 제거하세요. `%sapper.head%`는 `%sveltekit.head%`로, `%sapper.html%`은 `%sveltekit.body%`로 바꾸세요. `<div id="sapper">`는 더 이상 필요하지 않습니다.

### src/node_modules

Sapper 앱에서 흔히 쓰던 패턴은 내부 라이브러리를 `src/node_modules` 안의 디렉터리에 두는 것입니다. 이 방식은 Vite에서 동작하지 않으므로 대신 [`src/lib`]($lib)를 사용합니다.

## 페이지와 레이아웃 <!-- Pages and layouts -->

### 이름이 바뀐 파일 <!-- Renamed files -->

이제 모호함을 없애기 위해 라우트는 오직 폴더 이름으로만 구성되며, `+page.svelte`까지 이어지는 폴더 이름이 라우트에 해당합니다. 개요는 [라우팅 문서](routing)를 참고하세요. 다음은 기존 라우팅 구조와 새 라우팅 구조를 비교한 것입니다:

| 기존                      | 새 구조                   |
| ------------------------- | ------------------------- |
| routes/about/index.svelte | routes/about/+page.svelte |
| routes/about.svelte       | routes/about/+page.svelte |

사용자 정의 에러 페이지 컴포넌트의 이름은 `_error.svelte`에서 `+error.svelte`로 바꿔야 합니다. `_layout.svelte` 파일도 마찬가지로 `+layout.svelte`로 이름을 바꿔야 합니다. [그 밖의 파일은 무시됩니다](routing#Other-files).

### Import <!-- Imports -->

`@sapper/app`에서 가져오던 `goto`, `prefetch`, `prefetchRoutes`는 각각 [`$app/navigation`]($app-navigation)에서 가져오는 `goto`, `preloadData`, `preloadCode`로 바꿔야 합니다.

`@sapper/app`에서 가져오던 `stores`도 바꿔야 합니다. 아래의 [스토어](migrating#Pages-and-layouts-Stores) 섹션을 참고하세요.

이전에 `src/node_modules`의 디렉터리에서 import하던 파일은 모두 [`#lib`]($lib) import로 바꿔야 합니다.

### Preload

이전과 마찬가지로 페이지와 레이아웃은 렌더링 전에 데이터를 로드할 수 있게 해 주는 함수를 내보낼 수 있습니다.

이 함수의 이름은 `preload`에서 [`load`](load)로 바뀌었고, 이제 `+page.svelte`(또는 `+layout.svelte`) 옆의 `+page.js`(또는 `+layout.js`)에 두며, API도 바뀌었습니다. `page`와 `session` 두 인수 대신 `event` 인수 하나를 받습니다.

`this` 객체가 더 이상 없으므로 `this.fetch`, `this.error`, `this.redirect`도 없습니다. 대신 입력 메서드에서 [`fetch`](load#Making-fetch-requests)를 가져올 수 있으며, [`error`](load#Errors)와 [`redirect`](load#Redirects)는 이제 throw합니다.

### 스토어 <!-- Stores -->

Sapper에서는 제공되는 스토어의 참조를 다음과 같이 가져왔습니다:

```js
// @filename: ambient.d.ts
declare module '@sapper/app';

// @filename: index.js
// ---cut---
import { stores } from '@sapper/app';
const { preloading, page, session } = stores();
```

`page` 스토어는 여전히 있습니다. `preloading`은 `from`과 `to` 속성을 가진 `navigating` 스토어로 대체되었습니다. `page`에는 이제 `url`과 `params` 속성이 있지만 `path`나 `query`는 없습니다.

SvelteKit에서는 이들에 접근하는 방식이 다릅니다. `stores`는 이제 `getStores`이지만, [`$app/stores`]($app-stores)에서 `navigating`과 `page`를 직접 import할 수 있으므로 대부분의 경우 필요하지 않습니다. Svelte 5와 SvelteKit 2.12 이상을 사용한다면 대신 [`$app/state`]($app-state)를 사용하는 것을 고려해 보세요.

### 라우팅 <!-- Routing -->

정규식 라우트는 더 이상 지원하지 않습니다. 대신 [고급 라우트 매칭](advanced-routing#Matching)을 사용하세요.

### 세그먼트 <!-- Segments -->

이전에는 레이아웃 컴포넌트가 자식 세그먼트를 나타내는 `segment` prop을 받았습니다. 이 기능은 제거되었으므로, 더 유연한 `$page.url.pathname`(또는 `page.url.pathname`) 값에서 원하는 세그먼트를 도출해야 합니다.

### URL <!-- URLs -->

Sapper에서는 모든 상대 URL을 현재 페이지가 아니라 기본 URL(`basepath` 옵션을 쓰지 않았다면 보통 `/`)을 기준으로 해석했습니다.

이 방식은 문제를 일으켰고 SvelteKit에서는 더 이상 그렇지 않습니다. 대신 상대 URL은 현재 페이지(`load` 함수 안의 `fetch` URL이라면 목적지 페이지)를 기준으로 해석됩니다. 대부분의 경우 루트 기준(즉 `/`로 시작하는) URL을 쓰는 편이 더 쉽습니다. 의미가 문맥에 따라 달라지지 않기 때문입니다.

### &lt;a&gt; 속성 <!-- &lt;a&gt; attributes -->

- `sapper:prefetch`는 이제 `data-sveltekit-preload-data`입니다
- `sapper:noscroll`은 이제 `data-sveltekit-reset="false"`입니다

## 엔드포인트 <!-- Endpoints -->

Sapper에서 [서버 라우트](routing#server)는 Node의 `http` 모듈이 노출하는 `req`와 `res` 객체(또는 Polka나 Express 같은 프레임워크가 제공하는 확장 버전)를 받았습니다.

SvelteKit은 앱이 어디서 실행되든 상관없도록 설계되었습니다. Node 서버에서 실행될 수도 있지만, 서버리스 플랫폼이나 Cloudflare Worker에서 실행될 수도 있습니다. 그래서 더 이상 `req`와 `res`를 직접 다루지 않습니다. 엔드포인트를 새 시그니처에 맞게 업데이트해야 합니다.

이렇게 환경에 구애받지 않는 동작을 지원하기 위해 이제 전역 컨텍스트에서 `fetch`를 사용할 수 있으므로, `node-fetch`, `cross-fetch` 같은 서버 사이드 fetch 구현을 import할 필요가 없습니다.

## 통합 <!-- Integrations -->

통합에 관한 자세한 내용은 [통합](./integrations)을 참고하세요.

### HTML 압축기 <!-- HTML minifier -->

Sapper는 기본으로 `html-minifier`를 포함합니다. SvelteKit은 이를 포함하지 않지만, 프로덕션 의존성으로 추가한 뒤 [훅](hooks#handle)으로 사용할 수 있습니다:

```js
// @filename: ambient.d.ts
/// <reference types="@sveltejs/kit" />
declare module 'html-minifier';

// @filename: index.js
// ---cut---
import { minify } from 'html-minifier';
import { building } from '$app/env';

const minification_options = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: false,
	removeAttributeQuotes: true,
	removeComments: false, // some hydration code needs comments, so leave them in
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	let page = '';

	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;
			if (done) {
				return building ? minify(page, minification_options) : page;
			}
		}
	});
}
```

`vite preview`로 사이트의 프로덕션 빌드를 테스트할 때는 `prerendering`이 `false`이므로, 압축 결과를 확인하려면 빌드된 HTML 파일을 직접 살펴봐야 합니다.
