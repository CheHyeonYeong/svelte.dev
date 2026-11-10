---
title: SEO
---

SEO에서 가장 중요한 것은 웹 곳곳에서 많이 링크되는 고품질 콘텐츠를 만드는 것입니다. 그렇지만 검색 순위가 잘 나오는 사이트를 만들기 위해 고려해야 할 기술적인 사항도 몇 가지 있습니다.

## 기본 제공 기능 <!-- Out of the box -->

### SSR

최근 몇 년 사이 검색 엔진이 클라이언트 사이드 JavaScript로 렌더링된 콘텐츠도 더 잘 색인하게 되었지만, 서버 사이드 렌더링된 콘텐츠가 더 자주, 더 안정적으로 색인됩니다. SvelteKit은 기본적으로 SSR을 사용하며, [`handle`](hooks#handle)에서 끌 수도 있지만 특별한 이유가 없다면 켜 두는 것이 좋습니다.

> [!NOTE] SvelteKit의 렌더링은 매우 유연하게 설정할 수 있어서, 필요하다면 [동적 렌더링](https://developers.google.com/search/docs/advanced/javascript/dynamic-rendering)을 구현할 수도 있습니다. 다만 SSR에는 SEO 말고도 다른 이점이 있으므로 일반적으로 권장하지는 않습니다.

### 성능 <!-- Performance -->

[Core Web Vitals](https://web.dev/vitals/#core-web-vitals) 같은 신호는 검색 엔진 순위에 영향을 줍니다. Svelte와 SvelteKit은 오버헤드가 최소한이라 고성능 사이트를 만들기가 더 쉽습니다. Google의 [PageSpeed Insights](https://pagespeed.web.dev/)나 [Lighthouse](https://developers.google.com/web/tools/lighthouse)로 사이트 성능을 테스트할 수 있습니다. SvelteKit의 기본 [하이브리드 렌더링](glossary#Hybrid-app) 모드를 사용하고 [이미지를 최적화](images)하는 것처럼 몇 가지 핵심 조치만으로도 사이트 속도를 크게 높일 수 있습니다. 자세한 내용은 [성능 페이지](performance)를 읽어 보세요.

### 정규화된 URL <!-- Normalized URLs -->

중복 URL은 SEO에 나쁘기 때문에, SvelteKit은 후행 슬래시가 있는 경로를 후행 슬래시가 없는 경로로(또는 [설정](page-options#trailingSlash)에 따라 그 반대로) 리디렉션합니다.

## 수동 설정 <!-- Manual setup -->

### &lt;title&gt;과 &lt;meta&gt; <!-- &lt;title&gt; and &lt;meta&gt; -->

모든 페이지에는 [`<svelte:head>`](../svelte/svelte-head) 안에 잘 작성된 고유한 `<title>`과 `<meta name="description">` 요소가 있어야 합니다. 내용을 잘 설명하는 제목과 설명을 쓰는 방법, 그리고 검색 엔진이 콘텐츠를 이해하기 쉽게 만드는 그 밖의 제안은 Google의 [Lighthouse SEO 감사](https://web.dev/lighthouse-seo/) 문서에서 찾을 수 있습니다.

> [!NOTE] 흔히 쓰는 패턴은 페이지 [`load`](load) 함수에서 SEO 관련 `data`를 반환한 다음, 루트 [레이아웃](routing#layout)의 `<svelte:head>`에서 이를 ([`page.data`]($app-state)로) 사용하는 것입니다.

### 사이트맵 <!-- Sitemaps -->

[사이트맵](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap)은 검색 엔진이 사이트 안의 페이지에 우선순위를 매기는 데 도움이 되며, 콘텐츠가 많을 때 특히 그렇습니다. 엔드포인트를 사용해 사이트맵을 동적으로 만들 수 있습니다:

```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
			xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
		>
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
```
