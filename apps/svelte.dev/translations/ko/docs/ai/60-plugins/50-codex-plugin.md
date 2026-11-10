---
title: Codex CLI
---

MCP 서버 코드가 담긴 오픈 소스 [저장소](https://github.com/sveltejs/ai-tools)는 Codex CLI [플러그인 마켓플레이스](https://developers.openai.com/codex/plugins)이기도 합니다.

이 마켓플레이스에서 `svelte` 플러그인을 설치하면 로컬 stdio MCP 서버, LLM에게 Svelte 5 코드를 올바르게 작성하는 방법을 알려주는 [스킬](skills), Svelte 파일 편집 전용 에이전트를 사용할 수 있습니다.

가능하다면 `.svelte` 파일이나 `.svelte.ts`/`.svelte.js` 모듈을 만들거나 수정할 때 LLM이 이 에이전트로 MCP 호출을 실행하도록 지시하는 것을 권장합니다(메시지에서 에이전트를 명시적으로 언급하면 작업을 위임할 수 있습니다). Svelte 관련 작업을 더 효율적으로 처리해서 컨텍스트를 아낄 수 있습니다.

## 설치 <!-- Installation -->

Codex CLI에서 저장소를 마켓플레이스로 추가하세요:

```bash
codex plugin marketplace add sveltejs/ai-tools
```

그런 다음 대화형 Codex CLI 세션에서 플러그인 디렉터리를 여세요:

```bash
codex
/plugins
```

Svelte 마켓플레이스를 고르고 `svelte` 플러그인을 선택해서 설치하세요.

Codex는 저장소에 있는, 레거시와 호환되는 `.claude-plugin/marketplace.json` 마켓플레이스 파일을 읽을 수 있으므로, 같은 마켓플레이스 소스를 Claude Code와 Codex CLI 모두에서 사용할 수 있습니다.
