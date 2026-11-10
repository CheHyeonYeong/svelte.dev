---
title: each 블록
tags: template-each
---

사용자 인터페이스를 만들다 보면 데이터 목록을 다룰 일이 많습니다. 이 연습 문제에서는 `<button>` 마크업을 매번 색만 바꿔 가며 여러 번 반복했는데, 아직 추가할 것이 더 남아 있습니다.

힘들게 복사하고 붙여 넣고 고치는 대신, 첫 번째 버튼만 남기고 모두 지운 다음 `each` 블록을 사용할 수 있습니다:

```svelte
/// file: App.svelte
<div>
	+++{#each colors as color}+++
		<button
			style="background: red"
			aria-label="red"
			aria-current={selected === 'red'}
			onclick={() => selected = 'red'}
		></button>
	+++{/each}+++
</div>
```

> [!NOTE] 표현식(이 경우에는 `colors`)은 이터러블이나 유사 배열 객체라면 무엇이든 될 수 있습니다. 즉, [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)과 함께 쓸 수 있는 것이면 됩니다.

이제 `"red"` 대신 `color` 변수를 사용해야 합니다:

```svelte
/// file: App.svelte
<div>
	{#each colors as color}
		<button
			style="background: +++{color}+++"
			aria-label=+++{color}+++
			aria-current={selected === +++color+++}
			onclick={() => selected = +++color+++}
		></button>
	{/each}
</div>
```

다음처럼 두 번째 인자로 현재 *인덱스*를 받을 수 있습니다:

```svelte
/// file: App.svelte
<div>
	{#each colors as color, +++i}+++
		<button
			style="background: {color}"
			aria-label={color}
			aria-current={selected === color}
			onclick={() => selected = color}
		>+++{i + 1}+++</button>
	{/each}
</div>
```
