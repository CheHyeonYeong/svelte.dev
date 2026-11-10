---
title: getter와 setter
---

클래스는 데이터의 유효성을 검사해야 할 때 특히 유용합니다. 이 `Box` 클래스의 경우 슬라이더가 허용하는 최댓값을 넘어 계속 키울 수 있으면 안 되는데, 지금은 바로 그런 일이 일어납니다.

`width`와 `height`를 *접근자*(accessor)라고도 부르는 *getter*와 *setter*로 바꾸면 이 문제를 해결할 수 있습니다. 먼저 이들을 [비공개 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)으로 바꾸세요:

```js
/// file: App.svelte
class Box {
	+++#width+++ = $state(0);
	+++#height+++ = $state(0);
	area = $derived(this.+++#width+++ * this.+++#height+++);

	constructor(width, height) {
		this.+++#width+++ = width;
		this.+++#height+++ = height;
	}

	// ...
}
```

그런 다음 getter와 setter를 만드세요:

```js
/// file: App.svelte
class Box {
	// ...

+++	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	set width(value) {
		this.#width = value;
	}

	set height(value) {
		this.#height = value;
	}+++

	embiggen(amount) {
		this.width += amount;
		this.height += amount;
	}
}
```

마지막으로 setter에 유효성 검사를 추가하세요:

```js
/// file: App.svelte
set width(value) {
	this.#width = +++Math.max(0, Math.min(MAX_SIZE, value));+++
}

set height(value) {
	this.#height = +++Math.max(0, Math.min(MAX_SIZE, value));+++
}
```

이제 range 입력의 `bind:value`를 통해서든 `embiggen` 메서드를 통해서든, 버튼을 아무리 세게 눌러도 상자를 안전한 한계 이상으로 키울 수 없습니다.
