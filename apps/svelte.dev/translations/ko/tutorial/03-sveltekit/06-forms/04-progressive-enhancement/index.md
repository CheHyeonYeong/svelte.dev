---
title: 점진적 향상
---

`<form>`을 사용하기 때문에 이 앱은 사용자에게 JavaScript가 없어도 동작합니다([생각보다 자주 일어나는 일입니다](https://kryogenix.org/code/browser/everyonehasjs.html)). 앱이 그만큼 탄탄하다는 뜻이니 아주 좋은 일입니다.

대부분의 경우 사용자에게는 JavaScript가 *있습니다*. 이럴 때는 SvelteKit이 클라이언트 사이드 라우팅으로 `<a>` 요소를 점진적으로 향상하는 것과 같은 방식으로, 사용 경험을 *점진적으로 향상*할 수 있습니다.

`$app/forms`에서 `enhance` 함수를 import하고...

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { enhance } from '$app/forms';+++

	let { data, form } = $props();
</script>
```

...`<form>` 요소에 `use:enhance` 지시어를 추가해 보세요:

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/create" +++use:enhance+++>
```

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/delete" +++use:enhance+++>
```

이것으로 끝입니다! 이제 JavaScript가 활성화되어 있으면 `use:enhance`가 전체 페이지를 다시 로드하는 것만 빼고 브라우저 네이티브 동작을 그대로 흉내 냅니다. 구체적으로는 다음과 같습니다:

- `form` prop을 갱신합니다
- `<form>` 요소를 초기화합니다
- 응답이 성공하면 모든 데이터를 새로 고쳐 `load` 함수가 다시 실행되게 합니다
- 리디렉션 응답을 받으면 새 페이지로 이동합니다
- 에러가 발생하면 가장 가까운 에러 페이지를 렌더링합니다

이제 페이지를 다시 로드하지 않고 갱신하므로, 트랜지션 같은 멋진 효과도 넣을 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { fly, slide } from 'svelte/transition';+++
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>
```

```svelte
/// file: src/routes/+page.svelte
<li +++in:fly={{ y: 20 }} out:slide+++>...</li>
```
