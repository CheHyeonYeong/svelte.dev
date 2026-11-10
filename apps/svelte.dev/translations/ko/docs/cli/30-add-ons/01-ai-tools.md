---
title: ai-tools
---

[Svelte AI 도구](/docs/ai/overview)는 LLM이 더 나은 Svelte 코드를 작성하도록 도와줍니다.

## 사용법 <!-- Usage -->

```sh
npx sv add ai-tools
```

## 제공되는 것 <!-- What you get -->

도구는 공식 Svelte 플러그인으로 추가하거나 개별 도구로 추가할 수 있습니다.

- Svelte 플러그인은 모든 것(MCP 서버, [스킬](https://svelte.dev/docs/ai/skills), 서브에이전트)을 하나로 묶어 제공하며 스스로 최신 상태를 유지합니다. Claude Code와 OpenCode에서 사용할 수 있습니다. Claude Code에서는 커밋된 `.claude/settings.json`을 통해 활성화됩니다. 프로젝트를 처음 열 때 워크스페이스를 신뢰할지 묻는 창이 뜨고, 그 뒤에 자동으로 설치됩니다(`/plugin install`은 필요 없습니다).
- 개별 도구는 플러그인이 없는 클라이언트용입니다(또는 추가할 것을 정확히 고르고 싶을 때 사용합니다):
  - [로컬](https://svelte.dev/docs/ai/local-setup) 또는 [원격](https://svelte.dev/docs/ai/remote-setup) 설정용 MCP 구성
  - MCP 서버를 효과적으로 사용하도록 돕는 [에이전트용 README](https://agents.md/)
  - 스킬을 지원하는 클라이언트를 위한 [스킬](https://svelte.dev/docs/ai/skills)
  - 서브에이전트를 지원하는 클라이언트를 위한 서브에이전트

## 옵션 <!-- Options -->

### ide

사용하려는 클라이언트(여러 개 가능)로, `'claude-code'`, `'cursor'`, `'gemini'`, `'opencode'`, `'vscode'`, `'other'` 등이 있습니다.

```sh
npx sv add ai-tools="ide:cursor,vscode"
```

### delivery

도구를 추가하는 방식: `'plugin'`(Svelte 플러그인, 권장) 또는 `'tools'`(개별 도구). 선택한 클라이언트가 플러그인을 지원할 때만 묻습니다.

```sh
npx sv add ai-tools="ide:claude-code+delivery:plugin"
```

### tools

플러그인을 사용하지 않을 때 추가할 개별 도구로, `'mcp'`, `'svelte-code-writer'`, `'svelte-core-bestpractices'`, `'svelte-file-editor'` 등이 있습니다.

```sh
npx sv add ai-tools="ide:cursor+delivery:tools+tools:mcp,svelte-file-editor"
```

### mcpSetup

사용하려는 MCP 설정(`'local'` 또는 `'remote'`)입니다. MCP 서버를 개별 도구로 추가할 때만 의미가 있습니다.

```sh
npx sv add ai-tools="mcpSetup:local"
```
