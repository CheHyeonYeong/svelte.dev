---
title: <svelte:element>
---

```svelte
<svelte:element this={expression} />
```

`<svelte:element>` 요소를 사용하면 예를 들어 CMS에서 가져오는 경우처럼 작성 시점에는 알 수 없는 요소를 렌더링할 수 있습니다. 지정된 모든 속성과 이벤트 리스너는 해당 요소에 적용됩니다.

Svelte의 내장 바인딩은 범용 요소에서 동작하지 않으므로, 지원되는 바인딩은 `bind:this`뿐입니다.

`this`가 nullish 값이면 요소와 그 자식은 렌더링되지 않습니다.

`this`가 [빈 요소](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)(void element, 예: `br`)의 이름인데 `<svelte:element>`에 자식 요소가 있으면, 개발 모드에서 런타임 에러가 발생합니다:

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

Svelte는 요소의 주변 맥락에서 올바른 네임스페이스를 추론하려고 최선을 다하지만, 항상 가능한 것은 아닙니다. `xmlns` 속성으로 네임스페이스를 명시할 수 있습니다:

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

`this`는 유효한 DOM 요소 태그여야 하며, `#text`나 `svelte:head` 같은 것은 동작하지 않습니다.
