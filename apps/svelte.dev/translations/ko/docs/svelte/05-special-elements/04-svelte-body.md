---
title: <svelte:body>
---

```svelte
<svelte:body onevent={handler} />
```

`<svelte:window>`와 비슷하게, 이 요소를 사용하면 `window`에서는 발생하지 않는 `mouseenter`, `mouseleave` 같은 `document.body`의 이벤트에 리스너를 추가할 수 있습니다. 또한 `<body>` 요소에 [액션](use)을 사용할 수도 있습니다.

`<svelte:window>`, `<svelte:document>`와 마찬가지로, 이 요소는 컴포넌트의 최상위에만 둘 수 있으며 블록이나 요소 안에 절대 넣어서는 안 됩니다.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```
