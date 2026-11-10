---
title: experimental
---

Svelte와 [SvelteKit](https://svelte.dev/docs/kit/configuration#experimental)의 실험적 기능을 활성화합니다.

## 사용법 <!-- Usage -->

```sh
npx sv add experimental
```

## 제공되는 것 <!-- What you get -->

- 선택한 실험적 플래그가 설정에 추가됨

## 옵션 <!-- Options -->

### features

활성화할 실험적 플래그:

- `async` — 컴포넌트에서 `await` 사용
- `remoteFunctions` — 원격 함수
- `forkPreloads` — 포크된 프리로딩

```sh
npx sv add experimental="features:async,remoteFunctions"
```
