---
title: 어댑터
---

SvelteKit 앱을 배포하려면 먼저 배포 대상에 맞게 *변환*해야 합니다. 어댑터는 빌드된 앱을 입력으로 받아 배포용 결과물을 생성하는 작은 플러그인입니다.

여러 플랫폼을 위한 공식 어댑터가 있으며, 다음 페이지들에서 설명합니다:

- Cloudflare Workers와 Cloudflare Pages용 [`@sveltejs/adapter-cloudflare`](adapter-cloudflare)
- Netlify용 [`@sveltejs/adapter-netlify`](adapter-netlify)
- Node 서버용 [`@sveltejs/adapter-node`](adapter-node)
- Bun 서버용 [`@sveltejs/adapter-bun`](adapter-bun)
- 정적 사이트 생성(SSG)용 [`@sveltejs/adapter-static`](adapter-static)
- Vercel용 [`@sveltejs/adapter-vercel`](adapter-vercel)

그 밖의 플랫폼을 위한 [커뮤니티 제공 어댑터](/packages#sveltekit-adapters)도 있습니다.

## 어댑터 사용하기 <!-- Using adapters -->

[`npx sv add sveltekit-adapter`](/docs/cli/sveltekit-adapter)를 실행하면 어댑터를 설치하고 설정에 추가할 수 있습니다.

어댑터는 `vite.config.js`에서 지정합니다:

```js
/// file: vite.config.js
// @filename: ambient.d.ts
declare module 'svelte-adapter-foo' {
	const adapter: (opts?: any) => import('@sveltejs/kit').Adapter;
	export default adapter;
}

// @errors: 2554
// @filename: index.js
// ---cut---
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
+++import adapter from 'svelte-adapter-foo';+++

export default defineConfig({
	plugins: [
		sveltekit({
			+++adapter: adapter()+++
		})
	]
});
```

## 플랫폼별 컨텍스트 <!-- Platform-specific context -->

일부 어댑터는 요청에 대한 추가 정보에 접근할 수 있습니다. 예를 들어 Cloudflare Workers는 KV 네임스페이스 등을 담은 `env` 객체에 접근할 수 있습니다. 이 정보는 [훅](hooks)과 [서버 라우트](routing#server)에서 사용하는 `RequestEvent`에 `platform` 속성으로 전달될 수 있습니다. 자세한 내용은 각 어댑터의 문서를 참고하세요.
