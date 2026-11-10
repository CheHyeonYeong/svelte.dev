---
title: 나머지 매개변수
path: /how
focus: /src/routes/[path]/+page.svelte
---

개수를 알 수 없는 경로 세그먼트와 일치시키려면 `[...rest]` 매개변수를 사용하세요. [JavaScript의 나머지 매개변수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)와 닮아서 붙은 이름입니다.

`src/routes/[path]`의 이름을 `src/routes/[...path]`로 바꾸세요. 이제 이 라우트는 모든 경로와 일치합니다.

> [!NOTE] 더 구체적인 다른 라우트가 먼저 검사되므로, 나머지 매개변수는 모든 경로를 받아 주는 'catch-all' 라우트로 유용합니다. 예를 들어 `/categories/...` 안의 페이지에 사용자 정의 404 페이지가 필요하다면 다음 파일을 추가할 수 있습니다:
>
> ```tree
> src/routes/
> ├ categories/
> │ ├ animal/
> │ ├ mineral/
> │ ├ vegetable/
> +++│ ├ [...catchall]/
> │ │ ├ +error.svelte
> │ │ └ +page.server.js+++
> ```
>
> `+page.server.js` 파일의 `load` 안에서 `error(404)`를 호출하세요.

나머지 매개변수가 꼭 끝에 올 필요는 *없습니다*. `/items/[...path]/edit`나 `/items/[...path].json` 같은 라우트도 완전히 유효합니다.
