---
title: @sveltejs/kit/hooks
---



```js
// @noErrors
import { sequence } from '@sveltejs/kit/hooks';
```

## sequence

여러 `handle` 호출을 미들웨어처럼 차례로 이어 주는 헬퍼 함수입니다.
`handle` 옵션은 다음과 같이 동작합니다:
- `transformPageChunk`는 역순으로 적용되고 병합됩니다
- `preload`는 정순으로 적용되며, 첫 번째 옵션이 "이기고" 그 뒤의 `preload` 옵션은 호출되지 않습니다
- `filterSerializedResponseHeaders`는 `preload`와 똑같이 동작합니다

```js
// @errors: 7031
/// file: src/hooks.server.js
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit/hooks').Handle} */
async function first({ event, resolve }) {
	console.log('first pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// transforms are applied in reverse order
			console.log('first transform');
			return html;
		},
		preload: () => {
			// this one wins as it's the first defined in the chain
			console.log('first preload');
			return true;
		}
	});
	console.log('first post-processing');
	return result;
}

/** @type {import('@sveltejs/kit/hooks').Handle} */
async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
			return true;
		},
		filterSerializedResponseHeaders: () => {
			// this one wins as it's the first defined in the chain
			console.log('second filterSerializedResponseHeaders');
			return true;
		}
	});
	console.log('second post-processing');
	return result;
}

export const handle = sequence(first, second);
```

위 예제는 다음을 출력합니다:

```
first pre-processing
first preload
second pre-processing
second filterSerializedResponseHeaders
second transform
first transform
second post-processing
first post-processing
```

`resolve`를 호출하면 순서상 다음 핸들러가 호출됩니다(마지막 핸들러라면 SvelteKit 자체가 호출됩니다). 핸들러 사이에 데이터를 전달하려면 `event.locals`를 사용하세요.

<div class="ts-block">

```dts
function sequence(...handlers: Handle[]): Handle;
```

</div>



## CaughtError

[`handleError`](/docs/kit/hooks#handleError) 훅에 전달되는 에러입니다.
`kind` 판별자를 사용하면 앱에서 발생한 에러([`error`](/docs/kit/errors#App-errors)
헬퍼로 던진 에러), SvelteKit 자체가 만든
에러(404 등), 검증 에러, 알 수 없는 에러(여러분의 코드나
그 코드가 호출한 코드에서 던진 에러)를 구분할 수 있습니다.

<div class="ts-block">

```dts
type CaughtError<
	Issue extends StandardSchemaV1.Issue =
		StandardSchemaV1.Issue
> =
	| {
			[Kind in keyof CaughtErrorMap]: {
				/** Identifies the category and origin of the error */
				kind: Kind;
				/** The caught error. Its type depends on `kind` */
				error: CaughtErrorMap[Kind];
				/** Only present for validation errors */
				issues?: undefined;
				/** Only present for validation errors */
				remote?: undefined;
			};
	  }[keyof CaughtErrorMap]
	| ValidationCaughtError<Issue>;
```

</div>

## ClientCaughtError

클라이언트 사이드 `handleError` 훅에 전달되는 에러입니다.

<div class="ts-block">

```dts
type ClientCaughtError = Exclude<
	CaughtError,
	{ kind: 'validation' }
>;
```

</div>

## ClientInit

<blockquote class="since note">

2.10.0부터 사용 가능

</blockquote>

[`init`](/docs/kit/hooks#init)은 브라우저에서 앱이 시작될 때 한 번 호출됩니다

<div class="ts-block">

```dts
type ClientInit = () => MaybePromise<void>;
```

</div>

## Handle

[`handle`](/docs/kit/hooks#handle) 훅은 SvelteKit 서버가 [요청](/docs/kit/web-standards#Fetch-APIs-Request)을 받을 때마다 실행되며
[응답](/docs/kit/web-standards#Fetch-APIs-Response)을 결정합니다.
요청을 나타내는 `event` 객체와, 라우트를 렌더링해 `Response`를 만드는 `resolve` 함수를 받습니다.
이를 이용해 응답 헤더나 본문을 수정하거나, SvelteKit을 완전히 우회할 수 있습니다(예를 들어 라우트를 프로그래밍 방식으로 구현할 때).

<div class="ts-block">

```dts
type Handle = (input: {
	event: RequestEvent;
	resolve: (
		event: RequestEvent,
		opts?: ResolveOptions
	) => Promise<Response>;
}) => MaybePromise<Response>;
```

</div>

## HandleClientError

클라이언트 사이드 [`handleError`](/docs/kit/hooks#handleError) 훅은 내비게이션 중에 던져진 모든 에러에 대해 실행되며, 리다이렉트는 제외합니다.
서버 사이드 훅에서 이미 변환된 에러는 다시 전달되지 않습니다.

`kind` 속성으로 _앱_ 에러([`error`](/docs/kit/errors#App-errors) 헬퍼로 던진 에러),
_프레임워크_ 에러(404처럼 SvelteKit 자체가 만든 에러), _알 수 없는_ 에러(여러분의 코드나 그 코드가 호출한 코드에서 던진 에러)를 구분합니다.

이 훅은 `App.Error`에 맞는 객체를 반환하며, 이때 `status`와 `message`는 선택 사항입니다. 기본값을 덮어쓰고 싶을 때만
반환하세요. 생략한 속성은 잡힌 에러에서 물려받습니다. 앱 에러라면 `error(...)`에 전달한 본문을,
프레임워크 에러라면 상태 코드와 안전한 메시지를, 알 수 없는 에러라면 `500`/`'Internal Error'`를 씁니다. 아무것도 반환하지 않으면
기본값을 그대로 유지합니다(`App.Error`에 필수 속성을 추가했다면 그 속성은 반드시 반환해야 합니다).

이 함수가 _절대_ 에러를 던지지 않도록 하세요.

<div class="ts-block">

```dts
type HandleClientError = (
	input: ClientCaughtError & { event: NavigationEvent }
) => MaybePromise<
	| AppErrorWithOptionalDefaults
	| VoidIfNoRequiredAppErrorProperties
>;
```

</div>

## HandleFetch

[`handleFetch`](/docs/kit/hooks#handleFetch) 훅을 사용하면 엔드포인트, `load`, `action`, `handle`, `handleError`, `reroute` 안에서 서버(또는 프리렌더링 중)에서 실행되는 [`event.fetch`](/docs/kit/load#Making-fetch-requests) 호출의 결과를 수정(또는 교체)할 수 있습니다.

<div class="ts-block">

```dts
type HandleFetch = (input: {
	event: RequestEvent;
	request: Request;
	fetch: typeof fetch;
}) => MaybePromise<Response>;
```

</div>

## HandleServerError

서버 사이드 [`handleError`](/docs/kit/hooks#handleError) 훅은 요청에 응답하는 중에 던져진 모든 에러에 대해 실행되며, 리다이렉트는 제외합니다.

`kind` 속성으로 _앱_ 에러([`error`](/docs/kit/errors#App-errors) 헬퍼로 던진 에러),
_프레임워크_ 에러(404처럼 SvelteKit 자체가 만든 에러), _검증_ 에러(잘못된 원격 함수 인자로 인한 에러),
_알 수 없는_ 에러(여러분의 코드나 그 코드가 호출한 코드에서 던진 에러)를 구분합니다.

이 훅은 `App.Error`에 맞는 객체를 반환하며, 이때 `status`와 `message`는 선택 사항입니다. 기본값을 덮어쓰고 싶을 때만
반환하세요. 생략한 속성은 잡힌 에러에서 물려받습니다. 앱 에러라면 `error(...)`에 전달한 본문을,
프레임워크 에러와 검증 에러라면 상태 코드와 안전한 메시지를, 알 수 없는 에러라면 `500`/`'Internal Error'`를 씁니다. 아무것도 반환하지 않으면
기본값을 그대로 유지합니다(`App.Error`에 필수 속성을 추가했다면 그 속성은 반드시 반환해야 합니다).

이 함수가 _절대_ 에러를 던지지 않도록 하세요.

<div class="ts-block">

```dts
type HandleServerError<
	Issue extends StandardSchemaV1.Issue =
		StandardSchemaV1.Issue
> = (
	input: CaughtError<Issue> & { event: RequestEvent }
) => MaybePromise<
	| AppErrorWithOptionalDefaults
	| VoidIfNoRequiredAppErrorProperties
>;
```

</div>

## Reroute

<blockquote class="since note">

2.3.0부터 사용 가능

</blockquote>

[`reroute`](/docs/kit/hooks#reroute) 훅을 사용하면 어떤 라우트를 렌더링할지 결정하는 데 URL이 쓰이기 전에 URL을 수정할 수 있습니다.

<div class="ts-block">

```dts
type Reroute = (event: {
	url: URL;
	fetch: typeof fetch;
}) => MaybePromise<void | string>;
```

</div>

## ResolveOptions

<div class="ts-block">

```dts
interface ResolveOptions {/*…*/}
```

<div class="ts-block-property">

```dts
transformPageChunk?: (input: { html: string; done: boolean }) => MaybePromise<string | undefined>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `input` HTML 청크와, 이것이 마지막 청크인지에 대한 정보

</div>

HTML에 사용자 정의 변환을 적용합니다. `done`이 true이면 마지막 청크입니다. 청크가 올바른 형식의 HTML이라는 보장은 없지만
(예를 들어 요소의 여는 태그는 있는데 닫는 태그는 없을 수 있습니다)
항상 `%sveltekit.head%`나 레이아웃/페이지 컴포넌트 같은 합리적인 경계에서 나뉩니다.

</div>
</div>

<div class="ts-block-property">

```dts
filterSerializedResponseHeaders?: (name: string, value: string) => boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 헤더 이름
- `value` 헤더 값

</div>

`load` 함수가 `fetch`로 리소스를 불러올 때, 직렬화된 응답에 어떤 헤더를 포함할지 결정합니다.
기본적으로는 아무 헤더도 포함하지 않습니다.

</div>
</div>

<div class="ts-block-property">

```dts
preload?: (
	input:
		| { type: 'css' | 'js' | 'asset'; path: string }
		| { type: 'font'; path: string; filename: string }
) => boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `input` 파일의 타입과 경로

</div>

어떤 파일을 프리로드할지 결정합니다. 파일은 `<head>` 태그에 추가된 `<link>` 태그를 통해
프리로드됩니다. `output.linkHeaderPreload`가 켜져 있으면, 동적으로 렌더링되는 페이지는 대신
[`Link` 응답 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)를 사용합니다.
기본적으로 `js`와 `css` 파일이 프리로드됩니다.

`font` 파일의 경우 `input`에 `filename` 속성도 있습니다. 이는 프로젝트 루트를 기준으로 한 원본 파일의 경로명이므로,
필터가 해시된 경로 대신 이 값으로 매칭할 수 있습니다. `js`와
`css` 파일은 번들되므로 하나의 원본 파일 이름이 없습니다.

</div>
</div></div>

## ServerInit

<blockquote class="since note">

2.10.0부터 사용 가능

</blockquote>

[`init`](/docs/kit/hooks#init)은 서버가 첫 번째 요청에 응답하기 전에 호출됩니다

<div class="ts-block">

```dts
type ServerInit = () => MaybePromise<void>;
```

</div>

## Transport

<blockquote class="since note">

2.11.0부터 사용 가능

</blockquote>

[`transport`](/docs/kit/hooks#transport) 훅을 사용하면 사용자 정의 타입을 서버/클라이언트 경계 너머로 전달할 수 있습니다.

각 트랜스포터(transporter)는 `encode`와 `decode` 함수 한 쌍을 가집니다. 서버에서 `encode`는 값이 사용자 정의 타입의 인스턴스인지 판단하고, 그렇다면 그 값을 객체나 배열로 인코딩한 falsy가 아닌 값을 반환합니다(아니라면 `false`를 반환합니다).

브라우저에서 `decode`는 인코딩된 값을 다시 사용자 정의 타입의 인스턴스로 되돌립니다.

```ts
import type { Transport } from '@sveltejs/kit/hooks';

declare class MyCustomType {
	data: any
}

// hooks.js
export const transport: Transport = {
	MyCustomType: {
		encode: (value) => value instanceof MyCustomType && [value.data],
		decode: ([data]) => new MyCustomType(data)
	}
};
```

<div class="ts-block">

```dts
type Transport = Record<string, Transporter>;
```

</div>

## Transporter

[`transport`](/docs/kit/hooks#transport) 훅의 멤버입니다.

<div class="ts-block">

```dts
interface Transporter<
	T = any,
	U =
		any /* minus falsy values, but we can't properly express that */
> {/*…*/}
```

<div class="ts-block-property">

```dts
encode: (value: T) => false | U;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
decode: (data: U) => T;
```

<div class="ts-block-property-details"></div>
</div></div>


