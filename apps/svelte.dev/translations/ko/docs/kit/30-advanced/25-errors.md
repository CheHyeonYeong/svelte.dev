---
title: 에러
tags: errors
---

에러는 소프트웨어 개발에서 피할 수 없는 일입니다. SvelteKit은 에러가 어디서 발생했는지, 어떤 종류의 에러인지, 들어온 요청이 어떤 성격인지에 따라 에러를 다르게 처리합니다.

## 에러 객체 <!-- Error objects -->

모든 에러는 렌더링되기 전에 [`handleError`](hooks#handleError) 훅을 거치며, 이 훅에서 에러를 로그로 남기고 원하는 대로 바꿀 수 있습니다. 훅의 `kind` 속성은 에러가 어디서 왔는지를 나타냅니다: 앱(`'app'`), SvelteKit(`'framework'`), [원격 함수](remote-functions) 인자 검증(`'validation'`), 또는 알 수 없는 출처(`'unknown'`)입니다. 기본적으로 모든 에러는 단순한 `{ status: number, message: string }` 객체로 표현됩니다.

아래 예시처럼 `code`나 추적용 `id` 같은 속성을 추가할 수 있습니다. (TypeScript를 사용한다면 아래 [타입 안전성](errors#Type-safety)에서 설명하는 대로 `Error` 타입을 다시 정의해야 합니다.)

## 앱 에러 <!-- App errors -->

앱 에러는 `@sveltejs/kit`에서 가져온 [`error`](@sveltejs-kit#error) 함수를 사용해 앱 코드에서 던진 에러입니다:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function getPost(slug: string): Promise<{ title: string, content: string } | undefined>
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';
import * as db from '#lib/server/database.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await db.getPost(params.slug);

	if (!post) {
		error(404, 'Not found');
	}

	return { post };
}
```

이렇게 하면 SvelteKit이 잡는 예외가 발생하고, SvelteKit은 응답 상태 코드를 404로 설정한 뒤 [`+error.svelte`](routing#error) 컴포넌트를 렌더링합니다. 이때 `error`는 지정한 `status`와 `message`를 가진 `App.Error` 객체입니다.

그 과정에서 에러는 `kind: 'app'`으로 [`handleError`](hooks#handleError) 훅을 거칩니다. 에러의 형태는 앱이 정하므로 노출해도 안전하다고 간주되며, 훅은 에러를 바꾸지 않고 그대로 통과시킬 수 있습니다.

```svelte
<!--- file: src/routes/+error.svelte --->
<script>
	let { error } = $props();
</script>

<h1>{error.message}</h1>
```

필요하다면 에러 객체에 속성을 더 추가할 수 있습니다:

```js
// @filename: ambient.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			code: string;
		}
	}
}
export {}

// @filename: index.js
import { error } from '@sveltejs/kit';
// ---cut---
error(404, 'Not found', {
	+++code: 'NOT_FOUND'+++
});
```

> [!NOTE] [SvelteKit 1.x에서는](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) `error`를 직접 `throw`해야 했습니다

## 프레임워크 에러 <!-- Framework errors -->

어떤 에러는 여러분의 코드가 아니라 SvelteKit 자체에서 생성됩니다. 어떤 라우트와도 일치하지 않는 요청(404), 액션이 없는 페이지에 보낸 `POST` 요청(405), 크기 제한을 넘는 요청 본문(413) 등이 그렇습니다.

이 에러들도 `kind: 'framework'`로 `handleError`를 거칩니다. 받게 되는 `error`는 `{ status, message }` 객체이며, `message`는 `'Not Found'`처럼 무엇이 잘못되었는지를 간결하지만 안전하게 설명하므로 사용자에게 그대로 노출해도 됩니다.

`handleError` 안에서 에러를 로그로 남긴다면, 404 같은 프레임워크 에러는 일상적으로 발생한다는 점을 기억하세요. 보통은 이런 에러를 로그로 남기지 않는 편이 좋습니다.

## 검증 에러 <!-- Validation errors -->

검증 에러는 [원격 함수](remote-functions)가 잘못된 데이터로 호출될 때 발생합니다. 이 에러가 `handleError`에 전달될 때는 `issues` 배열이 함께 전달됩니다. 자세한 내용은 [검증 에러 처리하기](remote-functions#Handling-validation-errors)를 참고하세요.

## 알 수 없는 에러 <!-- Unknown errors -->

*알 수 없는* 에러는 요청을 처리하는 동안 발생한 그 밖의 모든 예외입니다. 이런 에러에는 민감한 정보가 담겨 있을 수 있으므로, 알 수 없는 에러의 메시지와 스택 트레이스는 사용자에게 노출되지 않습니다.

기본적으로 알 수 없는 에러는 콘솔(프로덕션에서는 서버 로그)에 출력되며, 사용자에게 노출되는 에러는 일반적인 형태를 띱니다:

```json
{ "status": 500, "message": "Internal Error" }
```

SvelteKit은 무엇이 잘못되었는지 알 수 없으므로, 알 수 없는 에러는 `kind: 'unknown'`으로 [`handleError`](hooks#handleError) 훅을 거칩니다. 이 훅에서 직접 에러 처리를 추가할 수 있습니다. 예를 들어 에러를 보고 서비스로 보내거나, `+error.svelte`에 `error` prop으로 전달될 사용자 정의 에러 객체를 반환할 수 있습니다. 훅이 받는 값은 던져진 원래 값 그대로이며, 직접 노출하기로 하지 않는 한 그 내용은 전혀 노출되지 않습니다.

반환하는 값은 무엇이든 기본값을 덮어쓰므로, 예를 들어 던져진 에러의 타입에 따라 응답에 쓸 HTTP 상태 코드를 정할 수 있습니다:

```js
/// file: src/hooks.server.js
// Assuming you have this ...
class NotFound extends Error {}

/** @type {import('@sveltejs/kit/hooks').HandleServerError} */
export function handleError({ kind, error, event }) {
	if (kind === 'unknown') {
		// ... you can do this
		if (error instanceof NotFound) {
			return {
				status: 404,
				message: 'Not found'
			};
		}

		return { message: 'Something went wrong' };
	}

	// app and framework errors are already safe to expose
	return error;
}
```



## 에러 바운더리 <!-- Error boundaries -->

`load` 중이나 렌더링 중(예를 들어 컴포넌트의 `<script>` 블록이나 템플릿 안)에 발생한 에러는 가장 가까운 `+error.svelte` 컴포넌트로 전파됩니다. 더 세밀한 수준에서 에러를 처리하려면 [`<svelte:boundary>`](../svelte/svelte-boundary)를 사용할 수 있습니다:

```svelte
<svelte:boundary>
	...
	{#snippet failed(error: App.Error)}
		<!-- error went through the `handleError` hook and is of type `App.Error` -->
		{error.message}
	{/snippet}
</svelte:boundary>
```

## 응답 <!-- Responses -->

`handle` 안이나 [`+server.js`](routing#server) 요청 핸들러 안에서 에러가 발생하면, SvelteKit은 요청의 `Accept` 헤더에 따라 폴백 에러 페이지나 에러 객체의 JSON 표현으로 응답합니다.

`src/error.html` 파일을 추가하면 폴백 에러 페이지를 원하는 대로 바꿀 수 있습니다:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit은 `%sveltekit.status%`와 `%sveltekit.error.message%`를 각각 해당하는 값으로 바꿉니다.

반면 페이지를 렌더링하는 동안 `load` 함수 안에서 에러가 발생하면, SvelteKit은 에러가 발생한 곳에서 가장 가까운 [`+error.svelte`](routing#error) 컴포넌트를 렌더링합니다. `+layout(.server).js`의 `load` 함수 안에서 에러가 발생하면, 트리에서 가장 가까운 에러 바운더리는 그 레이아웃 옆이 아니라 그 레이아웃 *위*에 있는 `+error.svelte` 파일입니다.

예외는 루트 `+layout.js`나 `+layout.server.js` 안에서 에러가 발생한 경우입니다. 루트 레이아웃은 보통 `+error.svelte` 컴포넌트를 *포함*하기 때문입니다. 이 경우 SvelteKit은 폴백 에러 페이지를 사용합니다.

## 타입 안전성 <!-- Type safety -->

TypeScript를 사용하면서 에러의 형태를 바꿔야 한다면, 앱에 `App.Error` 인터페이스를 선언하면 됩니다(관례상 `src/app.d.ts`에 두지만, TypeScript가 '볼 수 있는' 곳이라면 어디든 괜찮습니다):

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
+++			code: string;
			id: string;+++
		}
	}
}

export {};
```

이 인터페이스에는 항상 `status: number`와 `message: string` 속성이 포함됩니다.

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 에러와 리디렉션](/tutorial/kit/error-basics)
- [튜토리얼: 훅](/tutorial/kit/handle)
