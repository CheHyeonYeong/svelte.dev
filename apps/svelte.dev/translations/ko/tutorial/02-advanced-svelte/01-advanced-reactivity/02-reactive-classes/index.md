---
title: 반응형 클래스
---

반응형으로 만들 수 있는 것은 변수만이 아닙니다. Svelte에서는 클래스의 속성도 반응형으로 만들 수 있습니다.

`Box` 클래스의 `width`와 `height` 속성을 반응형으로 만들어 봅시다:

```js
/// file: App.svelte
class Box {
	width = +++$state(0);+++
	height = +++$state(0);+++
	area = 0;

	// ...
}
```

이제 range 입력을 조작하거나 'embiggen' 버튼을 클릭하면 상자가 반응합니다.

`$derived`를 사용해서 `box.area`가 반응형으로 업데이트되게 할 수도 있습니다:

```js
/// file: App.svelte
class Box {
	width = $state(0);
	height = $state(0);
	area = +++$derived(this.width * this.height);+++

	// ...
}
```

> [!NOTE] `$state`와 `$derived` 외에도 `$state.raw`와 `$derived.by`를 사용해 반응형 필드를 정의할 수 있습니다.
