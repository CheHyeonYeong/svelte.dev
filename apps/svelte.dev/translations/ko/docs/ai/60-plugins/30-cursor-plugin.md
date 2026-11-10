---
title: Cursor
---

Cursor에는 규칙, 스킬, 에이전트, 명령, MCP 서버, 훅을 묶을 수 있는 [플러그인 시스템](https://cursor.com/docs/plugins)이 있습니다.

Svelte 플러그인을 설치하면 로컬 stdio Svelte MCP 서버, Cursor [스킬](skills), 모델에게 Svelte MCP 도구를 올바르게 사용하는 방법을 알려주는 상시 적용 규칙, `.svelte` 파일과 `.svelte.ts`/`.svelte.js` 모듈 작업을 위한 `svelte-file-editor` 서브에이전트를 사용할 수 있습니다. 소스는 [`sveltejs/ai-tools`](https://github.com/sveltejs/ai-tools/tree/main/plugins/cursor/svelte) 저장소에서 볼 수 있습니다.

## 설치 <!-- Installation -->

다음 명령으로 [Cursor Marketplace](https://cursor.com/marketplace/svelte)에서 플러그인을 설치하세요:

```
/add-plugin svelte
```

플러그인은 현재 프로젝트에만 설치하거나 사용자 수준으로 설치할 수 있습니다.

설치가 끝나면 Cursor가 플러그인 구성 요소를 자동으로 찾아냅니다:

- Svelte MCP 서버가 플러그인의 `.mcp.json`에서 추가됩니다
- 규칙과 스킬이 Cursor의 규칙 UI에 나타납니다
- 채팅에서 `svelte-file-editor` 에이전트를 사용할 수 있게 됩니다

> [!NOTE] Cursor CLI는 아직 플러그인을 지원하지 않습니다. [Cloud Agents](https://cursor.com/docs/cloud-agent)의 플러그인 지원은 MCP 서버로 제한됩니다.
