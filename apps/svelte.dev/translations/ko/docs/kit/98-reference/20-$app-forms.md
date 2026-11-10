---
title: $app/forms
tags: enhance
---



```js
// @noErrors
import { applyAction, deserialize, enhance } from '$app/forms';
```

## applyAction

현재 페이지의 `form` 속성을 주어진 데이터로 갱신하고 `page.status`도 갱신합니다.
에러가 발생하면 가장 가까운 에러 페이지를 렌더링합니다. 리다이렉트인 경우에는
리다이렉트 위치로 이동합니다.

<div class="ts-block">

```dts
function applyAction<
	Success extends Record<string, unknown> | undefined,
	Failure extends Record<string, unknown> | undefined
>(result: ActionResult<Success, Failure>): Promise<void>;
```

</div>



## deserialize

폼 제출에 대한 응답을 역직렬화할 때 이 함수를 사용합니다.
사용법:

```js
// @errors: 7031
import { deserialize } from '$app/forms';

async function handleSubmit(event) {
	const response = await fetch('/form?/action', {
		method: 'POST',
		body: new FormData(event.target)
	});

	const result = deserialize(await response.text());
	// ...
}
```

<div class="ts-block">

```dts
function deserialize<
	Success extends Record<string, unknown> | undefined,
	Failure extends Record<string, unknown> | undefined
>(result: string): ActionResult<Success, Failure>;
```

</div>



## enhance

이 액션은 JavaScript 없이도 동작하는 `<form>` 요소를 향상합니다.

`submit` 함수는 제출 시점에 주어진 FormData와 실행될 `action`을 인자로 받아 호출됩니다.
`cancel`을 호출하면 폼이 제출되지 않습니다.
다른 제출이 시작되는 경우, abort `controller`를 사용해 현재 제출을 취소할 수 있습니다.
함수를 반환하면 그 함수는 서버의 응답을 인자로 받아 호출됩니다.
아무것도 반환하지 않으면 기본 동작(fallback)이 사용됩니다.

이 함수나 그 반환값을 설정하지 않으면, 전체 페이지를 다시 불러오지 않는다는 점만 빼고 브라우저 기본 동작을 흉내 냅니다. 구체적으로는 다음과 같습니다.
- 리다이렉트 응답 없이 제출에 성공하면 `<form>` 요소를 초기화하고 모든 데이터를 새로 고칩니다
- 액션이 폼과 같은 페이지에 있으면 `form` prop, `page.form`, `page.status`를 갱신합니다
- 제출 결과가 도착하는 페이지가 현재 페이지가 아니라면, 성공이든 실패든 네이티브 폼 제출과 마찬가지로 그 페이지로 이동하고 그 페이지의 `form` prop과 `page.status`를 채웁니다. 단, 이동할 URL에서 `?/actionName` 매개변수는 제거됩니다
- 리다이렉트 응답이면 리다이렉트합니다
- 예상치 못한 에러가 발생하면 가장 가까운 에러 페이지를 렌더링합니다. 액션이 다른 페이지에 있다면 액션의 라우트에서 가장 가까운 에러 페이지를 렌더링합니다

콜백이 있는 사용자 정의 함수를 제공하면서 기본 동작도 사용하고 싶다면, 콜백 안에서 `update`를 호출하세요.
`update`는 다음과 같은 옵션 객체를 받습니다
- `reset: false` — 제출에 성공한 뒤 `<form>`의 값이 초기화되지 않게 하려면 지정합니다
- `refreshAll` — 제출 후 모든 데이터를 새로 고칠지 제어합니다. 기본값은 성공 시 `true`, 실패 시 `false`입니다
- `navigate: false` — 리다이렉트가 아닌 결과를 `result.location`으로 이동하지 않고 현재 페이지에 적용합니다. 리다이렉트는 항상 따라갑니다

<div class="ts-block">

```dts
function enhance<
	Success extends Record<string, unknown> | undefined,
	Failure extends Record<string, unknown> | undefined
>(
	form_element: HTMLFormElement,
	submit?: SubmitFunction<Success, Failure>
): {
	destroy(): void;
};
```

</div>



## ActionResult

fetch로 폼 액션을 호출하면 응답은 다음 형태 중 하나가 됩니다.
```svelte
<form method="post" use:enhance={() => {
	return ({ result }) => {
		// result is of type ActionResult
	};
}}
```

성공 및 실패 결과에는 액션 URL의 루트 기준 상대 `pathname + search`가 담기며,
이때 `?/actionName` 매개변수는 제거됩니다. 리다이렉트 결과에는 리다이렉트 대상이 담깁니다. 서버에서 생성된
에러 결과에도 액션 위치가 담기지만, 네트워크 실패처럼 클라이언트에서 생성된 에러에는
담기지 않습니다. `update`는 이 위치를 사용해 네이티브 폼 내비게이션을 흉내 냅니다.

<div class="ts-block">

```dts
type ActionResult<
	Success extends Record<string, unknown> | undefined =
		Record<string, any>,
	Failure extends Record<string, unknown> | undefined =
		Record<string, any>
> =
	| {
			type: 'success';
			status: number;
			data?: Success;
			location: string;
	  }
	| {
			type: 'failure';
			status: number;
			data?: Failure;
			location: string;
	  }
	| { type: 'redirect'; status: number; location: string }
	| {
			type: 'error';
			status?: number;
			error: App.Error;
			location?: string;
	  };
```

</div>

## SubmitFunction

<div class="ts-block">

```dts
type SubmitFunction<
	Success extends Record<string, unknown> | undefined =
		Record<string, any>,
	Failure extends Record<string, unknown> | undefined =
		Record<string, any>
> = (input: {
	action: URL;
	formData: FormData;
	formElement: HTMLFormElement;
	controller: AbortController;
	submitter: HTMLElement | null;
	cancel: () => void;
}) => MaybePromise<
	| void
	| ((opts: {
			formData: FormData;
			formElement: HTMLFormElement;
			action: URL;
			result: ActionResult<Success, Failure>;
			/**
			 * Call this to get the default behavior of a form submission response.
			 * @param options Set `reset: false` if you don't want the `<form>` values to be reset after a successful submission. `refreshAll` defaults to `true` for successful results and `false` for failures. When the submission navigates, setting it to `false` still runs the destination's `load` functions but may reuse shared layout data. Set `navigate: false` to apply non-redirect results to the current page instead of navigating to `result.location`. Redirects are always followed.
			 */
			update: (options?: {
				reset?: boolean;
				refreshAll?: boolean;
				navigate?: boolean;
				/** @deprecated Use `refreshAll` instead. */
				invalidateAll?: boolean;
			}) => Promise<void>;
	  }) => MaybePromise<void>)
>;
```

</div>


