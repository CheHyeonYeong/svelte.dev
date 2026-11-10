---
title: 시작하기
---

[SvelteKit](../kit)을 사용하기를 권합니다. SvelteKit으로는 [거의 모든 것을 만들 수 있습니다](../kit/project-types). Svelte 팀이 만든 공식 애플리케이션 프레임워크이며 [Vite](https://vite.dev/)를 기반으로 동작합니다. 다음 명령으로 새 프로젝트를 만드세요:

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

아직 Svelte를 몰라도 괜찮습니다! SvelteKit이 그 위에 더해 주는 멋진 기능들은 지금은 신경 쓰지 말고 나중에 살펴봐도 됩니다.

## SvelteKit의 대안 <!-- Alternatives to SvelteKit -->

[vite-plugin-svelte](https://github.com/sveltejs/vite-plugin-svelte)를 통해 Vite에서 Svelte를 직접 사용할 수도 있습니다. `npm create vite@latest`를 실행하고 `svelte` 옵션을 선택하면 됩니다(기존 프로젝트라면 `vite.config.js` 파일에 플러그인을 추가하세요). 이렇게 하면 `npm run build`가 `dist` 디렉터리 안에 HTML, JS, CSS 파일을 만들어 줍니다. 대부분의 경우 [라우팅 라이브러리도 골라야](/packages#routing) 할 것입니다.

>[!NOTE] Vite는 흔히 독립 실행 모드로 [싱글 페이지 앱(SPA)](../kit/glossary#SPA)을 만드는 데 쓰이며, 이런 앱은 [SvelteKit으로도 만들 수 있습니다](../kit/single-page-apps).

[다른 번들러용 플러그인](/packages#bundler-plugins)도 있지만, Vite를 권장합니다.

## 에디터 도구 <!-- Editor tooling -->

Svelte 팀은 [VS Code 확장](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)을 관리하고 있으며, 그 밖의 여러 [에디터](https://sveltesociety.dev/collection/editor-support-c85c080efc292a34)와 도구용 통합도 있습니다.

명령줄에서 [`npx sv check`](https://svelte.dev/docs/cli/sv-check)로 코드를 검사할 수도 있습니다.


## 도움 받기 <!-- Getting help -->

[Discord 채팅방](/chat)에서 편하게 도움을 요청하세요! [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte)에서도 답을 찾을 수 있습니다.
