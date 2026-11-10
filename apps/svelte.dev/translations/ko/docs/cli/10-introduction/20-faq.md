---
title: 자주 묻는 질문
---

## `sv` CLI는 어떻게 실행하나요? <!-- How do I run the `sv` CLI? -->

`sv`를 실행하는 방법은 패키지 매니저마다 조금씩 다릅니다. 가장 흔히 쓰는 명령어는 다음과 같습니다:

- **npm** : `npx sv create`
- **pnpm** : `pnpm dlx sv create`
- **Bun** : `bunx sv create`
- **Deno** : `deno run npm:sv create`
- **Yarn** : `yarn dlx sv create`

## `npx sv`가 동작하지 않아요 <!-- `npx sv` is not working -->

일부 패키지 매니저는 레지스트리에서 패키지를 내려받아 실행하기보다 로컬에 설치된 도구를 우선 실행합니다. 이 문제는 주로 `npm`과 `yarn`에서 발생합니다. 보통 에러 메시지가 나오거나, 실행하려던 명령어가 아무것도 하지 않은 것처럼 보입니다.

다음은 사용자들이 과거에 겪었던 문제와 가능한 해결책 목록입니다:

- [`npx sv` create가 아무것도 하지 않음](https://github.com/sveltejs/cli/issues/472)
- [`sv` 명령어 이름이 `runit`과 충돌함](https://github.com/sveltejs/cli/issues/259)
- [Windows PowerShell에서 `sv`가 `Set-Variable`과 충돌함](https://github.com/sveltejs/cli/issues/317)
