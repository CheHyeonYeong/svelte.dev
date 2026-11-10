---
title: 명령줄 인터페이스
---

SvelteKit 프로젝트는 [Vite](https://vitejs.dev)를 사용하므로, 대부분 Vite의 CLI를 쓰게 됩니다(보통은 `npm run dev/build/preview` 스크립트를 통해서):

- `vite dev` — 개발 서버를 시작합니다
- `vite build` — 앱의 프로덕션 버전을 빌드합니다
- `vite preview` — 프로덕션 버전을 로컬에서 실행합니다

다만 SvelteKit에는 프로젝트 초기화를 위한 자체 CLI도 있습니다:

## svelte-kit sync

`svelte-kit sync`는 프로젝트의 `tsconfig.json`과 생성된 모든 타입(라우팅 파일 안에서 `./$types`로 import할 수 있습니다)을 만듭니다. 새 프로젝트를 만들면 이 명령은 `prepare` 스크립트로 등록되어 npm 라이프사이클의 일부로 자동 실행되므로, 보통은 직접 실행할 필요가 없습니다.
