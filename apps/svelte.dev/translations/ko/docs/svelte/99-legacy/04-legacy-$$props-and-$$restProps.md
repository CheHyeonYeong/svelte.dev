---
title: $$props와 $$restProps
---

룬 모드에서는 [`$props`]($props) 룬을 사용해 전달된 모든 props를 담은 객체를 쉽게 얻을 수 있습니다.

레거시 모드에서는 `$$props`와 `$$restProps`를 사용합니다:

- `$$props`는 전달된 모든 props를 담고 있으며, `export` 키워드로 개별 선언하지 않은 props도 포함합니다
- `$$restProps`는 개별 선언한 props를 *제외한* 나머지 전달된 props를 모두 담고 있습니다

예를 들어 `<Button>` 컴포넌트는 `variant` prop을 제외한 모든 props를 자신의 `<button>` 요소에 그대로 넘겨야 할 수 있습니다:

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>

<style>
	.variant-danger {
		background: red;
	}
</style>
```

Svelte 3/4에서 `$$props`와 `$$restProps`를 사용하면 약간의 성능 손해가 생기므로, 필요할 때만 사용해야 합니다.
