---
title: 이미지
---

이미지는 앱 성능에 큰 영향을 줄 수 있습니다. 최선의 결과를 얻으려면 다음과 같이 이미지를 최적화해야 합니다:

- `.avif`나 `.webp` 같은 최적의 형식으로 생성하기
- 화면 크기에 따라 여러 크기의 이미지 만들기
- 에셋이 효과적으로 캐시될 수 있게 하기

이 작업을 직접 하기는 번거롭습니다. 필요와 선호에 따라 쓸 수 있는 다양한 기법이 있습니다.

## Vite의 내장 처리 <!-- Vite's built-in handling -->

[Vite는 import한 에셋을 자동으로 처리](https://vitejs.dev/guide/assets.html)해 성능을 높여 줍니다. CSS `url()` 함수로 참조한 에셋도 여기에 포함됩니다. 캐시할 수 있도록 파일 이름에 해시가 붙고, `assetsInlineLimit`보다 작은 에셋은 인라인됩니다. Vite의 에셋 처리는 주로 이미지에 쓰이지만, 동영상이나 오디오 등에도 유용합니다.

```svelte
<script>
	import logo from '#lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

## @sveltejs/enhanced-img

`@sveltejs/enhanced-img`는 Vite의 내장 에셋 처리 위에서 동작하는 플러그인입니다. 설치만 하면 바로 쓸 수 있는 이미지 처리 기능을 제공하며, `avif`나 `webp` 같은 더 작은 파일 형식을 제공하고, 레이아웃 이동을 막기 위해 이미지 고유의 `width`와 `height`를 자동으로 설정하고, 다양한 기기를 위해 여러 크기의 이미지를 만들고, 개인정보 보호를 위해 EXIF 데이터를 제거합니다. SvelteKit 프로젝트뿐 아니라 Vite 기반이라면 어떤 프로젝트에서든 동작합니다.

> [!NOTE] `@sveltejs/enhanced-img`는 빌드 플러그인이므로 빌드 과정에서 여러분의 컴퓨터에 있는 파일만 최적화할 수 있습니다. 이미지가 다른 곳(데이터베이스, CMS, 백엔드에서 제공하는 경로 등)에 있다면 [CDN에서 이미지를 동적으로 로드하기](#Loading-images-dynamically-from-a-CDN)를 읽어 보세요.

### 설정 <!-- Setup -->

설치:

```sh
npm i -D @sveltejs/enhanced-img
```

`vite.config.js`를 수정합니다:

```js
/// file: vite.config.js
+++import { enhancedImages } from '@sveltejs/enhanced-img';+++
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		+++enhancedImages(), // must come before the SvelteKit plugin+++
		sveltekit({/* ... */})
	]
});
```

이미지 변환에는 계산 비용이 들기 때문에 첫 빌드는 더 오래 걸립니다. 하지만 빌드 결과물이 `./node_modules/.cache/imagetools`에 캐시되므로 이후 빌드는 빠릅니다.

### 기본 사용법 <!-- Basic usage -->

`.svelte` 컴포넌트에서 `<img>` 대신 `<enhanced:img>`를 사용하고, [Vite 에셋 import](https://vitejs.dev/guide/assets.html#static-asset-handling) 경로로 이미지 파일을 참조하세요:

```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

빌드 시점에 `<enhanced:img>` 태그는 여러 이미지 형식과 크기를 제공하는 `<picture>`로 감싼 `<img>`로 바뀝니다. 이미지는 품질 손실 없이 줄이는 것만 가능하므로, 필요한 가장 높은 해상도의 이미지를 제공해야 합니다. 이미지를 요청할 수 있는 다양한 기기 유형에 맞춰 더 작은 버전이 생성됩니다.

HiDPI 디스플레이(레티나 디스플레이라고도 합니다)를 위해 이미지를 2배 해상도로 제공해야 합니다. 더 작은 기기에 더 작은 버전을 제공하는 일은 `<enhanced:img>`가 자동으로 처리합니다.

> [!NOTE] `<style>` 블록에서 [태그 이름 CSS 선택자](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors#type_selectors)를 쓰려면, 태그 이름의 콜론을 이스케이프해 `enhanced\:img`로 써야 합니다.

### 이미지를 동적으로 고르기 <!-- Dynamically choosing an image -->

이미지 에셋을 직접 import해서 `<enhanced:img>`에 전달할 수도 있습니다. 정적 이미지 모음이 있고 그중 하나를 동적으로 고르거나 [순회하고](https://github.com/sveltejs/kit/blob/0ab1733e394b6310895a1d3bf0f126ce34531170/sites/kit.svelte.dev/src/routes/home/Showcase.svelte) 싶을 때 유용합니다. 이 경우 처리하고 싶다는 것을 나타내기 위해 아래처럼 `import` 문과 `<img>` 요소를 모두 수정해야 합니다.

```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>

<enhanced:img src={MyImage} alt="some alt text" />
```

[Vite의 `import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import)을 사용할 수도 있습니다. 이때는 [사용자 정의 쿼리](https://vitejs.dev/guide/features.html#custom-queries)로 `enhanced`를 지정해야 합니다:

```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,AVIF,gif,GIF,heif,HEIF,jpeg,JPEG,jpg,JPG,png,PNG,tiff,TIFF,webp,WEBP}',
		{
			eager: true,
			query: {
				enhanced: true
			}
		}
	)
</script>

{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

> [!NOTE] svg 이미지는 현재 정적으로만 지원됩니다

### 고유 크기 <!-- Intrinsic Dimensions -->

`width`와 `height`는 선택 사항입니다. 원본 이미지에서 추론할 수 있으며, `<enhanced:img>` 태그를 전처리할 때 자동으로 추가되기 때문입니다. 이 속성이 있으면 브라우저가 올바른 크기의 공간을 미리 확보해 [레이아웃 이동](https://web.dev/articles/cls)을 막을 수 있습니다. 다른 `width`와 `height`를 쓰고 싶다면 CSS로 이미지 스타일을 지정하면 됩니다. 전처리기가 `width`와 `height`를 대신 추가하므로, 둘 중 한 크기를 자동으로 계산하게 하고 싶다면 이를 명시해야 합니다:

```svelte
<style>
	.hero-image img {
		width: var(--size);
		height: auto;
	}
</style>
```

### `srcset`과 `sizes` <!-- `srcset` and `sizes` -->

디자인의 전체 너비를 차지하는 히어로 이미지처럼 큰 이미지가 있다면, 작은 기기에서는 더 작은 버전을 요청하도록 `sizes`를 지정해야 합니다. 예를 들어 1280px 이미지라면 다음과 같이 지정할 수 있습니다:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

`sizes`를 지정하면 `<enhanced:img>`가 작은 기기용 작은 이미지를 생성하고 `srcset` 속성을 채웁니다.

자동으로 생성되는 가장 작은 이미지의 너비는 540px입니다. 더 작은 이미지가 필요하거나 너비를 직접 지정하고 싶다면 `w` 쿼리 매개변수를 사용하면 됩니다:

```svelte
<enhanced:img
	src="./image.png?w=1280;640;400"
	sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

`sizes`를 제공하지 않으면 HiDPI/Retina 이미지와 표준 해상도 이미지가 생성됩니다. 브라우저가 [기기 픽셀 비율](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)이 높은 기기에서 이미지를 표시할 수 있도록, 제공하는 이미지는 표시하려는 해상도의 2배여야 합니다.

### 이미지별 변환 <!-- Per-image transforms -->

기본적으로 enhanced 이미지는 더 효율적인 형식으로 변환됩니다. 하지만 blur, quality, flatten, rotate 같은 다른 변환을 적용하고 싶을 수도 있습니다. 쿼리 문자열을 덧붙여 이미지별 변환을 실행할 수 있습니다:

```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

[전체 디렉티브 목록은 imagetools 저장소를 참고하세요](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md).

## CDN에서 이미지를 동적으로 로드하기 <!-- Loading images dynamically from a CDN -->

경우에 따라 빌드 시점에 이미지에 접근할 수 없을 수도 있습니다. 예를 들어 이미지가 콘텐츠 관리 시스템이나 다른 곳에 있는 경우입니다.

콘텐츠 전송 네트워크(CDN)를 사용하면 이런 이미지를 동적으로 최적화할 수 있고 크기 측면에서도 더 유연하지만, 설정에 드는 수고와 사용 비용이 생길 수 있습니다. 캐싱 전략에 따라서는 CDN에서 [304 응답](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)을 받기 전까지 브라우저가 캐시된 에셋 사본을 쓰지 못할 수도 있습니다. CDN은 `User-Agent` 헤더에 따라 적절한 형식을 제공할 수 있으므로 CDN을 대상으로 HTML을 만들면 `<img>` 태그를 쓸 수 있지만, 빌드 시점 최적화는 여러 소스를 가진 `<picture>` 태그를 만들어야 합니다. 마지막으로, 일부 CDN은 이미지를 필요할 때 생성하므로 트래픽이 적고 이미지가 자주 바뀌는 사이트에서는 성능에 나쁜 영향을 줄 수 있습니다.

CDN은 대개 라이브러리 없이도 사용할 수 있습니다. 하지만 Svelte를 지원하면서 이를 더 쉽게 해 주는 라이브러리가 여럿 있습니다. [`@unpic/svelte`](https://unpic.pics/img/svelte/)는 특정 CDN에 종속되지 않는 라이브러리로, 많은 제공자를 지원합니다. [Cloudinary](https://svelte.cloudinary.dev/)처럼 특정 CDN이 Svelte를 지원하는 경우도 있습니다. 마지막으로, Svelte를 지원하는 일부 콘텐츠 관리 시스템(CMS)([Contentful](https://www.contentful.com/sveltekit-starter-guide/), [Storyblok](https://www.storyblok.com/docs/guides/svelte), [Contentstack](https://www.contentstack.com/docs/developers/sample-apps/build-a-starter-website-with-sveltekit-and-contentstack) 등)은 이미지 처리 기능을 기본으로 제공합니다.

## 모범 사례 <!-- Best practices -->

- 이미지 유형마다 위에서 다룬 방법 중 알맞은 것을 사용하세요. 한 프로젝트에서 세 가지 방법을 모두 섞어 쓸 수 있습니다. 예를 들어 `<meta>` 태그용 이미지는 Vite의 내장 처리로 제공하고, 홈페이지의 이미지는 `@sveltejs/enhanced-img`로 표시하고, 사용자가 올린 콘텐츠는 동적인 방식으로 표시할 수 있습니다.
- 어떤 이미지 최적화 방식을 쓰든 모든 이미지를 CDN으로 제공하는 것을 고려해 보세요. CDN은 정적 에셋의 사본을 전 세계에 분산해 지연 시간을 줄여 줍니다.
- 원본 이미지는 품질과 해상도가 좋아야 하며, HiDPI 기기를 위해 표시될 너비의 2배 너비여야 합니다. 이미지 처리로 작은 화면에 맞게 이미지를 줄여 대역폭을 아낄 수는 있지만, 이미지를 키우기 위해 없는 픽셀을 만들어 내는 것은 대역폭 낭비입니다.
- 페이지 디자인의 전체 너비를 차지하는 히어로 이미지처럼 모바일 기기 너비(대략 400px)보다 훨씬 큰 이미지에는 `sizes`를 지정해 작은 기기에서 더 작은 이미지를 제공할 수 있게 하세요.
- [최대 콘텐츠풀 페인트(LCP)](https://web.dev/articles/lcp) 이미지처럼 중요한 이미지는 가능한 한 일찍 로드되도록 `fetchpriority="high"`를 설정하고 `loading="lazy"`를 피하세요.
- 이미지에 컨테이너나 스타일을 지정해 크기를 제한하고, 페이지가 로드되는 동안 이리저리 움직여 [누적 레이아웃 이동(CLS)](https://web.dev/articles/cls)에 영향을 주지 않게 하세요. `width`와 `height`는 이미지가 아직 로드 중일 때 브라우저가 공간을 확보하는 데 도움이 되므로, `@sveltejs/enhanced-img`가 `width`와 `height`를 대신 추가해 줍니다.
- 항상 좋은 `alt` 텍스트를 제공하세요. 그렇게 하지 않으면 Svelte 컴파일러가 경고합니다.
- `sizes`에서 `em`이나 `rem`을 사용하면서 이 단위의 기본 크기를 바꾸지 마세요. `sizes`나 `@media` 쿼리에서 `em`과 `rem`은 모두 사용자의 기본 `font-size`를 뜻하도록 정의되어 있습니다. `sizes="(min-width: 768px) min(100vw, 108rem), 64rem"` 같은 `sizes` 선언에서, CSS로 바꾼 경우 페이지에서 이미지 배치를 실제로 결정하는 `em`이나 `rem`이 달라질 수 있습니다. 예를 들어 `html { font-size: 62.5%; }` 같은 코드를 쓰지 마세요. 그러면 브라우저 프리로더가 확보한 자리가 CSS 객체 모델이 만들어진 뒤의 실제 자리보다 커지게 됩니다.
