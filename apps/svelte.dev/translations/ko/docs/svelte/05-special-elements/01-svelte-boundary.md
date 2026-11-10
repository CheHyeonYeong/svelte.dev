---
title: <svelte:boundary>
---

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

> [!NOTE]
> 이 기능은 5.3.0에 추가되었습니다

바운더리를 사용하면 앱의 일부를 '격리'할 수 있습니다. 그래서 다음과 같은 일을 할 수 있습니다:

- [`await`](await-expressions) 표현식이 처음 resolve되는 동안 보여 줄 UI 제공하기
- 렌더링 중이나 이펙트 실행 중에 발생하는 에러를 처리하고, 에러가 발생했을 때 렌더링할 UI 제공하기

바운더리가 (`failed` 스니펫이나 `onerror` 핸들러, 또는 둘 다로) 에러를 처리하면, 기존 콘텐츠는 제거됩니다.

> [!NOTE] 렌더링 과정 밖에서 발생하는 에러(예를 들어 이벤트 핸들러 안이나 `setTimeout` 또는 비동기 작업 이후에 발생하는 에러)는 에러 바운더리에서 잡히지 *않습니다*.

## 속성 <!-- Properties -->

바운더리가 무언가를 하려면 다음 중 하나 이상을 제공해야 합니다.

### `pending`

이 스니펫은 바운더리가 처음 생성될 때 표시되며, 바운더리 안의 모든 [`await`](await-expressions) 표현식이 resolve될 때까지 계속 보입니다([데모](/playground/untitled#H4sIAAAAAAAAE21QQW6DQAz8ytY9BKQVpFdKkPqDHnorPWzAaSwt3tWugUaIv1eE0KpKD5as8YxnNBOw6RAKKOOAVrA4up5bEy6VGknOyiO3xJ8qMnmPAhpOZDFC8T6BXPyiXADQ258X77P1FWg4moj_4Y1jQZZ49W0CealqruXUcyPkWLVozQXbZDC2R606spYiNo7bqA7qab_fp2paFLUElD6wYhzVa3AdRUySgNHZAVN1qDZaLRHljTp0vSTJ9XJjrSbpX5f0eZXN6zLXXOa_QfmurIVU-moyoyH5ib87o7XuYZfOZe6vnGWmx1uZW7lJOq9upa-sMwuUZdkmmfIbfQ1xZwwaBL8ECgk9zh8axJAdiVsoTsZGnL8Bg4tX_OMBAAA=)):

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

이후의 비동기 업데이트에서는 `pending` 스니펫이 표시되지 *않습니다*. 이런 경우에는 [`$effect.pending()`]($effect#$effect.pending)을 사용할 수 있습니다.

> [!NOTE] 서버 사이드 렌더링 중에는 `pending` 스니펫이 있는 바운더리가 그 스니펫을 렌더링하고 나머지 콘텐츠는 무시합니다. [서버 사이드 렌더링](await-expressions#Server-side-rendering)을 참고하세요.


### `failed`

`failed` 스니펫을 제공하면, 바운더리 안에서 에러가 발생했을 때 `error`와 콘텐츠를 다시 만드는 `reset` 함수를 받아 렌더링됩니다([데모](/playground/hello-world#H4sIAAAAAAAAE3VRy26DMBD8lS2tFCIh6JkAUlWp39Cq9EBg06CAbdlLArL87zWGKk8ORnhmd3ZnrD1WtOjFXqKO2BDGW96xqpBD5gXerm5QefG39mgQY9EIWHxueRMinLosti0UPsJLzggZKTeilLWgLGc51a3gkuCjKQ7DO7cXZotgJ3kLqzC6hmex1SZnSXTWYHcrj8LJjWTk0PHoZ8VqIdCOKayPykcpuQxAokJaG1dGybYj4gw4K5u6PKTasSbjXKgnIDlA8VvUdo-pzonraBY2bsH7HAl78mKSHZpgIcuHjq9jXSpZSLixRlveKYQUXhQVhL6GPobXAAb7BbNeyvNUs4qfRg3OnELLj5hqH9eQZqCnoBwR9lYcQxuVXeBzc8kMF8yXY4yNJ5oGiUzP_aaf_waTRGJib5_Ad3P_vbCuaYxzeNpbU0eUMPAOKh7Yw1YErgtoXyuYlPLzc10_xo_5A91zkQL_AgAA)):

```svelte
<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

> [!NOTE]
> [컴포넌트에 전달하는 스니펫](snippet#Passing-snippets-to-components)과 마찬가지로, `failed` 스니펫은 속성으로 명시적으로 전달할 수도 있고...
>
> ```svelte
> <svelte:boundary {failed}>...</svelte:boundary>
> ```
>
> ...위의 예제처럼 바운더리 안에 직접 선언해서 암묵적으로 전달할 수도 있습니다.

### `onerror`

`onerror` 함수를 제공하면, 같은 두 인자 `error`와 `reset`을 받아 호출됩니다. 에러 리포팅 서비스로 에러를 추적할 때 유용합니다...

```svelte
<svelte:boundary onerror={(e) => report(e)}>
	...
</svelte:boundary>
```

...또는 바운더리 밖에서 `error`와 `reset`을 사용할 때도 유용합니다:

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>
		oops! try again
	</button>
{/if}
```

`onerror` 함수 안에서 에러가 발생하면(또는 에러를 다시 throw하면), 부모 바운더리가 있을 경우 그 바운더리에서 처리됩니다.

## `transformError` 사용하기 <!-- Using `transformError` -->

기본적으로 에러 바운더리는 서버에서는 아무 효과가 없습니다. 렌더링 중에 에러가 발생하면 렌더링 전체가 실패합니다.

5.51부터는 `transformError` 함수와 함께 [`render(...)`](imperative-component-api#render)를 호출해, `failed` 스니펫이 있는 바운더리에서 이 동작을 제어할 수 있습니다.

> [!NOTE] SvelteKit 같은 프레임워크를 통해 Svelte를 사용한다면 `render(...)` 호출에 직접 접근할 수 없을 가능성이 큽니다. 이 경우 프레임워크가 대신 `transformError`를 설정해 주어야 합니다. SvelteKit은 가까운 시일 안에 [`handleError`](../kit/hooks#handleError) 훅을 통해 이를 지원할 예정입니다.

`transformError` 함수는 `failed` 스니펫을 렌더링하는 데 쓰일, JSON으로 문자열화할 수 있는 객체를 반환해야 합니다. 이 객체는 직렬화되어 브라우저에서 스니펫을 하이드레이트하는 데 사용됩니다:

```js
// @errors: 1005
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = await render(App, {
	transformError: (error) => {
		// log the original error, with the stack trace...
		console.error(error);

		// ...and return a sanitized user-friendly error
		// to display in the `failed` snippet
		return {
			message: 'An error occurred!'
		};
	};
});
```

`transformError`가 에러를 throw하면(또는 다시 throw하면), `render(...)` 전체가 그 에러로 실패합니다.

> [!NOTE] 서버 사이드 렌더링 중에 발생하는 에러의 `message`와 `stack`에는 민감한 정보가 들어 있을 수 있습니다. 이를 그대로 브라우저로 보내지 말고 민감한 부분을 가리기를 권장합니다.

바운더리에 `onerror` 핸들러가 있으면, 하이드레이션할 때 역직렬화된 에러 객체와 함께 호출됩니다.

[`mount`](imperative-component-api#mount)와 [`hydrate`](imperative-component-api#hydrate) 함수도 `transformError` 옵션을 받으며, 기본값은 항등 함수입니다. `render`와 마찬가지로, 이 함수는 렌더링 중에 발생한 에러를 `failed` 스니펫이나 `onerror` 핸들러에 전달하기 전에 변환합니다.
