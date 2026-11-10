---
title: <svelte:window>
---

```svelte
<svelte:window onevent={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

`<svelte:window>` 요소를 사용하면 컴포넌트가 파괴될 때 리스너를 제거하거나 서버 사이드 렌더링 중에 `window`가 있는지 확인하는 일을 신경 쓰지 않고 `window` 객체에 이벤트 리스너를 추가할 수 있습니다.

이 요소는 컴포넌트의 최상위에만 둘 수 있으며, 블록이나 요소 안에 넣을 수 없습니다.

```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

다음 속성에 바인딩할 수도 있습니다:

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — `window.navigator.onLine`의 별칭
- `devicePixelRatio`

`scrollX`와 `scrollY`를 제외하면 모두 읽기 전용입니다.

```svelte
<svelte:window bind:scrollY={y} />
```

> [!NOTE] 접근성 문제를 피하기 위해 페이지가 초기값으로 스크롤되지는 않는다는 점에 유의하세요. `scrollX`와 `scrollY`에 바인딩된 변수가 이후에 바뀔 때만 스크롤이 일어납니다. 컴포넌트가 렌더링될 때 스크롤해야 할 타당한 이유가 있다면 `$effect` 안에서 `scrollTo()`를 호출하세요.
