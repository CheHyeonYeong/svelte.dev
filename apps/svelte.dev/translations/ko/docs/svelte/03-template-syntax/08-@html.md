---
title: {@html ...}
tags: template-html
---

컴포넌트에 HTML 원문을 그대로 넣으려면 `{@html ...}` 태그를 사용합니다:

```svelte
<article>
	{@html content}
</article>
```

> [!NOTE] 전달하는 문자열을 이스케이프하거나, 직접 통제할 수 있는 값으로만 채워서 [XSS 공격](https://owasp.org/www-community/attacks/xss/)을 막으세요. 소독(sanitize)하지 않은 콘텐츠는 절대 렌더링하지 마세요.

표현식은 그 자체로 유효한 HTML이어야 합니다. 아래 코드는 `</div>`가 유효한 HTML이 아니므로 동작하지 않습니다:

```svelte
{@html '<div>'}content{@html '</div>'}
```

또한 Svelte 코드를 컴파일하지도 않습니다.

## 스타일링 <!-- Styling -->

이렇게 렌더링된 콘텐츠는 Svelte에게 '보이지 않으므로' [스코프 스타일](scoped-styles)이 적용되지 않습니다. 즉, 아래 코드는 동작하지 않고 `a`와 `img` 스타일은 사용되지 않은 것으로 간주됩니다:

<!-- prettier-ignore -->
```svelte
<article>
	{@html content}
</article>

<style>
	article {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```

대신 `:global` 수식어를 사용해 `<article>` 안의 모든 것을 대상으로 지정하세요:

<!-- prettier-ignore -->
```svelte
<style>
	article +++:global+++ {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```
