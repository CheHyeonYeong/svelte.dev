---
title: 로컬 설정
---

MCP 서버의 로컬(또는 stdio) 버전은 [`@sveltejs/mcp`](https://www.npmjs.com/package/@sveltejs/mcp) npm 패키지로 제공됩니다. 전역으로 설치한 뒤 설정에서 참조하거나, `npx`로 실행할 수 있습니다:

```bash
npx -y @sveltejs/mcp
```

자주 쓰이는 MCP 클라이언트에서 설정하는 방법은 다음과 같습니다:

## Claude Code

Claude Code에 로컬 MCP 버전을 추가하려면 다음 명령을 실행하기만 하면 됩니다:

```bash
claude mcp add -t stdio -s [scope] svelte -- npx -y @sveltejs/mcp
```

`[scope]`는 `user`, `project`, `local` 중 하나여야 합니다.

또는 [Svelte Claude Code 마켓플레이스](claude-plugin)에서 `svelte` 플러그인을 설치하면 로컬 서버와 함께 유용한 [스킬](skills)도 설정됩니다.

## Claude Desktop

Settings > Developer 섹션에서 Edit Config를 클릭하세요. `claude_desktop_config.json` 파일이 들어 있는 폴더가 열립니다. 이 파일에 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"command": "npx",
			"args": ["-y", "@sveltejs/mcp"]
		}
	}
}
```

## Codex CLI

[Codex 플러그인](codex-plugin)을 사용하면 MCP 서버를 자동으로 설정할 수 있습니다(권장). MCP 서버를 직접 설정하고 싶다면 `config.toml`(기본 위치는 `~/.codex/config.toml`이며, 고급 설정은 [설정 문서](https://github.com/openai/codex/blob/main/docs/config.md)를 참고하세요)에 다음 내용을 추가하세요:

```toml
[mcp_servers.svelte]
command = "npx"
args = ["-y", "@sveltejs/mcp"]
```

## Copilot CLI

[Copilot 플러그인](copilot-plugin)을 사용하면 MCP 서버를 자동으로 설정할 수 있습니다(권장). MCP 서버를 직접 설정하고 싶다면 Copilot CLI로 대화형으로 MCP 서버를 추가하세요:

```bash
/mcp add
```

또는 `~/.copilot/mcp-config.json`을 만들거나 열어서 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"command": "npx",
			"args": ["-y", "@sveltejs/mcp"]
		}
	}
}
```

## Antigravity CLI

Antigravity CLI에서 로컬 MCP 버전을 사용하려면 `~/.gemini/config/mcp_config.json`을 만들거나 열어서 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"command": "npx",
			"args": ["-y", "@sveltejs/mcp"]
		}
	}
}
```

## OpenCode

[OpenCode 플러그인](opencode-plugin)을 사용하면 MCP 서버를 자동으로 설정할 수 있습니다(권장). MCP 서버를 직접 설정하고 싶다면 다음 명령을 실행하세요:

```bash
opencode mcp add
```

그리고 안내에 따라 'Select MCP server type' 프롬프트에서 'Local'을 선택하세요:

```bash
opencode mcp add

┌  Add MCP server
│
◇  Enter MCP server name
│  svelte
│
◇  Select MCP server type
│  Local
│
◆  Enter command to run
│  npx -y @sveltejs/mcp
```

## VS Code

- 명령 팔레트를 엽니다
- "MCP: Add Server..."를 선택합니다
- "Command (stdio)"를 선택합니다
- 입력란에 `npx -y @sveltejs/mcp`를 입력하고 `Enter`를 누릅니다
- 이름을 물으면 `svelte`를 입력합니다
- `Global` MCP 서버로 추가할지 `Workspace` MCP 서버로 추가할지 선택합니다

## Cursor

[Cursor 플러그인](cursor-plugin)을 사용하면 MCP 서버를 자동으로 설정할 수 있습니다(권장). MCP 서버를 직접 설정하고 싶다면 다음과 같이 하세요:

- 명령 팔레트를 엽니다
- "View: Open MCP Settings"를 선택합니다
- "Add custom MCP"를 클릭합니다

MCP 서버 목록이 담긴 파일이 열리면 다음 설정을 추가하세요:

```json
{
	"mcpServers": {
		"svelte": {
			"command": "npx",
			"args": ["-y", "@sveltejs/mcp"]
		}
	}
}
```

## Zed

[Svelte MCP Server 확장](https://zed.dev/extensions/svelte-mcp)을 설치하세요.

<details>

<summary>Configure Manually</summary>

- 명령 팔레트를 엽니다
- "agent:open settings"를 검색해서 선택합니다
- 설정 패널에서 `Model Context Protocol (MCP) Servers`를 찾습니다
- "Add Server"를 클릭합니다
- "Add Custom Server"를 선택합니다

MCP 서버 설정 팝업이 열리면 다음 설정을 추가하세요:

```json
{
	"svelte": {
		"command": "npx",
		"args": ["-y", "@sveltejs/mcp"]
	}
}
```

</details>

## 기타 클라이언트 <!-- Other clients -->

사용 중인 MCP 클라이언트가 여기에 없다면, 해당 클라이언트 문서에서 `stdio` 서버 설정 방법을 찾아 명령에는 `npx`를, 인수에는 `-y @sveltejs/mcp`를 지정하세요.
