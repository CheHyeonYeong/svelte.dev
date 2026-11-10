---
title: SvelteKit v3로 마이그레이션하기
---

SvelteKit 3은 일부 레거시 기능을 제거하고, 설정을 `svelte.config.js`에서 Vite 플러그인으로 옮기며, 일부 의존성의 최소 버전을 올립니다. 이런 호환성이 깨지는 변경 중 상당수는 자동으로 마이그레이션할 수 있습니다:

```bash
npx sv migrate sveltekit-3
```

3.0으로 업그레이드하기 전에 최신 2.x 버전으로 먼저 업그레이드해서, 해당 부분을 짚어 주는 지원 중단 경고를 활용하길 권합니다.

## 업데이트된 의존성 <!-- Updated dependencies -->

SvelteKit 3에는 다음 최소 버전이 필요합니다:

- Node v22.17
- TypeScript v6
- Svelte v5.57.1
- Vite v8.0.12 (안정 버전 `rolldown` v1을 번들로 포함한 첫 Vite 8 릴리스)
- `@sveltejs/vite-plugin-svelte` v7

`package.json`의 버전을 업데이트하고 패키지 매니저의 설치 명령을 실행하세요.

## 설정 <!-- Configuration -->

### svelte.config.js를 더 이상 지원하지 않음 <!-- svelte.config.js is no longer supported -->

이제 프로젝트 설정을 `svelte.config.js`에 선언하는 대신 `vite.config.js`의 `sveltekit` Vite 플러그인에 전달해야 합니다. 이전에 `config.kit.*` 아래에 있던 옵션은 이제 `compilerOptions` 같은 옵션과 나란히 최상위 플러그인 옵션이 됩니다:

```js
// @errors: 2307 ignore adapter auto types missing
/// file: vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';

export default defineConfig({
	plugins: [
+++		sveltekit({
			compilerOptions: { experimental: { async: true }},
			adapter: adapter()
		})+++
	]
});
```

더 많은 예제는 [설정 문서](@sveltejs-kit-vite)를 참고하세요.

### 제거된 옵션 <!-- Removed options -->

다음 옵션은 더 이상 쓰이지 않으므로 `vite.config.js`에서 제거해야 합니다:

- `files.lib` ([자세히](#$lib-is-now-lib))
- `experimental.handleRenderingErrors`는 더 이상 필요하지 않습니다 ([자세히](#Error-handling-Rendering-errors-are-now-handled))
- `experimental.instrumentation`은 더 이상 필요하지 않습니다 ([자세히](#Observability))
- `experimental.tracing`은 이제 최상위 `tracing` 옵션입니다 ([자세히](#Observability))
- `vitePlugin`은 제거되었습니다. `inspector` 같은 `vite-plugin-svelte` 옵션은 대신 플러그인에 직접 전달하세요
- `preloadStrategy`는 제거되었습니다. 이제 `modulepreload`가 모든 곳에서 지원되므로 항상 사용됩니다
- `prerender.origin`은 제거되고 `paths.origin`으로 대체되었습니다
- `csrf.checkOrigin`은 제거되고 `csrf.trustedOrigins`로 대체되었습니다

### 추가된 옵션 <!-- Added options -->

- `output.linkHeaderPreload`는 렌더링된 HTML에 `<link>` 요소를 삽입하는 대신 `Link` HTTP 헤더를 사용해 `.js`와 `.css` 파일 같은 리소스를 프리로드할지 결정합니다. 헤더가 너무 커지면 문제가 생길 수 있으므로, SvelteKit 3은 기본적으로 대신 `<link>` 요소를 사용합니다.
- `csrf.trustedOrigins`로 폼 제출이 허용되는 외부 출처를 지정할 수 있습니다.
- `paths.origin`은 `prerender.origin`을 대체하며, 요청 헤더에서 앱의 공개 출처를 안정적으로 알아낼 수 없는 경우(예: 리버스 프록시 뒤에 있는 경우) 그 출처를 반영해야 합니다. 폼 제출과 원격 함수 호출의 CSRF 검사에 사용됩니다. `adapter-node`를 사용한다면 이 옵션이 `ORIGIN` 환경 변수를 대체합니다.

### 변경된 옵션 <!-- Changed options -->

- `version.pollInterval`의 기본값이 이제 1시간입니다. 즉 SvelteKit이 주기적으로 새 배포를 확인하고 그에 따라 [`updated.current`]($app-state#updated)를 `true`로 설정합니다. 이전에는 기본적으로 폴링하지 않았습니다.

## `$lib`는 이제 `#lib` <!-- `$lib` is now `#lib` -->

SvelteKit은 더 이상 `$lib` 별칭을 자동으로 생성하지 않습니다. 대신 `package.json`의 [`imports`](https://nodejs.org/api/packages.html#subpath-imports) 필드에 직접 선언하는 `#lib` 별칭을 사용하며, 이는 Node의 내장 하위 경로 import(Vite와 TypeScript가 기본으로 해석합니다)를 활용합니다. `package.json`에 다음을 추가하고...

```json
/// file: package.json
{
	"imports": {
		"#lib": "./src/lib/index.js",
		"#lib/*": "./src/lib/*"
	}
}
```

...코드베이스 전체에서 `$lib`를 `#lib`로 바꾸세요. 이 import에는 모듈 확장자(예: `.js`나 `.ts`)도 붙여야 한다는 점에 유의하세요.

```js
// @errors: 2307 imported module has no types
---import { foo } from '$lib/foo';---
+++import { foo } from '#lib/foo.js';+++
```

## `$app/environment` (이름 변경) <!-- `$app/environment` (renamed) -->

`$app/environment` 모듈의 이름이 [`$app/env`]($app-env)로 바뀌었습니다. 이제 서비스 워커 안에서도 import할 수 있습니다. 이전에는 `version`에 접근하려면 지금은 제거된 [`$service-worker`](<#$service-worker-(removed)>) 모듈을 사용해야 했습니다.

## `$app/forms`

[`use:enhance`]($app-forms#enhance)를 사용하는 폼이 다른 페이지의 `action`을 지정하면, 제출 후 현재 페이지에 머무르지 않고 그 페이지로 이동합니다. 이로써 향상된 동작이 향상되지 않은 네이티브 동작과 더 가까워집니다.

## `$app/manifest`

새로운 [`$app/manifest`]($app-manifest) 모듈로 앱의 메타데이터에 접근할 수 있습니다. 이 모듈은 앱의 어디서든 import할 수 있으며, 오프라인 캐싱을 위해 서비스 워커에서도 쓸 수 있습니다. 이전에는 이런 용도로 지금은 제거된 [`$service-worker`](<#$service-worker-(removed)>) 모듈을 사용해야 했습니다.

## `$app/navigation`

### 얕은 라우팅 변경 사항 <!-- Changes to shallow routing -->

[얕은 라우팅](shallow-routing)에서 `pushState/replaceState`는 지원 중단되고 [`goto`]($app-navigation#goto)로 대체되었습니다:

```js
const state = {};
import { goto } from '$app/navigation';
// ---cut---
// instead of this...
---pushState('/foo', state);---
---replaceState('/bar', state);---

// ...do this:
+++goto('/foo', { shallow: true, state });+++
+++goto('/bar', { shallow: true, replace: true, state });+++
```

새 `persistState: true` 옵션을 사용하면 페이지를 새로 고친 뒤에도 `page.state`가 다시 적용됩니다.

이제 얕은 라우팅도 내비게이션 훅([`beforeNavigate`]($app-navigation#beforeNavigate), [`onNavigate`]($app-navigation#onNavigate), [`afterNavigate`]($app-navigation#afterNavigate))을 실행합니다. 이 내비게이션 훅에 전달되는 객체의 `shallow` 속성을 확인해 걸러 낼 수 있습니다.

### `invalidateAll`은 지원 중단되고 `refreshAll`로 대체 <!-- `invalidateAll` is deprecated in favour of `refreshAll` -->

`invalidateAll`은 지원 중단되고 [`refreshAll`]($app-navigation#refreshAll)로 대체되었습니다. 차이점은 `refreshAll`은 `page.state`를 빈 객체로 초기화하지 _않는다는_ 것인데, [얕은 라우팅](shallow-routing)을 사용할 때는 대개 이쪽이 원하는 동작입니다.

또한 내비게이션이 진행 중일 때 `invalidateAll()`이나 `invalidate(...)`를 호출해도 더 이상 그 내비게이션이 중단되지 않습니다.

### `goto` 옵션 업데이트 <!-- `goto` options are updated -->

[위에서](#$app-navigation-Changes-to-shallow-routing) 설명한 새 `shallow` 옵션 외에도, 여러 [`goto`]($app-navigation#goto) 옵션이 바뀌었습니다:

- [위의 변경](#$app-navigation-invalidateAll-is-deprecated-in-favour-of-refreshAll)에 맞춰 `invalidateAll`은 이제 `refreshAll`입니다
- `keepFocus: true`와 `noScroll: true`는 `reset: false`로 합쳐졌습니다
- `replaceState`는 이제 `replace`입니다

### 라우트로 해석되지 않는 URL에서 `goto`가 reject됨 <!-- `goto` rejects for URLs that don't resolve to a route -->

이제 `goto(...)`는 앱 안의 라우트로 해석되지 않는 URL로 호출하면 reject되며, 이는 외부 URL에 대한 기존 동작과 같습니다. 외부 URL로 이동하려면 `window.location.href = url`을 사용하세요.

### `delta`는 `popstate` 내비게이션에만 존재 <!-- `delta` only exists for `popstate` navigations -->

내비게이션 이벤트([`beforeNavigate`]($app-navigation#beforeNavigate), [`onNavigate`]($app-navigation#onNavigate), [`afterNavigate`]($app-navigation#afterNavigate))의 `delta` 속성은 이제 `popstate` 내비게이션(뒤로/앞으로)에만 존재합니다. 다른 모든 내비게이션 유형에서는 `undefined`입니다.

### `preloadData`가 `error` 결과를 반환할 수 있음 <!-- `preloadData` can return an `error` result -->

이제 `preloadData(...)`는 대상 페이지 로드에 실패하면 200 상태와 함께 `{ type: 'loaded' }`를 반환하는 대신 `{ type: 'error', status, error }`를 반환합니다. `'redirect'` 결과에도 이제 올바른 `status`가 포함됩니다. 결과를 사용하는 코드에 `error` 분기를 추가하세요:

```js
import { preloadData } from '$app/navigation';
const url = '/somewhere';
// ---cut---
const result = await preloadData(url);

if (result.type === 'loaded') {
	// ...
+++} else if (result.type === 'error') {
	// do something in case of an error
}+++
```

## `$app/paths`

### `base`, `assets`, `resolveRoute` 제거 <!-- `base`, `assets`, and `resolveRoute` removed -->

지원 중단되었던 `base`, `assets`, `resolveRoute` export가 [`$app/paths`]($app-paths)에서 제거되었습니다. 대신 [`asset`]($app-paths#asset)과 [`resolve`]($app-paths#resolve)를 사용하세요:

```js
let base = '';
let assets = '';
let slug = '';
import { asset, resolve } from '$app/paths';
// ---cut---
// instead of this...
---const pathname = base + resolveRoute('/blog/[slug]', { slug });---
---const file = assets + '/foo.png';---

// ...do this:
+++const pathname = resolve('/blog/[slug]', { slug });+++
+++const file = asset('foo.png');+++
```

`Pathname`과 `Asset` 타입의 이름도 `Path`와 `AssetPath`로 바뀌었고, 이 타입에서 맨 앞의 `/`가 제거되었습니다. 따라서 `asset('/foo.png')`는 이제 `asset('foo.png')`로 써야 하며, `resolve`에 전달하는 경로 이름은 더 이상 `/`로 시작하지 않습니다(예: `resolve('blog/hello-world')`). 이제 `/`로 시작하는 것은 라우트 ID뿐입니다.

### 서비스 워커에서 `$app/paths`를 import할 수 있음 <!-- Service workers can now import `$app/paths` -->

이전에는 지금은 제거된 [`$service-worker`](<#$service-worker-(removed)>) 모듈에서 `base`를 import해야 했습니다. 이제는 `$app/paths`의 [`asset(...)`]($app-paths#asset)과 [`resolve(...)`]($app-paths#resolve)를 사용할 수 있습니다.

## `$app/service-worker`

새로운 [`$app/service-worker`]($app-service-worker)는 `src/service-worker/index.ts`에서 서비스 워커 실행 컨텍스트에 타입 안전하게 접근할 수 있게 해 줍니다. 단, [`$app/tsconfig/service-worker`](#$app-tsconfig-service-worker)를 확장하는 `src/service-worker/tsconfig.json`이 있어야 합니다.

## `$app/state`

### `page.url`은 이제 읽기 전용 <!-- `page.url` is now readonly -->

이제 `page.url`의 타입은 `ReadonlyURLSearchParams`를 가진 `ReadonlyURL`이므로, `page.url.searchParams.set(...)`을 호출하거나 `page.url.pathname`에 값을 할당하는 등 이를 변경하면 타입 에러가 납니다. 변경 가능한 URL이 필요하다면 먼저 복사하세요:

```js
const url = +++new URL(page.url.href);+++
url.searchParams.set('q', 'svelte');
```

### `updated`가 자동으로 업데이트됨 <!-- `updated` updates automatically -->

`updated.current` 속성은 SvelteKit이 앱의 새 버전이 배포되었음을 감지하면 `true`가 됩니다. 이전에는 `updated.check()`를 직접 호출하거나 내비게이션이 실패한 뒤에만 이런 일이 일어났습니다. SvelteKit 3에서는 더 자주 일어납니다:

- 서버에서 데이터를 가져오게 되는 모든 내비게이션에서
- 모든 원격 함수 호출에서
- 창이 보이게 되거나 포커스를 받을 때(예: 다른 탭에서 돌아올 때)
- 폴링 간격(이제 기본값은 1시간)이 지난 뒤

Vercel의 [스큐 보호(skew protection)](adapter-vercel#Skew-protection) 같은 기능을 사용한다면, 요청이 이전 배포에서 처리되므로 내비게이션과 원격 함수에서의 수동적 감지가 거짓 음성을 보고할 수 있다는 점에 유의하세요. 폴링과 이벤트 기반 검사는 스큐 보호를 우회하므로 여전히 동작합니다.

## `$app/stores` (제거됨) <!-- `$app/stores` (removed) -->

`$app/stores` 모듈(`$page`, `$navigating`, `$updated` 스토어를 내보내던 모듈)이 제거되었습니다. 대신 세분화된 Svelte 5 [상태](../svelte/$state)를 제공하는 [`$app/state`]($app-state)를 사용하고, 값을 읽을 때 `$` 접두사를 제거하세요(즉 `$page` 대신 `page`):

```svelte
<script>
	import { page } from +++'$app/state'+++;
</script>

<p>current pathname: {page.url.pathname}</p>
```

## `$app/tsconfig`

이제 프로젝트의 `tsconfig.json`은 `./.svelte-kit/tsconfig.json` 대신 `$app/tsconfig`를 확장해야 합니다. `$app/tsconfig`는 `include`와 `exclude` 배열을 지정하지 않으므로, 이 배열도 직접 지정해야 합니다:

```json
/// file: tsconfig.json
{
	"extends": "$app/tsconfig",
	"include": ["src", "test", "*"],
	"exclude": ["src/service-worker"]
}
```

몇몇 필수 `compilerOptions`(`isolatedModules`와 `verbatimModuleSyntax`)는 `$app/tsconfig`에 포함되어 있으며, 강력히 권장되지만 여러분의 설정에서 덮어쓸 수 있는 여러 옵션도 함께 들어 있습니다.

## `$app/tsconfig/service-worker`

서비스 워커는 별도의 TypeScript 프로젝트에 속해야 합니다. 그렇지 않으면 `fetch` 이벤트 같은 것의 타입이 올바르지 않게 됩니다. 이를 위해 프로젝트 루트의 `tsconfig.json`에서 서비스 워커를 제외하고, `$app/tsconfig/service-worker`를 확장하는 `src/service-worker/tsconfig.json`을 추가하세요:

```json
/// file: src/service-worker/tsconfig.json
{
	"extends": "$app/tsconfig/service-worker"
}
```

## `$env/...` (지원 중단) <!-- `$env/...` (deprecated) -->

여러 `$env/...` 모듈은 지원 중단되고 `$app/env/private`와 `$app/env/public`으로 대체되었습니다. 자세한 내용은 [환경 변수](environment-variables)를 참고하세요.

## `$service-worker` (제거됨) <!-- `$service-worker` (removed) -->

`$service-worker` 모듈이 제거되었습니다. 대신 `version`은 [`$app/env`]($app-env)에서, `assets`, `immutable`, `prerendered`는 [`$app/manifest`]($app-manifest)에서, `resolved`는 [`$app/paths`]($app-paths)에서 import하세요.

## `@sveltejs/kit`

### `error`, `isHttpError`, `redirect`, `isRedirect`가 공개 타입을 가리킴 <!-- `error`, `isHttpError`, `redirect`, and `isRedirect` refer to public types -->

이제 `error`, `isHttpError`, `redirect`, `isRedirect`는 내부 클래스가 아니라 공개 타입을 가리킵니다. `@sveltejs/kit/internal`에서 내부 `HttpError`/`Redirect` 클래스를 import하거나 이 클래스로 `instanceof` 검사를 하고 있었다면, 대신 `@sveltejs/kit`의 `isHttpError`/`isRedirect`를 사용하세요.

### `json`과 `text` 지원 중단 <!-- `json` and `text` are deprecated -->

응답을 생성하는 `json(...)`과 `text(...)` 헬퍼는 지원 중단되었습니다. 대신 `Response.json(...)`과 `new Response(text)`를 사용하세요.

### `defineParams`가 `@sveltejs/kit/params`로 이동 <!-- `defineParams` moved to `@sveltejs/kit/params` -->

[매개변수 매처](advanced-routing#Matching)를 만드는 `defineParams` 함수와 관련 타입은 이제 [`@sveltejs/kit/params`](@sveltejs-kit-params)에 있습니다.

### 환경 관련 타입이 `@sveltejs/kit/env`로 이동 <!-- Env-related types moved to `@sveltejs/kit/env` -->

[`defineEnvVars`](@sveltejs-kit-env#defineEnvVars) 훅과 함께 쓰는 `EnvVarConfig` 같은 타입은 이제 `@sveltejs/kit/env`에 있습니다.

### 훅 관련 타입이 `@sveltejs/kit/hooks`로 이동 <!-- Hooks-related types moved to `@sveltejs/kit/hooks` -->

[`handle`](hooks#handle) 훅의 타입을 정의하는 `Handle` 같은 타입은 이제 `@sveltejs/kit/hooks`에 있습니다.

### 원격 함수 타입이 `$app/server`로 이동 <!-- Remote function types moved to `$app/server` -->

`RemoteQuery`, `RemoteForm`, `RemoteCommand`처럼 원격 함수를 설명하는 타입은 이제 함수 자체와 함께 `$app/server`에 있습니다.

## `@sveltejs/kit/hooks`

`defineEnvVars` 함수는 `@sveltejs/kit/hooks`에서 `@sveltejs/kit/env`로 옮겨졌습니다.

## `@sveltejs/kit/node`

[`getRequest`](@sveltejs-kit-node#getRequest)와 [`setResponse`](@sveltejs-kit-node#setResponse) 헬퍼는 이제 동기 함수이며 더 이상 프로미스를 반환하지 않습니다. 사용자 정의 Node 서버나 어댑터에서 이 함수들을 호출하는 곳의 `await`를 제거하세요.

## `@sveltejs/kit/node/polyfills` (제거됨) <!-- `@sveltejs/kit/node/polyfills` (removed) -->

`@sveltejs/kit/node/polyfills` 모듈(그리고 `adapter-node`와 `adapter-netlify`의 Node 전역 심)은 더 이상 지원하지 않는 Node 버전을 위한 것이었습니다. 사용자 정의 서버 코드에서 `import '@sveltejs/kit/node/polyfills'` 문을 모두 제거하세요.

## 보안 <!-- Security -->

### `csrf.checkOrigin`이 `csrf.trustedOrigins`로 대체됨 <!-- `csrf.checkOrigin` replaced by `csrf.trustedOrigins` -->

지원 중단되었던 `csrf.checkOrigin` 옵션이 제거되었습니다. CSRF 보호는 항상 켜져 있습니다. `checkOrigin: false`로 끄는 대신 `csrf.trustedOrigins`로 신뢰할 수 있는 교차 출처 호스트를 허용하세요.

```js
/// file: vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
// ---cut---
export default defineConfig({
	plugins: [
		sveltekit({
			csrf: {
				---checkOrigin: false---
				+++trustedOrigins: ['https://trusted-site.com']+++
			}
		})
	]
});
```

### 교차 출처 폼 제출에는 `Content-Type` 헤더가 필요 <!-- Cross-origin form submissions require a `Content-Type` header -->

`Content-Type` 헤더가 없는 교차 출처 변경 요청은 이제 CSRF로 간주되어 거부됩니다. 교차 출처 폼 제출에 `Content-Type` 헤더가 포함되도록 하거나, 해당 출처를 `csrf.trustedOrigins`에 추가하세요.

### 개발 중 정적 에셋의 CORS는 Vite가 처리 <!-- CORS for static assets in development is handled by Vite -->

SvelteKit은 개발 중에 더 이상 모든 정적 에셋 요청에 `access-control-allow-origin: *`을 설정하지 않습니다. 이제 CORS는 Vite의 내장 미들웨어가 맡습니다. 개발 중에 정적 에셋에 대한 교차 출처 접근이 필요하다면 Vite 설정에서 구성하세요:

```js
/// file: vite.config.js
import { defineConfig } from 'vite';
// ---cut---
export default defineConfig({
	server: {
+++		cors: { origin: '*' }+++
	}
});
```

## 쿠키 <!-- Cookies -->

### `cookie` v2로 업데이트 <!-- Updated to `cookie` v2 -->

이제 SvelteKit은 [`cookie`](https://npmx.dev/package/cookie) v2를 사용하며, 이에 따라 몇 가지가 바뀝니다:

- 쿠키 이름에는 ASCII 문자만 쓸 수 있습니다. ASCII가 아닌 문자(`á` 같은 라틴-1 보충 문자 포함)는 거부됩니다
- `CookieSerializeOptions` 타입의 이름이 `SerializeOptions`로 바뀌었습니다
- `CookieParseOptions` 타입의 이름이 `ParseOptions`로 바뀌었습니다

### 경로 기본값은 `'/'` <!-- Paths default to `'/'` -->

명시적인 `path` 없이 쿠키를 설정하면(이전에는 금지되었습니다), 경로의 기본값은 현재 요청 경로가 아니라 `'/'`가 되어 쿠키가 사이트 전체에 적용됩니다. 대부분의 개발자가 기대하는 동작과 같습니다. 필요하다면 명시적으로 `path`를 전달할 수 있습니다:

```ts
declare const cookies: import('@sveltejs/kit').Cookies;
declare const name: string;
declare const value: string;
// ---cut---
cookies.set(name, value, +++{ path: '/some/path' }+++);
```

## 에러 처리 <!-- Error handling -->

### `App.Error`에는 항상 `status`가 포함됨 <!-- `App.Error` always includes `status` -->

`+error.svelte` 컴포넌트의 `error` prop 같은 `App.Error` 객체에는 `message`와 [`app.d.ts`](types#app.d.ts) 파일에서 정의한 속성 외에도, 에러를 일으킨 원인의 HTTP 상태(예: Not Found 에러라면 404, 일반적인 내부 에러라면 500)를 반영하는 `status` 속성이 있습니다.

### `error(...)` 인수 변경 <!-- `error(...)` arguments changed -->

이전에는 [`error(...)`](@sveltejs-kit#error)의 두 번째 인수로 `string` 형태의 `message`나, `message`와 함께 `app.d.ts`에서 정의한 추가 속성(추적용 `code` 등)을 담은 객체를 전달할 수 있었습니다.

이제 두 번째 인수는 항상 `string`이어야 합니다. 추가 속성이 있다면 세 번째 인수로 전달해야 합니다.

### `handleValidationError` 제거 <!-- `handleValidationError` is removed -->

이제 검증 에러는 `kind: 'validation'`과 함께 [`handleError`](hooks#handleError)로 전달됩니다. 일반적인 `{ status, message }` 형태의 `error` 객체는 반환해도 안전하며, 검증 `issues`는 로깅이나 사용자 정의 처리를 위해 따로 제공됩니다.

### `handleError`가 모든 에러를 받음 <!-- `handleError` receives all errors -->

SvelteKit 2에서는 _예상된_ 에러, 즉 [`error(...)`](@sveltejs-kit#error) 헬퍼로 만든 에러의 경우 `handleError`가 호출되지 않았습니다. SvelteKit 3에서는 _모든_ 에러가 `handleError`로 전달됩니다. 자세한 내용은 [문서](hooks#handleError)를 참고하세요.

### `handleError`가 상태 코드에 영향을 줄 수 있음 <!-- `handleError` can influence the status code -->

에러가 났을 때 페이지를 렌더링하는 데 쓰이는 HTTP 상태 코드를 제어해야 한다면, `handleError`에서 `App.Error`의 다른 필수 속성과 함께 `status` 속성을 반환하면 됩니다.

### 이제 렌더링 에러도 처리됨 <!-- Rendering errors are now handled -->

이제 렌더링 중에 throw된 에러는 항상 `handleError`를 거친 뒤 가장 가까운 [에러 바운더리](../svelte/svelte-boundary)로 전달됩니다. 에러 바운더리는 각 `+error.svelte` 컴포넌트마다 자동으로 만들어집니다.

`hooks.client.ts`에 비동기 `handleError` 훅이 있다면, 렌더링 중에 이를 await할 수 있도록 Vite 설정의 `sveltekit(...)` 플러그인 옵션에서 `compilerOptions.experimental.async`를 활성화하세요.

### 폼 액션 응답은 `fail` 상태 코드를 사용 <!-- Form action responses use the `fail` status code -->

이제 향상된 폼 액션 응답은 항상 `200`을 반환하는 대신 `fail(...)`에 전달한 HTTP 상태 코드를 사용합니다. 향상된 폼 제출의 상태 코드를 확인하고 있다면(예: `use:enhance` 콜백이나 테스트에서), 이제 그 값은 `fail`에 전달한 값을 반영합니다.

### 소스 맵 적용 <!-- Sourcemaps are applied -->

소스 맵은 기본으로 생성되며, 에러가 발생하면 스택 트레이스에 적용됩니다. (`vite preview`가 아닌) 프로덕션에서 이것이 동작하려면, 어댑터가 파괴적인 변경(추가로 올바른 소스 맵을 생성하지 않고 다시 번들링하는 것 등)을 피해야 합니다. 공식 어댑터에서는 이 작업이 진행 중입니다.

## 매개변수 <!-- Params -->

[매개변수 매처](advanced-routing#Matching)는 더 이상 `src/params` 디렉터리 안의 파일이 아닙니다. `defineParams` 헬퍼를 사용해 하나의 `src/params.ts`(또는 `src/params.js`) 파일에 모든 매처를 선언하세요. 매처는 파싱된 값(또는 매개변수가 일치하지 않으면 `undefined`)을 반환하는 함수이거나 [Standard Schema](https://standardschema.dev)일 수 있습니다.

```js
/// file: src/params.js
import { defineParams } from '@sveltejs/kit/params';
import * as v from 'valibot';

export const params = defineParams({
	// schema variant
	integer: v.pipe(v.string(), v.toNumber()),

	// function variant
	fruit: (param) => {
		if (param === 'apple' || param === 'orange') {
			return param;
		}
	}
});
```

## 관측 가능성 <!-- Observability -->

이제 `src/instrumentation.server.js` 파일이 있으면 서버 사이드 [계측](observability)이 자동으로 이루어집니다.

[OpenTelemetry](https://opentelemetry.io/) 트레이싱을 사용하려면 `tracing.server` 설정을 추가하세요:

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
/// file: vite.config.js
// ---cut---
export default defineConfig({
	plugins: [
		sveltekit({
			+++tracing: { server: true }+++
		})
	]
});
```

## 어댑터 <!-- Adapters -->

이제 모든 공식 어댑터에는 SvelteKit 3이 필요하며, 어댑터별로 다음과 같은 변경 사항이 있습니다:

### `adapter-cloudflare`

Cloudflare 전용 API는 더 이상 `platform`에서 사용할 수 없습니다. 대신 Cloudflare 워커에서 예상되는 위치에서 찾을 수 있습니다:

- `env`, `ctx.waitUntil`, 그 밖의 `ctx` 속성은 `cloudflare:workers`에서 import해야 합니다:
```js
// @filename: ambient.d.ts
declare module 'cloudflare:workers' {
	export const env: { KV: { get(): Promise<unknown> } };
	export function waitUntil(promise: Promise<any>): void;
}
// ---cut---
import { env, waitUntil } from 'cloudflare:workers';

const value = await env.KV.get('key');
```
- `cf`는 이제 `Request` 객체의 속성입니다:
```js
/// file: src/routes/cf/+server.js
// @filename: ambient.d.ts
interface Request {
  cf: import('@cloudflare/workers-types').IncomingRequestCfProperties;
}
// @filename: index.js
// @errors: 7031
// ---cut---
export async function GET({ request }) {
	const { country } = request.cf;
}
```
- `caches`는 이제 전역 변수입니다:
```js
/// file: src/routes/cache/+server.js
let request = new Request('');
// ---cut---
const myCache = await caches.open('foo');
await myCache.match(request);
```

- 앱에서 이 타입을 사용할 수 있게 하려면 [`wrangler`](https://www.npmjs.com/package/wrangler)를 설치하고 [`wrangler types`](https://developers.cloudflare.com/workers/languages/typescript/)를 실행하세요.

- 이제 최소 `wrangler` 버전은 `^4.67.0`입니다
- `@cloudflare/workers-types`가 업그레이드되었습니다

### `adapter-node`

- 이제 번들링은 `rolldown`으로 합니다
- `ORIGIN` 환경 변수는 제거되었습니다(대신 Vite 설정에서 `paths.origin`을 설정하세요)
- 정적 에셋은 빌드 시점에 기록된 목록을 기준으로 제공됩니다. 그 뒤에 출력 디렉터리에 추가한 파일은 제공되지 않으며, 교체한 파일은 이전 크기와 `ETag`를 그대로 유지합니다(런타임 설정에는 환경 변수를 사용하세요)
- 정적 에셋의 `ETag`는 콘텐츠 해시이며, `Last-Modified`는 더 이상 보내지 않습니다
- 정적 에셋은 `GET`과 `HEAD` 요청에만 제공되며, 다른 메서드는 405 응답을 받습니다

### `adapter-netlify`

- 이제 출력이 안정 버전 [Netlify Frameworks API](https://docs.netlify.com/build/frameworks/frameworks-api/)를 따릅니다
- Netlify CLI로 배포/프리뷰하려면 `v17.31.0` 이상이 필요합니다(`npm i -g netlify-cli@latest`)
- 엣지 함수의 빌드 대상은 `es2022`입니다
- 게시(publish) 디렉터리는 이제 `netlify.toml` 파일에서 읽지 않고 어댑터 옵션으로 지정합니다

### `adapter-vercel`

- `edge` 런타임은 더 이상 지원하지 않습니다

### 어댑터 API 변경 사항 <!-- Adapter API changes -->

어댑터 작성자를 위한 추가 변경 사항이 있습니다:

- 어댑터가 추가 플러그인으로 Vite 설정을 확장할 수 있습니다
- `builder.config.kit`은 더 이상 존재하지 않습니다. 이제 설정은 최상위에 있습니다
- `builder.createEntries`는 제거되었습니다. `builder.writeClient`, `builder.writeServer`, `builder.writePrerendered`를 직접 사용하세요
- `builder.compress`는 압축된 파일 목록을 반환합니다
- `builder.mkdirp`와 `builder.rimraf`는 지원 중단되고 `node:fs` 메서드로 대체되었습니다
- `builder.generateManifest`는 제거되었습니다. 대신 `builder.generateServerInstance`를 사용하고, 매니페스트에 접근하려면 `builder.manifest`를 사용하세요
- 서버 출력에서 내보내는 `Server` 클래스는 지원 중단되었습니다. `builder.generateServerInstance`가 작성하는 `server` 객체를 사용하세요

#### 서버 계측 <!-- Server instrumentation -->

`builder.instrument`를 사용하는 어댑터는 이제 번들링 단계 전에 환경 초기화 모듈을
생성하고, 반환된 모듈을 그 단계의 진입점으로 포함한 뒤, 그 최종 경로를
`builder.instrument`에 전달해야 합니다:

```js
// @filename: ambient.d.ts
import { Builder } from '@sveltejs/kit';

declare global {
	const builder: Builder;
	const temporary_directory: string;
	const entrypoint: string;
	const instrumentation: string;
}

export {};

// @filename: index.js
// ---cut---
const initializer = builder.createInstrumentationInitializer({ outputDirectory: temporary_directory });

// Include `initializer` in any bundling or file tracing here

builder.instrument({
	entrypoint,
	instrumentation,
	initializer
});
```

`process.env`로 환경 변수를 노출하지 않는 런타임이라면, 플랫폼 환경을 default export하는
모듈의 내용을 전달하세요:

```js
// @filename: ambient.d.ts
import { Builder } from '@sveltejs/kit';

declare global {
	const builder: Builder;
	const temporary_directory: string;
}

export {};

// @filename: index.js
// ---cut---
const initializer = builder.createInstrumentationInitializer({
	outputDirectory: temporary_directory,
	environment: `import { env } from 'cloudflare:workers';\nexport default env;`
});
```

## 응답 <!-- Responses -->

### 204 응답은 콘텐츠를 반환하지 않음 <!-- 204 responses return no content -->

이제 `+server.js` 핸들러에서 `204`(또는 본문이 없는 모든 `2xx`) 응답을 반환하면, SvelteKit 봉투(envelope)가 아니라 HTTP 명세에 따라 본문이 없는 응답이 됩니다. 이런 응답의 본문을 사용하던 코드는 빈 본문을 처리해야 합니다.

### `resolve`는 항상 `Promise`를 반환 <!-- `resolve` always returns a `Promise` -->

[`handle`](hooks#handle)에 전달되는 `resolve` 함수의 타입은 이제 `MaybePromise<Response>`가 아니라 항상 `Promise<Response>`를 반환하도록 지정됩니다.

## 서버 전용 모듈 <!-- Server-only modules -->

### 파일 <!-- Files -->

이제 서버 전용 모듈은 `.server.` 중간 이름이 아니라 파일 이름의 `server` 세그먼트로 지정됩니다. 다시 말해 `stuff.server.ts`, `stuff.server.test.ts`, `server.ts`가 모두 서버 전용 모듈로 취급되며, 이전에는 `server.ts`가 서버 전용 모듈이 아니었습니다.

### 디렉터리 <!-- Directories -->

이전에는 `src/lib/server` 안의 모듈만 서버 전용으로 취급했습니다. 이제는 `src/routes`와 `static` 디렉터리를 제외한 프로젝트의 _모든_ `server` 디렉터리에 이 규칙이 적용됩니다.

## 원격 함수 <!-- Remote functions -->

원격 함수는 여전히 실험적 기능으로 간주됩니다. `compilerOptions.experimental.async`와 함께 `experimental.remoteFunctions` 플래그로 활성화하세요:

```js
/// file: vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
// ---cut---
export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				experimental: {
					+++async: true+++
				}
			},
			experimental: {
				+++remoteFunctions: true+++
			}
		})
	]
});
```

### 원격 모듈 파일 이름 <!-- Remote module filenames -->

서버 전용 모듈과 마찬가지로, 파일 이름의 `remote` 세그먼트가 원격 모듈을 나타냅니다. `stuff.remote.ts`, `stuff.remote.test.ts`, `remote.ts`는 모두 원격 모듈입니다.

`experimental.remoteFunctions`가 활성화되어 있지 않으면, 이런 파일이 존재하기만 해도 에러가 납니다.

### 쿼리 안에서 `event.url`, `event.params`, `event.route`에 접근할 수 없음 <!-- `event.url`, `event.params`, and `event.route` cannot be accessed inside queries -->

이제 원격 `query` 함수 안에서 `event.url`, `event.params`, `event.route`에 접근하면 에러가 throw됩니다. 원격 함수는 어디서든 호출될 수 있으므로, 원격 함수의 맥락에서 이 속성들은 의미가 없습니다. 필요한 값은 함수의 인수로 명시적으로 전달하세요.

### 에러의 타입은 `App.Error | undefined` <!-- Errors are typed as `App.Error | undefined` -->

원격 함수 리소스(쿼리, 라이브 쿼리, 폼, 프리렌더 함수)의 `error` 속성 타입은 이제 `any`가 아니라 `App.Error | undefined`입니다. 에러는 항상 `handleError`를 거쳐 변환되기 때문입니다.

### 폼 제출에는 `field.as(...)`가 필요 <!-- Form submissions require `field.as(...)` -->

폼 컨트롤은 현재 `form` 객체와 연결된 필드의 속성을 사용해야 합니다:

```svelte
<input {...myform.fields.message.as('text')}>
```

이름을 직접 지정하면(`<input name="message">`) 제출이 거부됩니다.

## 기타 <!-- Miscellaneous -->

### 현재 페이지로 가는 링크는 새로 고침을 일으킴 <!-- Links to the current page cause a refresh -->

사용자가 현재 위치를 가리키는 링크를 클릭하면, SvelteKit은 아무것도 하지 않는 대신 `refreshAll()`을 실행합니다.

### `data-sveltekit-*`는 `'off'` 대신 `false`를 사용 <!-- `data-sveltekit-*` uses `false` instead of `'off'` -->

`data-sveltekit-*` 링크 속성의 `'off'` 값은 제거되고 `false`로 대체되었습니다.

```svelte
---<a href="..." data-sveltekit-preload-data="off">---
+++<a href="..." data-sveltekit-preload-data="false">+++
```

### 외부 리디렉션은 명시적으로 허용해야 함 <!-- External redirects must be opted into -->

외부 URL로 [`redirect`](@sveltejs-kit#redirect)하려면 이제 `external` 옵션을 전달해야 합니다. 모든 외부 URL을 허용하려면 `true`를(단, `javascript:` URL은 계속 차단됩니다), 아니면 허용할 출처 배열을 전달합니다(이 배열에는 `javascript:` URL을 포함할 _수 있습니다_).

```js
import { redirect } from '@sveltejs/kit';
// ---cut---
redirect(307, 'https://example.com', +++{ external: true }+++);
```

### 유니버설 `config`가 서버 `config`보다 우선 <!-- Universal `config` takes precedence over server `config` -->

이제 유니버설 `+page.js`나 `+layout.js`에서 내보낸 라우트 `config`가 그에 대응하는 `+page.server.js`나 `+layout.server.js`에서 내보낸 `config`보다 우선하며, 이는 다른 페이지 옵션이 결정되는 방식과 같습니다. 두 곳 모두에서 `config`를 내보낸다면, 기준이 되는 export를 유니버설 파일로 옮기거나 둘을 하나로 합치세요.

### 서비스 워커는 `type: 'module'`로 등록됨 <!-- Service worker registrations use `type: 'module'` -->

이제 모듈 서비스 워커가 널리 지원됩니다. 따라서 SvelteKit은 서비스 워커를 스크립트가 아닌 모듈로 번들링하고 등록합니다.
