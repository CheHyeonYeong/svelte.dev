---
title: 원시 상태
---

앞의 연습 문제에서 상태는 [깊은 반응성](deep-state)을 가진다는 것을 배웠습니다. 예를 들어 객체의 속성을 바꾸거나 배열에 push하면 UI가 업데이트됩니다. 이는 읽기와 쓰기를 가로채는 [프록시](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를 만들어서 동작합니다.

하지만 가끔은 이런 동작이 필요 없을 때가 있습니다. 개별 속성을 바꾸지 않거나 참조 동일성을 유지하는 것이 중요하다면, 대신 *원시 상태*(raw state)를 사용할 수 있습니다.

이 예제에는 꾸준히 오르는 Svelte 주가를 보여 주는 차트가 있습니다. 새 데이터가 들어올 때마다 차트가 업데이트되었으면 하는데, `data`를 상태로 바꾸면 이렇게 할 수 있습니다...

```js
/// file: App.svelte
let data = +++$state(poll())+++;
```

...하지만 몇 밀리초 뒤에 버려질 데이터를 깊은 반응성으로 만들 필요는 없습니다. 대신 `$state.raw`를 사용하세요:

```js
/// file: App.svelte
let data = +++$state.raw(poll())+++;
```

> [!NOTE] 원시 상태를 변경(mutate)해도 직접적인 효과는 없습니다. 일반적으로 반응형이 아닌 상태를 변경하는 것은 권장하지 않습니다.
