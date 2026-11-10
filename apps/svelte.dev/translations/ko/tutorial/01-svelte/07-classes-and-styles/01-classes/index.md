---
title: class 속성
tags: template-class
---

다른 속성처럼 JavaScript 속성으로 클래스를 지정할 수 있습니다. 여기서는 카드에 `flipped` 클래스를 추가할 수 있습니다:

```svelte
/// file: App.svelte
<button
	class="card {+++flipped ? 'flipped' : ''+++}"
	onclick={() => flipped = !flipped}
>
```

기대한 대로 동작합니다. 이제 카드를 클릭하면 뒤집힙니다.

하지만 더 깔끔하게 만들 수 있습니다. 조건에 따라 클래스를 추가하거나 제거하는 것은 UI 개발에서 아주 흔한 패턴이라, Svelte에서는 [clsx](https://github.com/lukeed/clsx)로 문자열로 변환되는 객체나 배열을 전달할 수 있습니다.

```svelte
/// file: App.svelte
<button
	+++class={["card", { flipped }]}+++
	onclick={() => flipped = !flipped}
>
```

이 코드는 '항상 `card` 클래스를 추가하고, `flipped`가 참 같은 값(truthy)일 때마다 `flipped` 클래스를 추가하라'는 뜻입니다.

조건부 클래스를 조합하는 더 많은 예시는 [`class` 문서를 참고하세요](/docs/svelte/class).
