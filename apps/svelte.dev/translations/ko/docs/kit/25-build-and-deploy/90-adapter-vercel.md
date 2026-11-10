---
title: Vercel
---

Vercel에 배포하려면 [`adapter-vercel`](https://github.com/sveltejs/kit/tree/main/packages/adapter-vercel)을 사용하세요.

이 어댑터는 [`adapter-auto`](adapter-auto)를 사용할 때 기본으로 설치되지만, 프로젝트에 직접 추가하면 Vercel 전용 옵션을 지정할 수 있습니다.

Vercel에서 SvelteKit을 사용해 보고 싶다면 [Vercel SvelteKit 템플릿](https://vercel.com/templates/svelte?search=SvelteKit) 중 하나로 시작할 수 있습니다.

## 사용법 <!-- Usage -->

[`npx sv add sveltekit-adapter="adapter:vercel"`](/docs/cli/sveltekit-adapter)를 실행하거나, `npm i -D @sveltejs/adapter-vercel`로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				// see below for options that can be set here
			})
		})
	]
});
```

## 배포 설정 <!-- Deployment configuration -->

라우트가 Vercel에 함수로 배포되는 방식을 제어하려면 배포 설정을 지정하면 됩니다. 위에 나온 옵션을 쓰거나, `+server.js`, `+page(.server).js`, `+layout(.server).js` 파일 안에서 [`export const config`](page-options#config)를 쓰면 됩니다.

예를 들어 특정 라우트 하나를 앱의 나머지 부분과 분리된 개별 서버리스 함수로 배포할 수 있습니다:

```js
/// file: about/+page.js
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	split: true
};
```

다음 옵션을 설정할 수 있습니다:

- `runtime`: Node 버전(예: `'nodejs22.x'`, `'nodejs24.x'`, `'nodejs26.x'`), `bun1.x` 또는 `bun1.4.x`. 기본적으로 어댑터는 빌드에 사용된 런타임을 선택하며, 이는 [Bun으로 앱을 빌드](https://bun.com/docs/guides/ecosystem/vite)하지 않는 한 Vercel 대시보드에서 프로젝트에 설정된 Node 버전에 해당합니다
- `regions`: [엣지 네트워크 리전](https://vercel.com/docs/concepts/edge-network/regions)의 배열(기본값은 `["iad1"]`). 서버리스 함수에 여러 리전을 쓰는 것은 Enterprise 플랜에서만 지원된다는 점에 유의하세요
- `split`: `true`이면 라우트를 개별 함수로 배포합니다. 어댑터 수준에서 `split`을 `true`로 설정하면 모든 라우트가 개별 함수로 배포됩니다
- `memory`: 함수가 사용할 수 있는 메모리 양. 기본값은 `1024` Mb이며, `128` Mb까지 줄이거나 Pro 또는 Enterprise 계정에서는 64Mb 단위로 최대 `3008` Mb까지 [늘릴](https://vercel.com/docs/concepts/limits/overview#serverless-function-memory) 수 있습니다
- `maxDuration`: 함수의 [최대 실행 시간](https://vercel.com/docs/functions/runtimes#max-duration). 기본값은 Hobby 계정에서 `10`초, Pro에서 `15`초, Enterprise에서 `900`초입니다
- `isr`: Incremental Static Regeneration 설정. 아래에서 설명합니다

레이아웃에 지정한 설정은 더 세부적인 수준에서 덮어쓰지 않는 한 그 레이아웃 아래의 모든 라우트에 적용됩니다.

함수가 특정 리전의 데이터에 접근해야 한다면, 최적의 성능을 위해 같은 리전(또는 가까운 리전)에 배포하는 것을 권장합니다.

## 이미지 최적화 <!-- Image Optimization -->

`images` 설정으로 Vercel이 이미지를 빌드하는 방식을 제어할 수 있습니다. 자세한 내용은 [이미지 설정 레퍼런스](https://vercel.com/docs/build-output-api/v3/configuration#images)를 참고하세요. 예를 들어 다음과 같이 설정할 수 있습니다:

```js
// @errors: 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				images: {
					sizes: [640, 828, 1200, 1920, 3840],
					formats: ['image/avif', 'image/webp'],
					minimumCacheTTL: 300,
					domains: ['example-app.vercel.app'],
				}
			})
		})
	]
});
```

## Incremental Static Regeneration

Vercel은 [Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration)(ISR)을 지원합니다. ISR은 프리렌더링된 콘텐츠의 성능·비용상 이점과 동적으로 렌더링된 콘텐츠의 유연성을 함께 제공합니다.

> [!NOTE] ISR은 모든 방문자가 같은 콘텐츠를 봐야 하는 라우트에서만 사용하세요(프리렌더링할 때와 거의 같습니다). 사용자별로 달라지는 것(세션 쿠키 등)이 있다면, 방문 간에 민감한 정보가 새어 나가지 않도록 클라이언트에서 JavaScript로만 처리해야 합니다

라우트에 ISR을 추가하려면 `config` 객체에 `isr` 속성을 넣으세요:

```js
// @filename: env.d.ts
declare module '$app/env/private' {
	export const BYPASS_TOKEN: string;
}
// @filename: +page.server.js
// ---cut---
import { BYPASS_TOKEN } from '$app/env/private';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

> [!NOTE] `export const prerender = true`인 라우트에서는 빌드 시점에 프리렌더링되므로 ISR을 사용해도 아무 효과가 없습니다

`expiration` 속성은 필수이고, 나머지는 모두 선택 사항입니다. 각 속성은 아래에서 자세히 설명합니다.

### expiration

캐시된 에셋이 서버리스 함수를 호출해 다시 생성되기까지의 만료 시간(초)입니다. 값을 `false`로 설정하면 만료되지 않습니다. 이 경우 필요할 때 다시 생성할 수 있도록 우회 토큰을 정의하는 것이 좋습니다.

### bypassToken

두 가지 용도로 쓸 수 있는 임의의 토큰입니다:

- 초안 모드(Draft mode): 캐시를 우회하므로, 예를 들어 CMS에서 편집 중인 콘텐츠를 실시간으로 볼 수 있습니다. `__prerender_bypass=<token>` 쿠키에 토큰을 담아 보내면 요청 시점에 라우트를 렌더링합니다. 자세한 내용은 [Vercel의 Draft Mode 문서](https://vercel.com/docs/draft-mode?framework=sveltekit)를 참고하세요.
- 재검증(Revalidation): 라우트의 ISR 캐시를 비우고 이후 방문자를 위해 다시 채웁니다. 이렇게 하려면 `x-prerender-revalidate: <token>` 헤더와 함께 `GET` 또는 `HEAD` 요청을 보내세요.

`BYPASS_TOKEN`은 빌드 시점에 저장됩니다. 애플리케이션을 빌드한 뒤에 이 값을 설정하거나 바꾸면 새로 배포해야 합니다.

`BYPASS_TOKEN` 문자열은 32자 이상이어야 합니다. 다음과 같이 JavaScript 콘솔에서 생성할 수 있습니다:

```js
crypto.randomUUID();
```

Vercel에 로그인해 프로젝트의 Settings > Environment Variables로 이동한 뒤 이 문자열을 환경 변수로 설정하세요. "Key"에는 `BYPASS_TOKEN`을, "value"에는 위에서 생성한 문자열을 넣고 "Save"를 누르면 됩니다.

로컬 개발에서도 이 키를 알 수 있게 하려면, [Vercel CLI](https://vercel.com/docs/cli/env)로 다음과 같이 로컬에서 `vercel env pull` 명령을 실행하면 됩니다:

```sh
vercel env pull .env.development.local
```

### allowQuery

캐시 키에 반영되는 유효한 쿼리 매개변수 목록입니다. 다른 매개변수(utm 추적 코드 등)는 무시되므로, 이런 매개변수 때문에 콘텐츠가 불필요하게 다시 생성되지 않습니다. 기본적으로 쿼리 매개변수는 무시됩니다.

> [!NOTE] [프리렌더링](page-options#prerender)된 페이지는 ISR 설정을 무시합니다.

## 환경 변수 <!-- Environment variables -->

Vercel은 [배포별 환경 변수](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)를 제공합니다. 다른 환경 변수와 마찬가지로, `src/env.ts`에 명시적으로 정의하면 `$app/env/private`에서 접근할 수 있습니다. 클라이언트에서 이 변수 중 하나에 접근하려면 다음과 같이 합니다:

```js
/// file: +layout.server.js
// @filename: env.d.ts
declare module '$app/env/private' {
	export const VERCEL_COMMIT_REF: string;
}
// @filename: +layout.server.js
// ---cut---
import { VERCEL_COMMIT_REF } from '$app/env/private';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	return {
		deploymentGitBranch: VERCEL_COMMIT_REF
	};
}
```

```svelte
<!--- file: +layout.svelte --->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data } = $props();
</script>

<p>This staging environment was deployed from {data.deploymentGitBranch}.</p>
```

Vercel에서 빌드할 때는 이 변수들이 빌드 시점과 런타임 사이에 바뀌지 않으므로, `static: true`로 변수를 설정하는 것을 권장합니다. 그러면 변수가 정적으로 치환되어 사용되지 않는 코드 제거(dead code elimination) 같은 최적화가 가능해집니다.

## 버전 차이 보호 <!-- Skew protection -->

앱의 새 버전이 배포되면 이전 버전에 속한 에셋에 더 이상 접근하지 못할 수 있습니다. 이때 사용자가 앱을 사용하고 있었다면 이동할 때 에러가 날 수 있는데, 이를 *버전 차이*(version skew)라고 합니다. SvelteKit은 버전 차이로 인한 에러를 감지하면 강제로 새로고침해 앱의 최신 버전을 가져오는 방식으로 이 문제를 완화하지만, 이렇게 하면 클라이언트 사이드 상태가 모두 사라집니다. (`$app/state`의 [`updated.current`]($app-state#updated)를 관찰해 미리 대응할 수도 있습니다. 이 값은 새 버전이 배포되었을 때 클라이언트에 알려 줍니다.)

[Skew protection](https://vercel.com/docs/deployments/skew-protection)은 클라이언트 요청을 원래 배포로 보내 주는 Vercel 기능입니다. 사용자가 앱을 방문하면 배포 ID가 담긴 쿠키가 설정되고, skew protection이 활성화되어 있는 동안에는 이후의 모든 요청이 그 배포로 라우팅됩니다. 사용자가 페이지를 새로고침하면 최신 배포를 받게 됩니다. (`updated.current`는 이 동작에서 제외되므로 계속해서 새 배포를 알려 줍니다.) 이 기능을 켜려면 Vercel의 프로젝트 설정에서 Advanced 섹션으로 가세요.

쿠키 기반 skew protection에는 한 가지 주의할 점이 있습니다. 사용자가 여러 탭에 앱의 여러 버전을 열어 두었다면, 이전 버전에서 보낸 요청이 새 버전으로 라우팅되므로 SvelteKit에 내장된 버전 차이 보호로 대체됩니다.

## 참고 사항 <!-- Notes -->

### Vercel 유틸리티 <!-- Vercel utilities -->

`waitUntil` 같은 Vercel 전용 유틸리티가 필요하다면 [`@vercel/functions`](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package) 패키지를 사용하세요.

### Vercel 함수 <!-- Vercel functions -->

프로젝트 루트의 `api` 디렉터리에 Vercel 함수가 들어 있다면, `/api/*`에 대한 요청은 SvelteKit이 처리하지 _않습니다_. 대신 이 함수들을 SvelteKit 앱의 [API 라우트](routing#server)로 구현해야 합니다. JavaScript가 아닌 언어를 써야 한다면 예외인데, 이 경우에는 SvelteKit 앱에 `/api/*` 라우트가 하나도 없도록 해야 합니다.

### Node 버전 <!-- Node version -->

특정 날짜 이전에 만든 프로젝트는 기본적으로 SvelteKit이 현재 요구하는 것보다 오래된 Node 버전을 사용할 수 있습니다. [프로젝트 설정에서 Node 버전을 바꿀 수 있습니다](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-version).

### 더 알아보기 <!-- More information -->

Vercel에서 SvelteKit을 사용하는 방법에 대한 자세한 정보는 [Vercel 문서](https://vercel.com/docs/frameworks/full-stack/sveltekit)에서 찾을 수 있습니다.

## 문제 해결 <!-- Troubleshooting -->

### 파일 시스템 접근하기 <!-- Accessing the file system -->

서버리스 함수에서 `node:fs`를 직접 사용하면 프로젝트의 파일이 배포로 복사되지 않으므로 기대한 대로 동작하지 않을 가능성이 큽니다. 대신 `$app/server`의 [`read`]($app-server#read) 함수로 파일에 접근하세요.

또는 해당 라우트를 [프리렌더링](page-options#prerender)할 수도 있습니다.
