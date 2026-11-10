---
title: 크기
---

어떤 요소에든 `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight` 바인딩을 추가할 수 있으며, Svelte는 [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)를 사용해 바인딩된 값을 업데이트합니다:

```svelte
/// file: App.svelte
<div +++bind:clientWidth={w} bind:clientHeight={h}+++>
	<span style="font-size: {size}px" contenteditable>edit this text</span>
	<span class="size">{w} x {h}px</span>
</div>
```

이 바인딩들은 읽기 전용입니다. `w`와 `h`의 값을 바꿔도 요소에는 아무런 영향이 없습니다.

> [!NOTE] `display: inline` 요소는 (`<img>`나 `<canvas>`처럼 '고유한' 크기를 가진 요소를 제외하면) 너비나 높이가 없으므로 `ResizeObserver`로 관찰할 수 없습니다. 이런 요소는 `display` 스타일을 `inline-block` 같은 다른 값으로 바꿔야 합니다.
