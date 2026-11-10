---
title: 싱글 페이지 앱
---

*폴백 페이지*(fallback page)를 지정하면 SvelteKit 앱을 완전히 클라이언트에서 렌더링되는 싱글 페이지 앱(SPA)으로 바꿀 수 있습니다. 이 페이지는 프리렌더링된 페이지를 반환하는 등 다른 방법으로 제공할 수 없는 모든 URL에 대해 제공됩니다.

> [!NOTE] SPA 모드는 콘텐츠를 보여 주기 전에 여러 번의 네트워크 왕복(빈 HTML 문서, 그다음 JavaScript, 그다음 페이지에 필요한 데이터)을 강제하므로 성능에 큰 악영향을 줍니다. 로컬 네트워크에서 앱을 제공하는 경우(예: 로컬에서 제공되는 SPA를 감싼 모바일 앱)가 아니라면, 특히 모바일 기기의 지연 시간을 생각하면 시작이 늦어집니다. SEO에도 해롭습니다. 성능 때문에 사이트 순위가 떨어지는 경우가 많고(SPA는 [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)를 통과하지 못할 가능성이 훨씬 높습니다), JS를 렌더링하지 않는 검색 엔진에서는 제외되며, JS를 렌더링하는 검색 엔진에서도 사이트가 덜 자주 갱신됩니다. 마지막으로, JavaScript가 실패하거나 꺼져 있으면(이런 일은 [생각보다 자주 일어납니다](https://kryogenix.org/code/browser/everyonehasjs.html)) 사용자가 앱을 이용할 수 없게 됩니다.
>
> SPA 모드를 쓸 때 가능한 한 많은 페이지(특히 홈페이지)를 [프리렌더링](#Prerendering-individual-pages)하면 이런 단점을 피할 수 있습니다. 모든 페이지를 프리렌더링할 수 있다면 SPA 대신 [정적 사이트 생성](adapter-static)을 쓰면 됩니다. 그렇지 않다면 서버 사이드 렌더링을 지원하는 어댑터를 쓰는 것을 적극 검토하세요. SvelteKit은 넉넉한 무료 요금제를 제공하는 여러 업체용 어댑터를 공식 지원합니다.

## 사용법 <!-- Usage -->

먼저 프리렌더링하지 않을 페이지에서 SSR을 끕니다. 이 페이지들은 폴백 페이지를 통해 제공됩니다. 예를 들어 기본적으로 모든 페이지를 폴백 페이지로 제공하려면 아래처럼 루트 레이아웃을 수정하면 됩니다. 가능한 곳에서는 [개별 페이지와 디렉터리에 다시 프리렌더링을 적용](#Prerendering-individual-pages)하는 것이 좋습니다.
```js
/// file: src/routes/+layout.js
export const ssr = false;
```

서버 사이드 로직(즉, `+page.server.js`, `+layout.server.js`, `+server.js` 파일)이 없다면 [`adapter-static`](adapter-static)으로 SPA를 만들 수 있습니다. `npm i -D @sveltejs/adapter-static`으로 `adapter-static`을 설치하고 `fallback` 옵션과 함께 `vite.config.js`에 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				fallback: '200.html' // may differ from host to host
			})
		})
	]
});
```

`fallback` 페이지는 SvelteKit이 페이지 템플릿(예: `app.html`)으로 만드는 HTML 페이지로, 앱을 불러온 뒤 올바른 라우트로 이동합니다. 예를 들어 정적 웹 호스트인 [Surge](https://surge.sh/help/adding-a-200-page-for-client-side-routing)에서는 정적 에셋이나 프리렌더링된 페이지에 해당하지 않는 모든 요청을 처리할 `200.html` 파일을 추가할 수 있습니다.

호스트에 따라서는 전혀 다른 이름일 수도 있으니 플랫폼의 문서를 참고하세요. 프리렌더링과 충돌할 수 있으므로 가능하면 `index.html`은 피하는 것을 권장합니다.

> [!NOTE] 폴백 페이지는 임의의 경로에 대한 요청에 응답하는 데 쓰이므로, [`paths.relative`](@sveltejs-kit-vite#paths) 값과 관계없이 항상 절대 에셋 경로(즉, `.`이 아니라 `/`로 시작하는 경로)를 담고 있다는 점에 유의하세요.

## 개별 페이지 프리렌더링하기 <!-- Prerendering individual pages -->

특정 페이지를 프리렌더링하고 싶다면 앱의 해당 부분에 대해서만 `prerender`와 함께 `ssr`을 다시 켜면 됩니다:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

이 페이지를 배포하는 데 Node 서버나 JavaScript를 실행할 수 있는 서버는 필요 없습니다. 프로젝트를 빌드하는 동안에만 페이지를 서버 렌더링해서, 어떤 정적 웹 호스트에서든 제공할 수 있는 `.html` 페이지를 출력합니다.

## Apache

[Apache](https://httpd.apache.org/)에서 SPA를 실행하려면 `static/.htaccess` 파일을 추가해 요청을 폴백 페이지로 보내야 합니다:

```
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	RewriteRule ^200\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule . /200.html [L]
</IfModule>
```
