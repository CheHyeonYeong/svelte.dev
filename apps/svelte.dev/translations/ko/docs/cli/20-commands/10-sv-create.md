---
title: sv create
---

`sv create`는 새 SvelteKit 프로젝트를 만들며, [추가 기능을 설정](sv-add#Official-add-ons)하는 옵션도 제공합니다.

## 사용법 <!-- Usage -->

```sh
npx sv create [options] [path]
```

## 옵션 <!-- Options -->

### `--from-playground <url>`

[플레이그라운드](/playground) URL로부터 SvelteKit 프로젝트를 만듭니다. 플레이그라운드의 모든 파일을 내려받고, 외부 의존성을 감지하고, 바로 쓸 수 있는 완전한 SvelteKit 프로젝트 구조를 설정합니다.

예시:

```sh
npx sv create --from-playground="https://svelte.dev/playground/hello-world"
```

### `--template <name>`

사용할 프로젝트 템플릿:

- `minimal` — 새 앱을 위한 최소한의 뼈대
- `demo` — JavaScript 없이도 동작하는 단어 맞히기 게임이 들어 있는 쇼케이스 앱
- `library` — `svelte-package`로 설정된 Svelte 라이브러리용 템플릿
- `addon` — 테스트하고 배포할 준비가 된 커뮤니티 애드온용 템플릿

### `--types <option>`

프로젝트에 타입 검사를 추가할지, 추가한다면 어떤 방식으로 할지 정합니다:

- `ts` — 기본으로 `.ts` 파일을 사용하고 `.svelte` 컴포넌트에 `lang="ts"`를 사용합니다
- `jsdoc` — 타입에 [JSDoc 문법](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)을 사용합니다

### `--no-types`

타입 검사를 추가하지 않습니다. 권장하지 않습니다!

### `--add [add-ons...]`

`create` 명령어에서 프로젝트에 애드온을 추가합니다. [sv add](sv-add#Usage)와 같은 형식을 따릅니다.

예시:

```sh
npx sv create --add eslint prettier [path]
```

### `--no-add-ons`

애드온을 고르는 대화형 프롬프트 없이 명령어를 실행합니다

### `--no-download-check`

커뮤니티 애드온을 내려받을 때 경고하지 않습니다.

> [!NOTE]
> Svelte 메인테이너는 커뮤니티 애드온에 악성 코드가 있는지 검토하지 않았습니다! 각자 판단하여 사용하세요.

### `--addon-name <name>`

애드온 템플릿을 만들 때 패키지 이름을 지정합니다. `@<org>/<pkg>` 또는 `<pkg>` 형식을 받습니다. 생략하면 이름을 묻는 프롬프트가 나타납니다.

### `--install <package-manager>`

지정한 패키지 매니저로 의존성을 설치합니다:

- `npm`
- `pnpm`
- `yarn`
- `bun`
- `deno`

### `--no-install`

의존성을 설치하지 않습니다.

### `--no-dir-check`

대상 디렉터리가 비어 있는지 확인하지 않고 건너뜁니다.
