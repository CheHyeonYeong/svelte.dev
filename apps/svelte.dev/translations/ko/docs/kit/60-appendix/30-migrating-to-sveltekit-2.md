---
title: SvelteKit v2로 마이그레이션하기
---

SvelteKit 버전 1에서 버전 2로 업그레이드하는 과정은 대부분 매끄러울 것입니다. 주의해야 할 호환성이 깨지는 변경이 몇 가지 있으며, 여기에 정리해 두었습니다. `npx sv migrate sveltekit-2`를 사용하면 이 중 일부를 자동으로 마이그레이션할 수 있습니다.

2.0으로 업그레이드하기 전에 최신 1.x 버전으로 먼저 업그레이드해서, 해당 부분을 짚어 주는 지원 중단 경고를 활용하길 강력히 권합니다. 또한 먼저 [Svelte 4로 업데이트](../svelte/v4-migration-guide)하는 것도 권합니다. SvelteKit 1.x의 후기 버전은 Svelte 4를 지원하며, SvelteKit 2.0은 Svelte 4를 필요로 합니다.

## `redirect`와 `error`를 더 이상 직접 throw하지 않음 <!-- `redirect` and `error` are no longer thrown by you -->

이전에는 `error(...)`와 `redirect(...)`가 반환한 값을 직접 `throw`해야 했습니다. SvelteKit 2에서는 더 이상 그럴 필요가 없으며, 함수를 호출하는 것만으로 충분합니다.

```js
import { error } from '@sveltejs/kit'

// ...
---throw error(500, 'something went wrong');---
+++error(500, 'something went wrong');+++
```

`svelte-migrate`가 이 변경을 자동으로 해 줍니다.

에러나 리디렉션이 `try {...}` 블록 안에서 throw된다면(힌트: 이렇게 하지 마세요!), `@sveltejs/kit`에서 import한 [`isHttpError`](@sveltejs-kit#isHttpError)와 [`isRedirect`](@sveltejs-kit#isRedirect)로 예상치 못한 에러와 구별할 수 있습니다.

## 쿠키를 설정할 때 path가 필수 <!-- path is required when setting cookies -->

`path`를 지정하지 않은 `Set-Cookie` 헤더를 받으면, 브라우저는 [쿠키 경로를](https://www.rfc-editor.org/rfc/rfc6265#section-5.1.4) 해당 리소스의 부모로 설정합니다. 이 동작은 그다지 유용하거나 직관적이지 않고, 개발자는 쿠키가 도메인 전체에 적용되리라 기대하기 때문에 버그로 이어지는 경우가 많습니다.

SvelteKit 2.0부터는 모호함이 없도록 `cookies.set(...)`, `cookies.delete(...)`, `cookies.serialize(...)`를 호출할 때 `path`를 설정해야 합니다. 대부분은 `path: '/'`를 쓰고 싶겠지만, 상대 경로를 포함해 원하는 값으로 설정할 수 있습니다. `''`는 '현재 경로'를, `'.'`는 '현재 디렉터리'를 뜻합니다.

```js
/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	cookies.set(name, value, +++{ path: '/' }+++);
	return { response }
}
```

`svelte-migrate`가 수정이 필요한 위치를 표시하는 주석을 추가해 줍니다.

## 최상위 프로미스를 더 이상 기다리지 않음 <!-- Top-level promises are no longer awaited -->

SvelteKit 버전 1에서는 `load` 함수가 반환한 객체의 최상위 속성이 프로미스이면 자동으로 await했습니다. [스트리밍](/blog/streaming-snapshots-sveltekit)이 도입되면서 이 동작은 스트리밍할 데이터를 한 단계 깊이 중첩하도록 강제하기 때문에 다소 어색해졌습니다.

버전 2부터 SvelteKit은 최상위 프로미스와 그렇지 않은 프로미스를 더 이상 구별하지 않습니다. 기존처럼 블로킹 동작을 원한다면 `await`를 사용하세요(적절한 경우 워터폴을 막기 위해 `Promise.all`과 함께):

```js
// @filename: ambient.d.ts
declare const url: string;

// @filename: index.js
// ---cut---
// If you have a single promise
/** @type {import('./$types').PageServerLoad} */
export +++async+++ function load({ fetch }) {
	const response = +++await+++ fetch(url).then(r => r.json());
	return { response }
}
```

```js
// @filename: ambient.d.ts
declare const url1: string;
declare const url2: string;

// @filename: index.js
// ---cut---
// If you have multiple promises
/** @type {import('./$types').PageServerLoad} */
export +++async+++ function load({ fetch }) {
---	const a = fetch(url1).then(r => r.json());---
---	const b = fetch(url2).then(r => r.json());---
+++	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json()),
	]);+++
	return { a, b };
}
```

## goto(...) 변경 사항 <!-- goto(...) changes -->

`goto(...)`는 더 이상 외부 URL을 받지 않습니다. 외부 URL로 이동하려면 `window.location.href = url`을 사용하세요. 이제 `state` 객체가 `$page.state`를 결정하며, `App.PageState` 인터페이스가 선언되어 있다면 이를 따라야 합니다. 자세한 내용은 [얕은 라우팅](shallow-routing)을 참고하세요.

## 경로가 이제 기본적으로 상대 경로 <!-- paths are now relative by default -->

SvelteKit 1에서는 [`paths.relative`](@sveltejs-kit-vite#paths) 설정 옵션을 명시적으로 `false`로 설정하지 않는 한, 서버 사이드 렌더링 중에 `app.html`의 `%sveltekit.assets%`가 기본적으로 상대 경로(렌더링되는 경로에 따라 `.`, `..`, `../..` 등)로 바뀌었습니다. `$app/paths`에서 import한 `base`와 `assets`도 마찬가지였지만, 이쪽은 `paths.relative` 옵션을 명시적으로 `true`로 설정한 경우에만 그랬습니다.

이 불일치는 버전 2에서 고쳐졌습니다. 이제 경로는 [`paths.relative`](@sveltejs-kit-vite#paths) 값에 따라 항상 상대 경로이거나 항상 절대 경로입니다. 기본값은 `true`인데, 이쪽이 앱의 이식성을 높이기 때문입니다. `base`가 앱이 예상한 것과 다르거나(예: [Internet Archive](https://archive.org/)에서 볼 때) 빌드 시점에 알 수 없는 경우(예: [IPFS](https://ipfs.tech/) 등에 배포할 때)에도 깨지는 부분이 더 적습니다.

## 서버 fetch를 더 이상 추적할 수 없음 <!-- Server fetches are not trackable anymore -->

이전에는 load 함수를 다시 실행하기 위해 서버에서 `fetch`한 URL을 추적할 수 있었습니다. 이는 보안 위험(비공개 URL 유출)이 될 수 있어서 `dangerZone.trackServerFetches` 설정 뒤에 숨겨져 있었는데, 이제 이 설정은 제거되었습니다.

## `preloadCode` 인수에는 `base`를 앞에 붙여야 함 <!-- `preloadCode` arguments must be prefixed with `base` -->

SvelteKit은 특정 경로와 관련된 코드와 데이터를 코드로 로드하는 [`preloadCode`]($app-navigation#preloadCode)와 [`preloadData`]($app-navigation#preloadData) 두 함수를 제공합니다. 버전 1에는 미묘한 불일치가 있었습니다. `preloadCode`에 전달하는 경로에는 (설정된 경우) `base` 경로를 앞에 붙일 필요가 없었지만, `preloadData`에 전달하는 경로에는 붙여야 했습니다.

이 문제는 SvelteKit 2에서 고쳐졌습니다. 이제 두 경우 모두 `base`가 설정되어 있다면 경로 앞에 붙여야 합니다.

또한 `preloadCode`는 이제 _n_ 개의 인수 대신 인수 하나만 받습니다.

## `resolvePath` 제거 <!-- `resolvePath` has been removed -->

SvelteKit 1에는 라우트 ID(예: `/blog/[slug]`)와 매개변수 집합(예: `{ slug: 'hello' }`)을 경로 이름으로 변환하는 `resolvePath`라는 함수가 있었습니다. 안타깝게도 반환 값에 `base` 경로가 포함되지 않아서, `base`가 설정된 경우에는 쓸모가 제한적이었습니다.

그래서 SvelteKit 2에서는 `resolvePath`를 (이름이 조금 더 나은) `resolveRoute`라는 함수로 대체했습니다. 이 함수는 `$app/paths`에서 import하며 `base`를 고려합니다.

```js
---import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';---
+++import { resolveRoute } from '$app/paths';+++

---const path = base + resolvePath('/blog/[slug]', { slug });---
+++const path = resolveRoute('/blog/[slug]', { slug });+++
```

`svelte-migrate`가 메서드 교체를 대신해 주지만, 나중에 결과 앞에 `base`를 붙이고 있다면 그 부분은 직접 제거해야 합니다.

## 개선된 에러 처리 <!-- Improved error handling -->

SvelteKit 1에서는 에러가 일관성 없이 처리됩니다. 어떤 에러는 `handleError` 훅을 실행하지만 상태를 제대로 구별할 방법이 없고(예를 들어 404와 500을 구별하는 유일한 방법은 `event.route.id`가 `null`인지 보는 것입니다), 다른 에러(액션이 없는 페이지에 보낸 `POST` 요청의 405 에러 등)는 `handleError`를 실행해야 하는데도 전혀 실행하지 않습니다. 후자의 경우, [`App.Error`](types#Error) 타입을 지정했다면 결과로 나오는 `$page.error`가 그 타입과 어긋나게 됩니다.

SvelteKit 2는 `status`와 `message`라는 두 가지 새 속성과 함께 `handleError` 훅을 호출해 이 문제를 정리합니다. 여러분의 코드(또는 여러분의 코드가 호출한 라이브러리 코드)에서 throw된 에러라면 status는 `500`, message는 `Internal Error`가 됩니다. `error.message`에는 사용자에게 노출하면 안 되는 민감한 정보가 담겨 있을 수 있지만, `message`는 안전합니다.

## 프리렌더링 중에는 동적 환경 변수를 사용할 수 없음 <!-- Dynamic environment variables cannot be used during prerendering -->

`$env/dynamic/public`과 `$env/dynamic/private` 모듈은 `$env/static/public`과 `$env/static/private`가 노출하는 _빌드 시점_ 환경 변수와 달리 _런타임_ 환경 변수에 접근하게 해 줍니다.

SvelteKit 1의 프리렌더링 중에는 둘이 똑같습니다. 즉 '동적' 환경 변수를 사용하는 프리렌더링된 페이지에는 실제로는 빌드 시점의 값이 '박혀' 버리며, 이는 잘못된 동작입니다. 더 나쁜 것은, 사용자가 동적으로 렌더링되는 페이지로 이동하기 전에 프리렌더링된 페이지에 먼저 들어오면 브라우저의 `$env/dynamic/public`이 이 오래된 값으로 채워진다는 점입니다.

이 때문에 SvelteKit 2에서는 프리렌더링 중에 동적 환경 변수를 더 이상 읽을 수 없으며, 대신 `static` 모듈을 사용해야 합니다. 사용자가 프리렌더링된 페이지에 들어오면, SvelteKit은 서버 렌더링된 HTML에서 `$env/dynamic/public` 값을 읽는 대신 서버에 최신 값을 요청합니다(기본적으로 `/_app/env.js`라는 모듈에서 가져옵니다).

## `use:enhance` 콜백에서 `form`과 `data` 제거 <!-- `form` and `data` have been removed from `use:enhance` callbacks -->

[`use:enhance`](form-actions#Progressive-enhancement-use:enhance)에 콜백을 전달하면, 여러 유용한 속성이 담긴 객체와 함께 호출됩니다.

SvelteKit 1에서는 이 속성에 `form`과 `data`가 포함되어 있었습니다. 이 둘은 얼마 전에 `formElement`와 `formData`로 대체되며 지원 중단되었고, SvelteKit 2에서 완전히 제거되었습니다.

## 파일 입력이 있는 폼은 `multipart/form-data`를 사용해야 함 <!-- Forms containing file inputs must use `multipart/form-data` -->

폼에 `<input type="file">`이 있는데 `enctype="multipart/form-data"` 속성이 없으면, JS 없이 제출할 때 파일이 빠집니다. JavaScript가 없을 때도 폼이 올바르게 동작하도록, SvelteKit 2는 `use:enhance` 제출 중에 이런 폼을 만나면 에러를 throw합니다.

## 생성된 `tsconfig.json`이 더 엄격해짐 <!-- Generated `tsconfig.json` is more strict -->

이전에는 `tsconfig.json`에 `paths`나 `baseUrl`이 있어도, 생성된 `tsconfig.json`이 어떻게든 어느 정도 유효한 설정을 만들어 내려고 애썼습니다. SvelteKit 2에서는 검증이 더 엄격해져서, `tsconfig.json`에서 `paths`나 `baseUrl`을 사용하면 경고합니다. 이 설정은 경로 별칭을 생성하는 데 쓰이며, 번들러에도 해당 별칭이 만들어지도록 대신 `vite.config.js`에서 SvelteKit 플러그인의 [`alias` 설정](@sveltejs-kit-vite#alias) 옵션을 사용해야 합니다.

## `getRequest`가 더 이상 에러를 throw하지 않음 <!-- `getRequest` no longer throws errors -->

`@sveltejs/kit/node` 모듈은 Node 환경에서 쓰는 헬퍼 함수를 내보냅니다. 그중 `getRequest`는 Node [`ClientRequest`](https://nodejs.org/api/http.html#class-httpclientrequest)를 표준 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 객체로 바꿔 줍니다.

SvelteKit 1에서는 `Content-Length` 헤더가 지정된 크기 제한을 넘으면 `getRequest`가 throw할 수 있었습니다. SvelteKit 2에서는 나중에 (요청 본문이 있다면) 요청 본문을 읽을 때까지 에러가 throw되지 않습니다. 덕분에 진단이 더 쉬워지고 코드가 더 단순해집니다.

## `vitePreprocess`를 더 이상 `@sveltejs/kit/vite`에서 내보내지 않음 <!-- `vitePreprocess` is no longer exported from `@sveltejs/kit/vite` -->

이제 `@sveltejs/vite-plugin-svelte`가 피어 의존성이므로, SvelteKit 2는 더 이상 `vitePreprocess`를 다시 내보내지 않습니다. `@sveltejs/vite-plugin-svelte`에서 직접 import해야 합니다.

## 업데이트된 의존성 요구 사항 <!-- Updated dependency requirements -->

SvelteKit 2에는 Node `18.13` 이상과 다음 최소 의존성 버전이 필요합니다:

- `svelte@4`
- `vite@5`
- `typescript@5`
- `@sveltejs/vite-plugin-svelte@3` (이제 SvelteKit의 `peerDependency`로 필요합니다. 이전에는 직접 의존성이었습니다)
- `@sveltejs/adapter-cloudflare@3` (이 어댑터들을 사용하는 경우)
- `@sveltejs/adapter-cloudflare-workers@2`
- `@sveltejs/adapter-netlify@3`
- `@sveltejs/adapter-node@2`
- `@sveltejs/adapter-static@3`
- `@sveltejs/adapter-vercel@4`

`svelte-migrate`가 `package.json`을 대신 업데이트해 줍니다.

TypeScript 업그레이드의 일환으로, 생성된 `tsconfig.json`(여러분의 `tsconfig.json`이 확장하는 파일)은 이제 `"moduleResolution": "bundler"`(package.json에 `exports` 맵이 있는 패키지의 타입을 올바르게 해석하므로 TypeScript 팀이 권장합니다)와 `verbatimModuleSyntax`(기존의 `importsNotUsedAsValues `와 `preserveValueImports` 플래그를 대체합니다. `tsconfig.json`에 이 플래그가 있다면 제거하세요. `svelte-migrate`가 대신 해 줍니다)를 사용합니다.

## SvelteKit 2.12: $app/stores 지원 중단 <!-- SvelteKit 2.12: $app/stores deprecated -->

SvelteKit 2.12에서는 [Svelte 5 룬 API](/docs/svelte/what-are-runes)를 기반으로 한 `$app/state`가 도입되었습니다. `$app/state`는 `$app/stores`가 제공하는 모든 것을 제공하면서도, 어디서 어떻게 사용할지에 관해 더 유연합니다. 가장 중요한 점은 `page` 객체가 이제 세분화되었다는 것입니다. 예를 들어 `page.state`가 업데이트되어도 `page.data`가 무효화되지 않으며, 그 반대도 마찬가지입니다.

그 결과 `$app/stores`는 지원 중단되었으며 SvelteKit 3에서 제거될 예정입니다. 아직 하지 않았다면 [Svelte 5로 업그레이드](/docs/svelte/v5-migration-guide)한 뒤 `$app/stores`에서 벗어나 마이그레이션하길 권합니다. 대부분의 교체는 아주 간단합니다. `$app/stores` import를 `$app/state`로 바꾸고, 사용하는 곳에서 `$` 접두사를 제거하면 됩니다.

```svelte
<script>
	---import { page } from '$app/stores';---
	+++import { page } from '$app/state';+++
</script>

---{$page.data}---
+++{page.data}+++
```

`npx sv migrate app-state`를 사용하면 `.svelte` 컴포넌트 안의 `$app/stores` 사용 대부분을 자동으로 마이그레이션할 수 있습니다.
