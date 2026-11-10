---
title: <svelte:fragment>
---

`<svelte:fragment>` 요소를 사용하면 컨테이너 DOM 요소로 감싸지 않고도 [이름 있는 슬롯](legacy-slots)에 콘텐츠를 넣을 수 있습니다. 덕분에 문서의 흐름 레이아웃이 그대로 유지됩니다.

```svelte
<!--- file: Widget.svelte --->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>
```

```svelte
<!--- file: App.svelte --->
<script>
	import Widget from './Widget.svelte';
</script>

<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

> [!NOTE]
> Svelte 5 이상에서는 스니펫이 감싸는 요소를 만들지 않으므로 이 개념은 더 이상 필요하지 않습니다
