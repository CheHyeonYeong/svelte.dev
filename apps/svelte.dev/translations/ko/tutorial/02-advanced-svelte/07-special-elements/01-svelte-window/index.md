---
title: <svelte:window>
---

어떤 DOM 요소에든 이벤트 리스너를 추가할 수 있는 것처럼, `<svelte:window>`를 사용하면 `window` 객체에 이벤트 리스너를 추가할 수 있습니다.

`onkeydown` 함수는 이미 선언되어 있습니다. 이제 연결하기만 하면 됩니다:

```svelte
/// file: App.svelte
<svelte:window +++{onkeydown}+++ />
```
