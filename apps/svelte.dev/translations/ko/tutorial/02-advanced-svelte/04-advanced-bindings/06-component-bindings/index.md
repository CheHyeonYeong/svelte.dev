---
title: 컴포넌트 바인딩
---

DOM 요소의 속성에 바인딩할 수 있는 것처럼 컴포넌트 props에도 바인딩할 수 있습니다. 예를 들어 이 `<Keypad>` 컴포넌트의 `value` prop을 폼 요소처럼 바인딩할 수 있습니다.

먼저 prop을 *바인딩 가능*(bindable)하다고 표시해야 합니다. `Keypad.svelte`에서 `$props()` 선언이 `$bindable` 룬을 사용하도록 수정하세요:

```js
/// file: Keypad.svelte
let { value +++= $bindable('')+++, onsubmit } = $props();
```

그런 다음 `App.svelte`에 `bind:` 지시어를 추가하세요:

```svelte
/// file: App.svelte
<Keypad +++bind:value={pin}+++ {onsubmit} />
```

이제 사용자가 키패드를 조작하면 부모 컴포넌트의 `pin` 값이 즉시 업데이트됩니다.

> [!NOTE] 컴포넌트 바인딩은 아껴서 사용하세요. 바인딩이 너무 많으면, 특히 '단일 진실 공급원'(single source of truth)이 없을 때 애플리케이션 안에서 데이터가 어떻게 흐르는지 추적하기 어려워질 수 있습니다.
