---
title: 설정 없는 배포
---

`npx sv create`로 새 SvelteKit 프로젝트를 만들면 기본으로 [`adapter-auto`](https://github.com/sveltejs/kit/tree/main/packages/adapter-auto)가 설치됩니다. 이 어댑터는 배포할 때 지원되는 환경에 맞는 어댑터를 자동으로 설치해 사용합니다:

- [Cloudflare Workers](https://www.cloudflare.com/products/workers/)와 [Pages](https://developers.cloudflare.com/pages/)용 [`@sveltejs/adapter-cloudflare`](adapter-cloudflare)
- [Netlify](https://netlify.com/)용 [`@sveltejs/adapter-netlify`](adapter-netlify)
- [Vercel](https://vercel.com/)용 [`@sveltejs/adapter-vercel`](adapter-vercel)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)용 [`svelte-adapter-azure-swa`](https://github.com/geoffrich/svelte-adapter-azure-swa)
- [SST를 통한 AWS](https://sst.dev/docs/start/aws/svelte)용 [`svelte-kit-sst`](https://github.com/sst/v2/tree/master/packages/svelte-kit-sst)
- [Google Cloud Run](https://cloud.google.com/run)용 [`@sveltejs/adapter-node`](adapter-node)
- [Render](https://render.com)용 [`@sveltejs/adapter-node`](adapter-node)

배포 대상 환경을 정했다면 해당 어댑터를 `devDependencies`에 설치하는 것을 권장합니다. 그러면 어댑터가 lockfile에 추가되어 CI에서 설치 시간이 조금 줄어듭니다.

## 환경별 설정 <!-- Environment-specific configuration -->

[`adapter-vercel`](adapter-vercel)과 [`adapter-netlify`](adapter-netlify)의 `{ edge: true }` 같은 설정 옵션을 추가하려면 해당 어댑터를 직접 설치해야 합니다. `adapter-auto`는 옵션을 받지 않습니다.

## 커뮤니티 어댑터 추가하기 <!-- Adding community adapters -->

[adapters.js](https://github.com/sveltejs/kit/blob/main/packages/adapter-auto/adapters.js)를 수정해 풀 리퀘스트를 열면 다른 어댑터에 대한 설정 없는 지원을 추가할 수 있습니다.
