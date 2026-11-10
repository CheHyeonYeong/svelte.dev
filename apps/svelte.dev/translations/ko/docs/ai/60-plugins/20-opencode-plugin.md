---
title: OpenCode
---

OpenCode에는 개발자가 MCP 서버, 에이전트, 명령을 코드로 추가할 수 있는 [플러그인 시스템](https://opencode.ai/docs/plugins/)이 있습니다. Svelte는 `@sveltejs/opencode`라는 이름으로 OpenCode 플러그인을 배포하고 있습니다.

## 설치 <!-- Installation -->

OpenCode 2 이상에서는 명령줄에서 플러그인을 설치하세요:

```sh
opencode plugin add @sveltejs/opencode
```

> [!LEGACY] OpenCode 1.3.4부터 1.x까지는 대신 `opencode plugin @sveltejs/opencode`를 실행하세요.

또는 [OpenCode 설정](https://opencode.ai/docs/config/)(전역 설정이나 로컬 설정)을 열고 플러그인 목록에 `@sveltejs/opencode`를 추가하세요:

```json
{
	"$schema": "https://opencode.ai/config.json",
	"plugin": ["@sveltejs/opencode"]
}
```

끝입니다! 이제 Svelte [MCP 서버](mcp), [스킬](skills), `svelte-file-editor` [서브에이전트](subagent)가 설정되었습니다.

### TUI 설정 <!-- TUI configuration -->

이 패키지에는 이러한 기능을 대화형으로 설정할 수 있는 TUI 플러그인도 들어 있습니다. 전역 또는 프로젝트 로컬 `tui.json`에 `@sveltejs/opencode`를 추가하세요:

```json
{
	"$schema": "https://opencode.ai/tui.json",
	"plugin": ["@sveltejs/opencode"]
}
```

OpenCode를 다시 시작한 다음 `/svelte-plugin`을 실행하거나 명령 팔레트에서 'Configure Svelte plugin'을 선택하세요. 프로젝트 설정과 전역 설정 중 어느 쪽을 수정할지 고른 뒤, 체크박스와 라디오 옵션으로 플러그인을 설정하세요. 변경 사항은 자동으로 저장되며, 'Revert changes'를 누르면 대화 상자를 열었을 때의 값으로 되돌아갑니다.

## 설정 <!-- Configuration -->

기본적으로 MCP 서버, 서브에이전트, 스킬, 지침, 자동 업데이트가 활성화되어 있습니다. TUI 플러그인은 여러분이 직접 만들거나 수정할 수 있는 것과 같은 설정 파일에 기록합니다:

- 로컬: `.opencode/svelte.json`
- 전역: `~/.config/opencode/svelte.json` (환경 변수를 지정했다면 `$OPENCODE_CONFIG_DIR/svelte.json`)

```json
{
	"$schema": "https://svelte.dev/opencode/schema.json",
	"mcp": {
		"type": "local", // or "remote"; defaults to local
		"enabled": true
	},
	"subagent": {
		"enabled": true,
		"agents": {
			"svelte-file-editor": {
				"model": "<other-model>", // defaults to the same as main agent
				"temperature": 1, // defaults to unset
				"top_p": 0.7, // defaults to unset
				"maxSteps": 20 // defaults to unlimited
			}
		}
	},
	"skills": {
		// this can be `true`, or an array of skills to enable
		// e.g. ["svelte-core-bestpractices"]
		"enabled": true
	},
	"instructions": {
		"enabled": true
	},
	"autoupdate": true
}
```

### 자동 업데이트 <!-- Automatic updates -->

플러그인은 npm에서 새 버전을 확인하고, 새 버전이 있으면 경고를 표시합니다. OpenCode는 플러그인을 캐시하므로 해당 캐시가 지워질 때까지 캐시된 버전을 계속 사용합니다.

자동 업데이트는 기본적으로 활성화되어 있습니다. 새 버전을 감지하면 플러그인은 OpenCode가 종료될 때 캐시에서 스스로를 제거합니다. OpenCode는 다음에 시작할 때 최신 버전을 설치합니다. 자동 업데이트는 플러그인 버전을 고정하지 않았거나 명시적으로 `latest` 태그를 사용할 때만 적용됩니다. 정확한 버전, 버전 범위, 기타 dist-tag는 다시 설치해도 같은 버전으로 결정될 수 있으므로 건드리지 않습니다. 경고만 받으려면 `"autoupdate": false`로 설정하세요.
