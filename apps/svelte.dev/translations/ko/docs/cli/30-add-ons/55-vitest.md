---
title: vitest
---

[Vitest](https://vitest.dev/)는 Vite 네이티브 테스트 프레임워크입니다.

## 사용법 <!-- Usage -->

```sh
npx sv add vitest
```

## 제공되는 것 <!-- What you get -->

- 관련 패키지 설치 및 `package.json`에 스크립트 추가
- Vite 설정 파일에 클라이언트/서버를 구분하는 Svelte 테스트 설정
- 데모 테스트

## 옵션 <!-- Options -->

### usages

사용할 테스트 종류:

- `unit` — 단위 테스트
- `component` — 컴포넌트 테스트

```sh
npx sv add vitest="usages:unit,component"
```
