---
title: tailwindcss
---

[Tailwind CSS](https://tailwindcss.com/)를 사용하면 HTML을 벗어나지 않고도 현대적인 웹사이트를 빠르게 만들 수 있습니다.

## 사용법 <!-- Usage -->

```sh
npx sv add tailwindcss
```

## 제공되는 것 <!-- What you get -->

- [SvelteKit용 Tailwind 가이드](https://tailwindcss.com/docs/installation/framework-guides/sveltekit)를 따른 Tailwind 설정
- Tailwind Vite 플러그인
- 업데이트된 `layout.css`와 `+layout.svelte`(SvelteKit의 경우) 또는 `app.css`와 `App.svelte`(SvelteKit이 아닌 Vite 앱의 경우)
- `prettier`를 사용 중이라면 `prettier`와의 통합

## 옵션 <!-- Options -->

### plugins

사용할 플러그인:

- `typography` — [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)
- `forms` — [`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms)

```sh
npx sv add tailwindcss="plugins:typography"
```
