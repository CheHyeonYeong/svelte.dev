---
title: 전역 스타일
tags: styles-global
---

## :global(...)

하나의 선택자에 전역으로 스타일을 적용하려면 `:global(...)` 수식어를 사용하세요:

```svelte
<style>
	:global(body) {
		/* applies to <body> */
		margin: 0;
	}

	div :global(strong) {
		/* applies to all <strong> elements, in any component,
		   that are inside <div> elements belonging
		   to this component */
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to all <p> elements belonging to this component
		   with `class="big red"`, even if it is applied
		   programmatically (for example by a library) */
	}
</style>
```

전역에서 접근할 수 있는 @keyframes를 만들려면 키프레임 이름 앞에 `-global-`을 붙여야 합니다.

`-global-` 부분은 컴파일할 때 제거되며, 코드의 다른 곳에서는 `my-animation-name`만으로 해당 키프레임을 참조합니다.

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* code goes here */
	}
</style>
```

## :global

여러 선택자에 한꺼번에 전역으로 스타일을 적용하려면 `:global {...}` 블록을 만드세요:

```svelte
<style>
	:global {
		/* applies to every <div> in your application */
		div { ... }

		/* applies to every <p> in your application */
		p { ... }
	}

	.a :global {
		/* applies to every `.b .c .d` element, in any component,
		   that is inside an `.a` element in this component */
		.b .c .d {...}
	}
</style>
```

> [!NOTE] 위의 두 번째 예제는 `.a :global .b .c .d`라는 동등한 선택자로도 쓸 수 있으며, 이때 `:global` 뒤의 모든 부분은 스코프가 적용되지 않습니다. 다만 중첩 형태를 권장합니다.
