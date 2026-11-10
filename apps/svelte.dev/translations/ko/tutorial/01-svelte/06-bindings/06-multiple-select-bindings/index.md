---
title: 다중 선택
---

`<select>` 요소에는 `multiple` 속성을 줄 수 있으며, 이 경우 값 하나를 선택하는 대신 배열을 채웁니다.

체크박스를 `<select multiple>`로 바꾸세요:

```svelte
/// file: App.svelte
<h2>Flavours</h2>

+++<select multiple bind:value={flavours}>+++
	{#each ['cookies and cream', 'mint choc chip', 'raspberry ripple'] as flavour}
+++		<option>{flavour}</option>+++
	{/each}
+++</select>+++
```

값이 요소의 내용과 같으므로 `<option>`의 `value` 속성을 생략할 수 있다는 점에 주목하세요.

> [!NOTE] 여러 옵션을 선택하려면 `control` 키(MacOS에서는 `command` 키)를 누른 채로 선택하세요.
