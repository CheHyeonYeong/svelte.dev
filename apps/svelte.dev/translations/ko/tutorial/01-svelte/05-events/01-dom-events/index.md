---
title: DOM 이벤트
---

앞에서 잠깐 보았듯이 `on<name>` 함수로 요소의 모든 DOM 이벤트(click이나 [pointermove](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) 등)를 수신할 수 있습니다:

```svelte
/// file: App.svelte
<div +++onpointermove={onpointermove}+++ role="presentation">
	The pointer is at {Math.round(m.x)} x {Math.round(m.y)}
</div>
```

이름과 값이 같은 다른 속성처럼 짧은 형식을 사용할 수 있습니다:

```svelte
/// file: App.svelte
<div +++{onpointermove}+++ role="presentation">
	The pointer is at {Math.round(m.x)} x {Math.round(m.y)}
</div>
```
