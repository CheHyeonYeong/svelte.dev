---
title: Cloudflare
---

[Cloudflare Workers](https://workers.cloudflare.com/)나 [Cloudflare Pages](https://pages.cloudflare.com/)에 배포하려면 [`adapter-cloudflare`](https://github.com/sveltejs/kit/tree/main/packages/adapter-cloudflare)를 사용하세요.

이 어댑터는 [`adapter-auto`](adapter-auto)를 사용할 때 기본으로 설치됩니다. Cloudflare를 계속 쓸 계획이라면 [`adapter-auto`](adapter-auto) 대신 이 어댑터를 직접 사용하도록 바꿀 수 있습니다. 그러면 로컬 개발 중에 `cloudflare:workers`가 에뮬레이션되고, 타입 선언이 자동으로 적용되며, Cloudflare 전용 옵션을 설정할 수 있습니다.

## 비교 <!-- Comparisons -->

- `adapter-cloudflare` – SvelteKit의 모든 기능을 지원합니다. Cloudflare Workers Static Assets와 Cloudflare Pages용으로 빌드합니다
- `adapter-cloudflare-workers` – 지원 중단(deprecated)되었습니다. SvelteKit의 모든 기능을 지원하며, Cloudflare Workers Sites용으로 빌드합니다
- `adapter-static` – 클라이언트 사이드 정적 에셋만 생성합니다. Cloudflare Workers Static Assets 및 Cloudflare Pages와 호환됩니다

## 사용법 <!-- Usage -->

[`npx sv add sveltekit-adapter="adapter:cloudflare"`](/docs/cli/sveltekit-adapter)를 실행하거나, `npm i -D @sveltejs/adapter-cloudflare`로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				// See below for an explanation of these options
				config: undefined,
				platformProxy: {
					configPath: undefined,
					environment: undefined,
					persist: undefined
				},
				fallback: 'plaintext',
				routes: {
					include: ['/*'],
					exclude: ['<all>']
				}
			})
		})
	]
});
```

## 옵션 <!-- Options -->

### config

[Wrangler 설정 파일](https://developers.cloudflare.com/workers/wrangler/configuration/)의 경로입니다. `wrangler.jsonc`, `wrangler.json`, `wrangler.toml`이 아닌 다른 이름의 Wrangler 설정 파일을 쓰고 싶다면 이 옵션으로 지정할 수 있습니다.

### platformProxy

에뮬레이션되는 로컬 `env` 바인딩에 대한 설정입니다. 전체 옵션 목록은 Wrangler API 문서의 [getPlatformProxy](https://developers.cloudflare.com/workers/wrangler/api/#parameters-1)를 참고하세요.

### fallback

일치하는 에셋이 없는 요청에 대해 일반 텍스트 404.html 페이지를 렌더링할지, 렌더링된 SPA 폴백 페이지를 렌더링할지 정합니다.

Cloudflare Workers에서는 일치하는 에셋이 없는 요청에 대해 본문이 없는 404 상태 응답을 반환하는 것이 기본 동작입니다. 하지만 Wrangler 설정의 [`assets.not_found_handling`](https://developers.cloudflare.com/workers/static-assets/routing/#2-not_found_handling)이 `"404-page"`로 설정되어 있으면, 요청이 에셋과 일치하지 않을 때 이 페이지가 제공됩니다. `assets.not_found_handling`이 `"single-page-application"`으로 설정되어 있으면, 어댑터는 지정한 `fallback` 옵션과 관계없이 SPA 폴백 `index.html` 페이지를 렌더링합니다.

Cloudflare Pages에서는 `routes.exclude`의 항목과 일치하는 요청이 에셋과 일치하지 않을 때만 이 페이지가 제공됩니다.

대부분은 `plaintext`로 충분하지만, 100개의 라우트 제한을 넘지 않도록 `routes.exclude`로 프리렌더링된 페이지 일부를 직접 제외하고 있다면, 사용자에게 스타일이 적용되지 않은 404 페이지가 보이지 않도록 `spa`를 쓰는 것이 좋을 수 있습니다.

자세한 내용은 Cloudflare Pages의 [Not Found 동작](https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior)을 참고하세요.

### routes

Cloudflare Pages 전용입니다. `adapter-cloudflare`가 생성하는 [`_routes.json`](https://developers.cloudflare.com/pages/functions/routing/#create-a-_routesjson-file) 파일을 원하는 대로 바꿀 수 있습니다.

- `include`는 함수를 호출할 라우트를 정의하며, 기본값은 `['/*']`입니다
- `exclude`는 함수를 호출하지 _않을_ 라우트를 정의합니다. 앱의 정적 에셋을 더 빠르고 저렴하게 제공하는 방법입니다. 이 배열에는 다음과 같은 특수 값을 넣을 수 있습니다:
	- `<build>`는 앱의 빌드 결과물(Vite가 생성한 파일)을 담습니다
	- `<files>`는 `static` 디렉터리의 내용을 담습니다
	- `<redirects>`는 루트에 있는 [`_redirects` 파일](https://developers.cloudflare.com/pages/configuration/redirects/)의 경로명 목록을 담습니다
	- `<prerendered>`는 프리렌더링된 페이지 목록을 담습니다
	- `<all>`(기본값)은 위의 모든 것을 담습니다

`include`와 `exclude` 규칙은 합쳐서 최대 100개까지 둘 수 있습니다. 보통은 `routes` 옵션을 생략해도 되지만, (예를 들어) `<prerendered>` 경로가 이 제한을 넘는다면 자동 생성된 `['/articles/foo', '/articles/bar', '/articles/baz', ...]` 대신 `'/articles/*'`를 포함하는 `exclude` 목록을 직접 만드는 것이 도움이 될 수 있습니다.

## Cloudflare Workers

### 기본 설정 <!-- Basic configuration -->

Cloudflare Workers용으로 빌드할 때 이 어댑터는 프로젝트 루트에 [Wrangler 설정 파일](https://developers.cloudflare.com/workers/configuration/sites/configuration/)이 있을 것으로 기대합니다. 대략 다음과 같은 형태입니다:

```jsonc
/// file: wrangler.jsonc
{
	"name": "<any-name-you-want>",
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_flags": ["nodejs_als"],
	"compatibility_date": "<YYYY-MM-DD>",
	"assets": {
		"binding": "ASSETS",
		"directory": ".svelte-kit/cloudflare",
	}
}
```

### 배포 <!-- Deployment -->

`npx wrangler deploy`를 실행해 Wrangler CLI로 애플리케이션을 배포하거나, [Cloudflare Git 통합](https://developers.cloudflare.com/workers/ci-cd/builds/)을 사용해 푸시할 때 자동으로 빌드하고 배포하도록 할 수 있습니다.

## Cloudflare Pages

### 배포 <!-- Deployment -->

시작하려면 Cloudflare Pages의 [시작 가이드](https://developers.cloudflare.com/pages/get-started/)를 따르세요.

[Git 통합](https://developers.cloudflare.com/pages/get-started/git-integration/)을 사용한다면 빌드 설정은 다음과 같아야 합니다:

- Framework preset – SvelteKit
- Build command – `npm run build` 또는 `vite build`
- Build output directory – `.svelte-kit/cloudflare`

[Node.js AsyncLocalStorage](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-asynclocalstorage) API만 활성화하려면 wrangler 설정의 `compatibility_flags` 배열에 `nodejs_als` 호환성 플래그를 추가하세요.

### 더 읽어보기 <!-- Further reading -->

[Cloudflare Pages에 SvelteKit 사이트를 배포하는 방법에 대한 Cloudflare 문서](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/)를 참고해도 좋습니다.

### 참고 사항 <!-- Notes -->

프로젝트 루트의 [`/functions` 디렉터리](https://developers.cloudflare.com/pages/functions/routing/)에 들어 있는 함수는 배포에 포함되지 _않습니다_. 대신 함수는 SvelteKit 앱의 [서버 엔드포인트](routing#server)로 구현해야 하며, 앱은 [하나의 `_worker.js` 파일](https://developers.cloudflare.com/pages/functions/advanced-mode/)로 컴파일됩니다.

## 런타임 API <!-- Runtime APIs -->

[`env`](https://developers.cloudflare.com/workers/runtime-apis/fetch-event#parameters) 객체에는 KV/DO 네임스페이스 등으로 이루어진 프로젝트의 [바인딩](https://developers.cloudflare.com/workers/runtime-apis/bindings/)이 들어 있습니다. 이 객체는 [`cloudflare:workers`](https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global) 모듈에서 사용할 수 있습니다.

```js
/// file: +server.js
// @filename: ambient.d.ts
declare module 'cloudflare:workers' {
	export const env: {
		YOUR_DURABLE_OBJECT_NAMESPACE: import('@cloudflare/workers-types').DurableObjectNamespace;
	};
}
// @filename: +server.js
// ---cut---
// @errors: 2355 2322
import { env } from 'cloudflare:workers';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	const x = env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

> [!NOTE] 환경 변수에는 SvelteKit에 내장된 [`$app/env/*` 모듈](environment-variables)을 우선 사용하세요.

이 타입을 앱에서 사용할 수 있게 하려면 [`wrangler`](https://www.npmjs.com/package/wrangler)를 설치하고 [`wrangler types`](https://developers.cloudflare.com/workers/languages/typescript/)를 실행하세요.

### 로컬에서 테스트하기 <!-- Testing locally -->

Cloudflare 전용 값은 dev 모드와 preview 모드에서 에뮬레이션됩니다. 로컬 [바인딩](https://developers.cloudflare.com/workers/wrangler/configuration/#bindings)은 [Wrangler 설정 파일](https://developers.cloudflare.com/workers/wrangler/)을 바탕으로 만들어지며, 개발과 미리 보기 중에 `env`를 채우는 데 쓰입니다. 바인딩 설정을 바꾸려면 어댑터 설정의 [`platformProxy` 옵션](#Options-platformProxy)을 사용하세요.

> [!NOTE] worker에서 커스텀 클래스를 내보내야 하는 [Durable Objects](https://developers.cloudflare.com/durable-objects/)와 [Workflows](https://developers.cloudflare.com/workflows/)는 현재 지원되지 않습니다.

빌드를 테스트하려면 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 4 버전을 사용해야 합니다. 사이트를 빌드한 뒤, Cloudflare Workers용으로 테스트한다면 `wrangler dev .svelte-kit/cloudflare/_worker.js`를, Cloudflare Pages용이라면 `wrangler pages dev .svelte-kit/cloudflare`를 실행하세요.

## 헤더와 리디렉션 <!-- Headers and redirects -->

Cloudflare 전용 파일인 [`_headers`](https://developers.cloudflare.com/pages/configuration/headers/)와 [`_redirects`](https://developers.cloudflare.com/pages/configuration/redirects/)를 프로젝트 루트 폴더에 두면 (이미지 같은) 정적 에셋 응답에 사용할 수 있습니다.

하지만 SvelteKit이 동적으로 렌더링하는 응답에는 효과가 없습니다. 이런 응답에서 커스텀 헤더나 리디렉션 응답을 반환하려면 [서버 엔드포인트](routing#server)나 [`handle`](hooks#handle) 훅을 사용해야 합니다.

## 문제 해결 <!-- Troubleshooting -->

### Node.js 호환성 <!-- Node.js compatibility -->

[Node.js 호환성](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)을 활성화하려면 Wrangler 설정 파일에 `nodejs_compat` 호환성 플래그를 추가하면 됩니다:

```jsonc
/// file: wrangler.jsonc
{
	"compatibility_flags": ["nodejs_compat"]
}
```

### Worker 크기 제한 <!-- Worker size limits -->

애플리케이션을 배포할 때 SvelteKit이 생성한 서버는 하나의 파일로 번들됩니다. 최소화(minify)한 뒤에도 worker가 [크기 제한](https://developers.cloudflare.com/workers/platform/limits/#worker-size)을 넘으면 Wrangler가 worker를 게시하지 못합니다. 보통은 이 제한에 걸릴 일이 거의 없지만, 일부 큰 라이브러리 때문에 그럴 수 있습니다. 이 경우 해당 라이브러리를 클라이언트 사이드에서만 import해 worker의 크기를 줄여 볼 수 있습니다. 자세한 내용은 [FAQ](./faq#How-do-I-use-a-client-side-library-accessing-document-or-window)를 참고하세요.

### 파일 시스템 접근하기 <!-- Accessing the file system -->

Cloudflare Workers에서는 `fs`를 사용할 수 없습니다.

대신 `$app/server`의 [`read`]($app-server#read) 함수로 파일에 접근하세요. 이 함수는 배포된 공개 에셋 위치에서 파일을 가져오는 방식으로 동작합니다.

또는 해당 라우트를 [프리렌더링](page-options#prerender)할 수도 있습니다.

## Workers Sites에서 마이그레이션하기 <!-- Migrating from Workers Sites -->

Cloudflare는 더 이상 [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/configuration/) 사용을 권장하지 않으며, 대신 [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)를 권장합니다. 마이그레이션하려면 `@sveltejs/adapter-cloudflare-workers`를 `@sveltejs/adapter-cloudflare`로 바꾸고 Wrangler 설정 파일에서 `site` 설정을 모두 제거한 뒤, `assets.directory`와 `assets.binding` 설정을 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
+++import adapter from '@sveltejs/adapter-cloudflare';+++
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			+++adapter: adapter()+++
		})
	]
});
```

### wrangler.toml

```toml
/// file: wrangler.toml
---site.bucket = ".cloudflare/public"---
+++assets.directory = ".cloudflare/public"
assets.binding = "ASSETS" # Exclude this if you don't have a `main` key configured.+++
```

### wrangler.jsonc

```jsonc
/// file: wrangler.jsonc
{
---	"site": {
		"bucket": ".cloudflare/public"
	},---
+++	"assets": {
		"directory": ".cloudflare/public",
		"binding": "ASSETS" // Exclude this if you don't have a `main` key configured.
	}+++
}
```
