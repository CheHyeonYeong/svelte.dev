---
title: SvelteKit이란?
---

Svelte가 *컴포넌트 프레임워크*라면, SvelteKit은 프로덕션 수준의 무언가를 만들 때 마주치는 까다로운 문제들을 해결해 주는 *앱 프레임워크*(누구에게 묻느냐에 따라서는 '메타프레임워크')입니다:

- 라우팅
- 서버 사이드 렌더링
- 데이터 가져오기
- 서비스 워커
- TypeScript 통합
- 프리렌더링
- 싱글 페이지 앱
- 라이브러리 패키징
- 최적화된 프로덕션 빌드
- 다양한 호스팅 업체로의 배포
- ...그 밖에 여러 가지

SvelteKit 앱은 기본적으로 서버에서 렌더링되므로(전통적인 '멀티 페이지 앱', 즉 MPA처럼) 첫 로딩 성능과 SEO 특성이 뛰어납니다. 그 뒤에는 클라이언트 사이드 내비게이션으로 전환할 수 있어서(최신 '싱글 페이지 앱', 즉 SPA처럼), 사용자가 페이지를 이동할 때 모든 것(서드파티 분석 코드 같은 것까지)을 버벅거리며 다시 불러오지 않아도 됩니다. SvelteKit 앱은 JavaScript가 실행되는 곳이라면 어디서든 실행할 수 있지만, 앞으로 보겠지만 사용자는 JavaScript를 전혀 실행하지 않아도 될 수도 있습니다.

복잡하게 들린다고요? 걱정하지 마세요. SvelteKit은 여러분과 함께 성장하는 프레임워크입니다! 간단하게 시작해서 필요할 때마다 새 기능을 더해 가면 됩니다.

## 프로젝트 구조 <!-- Project structure -->

오른쪽 파일 트리를 보면 SvelteKit이 프로젝트에 있을 것으로 기대하는 파일 몇 개가 보입니다.

Node.js를 써 본 적이 있다면 `package.json`이 익숙할 것입니다. 이 파일에는 프로젝트의 의존성(`svelte`와 `@sveltejs/kit` 포함)과 SvelteKit CLI를 다루기 위한 여러 `scripts`가 들어 있습니다. (지금 아래 창에서 `npm run dev`가 실행되고 있습니다.)

> [!NOTE] `"type": "module"`도 지정되어 있다는 점에 주목하세요. 이 설정 덕분에 `.js` 파일은 기본적으로 레거시 CommonJS 형식이 아닌 네이티브 JavaScript 모듈로 취급됩니다.

`vite.config.js`에는 [Vite](https://vitejs.dev/)와 SvelteKit 설정이 들어 있습니다. 지금은 이 파일을 신경 쓰지 않아도 되지만, 궁금하다면 [문서를 확인해 보세요](/docs/kit/@sveltejs-kit-vite). SvelteKit은 Vite를 사용하므로 핫 모듈 교체, TypeScript 지원, 정적 에셋 처리 같은 [Vite 기능](https://vitejs.dev/guide/features.html)을 쓸 수 있습니다.

`src`에는 앱의 소스 코드가 들어갑니다. `src/app.html`은 페이지 템플릿이고(SvelteKit이 `%sveltekit.head%`와 `%sveltekit.body%`를 알맞게 바꿔 넣습니다), `src/routes`는 앱의 [라우트](/tutorial/kit/pages)를 정의합니다.

마지막으로 `static`에는 앱을 배포할 때 함께 포함되어야 하는 에셋(`favicon.png`나 `robots.txt` 같은 것)이 들어갑니다.
