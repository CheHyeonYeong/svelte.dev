---
title: CLI
---

`@sveltejs/mcp` npm 패키지는 보통 로컬 `stdio` MCP 서버를 실행합니다:

```bash
npx -y @sveltejs/mcp
```

하위 명령과 함께 호출하면 일반적인 CLI처럼 동작해서 결과를 터미널에 바로 출력합니다. 에이전트, 스크립트, 간단한 수동 확인에 유용합니다.

## 사용법 <!-- Usage -->

```bash
npx -y @sveltejs/mcp <command> [options]
```

사용 가능한 명령:

- `list-sections`
- `get-documentation <sections>`
- `svelte-autofixer <code_or_path>`

다음 명령으로 각 명령에 대해 더 자세히 알아볼 수 있습니다

```bash
npx -y @sveltejs/mcp --help
npx -y @sveltejs/mcp <command> --help
npx -y @sveltejs/mcp --version
```

## `list-sections`

사용 가능한 모든 Svelte 및 SvelteKit 문서 섹션을 나열합니다.

```bash
npx -y @sveltejs/mcp list-sections
```

출력은 각 섹션의 제목, `use_cases`, 문서 경로를 포함하는 구조화된 텍스트 목록입니다. MCP 도구가 `get-documentation`을 호출하기 전에 사용하는 것과 같은 목록입니다.

## `get-documentation`

하나 이상의 섹션에 대한 전체 문서를 가져옵니다.

```bash
npx -y @sveltejs/mcp get-documentation 'svelte/$state'
# or
npx -y @sveltejs/mcp get-documentation 'svelte/$state,svelte/await-expressions'
```

각 섹션은 제목이나 문서 경로로 찾을 수 있습니다. 섹션을 찾을 수 없으면 CLI는 에러를 반환하고, 가능한 경우 비슷한 항목도 함께 보여줍니다.

## `svelte-autofixer`

인라인 코드나 파일 경로를 대상으로 Svelte 자동 수정 도구(autofixer)를 실행합니다:

```bash
npx -y @sveltejs/mcp svelte-autofixer 'src/routes/+page.svelte'
```

인수가 존재하는 경로이면 CLI가 파일을 자동으로 읽습니다. 그렇지 않으면 인수를 Svelte 코드 그 자체로 취급합니다.

대부분의 셸은 `$`를 확장하므로 인라인 코드는 올바르게 따옴표로 감싸거나 이스케이프해야 합니다. 실제로는 소스를 직접 넘기는 것보다 파일 경로를 넘기는 편이 대개 더 쉽습니다.

사용 가능한 옵션:

- `--svelte-version <version>` - 어떤 Svelte 버전을 기준으로 검사할지 선택합니다. 버전별 제안이 활성화되도록 `package.json`에 있는 전체 버전(예: `5.16.0`)을 지정하는 것이 가장 좋습니다. 메이저 버전은 `4` 또는 `5`여야 합니다(기본값은 `5`)
- `--async` - Svelte 5 프로젝트에서 비동기 Svelte 분석을 활성화합니다

이 명령은 다음 항목을 담은 객체를 출력합니다:

- `issues`
- `suggestions`
- `require_another_tool_call_after_fixing`

그래서 에이전트 루프에서 쓰기 쉽습니다. 자동 수정 도구를 실행하고, 수정 사항을 적용한 뒤, 남은 문제나 제안이 없을 때까지 다시 실행하면 됩니다.
