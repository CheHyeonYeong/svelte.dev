---
title: 성능
---

SvelteKit은 별도 설정 없이도 애플리케이션의 성능을 최대한 끌어올리기 위해 많은 일을 합니다:

- 코드 분할: 현재 페이지에 필요한 코드만 로드합니다
- 에셋 프리로드: (파일이 다른 파일을 요청하는) '워터폴'을 방지합니다
- 파일 해싱: 에셋을 영구적으로 캐시할 수 있게 합니다
- 요청 병합: 서로 다른 서버 `load` 함수에서 가져오는 데이터를 하나의 HTTP 요청으로 묶습니다
- 병렬 로딩: 서로 다른 유니버설 `load` 함수가 데이터를 동시에 가져옵니다
- 데이터 인라이닝: 서버 렌더링 중 `fetch`로 보낸 요청을 브라우저에서 새 요청 없이 재사용합니다
- 보수적인 무효화: `load` 함수를 꼭 필요할 때만 다시 실행합니다
- 프리렌더링(필요하면 라우트별로 설정 가능): 동적 데이터가 없는 페이지를 즉시 제공합니다
- 링크 프리로드: 클라이언트 사이드 내비게이션에 필요한 데이터와 코드를 미리 내다보고 가져옵니다

그래도 느려지는 원인을 (아직) 모두 없앨 수는 없습니다. 성능을 최대한 짜내려면 다음 팁을 염두에 두세요.

## 문제 진단 <!-- Diagnosing issues -->

Google의 [PageSpeed Insights](https://pagespeed.web.dev/)와 (더 깊은 분석을 위한) [WebPageTest](https://www.webpagetest.org/)는 이미 인터넷에 배포된 사이트의 성능 특성을 파악하는 데 아주 좋은 도구입니다.

브라우저에도 배포된 사이트든 로컬에서 실행 중인 사이트든 분석할 수 있는 유용한 개발자 도구가 들어 있습니다:

* Chrome - [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview#devtools), [Network](https://developer.chrome.com/docs/devtools/network), [Performance](https://developer.chrome.com/docs/devtools/performance) 개발자 도구
* Edge - [Lighthouse](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/lighthouse/lighthouse-tool), [Network](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/), [Performance](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/evaluate-performance/) 개발자 도구
* Firefox - [Network](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/), [Performance](https://hacks.mozilla.org/2022/03/performance-tool-in-firefox-devtools-reloaded/) 개발자 도구
* Safari - [웹 페이지 성능 향상하기](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/Web_Inspector_Tutorial/EnhancingyourWebpagesPerformance/EnhancingyourWebpagesPerformance.html)

로컬에서 `dev` 모드로 실행 중인 사이트는 프로덕션 앱과 다르게 동작하므로, 성능 테스트는 빌드한 뒤 [프리뷰](building-your-app#Preview-your-app) 모드에서 해야 합니다.

### 계측 <!-- Instrumenting -->

브라우저의 네트워크 탭에서 어떤 API 호출이 오래 걸리는 것을 보고 그 이유를 알고 싶다면, [OpenTelemetry](https://opentelemetry.io/)나 [Server-Timing 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 같은 도구로 백엔드를 계측하는 것을 고려해 보세요.

## 에셋 최적화 <!-- Optimizing assets -->

### 이미지 <!-- Images -->

이미지 파일 크기를 줄이는 것은 사이트 성능에 가장 큰 영향을 주는 변경 중 하나인 경우가 많습니다. Svelte는 이를 쉽게 해 주는 `@sveltejs/enhanced-img` 패키지를 제공하며, 자세한 내용은 [이미지](images) 페이지에 있습니다. 또한 Lighthouse는 가장 문제가 큰 이미지를 찾아내는 데 유용합니다.

### 동영상 <!-- Videos -->

동영상 파일은 매우 클 수 있으므로 최적화에 특히 신경 써야 합니다:

- [Handbrake](https://handbrake.fr/) 같은 도구로 동영상을 압축하세요. `.webm`이나 `.mp4` 같은 웹 친화적인 형식으로 변환하는 것도 고려해 보세요.
- 스크롤해야 보이는 위치에 있는 동영상은 `preload="none"`으로 [지연 로드](https://web.dev/articles/lazy-loading-video)할 수 있습니다(다만 사용자가 _실제로_ 재생을 시작할 때 재생이 느려진다는 점에 유의하세요).
- 소리가 없는 동영상에서는 [FFmpeg](https://ffmpeg.org/) 같은 도구로 오디오 트랙을 제거하세요.

### 폰트 <!-- Fonts -->

SvelteKit은 사용자가 페이지를 방문하면 중요한 `.js`와 `.css` 파일을 자동으로 프리로드하지만, 폰트는 기본적으로 프리로드하지 _않습니다_. 그렇게 하면 불필요한 파일(CSS에서 참조하지만 현재 페이지에서는 실제로 쓰지 않는 폰트 굵기 등)까지 다운로드될 수 있기 때문입니다. 그렇긴 해도 폰트를 올바르게 프리로드하면 사이트가 체감상 얼마나 빠른지에 큰 차이를 만들 수 있습니다. [`handle`](hooks#handle) 훅에서 폰트를 포함하는 `preload` 필터와 함께 `resolve`를 호출하면 됩니다:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	return resolve(event, {
		preload: (asset) => {
			if (asset.type === 'font') {
				return asset.filename === 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2';
			}

			return true;
		}
	});
}
```

`filename`은 프로젝트 루트를 기준으로 한 소스 파일 이름이며, JS와 CSS 에셋은 Vite가 번들링하므로 `asset.type === 'font'`일 때만 사용할 수 있습니다.

폰트를 [서브셋](https://web.dev/learn/performance/optimize-web-fonts#subset_your_web_fonts)으로 만들면 폰트 파일 크기를 줄일 수 있습니다.

## 코드 크기 줄이기 <!-- Reducing code size -->

### Svelte 버전 <!-- Svelte version -->

최신 버전의 Svelte를 사용하길 권합니다. Svelte 5는 Svelte 4보다 작고 빠르며, Svelte 4는 Svelte 3보다 작고 빠릅니다.

### 패키지 <!-- Packages -->

[`rollup-plugin-visualizer`](https://www.npmjs.com/package/rollup-plugin-visualizer)는 어떤 패키지가 사이트 크기에 가장 크게 기여하는지 파악하는 데 도움이 됩니다. 빌드 결과물을 직접 살펴보거나(출력을 읽기 쉽게 하려면 [Vite 설정](https://vitejs.dev/config/build-options.html#build-minify)에서 `build: { minify: false }`를 사용하되, 앱을 배포하기 전에 되돌리는 것을 잊지 마세요), 브라우저 개발자 도구의 네트워크 탭을 통해 제거할 수 있는 코드를 찾을 수도 있습니다.

### 외부 스크립트 <!-- External scripts -->

브라우저에서 실행되는 서드파티 스크립트의 수를 최소화하세요. 예를 들어 JavaScript 기반 분석 도구 대신 서버 사이드 구현을 고려해 보세요. [Cloudflare](https://www.cloudflare.com/web-analytics/), [Netlify](https://docs.netlify.com/monitor-sites/site-analytics/), [Vercel](https://vercel.com/docs/analytics) 등 SvelteKit 어댑터가 있는 많은 플랫폼이 이런 기능을 제공합니다.

서드파티 스크립트를 웹 워커에서 실행하려면(메인 스레드를 막지 않게 됩니다) [Partytown의 SvelteKit 통합](https://partytown.qwik.dev/sveltekit/)을 사용하세요.

### 선택적 로딩 <!-- Selective loading -->

정적 `import` 선언으로 가져온 코드는 페이지의 나머지 부분과 함께 자동으로 번들링됩니다. 어떤 조건을 만족할 때만 필요한 코드가 있다면, 동적 `import(...)` 형식을 사용해 그 컴포넌트를 선택적으로 지연 로드하세요.

## 내비게이션 <!-- Navigation -->

### 프리로드 <!-- Preloading -->

[링크 옵션](link-options)을 사용해 필요한 코드와 데이터를 미리 프리로드하면 클라이언트 사이드 내비게이션을 빠르게 할 수 있습니다. 새 SvelteKit 앱을 만들면 `<body>` 요소에 기본으로 설정되어 있습니다.

### 필수가 아닌 데이터 <!-- Non-essential data -->

로드가 느리고 당장 필요하지 않은 데이터라면, `load` 함수가 반환하는 객체에 데이터 자체 대신 프로미스를 담을 수 있습니다. 서버 `load` 함수의 경우 이렇게 하면 데이터가 내비게이션(또는 첫 페이지 로드) 이후에 [스트리밍](load#Streaming-with-promises)됩니다.

### 워터폴 방지 <!-- Preventing waterfalls -->

성능을 가장 크게 떨어뜨리는 원인 중 하나는 *워터폴*이라고 부르는 것으로, 요청이 차례대로 하나씩 이어지는 현상입니다. 서버에서도 브라우저에서도 일어날 수 있지만, 멀리 있는 서버를 호출하는 모바일 사용자처럼 데이터가 더 먼 거리나 느린 네트워크를 거쳐야 할 때 특히 비용이 큽니다.

브라우저에서는 HTML이 요청 체인을 시작할 때 워터폴이 생길 수 있습니다. 예를 들어 JS를 요청하고, 그 JS가 CSS를 요청하고, 그 CSS가 배경 이미지와 웹 폰트를 요청하는 식입니다. SvelteKit은 [`modulepreload`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload) 태그나 헤더를 추가해 이런 종류의 문제를 대부분 해결해 주지만, [개발자 도구의 네트워크 탭](#Diagnosing-issues)을 보고 추가로 프리로드해야 할 리소스가 있는지 확인해야 합니다.
- [웹 폰트](#Optimizing-assets-Fonts)는 직접 처리해야 하므로, 웹 폰트를 쓴다면 이 부분에 특히 주의하세요.
- [싱글 페이지 앱(SPA) 모드](single-page-apps)를 켜면 이런 워터폴이 생깁니다. SPA 모드에서는 빈 페이지가 생성되고, 그 페이지가 JavaScript를 가져오고, 그 JavaScript가 마침내 페이지를 로드하고 렌더링합니다. 그 결과 픽셀 하나라도 표시되기 전에 네트워크 왕복이 추가로 발생합니다.

워터폴은 브라우저에서든 서버에서든 백엔드를 호출할 때도 생길 수 있습니다. 예를 들어 유니버설 `load` 함수가 현재 사용자를 가져오는 API를 호출하고, 그 응답의 정보로 저장된 항목 목록을 가져오고, 다시 _그_ 응답으로 각 항목의 세부 정보를 가져온다면, 브라우저는 여러 요청을 차례대로 보내게 됩니다. 이는 성능에 치명적이며, 특히 백엔드에서 물리적으로 멀리 떨어진 사용자에게 그렇습니다.
- 이 문제는 [서버 `load` 함수](load#Universal-vs-server)를 사용해 의존 관계에 있는 백엔드 서비스 요청을 브라우저가 아닌 서버에서 보내는 방식으로 피하세요. 다만 서버 `load` 함수도 워터폴에서 자유롭지는 않습니다(지연 시간이 큰 왕복이 거의 없으므로 비용은 훨씬 적습니다). 예를 들어 데이터베이스에서 현재 사용자를 조회한 다음 그 데이터로 저장된 항목 목록을 다시 조회한다면, 보통은 데이터베이스 조인을 사용해 쿼리 하나로 처리하는 편이 더 빠릅니다.

## 호스팅 <!-- Hosting -->

지연 시간을 최소화하려면 프론트엔드를 백엔드와 같은 데이터 센터에 두어야 합니다. 중앙 백엔드가 없는 사이트라면, 많은 SvelteKit 어댑터가 _엣지_ 배포를 지원합니다. 즉 각 사용자의 요청을 가까운 서버에서 처리하는 방식으로, 로딩 시간을 크게 줄일 수 있습니다. 일부 어댑터는 [라우트별로 배포를 설정](page-options#config)하는 기능도 지원합니다. 이미지를 CDN(보통 엣지 네트워크입니다)에서 제공하는 것도 고려해 보세요. 많은 SvelteKit 어댑터의 호스트가 이를 자동으로 해 줍니다.

호스트가 HTTP/2 이상을 사용하는지 확인하세요. Vite의 코드 분할은 캐시 효율을 높이기 위해 작은 파일을 많이 만들어 뛰어난 성능을 내지만, 이는 HTTP/2로 파일을 병렬로 로드할 수 있다는 것을 전제로 합니다.

## 더 읽어보기 <!-- Further reading -->

대부분의 경우, 성능 좋은 SvelteKit 앱을 만드는 것은 성능 좋은 웹 앱을 만드는 것과 같습니다. [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) 같은 일반적인 성능 자료의 내용을 여러분이 만드는 어떤 웹 경험에든 적용할 수 있을 것입니다.
