---
title: attach 태그
tags: attachments
---

어태치먼트는 본질적으로 요소 수준의 생명주기 함수입니다. 다음과 같은 경우에 유용합니다:

- 서드파티 라이브러리와 연동하기
- 이미지 지연 로드
- 툴팁
- 커스텀 이벤트 핸들러 추가하기

이 앱에서는 `<canvas>`에 낙서를 하고 메뉴에서 색과 브러시 크기를 바꿀 수 있습니다. 그런데 메뉴를 열고 Tab 키로 옵션을 순서대로 이동해 보면, 포커스가 모달 안에 *갇혀* 있지 않다는 것을 금방 알 수 있습니다.

> [!NOTE] Safari는 기본적으로 Tab 키로 텍스트 필드와 팝업 메뉴에만 포커스를 줍니다. Safari에서 이 연습 문제를 따라 하려면 Option + Tab을 사용하거나, Safari 고급 설정에서 Tab 키로 항목 강조 옵션을 켜세요.

어태치먼트로 이 문제를 고칠 수 있습니다. `attachments.svelte.js`에서 `trapFocus`를 import하고...

```svelte
/// file: App.svelte
<script>
	import Canvas from './Canvas.svelte';
	+++import { trapFocus } from './attachments.svelte.js';+++

	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];

	let selected = $state(colors[0]);
	let size = $state(10);
	let showMenu = $state(true);
</script>
```

...`{@attach}` 태그로 메뉴에 추가하세요:

```svelte
/// file: App.svelte
<div class="menu" +++{@attach trapFocus}+++>
```

`attachments.svelte.js`의 `trapFocus` 함수를 살펴봅시다. 어태치먼트 함수는 노드가 DOM에 마운트될 때 `node`(이 경우에는 `<div class="menu">`)를 인자로 받아 호출됩니다. 어태치먼트는 [이펙트](effects) 안에서 실행되므로, 함수 안에서 읽은 상태가 바뀔 때마다 다시 실행됩니다.

먼저 Tab 키 입력을 가로채는 이벤트 리스너를 추가해야 합니다:

```js
/// file: attachments.svelte.js
focusable()[0]?.focus();
+++const off = on(node, 'keydown', handleKeydown);+++
```

> [!NOTE] [`on`](/docs/svelte/svelte-events#on)은 <a href="/docs/svelte/basic-markup#Events-Event-delegation">이벤트 위임</a>을 사용하는 `addEventListener` 래퍼입니다. 핸들러를 제거하는 함수를 반환합니다.

다음으로 노드가 언마운트될 때 정리 작업을 해야 합니다. 이벤트 리스너를 제거하고, 요소가 마운트되기 전에 있던 곳으로 포커스를 되돌리는 것이죠. 이펙트와 마찬가지로 어태치먼트는 정리(teardown) 함수를 반환할 수 있으며, 이 함수는 어태치먼트가 다시 실행되기 직전이나 요소가 DOM에서 제거된 뒤에 실행됩니다:

```js
/// file: attachments.svelte.js
focusable()[0]?.focus();
const off = on(node, 'keydown', handleKeydown);

+++return () => {
	off();
	previous?.focus();
};+++
```

이제 메뉴를 열면 Tab 키로 옵션을 순서대로 이동할 수 있습니다.
