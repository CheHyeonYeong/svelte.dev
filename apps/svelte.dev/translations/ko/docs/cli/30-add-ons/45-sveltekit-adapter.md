---
title: sveltekit-adapter
---

[SvelteKit 어댑터](/docs/kit/adapters)를 사용하면 다양한 플랫폼에 사이트를 배포할 수 있습니다. 이 애드온으로는 공식 제공되는 SvelteKit 어댑터를 설정할 수 있으며, 그 밖에 여러 [커뮤니티 제공 어댑터](https://www.sveltesociety.dev/packages?category=sveltekit-adapters)도 있습니다.

## 사용법 <!-- Usage -->

```sh
npx sv add sveltekit-adapter
```

## 제공되는 것 <!-- What you get -->

- 선택한 SvelteKit 어댑터 설치 및 `svelte.config.js`에 설정

## 옵션 <!-- Options -->

### adapter

사용할 SvelteKit 어댑터:

- `auto` — [`@sveltejs/adapter-auto`](/docs/kit/adapter-auto)는 알맞은 어댑터를 자동으로 고르지만, 설정할 수 있는 부분이 적습니다
- `node` — [`@sveltejs/adapter-node`](/docs/kit/adapter-node)는 독립 실행형 Node 서버를 생성합니다
- `static` — [`@sveltejs/adapter-static`](/docs/kit/adapter-static)을 사용하면 SvelteKit을 정적 사이트 생성기(SSG)로 쓸 수 있습니다
- `vercel` — [`@sveltejs/adapter-vercel`](/docs/kit/adapter-vercel)을 사용하면 Vercel에 배포할 수 있습니다
- `cloudflare` — [`@sveltejs/adapter-cloudflare`](/docs/kit/adapter-cloudflare)를 사용하면 Cloudflare에 배포할 수 있습니다
- `netlify` — [`@sveltejs/adapter-netlify`](/docs/kit/adapter-netlify)를 사용하면 Netlify에 배포할 수 있습니다

```sh
npx sv add sveltekit-adapter="adapter:node"
```

### cloudflare 타깃 <!-- cloudflare target -->

Cloudflare Workers와 Pages 중 어디에 배포할지 정합니다. `cloudflare` 어댑터에서만 사용할 수 있습니다.

```sh
npx sv add sveltekit-adapter="adapter:cloudflare+cfTarget:workers"
```
