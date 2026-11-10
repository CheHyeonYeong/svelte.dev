---
title: sv check
---

`sv check`는 프로젝트에서 다음과 같은 에러와 경고를 찾아냅니다:

- 사용되지 않는 CSS
- 접근성 힌트
- JavaScript/TypeScript 컴파일러 에러

Node 16 이상이 필요합니다.

## 설치 <!-- Installation -->

프로젝트에 `svelte-check` 패키지가 설치되어 있어야 합니다:

```sh
npm i -D svelte-check
```

## 사용법 <!-- Usage -->

```sh
npx sv check
```

## 옵션 <!-- Options -->

### `--workspace <path>`

워크스페이스 경로입니다. `node_modules`와 `--ignore`에 나열한 것을 제외한 모든 하위 디렉터리를 검사합니다.

### `--output <format>`

에러와 경고를 표시하는 방식입니다. [기계가 읽을 수 있는 출력](#Machine-readable-output)을 참고하세요.

- `human`
- `human-verbose`
- `machine`
- `machine-verbose`

### `--watch`

프로세스를 계속 실행하면서 변경 사항을 감시합니다.

### `--preserveWatchOutput`

감시 모드에서 화면이 지워지지 않게 합니다.

### `--tsconfig <path>`

`tsconfig` 또는 `jsconfig` 파일의 경로를 전달합니다. 경로는 워크스페이스 경로에 대한 상대 경로이거나 절대 경로일 수 있습니다. 이렇게 하면 설정 파일의 `files`/`include`/`exclude` 패턴에 맞는 파일만 진단합니다. 또한 TypeScript와 JavaScript 파일의 에러도 보고합니다. 지정하지 않으면 프로젝트 디렉터리에서 위로 올라가며 가장 가까운 `jsconfig`/`tsconfig.json` 파일을 찾습니다.

### `--no-tsconfig`

현재 디렉터리와 그 하위에 있는 Svelte 파일만 검사하고 `.js`/`.ts` 파일은 무시하려면 이 옵션을 사용하세요(해당 파일은 타입 검사를 하지 않습니다)

### `--ignore <paths>`

무시할 파일/폴더로, 워크스페이스 루트에 대한 상대 경로입니다. 경로는 쉼표로 구분하고 따옴표로 감싸야 합니다. 예시:

```sh
npx sv check --ignore "dist,build"
```

<!-- TODO what the hell does this mean? is it possible to use --tsconfig AND --no-tsconfig? if so what would THAT mean? -->

`--no-tsconfig`와 함께 쓸 때만 효과가 있습니다. `--tsconfig`와 함께 쓰면 감시하는 파일에만 영향을 주고, 진단하는 파일에는 영향을 주지 않습니다. 진단 대상은 `tsconfig.json`이 결정합니다.

### `--fail-on-warnings`

이 옵션을 주면 경고가 있을 때도 `sv check`가 에러 코드로 종료됩니다.

### `--compiler-warnings <warnings>`

따옴표로 감싸고 쉼표로 구분한 `code:behaviour` 쌍의 목록입니다. `code`는 [컴파일러 경고 코드](../svelte/compiler-warnings)이고 `behaviour`는 `ignore` 또는 `error`입니다:

```sh
npx sv check --compiler-warnings "css_unused_selector:ignore,a11y_missing_attribute:error"
```

### `--diagnostic-sources <sources>`

코드에 진단을 실행할 소스를 따옴표로 감싸고 쉼표로 구분한 목록입니다. 기본값은 모두 활성화입니다:

<!-- TODO would be nice to have a clearer definition of what these are -->

- `js` (TypeScript 포함)
- `svelte`
- `css`

예시:

```sh
npx sv check --diagnostic-sources "js,svelte"
```

### `--threshold <level>`

진단 결과를 걸러냅니다:

- `warning` (기본값) — 에러와 경고를 모두 표시합니다
- `error` — 에러만 표시합니다

## 문제 해결 <!-- Troubleshooting -->

전처리기 설정과 그 밖의 문제 해결에 관한 자세한 내용은 [language-tools 문서를 참고하세요](https://github.com/sveltejs/language-tools/blob/master/docs/README.md).

## 기계가 읽을 수 있는 출력 <!-- Machine-readable output -->

`--output`을 `machine` 또는 `machine-verbose`로 설정하면 CI 파이프라인이나 코드 품질 검사 등에서
기계가 읽기 쉬운 형식으로 출력합니다.

각 행은 하나의 새 레코드에 해당합니다. 행은 공백 문자 하나로 구분된
열로 이루어집니다. 모든 행의 첫 번째 열에는 모니터링 용도로 쓸 수 있는 밀리초 단위의
타임스탬프가 들어 있습니다. 두 번째 열은 "행 타입"을 나타내며, 이에 따라
뒤에 오는 열의 개수와 타입이 달라질 수 있습니다.

첫 번째 행은 `START` 타입이며 워크스페이스 폴더를 (따옴표로 감싸서) 담고 있습니다. 예시:

```
1590680325583 START "/home/user/language-tools/packages/language-server/test/plugins/typescript/testfiles"
```

그 뒤로 `ERROR` 또는 `WARNING` 레코드가 몇 개든 올 수 있습니다. 두 레코드의 구조는 같으며, output 인자에 따라 달라집니다.

인자가 `machine`이면 파일 이름, 시작 줄과 열 번호, 에러 메시지를 알려 줍니다. 파일 이름은 워크스페이스 디렉터리에 대한 상대 경로입니다. 파일 이름과 메시지는 모두 따옴표로 감싸져 있습니다. 예시:

```
1590680326283 ERROR "codeactions.svelte" 1:16 "Cannot find module 'blubb' or its corresponding type declarations."
1590680326778 WARNING "imported-file.svelte" 0:37 "Component has unused export property 'prop'. If it is for external reference only, please consider using `export const prop`"
```

인자가 `machine-verbose`이면 파일 이름, 시작 줄과 열 번호, 끝 줄과 열 번호, 에러 메시지, 진단 코드, 코드에 대한 사람이 읽기 쉬운 설명, 진단의 사람이 읽기 쉬운 출처(예: svelte/typescript)를 알려 줍니다. 파일 이름은 워크스페이스 디렉터리에 대한 상대 경로입니다. 각 진단은 로그의 타임스탬프가 앞에 붙은 [ndjson](https://en.wikipedia.org/wiki/JSON_streaming#Newline-Delimited_JSON) 한 줄로 표현됩니다. 예시:

```
1590680326283 {"type":"ERROR","fn":"codeaction.svelte","start":{"line":1,"character":16},"end":{"line":1,"character":23},"message":"Cannot find module 'blubb' or its corresponding type declarations.","code":2307,"source":"js"}
1590680326778 {"type":"WARNING","filename":"imported-file.svelte","start":{"line":0,"character":37},"end":{"line":0,"character":51},"message":"Component has unused export property 'prop'. If it is for external reference only, please consider using `export
const prop`","code":"unused-export-let","source":"svelte"}
```

출력은 검사 중에 발견된 파일, 에러, 경고의 총개수를 요약하는 `COMPLETED` 메시지로 끝납니다. 예시:

```
1590680326807 COMPLETED 20 FILES 21 ERRORS 1 WARNINGS 3 FILES_WITH_PROBLEMS
```

애플리케이션에서 런타임 에러가 발생하면 이 에러는 `FAILURE` 레코드로 나타납니다. 예시:

```
1590680328921 FAILURE "Connection closed"
```

## 크레딧 <!-- Credits -->

- `svelte-check`의 토대를 마련한 Vue의 [VTI](https://github.com/vuejs/vetur/tree/master/vti)

## FAQ

### 특정 파일만(예: 스테이징된 파일만) 검사하는 옵션이 없는 이유는 무엇인가요? <!-- Why is there no option to only check specific files (for example only staged files)? -->

검사가 유효하려면 `svelte-check`가 프로젝트 전체를 '봐야' 합니다. 컴포넌트 prop의 이름을 바꿨는데 그 prop을 쓰는 곳은 하나도 고치지 않았다고 해 봅시다. 이제 사용하는 곳이 모두 에러지만, 변경된 파일만 검사한다면 이 에러들을 놓치게 됩니다.
