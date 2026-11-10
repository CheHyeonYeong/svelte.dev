---
title: 체크박스 입력
---

체크박스는 상태를 켜고 끄는 데 사용합니다. `input.value` 대신 `input.checked`에 바인딩합니다:

```svelte
/// file: App.svelte
<input type="checkbox" +++bind:+++checked={yes}>
```
