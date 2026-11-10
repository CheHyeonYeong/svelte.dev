---
title: 프로젝트 만들기
---

SvelteKit 앱 만들기를 시작하는 가장 쉬운 방법은 `npx sv create`를 실행하는 것입니다:

```sh
npx sv create my-app
cd my-app
npm run dev
```

첫 번째 명령은 `my-app` 디렉터리에 새 프로젝트의 뼈대를 만들면서 TypeScript 같은 기본 도구를 설정할지 물어봅니다. 이 옵션들에 대한 정보는 [CLI 문서](/docs/cli/overview)를, 추가 도구 설정에 대한 안내는 [통합 페이지](./integrations)를 보세요. 그다음 `npm run dev`를 실행하면 [localhost:5173](http://localhost:5173)에서 개발 서버가 시작됩니다. 프로젝트를 만들 때 의존성을 설치하지 않았다면 이 명령을 실행하기 전에 꼭 설치하세요.

기본 개념은 두 가지입니다:

- 앱의 각 페이지는 [Svelte](../svelte) 컴포넌트입니다
- 프로젝트의 `src/routes` 디렉터리에 파일을 추가해 페이지를 만듭니다. 이 페이지들은 서버에서 렌더링되므로 사용자가 앱을 처음 방문할 때 최대한 빠르게 뜨고, 그 뒤로는 클라이언트 사이드 앱이 이어받습니다

파일을 직접 고쳐 보면서 모든 것이 어떻게 동작하는지 감을 잡아 보세요.

## 에디터 설정 <!-- Editor setup -->

[Svelte 확장](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)과 함께 [Visual Studio Code(VS Code)](https://code.visualstudio.com/download)를 사용하기를 권하지만, [그 밖의 여러 에디터도 지원됩니다](https://sveltesociety.dev/collection/editor-support-c85c080efc292a34).
