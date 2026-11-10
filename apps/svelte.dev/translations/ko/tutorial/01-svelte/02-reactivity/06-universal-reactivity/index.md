---
title: 범용 반응성
---

앞의 연습 문제에서는 룬을 사용해 컴포넌트 안에 반응성을 추가했습니다. 하지만 컴포넌트 *밖*에서도 룬을 사용할 수 있습니다. 예를 들어 전역 상태를 공유할 때 말이죠.

이 연습 문제의 `<Counter>` 컴포넌트들은 모두 `shared.js`에서 `counter` 객체를 import하고 있습니다. 하지만 이것은 평범한 객체라서 버튼을 클릭해도 아무 일도 일어나지 않습니다. 객체를 `$state(...)`로 감싸세요:

```js
/// file: shared.js
export const counter = +++$state({+++
	count: 0
+++})+++;
```

그러면 에러가 납니다. 룬은 일반 `.js` 파일에서는 쓸 수 없고 `.svelte.js` 파일에서만 쓸 수 있기 때문입니다. 파일 이름을 `shared.svelte.js`로 바꿔서 고쳐 봅시다.

그다음 `Counter.svelte`의 import 선언을 업데이트하세요:

```svelte
/// file: Counter.svelte
<script>
	import { counter } from './shared+++.svelte+++.js';
</script>
```

이제 어떤 버튼을 클릭하든 세 개가 동시에 업데이트됩니다.

> [!NOTE] 선언이 (변경만 되는 것이 아니라) 재할당된다면 모듈에서 `$state` 선언을 export할 수 없습니다. import하는 쪽에서 재할당을 알 방법이 없기 때문입니다.
