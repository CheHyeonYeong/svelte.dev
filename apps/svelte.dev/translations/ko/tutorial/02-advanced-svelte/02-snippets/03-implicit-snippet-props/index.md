---
title: 암시적 스니펫 props
---

작성 편의를 위해, 컴포넌트 안에 바로 선언한 스니펫은 그 컴포넌트*의* props가 됩니다. `header`와 `row` 스니펫을 `<FilteredList>` 안으로 옮기세요:

```svelte
/// file: App.svelte
<FilteredList
	data={colors}
	field="name"
	{header}
	{row}
>
	+++{#snippet header()}...{/snippet}+++

	+++{#snippet row(d)}...{/snippet}+++
</FilteredList>

---{#snippet header()}...{/snippet}---

---{#snippet row(d)}...{/snippet}---
```

이제 명시적으로 넘기던 props에서 이것들을 제거할 수 있습니다:

```svelte
/// file: App.svelte
<FilteredList data={colors} field="name" ---{header} {row}--->
	{#snippet header()}...{/snippet}

	{#snippet row(d)}...{/snippet}
</FilteredList>
```

컴포넌트 안의 콘텐츠 중 선언된 스니펫에 속하지 *않는* 것은 모두 특별한 `children` 스니펫이 됩니다. `header`는 매개변수가 없으므로 블록 태그를 제거해서 `children`으로 바꿀 수 있습니다...

```svelte
/// file: App.svelte
---{#snippet header()}---
<header>
	<span class="color"></span>
	<span class="name">name</span>
	<span class="hex">hex</span>
	<span class="rgb">rgb</span>
	<span class="hsl">hsl</span>
</header>
---{/snippet}---
```

...그리고 반대편에서 `header` prop의 이름을 `children`으로 바꾸세요:

```svelte
/// file: FilteredList.svelte
<script>
	let { data, field, +++children+++, row } = $props();

	// ...
</script>
```

```svelte
/// file: FilteredList.svelte
<div class="header">
	+++{@render children()}+++
</div>
```
