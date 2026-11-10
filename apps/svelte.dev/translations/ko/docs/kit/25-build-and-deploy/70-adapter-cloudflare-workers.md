---
title: Cloudflare Workers
---

> [!NOTE] `adapter-cloudflare-workers`는 지원 중단(deprecated)되었으며 [`adapter-cloudflare`](adapter-cloudflare)로 대체되었습니다. Cloudflare Workers Sites는 [Static Assets](https://developers.cloudflare.com/workers/static-assets/)로 대체되어 지원 중단될 예정이므로, Cloudflare Workers에 Static Assets로 배포하려면 `adapter-cloudflare`를 사용하는 것을 권장합니다.

[Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/)를 사용해 [Cloudflare Workers](https://workers.cloudflare.com/)에 배포하려면 `adapter-cloudflare-workers`를 사용하세요.

## 사용법 <!-- Usage -->

`npm i -D @sveltejs/adapter-cloudflare-workers`로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-cloudflare-workers';

export default defineConfig({
	plugins: [
		sveltekit({
+++			adapter: adapter({
				// see below for options that can be set here
			})+++
		})
	]
});
```

## 옵션 <!-- Options -->

### config

[Wrangler 설정 파일](https://developers.cloudflare.com/workers/wrangler/configuration/)의 경로입니다. `wrangler.jsonc`, `wrangler.json`, `wrangler.toml`이 아닌 다른 이름의 Wrangler 설정 파일을 쓰고 싶다면 이 옵션으로 지정할 수 있습니다.

### platformProxy

에뮬레이션되는 로컬 `platform.env` 바인딩에 대한 설정입니다. 전체 옵션 목록은 Wrangler API 문서의 [getPlatformProxy](https://developers.cloudflare.com/workers/wrangler/api/#parameters-1)를 참고하세요.

## 기본 설정 <!-- Basic Configuration -->

이 어댑터는 프로젝트 루트에 [Wrangler 설정 파일](https://developers.cloudflare.com/workers/configuration/sites/configuration/)이 있을 것으로 기대합니다. 대략 다음과 같은 형태입니다:

```jsonc
/// file: wrangler.jsonc
{
	"name": "<your-service-name>",
	"account_id": "<your-account-id>",
	"main": "./.cloudflare/worker.js",
	"site": {
		"bucket": "./.cloudflare/public"
	},
	"build": {
		"command": "npm run build"
	},
	"compatibility_date": "2021-11-12"
}
```

`<your-service-name>`은 아무 이름이나 써도 됩니다. `<your-account-id>`는 Wrangler CLI 도구로 `wrangler whoami`를 실행하거나, [Cloudflare 대시보드](https://dash.cloudflare.com)에 로그인해 URL 끝부분에서 확인할 수 있습니다:

```
https://dash.cloudflare.com/<your-account-id>/home
```

> [!NOTE] `.cloudflare` 디렉터리(또는 `main`과 `site.bucket`에 지정한 디렉터리)와 `.wrangler` 디렉터리를 `.gitignore`에 추가해야 합니다.

아직 하지 않았다면 [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)를 설치하고 로그인해야 합니다:

```sh
npm i -D wrangler
wrangler login
```

그런 다음 앱을 빌드하고 배포할 수 있습니다:

```sh
wrangler deploy
```

## 런타임 API <!-- Runtime APIs -->

[`env`](https://developers.cloudflare.com/workers/runtime-apis/fetch-event#parameters) 객체에는 KV/DO 네임스페이스 등으로 이루어진 프로젝트의 [바인딩](https://developers.cloudflare.com/workers/runtime-apis/bindings/)이 들어 있습니다. 이 객체는 [`ctx`](https://developers.cloudflare.com/workers/runtime-apis/context/), [`caches`](https://developers.cloudflare.com/workers/runtime-apis/cache/), [`cf`](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties)와 함께 `platform` 속성을 통해 SvelteKit에 전달되므로, 훅과 엔드포인트에서 접근할 수 있습니다:

```js
// @filename: ambient.d.ts
import { DurableObjectNamespace } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env: {
				YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			};
		}
	}
}
// @filename: +server.js
// ---cut---
// @errors: 2355 2322
/// file: +server.js
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

> [!NOTE] 환경 변수에는 SvelteKit에 내장된 [`$app/env/*` 모듈](environment-variables)을 우선 사용하세요.

이 타입을 앱에서 사용할 수 있게 하려면 [`@cloudflare/workers-types`](https://www.npmjs.com/package/@cloudflare/workers-types)를 설치하고 `src/app.d.ts`에서 참조하세요:

```ts
/// file: src/app.d.ts
+++import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';+++

declare global {
	namespace App {
		interface Platform {
+++			env?: {
				YOUR_KV_NAMESPACE: KVNamespace;
				YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			};+++
		}
	}
}

export {};
```

### 로컬에서 테스트하기 <!-- Testing Locally -->

`platform` 속성에 있는 Cloudflare Workers 전용 값은 dev 모드와 preview 모드에서 에뮬레이션됩니다. 로컬 [바인딩](https://developers.cloudflare.com/workers/wrangler/configuration/#bindings)은 [Wrangler 설정 파일](https://developers.cloudflare.com/workers/wrangler/)을 바탕으로 만들어지며, 개발과 미리 보기 중에 `platform.env`를 채우는 데 쓰입니다. 바인딩 설정을 바꾸려면 어댑터 설정의 [`platformProxy` 옵션](#Options-platformProxy)을 사용하세요.

빌드를 테스트하려면 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 4 버전을 사용해야 합니다. 사이트를 빌드한 뒤 `wrangler dev`를 실행하세요.

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

Cloudflare Workers에서는 `fs`를 사용할 수 없습니다. 해당 라우트는 [프리렌더링](page-options#prerender)해야 합니다.
