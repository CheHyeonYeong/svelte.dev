---
title: 중첩 컴포넌트
---

앱 전체를 컴포넌트 하나에 넣는 것은 현실적이지 않습니다. 대신 다른 파일에서 컴포넌트를 import해 마크업에 포함할 수 있습니다.

`App.svelte` 맨 위에 `Nested.svelte`를 import하는 `<script>` 태그를 추가하고...

```svelte
/// file: App.svelte
+++<script>
	import Nested from './Nested.svelte';
</script>+++
```

...`<Nested />` 컴포넌트를 넣으세요:

```svelte
/// file: App.svelte
<p>This is a paragraph.</p>
+++<Nested />+++
```

`Nested.svelte`에도 `<p>` 요소가 있지만 `App.svelte`의 스타일이 새어 들어가지 않는다는 점에 주목하세요.

> [!NOTE] 컴포넌트 이름은 HTML 요소와 구분하기 위해 대문자로 시작합니다.
