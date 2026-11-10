---
title: 에러 메시지 커스터마이징
---

이전 연습 문제의 에러 페이지는 다소 정적입니다. 지원 채널로 찾아오는 사람들을 더 빨리 도울 수 있도록 에러 메시지를 보여 주고 싶을 수도 있습니다.

이를 위해 SvelteKit은 `page.error`(에러의 `status`, `message`, 그리고 사용자 정의 속성이 들어 있습니다)와 `page.status`를 제공합니다. 이 값들을 `+error.svelte`에 추가해 봅시다:

```svelte
/// file: src/routes/+error.svelte
<script>
	+++import { page } from '$app/state';+++

	let online = typeof navigator !== 'undefined'
		? navigator.onLine
		: true;
</script>

+++{#if page.status === 404}
	<h1>Not found</h1>
{:else +++if !online}
	<h1>You're offline</h1>
{:else}
	<h1>Oops!</h1>
	---<p>Something went wrong</p>---
	+++<p>{page.error.message}</p>+++
{/if}
```

훨씬 낫지만, about 페이지의 알 수 없는 에러는 메시지가 "Internal Error"입니다. 왜 그럴까요? SvelteKit이 신중하게 동작해서, 실수로 민감한 정보를 에러 메시지에 담아 보여 주는 일을 막기 때문입니다.

이를 커스터마이즈하려면 `hooks.server.js`와 `hooks.client.js`에 `handleError` 훅을 구현하세요. 이 훅은 불러오기, 렌더링, 요청에 응답하는 중에 throw된 모든 에러를 받으며, `kind` 속성으로 각 에러가 어디서 왔는지 알 수 있습니다. 여기서는 `'unknown'` 에러에 대해서만 원래 메시지를 드러내려고 합니다. `'app'`, `'framework'`, 그리고 서버 측 `'validation'` 에러에 대해 아무것도 반환하지 않으면 기존의 안전한 세부 정보가 그대로 유지됩니다.

```js
// hooks.server.js
export function handleError(+++{ kind, error }+++) {
    +++if (kind === 'unknown') {
        return { message: error instanceof Error ? error.message : 'Internal Error' };
    }+++
}
```

```js
// hooks.client.js
export function handleError(+++{ kind, error }+++) {
    +++if (kind === 'unknown') {
        return { message: error instanceof Error ? error.message : 'Internal Error' };
    }+++
}
```

이 훅에서 에러 리포팅 서비스를 호출할 수도 있습니다.

원한다면 더 많은 속성을 반환할 수도 있습니다. 어떤 형태의 객체를 반환하든 기본값과 병합되어 `page.error`에서 사용할 수 있습니다. `status`를 반환하면 에러 페이지를 렌더링할 때 쓰이는 상태도 바뀝니다. 이에 대한 자세한 내용(과 타입 안전하게 만드는 방법!)은 [에러 문서](/docs/kit/errors)에서 읽어 볼 수 있습니다.

> [!NOTE] 에러를 처리할 때는 그것이 `Error` 객체라고 가정하지 않도록 주의하세요. 무엇이든 throw될 수 있습니다. 또한 너무 많은 정보를 전달해서 민감한 데이터가 노출되지 않도록 주의하세요
