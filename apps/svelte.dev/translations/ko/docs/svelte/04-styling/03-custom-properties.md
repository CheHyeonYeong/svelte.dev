---
title: 커스텀 속성
tags: styles-custom-properties
---

컴포넌트에 정적인 값이든 동적인 값이든 CSS 커스텀 속성을 전달할 수 있습니다:

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

위 코드를 풀어 쓰면 기본적으로 다음과 같습니다:

```svelte
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</svelte-css-wrapper>
```

SVG 요소라면 대신 `<g>`를 사용합니다:

```svelte
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</g>
```

컴포넌트 안에서는 [`var(...)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)를 사용해 이 커스텀 속성을 읽을 수 있습니다(폴백 값도 지정할 수 있습니다):

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

값을 *꼭* 컴포넌트에 직접 지정해야 하는 것은 아닙니다. 커스텀 속성이 부모 요소에 정의되어 있기만 하면 컴포넌트에서 사용할 수 있습니다. 애플리케이션 전체에 적용되도록 전역 스타일시트의 `:root` 요소에 커스텀 속성을 정의하는 경우가 많습니다.

> [!NOTE] 추가된 요소는 레이아웃에는 영향을 주지 않지만, (예를 들어) `>` 결합자를 사용해 컴포넌트 컨테이너 바로 안의 요소를 대상으로 하는 CSS 선택자에는 *영향을 줍니다*.
