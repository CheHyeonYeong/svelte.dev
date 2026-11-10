---
title: $$slots
---

룬 모드에서는 [스니펫](snippet)이 일반 props일 뿐이므로 어떤 스니펫이 컴포넌트에 전달되었는지 알 수 있습니다.

레거시 모드에서는 특정 슬롯에 콘텐츠가 제공되었는지 `$$slots` 객체로 알 수 있습니다. 이 객체의 키는 부모가 컴포넌트에 전달한 슬롯의 이름입니다.

```svelte
<!--- file: Card.svelte --->
<div>
	<slot name="title" />
	{#if $$slots.description}
		<!-- This <hr> and slot will render only if `slot="description"` is provided. -->
		<hr />
		<slot name="description" />
	{/if}
</div>
```

```svelte
<!--- file: App.svelte --->
<Card>
	<h1 slot="title">Blog Post Title</h1>
	<!-- No slot named "description" was provided so the optional slot will not be rendered. -->
</Card>
```
