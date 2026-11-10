---
title: select 바인딩
---

`<select>` 요소에도 `bind:value`를 사용할 수 있습니다:

```svelte
/// file: App.svelte
<select
    +++bind:+++value={selected}
    onchange={() => answer = ''}
>
```

`<option>` 값이 문자열이 아니라 객체라는 점에 주목하세요. Svelte는 신경 쓰지 않습니다.

> [!NOTE] `selected`의 초깃값을 설정하지 않았으므로 바인딩이 자동으로 기본값(목록의 첫 번째 항목)을 설정합니다. 하지만 조심하세요. 바인딩이 초기화되기 전까지 `selected`는 undefined이므로, 템플릿에서 `selected.id` 같은 것을 무작정 참조할 수 없습니다.
