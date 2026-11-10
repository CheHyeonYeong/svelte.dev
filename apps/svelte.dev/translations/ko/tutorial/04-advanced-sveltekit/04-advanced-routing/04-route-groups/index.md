---
title: 라우트 그룹
---

[라우팅 소개](/tutorial/kit/layouts)에서 봤듯이, 레이아웃은 여러 라우트 사이에서 UI와 데이터 로딩 로직을 공유하는 방법입니다.

때로는 라우트에 영향을 주지 않고 레이아웃을 사용하면 편리합니다. 예를 들어 `/about` 페이지는 누구에게나 공개하면서 `/app`과 `/account` 라우트는 인증 뒤에 두어야 할 수 있습니다. 이럴 때 괄호로 감싼 디렉터리인 *라우트 그룹*을 사용할 수 있습니다.

`account`의 이름을 `(authed)/account`로, `app`의 이름을 `(authed)/app`으로 바꿔 `(authed)` 그룹을 만드세요.

이제 `src/routes/(authed)/+layout.server.js`를 만들어 이 라우트들에 대한 접근을 제어할 수 있습니다:

```js
/// file: src/routes/(authed)/+layout.server.js
import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
	if (!cookies.get('logged_in')) {
		redirect(303, `/login?redirectTo=${url.pathname}`);
	}
}
```

이 페이지들을 방문하려고 하면 `/login` 라우트로 리디렉션됩니다. 이 라우트의 `src/routes/login/+page.server.js`에는 `logged_in` 쿠키를 설정하는 폼 액션이 있습니다.

`src/routes/(authed)/+layout.svelte` 파일을 추가해 이 두 라우트에 UI를 더할 수도 있습니다:

```svelte
/// file: src/routes/(authed)/+layout.svelte
<script>
	let { children } = $props();
</script>

{@render children()}

<form method="POST" action="/logout">
	<button>log out</button>
</form>
```
