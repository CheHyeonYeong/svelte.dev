---
title: <svelte:component>
---

룬 모드에서는 `MyComponent`의 값이 바뀌면 `<MyComponent>`가 다시 렌더링됩니다. 예시는 [Svelte 5 마이그레이션 가이드](/docs/svelte/v5-migration-guide#svelte:component-is-no-longer-necessary)를 참고하세요.

레거시 모드에서는 그렇지 않으므로 `<svelte:component>`를 사용해야 합니다. 이 요소는 `this` 표현식의 값이 바뀌면 컴포넌트 인스턴스를 파괴하고 다시 생성합니다:

```svelte
<svelte:component this={MyComponent} />
```

`this`가 falsy이면 아무 컴포넌트도 렌더링되지 않습니다.
