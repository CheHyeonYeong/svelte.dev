---
title: 이벤트 펼치기
---

이벤트 핸들러도 요소에 바로 [펼쳐서](spread-props) 전달할 수 있습니다. 여기서는 `App.svelte`에 `onclick` 핸들러를 정의해 두었습니다. `BigRedButton.svelte`의 `<button>`에 props를 전달하기만 하면 됩니다:

```svelte
/// file: BigRedButton.svelte
<button +++{...props}+++>
	Push
</button>
```
