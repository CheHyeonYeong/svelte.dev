---
title: 컴포넌트 스타일
tags: styles-global, styles-custom-properties
---

자식 컴포넌트 안의 스타일에 영향을 줘야 할 때가 자주 있습니다. 이 상자들을 빨강, 초록, 파랑으로 만들고 싶다고 해 봅시다.

한 가지 방법은 `:global` CSS 수식어를 사용하는 것입니다. 이 수식어를 쓰면 다른 컴포넌트 안의 요소를 가리지 않고 선택할 수 있습니다:

```svelte
/// file: App.svelte
<style>
	.boxes :global(.box:nth-child(1)) {
		background-color: red;
	}

	.boxes :global(.box:nth-child(2)) {
		background-color: green;
	}

	.boxes :global(.box:nth-child(3)) {
		background-color: blue;
	}
</style>
```

하지만 그렇게 *하지 말아야* 할 이유는 많습니다. 우선 코드가 매우 장황해집니다. 또 깨지기 쉽습니다. `Box.svelte`의 구현 세부 사항이 조금만 바뀌어도 선택자가 깨질 수 있습니다.

무엇보다도 무례합니다. 컴포넌트는 어떤 변수를 props로 노출할지 스스로 정하듯이, 어떤 스타일을 '바깥'에서 제어할 수 있게 할지도 스스로 정할 수 있어야 합니다. `:global`은 탈출구, 즉 최후의 수단으로만 사용해야 합니다.

`Box.svelte` 안에서 `background-color`가 [CSS 커스텀 속성](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)으로 정해지도록 바꾸세요:

```svelte
/// file: Box.svelte
<style>
	.box {
		width: 5em;
		height: 5em;
		border-radius: 0.5em;
		margin: 0 0 1em 0;
		background-color: +++var(--color, #ddd)+++;
	}
</style>
```

어떤 부모 요소(`<div class="boxes">` 등)든 `--color` 값을 설정할 수 있지만, 개별 컴포넌트에 설정할 수도 있습니다:

```svelte
/// file: App.svelte
<div class="boxes">
	<Box +++--color="red"+++ />
	<Box +++--color="green"+++ />
	<Box +++--color="blue"+++ />
</div>
```

다른 속성처럼 값은 동적일 수 있습니다.

> [!NOTE] 이 기능은 필요한 경우 각 컴포넌트를 `display: contents`인 요소로 감싸고, 그 요소에 사용자 정의 속성을 적용하는 방식으로 동작합니다. 요소를 검사해 보면 다음과 같은 마크업을 볼 수 있습니다:
>
> ```svelte
> <svelte-css-wrapper style="display: contents; --color: red;">
> 	<!-- contents -->
> </svelte-css-wrapper>
> ```
>
> `display: contents` 덕분에 레이아웃에는 영향을 주지 않지만, 추가된 요소가 `.parent > .child` 같은 선택자에는 영향을 줄 *수 있습니다*.
