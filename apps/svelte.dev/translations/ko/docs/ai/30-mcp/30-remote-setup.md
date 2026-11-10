---
title: 원격 설정
---

MCP 서버의 원격 버전은 `https://mcp.svelte.dev/mcp`에서 제공됩니다.

Svelte 팀은 원격 서버로 전송된 코드를 기록하거나 저장하거나 들여다보지 않습니다.

자주 쓰이는 MCP 클라이언트에서 설정하는 방법은 다음과 같습니다:

## Claude Code

Claude Code에 원격 MCP 버전을 추가하려면 다음 명령을 실행하기만 하면 됩니다:

```bash
claude mcp add -t http -s [scope] svelte https://mcp.svelte.dev/mcp
```

원하는 `scope`(`user`, `project`, `local` 중 하나여야 합니다)와 `name`을 지정할 수 있습니다.

## Claude Desktop

- Settings > Connectors를 엽니다
- Add Custom Connector를 클릭합니다
- 이름을 물으면 `svelte`를 입력합니다
- Remote MCP server URL 입력란에 `https://mcp.svelte.dev/mcp`를 입력합니다
- Add를 클릭합니다

## Codex CLI

`config.toml`(기본 위치는 `~/.codex/config.toml`이며, 고급 설정은 [설정 문서](https://github.com/openai/codex/blob/main/docs/config.md)를 참고하세요)에 다음 내용을 추가하세요:

```toml
experimental_use_rmcp_client = true
[mcp_servers.svelte]
url = "https://mcp.svelte.dev/mcp"
```

## Copilot CLI

Copilot CLI로 대화형으로 MCP 서버를 추가하세요:

```bash
/mcp add
```

또는 `~/.copilot/mcp-config.json`을 만들거나 열어서 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"url": "https://mcp.svelte.dev/mcp"
		}
	}
}
```

## Antigravity CLI

Antigravity CLI에서 원격 MCP 버전을 사용하려면 `~/.gemini/config/mcp_config.json`을 만들거나 열어서 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"url": "https://mcp.svelte.dev/mcp"
		}
	}
}
```

## OpenCode

다음 명령을 실행하세요:

```bash
opencode mcp add
```

그리고 안내에 따라 'Select MCP server type' 프롬프트에서 'Remote'를 선택하세요:

```bash
opencode mcp add

┌  Add MCP server
│
◇  Enter MCP server name
│  svelte
│
◇  Select MCP server type
│  Remote
│
◇  Enter MCP server URL
│  https://mcp.svelte.dev/mcp
```

## VS Code

- 명령 팔레트를 엽니다
- "MCP: Add Server..."를 선택합니다
- "HTTP (HTTP or Server-Sent-Events)"를 선택합니다
- 입력란에 `https://mcp.svelte.dev/mcp`를 입력하고 `Enter`를 누릅니다
- 원하는 이름을 입력합니다
- `Global` MCP 서버로 추가할지 `Workspace` MCP 서버로 추가할지 선택합니다

## Cursor

원격 서버를 설정하려면 다음과 같이 하세요:

- 명령 팔레트를 엽니다
- "View: Open MCP Settings"를 선택합니다
- "Add custom MCP"를 클릭합니다

MCP 서버 목록이 담긴 파일이 열리면 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"url": "https://mcp.svelte.dev/mcp"
		}
	}
}
```

## GitHub Coding Agent

- GitHub에서 저장소를 엽니다
- Settings로 이동합니다
- Copilot > Coding agent를 엽니다
- MCP 설정을 수정합니다

```json
{
	"mcpServers": {
		"svelte": {
			"type": "http",
			"url": "https://mcp.svelte.dev/mcp",
			"tools": ["*"]
		}
	}
}
```

- *Save MCP configuration*을 클릭합니다

## 기타 클라이언트 <!-- Other clients -->

사용 중인 MCP 클라이언트가 여기에 없다면, 해당 클라이언트 문서에서 `remote` 서버 설정 방법을 찾아 URL로 `https://mcp.svelte.dev/mcp`를 지정하세요.
