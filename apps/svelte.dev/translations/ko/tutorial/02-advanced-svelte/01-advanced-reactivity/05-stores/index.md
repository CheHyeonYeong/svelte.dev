---
title: 스토어
---

Svelte 5에서 룬이 도입되기 전에는 컴포넌트 바깥에서 반응형 상태를 다루는 관용적인 방법이 스토어였습니다. 지금은 더 이상 그렇지 않지만, 기존 코드베이스와 라이브러리에서 여전히 스토어를 만나게 되므로 사용법을 알아 두면 좋습니다.

> [!NOTE] 커스텀 스토어를 직접 만드는 방법은 다루지 않습니다. 그 내용은 [문서를 참고하세요](/docs/svelte/stores).

[유니버설 반응성](universal-reactivity) 연습 문제의 예제를 다시 살펴보되, 이번에는 공유 상태를 스토어로 구현해 봅시다.

지금 `shared.js`에서는 숫자인 `count`를 export하고 있습니다. 이를 쓰기 가능한 스토어(writable store)로 바꾸세요:

```js
/// file: shared.js
+++import { writable } from 'svelte/store';+++

export const count = +++writable(0)+++;
```

스토어의 값을 참조하려면 앞에 `$` 기호를 붙입니다. `Counter.svelte`에서 `<button>` 안의 텍스트가 더 이상 `[object Object]`로 표시되지 않도록 수정하세요:

```svelte
/// file: Counter.svelte
<button onclick={() => {}}>
	clicks: {+++$count+++}
</button>
```

마지막으로 이벤트 핸들러를 추가합니다. 쓰기 가능한 스토어이므로 `set`이나 `update` 메서드로 값을 프로그래밍 방식으로 업데이트할 수 있습니다...

```js
count.update((n) => n + 1);
```

...하지만 컴포넌트 안에 있으므로 계속 `$` 접두사를 사용할 수 있습니다:

```svelte
/// file: Counter.svelte
<button onclick={() => +++$count += 1+++}>
	clicks: {$count}
</button>
```
