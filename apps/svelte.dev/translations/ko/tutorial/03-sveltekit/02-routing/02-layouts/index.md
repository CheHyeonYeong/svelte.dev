---
title: 레이아웃
---

앱의 여러 라우트는 공통 UI를 공유하는 경우가 많습니다. 이 UI를 `+page.svelte` 컴포넌트마다 반복하는 대신, 같은 디렉터리의 모든 라우트에 적용되는 `+layout.svelte` 컴포넌트를 사용할 수 있습니다.

이 앱에는 같은 내비게이션 UI를 담고 있는 `src/routes/+page.svelte`와 `src/routes/about/+page.svelte` 두 라우트가 있습니다. 새 파일 `src/routes/+layout.svelte`를 만들고...

```
src/routes/
├ about/
│ └ +page.svelte
+++├ +layout.svelte+++
└ +page.svelte
```

...`+page.svelte` 파일들에서 중복된 내용을 새 `+layout.svelte` 파일로 옮겨 보세요. `{@render children()}` 태그는 페이지 내용이 렌더링될 자리입니다:

```svelte
/// file: src/routes/+layout.svelte
<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

{@render children()}
```

`+layout.svelte` 파일은 형제인 `+page.svelte`(있다면)를 포함해 모든 하위 라우트에 적용됩니다. 레이아웃은 원하는 만큼 깊게 중첩할 수 있습니다.
