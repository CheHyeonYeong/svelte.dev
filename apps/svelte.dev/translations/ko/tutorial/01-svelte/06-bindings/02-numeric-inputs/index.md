---
title: 숫자 입력
---

DOM에서 모든 입력값은 문자열입니다. `type="number"`나 `type="range"` 같은 숫자 입력을 다룰 때는 불편합니다. `input.value`를 사용하기 전에 잊지 말고 변환해야 하기 때문입니다.

`bind:value`를 사용하면 Svelte가 알아서 처리해 줍니다:

```svelte
/// file: App.svelte
<label>
	<input type="number" +++bind:+++value={a} min="0" max="10" />
	<input type="range" +++bind:+++value={a} min="0" max="10" />
</label>

<label>
	<input type="number" +++bind:+++value={b} min="0" max="10" />
	<input type="range" +++bind:+++value={b} min="0" max="10" />
</label>
```
