---
title: 스코프 스타일
tags: styles-scoped
---

Svelte 컴포넌트에는 해당 컴포넌트에 속하는 CSS를 담은 `<style>` 요소를 넣을 수 있습니다. 이 CSS는 기본적으로 *스코프가 한정*됩니다. 즉, 스타일이 해당 컴포넌트 밖에 있는 페이지의 요소에는 적용되지 않습니다.

이는 영향을 받는 요소에 컴포넌트 스타일의 해시를 기반으로 한 클래스(예: `svelte-123xyz`)를 추가하는 방식으로 동작합니다.

```svelte
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

## 명시도 <!-- Specificity -->

스코프가 지정된 각 선택자는 선택자에 스코프 클래스(예: `.svelte-123xyz`)가 추가되기 때문에 [명시도](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)가 0-1-0만큼 높아집니다. 따라서 (예를 들어) 컴포넌트에서 정의한 `p` 선택자는 전역 스타일시트에서 정의한 `p` 선택자보다 우선합니다. 전역 스타일시트가 나중에 로드되더라도 마찬가지입니다.

경우에 따라서는 스코프 클래스를 선택자에 여러 번 추가해야 하는데, 명시도가 더 높아지지 않도록 두 번째부터는 `:where(.svelte-xyz123)` 형태로 추가합니다.

## 스코프 키프레임 <!-- Scoped keyframes -->

컴포넌트가 `@keyframes`를 정의하면, 같은 해시 방식을 사용해 그 이름이 컴포넌트로 스코프가 한정됩니다. 컴포넌트 안의 모든 `animation` 규칙도 그에 맞게 조정됩니다:

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	/* these keyframes are only accessible inside this component */
	@keyframes bounce {
		/* ... */
	}
</style>
```
