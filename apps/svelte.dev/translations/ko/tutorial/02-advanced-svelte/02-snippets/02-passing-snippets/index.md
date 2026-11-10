---
title: 컴포넌트에 스니펫 전달하기
---

스니펫은 함수처럼 그저 값이기 때문에 컴포넌트에 props로 전달할 수 있습니다.

이 `<FilteredList>` 컴포넌트를 보세요. 이 컴포넌트는 전달받은 `data`를 필터링하는 일을 하지만, 그 데이터를 어떻게 렌더링할지에 대해서는 관여하지 않습니다. 그것은 부모 컴포넌트의 몫입니다.

스니펫은 이미 몇 개 정의되어 있습니다. 먼저 이것들을 `<FilteredList>`에 전달하세요:

```svelte
/// file: App.svelte
<FilteredList
	data={colors}
	field="name"
	+++{header}+++
	+++{row}+++
></FilteredList>
```

그런 다음 반대편에서 `header`와 `row`를 props로 선언하세요:

```svelte
/// file: FilteredList.svelte
<script>
	let { data, field, +++header, row+++ } = $props();

	// ...
</script>
```

마지막으로 자리 표시용 콘텐츠를 render 태그로 바꾸세요:

```svelte
/// file: FilteredList.svelte
<div class="header">
	+++{@render header()}+++
</div>

<div class="content">
	{#each filtered as d}
		+++{@render row(d)}+++
	{/each}
</div>
```

이제 `MistyRose`나 `PeachPuff`의 16진수 코드를 외울 필요가 다시는 없을 겁니다.
