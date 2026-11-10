---
title: textarea 입력
---

Svelte에서 `<textarea>` 요소는 텍스트 입력과 비슷하게 동작합니다. `bind:value`를 사용하세요:

```svelte
/// file: App.svelte
<textarea +++bind:value=+++{value}></textarea>
```

이렇게 이름이 같은 경우에는 단축 형식을 쓸 수도 있습니다:

```svelte
/// file: App.svelte
<textarea +++bind:value+++></textarea>
```

이는 `<textarea>` 바인딩뿐 아니라 모든 바인딩에 적용됩니다.
