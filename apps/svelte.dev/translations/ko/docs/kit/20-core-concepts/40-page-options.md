---
title: 페이지 옵션
tags: page-options
---

기본적으로 SvelteKit은 모든 컴포넌트를 먼저 서버에서 렌더링(또는 [프리렌더](glossary#Prerendering))해 HTML로 클라이언트에 보냅니다. 그다음 브라우저에서 컴포넌트를 다시 렌더링해 상호작용할 수 있게 만드는데, 이 과정을 [*하이드레이션*](glossary#Hydration)이라고 합니다. 그래서 컴포넌트가 양쪽 모두에서 실행될 수 있도록 해야 합니다. 이후 SvelteKit은 그다음 내비게이션을 넘겨받는 [*라우터*](routing)를 초기화합니다.

이 동작들은 [`+page.js`](routing#page-page.js)나 [`+page.server.js`](routing#page-page.server.js)에서 옵션을 내보내 페이지 단위로 제어하거나, 공유하는 [`+layout.js`](routing#layout-layout.js)나 [`+layout.server.js`](routing#layout-layout.server.js)로 페이지 그룹 단위로 제어할 수 있습니다. 앱 전체에 옵션을 정의하려면 루트 레이아웃에서 내보내세요. 하위 레이아웃과 페이지는 부모 레이아웃에서 설정한 값을 덮어쓰므로, 예를 들어 앱 전체에 프리렌더링을 켜 두고 동적으로 렌더링해야 하는 페이지에서만 끌 수 있습니다.

앱의 영역마다 이 옵션들을 자유롭게 조합할 수 있습니다. 예를 들어 마케팅 페이지는 최대 속도를 위해 프리렌더하고, 동적 페이지는 SEO와 접근성을 위해 서버에서 렌더링하고, 관리자 영역은 클라이언트에서만 렌더링해 SPA로 만들 수 있습니다. 덕분에 SvelteKit은 매우 다재다능합니다.

## prerender

앱의 라우트 중 적어도 일부는 빌드 시점에 생성한 단순한 HTML 파일로 표현할 수 있을 것입니다. 이런 라우트는 [*프리렌더*](glossary#Prerendering)할 수 있습니다.

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = true;
```

또는 루트 `+layout.js`나 `+layout.server.js`에서 `export const prerender = true`를 설정해, 프리렌더할 수 *없다고* 명시한 페이지를 제외한 모든 것을 프리렌더할 수도 있습니다:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = false;
```

`prerender = true`인 라우트는 동적 SSR에 쓰이는 매니페스트에서 제외되므로 서버(또는 서버리스/엣지 함수)가 더 작아집니다. 라우트를 프리렌더하면서도 매니페스트에 포함하고 싶은 경우도 있습니다(예를 들어 `/blog/[slug]` 같은 라우트에서 최신/인기 콘텐츠는 프리렌더하고 나머지 롱테일은 서버에서 렌더링하고 싶을 때). 이런 경우를 위한 세 번째 옵션 'auto'가 있습니다:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = 'auto';
```

> [!NOTE] 앱 전체가 프리렌더링에 적합하다면 [`adapter-static`](adapter-static)을 사용할 수 있습니다. 이 어댑터는 어떤 정적 웹 서버에서든 쓸 수 있는 파일을 출력합니다.

프리렌더러는 앱의 루트에서 시작해, 발견한 프리렌더 가능한 모든 페이지와 `+server.js` 라우트의 파일을 생성합니다. 각 페이지에서 프리렌더 후보인 다른 페이지를 가리키는 `<a>` 요소를 찾아보므로, 보통은 어떤 페이지에 접근해야 하는지 지정할 필요가 없습니다. 프리렌더러가 접근할 페이지를 *꼭* 지정해야 한다면 [`config.prerender.entries`](@sveltejs-kit-vite#prerender)를 쓰거나, 동적 라우트에서 [`entries`](#entries) 함수를 내보내면 됩니다.

프리렌더링 중에는 [`$app/env`]($app-env)에서 가져온 `building` 값이 `true`가 됩니다.

### 서버 라우트 프리렌더링 <!-- Prerendering server routes -->

다른 페이지 옵션과 달리 `prerender`는 `+server.js` 파일에도 적용됩니다. 이 파일들은 레이아웃의 영향을 받지 *않지만*, 이 파일에서 데이터를 가져오는 페이지가 있다면 그 페이지의 기본값을 상속합니다. 예를 들어 `+page.js`에 다음과 같은 `load` 함수가 있다면...

```js
/// file: +page.js
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch('/my-server-route.json');
	return await res.json();
}
```

...`src/routes/my-server-route.json/+server.js`에 자체적인 `export const prerender = false`가 없는 한, 이 파일은 프리렌더 가능한 것으로 취급됩니다.

### 프리렌더하지 말아야 할 때 <!-- When not to prerender -->

기본 규칙은 이렇습니다. 페이지를 프리렌더할 수 있으려면, 어떤 두 사용자가 그 페이지에 직접 접속하더라도 서버에서 같은 콘텐츠를 받아야 합니다.

> [!NOTE] 모든 페이지가 프리렌더링에 적합하지는 않습니다. 프리렌더된 콘텐츠는 모든 사용자에게 똑같이 보입니다. 물론 프리렌더된 페이지의 `onMount`에서 개인화된 데이터를 가져올 수도 있지만, 초기 콘텐츠가 비어 있거나 로딩 표시가 나타나므로 사용자 경험이 나빠질 수 있습니다.

`src/routes/blog/[slug]/+page.svelte` 라우트처럼 페이지의 매개변수에 따라 데이터를 불러오는 페이지도 프리렌더할 수 있다는 점에 유의하세요.

프리렌더링 중에는 [`url.searchParams`](load#Using-URL-data-url)에 접근할 수 없습니다. 꼭 사용해야 한다면 브라우저에서만(예: `onMount` 안에서) 사용하도록 하세요.

[액션](form-actions)이 있는 페이지는 프리렌더할 수 없습니다. 서버가 액션의 `POST` 요청을 처리할 수 있어야 하기 때문입니다.

### 라우트 충돌 <!-- Route conflicts -->

프리렌더링은 파일 시스템에 파일을 쓰므로, 디렉터리와 파일의 이름이 같아지는 두 엔드포인트를 둘 수 없습니다. 예를 들어 `src/routes/foo/+server.js`와 `src/routes/foo/bar/+server.js`는 `foo`와 `foo/bar`를 만들려고 하는데, 이는 불가능합니다.

이런 이유 등으로 항상 파일 확장자를 붙이기를 권합니다. `src/routes/foo.json/+server.js`와 `src/routes/foo/bar.json/+server.js`라면 `foo.json`과 `foo/bar.json` 파일이 사이좋게 나란히 생성됩니다.

*페이지*의 경우에는 `foo` 대신 `foo/index.html`을 써서 이 문제를 피합니다.

### 문제 해결 <!-- Troubleshooting -->

'The following routes were marked as prerenderable, but were not prerendered' 같은 에러가 나타난다면, 해당 라우트(페이지라면 부모 레이아웃)에 `export const prerender = true`가 있지만 프리렌더링 크롤러가 그 페이지에 도달하지 못해 프리렌더되지 않았기 때문입니다.

이런 라우트는 서버에서 동적으로 렌더링할 수 없으므로, 사람들이 해당 라우트에 접근하려고 하면 에러가 발생합니다. 해결 방법은 몇 가지가 있습니다:

* [`config.prerender.entries`](@sveltejs-kit-vite#prerender)나 [`entries`](#entries) 페이지 옵션에서 링크를 따라가 SvelteKit이 그 라우트를 찾을 수 있게 하세요. 동적 라우트(즉, `[parameters]`가 있는 페이지)가 다른 진입점을 크롤링해서 발견되지 않는다면 이 옵션에 그 링크를 추가하세요. 그렇지 않으면 SvelteKit이 매개변수에 어떤 값이 들어가야 하는지 모르므로 프리렌더되지 않습니다. 프리렌더 가능으로 표시되지 않은 페이지는 무시되며, 그 페이지에서 다른 페이지로 가는 링크도 크롤링되지 않습니다. 링크된 페이지 중 일부가 프리렌더 가능하더라도 마찬가지입니다.
* 서버 사이드 렌더링이 활성화된, 프리렌더되는 다른 페이지 중 하나에서 그 라우트로 가는 링크를 발견해 SvelteKit이 라우트를 찾을 수 있게 하세요.
* `export const prerender = true`를 `export const prerender = 'auto'`로 바꾸세요. `'auto'`인 라우트는 서버에서 동적으로 렌더링될 수 있습니다

## entries

SvelteKit은 *진입점*(entry point)에서 시작해 크롤링하면서 프리렌더할 페이지를 자동으로 찾습니다. 기본적으로 동적이 아닌 모든 라우트가 진입점으로 간주됩니다. 예를 들어 다음과 같은 라우트가 있다면...

```sh
/             # non-dynamic
/blog         # non-dynamic
/blog/[slug]  # dynamic, because of `[slug]`
```

...SvelteKit은 `/`와 `/blog`를 프리렌더하고, 그 과정에서 `<a href="/blog/hello-world">` 같은 링크를 발견해 프리렌더할 새 페이지를 얻습니다.

대부분은 이것으로 충분합니다. 하지만 `/blog/hello-world` 같은 페이지로 가는 링크가 없을 수도 있고(또는 프리렌더되는 페이지에는 없을 수도 있고), 이런 경우에는 SvelteKit에 그 페이지가 있다는 것을 알려 주어야 합니다.

이는 [`config.prerender.entries`](@sveltejs-kit-vite#prerender)를 쓰거나, 동적 라우트에 속한 `+page.js`, `+page.server.js`, `+server.js`에서 `entries` 함수를 내보내서 할 수 있습니다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}

export const prerender = true;
```

`entries`는 `async` 함수일 수 있으므로, 위 예제에서 (예를 들어) CMS나 데이터베이스에서 글 목록을 가져올 수 있습니다.

## ssr

보통 SvelteKit은 페이지를 서버에서 렌더링한 다음 그 HTML을 클라이언트로 보내고, 클라이언트에서 [하이드레이트](glossary#Hydration)합니다. 이는 프리렌더링이 페이지의 전체 내용을 저장하는 데도 필요합니다.

`ssr`을 `false`로 설정하면 대신 빈 '셸' 페이지를 렌더링합니다. 페이지를 서버에서 렌더링할 수 없을 때(예를 들어 `document` 같은 브라우저 전용 전역 객체를 사용하기 때문에) 유용하지만, 대부분의 경우에는 권장하지 않습니다([부록 참고](glossary#SSR)).

```js
/// file: +page.js
export const ssr = false;
// If both `ssr` and `csr` are `false`, nothing will be rendered!
```

루트 `+layout.js`에 `export const ssr = false`를 추가하면 앱 전체가 클라이언트에서만 렌더링됩니다. 사실상 앱을 [SPA](glossary#SPA)로 바꾸는 것입니다. [정적으로 생성된 사이트](glossary#SSG)를 만드는 것이 목표라면 이렇게 하면 안 됩니다.

> [!NOTE] 모든 페이지 옵션이 불리언이나 문자열 리터럴 값이면 SvelteKit은 이를 정적으로 평가합니다. 그렇지 않으면 옵션을 평가하기 위해 서버에서 `+page.js`나 `+layout.js` 파일을 가져옵니다(빌드 시점에, 그리고 앱이 완전히 정적이지 않다면 런타임에도). 두 번째 경우에는 모듈을 불러올 때 브라우저 전용 코드가 실행되면 안 됩니다. 실제로는 브라우저 전용 코드를 `+page.svelte`나 `+layout.svelte` 파일에서 가져와야 한다는 뜻입니다.

## csr

보통 SvelteKit은 서버에서 렌더링한 HTML을 상호작용할 수 있는 클라이언트 사이드 렌더링(CSR) 페이지로 [하이드레이트](glossary#Hydration)합니다. 어떤 페이지는 JavaScript가 전혀 필요 없습니다. 많은 블로그 글과 '소개' 페이지가 여기에 속합니다. 이런 경우에는 CSR을 끌 수 있습니다:

```js
/// file: +page.js
export const csr = false;
// If both `csr` and `ssr` are `false`, nothing will be rendered!
```

CSR을 끄면 클라이언트로 JavaScript를 전혀 보내지 않습니다. 즉, 다음과 같습니다:

* 웹 페이지가 HTML과 CSS만으로 동작해야 합니다.
* 모든 Svelte 컴포넌트 안의 `<script>` 태그가 제거됩니다.
* `<form>` 요소를 [점진적으로 향상](form-actions#Progressive-enhancement)할 수 없습니다.
* 링크는 브라우저가 전체 페이지 내비게이션으로 처리합니다.
* Hot Module Replacement(HMR)가 비활성화됩니다.

개발 중에는 (예를 들어 HMR을 활용하기 위해) 다음과 같이 `csr`을 켤 수 있습니다:

```js
/// file: +page.js
import { dev } from '$app/env';

export const csr = dev;
```

## trailingSlash

기본적으로 SvelteKit은 URL에서 후행 슬래시를 제거합니다. `/about/`에 방문하면 `/about`으로 리디렉션하는 응답을 보냅니다. 이 동작은 `trailingSlash` 옵션으로 바꿀 수 있으며, 값은 `'never'`(기본값), `'always'`, `'ignore'` 중 하나입니다.

다른 페이지 옵션처럼 이 값을 `+layout.js`나 `+layout.server.js`에서 내보내면 모든 하위 페이지에 적용됩니다. `+server.js` 파일에서도 이 설정을 내보낼 수 있습니다.

```js
/// file: src/routes/+layout.js
export const trailingSlash = 'always';
```

이 옵션은 [프리렌더링](#prerender)에도 영향을 줍니다. `trailingSlash`가 `always`이면 `/about` 같은 라우트는 `about/index.html` 파일이 되고, 그렇지 않으면 정적 웹 서버의 관례에 맞춰 `about.html`이 만들어집니다.

> [!NOTE] 후행 슬래시를 무시하는 것은 권장하지 않습니다. 두 경우에 상대 경로의 의미가 다르고(`/x`에서 `./y`는 `/y`이지만 `/x/`에서는 `/x/y`입니다), `/x`와 `/x/`가 서로 다른 URL로 취급되어 SEO에 해롭기 때문입니다.

## config

[어댑터](adapters)라는 개념 덕분에 SvelteKit은 다양한 플랫폼에서 실행될 수 있습니다. 플랫폼마다 배포를 더 세밀하게 조정하는 고유한 설정이 있을 수 있습니다. 예를 들어 Vercel에서는 앱의 일부는 엣지에, 나머지는 서버리스 환경에 배포하도록 고를 수 있습니다.

`config`는 최상위에 키-값 쌍이 있는 객체입니다. 그 아래의 구체적인 형태는 사용하는 어댑터에 따라 다릅니다. 모든 어댑터는 타입 안전성을 위해 가져다 쓸 수 있는 `Config` 인터페이스를 제공해야 합니다. 자세한 내용은 사용하는 어댑터의 문서를 참고하세요.

```js
// @filename: ambient.d.ts
declare module 'some-adapter' {
	export interface Config { runtime: string }
}

// @filename: index.js
// ---cut---
/// file: src/routes/+page.js
/** @type {import('some-adapter').Config} */
export const config = {
	runtime: 'edge'
};
```

`config` 객체는 최상위 수준에서만 병합됩니다(더 깊은 수준에서는 병합되지 *않습니다*). 따라서 상위 `+layout.js`의 값 중 일부만 덮어쓰고 싶다면 `+page.js`에서 모든 값을 반복할 필요가 없습니다. 예를 들어 다음 레이아웃 설정은...

```js
/// file: src/routes/+layout.js
export const config = {
	runtime: 'edge',
	regions: 'all',
	foo: {
		bar: true
	}
}
```

...다음 페이지 설정으로 덮어써지고...

```js
/// file: src/routes/+page.js
export const config = {
	regions: ['us1', 'us2'],
	foo: {
		baz: true
	}
}
```

...결과적으로 해당 페이지의 config 값은 `{ runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } }`가 됩니다.

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 페이지 옵션](/tutorial/kit/page-options)
