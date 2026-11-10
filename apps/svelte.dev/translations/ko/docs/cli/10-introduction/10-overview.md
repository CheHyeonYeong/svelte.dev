---
title: 개요
---

명령줄 인터페이스(CLI)인 `sv`는 Svelte 애플리케이션을 만들고 유지 관리하기 위한 도구 모음입니다.

## 사용법 <!-- Usage -->

`sv`를 실행하는 가장 쉬운 방법은 [`npx`](https://docs.npmjs.com/cli/v8/commands/npx)를 사용하는 것입니다(다른 패키지 매니저를 쓴다면 그에 해당하는 명령어를 쓰세요. 예를 들어 [pnpm](https://pnpm.io/)이라면 `pnpm dlx`입니다):

```sh
npx sv <command> <args>
```

`sv`가 이미 설치된 프로젝트 안이라면 로컬에 설치된 것을 사용하고, 그렇지 않으면 최신 버전을 내려받아 설치 없이 실행합니다. 이 방식은 특히 [`sv create`](sv-create)에 유용합니다.

## 감사의 말 <!-- Acknowledgements -->

npm에서 원래 `sv`라는 이름을 갖고 있던 [Christopher Brown](https://github.com/chbrown)이 Svelte CLI가 이 이름을 쓸 수 있도록 흔쾌히 허락해 준 데 감사드립니다. 원래의 `sv` 패키지는 [`@chbrown/sv`](https://www.npmjs.com/package/@chbrown/sv)에서 찾을 수 있습니다.
