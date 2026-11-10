---
title: 페이지 데이터
path: /blog
---

SvelteKit이 하는 일은 결국 세 가지로 요약됩니다:

1. **라우팅** — 들어온 요청과 일치하는 라우트를 찾습니다
2. **로딩** — 라우트에 필요한 데이터를 가져옵니다
3. **렌더링** — (서버에서) HTML을 생성하거나 (브라우저에서) DOM을 갱신합니다

라우팅과 렌더링이 어떻게 동작하는지는 이미 살펴봤습니다. 이제 그 사이에 있는 로딩에 대해 이야기해 봅시다.

앱의 모든 페이지는 `+page.svelte` 파일 옆의 `+page.server.js` 파일에서 `load` 함수를 선언할 수 있습니다. 파일 이름에서 알 수 있듯이, 이 모듈은 클라이언트 사이드 내비게이션을 할 때도 포함해 항상 서버에서만 실행됩니다. `src/routes/blog/+page.svelte`에 하드코딩된 링크를 실제 블로그 글 데이터로 바꿀 수 있도록 `src/routes/blog/+page.server.js` 파일을 추가해 봅시다:

```js
/// file: src/routes/blog/+page.server.js
import { posts } from './data.js';

export function load() {
	return {
		summaries: posts.map((post) => ({
			slug: post.slug,
			title: post.title
		}))
	};
}
```

> [!NOTE] 튜토리얼에서는 편의상 `src/routes/blog/data.js`에서 데이터를 import합니다. 실제 앱이라면 데이터베이스나 CMS에서 데이터를 불러오는 경우가 더 많겠지만, 지금은 이렇게 하겠습니다.

`src/routes/blog/+page.svelte`에서는 `data` prop으로 이 데이터에 접근할 수 있습니다:

```svelte
/// file: src/routes/blog/+page.svelte
+++<script>
	let { data } = $props();
</script>+++

<h1>blog</h1>

<ul>
---	<li><a href="/blog/one">one</a></li>
	<li><a href="/blog/two">two</a></li>
	<li><a href="/blog/three">three</a></li>---
+++	{#each data.summaries as { slug, title }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}+++
</ul>
```

이제 글 페이지에도 똑같이 해 봅시다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	return {
		post
	};
}
```

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
+++<script>
	let { data } = $props();
</script>+++

---<h1>blog post</h1>---
+++<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>+++
```

마지막으로 처리해야 할 부분이 하나 있습니다. 사용자가 `/blog/nope`처럼 유효하지 않은 경로로 접속할 수도 있는데, 이때는 404 페이지로 응답하는 것이 좋습니다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
+++import { error } from '@sveltejs/kit';+++
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	+++if (!post) error(404);+++

	return {
		post
	};
}
```

에러 처리는 이후 챕터에서 더 자세히 배웁니다.
