---
title: navigating
---

`navigating` 객체는 현재 내비게이션을 나타냅니다. 링크 클릭, 뒤로/앞으로 가기, 또는 프로그래밍 방식의 `goto`로 내비게이션이 시작되면 `navigating`의 값은 다음 속성을 가진 객체가 됩니다:

- `from`과 `to` — `params`, `route`, `url` 속성을 가진 객체
- `type` — 내비게이션의 종류. 예: `link`, `popstate`, `goto`

> [!NOTE] 전체 타입 정보는 [`Navigation`](/docs/kit/$app-navigation#Navigation) 문서를 확인하세요.

이 객체를 사용하면 오래 걸리는 내비게이션에 로딩 표시를 보여 줄 수 있습니다. 이 연습 문제에서는 `src/routes/+page.server.js`와 `src/routes/about/+page.server.js` 모두에 인위적인 지연이 들어 있습니다. `src/routes/+layout.svelte`에서 `navigating` 객체를 import하고 내비게이션 바에 메시지를 추가해 보세요:

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, +++navigating+++ } from '$app/state';

	let { children } = $props();
</script>

<nav>
	<a href="/" aria-current={page.url.pathname === '/'}>
		home
	</a>

	<a href="/about" aria-current={page.url.pathname === '/about'}>
		about
	</a>

+++	{#if navigating.to}
		navigating to {navigating.to.url.pathname}
	{/if}+++
</nav>

{@render children()}
```

> [!NOTE] SvelteKit 2.12 이전에는 이를 위해 `$app/stores`를 사용해야 했습니다. 이 모듈은 같은 정보를 담은 `$navigating` 스토어를 제공합니다. SvelteKit 3에서는 `$app/state`로 대체되면서 제거되었습니다.
