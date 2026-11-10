---
title: page
---

SvelteKit은 `$app/state` 모듈을 통해 읽기 전용 상태 객체 세 가지(`page`, `navigating`, `updated`)를 제공합니다. 가장 자주 쓰게 될 것은 현재 페이지에 대한 정보를 제공하는 [`page`](/docs/kit/$app-state#Page)입니다:

- `url` — 현재 페이지의 [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- `params` — 현재 페이지의 [매개변수](params)
- `route` — 현재 라우트를 나타내는 `id` 속성이 있는 객체
- `status` — 현재 페이지의 HTTP 상태 코드
- `error` — 현재 페이지의 에러 객체(있는 경우). 에러 처리는 [이후](error-basics) [연습 문제](handleerror)에서 더 자세히 배웁니다
- `data` — 모든 `load` 함수의 반환값을 합친 현재 페이지의 데이터
- `form` — [폼 액션](the-form-element)이 반환한 데이터

이 속성들은 모두 반응형이며, 내부적으로 `$state.raw`를 사용합니다. 다음은 `page.url.pathname`을 사용하는 예제입니다:

```svelte
/// file: src/routes/+layout.svelte
<script>
	+++import { page } from '$app/state';+++

	let { children } = $props();
</script>

<nav>
	<a href="/" +++aria-current={page.url.pathname === '/'}+++>
		home
	</a>

	<a href="/about" +++aria-current={page.url.pathname === '/about'}+++>
		about
	</a>
</nav>

{@render children()}
```

> [!NOTE] SvelteKit 2.12 이전에는 이를 위해 `$app/stores`를 사용해야 했습니다. 이 모듈은 같은 정보를 담은 `$page` 스토어를 제공합니다. SvelteKit 3에서는 `$app/state`로 대체되면서 제거되었습니다.
