---
title: 어태치먼트 팩토리
---

어태치먼트가 매개변수나 컴포넌트 상태에 따라 달라져야 할 때가 많습니다. 이럴 때는 어태치먼트를 *반환*하는 함수인 [어태치먼트 팩토리](/docs/svelte/@attach#Attachment-factories)를 사용할 수 있습니다.

이 연습 문제에서는 [`Tippy.js`](https://atomiks.github.io/tippyjs/) 라이브러리를 사용해 `<button>`에 툴팁을 추가하려고 합니다. 어태치먼트는 이미 `{@attach tooltip}`으로 연결되어 있지만, 버튼 위에 마우스를 올리면(또는 키보드로 포커스를 주면) 툴팁에 내용이 없습니다.

먼저 단순한 어태치먼트를 어태치먼트를 반환하는 *팩토리* 함수로 바꿔야 합니다.

```js
/// file: App.svelte
function tooltip(---node---) {
+++	return (node) => {+++
		const tooltip = tippy(node);
		return tooltip.destroy;
+++	};+++
}
```

다음으로 팩토리가 Tippy에 전달할 옵션(이 경우에는 `content`뿐)을 받도록 해야 합니다:

```js
/// file: App.svelte
function tooltip(+++content+++) {
	return (node) => {
		const tooltip = tippy(node+++, { content }+++);
		return tooltip.destroy;
	};
}
```

> [!NOTE] `tooltip(content)` 표현식은 이펙트 안에서 실행되므로, 내용이 바뀔 때마다 어태치먼트가 제거되었다가 다시 만들어집니다.

마지막으로 `{@attach}` 태그에서 어태치먼트 팩토리를 호출하며 `content` 인자를 전달해야 합니다:

```svelte
/// file: App.svelte
<button {@attach tooltip+++(content)+++}>
	Hover me
</button>
```
