---
title: 상태 검사하기
tags: rune-inspect
---

상태의 값이 시간에 따라 어떻게 바뀌는지 추적할 수 있으면 유용할 때가 많습니다.

`addNumber` 함수 안에 `console.log` 문을 추가해 두었습니다. 그런데 버튼을 클릭하고 콘솔 서랍을 열어 보면(URL 표시줄 오른쪽의 버튼 사용), 경고와 함께 메시지를 복제할 수 없다는 메시지가 보입니다.

`numbers`가 반응형 [프록시](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)이기 때문입니다. 해결 방법은 몇 가지가 있습니다. 첫째, `$state.snapshot(...)`으로 상태의 반응형이 아닌 *스냅샷*을 만들 수 있습니다:

```js
/// file: App.svelte
function addNumber() {
	numbers.push(numbers.length + 1);
	console.log(+++$state.snapshot(numbers)+++);
}
```

또는 `$inspect` 룬을 사용해 상태가 바뀔 때마다 상태의 스냅샷을 자동으로 기록할 수 있습니다. 이 코드는 프로덕션 빌드에서 자동으로 제거됩니다:

```js
/// file: App.svelte
function addNumber() {
	numbers.push(numbers.length + 1);
	---console.log($state.snapshot(numbers));---
}

+++$inspect(numbers);+++
```

`$inspect(...).with(fn)`을 사용하면 정보가 표시되는 방식을 바꿀 수 있습니다. 예를 들어 `console.trace`를 사용해 상태 변경이 어디서 일어났는지 볼 수 있습니다:

```js
/// file: App.svelte
$inspect(numbers)+++.with(console.trace)+++;
```
