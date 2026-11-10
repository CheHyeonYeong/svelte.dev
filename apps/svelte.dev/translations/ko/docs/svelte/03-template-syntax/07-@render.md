---
title: {@render ...}
---

[스니펫](snippet)을 렌더링하려면 `{@render ...}` 태그를 사용합니다.

```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

표현식은 `sum` 같은 식별자일 수도 있고, 임의의 JavaScript 표현식일 수도 있습니다:

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

## 선택적 스니펫 <!-- Optional snippets -->

스니펫이 정의되지 않았을 수 있다면(예를 들어 외부에서 전달받는 prop이라서), 옵셔널 체이닝을 사용해 정의되어 *있을* 때만 렌더링할 수 있습니다:

```svelte
{@render children?.()}
```

또는 [`{#if ...}`](if) 블록과 `:else` 절을 사용해 폴백 콘텐츠를 렌더링할 수 있습니다:

```svelte
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```
