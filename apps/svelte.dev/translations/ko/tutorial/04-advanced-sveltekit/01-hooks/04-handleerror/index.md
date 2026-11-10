---
title: handleError
---

`handleError` 훅을 사용하면 에러를 가로채서 Slack 채널에 알림을 보내거나 에러 로깅 서비스에 데이터를 전송하는 등의 동작을 실행할 수 있습니다.

[앞선 연습](error-basics)에서 배웠듯이, `@sveltejs/kit`의 `error` 헬퍼로 만들지 않은 에러는 *알 수 없는*(unknown) 에러입니다. 보통은 앱의 어딘가를 고쳐야 한다는 뜻입니다.

모든 에러는 `handleError`에 전달됩니다. `kind` 속성은 에러가 `error(...)`를 통해 앱에서 왔는지(`'app'`), SvelteKit에서 왔는지(`'framework'`), 원격 함수의 유효성 검사에서 왔는지(`'validation'`, 서버에서만), 알 수 없는 출처에서 왔는지(`'unknown'`) 알려 줍니다. 기본 동작은 알 수 없는 에러를 로그로 남기는 것입니다:

```js
/// file: src/hooks.server.js
export function handleError({ kind, error }) {
	if (kind === 'unknown') {
		console.error(error);
	}
}
```

`/the-bad-place`로 이동하면 실제로 동작하는 모습을 볼 수 있습니다. 에러 페이지가 표시되고, (URL 표시줄 오른쪽 버튼으로) 터미널을 열면 `src/routes/the-bad-place/+page.server.js`에서 보낸 메시지가 보입니다.

사용자에게는 에러 메시지를 보여 주지 *않는다는* 점에 주목하세요. 에러 메시지에는 민감한 정보가 들어 있을 수 있어서, 잘해야 사용자를 혼란스럽게 하고 최악의 경우 악의적인 사람에게 이득이 될 수 있기 때문입니다. 대신 애플리케이션에서 사용할 수 있는 [`App.Error`](/docs/kit/types#Error) 객체(`+error.svelte` 페이지에서는 `page.error`로 표현되고, `src/error.html` 폴백의 `%sveltekit.error.message%`를 채우는 데 쓰입니다)는 알 수 없는 에러의 경우 다음과 같을 뿐입니다:

<!-- prettier-ignore-start -->
```js
{
	status: 500,
	message: 'Internal Error'
}
```
<!-- prettier-ignore-end -->

상황에 따라 이 객체를 직접 정의하고 싶을 수 있습니다. 그러려면 `unknown` 에러에 대해 `handleError`에서 객체를 반환하면 됩니다:

```js
/// file: src/hooks.server.js
export function handleError({ kind, error }) {
	if (kind === 'unknown') {
		console.error(error);

		+++return {
			message: 'everything is fine',
			code: 'JEREMYBEARIMY'
		};+++
	}
}
```

`status`를 생략했으므로 기본값인 `500`이 유지됩니다. 에러 페이지를 렌더링할 때 쓰는 상태 코드를 바꾸고 싶다면 다른 `status`를 반환하면 됩니다.

앱, 프레임워크, 유효성 검사 에러의 경우 `handleError`에서 아무것도 반환하지 않으면 기존의 안전한 `status`, `message` 등의 속성이 그대로 유지됩니다.

이제 사용자 정의 에러 페이지에서 `message` 외의 속성도 참조할 수 있습니다. `src/routes/+error.svelte`를 만드세요:

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
<p>{page.error.message}</p>
<p>error code: {page.error.code}</p>
```
