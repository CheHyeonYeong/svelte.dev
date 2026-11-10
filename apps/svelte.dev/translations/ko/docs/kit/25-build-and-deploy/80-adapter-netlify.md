---
title: Netlify
---

Netlify에 배포하려면 [`adapter-netlify`](https://github.com/sveltejs/kit/tree/main/packages/adapter-netlify)를 사용하세요.

이 어댑터는 [`adapter-auto`](adapter-auto)를 사용할 때 기본으로 설치되지만, 프로젝트에 직접 추가하면 Netlify 전용 옵션을 지정할 수 있습니다.

## 사용법 <!-- Usage -->

[`npx sv add sveltekit-adapter="adapter:netlify"`](/docs/cli/sveltekit-adapter)를 실행하거나, `npm i -D @sveltejs/adapter-netlify`로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				// See below for an explanation of these options
				edge: false,
				split: false,
				publish: 'build'
			})
		})
	]
});
```

## 옵션 <!-- Options -->

### `edge`

`true`이면 앱이 표준 Node 기반 함수 대신 [Netlify Edge Function](https://docs.netlify.com/build/edge-functions/overview/)으로 배포됩니다.

### `split`

`true`이면 앱 전체를 하나의 함수로 만드는 대신 여러 함수로 나눕니다.

### `publish`

프리렌더링된 페이지와 정적 에셋(`static`의 내용과 SvelteKit이 생성한 클라이언트 사이드 JS 및 CSS)을 기록할 디렉터리입니다. 기본값은 `build`입니다.

## SvelteKit 기능에 대한 Netlify의 대안 <!-- Netlify alternatives to SvelteKit functionality -->

Netlify 기능에 의존하지 않고 SvelteKit이 직접 제공하는 기능만으로 앱을 만들 수 있습니다. 이런 기능의 SvelteKit 버전을 쓰면 dev 모드에서 사용할 수 있고, 통합 테스트로 검증할 수 있으며, 나중에 Netlify를 떠나기로 했을 때 다른 어댑터에서도 그대로 동작합니다. 하지만 상황에 따라서는 이런 기능의 Netlify 버전을 쓰는 편이 나을 수도 있습니다. 예를 들어 이미 Netlify에 호스팅된 앱을 SvelteKit으로 마이그레이션하는 경우가 그렇습니다.

### `_headers`와 `_redirects` <!-- `_headers` and `_redirects` -->

Netlify 전용 파일인 [`_headers`](https://docs.netlify.com/routing/headers/#syntax-for-the-headers-file)와 [`_redirects`](https://docs.netlify.com/routing/redirects/redirect-options/)를 프로젝트 루트 폴더에 두면 (이미지 같은) 정적 에셋 응답에 사용할 수 있습니다. `netlify.toml`에서 [`[[redirects]]`](https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file)를 사용할 수도 있습니다.

### Netlify Forms

1. [여기](https://docs.netlify.com/forms/setup/#html-forms)에 설명된 대로 Netlify HTML 폼을 만듭니다. 예: `/routes/contact/+page.svelte`. (숨겨진 `form-name` input 요소를 추가하는 것을 잊지 마세요!)
2. Netlify의 빌드 봇은 배포 시점에 HTML 파일을 파싱하므로, 폼이 HTML로 [프리렌더링](page-options#prerender)되어 있어야 합니다. `contact.svelte`에 `export const prerender = true`를 추가해 해당 페이지만 프리렌더링하거나, `prerender.force: true` 옵션을 설정해 모든 페이지를 프리렌더링할 수 있습니다.
3. Netlify 폼에 `<form netlify ... action="/success">` 같은 [커스텀 성공 메시지](https://docs.netlify.com/forms/setup/#success-messages)가 있다면, 그에 대응하는 `/routes/success/+page.svelte`가 존재하고 프리렌더링되는지 확인하세요.

### Netlify Functions

이 어댑터를 쓰면 SvelteKit 엔드포인트는 [Netlify Functions](https://docs.netlify.com/functions/overview/)로 호스팅됩니다. Netlify 함수 핸들러에는 [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) 정보를 포함한 추가 컨텍스트가 있습니다. 이 컨텍스트는 훅과 `+page.server` 또는 `+layout.server` 엔드포인트 안에서 `event.platform.context` 필드로 접근할 수 있습니다. 어댑터 설정에서 `edge` 속성이 `false`이면 [서버리스 함수](https://docs.netlify.com/functions/overview/)이고, `true`이면 [엣지 함수](https://docs.netlify.com/edge-functions/overview/#app)입니다.

```js
// @errors: 2339
// @filename: ambient.d.ts
/// <reference types="@sveltejs/adapter-netlify" />
// @filename: +page.server.js
// ---cut---
/// file: +page.server.js
/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context); // shows up in your functions log in the Netlify app
};
```

또한 직접 만든 Netlify 함수를 추가할 수도 있습니다. 함수를 넣을 디렉터리를 만들고 `netlify.toml` 파일에 설정을 추가하면 됩니다. 예를 들면 다음과 같습니다:

```toml
[build]
	command = "npm run build"
	publish = "build"

[functions]
	directory = "functions"
```

## 문제 해결 <!-- Troubleshooting -->

### 파일 시스템 접근하기 <!-- Accessing the file system -->

엣지 배포에서는 `fs`를 사용할 수 없습니다.

서버리스 배포에서는 `fs`를 사용할 _수는_ 있지만, 프로젝트의 파일이 배포로 복사되지 않으므로 기대한 대로 동작하지 않습니다. 대신 `$app/server`의 [`read`]($app-server#read) 함수로 파일에 접근하세요. 이 함수는 배포된 공개 에셋 위치에서 파일을 가져오므로 엣지 배포에서도 동작합니다.

또는 해당 라우트를 [프리렌더링](page-options#prerender)할 수도 있습니다.
