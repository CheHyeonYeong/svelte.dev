---
title: style:
tags: template-style
---

`style:` 지시어는 요소에 여러 스타일을 설정하는 축약 문법을 제공합니다.

```svelte
<!-- These are equivalent -->
<div style:color="red">...</div>
<div style="color: red;">...</div>
```

값에는 임의의 표현식을 넣을 수 있습니다:

```svelte
<div style:color={myColor}>...</div>
```

축약형도 쓸 수 있습니다:

```svelte
<div style:color>...</div>
```

한 요소에 여러 스타일을 설정할 수 있습니다:

```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

스타일을 important로 표시하려면 `|important` 수식어를 사용하세요:

```svelte
<div style:color|important="red">...</div>
```

`style:` 지시어를 `style` 속성과 함께 쓰면 지시어가 우선하며,
`!important` 속성보다도 우선합니다:

```svelte
<div style:color="red" style="color: blue">This will be red</div>
<div style:color="red" style="color: blue !important">This will still be red</div>
```

CSS 커스텀 속성도 설정할 수 있습니다:

```svelte
<div style:--columns={columns}>...</div>
```
