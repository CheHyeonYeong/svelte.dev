---
title: 중단점 디버깅
---

[`@debug`](../svelte/@debug) 태그 외에도, 다양한 도구와 개발 환경에서 중단점을 사용해 Svelte와 SvelteKit 프로젝트를 디버깅할 수 있습니다. 프론트엔드 코드와 백엔드 코드 모두 디버깅할 수 있습니다.

다음 가이드는 JavaScript 런타임 환경이 Node.js라고 가정합니다.

## Visual Studio Code

내장 디버그 터미널을 사용하면 VSCode에서 소스 파일에 중단점을 설정할 수 있습니다.

1. 명령 팔레트를 엽니다: `CMD/Ctrl` + `Shift` + `P`.
2. "Debug: JavaScript Debug Terminal"을 찾아 실행합니다.
3. 디버그 터미널에서 프로젝트를 시작합니다. 예: `npm run dev`.
4. 클라이언트 또는 서버 사이드 소스 코드에 중단점을 설정합니다.
5. 중단점이 걸리게 합니다.

### 디버그 패널에서 실행하기 <!-- Launch via debug pane -->

또는 프로젝트에 `.vscode/launch.json`을 설정할 수도 있습니다. 자동으로 설정하려면:

1. "Run and Debug" 패널로 이동합니다.
2. "Run" 선택 메뉴에서 "Node.js..."를 고릅니다.
3. 프로젝트에 해당하는 "run script"를 선택합니다. 예: "Run script: dev".
4. "Start debugging" 재생 버튼을 누르거나 `F5`를 눌러 중단점 디버깅을 시작합니다.

다음은 `launch.json`의 예입니다:

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"command": "npm run dev",
			"name": "Run development server",
			"request": "launch",
			"type": "node-terminal"
		}
	]
}
```

더 읽어보기: <https://code.visualstudio.com/docs/editor/debugging>.

## 다른 에디터 <!-- Other Editors -->

다른 에디터를 사용한다면 다음 커뮤니티 가이드가 도움이 될 수 있습니다:

- [WebStorm Svelte: 애플리케이션 디버깅하기](https://www.jetbrains.com/help/webstorm/svelte.html#ws_svelte_debug)
- [Neovim에서 JavaScript 프레임워크 디버깅하기](https://theosteiner.de/debugging-javascript-frameworks-in-neovim)

## Google Chrome과 Microsoft Edge 개발자 도구 <!-- Google Chrome and Microsoft Edge Developer Tools -->

브라우저 기반 디버거로 Node.js 애플리케이션을 디버깅할 수 있습니다.

> [!NOTE] 이 방법은 클라이언트 사이드 SvelteKit 소스 맵을 디버깅할 때만 동작합니다.

1. Node.js로 Vite 서버를 시작할 때 `--inspect` 플래그를 붙여 실행합니다. 예: `NODE_OPTIONS="--inspect" npm run dev`
2. 새 탭에서 사이트를 엽니다. 보통 `localhost:5173`입니다.
3. 브라우저의 개발자 도구를 열고, 왼쪽 위 근처에 있는 "Open dedicated DevTools for Node.js" 아이콘을 클릭합니다. Node.js 로고가 표시되어 있을 것입니다.
4. 중단점을 설정하고 애플리케이션을 디버깅합니다.

또는 Google Chrome에서는 `chrome://inspect`, Microsoft Edge에서는 `edge://inspect`로 이동해 디버거 개발자 도구를 열 수도 있습니다.

## 참고 자료 <!-- References -->

- [Node.js 디버깅](https://nodejs.org/en/learn/getting-started/debugging)
