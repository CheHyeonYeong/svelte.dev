---
title: 지연된 트랜지션
---

Svelte 트랜지션 엔진의 특히 강력한 기능 중 하나는 트랜지션을 *지연*(defer)시켜서 여러 요소 사이에서 조율할 수 있다는 점입니다.

이 두 개의 할 일 목록을 보세요. 할 일을 토글하면 반대편 목록으로 보내집니다. 현실 세계에서 물체는 이렇게 움직이지 않습니다. 사라졌다가 다른 곳에 다시 나타나는 대신, 일련의 중간 위치를 거쳐 이동합니다. 모션을 사용하면 사용자가 앱에서 무슨 일이 일어나는지 이해하는 데 큰 도움이 됩니다.

`transition.js`에서 볼 수 있는 `crossfade` 함수를 사용하면 이런 효과를 낼 수 있습니다. 이 함수는 `send`와 `receive`라는 한 쌍의 트랜지션을 만듭니다. 요소가 '보내질' 때는 '받아지는' 대응 요소를 찾아서, 요소를 대응 요소의 위치로 옮기며 서서히 사라지게 하는 트랜지션을 생성합니다. 요소가 '받아질' 때는 그 반대가 일어납니다. 대응 요소가 없으면 `fallback` 트랜지션이 사용됩니다.

`TodoList.svelte`를 여세요. 먼저 transition.js에서 `send`와 `receive` 트랜지션을 import하세요:

```svelte
/// file: TodoList.svelte
<script>
	+++import { send, receive } from './transition.js';+++

	let { todos, remove } = $props();
</script>
```

그런 다음 `todo.id` 속성을 요소를 짝짓는 키로 사용해서 `<li>` 요소에 추가하세요:

```svelte
/// file: TodoList.svelte
<li
	class={{ done: todo.done }}
	+++in:receive={{ key: todo.id }}+++
	+++out:send={{ key: todo.id }}+++
>
```

이제 항목을 토글하면 새 위치로 부드럽게 이동합니다. 트랜지션되지 않는 항목들은 여전히 어색하게 툭툭 튀는데, 다음 연습 문제에서 이 문제를 해결할 수 있습니다.
