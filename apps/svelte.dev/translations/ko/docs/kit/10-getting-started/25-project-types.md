---
title: 프로젝트 유형
---

SvelteKit은 설정 가능한 렌더링을 제공하므로 프로젝트를 여러 가지 방식으로 빌드하고 배포할 수 있습니다. 아래에 나오는 유형의 애플리케이션은 물론 그 밖의 것들도 SvelteKit으로 만들 수 있습니다. 렌더링 설정은 서로 배타적이지 않으므로, 애플리케이션의 부분마다 가장 알맞은 렌더링 방식을 고를 수 있습니다.

애플리케이션을 어떤 방식으로 만들지 아직 정하지 않았더라도 걱정하지 마세요! 애플리케이션을 빌드하고 배포하고 렌더링하는 방식은 어떤 어댑터를 골랐는지와 약간의 설정으로 정해지며, 이는 언제든 나중에 바꿀 수 있습니다. 어떤 프로젝트 유형을 고르든 [프로젝트 구조](project-structure)와 [라우팅](glossary#Routing)은 똑같습니다.

## 기본 렌더링 <!-- Default rendering -->

기본적으로 사용자가 사이트를 방문하면 SvelteKit은 첫 페이지를 [서버 사이드 렌더링(SSR)](glossary#SSR)으로, 이후 페이지를 [클라이언트 사이드 렌더링(CSR)](glossary#CSR)으로 렌더링합니다. 초기 렌더링에 SSR을 사용하면 SEO가 좋아지고 첫 페이지 로드의 체감 성능이 향상됩니다. 그다음에는 클라이언트 사이드 렌더링이 이어받아 공통 컴포넌트를 다시 렌더링하지 않고도 페이지를 업데이트하는데, 이 방식은 대개 더 빠르고 페이지 사이를 이동할 때 화면이 깜빡이는 현상도 없애 줍니다. 이런 하이브리드 렌더링 방식으로 만든 앱을 [트랜지셔널 앱(transitional app)](https://2021.jamstackconf.com/talk/c17544108e71/transitional-apps/)이라고 부르기도 합니다.

## 정적 사이트 생성 <!-- Static site generation -->

[`adapter-static`](adapter-static)을 사용하면 SvelteKit을 사이트 전체를 정적 렌더링으로 [프리렌더](glossary#Prerendering)하는 [정적 사이트 생성기(SSG)](glossary#SSG)로 쓸 수 있습니다. 또는 [prerender 옵션](page-options#prerender)으로 일부 페이지만 프리렌더하고, 나머지 페이지는 다른 어댑터를 골라 서버에서 동적으로 렌더링할 수도 있습니다.

정적 사이트 생성만을 위해 만들어진 도구는 아주 많은 페이지를 렌더링할 때 빌드 중의 프리렌더링 과정을 더 효율적으로 확장할 수 있습니다. 아주 큰 정적 생성 사이트를 다룬다면 [`adapter-vercel`을 사용할 때 증분 정적 재생성(ISR)](adapter-vercel#Incremental-Static-Regeneration)으로 긴 빌드 시간을 피할 수 있습니다. 또한 SSG 전용 도구와 달리 SvelteKit에서는 페이지마다 서로 다른 렌더링 방식을 자유롭게 섞어 쓸 수 있습니다.

## 싱글 페이지 앱 <!-- Single-page app -->

[싱글 페이지 앱(SPA)](glossary#SPA)은 오로지 [클라이언트 사이드 렌더링(CSR)](glossary#CSR)만 사용합니다. SvelteKit으로 [싱글 페이지 앱(SPA)을 만들](single-page-apps) 수 있습니다. 다른 모든 유형의 SvelteKit 애플리케이션과 마찬가지로 백엔드는 SvelteKit으로 작성해도 되고 [다른 언어나 프레임워크](#Separate-backend)로 작성해도 됩니다. 백엔드가 없거나 [별도의 백엔드](#Separate-backend)가 있는 애플리케이션을 만든다면, 문서에서 `server` 파일을 다루는 부분은 그냥 건너뛰어도 됩니다.

## 멀티 페이지 앱 <!-- Multi-page app -->

SvelteKit은 보통 [전통적인 멀티 페이지 앱](glossary#MPA)을 만드는 데 쓰이지 않습니다. 하지만 [`data-sveltekit-reload`](link-options#data-sveltekit-reload)를 `<body data-sveltekit-reload>`처럼 사용해 모든 링크를 서버에서 렌더링하거나, 더 구체적인 위치에 두어 특정 링크만 서버에서 렌더링하게 할 수 있습니다. 이렇게 해도 클라이언트 사이드 라우터가 없어지지는 않지만, 페이지에 JavaScript가 필요 없다면 [`csr = false`](page-options#csr)로 페이지의 JavaScript를 모두 없앨 수 있으며, 이때 링크를 클릭하면 역시 서버에서 렌더링됩니다.

## 별도의 백엔드 <!-- Separate backend -->

백엔드가 Go, Java, PHP, Ruby, Rust, C# 같은 다른 언어로 작성되어 있다면 애플리케이션을 배포하는 방법이 몇 가지 있습니다. 가장 권장하는 방법은 `adapter-node`나 서버리스 어댑터를 사용해 SvelteKit 프론트엔드를 백엔드와 따로 배포하는 것입니다. 관리할 프로세스를 따로 두고 싶지 않아서 애플리케이션을 백엔드 서버가 제공하는 [싱글 페이지 앱(SPA)](single-page-apps)으로 배포하는 사용자도 있지만, 싱글 페이지 앱은 SEO와 성능 면에서 불리하다는 점에 유의하세요.

외부 백엔드를 사용한다면 문서에서 `server` 파일을 다루는 부분은 그냥 건너뛰어도 됩니다. [별도의 백엔드를 호출하는 방법에 관한 FAQ](faq#How-do-I-use-a-different-backend-API-server)도 참고하면 좋습니다.

## 서버리스 앱 <!-- Serverless app -->

SvelteKit 앱은 서버리스 플랫폼에서 손쉽게 실행할 수 있습니다. [설정이 필요 없는 기본 어댑터](adapter-auto)는 지원되는 여러 플랫폼에서 앱을 자동으로 실행해 주며, 플랫폼별 설정이 필요하다면 [`adapter-vercel`](adapter-vercel), [`adapter-netlify`](adapter-netlify), [`adapter-cloudflare`](adapter-cloudflare)를 사용할 수 있습니다. 또한 [커뮤니티 어댑터](/packages#sveltekit-adapters)를 이용하면 거의 모든 서버리스 환경에 애플리케이션을 배포할 수 있습니다. [`adapter-vercel`](adapter-vercel)이나 [`adapter-netlify`](adapter-netlify) 같은 일부 어댑터는 지연 시간을 줄이는 [엣지 렌더링](glossary#Edge)을 지원하는 `edge` 옵션을 제공합니다.

## 자체 서버 <!-- Your own server -->

[`adapter-node`](adapter-node)를 사용하면 자체 서버나 VPS에 배포할 수 있습니다.

## 컨테이너 <!-- Container -->

[`adapter-node`](adapter-node)를 사용하면 Docker나 LXC 같은 컨테이너 안에서 SvelteKit 앱을 실행할 수 있습니다.

## 라이브러리 <!-- Library -->

[`sv create`](/docs/cli/sv-create)를 실행할 때 라이브러리 옵션을 고르면, SvelteKit의 애드온인 [`@sveltejs/package`](packaging)로 다른 Svelte 앱에서 쓸 라이브러리를 만들 수 있습니다.

## 오프라인 앱 <!-- Offline app -->

SvelteKit은 [서비스 워커](service-workers)를 완벽하게 지원하므로 오프라인 앱이나 [프로그레시브 웹 앱](glossary#PWA) 같은 다양한 유형의 애플리케이션을 만들 수 있습니다.

## 모바일 앱 <!-- Mobile app -->

[Tauri](https://v2.tauri.app/start/frontend/sveltekit/)나 [Capacitor](https://capacitorjs.com/solution/svelte)를 사용하면 [SvelteKit SPA](single-page-apps)를 모바일 앱으로 바꿀 수 있습니다. 카메라, 위치 정보, 푸시 알림 같은 모바일 기능은 두 플랫폼 모두 플러그인으로 사용할 수 있습니다.

이런 모바일 개발 플랫폼은 로컬 웹 서버를 띄운 다음, 휴대폰에서 정적 호스트처럼 애플리케이션을 제공하는 방식으로 동작합니다. 요청 수를 줄이려면 [`bundleStrategy: 'single'`](@sveltejs-kit-vite#output) 옵션이 도움이 될 수 있습니다. 예를 들어 이 글을 쓰는 시점에 Capacitor 로컬 서버는 HTTP/1을 사용하는데, HTTP/1은 동시 연결 수가 제한됩니다.

## 데스크톱 앱 <!-- Desktop app -->

[Tauri](https://v2.tauri.app/start/frontend/sveltekit/), [Wails](https://wails.io/docs/guides/sveltekit/), [Electron](https://www.electronjs.org/)을 사용하면 [SvelteKit SPA](single-page-apps)를 데스크톱 앱으로 바꿀 수 있습니다.

## 브라우저 확장 <!-- Browser extension -->

[`adapter-static`](adapter-static)이나 브라우저 확장에 맞게 만들어진 [커뮤니티 어댑터](/packages#sveltekit-adapters)를 사용해 브라우저 확장을 만들 수 있습니다.

## 임베디드 기기 <!-- Embedded device -->

Svelte는 렌더링이 효율적이어서 저전력 기기에서도 실행할 수 있습니다. 마이크로컨트롤러나 TV 같은 임베디드 기기는 동시 연결 수가 제한될 수 있습니다. 동시 요청 수를 줄이려면 이런 배포 구성에서 [`bundleStrategy: 'single'`](@sveltejs-kit-vite#output) 옵션이 도움이 될 수 있습니다.
