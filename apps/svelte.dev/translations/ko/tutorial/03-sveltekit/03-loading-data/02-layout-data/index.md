---
title: 레이아웃 데이터
path: /blog
---

`+layout.svelte` 파일이 모든 하위 라우트의 UI를 만드는 것처럼, `+layout.server.js` 파일은 모든 하위 라우트의 데이터를 불러옵니다.

블로그 글 페이지에 '다른 글' 사이드바를 추가하고 싶다고 해 봅시다. `src/routes/blog/+page.server.js`에서 하는 것처럼 `src/routes/blog/[slug]/+page.server.js`의 `load` 함수에서 `summaries`를 반환할 *수도* 있지만, 그러면 같은 코드가 반복됩니다.

대신 `src/routes/blog/+page.server.js`의 이름을 `src/routes/blog/+layout.server.js`로 바꿔 봅시다. `/blog` 라우트가 여전히 잘 동작한다는 점에 주목하세요. 페이지에서는 여전히 `data.summaries`를 사용할 수 있습니다.

이제 글 페이지의 레이아웃에 사이드바를 추가해 보세요:

```svelte
/// file: src/routes/blog/[slug]/+layout.svelte
<script>
	let { data, children } = $props();
</script>

<div class="layout">
	<main>
		{@render children()}
	</main>

+++	<aside>
		<h2>More posts</h2>
		<ul>
			{#each data.summaries as { slug, title }}
				<li>
					<a href="/blog/{slug}">{title}</a>
				</li>
			{/each}
		</ul>
	</aside>+++
</div>

<style>
	@media (min-width: 640px) {
		.layout {
			display: grid;
			gap: 2em;
			grid-template-columns: 1fr 16em;
		}
	}
</style>
```

레이아웃(과 그 아래의 모든 페이지)은 부모 `+layout.server.js`로부터 `data.summaries`를 물려받습니다.

한 글에서 다른 글로 이동할 때는 글 자체의 데이터만 불러오면 됩니다. 레이아웃 데이터는 여전히 유효하기 때문입니다. 자세한 내용은 [무효화](/docs/kit/load#Rerunning-load-functions)에 관한 문서를 보세요.
