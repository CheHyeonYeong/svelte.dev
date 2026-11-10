---
title: 에러 페이지
---

`load` 함수 안에서나 렌더링 중에 문제가 생기면 SvelteKit은 에러 페이지를 렌더링합니다.

기본 에러 페이지는 다소 밋밋합니다. `src/routes/+error.svelte` 컴포넌트를 만들어 커스터마이즈할 수 있습니다:

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/state';
	import { emojis } from './emojis.js';
</script>

<h1>{page.status} {page.error.message}</h1>
<span style="font-size: 10em">
	{emojis[page.status] ?? emojis[500]}
</span>
```

`+error.svelte` 컴포넌트가 루트 `+layout.svelte` 안에서 렌더링된다는 점에 주목하세요. 더 세분화된 `+error.svelte` 바운더리를 만들 수도 있습니다:

```svelte
/// file: src/routes/app/+error.svelte
<h1>this error was expected</h1>
```

이 컴포넌트는 `/app`에서 렌더링되고, 그 밖에 발생하는 다른 에러에는 루트 `src/routes/+error.svelte` 페이지가 렌더링됩니다.
