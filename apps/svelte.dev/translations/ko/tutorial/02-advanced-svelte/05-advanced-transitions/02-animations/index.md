---
title: 애니메이션
---

[이전 장](/tutorial/svelte/deferred-transitions)에서는 지연된 트랜지션을 사용해 요소가 한 할 일 목록에서 다른 목록으로 움직이는 것처럼 보이게 만들었습니다.

이 효과를 완성하려면 트랜지션되지 *않는* 요소에도 모션을 적용해야 합니다. 이를 위해 `animate` 지시어를 사용합니다.

먼저 `svelte/animate`에서 `flip` 함수를 `TodoList.svelte`로 import하세요. flip은 ['First, Last, Invert, Play'](https://aerotwist.com/blog/flip-your-animations/)의 약자입니다:

```svelte
/// file: TodoList.svelte
<script>
	+++import { flip } from 'svelte/animate';+++
	import { send, receive } from './transition.js';

	let { todos, remove } = $props();
</script>
```

그런 다음 `<li>` 요소에 추가하세요:

```svelte
/// file: TodoList.svelte
<li
	class={{ done: todo.done }}
	in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
	+++animate:flip+++
>
```

이 경우에는 움직임이 조금 느리므로 `duration` 매개변수를 추가할 수 있습니다:

```svelte
/// file: TodoList.svelte
<li
	class={{ done: todo.done }}
	in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
	animate:flip+++={{ duration: 200 }}+++
>
```

> [!NOTE] `duration`은 `d => milliseconds` 함수일 수도 있습니다. 여기서 `d`는 요소가 이동해야 하는 픽셀 수입니다

모든 트랜지션과 애니메이션은 JavaScript가 아니라 CSS로 적용되므로, 메인 스레드를 막지 않고 메인 스레드에 막히지도 않는다는 점에 주목하세요.
