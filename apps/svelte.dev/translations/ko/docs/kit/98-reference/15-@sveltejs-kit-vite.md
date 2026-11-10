---
title:  @sveltejs/kit/vite
---

## sveltekit

SvelteKit Vite 플러그인입니다. 프로젝트 설정과 함께 `vite.config.js` 파일에 추가해야 합니다:

```js
// @errors: 7031
/// file: vite.config.js
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			compilerOptions: {
				experimental: {
					async: true
				}
			},
			experimental: {
				remoteFunctions: true
			}
		})
	]
});
```

플러그인 옵션은 SvelteKit뿐 아니라 에디터 확장처럼 Svelte와 통합되는 다른 도구에서도 사용됩니다.

SvelteKit에 속하지 않는 옵션은 [`vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md)로 그대로 전달되므로, `inspector` 같은 옵션도 여기서 설정할 수 있습니다. `experimental` 네임스페이스는 공유됩니다. SvelteKit은 자신의 플래그를 읽고 나머지는 넘겨줍니다.

> [!LEGACY]
> SvelteKit 3 이전에는 설정이 `svelte.config.js` 파일에 있었지만, 이제는 지원하지 않습니다. `vite.config.js`로 SvelteKit을 설정하는 기능은 버전 2.62에서 추가되었습니다.

<div class="ts-block">

```dts
function sveltekit(config?: Config): Promise<Plugin[]>;
```

</div>



## Config

[`vite-plugin-svelte`의 옵션](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#svelte-options)을 확장한 것입니다.

## adapter

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `undefined`

</div>

[어댑터](/docs/kit/adapters)는 `vite build`를 실행할 때 동작합니다. 어댑터는 빌드 결과물을 각 플랫폼에 맞게 어떻게 변환할지 결정합니다.

<div class="ts-block-property-children">



</div>

## alias

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 
- <span class="tag">default</span> `{}`

</div>

`import` 문의 값을 바꾸는 데 쓰이는 별칭(alias)을 0개 이상 담은 객체입니다. 이 별칭은 Vite와 TypeScript에 자동으로 전달됩니다.

이 옵션은 지원 중단(deprecated)되었습니다. 대신 [서브패스 import(subpath imports)](/docs/kit/$lib)를 사용하세요.

> [!NOTE] SvelteKit이 `jsconfig.json`이나 `tsconfig.json`에 필요한 별칭 설정을 자동으로 생성하게 하려면 `npm run dev`를 실행해야 합니다.

<div class="ts-block-property-children">



</div>

## appDir

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"_app"`

</div>

SvelteKit이 정적 에셋(JS, CSS 등)과 내부용 라우트 등 자신의 파일을 두는 디렉터리입니다.

`paths.assets`를 지정하면 앱 디렉터리가 `${paths.assets}/${appDir}`와 `${paths.base}/${appDir}` 두 개가 됩니다.

<div class="ts-block-property-children">



</div>

## csp

<div class="ts-block-property-bullets">



</div>

[콘텐츠 보안 정책(Content Security Policy)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) 설정입니다. CSP는 리소스를 불러올 수 있는 곳을 제한해 사용자를 크로스 사이트 스크립팅(XSS) 공격으로부터 보호합니다. 예를 들어 다음과 같은 설정은...

```js
// @errors: 7031
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			csp: {
				directives: {
					'script-src': ['self']
				},
				// must be specified with either the `report-uri` or `report-to` directives, or both
				reportOnly: {
					'script-src': ['self'],
					'report-uri': ['/']
				}
			}
		})
	]
});
```

...외부 사이트에서 스크립트를 불러오지 못하게 막습니다. SvelteKit은 자신이 생성하는 인라인 스타일과 스크립트에 대해, 지정한 지시어에 (`mode`에 따라) 논스(nonce)나 해시를 덧붙입니다.

`src/app.html`에 직접 넣은 스크립트와 링크에 논스를 추가하려면 `%sveltekit.nonce%` 플레이스홀더를 사용할 수 있습니다(예: `<script nonce="%sveltekit.nonce%">`).

페이지를 프리렌더링할 때는 CSP 헤더가 `<meta http-equiv>` 태그로 추가됩니다(이 경우 `frame-ancestors`, `report-uri`, `sandbox` 지시어는 무시된다는 점에 유의하세요).

> [!NOTE] `mode`가 `'auto'`이면 SvelteKit은 동적으로 렌더링되는 페이지에는 논스를, 프리렌더링되는 페이지에는 해시를 사용합니다. 프리렌더링되는 페이지에 논스를 쓰는 것은 안전하지 않으므로 금지되어 있습니다.

이 정도 설정으로 부족하고 더 동적인 요구 사항이 있다면, [`handle` 훅](/docs/kit/hooks#handle)으로 CSP를 직접 구현할 수 있습니다.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
mode?: 'hash' | 'nonce' | 'auto';
```

<div class="ts-block-property-details">

`<script>`와 `<style>` 요소를 제한할 때 해시를 쓸지 논스를 쓸지 정합니다. `'auto'`는 프리렌더링되는 페이지에는 해시를, 동적으로 렌더링되는 페이지에는 논스를 사용합니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
directives?: CspDirectives;
```

<div class="ts-block-property-details">

`Content-Security-Policy` 헤더에 추가될 지시어입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
reportOnly?: CspDirectives;
```

<div class="ts-block-property-details">

`Content-Security-Policy-Report-Only` 헤더에 추가될 지시어입니다.

</div>
</div>

</div>

## csrf

<div class="ts-block-property-bullets">



</div>

[크로스 사이트 요청 위조(CSRF)](https://owasp.org/www-community/attacks/csrf) 공격을 막기 위한 보호 설정입니다.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
checkOrigin?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`
- <span class="tag deprecated">deprecated</span> 3.0에서 제거되었습니다. 대신 `trustedOrigins: ['*']`를 사용하세요

</div>

`POST`, `PUT`, `PATCH`, `DELETE` 폼 제출에서 들어오는 `origin` 헤더를 검사해 서버의 출처(origin)와 일치하는지 확인할지 여부입니다.

다른 출처에서 여러분의 앱으로 `Content-Type`이 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`인 `POST`, `PUT`, `PATCH`, `DELETE` 요청을 보낼 수 있게 하려면 이 옵션을 꺼야 합니다. 주의하세요!

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
trustedOrigins?: string[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `[]`

</div>

여러분의 앱에 교차 출처(cross-origin) 폼 제출을 할 수 있도록 허용된 출처의 배열입니다.

각 출처는 프로토콜을 포함한 완전한 출처여야 합니다(예: `https://payment-gateway.com`).
결제 게이트웨이나 인증 제공자처럼 신뢰할 수 있는 서드파티 서비스가 앱에 폼을 제출하도록 허용할 때 유용합니다.

배열에 `'*'`가 들어 있으면 모든 출처를 신뢰합니다. 일반적으로 권장하지 않습니다!

> [!NOTE] 이 설정은 해당 출처에 대한 CSRF 보호를 우회하므로, 완전히 신뢰하는 출처만 추가하세요.

CSRF 검사는 프로덕션에서만 적용되며, 로컬 개발 환경에서는 적용되지 않습니다.

</div>
</div>

</div>

## embedded

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

앱이 더 큰 앱 안에 임베드되어 있는지 여부입니다. `true`이면 SvelteKit은 내비게이션 등과 관련된 이벤트 리스너를 `window` 대신 `%sveltekit.body%`의 부모에 추가하고, `params`를 `location.pathname`에서 추론하지 않고 서버에서 전달합니다.
한 페이지에 여러 SvelteKit 앱을 임베드하고 그 안에서 클라이언트 사이드 SvelteKit 기능을 사용하는 것은 일반적으로 지원되지 않는다는 점에 유의하세요(히스토리 상태에 항목을 추가하는 것 같은 동작은 인스턴스가 하나라고 가정합니다).

<div class="ts-block-property-children">



</div>

## env

<div class="ts-block-property-bullets">



</div>

환경 변수 설정

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
dir?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"."`

</div>

`.env` 파일을 찾을 디렉터리입니다.

</div>
</div>

</div>

## experimental

<div class="ts-block-property-bullets">



</div>

실험적 기능입니다. 위험할 수 있으니 조심하세요. 유의적 버전(semantic versioning)을 따르지 않으므로, 어떤 릴리스에서든 호환성이 깨지는 변경이 생기거나 기능이 제거될 수 있습니다.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
remoteFunctions?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

실험적 기능인 원격 함수를 활성화할지 여부입니다. 이 기능은 아직 안정적이지 않으며 언제든 변경되거나 제거될 수 있습니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
forkPreloads?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

Svelte의 fork API를 사용하는 실험적 기능인 포크 프리로딩(forked preloading)을 활성화할지 여부입니다.

</div>
</div>

</div>

## files

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다

</div>

프로젝트 안에서 여러 파일을 찾을 위치입니다.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
src?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src"`
- <span class="tag since">available since</span> v2.28

</div>

소스 코드의 위치입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
assets?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"static"`

</div>

`favicon.ico`나 `manifest.json`처럼 URL이 바뀌지 않아야 하고 아무 처리도 거치지 않아야 하는 정적 파일을 두는 곳입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
hooks?: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-children"><div class="ts-block-property">

```ts
// @noErrors
client?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/hooks.client"`

</div>

클라이언트 [훅](/docs/kit/hooks)의 위치입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
server?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/hooks.server"`

</div>

서버 [훅](/docs/kit/hooks)의 위치입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
universal?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/hooks"`
- <span class="tag since">available since</span> v2.3.0

</div>

유니버설 [훅](/docs/kit/hooks)의 위치입니다.

</div>
</div></div>

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
params?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/params"`

</div>

[매개변수 매처](/docs/kit/advanced-routing#Matching)가 들어 있는 디렉터리입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
routes?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/routes"`

</div>

앱의 구조를 정의하는 파일입니다([라우팅](/docs/kit/routing) 참고).

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
serviceWorker?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/service-worker"`

</div>

서비스 워커 진입점의 위치입니다([서비스 워커](/docs/kit/service-workers) 참고).

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
appTemplate?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/app.html"`

</div>

HTML 응답에 쓰이는 템플릿의 위치입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
errorTemplate?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 이 기능은 여전히 지원되지만, 일반적으로는 대신 [모노레포](https://levelup.video/tutorials/monorepos-with-pnpm)를 사용하기를 권장합니다
- <span class="tag">default</span> `"src/error.html"`

</div>

폴백(fallback) 에러 응답에 쓰이는 템플릿의 위치입니다.

</div>
</div>

</div>

## inlineStyleThreshold

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `0`

</div>

CSS를 HTML head의 `<style>` 블록 안에 인라인합니다. 이 옵션은 인라인할 CSS 파일의 최대 길이를 [String.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length) 속성 기준의 UTF-16 코드 단위로 지정하는 숫자입니다. 페이지에 필요한 CSS 파일 중 이 값보다 작은 것은 모두 병합되어 `<style>` 블록에 인라인됩니다.

> [!NOTE] 이렇게 하면 초기 요청 수가 줄어 [First Contentful Paint](https://web.dev/first-contentful-paint) 점수가 좋아질 수 있습니다. 하지만 HTML 출력이 커지고 브라우저 캐시의 효과가 떨어집니다. 신중하게 사용하세요.

<div class="ts-block-property-children">



</div>

## moduleExtensions

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `[".js", ".ts"]`

</div>

SvelteKit이 모듈로 취급할 파일 확장자의 배열입니다. 확장자가 `config.extensions`와 `config.moduleExtensions` 어디에도 해당하지 않는 파일은 무시됩니다.

<div class="ts-block-property-children">



</div>

## outDir

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `".svelte-kit"`

</div>

SvelteKit이 `dev`와 `build` 중에 파일을 쓰는 디렉터리입니다. 이 디렉터리는 버전 관리에서 제외해야 합니다.

<div class="ts-block-property-children">



</div>

## output

<div class="ts-block-property-bullets">



</div>

빌드 결과물 형식과 관련된 옵션

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
linkHeaderPreload?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`
- <span class="tag since">available since</span> v3.0.0

</div>

프리렌더링되지 않는 페이지에서 에셋을 프리로드할 때 [`<link>` HTML 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link) 대신 [HTTP `Link` 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Link)를 사용할지 여부입니다.

Nginx나 Apache 같은 일부 웹 서버에는 기본 헤더 크기 제한이 있어 쉽게 초과될 수 있다는 점에 유의하세요.
이런 웹 서버를 사용한다면 이 값을 `false`로 두거나 제한을 더 높게 설정하는 것이 좋습니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
preloadStrategy?: 'modulepreload' | 'preload-js' | 'preload-mjs';
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"modulepreload"`
- <span class="tag since">available since</span> v1.8.4
- <span class="tag deprecated">deprecated</span> 3.0에서 제거되었습니다

</div>

SvelteKit은 import '워터폴(waterfall)'을 피하기 위해 첫 페이지에 필요한 JavaScript 모듈을 프리로드하며, 덕분에 애플리케이션이 더 빨리 시작됩니다.
장단점이 서로 다른 세 가지 전략이 있습니다:
- `modulepreload` - `<link rel="modulepreload">`를 사용합니다. Chromium 기반 브라우저, Firefox 115+, Safari 17+에서 가장 좋은 결과를 냅니다. 이전 브라우저에서는 무시됩니다.
- `preload-js` - `<link rel="preload">`를 사용합니다. Chromium과 Safari에서 워터폴을 막지만, Chromium은 각 모듈을 두 번(스크립트로 한 번, 모듈로 한 번) 파싱합니다. Firefox에서는 모듈을 두 번 요청하게 됩니다. Chromium 사용자의 성능이 아주 약간 떨어지는 대신 iOS 기기 사용자의 성능을 최대로 끌어올리고 싶다면 좋은 설정입니다.
- `preload-mjs` - `<link rel="preload">`를 사용하되 `.mjs` 확장자를 써서 Chromium에서 두 번 파싱되는 것을 막습니다. 일부 정적 웹 서버는 .mjs 파일을 `Content-Type: application/javascript` 헤더로 제공하지 못하며, 그러면 애플리케이션이 망가집니다. 여기에 해당하지 않는다면, `modulepreload`가 더 널리 지원되기 전까지는 가장 많은 사용자에게 가장 좋은 성능을 내는 옵션입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
bundleStrategy?: 'split' | 'single' | 'inline';
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `'split'`
- <span class="tag since">available since</span> v2.13.0

</div>

번들 전략 옵션은 앱의 JavaScript와 CSS 파일을 불러오는 방식에 영향을 줍니다.
- `'split'`이면 앱을 여러 .js/.css 파일로 나누어, 사용자가 앱 안에서 이동할 때 지연 로드되게 합니다. 기본값이며 대부분의 경우에 권장합니다.
- `'single'`이면 앱 전체의 코드를 담은 .js 번들 하나와 .css 파일 하나만 만듭니다.
- `'inline'`이면 앱 전체의 모든 JavaScript와 CSS를 HTML에 인라인합니다. 결과물은 서버 없이도 사용할 수 있습니다(즉, 브라우저에서 파일을 그냥 열면 됩니다).

`'split'`을 사용할 때는 Vite 설정의 [`build.rolldownOptions`](https://vite.dev/config/build-options#build-rolldownoptions) 안에서 [`output.codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting)을 설정해 번들링 동작을 조정할 수도 있습니다.

에셋을 인라인하고 싶다면 Vite의 [`build.assetsInlineLimit`](https://vite.dev/config/build-options.html#build-assetsinlinelimit) 옵션을 적절한 크기로 설정한 다음, Vite를 통해 에셋을 임포트해야 합니다.

```js
// @errors: 7031
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// inline all imported assets
		assetsInlineLimit: Infinity
	}
});
```

```svelte
/// file: src/routes/+layout.svelte
<script>
	// import the asset through Vite
	import favicon from './favicon.png';
</script>

<svelte:head>
	<!-- this asset will be inlined as a base64 URL -->
	<link rel="icon" href={favicon} />
</svelte:head>
```

</div>
</div>

</div>

## paths

<div class="ts-block-property-bullets">



</div>



<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
assets?: '' | `http://${string}` | `https://${string}`;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `""`

</div>

앱의 파일을 제공하는 절대 경로입니다. 파일을 스토리지 버킷 같은 곳에서 제공할 때 유용합니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
base?: '' | `/${string}`;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `""`

</div>

루트 기준 상대 경로로, 빈 문자열이 아니라면 반드시 `/`로 시작하고 `/`로 끝나지 않아야 합니다(예: `/base-path`). 앱을 제공하는 위치를 지정하며, 앱이 루트가 아닌 경로에 있을 수 있게 해 줍니다. 루트 기준 상대 링크 앞에는 모두 base 값을 붙여야 한다는 점에 유의하세요. 그렇지 않으면 링크가 `base`가 아니라 도메인의 루트를 가리킵니다(브라우저가 원래 그렇게 동작합니다). 이를 위해 [`$app/paths`의 `resolve(...)`](/docs/kit/$app-paths#resolve)를 사용할 수 있습니다: `<a href="{resolve('/your-page')}">Link</a>`. 이런 코드를 자주 쓰게 된다면 재사용 가능한 컴포넌트로 추출하는 것도 좋습니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
origin?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `undefined`
- <span class="tag since">available since</span> v3.0

</div>

CSRF 보호와 프리렌더링에 쓰이는 앱의 출처(origin)입니다.

기본값은 `undefined`이며, 이 경우 SvelteKit은 `request.url`(어댑터가 설정하며, 결국에는 플랫폼이 정하는 값)에서 출처를 알아냅니다.

앱이 요청 시점에 알 수 없는 출처에서 제공된다면(예를 들어 빌드 시점에 URL을 알 수 없는 프리뷰 배포에 배포되었거나, `host` 헤더를 전달하지 않는 리버스 프록시 뒤에 있는 경우) 이 값을 `https://my-site.com` 같은 문자열로 설정할 수 있습니다.

이 값은 프리렌더링 중 `url.origin`의 값으로도 쓰이며(설정하지 않으면 기본값은 `http://sveltekit-prerender`입니다), 폼 제출과 원격 함수 호출에 대한 CSRF 검사에서 신뢰하는 출처로도 쓰입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
relative?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`
- <span class="tag since">available since</span> v1.9.0

</div>

상대 에셋 경로를 사용할지 여부입니다.

`true`이면 `$app/paths`에서 가져온 `resolve()`와 `asset()`으로 만든 경로가 서버 사이드 렌더링 중에 상대 에셋 경로로 바뀌므로, HTML의 이식성이 더 좋아집니다.
`false`이면 `paths.assets`가 외부 URL이 아닌 한, `%sveltekit.assets%`와 빌드 산출물에 대한 참조는 항상 루트 기준 상대 경로가 됩니다

[싱글 페이지 앱](/docs/kit/single-page-apps)의 폴백 페이지는 이 설정과 관계없이 항상 절대 경로를 사용합니다.

앱에서 `<base>` 요소를 사용한다면 이 값을 `false`로 설정해야 합니다. 그렇지 않으면 에셋 URL이 현재 페이지가 아니라 `<base>` URL을 기준으로 잘못 해석됩니다.

1.0에서는 `undefined`가 유효한 값이었고 기본값이기도 했습니다. 이 경우 `paths.assets`가 외부 URL이 아니면 SvelteKit은 `%sveltekit.assets%`를 상대 경로로 바꾸고 빌드 산출물을 상대 경로로 참조했지만, `$app/paths`에서 가져온 `base`와 `assets`는 설정에 지정한 값 그대로였습니다.

</div>
</div>

</div>

## prerender

<div class="ts-block-property-bullets">



</div>

[프리렌더링](/docs/kit/page-options#prerender)을 참고하세요.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
concurrency?: number;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `1`

</div>

동시에 프리렌더링할 수 있는 페이지 수입니다. JS는 싱글 스레드이지만, 프리렌더링 성능이 네트워크에 묶여 있는 경우(예를 들어 원격 CMS에서 콘텐츠를 불러올 때)에는 네트워크 응답을 기다리는 동안 다른 작업을 처리하므로 속도가 빨라질 수 있습니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
crawl?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`

</div>

SvelteKit이 `entries`에서 시작해 링크를 따라가며 프리렌더링할 페이지를 찾을지 여부입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
entries?: Array<'*' | `/${string}`>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `["*"]`

</div>

프리렌더링할 페이지, 또는 (`crawl: true`인 경우) 크롤링을 시작할 페이지의 배열입니다. `*` 문자열은 필수 `[parameters]`가 없는 모든 라우트를 포함하며, 선택적 매개변수는 빈 값으로 간주해 포함합니다(SvelteKit은 매개변수에 어떤 값이 들어가야 하는지 모르기 때문입니다).

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
handleHttpError?: PrerenderHttpErrorHandlerValue;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"fail"`
- <span class="tag since">available since</span> v1.15.7

</div>

앱을 프리렌더링하는 중에 HTTP 에러를 만났을 때 어떻게 대응할지 정합니다.

- `'fail'` — 빌드를 실패시킵니다
- `'ignore'` - 실패를 조용히 무시하고 계속 진행합니다
- `'warn'` — 계속 진행하되 경고를 출력합니다
- `(details) => void` — `status`, `path`, `referrer`, `referenceType`, `message` 속성을 가진 `details` 객체를 받는 사용자 정의 에러 핸들러입니다. 이 함수에서 `throw`하면 빌드가 실패합니다

```js
// @errors: 7031
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
 		prerender: {
 			handleHttpError: ({ path, referrer, message }) => {
					// ignore deliberate link to shiny 404 page
					if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') {
						return;
					}

					// otherwise fail the build
					throw new Error(message);
				}
			}
		})
	]
});
```

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
handleMissingId?: PrerenderMissingIdHandlerValue;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"fail"`
- <span class="tag since">available since</span> v1.15.7

</div>

프리렌더링된 한 페이지에서 다른 페이지로 가는 해시 링크가 대상 페이지의 `id`와 맞지 않을 때 어떻게 대응할지 정합니다.

- `'fail'` — 빌드를 실패시킵니다
- `'ignore'` - 실패를 조용히 무시하고 계속 진행합니다
- `'warn'` — 계속 진행하되 경고를 출력합니다
- `(details) => void` — `path`, `id`, `referrers`, `message` 속성을 가진 `details` 객체를 받는 사용자 정의 에러 핸들러입니다. 이 함수에서 `throw`하면 빌드가 실패합니다

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
handleEntryGeneratorMismatch?: PrerenderEntryGeneratorMismatchHandlerValue;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"fail"`
- <span class="tag since">available since</span> v1.16.0

</div>

`entries` export가 생성한 항목이 그 항목을 생성한 라우트와 일치하지 않을 때 어떻게 대응할지 정합니다.

- `'fail'` — 빌드를 실패시킵니다
- `'ignore'` - 실패를 조용히 무시하고 계속 진행합니다
- `'warn'` — 계속 진행하되 경고를 출력합니다
- `(details) => void` — `generatedFromId`, `entry`, `matchedId`, `message` 속성을 가진 `details` 객체를 받는 사용자 정의 에러 핸들러입니다. 이 함수에서 `throw`하면 빌드가 실패합니다

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
handleUnseenRoutes?: PrerenderUnseenRoutesHandlerValue;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"fail"`
- <span class="tag since">available since</span> v2.16.0

</div>

라우트가 프리렌더링 가능으로 표시되었지만 실제로는 프리렌더링되지 않았을 때 어떻게 대응할지 정합니다.

- `'fail'` — 빌드를 실패시킵니다
- `'ignore'` - 실패를 조용히 무시하고 계속 진행합니다
- `'warn'` — 계속 진행하되 경고를 출력합니다
- `(details) => void` — 프리렌더링되지 않은 모든 라우트를 담은 `routes` 속성을 가진 `details` 객체를 받는 사용자 정의 에러 핸들러입니다. 이 함수에서 `throw`하면 빌드가 실패합니다

기본 동작은 빌드를 실패시키는 것입니다. 하지만 CMS가 특정 영역의 데이터를 반환하지 않아 일부 라우트에 절대 도달하지 못하는 것처럼,
특정 상황에서 일부 라우트에 도달할 수 없다는 것을 알고 있다면 이 동작이 바람직하지 않을 수 있습니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
handleInvalidUrl?: PrerenderInvalidUrlHandlerValue;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"fail"`
- <span class="tag since">available since</span> v2.67.0

</div>

SvelteKit이 프리렌더링된 HTML을 크롤링하다가 파싱할 수 없는 URL(예: `at://did:plc:...` 같은 AT Protocol URL)을 만났을 때 어떻게 대응할지 정합니다.

- `'fail'` — 빌드를 실패시킵니다
- `'ignore'` - 실패를 조용히 무시하고 계속 진행합니다
- `'warn'` — 계속 진행하되 경고를 출력합니다
- `(details) => void` — `href`, `referrer`, `message` 속성을 가진 `details` 객체를 받는 사용자 정의 에러 핸들러입니다. 이 함수에서 `throw`하면 빌드가 실패합니다

</div>
</div>

</div>

## router

<div class="ts-block-property-bullets">



</div>



<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
type?: 'pathname' | 'hash';
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"pathname"`
- <span class="tag since">available since</span> v2.14.0

</div>

어떤 종류의 클라이언트 사이드 라우터를 사용할지 정합니다.
- `'pathname'`이 기본값이며, 현재 URL의 경로명으로 라우트를 결정합니다
- `'hash'`는 `location.hash`로 라우트를 결정합니다. 이 경우 SSR과 프리렌더링이 비활성화됩니다. 앱을 배포하는 웹 서버를 직접 제어할 수 없는 경우처럼 `pathname`을 쓸 수 없을 때만 권장합니다.
	몇 가지 주의할 점이 있습니다. 서버 사이드 렌더링(사실상 모든 서버 로직)을 사용할 수 없고, 앱의 모든 링크가 #/로 시작하도록 해야 합니다. 그렇지 않으면 링크가 동작하지 않습니다. 그 밖에는 모든 것이 일반 SvelteKit 앱과 똑같이 동작합니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
resolution?: 'client' | 'server';
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `"client"`
- <span class="tag since">available since</span> v2.17.0

</div>

새 페이지로 이동할 때 어떤 라우트를 불러올지 결정하는 방식입니다.

기본적으로 SvelteKit은 브라우저에 라우트 매니페스트를 제공합니다.
내비게이션할 때 이 매니페스트를 (`reroute` 훅이 있다면 그것과 함께) 사용해 어떤 컴포넌트를 불러오고 어떤 `load` 함수를 실행할지 결정합니다.
모든 것이 클라이언트에서 일어나므로 이 결정은 즉시 내려집니다. 단점은 첫 번째 내비게이션이 일어나기 전에 매니페스트를
불러와 파싱해야 한다는 것이며, 앱에 라우트가 많다면 영향이 있을 수 있습니다.

또는 SvelteKit이 서버에서 라우트를 결정하게 할 수도 있습니다. 이 경우 아직 방문하지 않은 경로로 이동할 때마다 서버에 라우트 결정을 요청합니다.
여기에는 몇 가지 장점이 있습니다:
- 클라이언트가 라우팅 매니페스트를 미리 불러올 필요가 없으므로 초기 페이지 로드가 빨라질 수 있습니다
- 라우트 목록이 외부에 공개되지 않습니다
- 서버가 각 내비게이션을 가로챌 기회가 생깁니다(예를 들어 리버스 프록시나 플랫폼의 엣지 함수처럼 SvelteKit 앞단에 있는 미들웨어를 통해). 덕분에 예를 들어 SvelteKit이 알지 못하는 A/B 테스트를 할 수 있습니다

라우트 해석 요청은 라우트를 찾는 즉시, `handle` 훅이 호출되기 전에 응답됩니다. SvelteKit 안에서 이 요청을 가로채려면, 이런 요청에 대해서도 실행되는 `reroute` 훅을 사용하세요.

단점은 방문하지 않은 경로에 대해서는 해석에 시간이 조금 더 걸린다는 것입니다(다만 [프리로딩](/docs/kit/link-options#data-sveltekit-preload-data)으로 이를 완화할 수 있습니다).

> [!NOTE] 서버 사이드 라우트 해석과 프리렌더링을 함께 사용하면, 해석 결과도 라우트 자체와 함께 프리렌더링됩니다.

</div>
</div>

</div>

## serviceWorker

<div class="ts-block-property-bullets">



</div>



<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
register: true;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`

</div>

서비스 워커가 있다면 자동으로 등록할지 여부입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
options?: RegistrationOptions;
```

<div class="ts-block-property-details">

serviceWorker.register("...", options);에 전달할 옵션입니다.

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
register?: false;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`

</div>

서비스 워커가 있다면 자동으로 등록할지 여부입니다.

</div>
</div>

</div>

## tracing

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `{ server: false }`

</div>

SvelteKit 작업에 대한 [OpenTelemetry](https://opentelemetry.io/) 트레이싱을 켜기 위한 옵션입니다.

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
server?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

[`handle` 훅](/docs/kit/hooks#handle), [`load` 함수](/docs/kit/load), [폼 액션](/docs/kit/form-actions), [`+server` 핸들러](/docs/kit/routing#server), [원격 함수](/docs/kit/remote-functions) 등 SvelteKit 작업에 대해 서버 사이드 [OpenTelemetry](https://opentelemetry.io/) 스팬(span)을 내보내도록 합니다. 트레이싱, 그리고 무엇보다 관측 가능성을 위한 계측은 무시할 수 없는 오버헤드가 생길 수 있으므로, 정말 필요한지 아니면 개발 환경과 프리뷰 환경에서만 켜는 것이 더 적절한지 고려하세요.

</div>
</div>

</div>

## typescript

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> `tsconfig.json`에 직접 설정을 추가하세요

</div>



<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
config?: (config: Record<string, any>) => Record<string, any> | void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v1.3.0

</div>

생성된 `tsconfig.json`을 수정할 수 있게 해 주는 함수입니다. 설정을 직접 변경하거나(권장) 새 설정을 반환할 수 있습니다.
예를 들어 모노레포 루트에 있는 공유 `tsconfig.json`을 확장할 때 유용합니다.

여기서 설정하는 경로는 모두 `node_modules/$app/tsconfig.json`에 쓰이는 생성된 설정 파일을 기준으로 한 상대 경로여야 한다는 점에 유의하세요.

</div>
</div>

</div>

## version

<div class="ts-block-property-bullets">



</div>

사람들이 앱을 사용하는 도중에 새 버전을 배포하면 클라이언트 사이드 내비게이션에 문제가 생길 수 있습니다. 새 페이지의 코드가 이미 로드되어 있다면 오래된 콘텐츠가 보일 수 있고, 로드되어 있지 않다면 앱의 라우트 매니페스트가 더 이상 존재하지 않는 JavaScript 파일을 가리킬 수 있습니다.
SvelteKit은 버전 관리로 이 문제를 해결하도록 돕습니다. 현재 버전은 `x-sveltekit-version` 헤더를 통해 데이터, 원격 함수, 폼 액션 응답에 포함되므로, SvelteKit은 폴링 없이도 새 배포를 감지할 수 있습니다. 예를 들어 내비게이션이 서버 `load` 함수를 실행시킬 때나 원격 함수가 호출될 때 감지합니다. SvelteKit은 탭이 다시 포커스를 얻거나 화면에 보이게 될 때도 새 버전을 확인합니다.
SvelteKit이 페이지를 불러오는 중에 에러를 만났는데 새 버전이 배포된 것을 감지하면(감지에는 여기서 지정한 `name`을 사용하며, 기본값은 빌드 타임스탬프입니다), 전통적인 전체 페이지 내비게이션으로 대체합니다.
하지만 다음 페이지의 JavaScript가 이미 로드되어 있는 경우처럼, 모든 내비게이션에서 에러가 나지는 않습니다. 이런 경우에도 전체 페이지 내비게이션을 강제하고 싶다면 `beforeNavigate`를 사용하세요:
```html
/// file: +layout.svelte
<script>
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>
```

이런 확인 외에도 SvelteKit은 일정 간격으로 새 버전을 폴링하며, 새 버전을 감지하면 [`updated.current`](/docs/kit/$app-state#updated)를 `true`로 설정합니다. 폴링을 끄려면 `pollInterval`을 `0`으로 설정하세요(헤더와 이벤트 기반 확인은 계속 실행됩니다).

<div class="ts-block-property-children">

<div class="ts-block-property">

```ts
// @noErrors
name?: string;
```

<div class="ts-block-property-details">

현재 앱 버전 문자열입니다. 지정한다면 결정적(deterministic)이어야 합니다(예: `Math.random()`이나 `Date.now().toString()`이 아니라 커밋 ref). 지정하지 않으면 빌드 타임스탬프가 기본값입니다.

예를 들어 현재 커밋 해시를 사용하려면 `git rev-parse HEAD`를 쓸 수 있습니다:

```js
// @errors: 7031
/// file: vite.config.js
import * as child_process from 'node:child_process';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
 		version: {
				name: child_process.execSync('git rev-parse HEAD').toString().trim()
			}
		})
	]
});
```

</div>
</div>
<div class="ts-block-property">

```ts
// @noErrors
pollInterval?: number;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `3600000`

</div>

버전 변경을 폴링하는 간격(밀리초)입니다. `0`이면 폴링하지 않습니다. SvelteKit은 서버 응답에서도(`x-sveltekit-version` 헤더를 통해), 그리고 탭이 다시 포커스를 얻거나 화면에 보이게 될 때도 새 버전을 확인하므로, 폴링은 한 페이지에 오래 머무는 세션에서만 필요합니다.

</div>
</div>

</div>
