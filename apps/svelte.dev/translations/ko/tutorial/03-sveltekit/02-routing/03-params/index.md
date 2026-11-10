---
title: 라우트 매개변수
path: /blog
---

동적 매개변수가 있는 라우트를 만들려면 유효한 변수 이름을 대괄호로 감싸면 됩니다. 예를 들어 `src/routes/blog/[slug]/+page.svelte` 같은 파일은 `/blog/one`, `/blog/two`, `/blog/three` 등과 일치하는 라우트를 만듭니다.

이 파일을 만들어 봅시다:

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<h1>blog post</h1>
```

이제 `/blog` 페이지에서 개별 블로그 글로 이동할 수 있습니다. 다음 챕터에서는 글의 내용을 불러오는 방법을 알아봅니다.

> [!NOTE] 정적인 문자가 하나 이상 사이에 있기만 하면, 하나의 URL 세그먼트 *안에* 라우트 매개변수가 여러 개 있어도 됩니다. `foo/[bar]x[baz]`는 `[bar]`와 `[baz]`가 동적 매개변수인 유효한 라우트입니다.
