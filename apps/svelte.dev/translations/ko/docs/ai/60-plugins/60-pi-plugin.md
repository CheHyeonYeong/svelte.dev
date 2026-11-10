---
title: Pi
---

[Pi](https://pi.dev)는 확장과 스킬을 묶은 [패키지](https://pi.dev/docs/packages)를 지원합니다. Svelte는 `@sveltejs/pi`라는 이름으로 Pi 패키지를 배포하고 있습니다.

## 설치 <!-- Installation -->

Pi 0.99.0 이상에서는 명령줄에서 패키지를 설치하세요:

```sh
pi install npm:@sveltejs/pi
```

현재 프로젝트에만 설치하려면 `-l`을 추가하세요.

끝입니다! 이제 Svelte [MCP 서버](mcp), [스킬](skills), [지침](instructions)이 설정되었습니다.

이미 `mcp.json`에 Svelte MCP 서버를 설정해 두었다면, 패키지는 새로 등록하지 않고 기존 설정을 사용합니다.

> [!NOTE] 다른 플러그인과 달리 Pi 패키지에는 `svelte-file-editor` [서브에이전트](subagent)가 포함되어 있지 않습니다. Pi는 의도적으로 서브에이전트를 제공하지 않기 때문입니다. 작업을 격리된 컨텍스트에 위임하고 싶다면 Pi에게 자기 자신의 다른 인스턴스를 띄우도록 요청할 수 있습니다(예: `pi --print "<task>"`). 새로 띄운 인스턴스도 설치된 패키지를 불러오므로 Svelte MCP 서버, 스킬, 지침을 그대로 사용할 수 있습니다.

## 설정 <!-- Configuration -->

기본적으로 MCP 서버, 스킬, 지침이 활성화되어 있습니다. `svelte.json` 파일을 만들어 MCP 서버와 지침을 원하는 대로 설정할 수 있습니다:

- 로컬: `.pi/svelte.json` (신뢰할 수 있는 프로젝트에서만 읽음)
- 전역: `~/.pi/agent/svelte.json`

```json
{
	"$schema": "https://svelte.dev/pi/schema.json",
	"mcp": {
		"type": "local", // or "remote"; defaults to local
		"enabled": true,
		"exposure": "direct" // or "codemode", "deferred", "hidden"; defaults to direct
	},
	"instructions": {
		"enabled": true
	}
}
```

설정을 바꾼 뒤에는 `/reload`를 실행하세요.

### 스킬 <!-- Skills -->

스킬은 Pi가 직접 관리합니다. `pi config`(현재 프로젝트라면 `pi config --local`)로 각 스킬을 켜거나 끌 수 있고, Pi `settings.json`에서 필터링할 수도 있습니다:

```json
{
	"packages": [
		{
			"source": "npm:@sveltejs/pi",
			"skills": ["skills/svelte-code-writer"] // or [] to disable all of them
		}
	]
}
```

자세한 내용은 [Pi 패키지 필터링](https://pi.dev/docs/latest/packages#select-package-resources)을 참고하세요.
