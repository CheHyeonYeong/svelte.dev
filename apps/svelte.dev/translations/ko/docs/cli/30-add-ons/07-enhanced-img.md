---
title: enhanced-img
---

[`@sveltejs/enhanced-img`](https://svelte.dev/docs/kit/images)는 `avif`나 `webp` 같은 더 작은 파일 형식으로 이미지를 제공하고, 기기별로 알맞은 크기를 생성하며, 레이아웃 이동을 막기 위해 `width`와 `height`를 설정합니다.

## 사용법 <!-- Usage -->

```sh
npx sv add enhanced-img
```

## 제공되는 것 <!-- What you get -->

- `enhancedImages` Vite 플러그인
- 해당하는 `<img>` 태그를 `<enhanced:img>`로 변경
- pnpm 사용 시 허용된 빌드 목록에 `sharp` 추가
