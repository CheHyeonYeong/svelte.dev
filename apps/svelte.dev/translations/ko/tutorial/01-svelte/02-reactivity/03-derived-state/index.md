---
title: 파생 상태
tags: rune-derived
---

다른 상태로부터 상태를 *파생*해야 할 때가 자주 있습니다. 이럴 때 `$derived` 룬을 사용합니다:

```js
/// file: App.svelte
let numbers = $state([1, 2, 3, 4]);
+++let total = $derived(numbers.reduce((t, n) => t + n, 0));+++
```

이제 이 값을 마크업에서 사용할 수 있습니다:

```svelte
/// file: App.svelte
<p>{numbers.join(' + ')} = +++{total}+++</p>
```

`$derived` 선언 안의 표현식은 의존성(이 경우에는 `numbers`뿐)이 업데이트될 때마다 다시 평가됩니다.
