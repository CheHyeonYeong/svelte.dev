---
title: sv add
---

`sv add`는 기존 프로젝트에 새 기능을 추가합니다.

## 사용법 <!-- Usage -->

```sh
npx sv add
```

```sh
npx sv add [add-ons]
```

[아래 목록](#Official-add-ons)에서 여러 애드온을 공백으로 구분해 고르거나, 대화형 프롬프트를 사용할 수 있습니다.

## 옵션 <!-- Options -->

### `-C`, `--cwd`

Svelte(Kit) 프로젝트 루트의 경로입니다.

### `--no-git-check`

커밋하지 않은 변경 사항이 있어도 경고하지 않습니다.

### `--no-download-check`

커뮤니티 애드온을 내려받을 때 경고하지 않습니다.

> [!NOTE]
> Svelte 메인테이너는 커뮤니티 애드온에 악성 코드가 있는지 검토하지 않았습니다! 각자 판단하여 사용하세요.

### `--install <package-manager>`

지정한 패키지 매니저로 의존성을 설치합니다:

- `npm`
- `pnpm`
- `yarn`
- `bun`
- `deno`

### `--no-install`

의존성을 설치할지 묻지 않습니다.

## 공식 애드온 <!-- Official add-ons -->

- [`ai-tools`](ai-tools)
- [`better-auth`](better-auth)
- [`drizzle`](drizzle)
- [`enhanced-img`](enhanced-img)
- [`eslint`](eslint)
- [`mdsvex`](mdsvex)
- [`paraglide`](paraglide)
- [`playwright`](playwright)
- [`prettier`](prettier)
- [`storybook`](storybook)
- [`sveltekit-adapter`](sveltekit-adapter)
- [`tailwindcss`](tailwind)
- [`vitest`](vitest)

## 커뮤니티 애드온 <!-- Community add-ons -->

> [!NOTE]
> Svelte 메인테이너는 커뮤니티 애드온에 악성 코드가 있는지 검토하지 않았습니다!

커뮤니티 애드온은 커뮤니티가 배포한 npm 패키지입니다. 좋아하는 라이브러리와 도구의 애드온을 찾아보세요. *(곧 제공 예정)* 많은 개발자가 자신의 통합 기능을 한 줄로 설치할 수 있도록 `sv` 애드온을 만들고 있습니다. [npmx](https://www.npmx.dev/search?q=keyword:sv-add)에서 `sv-add` 키워드로 검색해 찾을 수 있습니다.

```sh
# Install a community addon-on
npx sv add my-addon

# Also works with org names
npx sv add @supacool/sv

# As a shorthand, packages named `sv` can be omitted
npx sv add @supacool

# Use a local add-on (for development or internal use)
npx sv add file:../path/to/my-addon

# Mix and match official and community add-ons
npx sv add eslint @supacool

# Also works when creating a new project directly
npx sv create --add eslint @supacool
```

> [!NOTE]
> Windows PowerShell에서 `@`는 특수 문자이므로 작은따옴표로 감싸 이스케이프해야 합니다. 예: `npx sv add '@supacool'`.

직접 만들어 보고 싶나요? [애드온 문서](community)를 확인하세요.
