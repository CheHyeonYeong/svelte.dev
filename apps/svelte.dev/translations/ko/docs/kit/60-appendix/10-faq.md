---
title: 자주 묻는 질문
---

## 다른 자료 <!-- Other resources -->

Svelte와 `vite-plugin-svelte`에서 비롯된 질문에 대한 답은 [Svelte FAQ](../svelte/faq)와 [`vite-plugin-svelte` FAQ](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md)도 참고하세요.

## SvelteKit으로 무엇을 만들 수 있나요? <!-- What can I make with SvelteKit? -->

자세한 내용은 [프로젝트 유형에 관한 문서](project-types)를 참고하세요.

## SvelteKit은 어떤 브라우저를 지원하나요? <!-- Which browsers does SvelteKit support? -->

SvelteKit의 클라이언트 런타임은 [Vite의 기본 `build.target`](https://vite.dev/config/build-options#build-target)인 `'baseline-widely-available'`과 같은 브라우저를 대상으로 합니다. Vite 8에서는 Chrome 111, Edge 111, Firefox 114, Safari 16.4 이상을 뜻합니다.

클라이언트 런타임에는 폴리필이 들어 있지 않습니다. `build.target`을 더 낮게 설정해도 문법 변환 방식만 바뀔 뿐 없는 API가 추가되지는 않으므로, 오래된 브라우저를 지원해야 한다면 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 등으로 폴리필을 직접 추가해야 합니다.

[서비스 워커](service-workers)는 `type: 'module'`로 등록되므로, 모듈 서비스 워커를 지원하지 않는 브라우저에서는 등록되지 않습니다.

## package.json의 정보를 애플리케이션에 포함하려면 어떻게 하나요? <!-- How do I include details from package.json in my application? -->

애플리케이션의 버전 번호나 `package.json`의 다른 정보를 애플리케이션에 포함하고 싶다면, 다음과 같이 JSON을 로드할 수 있습니다:

```ts
// @errors: 2732
/// file: vite.config.js
import pkg from './package.json' with { type: 'json' };
```

## 패키지를 포함하려고 할 때 나는 에러는 어떻게 고치나요? <!-- How do I fix the error I'm getting trying to include a package? -->

라이브러리 포함과 관련된 문제는 대부분 잘못된 패키징 때문입니다. 라이브러리의 패키징이 Node.js와 호환되는지는 [publint 웹사이트](https://publint.dev/)에 입력해서 확인할 수 있습니다.

라이브러리가 올바르게 패키징되었는지 확인할 때 염두에 둘 점은 다음과 같습니다:

- `exports`는 `main`이나 `module` 같은 다른 진입점 필드보다 우선합니다. `exports` 필드를 추가하면 깊은 import를 막기 때문에 하위 호환성이 깨질 수 있습니다.
- `"type": "module"`이 설정되어 있지 않다면 ESM 파일은 `.mjs`로 끝나야 하고, 설정되어 있다면 CommonJS 파일이 `.cjs`로 끝나야 합니다.
- `exports`가 정의되어 있지 않다면 `main`을 정의해야 합니다. `main`은 CommonJS 또는 ESM 파일이어야 하며 앞의 항목을 따라야 합니다. `module` 필드를 정의했다면 ESM 파일을 가리켜야 합니다.
- Svelte 컴포넌트는 컴파일하지 않은 `.svelte` 파일로 배포해야 하며, 패키지 안의 JS는 ESM으로만 작성해야 합니다. TypeScript나 SCSS 같은 사용자 정의 스크립트·스타일 언어는 각각 순수 JS와 CSS로 전처리해야 합니다. Svelte 라이브러리를 패키징할 때는 이 작업을 대신해 주는 [`svelte-package`](./packaging)를 사용하길 권합니다.

라이브러리가 ESM 버전을 배포하면, 특히 Svelte 컴포넌트 라이브러리의 의존성인 경우에 Vite와 함께 브라우저에서 가장 잘 동작합니다. 라이브러리 작성자에게 ESM 버전을 제공해 달라고 제안해 볼 수도 있습니다. 하지만 기본적으로 [`vite-plugin-svelte`가 Vite에 이들을 사전 번들링하도록 요청](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies)해 `rolldown`으로 ESM으로 변환하므로, CommonJS(CJS) 의존성도 잘 동작할 것입니다.

그래도 문제가 계속된다면 [Vite 이슈 트래커](https://github.com/vitejs/vite/issues)와 해당 라이브러리의 이슈 트래커를 모두 검색해 보길 권합니다. [`optimizeDeps`](https://vitejs.dev/config/#dep-optimization-options)나 [`ssr`](https://vitejs.dev/config/#ssr-options) 설정 값을 조정해 문제를 우회할 수 있는 경우도 있지만, 이는 단기적인 해결책으로만 쓰고 해당 라이브러리를 고치는 쪽을 권합니다.

## 뷰 트랜지션 API는 어떻게 사용하나요? <!-- How do I use the view transitions API? -->

SvelteKit에는 [뷰 트랜지션](https://developer.chrome.com/docs/web-platform/view-transitions/)과의 특별한 통합 기능이 없지만, [`onNavigate`]($app-navigation#onNavigate)에서 `document.startViewTransition`을 호출하면 모든 클라이언트 사이드 내비게이션에서 뷰 트랜지션을 실행할 수 있습니다.

```js
// @errors: 2339 2810
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
	if (!document.startViewTransition) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

자세한 내용은 Svelte 블로그의 ["Unlocking view transitions"](/blog/view-transitions)를 참고하세요.

## 데이터베이스는 어떻게 설정하나요? <!-- How do I set up a database? -->

데이터베이스를 조회하는 코드는 [서버 라우트](./routing#server)에 두세요. .svelte 파일에서 데이터베이스를 조회하면 안 됩니다. 연결을 즉시 설정하고 클라이언트를 싱글턴으로 앱 전체에서 쓸 수 있게 하는 `db.js` 같은 파일을 만들 수 있습니다. 한 번만 실행할 설정 코드는 `hooks.server.js`에서 실행하고, 데이터베이스 헬퍼가 필요한 엔드포인트에서 import하면 됩니다.

[Svelte CLI](/docs/cli/overview)를 사용하면 데이터베이스 통합을 자동으로 설정할 수 있습니다.

## `document`나 `window`에 접근하는 클라이언트 사이드 라이브러리는 어떻게 사용하나요? <!-- How do I use a client-side library accessing `document` or `window`? -->

`document`나 `window` 변수에 접근해야 하거나, 그 밖에 코드를 클라이언트 사이드에서만 실행해야 한다면 `browser` 검사로 감쌀 수 있습니다:

```js
/// <reference types="@sveltejs/kit" />
// ---cut---
import { browser } from '$app/env';

if (browser) {
	// client-only code here
}
```

컴포넌트가 DOM에 처음 렌더링된 뒤에 코드를 실행하고 싶다면 `onMount`에서 실행할 수도 있습니다:

```js
// @filename: ambient.d.ts
// @lib: ES2015
declare module 'some-browser-only-library';

// @filename: index.js
// ---cut---
import { onMount } from 'svelte';

onMount(async () => {
	const { method } = await import('some-browser-only-library');
	method('hello world');
});
```

사용하려는 라이브러리에 부수 효과가 없다면 정적으로 import해도 됩니다. 서버 사이드 빌드에서는 트리 셰이킹으로 제거되고, `onMount`는 자동으로 아무 일도 하지 않는 함수로 바뀝니다:

```js
// @filename: ambient.d.ts
// @lib: ES2015
declare module 'some-browser-only-library';

// @filename: index.js
// ---cut---
import { onMount } from 'svelte';
import { method } from 'some-browser-only-library';

onMount(() => {
	method('hello world');
});
```

마지막으로 `{#await}` 블록을 사용하는 것도 고려해 볼 수 있습니다:
```svelte
<!--- file: index.svelte --->
<script>
	import { browser } from '$app/env';

	const promise = browser
		? import('./BrowserComponent.svelte')
		: import('./ServerComponent.svelte');
</script>

{#await promise}
	<p>Loading...</p>
{:then module}
	<module.default />
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
```

## 다른 백엔드 API 서버는 어떻게 사용하나요? <!-- How do I use a different backend API server? -->

[`event.fetch`](./load#Making-fetch-requests)로 외부 API 서버에 데이터를 요청할 수 있지만, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)를 다뤄야 한다는 점에 유의하세요. 대개 요청에 프리플라이트가 필요해 지연 시간이 늘어나는 등 복잡한 문제가 생깁니다. 별도의 서브도메인으로 보내는 요청도 추가 DNS 조회, TLS 설정 등으로 지연 시간이 늘어날 수 있습니다. 이 방법을 쓰고 싶다면 [`handleFetch`](./hooks#handleFetch)가 도움이 될 것입니다.

다른 방법은 프록시를 설정해 CORS 문제를 피하는 것입니다. 프로덕션에서는 `/api` 같은 경로를 API 서버로 다시 쓰고(rewrite), 로컬 개발에서는 Vite의 [`server.proxy`](https://vitejs.dev/config/server-options.html#server-proxy) 옵션을 사용하면 됩니다.

프로덕션에서 rewrite를 설정하는 방법은 배포 플랫폼에 따라 다릅니다. rewrite를 쓸 수 없다면 대신 [API 라우트](./routing#server)를 추가할 수 있습니다:

```js
/// file: src/routes/api/[...path]/+server.js
/** @type {import('./$types').RequestHandler} */
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```

(필요에 따라 `POST`/`PATCH` 등의 요청도 프록시하고 `request.headers`도 전달해야 할 수 있습니다.)

## 미들웨어는 어떻게 사용하나요? <!-- How do I use middleware? -->

`@sveltejs/adapter-node`는 프로덕션 모드에서 여러분의 서버와 함께 쓸 수 있는 미들웨어를 빌드합니다. 개발 중에는 Vite 플러그인을 사용해 Vite에 미들웨어를 추가할 수 있습니다. 예를 들면:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

+++/** @type {import('vite').Plugin} */
const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Got request ${req.url}`);
			next();
		});
	}
};+++

export default defineConfig({
	plugins: [
		+++myPlugin,+++
		sveltekit({
			adapter: adapter()
		})
	]
});
```

순서를 제어하는 방법 등 자세한 내용은 [Vite의 `configureServer` 문서](https://vitejs.dev/guide/api-plugin.html#configureserver)를 참고하세요.

## Yarn은 어떻게 사용하나요? <!-- How do I use Yarn? -->

### Yarn 2에서도 동작하나요? <!-- Does it work with Yarn 2? -->

어느 정도는요. 'pnp'라고도 하는 Plug'n'Play 기능은 제대로 동작하지 않습니다(Node 모듈 해석 알고리즘에서 벗어나 있고, SvelteKit이 사용하는 — 그리고 [점점 더 많은 패키지](https://github.com/wooorm/npm-esm-vs-cjs)가 사용하는 — 네이티브 JavaScript 모듈과 [아직 함께 동작하지 않습니다](https://github.com/yarnpkg/berry/issues/638)). [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) 파일에서 `nodeLinker: 'node-modules'`를 사용해 pnp를 끌 수도 있지만, 그냥 npm이나 [pnpm](https://pnpm.io/)을 쓰는 편이 더 쉬울 것입니다. pnpm은 비슷하게 빠르고 효율적이면서도 호환성 문제가 없습니다.

### Yarn 3에서는 어떻게 사용하나요? <!-- How do I use with Yarn 3? -->

현재 최신 Yarn(버전 3)의 ESM 지원은 [실험적](https://github.com/yarnpkg/berry/pull/2161)인 것으로 간주됩니다.

결과는 다를 수 있지만 아래 방법은 동작하는 것으로 보입니다. 먼저 새 애플리케이션을 만듭니다:

```sh
yarn create svelte myapp
cd myapp
```

그리고 Yarn Berry를 활성화합니다:

```sh
yarn set version berry
yarn install
```

Yarn Berry의 흥미로운 기능 중 하나는 프로젝트마다 디스크에 여러 사본을 두는 대신 패키지를 위한 전역 캐시 하나를 둘 수 있다는 것입니다. 하지만 `enableGlobalCache`를 true로 설정하면 빌드가 실패하므로, `.yarnrc.yml` 파일에 다음을 추가하길 권합니다:

```yaml
nodeLinker: node-modules
```

이렇게 하면 패키지가 로컬 node_modules 디렉터리에 다운로드되지만 위의 문제를 피할 수 있으며, 현재로서는 Yarn 버전 3을 사용하는 가장 좋은 방법입니다.
