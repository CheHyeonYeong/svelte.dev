---
title: <svelte:head>
---

```svelte
<svelte:head>...</svelte:head>
```

이 요소를 사용하면 `document.head`에 요소를 삽입할 수 있습니다. 서버 사이드 렌더링 중에는 `head` 콘텐츠가 메인 `body` 콘텐츠와 별도로 노출됩니다.

`<svelte:window>`, `<svelte:document>`, `<svelte:body>`와 마찬가지로, 이 요소는 컴포넌트의 최상위에만 둘 수 있으며 블록이나 요소 안에 절대 넣어서는 안 됩니다.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```
