---
title: HTML 태그
tags: template-html
---

보통 문자열은 일반 텍스트로 삽입됩니다. 즉, `<`나 `>` 같은 문자는 특별한 의미를 갖지 않습니다.

하지만 때로는 컴포넌트에 HTML을 직접 렌더링해야 합니다. 예를 들어 지금 읽고 있는 이 글도 마크다운 파일로 존재하다가 HTML 덩어리로 이 페이지에 포함된 것입니다.

Svelte에서는 특별한 `{@html ...}` 태그로 이렇게 할 수 있습니다:

```svelte
/// file: App.svelte
<p>{+++@html+++ string}</p>
```

> [!NOTE] 중요: Svelte는 `{@html ...}` 안의 표현식을 DOM에 삽입하기 전에 어떤 소독(sanitization)도 하지 않습니다. 직접 쓴 글처럼 신뢰할 수 있는 내용이라면 문제가 되지 않습니다. 하지만 글에 달린 댓글처럼 신뢰할 수 없는 사용자 콘텐츠라면 반드시 직접 이스케이프해야 합니다. 그렇지 않으면 사용자를 <a href="https://owasp.org/www-community/attacks/xss/" target="_blank">크로스 사이트 스크립팅</a>(XSS) 공격에 노출할 위험이 있습니다.
