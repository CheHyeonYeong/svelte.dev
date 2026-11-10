---
title: 페이지 새로고침
---

보통 SvelteKit은 페이지를 새로고침하지 않고 페이지 사이를 이동합니다. 이 연습에서 `/`와 `/about` 사이를 이동해도 타이머가 계속 흘러갑니다.

드물게 이 동작을 끄고 싶을 때가 있습니다. 개별 링크나 링크를 포함하는 요소에 `data-sveltekit-reload` 속성을 추가하면 됩니다:

```svelte
/// file: src/routes/+layout.svelte
<nav +++data-sveltekit-reload+++>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>
```

사용할 수 있는 링크 옵션과 값에 대한 자세한 내용은 [링크 옵션 문서](/docs/kit/link-options)를 참고하세요.
