---
title: 페이지
---

SvelteKit은 파일 시스템 기반 라우팅을 사용합니다. 즉, 앱의 *라우트*(다시 말해 사용자가 특정 URL로 이동했을 때 앱이 해야 할 일)는 코드베이스의 디렉터리로 정의됩니다.

`src/routes` 안의 모든 `+page.svelte` 파일은 앱의 페이지 하나를 만듭니다. 지금 이 앱에는 `/`에 대응하는 `src/routes/+page.svelte` 페이지 하나만 있습니다. `/about`으로 이동하면 404 Not Found 에러가 나타납니다.

이 문제를 고쳐 봅시다. 두 번째 페이지 `src/routes/about/+page.svelte`를 추가하고, `src/routes/+page.svelte`의 내용을 복사한 다음 수정해 보세요:

```svelte
/// file: src/routes/about/+page.svelte
<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

<h1>+++about+++</h1>
<p>this is the +++about+++ page.</p>
```

이제 `/`와 `/about` 사이를 이동할 수 있습니다.

> [!NOTE] 전통적인 멀티 페이지 앱과 달리, `/about`으로 이동했다가 돌아오면 싱글 페이지 앱처럼 현재 페이지의 내용만 갱신됩니다. 덕분에 서버 렌더링으로 빠르게 시작하고, 그 뒤로는 즉시 이동하는 두 가지 장점을 모두 누릴 수 있습니다. (이 동작은 [설정](/docs/kit/page-options)할 수 있습니다.)
