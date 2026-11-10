---
title: sv migrate
---

`sv migrate`는 Svelte와 SvelteKit 코드베이스를 마이그레이션합니다. 새로운 마이그레이션은 `sv`의 태스크 기반 마이그레이션 시스템을 사용합니다. 레거시 마이그레이션은 [`svelte-migrate@1`](https://www.npmjs.com/package/svelte-migrate)에 위임되며, 오래된 프로젝트를 위해 계속 제공되지만 더 이상 업데이트되지 않습니다.

마이그레이션하기 전에 프로젝트를 커밋해 두고, 해당 마이그레이션에 링크된 변경 로그나 마이그레이션 가이드를 읽으세요. 마이그레이션 코드가 모든 애플리케이션을 고려할 수는 없으므로, 각 단계가 끝날 때마다 결과 diff를 검토하고 프로젝트의 검사를 실행하세요.

## 사용법 <!-- Usage -->

```sh
npx sv migrate
```

마이그레이션을 지정하지 않으면 `sv migrate`가 하나를 고르라는 프롬프트를 띄웁니다.

CLI에서 마이그레이션을 직접 지정할 수도 있습니다:

```sh
npx sv migrate [migration]
```

태스크 기반 마이그레이션에서는 `sv migrate`가 적용하기 전에 마이그레이션 태스크를 보여 줍니다. 선행 태스크는 항상 실행되며, 나머지 태스크는 대화형으로 고르거나 `--tasks`로 고를 수 있습니다.

마이그레이션 변경 사항을 검토하기 쉽게 하려면, 선택 가능한 태스크를 한 번에 하나씩 실행하고 다음 태스크를 시작하기 전에 결과를 커밋하세요. 태스크 시스템은 독립적인 마이그레이션 경로가 아니라, 초점이 분명한 커밋을 만들기 위한 것입니다. 태스크를 몇 개만 실행한 상태로 프로젝트가 동작하리라 기대하지 마세요. 대부분의 프로젝트는 해당하는 태스크를 모두 실행해야 마이그레이션이 완료됩니다.

태스크 기반 마이그레이션이 성공하면 `sv`는 프로젝트에 `format` 또는 `fmt` 스크립트가 있으면 그것으로 변경 사항을 포맷하고, 없으면 Prettier를 사용할 수 있을 때 변경된 파일을 Prettier로 포맷합니다. 그런 다음 업데이트된 의존성을 설치할지 묻습니다. 일부 변환은 수동 작업이 필요한 곳에 `@migration-task` 주석을 남깁니다. 마이그레이션이 끝났다고 판단하기 전에 프로젝트에서 이 표시를 정확히 검색해 보세요.

## 태스크 기반 마이그레이션 <!-- Task-based migrations -->

### `sveltekit-3`

SvelteKit 2 앱을 SvelteKit 3로 업그레이드합니다. 실행하기 전에 [SvelteKit 3 변경 로그](https://github.com/sveltejs/kit/blob/main/packages/kit/CHANGELOG.md#300)를 읽으세요.

이 마이그레이션은 다음 태스크로 나뉩니다:

- `package-json` (선행) SvelteKit 3에 맞게 패키지 버전을 업데이트합니다.
- `tsconfig` (선행) `.svelte-kit/tsconfig.json` 대신 생성된 `$app/tsconfig`를 확장합니다.
- `svelte-config` 지원되는 설정을 `svelte.config.*`에서 `vite.config.*`로 옮기고, 가능하면 기존 설정을 import하는 부분도 업데이트합니다.
- `environment` 레거시 환경 모듈을 `$app/env`로 바꾸고, 필요하면 `src/env.js` 또는 `src/env.ts` 선언을 만듭니다.
- `paths` 지원 중단된 `$app/paths` API와 경로 타입을 마이그레이션합니다.
- `external-redirects` 외부 리디렉션이 새로운 리디렉션 동작을 따르도록 설정합니다.
- `shallow-routing` 얕은 라우팅 API를 `goto` 호출로 바꿉니다.
- `params` 라우트 매개변수 매처를 `src/params.js` 또는 `src/params.ts`로 모읍니다.
- `app-state` `$app/stores` 사용을 `$app/state`로 마이그레이션합니다.

이 마이그레이션은 안전하게 식별할 수 있는 패턴만 변경합니다. 수동 작업이 필요한 변경 사항은 `@migration-task` 주석과 SvelteKit 3 변경 로그를 검토하세요.

### `app-state`

`.svelte` 파일에서 `$app/stores` 사용을 `$app/state`로 마이그레이션합니다. 자세한 내용은 [마이그레이션 가이드](/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated)를 참고하세요.

## 레거시 마이그레이션 <!-- Legacy migrations -->

아래 마이그레이션은 `svelte-migrate@1`을 통해 실행됩니다. 오래된 프로젝트가 업그레이드할 수 있도록 계속 제공되지만, 더 이상 수정이나 새로 발견된 코드 패턴에 대한 지원을 받지 않습니다. 먼저 프로젝트를 커밋하고 출력 결과를 꼼꼼히 검토하세요.

### `svelte-5`

Svelte 4 앱을 Svelte 5로 업그레이드하고, 개별 컴포넌트가 [룬](../svelte/what-are-runes)과 그 밖의 Svelte 5 문법을 사용하도록 업데이트합니다([마이그레이션 가이드 참고](../svelte/v5-migration-guide)).

### `self-closing-tags`

`.svelte` 파일에서 void 요소가 아닌 요소의 자체 닫힘 태그를 모두 바꿉니다. 자세한 내용은 [풀 리퀘스트](https://github.com/sveltejs/kit/pull/12128)를 참고하세요.

### `svelte-4`

Svelte 3 앱을 Svelte 4로 업그레이드합니다([마이그레이션 가이드 참고](../svelte/v4-migration-guide)).

### `sveltekit-2`

SvelteKit 1 앱을 SvelteKit 2로 업그레이드합니다([마이그레이션 가이드 참고](../kit/migrating-to-sveltekit-2)).

### `package`

`@sveltejs/package` 버전 1을 사용하는 라이브러리를 버전 2로 업그레이드합니다. 자세한 내용은 [풀 리퀘스트](https://github.com/sveltejs/kit/pull/8922)를 참고하세요.

### `routes`

정식 출시 전 SvelteKit 앱이 SvelteKit 1의 파일 시스템 라우팅 규칙을 사용하도록 업그레이드합니다. 자세한 내용은 [풀 리퀘스트](https://github.com/sveltejs/kit/discussions/5774)를 참고하세요.

## 옵션 <!-- Options -->

이 옵션들은 태스크 기반 마이그레이션과 레거시 마이그레이션 모두에 적용됩니다.

### `--cwd <path>`

다른 작업 디렉터리에서 마이그레이션을 실행합니다. 경로의 기본값은 현재 디렉터리이며, 경로에는 `package.json`이 있어야 합니다.

### `--no-git-check`

기본적으로 `sv migrate`는 git 작업 트리에 커밋하지 않은 변경 사항이 있으면 변경을 적용하기 전에 확인을 요청합니다. 이 확인을 건너뛰려면 `--no-git-check`를 사용하세요.

### `--confirm`

마이그레이션을 적용하기 전의 마지막 확인 프롬프트를 건너뜁니다. 마이그레이션 선택이나 작업 트리 변경 확인은 건너뛰지 않습니다. 비대화형으로 사용하려면 마이그레이션 이름과 그에 맞는 옵션을 지정하세요.

## 태스크 기반 마이그레이션 옵션 <!-- Task-based migration options -->

이 옵션들은 레거시 마이그레이션에는 적용되지 않습니다. 레거시 마이그레이션은 태스크나 파일 선택을 지원하지 않으며, 의존성 설치 방식도 자체적으로 관리합니다.

### `--files <glob>`

마이그레이션이 저장하는 파일을 glob에 맞는 파일로 제한합니다. 이 옵션은 고급 사용자를 위한 탈출구이지, 프로젝트 일부에만 마이그레이션 전체를 실행하는 방법이 아닙니다. 태스크는 설정, 소스, 생성된 파일에 걸쳐 서로 관련된 변경을 하는 경우가 많기 때문에, 그중 하나라도 제외하면 import, 설정, 타입이 서로 맞지 않게 되어 프로젝트가 일시적으로 깨질 수 있습니다.

태스크가 glob 밖의 파일을 수정하거나 만들려고 할 수도 있습니다. `sv migrate`는 그 파일을 저장하지 않고 **Unmodified files** 아래에 보고합니다. 그 목록을 검토한 뒤 해당 태스크를 필터 없이 또는 더 넓은 필터로 다시 실행하거나, 빠진 변경 사항을 직접 적용하세요.

`--cwd`와 함께 사용하면 glob은 작업 디렉터리에 대한 상대 경로가 됩니다.

### `--tasks [task...]`

대화형 태스크 프롬프트 없이 마이그레이션 태스크를 선택합니다. 선행 태스크는 나머지 태스크의 토대를 마련하므로 항상 실행됩니다.

태스크 ID 없이 `--tasks`를 사용하면 마이그레이션에서 사용할 수 있는 모든 태스크를 실행하지 않고 출력합니다.

모든 태스크를 실행하려면 `--tasks all`을, 선행 태스크만 실행하려면 `--tasks prerequisite`를 사용하세요.

변경 사항을 검토하기 쉽게 유지하려면 태스크 ID를 한 번에 하나씩 전달하고, 결과를 검토하고 커밋한 뒤 다음 태스크를 실행하세요. `--tasks all`은 주로 자동화에 쓰거나, 하나로 합쳐진 diff를 의도적으로 원할 때 사용하세요.

### `--install <package-manager>`

지정한 패키지 매니저로 의존성을 설치합니다:

- `npm`
- `pnpm`
- `yarn`
- `bun`
- `deno`

### `--no-install`

마이그레이션 후 의존성 설치를 건너뜁니다.
