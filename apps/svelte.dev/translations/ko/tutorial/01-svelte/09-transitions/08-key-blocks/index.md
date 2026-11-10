---
title: key 블록
tags: template-key
---

key 블록은 표현식의 값이 바뀌면 그 내용을 제거하고 다시 만듭니다. 요소가 DOM에 들어오거나 나갈 때뿐 아니라 값이 바뀔 때마다 트랜지션을 재생하고 싶을 때 유용합니다.

예를 들어 여기서는 로딩 메시지, 즉 `i`가 바뀔 때마다 `transition.js`의 `typewriter` 트랜지션을 재생하려고 합니다. `<p>` 요소를 key 블록으로 감싸세요:

```svelte
/// file: App.svelte
+++{#key i}+++
	<p in:typewriter={{ speed: 10 }}>
		{messages[i] || ''}
	</p>
+++{/key}+++
```
