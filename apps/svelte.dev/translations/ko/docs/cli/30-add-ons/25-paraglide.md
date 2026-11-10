---
title: paraglide
---

[Inlang의 Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)는 컴파일러 기반 i18n 라이브러리로, 트리 셰이킹이 가능한 메시지 함수를 생성하며 번들 크기가 작고, 비동기 워터폴이 없고, 완전한 타입 안전성 등을 제공합니다.

## 사용법 <!-- Usage -->

```sh
npx sv add paraglide
```

## 제공되는 것 <!-- What you get -->

- Inlang 프로젝트 설정
- paraglide Vite 플러그인
- SvelteKit `reroute` 및 `handle` 훅
- `app.html`의 `text-direction` 및 `lang` 속성
- 업데이트된 `.gitignore`
- paraglide 사용법을 보여 주는 선택적 데모 페이지

## 옵션 <!-- Options -->

### languageTags

지원하려는 언어로, IETF BCP 47 언어 태그로 지정합니다.

```sh
npx sv add paraglide="languageTags:en,es"
```

### demo

paraglide 사용법을 보여 주는 선택적 데모 페이지를 생성할지 여부입니다.

```sh
npx sv add paraglide="demo:yes"
```
