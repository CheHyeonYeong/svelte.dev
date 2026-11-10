---
title: {#key ...}
tags: template-key
---

```svelte
<!--- copy: false  --->
{#key expression}...{/key}
```

key 블록은 표현식의 값이 바뀔 때 그 내용을 파괴하고 다시 만듭니다. 컴포넌트를 감싸면 컴포넌트가 다시 인스턴스화되고 다시 초기화됩니다:

```svelte
{#key value}
	<Component />
{/key}
```

값이 바뀔 때마다 트랜지션을 재생하고 싶을 때도 유용합니다:

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```
