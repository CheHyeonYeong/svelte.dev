---
title: <svelte:element>
---

어떤 요소를 렌더링해야 할지 미리 알 수 없을 때가 있습니다. `{#if ...}` 블록을 길게 늘어놓는 대신...

```svelte
/// file: App.svelte
{#if selected === 'h1'}
	<h1>I'm a <code>&amp;lt;h1&amp;gt;</code> element</h1>
{:else}
	<p>TODO others</p>
{/if}
```

...`<svelte:element>`를 사용할 수 있습니다:

```svelte
/// file: App.svelte
+++<svelte:element this={selected}>
	I'm a <code>&amp;lt;{selected}&amp;gt;</code> element
</svelte:element>+++
```

`this` 값은 어떤 문자열이든, 또는 falsy 값이든 될 수 있습니다. falsy 값이면 아무 요소도 렌더링되지 않습니다.
