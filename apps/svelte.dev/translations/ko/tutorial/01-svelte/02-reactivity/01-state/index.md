---
title: 상태
tags: rune-state
---

Svelte의 핵심에는 DOM을 애플리케이션 상태와 동기화해 주는 강력한 *반응성* 시스템이 있습니다. 예를 들어 이벤트에 반응해 DOM을 갱신하는 식입니다.

값을 `$state(...)`로 감싸서 `count` 선언을 반응형으로 만드세요:

```js
/// file: App.svelte
let count = +++$state(0)+++;
```

이것을 *룬*이라고 부르며, `count`가 평범한 변수가 아니라는 것을 Svelte에 알려 주는 방법입니다. 룬은 함수처럼 보이지만 함수가 아닙니다. Svelte를 사용할 때 룬은 언어 자체의 일부입니다.

이제 `increment`만 구현하면 됩니다:

```js
/// file: App.svelte
function increment() {
	+++count += 1;+++
}
```
