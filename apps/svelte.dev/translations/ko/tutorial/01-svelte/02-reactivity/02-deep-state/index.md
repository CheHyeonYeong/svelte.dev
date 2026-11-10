---
title: 깊은 상태
---

이전 연습 문제에서 보았듯이 상태는 *재할당*에 반응합니다. 그런데 *변경*(mutation)에도 반응합니다. 이것을 *깊은 반응성*이라고 부릅니다.

`numbers`를 반응형 배열로 만드세요:

```js
/// file: App.svelte
let numbers = +++$state([1, 2, 3, 4])+++;
```

이제 배열을 바꾸면...

```js
/// file: App.svelte
function addNumber() {
	+++numbers[numbers.length] = numbers.length + 1;+++
}
```

...컴포넌트가 업데이트됩니다. 더 좋은 방법으로, 배열에 `push`를 할 수도 있습니다:

```js
/// file: App.svelte
function addNumber() {
	+++numbers.push(numbers.length + 1);+++
}
```

> [!NOTE] 깊은 반응성은 [프록시](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)로 구현되며, 프록시를 변경해도 원래 객체에는 영향을 주지 않습니다.
