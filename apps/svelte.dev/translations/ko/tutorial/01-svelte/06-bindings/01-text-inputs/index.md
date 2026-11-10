---
title: 텍스트 입력
tags: template-bind
---

일반적으로 Svelte의 데이터 흐름은 *하향식*입니다. 부모 컴포넌트는 자식 컴포넌트의 props를 설정할 수 있고 컴포넌트는 요소의 속성을 설정할 수 있지만, 그 반대는 안 됩니다.

때로는 이 규칙을 깨는 것이 유용합니다. 이 컴포넌트의 `<input>` 요소를 예로 들어 봅시다. `name` 값을 `event.target.value`로 설정하는 `oninput` 이벤트 핸들러를 추가할 *수도* 있지만, 조금... 상투적인 코드가 됩니다. 나중에 보겠지만 다른 폼 요소에서는 더 심해집니다.

대신 `bind:value` 지시어를 사용할 수 있습니다:

```svelte
/// file: App.svelte
<input +++bind:+++value={name}>
```

이렇게 하면 `name`이 바뀔 때 `<input>`이 업데이트될 뿐 아니라, `<input>`이 바뀔 때도 `name`이 업데이트됩니다.
