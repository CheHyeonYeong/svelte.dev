---
title: <svelte:head>
---

`<svelte:head>` 요소를 사용하면 문서의 `<head>` 안에 요소를 넣을 수 있습니다. 좋은 SEO에 꼭 필요한 `<title>`이나 `<meta>` 태그 같은 것에 유용합니다.

이런 태그는 이 튜토리얼에서 보여 주기가 꽤 어려우므로, 여기서는 다른 용도인 스타일시트 로드에 사용해 보겠습니다.

```svelte
/// file: App.svelte
<script>
	const themes = ['margaritaville', 'retrowave', 'spaaaaace', 'halloween'];
	let selected = $state(themes[0]);
</script>

+++<svelte:head>
	<link rel="stylesheet" href="/tutorial/stylesheets/{selected}.css" />
</svelte:head>+++

<h1>Welcome to my site!</h1>
```

> [!NOTE] 서버 사이드 렌더링(SSR) 모드에서는 `<svelte:head>`의 내용이 나머지 HTML과 분리되어 반환됩니다.
