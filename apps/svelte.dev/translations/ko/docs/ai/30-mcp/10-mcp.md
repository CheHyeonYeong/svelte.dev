---
title: 개요
---

Svelte MCP([Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)) 서버는 에이전트가 더 나은 Svelte 코드를 작성하도록 도와줍니다. 관련 문서를 제공하고 생성된 코드를 정적으로 분석해서 수정 사항과 모범 사례를 제안하는 방식으로 동작합니다.

## 설정 <!-- Setup -->

설정 방법은 원하는 MCP 버전(원격 또는 로컬)과 선택한 MCP 클라이언트(예: Claude Code, Codex CLI, GitHub Copilot)에 따라 달라집니다:

- `@sveltejs/mcp`를 사용하는 [로컬 설정](local-setup)
- `https://mcp.svelte.dev/mcp`를 사용하는 [원격 설정](remote-setup)

## 사용법 <!-- Usage -->

MCP 클라이언트가 지원한다면, LLM에게 MCP 서버를 가장 잘 사용하는 방법을 알려주는 [svelte-task](prompts#svelte-task) 프롬프트도 함께 사용하는 것을 권장합니다.
