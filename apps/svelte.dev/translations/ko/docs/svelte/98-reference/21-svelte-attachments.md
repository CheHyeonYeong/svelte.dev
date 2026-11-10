---
title: svelte/attachments
tags: attachments
---



```js
// @noErrors
import { createAttachmentKey, fromAction } from 'svelte/attachments';
```

## createAttachmentKey

<blockquote class="since note">

5.29부터 사용 가능

</blockquote>

객체를 요소에 스프레드했을 때 어태치먼트로 인식되는 객체 키를 만듭니다.
`{@attach ...}`를 쓰는 대신 프로그래밍 방식으로 쓸 수 있는 대안입니다. 라이브러리 작성자에게는 유용할 수 있지만,
앱을 만들 때는 보통 필요하지 않습니다.

```svelte
<script>
	import { createAttachmentKey } from 'svelte/attachments';

	const props = {
		class: 'cool',
		onclick: () => alert('clicked'),
		[createAttachmentKey()]: (node) => {
			node.textContent = 'attached!';
		}
	};
</script>

<button {...props}>click me</button>
```

<div class="ts-block">

```dts
function createAttachmentKey(): symbol;
```

</div>



## fromAction

[액션](/docs/svelte/use)을 같은 동작을 하는 [어태치먼트](/docs/svelte/@attach)로 변환합니다.
컴포넌트에서 어태치먼트를 쓰기 시작하고 싶은데 라이브러리가 액션만 제공할 때 유용합니다.

두 번째 인자를 넘긴다면, 그 인자는 액션 함수에 전달할 인자 자체가 아니라 그 인자를
*반환하는* 함수여야 한다는 점에 유의하세요.

```svelte
<!-- with an action -->
<div use:foo={bar}>...</div>

<!-- with an attachment -->
<div {@attach fromAction(foo, () => bar)}>...</div>
```

<div class="ts-block">

```dts
function fromAction<
	E extends EventTarget,
	T extends unknown
>(
	action:
		| Action<E, T>
		| ((element: E, arg: T) => void | ActionReturn<T>),
	fn: () => T
): Attachment<E>;
```

</div>

<div class="ts-block">

```dts
function fromAction<E extends EventTarget>(
	action:
		| Action<E, void>
		| ((element: E) => void | ActionReturn<void>)
): Attachment<E>;
```

</div>



## Attachment

[어태치먼트](/docs/svelte/@attach)는 요소가 DOM에 마운트될 때 실행되는 함수이며,
선택적으로 함수를 반환할 수 있고, 반환한 함수는 나중에 요소가 제거될 때 호출됩니다.

어태치먼트는 `{@attach ...}` 태그로 요소에 붙이거나,
[`createAttachmentKey`](/docs/svelte/svelte-attachments#createAttachmentKey)로 만든 속성을 담은 객체를 스프레드해서 붙일 수 있습니다.

<div class="ts-block">

```dts
interface Attachment<T extends EventTarget = Element> {/*…*/}
```

<div class="ts-block-property">

```dts
(element: T): void | (() => void);
```

<div class="ts-block-property-details"></div>
</div></div>


