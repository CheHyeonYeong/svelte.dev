---
title: 캡처링
---

보통 이벤트 핸들러는 [*버블링*](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling) 단계에서 실행됩니다. 이 예제의 `<input>`에 무언가를 입력해 보면, 이벤트가 대상에서 문서까지 '버블링'되어 올라가므로 안쪽 핸들러가 먼저 실행되고 바깥쪽 핸들러가 그 뒤에 실행됩니다.

때로는 핸들러를 *캡처* 단계에서 실행하고 싶을 수 있습니다. 이벤트 이름 끝에 `capture`를 붙이세요:

```svelte
/// file: App.svelte
<div onkeydown+++capture+++={(e) => alert(`<div> ${e.key}`)} role="presentation">
	<input onkeydown+++capture+++={(e) => alert(`<input> ${e.key}`)} />
</div>
```

이제 상대적인 순서가 뒤바뀝니다. 한 이벤트에 캡처링 핸들러와 비캡처링 핸들러가 모두 있으면 캡처링 핸들러가 먼저 실행됩니다.
