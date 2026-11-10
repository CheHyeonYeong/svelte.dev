---
title: 트랜지션 이벤트
---

트랜지션이 언제 시작되고 끝나는지 알면 유용할 때가 있습니다. Svelte는 다른 DOM 이벤트처럼 수신할 수 있는 이벤트를 디스패치합니다:

```svelte
/// file: App.svelte
<p
	transition:fly={{ y: 200, duration: 2000 }}
+++	onintrostart={() => status = 'intro started'}
	onoutrostart={() => status = 'outro started'}
	onintroend={() => status = 'intro ended'}
	onoutroend={() => status = 'outro ended'}+++
>
	Flies in and out
</p>
```
