---
title: <svelte:document>
---

```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

`<svelte:window>`와 비슷하게, 이 요소를 사용하면 `window`에서는 발생하지 않는 `visibilitychange` 같은 `document`의 이벤트에 리스너를 추가할 수 있습니다. 또한 `document`에 [어태치먼트](@attach)를 사용할 수도 있습니다.

`<svelte:window>`와 마찬가지로, 이 요소는 컴포넌트의 최상위에만 둘 수 있으며 블록이나 요소 안에 절대 넣어서는 안 됩니다.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} {@attach someAttachment} />
```

다음 속성에 바인딩할 수도 있습니다:

- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

모두 읽기 전용입니다.
