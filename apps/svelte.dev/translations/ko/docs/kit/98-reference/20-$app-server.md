---
title: $app/server
---



```js
// @noErrors
import {
	command,
	form,
	getRequestEvent,
	prerender,
	query,
	read,
	requested
} from '$app/server';
```

## command

<blockquote class="since note">

2.27부터 사용 가능

</blockquote>

원격 커맨드를 만듭니다. 브라우저에서 호출하면 이 함수는 `fetch` 호출을 통해 서버에서 실행됩니다.

전체 문서는 [원격 함수](/docs/kit/remote-functions#command)를 참고하세요.

<div class="ts-block">

```dts
function command<Output>(
	fn: () => MaybePromise<Output>
): RemoteCommand<void, Output>;
```

</div>

<div class="ts-block">

```dts
function command<Input, Output>(
	validate: 'unchecked',
	fn: (arg: Input) => MaybePromise<Output>
): RemoteCommand<Input, Output>;
```

</div>

<div class="ts-block">

```dts
function command<Schema extends StandardSchemaV1, Output>(
	validate: Schema,
	fn: (
		arg: StandardSchemaV1.InferOutput<Schema>
	) => MaybePromise<Output>
): RemoteCommand<
	StandardSchemaV1.InferInput<Schema>,
	Output
>;
```

</div>



## form

<blockquote class="since note">

2.27부터 사용 가능

</blockquote>

`<form>` 요소에 스프레드(spread)할 수 있는 폼 객체를 만듭니다.

전체 문서는 [원격 함수](/docs/kit/remote-functions#form)를 참고하세요.

<div class="ts-block">

```dts
function form<Output>(
	fn: () => MaybePromise<Output>
): RemoteForm<void, Output>;
```

</div>

<div class="ts-block">

```dts
function form<Input extends RemoteFormInput, Output>(
	validate: 'unchecked',
	fn: (
		data: Input,
		issue: RemoteFormInvalidField<Input>
	) => MaybePromise<Output>
): RemoteForm<Input, Output>;
```

</div>

<div class="ts-block">

```dts
function form<
	Schema extends StandardSchemaV1<
		RemoteFormInput,
		Record<string, any>
	>,
	Output
>(
	validate: true extends HasNonOptionalBoolean<
		StandardSchemaV1.InferInput<Schema>
	>
		? 'Error: All booleans in form schemas must be optional (e.g. `v.optional(v.boolean(), false)`) because checkbox inputs do not send a false value when unchecked.'
		: Schema,
	fn: (
		data: StandardSchemaV1.InferOutput<Schema>,
		issue: RemoteFormInvalidField<
			StandardSchemaV1.InferInput<Schema>
		>
	) => MaybePromise<Output>
): RemoteForm<StandardSchemaV1.InferInput<Schema>, Output>;
```

</div>



## getRequestEvent

<blockquote class="since note">

2.20.0부터 사용 가능

</blockquote>

현재 `RequestEvent`를 반환합니다. 서버 훅, 서버 `load` 함수, 액션, 엔드포인트 안에서(그리고 이들이 호출하는 함수 안에서) 사용할 수 있습니다.

[`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage)가 없는 환경에서는 동기적으로 호출해야 합니다(즉, `await` 뒤에서 호출하면 안 됩니다).

<div class="ts-block">

```dts
function getRequestEvent(): RequestEvent;
```

</div>



## prerender

<blockquote class="since note">

2.27부터 사용 가능

</blockquote>

원격 프리렌더 함수를 만듭니다. 브라우저에서 호출하면 이 함수는 `fetch` 호출을 통해 서버에서 실행됩니다.

전체 문서는 [원격 함수](/docs/kit/remote-functions#prerender)를 참고하세요.

<div class="ts-block">

```dts
function prerender<Output>(
	fn: () => MaybePromise<Output>,
	options?:
		| {
				inputs?: RemotePrerenderInputsGenerator<void>;
				dynamic?: boolean;
		  }
		| undefined
): RemotePrerenderFunction<void, Output>;
```

</div>

<div class="ts-block">

```dts
function prerender<Input, Output>(
	validate: 'unchecked',
	fn: (arg: Input) => MaybePromise<Output>,
	options?:
		| {
				inputs?: RemotePrerenderInputsGenerator<Input>;
				dynamic?: boolean;
		  }
		| undefined
): RemotePrerenderFunction<Input, Output>;
```

</div>

<div class="ts-block">

```dts
function prerender<Schema extends StandardSchemaV1, Output>(
	schema: Schema,
	fn: (
		arg: StandardSchemaV1.InferOutput<Schema>
	) => MaybePromise<Output>,
	options?:
		| {
				inputs?: RemotePrerenderInputsGenerator<
					StandardSchemaV1.InferInput<Schema>
				>;
				dynamic?: boolean;
		  }
		| undefined
): RemotePrerenderFunction<
	StandardSchemaV1.InferInput<Schema>,
	Output
>;
```

</div>



## query

<blockquote class="since note">

2.27부터 사용 가능

</blockquote>

원격 쿼리를 만듭니다. 브라우저에서 호출하면 이 함수는 `fetch` 호출을 통해 서버에서 실행됩니다.

전체 문서는 [원격 함수](/docs/kit/remote-functions#query)를 참고하세요.

<div class="ts-block">

```dts
function query<Output>(
	fn: () => MaybePromise<Output>
): RemoteQueryFunction<void, Output>;
```

</div>

<div class="ts-block">

```dts
function query<Input, Output>(
	validate: 'unchecked',
	fn: (arg: Input) => MaybePromise<Output>
): RemoteQueryFunction<Input, Output>;
```

</div>

<div class="ts-block">

```dts
function query<Schema extends StandardSchemaV1, Output>(
	schema: Schema,
	fn: (
		arg: StandardSchemaV1.InferOutput<Schema>
	) => MaybePromise<Output>
): RemoteQueryFunction<
	StandardSchemaV1.InferInput<Schema>,
	Output,
	StandardSchemaV1.InferOutput<Schema>
>;
```

</div>



## read

<blockquote class="since note">

2.4.0부터 사용 가능

</blockquote>

import한 에셋의 내용을 파일 시스템에서 읽습니다

```js
// @errors: 7031
import { read } from '$app/server';
import somefile from './somefile.txt';

const asset = read(somefile);
const text = await asset.text();
```

<div class="ts-block">

```dts
function read(asset: string): Response;
```

</div>



## requested

원격 `command`나 `form` 콜백 안에서, 클라이언트가 새로 고침을 요청한 쿼리 인스턴스에 대한
`{ arg, query }` 항목들을 주어진 `limit`까지 담은 이터러블(iterable)을 반환합니다.
각 `query`는 클라이언트 쪽의 원래 캐시 키에 연결된 `RemoteQuery`이므로,
쿼리의 스키마가 입력을 변환하더라도 `refresh()` / `set()`이 올바르게 전파됩니다.
`arg`는 *검증된* 인수,
즉 스키마를 거친 뒤의 값입니다(따라서 Standard Schema로
선언한 쿼리라면 `InferOutput<Schema>`입니다).

검증에 실패하거나 `limit`를 넘는 인수는 클라이언트에 보내는 응답에
실패로 기록됩니다.
원격 `command`나 `form`에서의 사용법은 [클라이언트가 요청한 새로 고침](/docs/kit/remote-functions#Single-flight-mutations-Client-requested-refreshes)을
참고하세요.

```ts
import { requested } from '$app/server';

for (const { arg, query } of requested(getPost, 5)) {
	// `arg` is the validated argument; `query` is bound to the client's
	// cache key. It's safe to throw away this promise -- SvelteKit will
	// await it and forward any errors to the client.
	void query.refresh();
}
```

위 코드를 줄여서, 결과에 대해 `refreshAll`을 호출할 수도 있습니다:

```ts
import { requested } from '$app/server';

await requested(getPost, 5).refreshAll();
```

`query.batch`에서도 동작합니다. 개별 항목의 새로 고침은
하나의 배치 호출로 모입니다.

라이브 쿼리에도 똑같이 적용되며, 이때는 `reconnect`와 `reconnectAll`을 사용합니다.

<div class="ts-block">

```dts
function requested<Input, Output, Validated = Input>(
	query: RemoteQueryFunction<Input, Output, Validated>,
	limit: number
): RemoteQueryRequestedResult<Validated, Output>;
```

</div>

<div class="ts-block">

```dts
function requested<Input, Output, Validated = Input>(
	query: RemoteLiveQueryFunction<Input, Output, Validated>,
	limit: number
): RemoteLiveQueryRequestedResult<Validated, Output>;
```

</div>



## RemoteCommand

원격 `command` 함수의 타입입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#command)를 참고하세요.

<div class="ts-block">

```dts
type RemoteCommand<Input, Output> = {
	(
		arg: undefined extends Input ? Input | void : Input
	): Promise<Output> & {
		updates(
			...updates: RemoteQueryUpdate[]
		): Promise<Output>;
	};
	/** The number of pending command executions */
	get pending(): number;
};
```

</div>

## RemoteForm

원격 `form` 함수의 타입입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#form)를 참고하세요.

<div class="ts-block">

```dts
type RemoteForm<
	Input extends RemoteFormInput | void,
	Output
> = RemoteForm_<Input, Output, [Input]>;
```

</div>

## RemoteFormEnhanceCallback

원격 폼의 `enhance` 메서드에 전달하는 콜백입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#form)를 참고하세요.

<div class="ts-block">

```dts
type RemoteFormEnhanceCallback<
	Input extends RemoteFormInput | void =
		RemoteFormInput | void,
	Output = any
> = (
	form: RemoteFormEnhanceInstance<Input, Output>
) => MaybePromise<void>;
```

</div>

## RemoteFormEnhanceInstance

`enhance` 콜백 안에서 받는 폼 인스턴스입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#form)를 참고하세요.

<div class="ts-block">

```dts
type RemoteFormEnhanceInstance<
	Input extends RemoteFormInput | void =
		RemoteFormInput | void,
	Output = any
> = Omit<
	RemoteForm<Input, Output>,
	'enhance' | 'element'
> & {
	readonly element: HTMLFormElement;
};
```

</div>

## RemoteFormField

name(), value(), issues() 메서드를 제공하는 폼 필드 접근자 타입

<div class="ts-block">

```dts
type RemoteFormField<Value extends RemoteFormFieldValue> =
	RemoteFormFieldMethods<Value> & {
		/**
		 * Returns an object that can be spread onto an input element with the correct type attribute,
		 * aria-invalid attribute if the field is invalid, and appropriate value/checked property getters/setters.
		 * @example
		 * ```svelte
		 * <input {...myForm.fields.myString.as('text')} />
		 * <input {...myForm.fields.myNumber.as('number')} />
		 * <input {...myForm.fields.myBoolean.as('checkbox')} />
		 * ```
		 */
		as<T extends RemoteFormFieldType<Value>>(
			...args: AsArgs<T, Value>
		): InputElementProps<T, WidenLiteralString<Value>>;
	};
```

</div>

## RemoteFormFieldType

<div class="ts-block">

```dts
type RemoteFormFieldType<T> = {
	[K in keyof InputTypeMap]: T extends InputTypeMap[K]
		? K
		: never;
}[keyof InputTypeMap];
```

</div>

## RemoteFormFieldValue

<div class="ts-block">

```dts
type RemoteFormFieldValue =
	| string
	| string[]
	| number
	| boolean
	| File
	| File[]
	| ImageInputValue;
```

</div>

## RemoteFormFields

프록시로 접근할 수 있는 폼 필드 구조를 만드는 재귀 타입

<div class="ts-block">

```dts
type RemoteFormFields<T> =
	WillRecurseIndefinitely<T> extends true
		? RecursiveFormFields
		: NonNullable<T> extends
					| string
					| number
					| boolean
					| File
			? RemoteFormField<NonNullable<T>>
			: IsImageInputValue<NonNullable<T>> extends true
				? RemoteFormField<
						NonNullable<T> & ImageInputValue
					> &
						Pick<
							RemoteFormFieldContainer<T>,
							'allIssues'
						> & {
							[K in KeysOfUnion<T>]-?: RemoteFormFields<
								ValueOfUnionKey<T, K>
							>;
						}
				: // [NonNullable<T>] is used to prevent distributing over union while still allowing
					// nullable wrappers (e.g. `string[] | undefined` from a schema with `.default([])`)
					// to be treated as arrays; only the last condition should distribute over unions
					[NonNullable<T>] extends [string[] | File[]]
					? RemoteFormField<NonNullable<T>> & {
							[K in number]: RemoteFormField<
								NonNullable<T>[number]
							>;
						}
					: [NonNullable<T>] extends [Array<infer U>]
						? RemoteFormFieldContainer<NonNullable<T>> & {
								[K in number]: RemoteFormFields<U>;
							}
						: RemoteFormFieldContainer<T> & {
								[K in KeysOfUnion<T>]-?: RemoteFormFields<
									ValueOfUnionKey<T, K>
								>;
							};
```

</div>

## RemoteFormInput

<div class="ts-block">

```dts
interface RemoteFormInput {/*…*/}
```

<div class="ts-block-property">

```dts
[key: string]: MaybeArray<string | number | boolean | File | RemoteFormInput> | undefined;
```

<div class="ts-block-property-details"></div>
</div></div>

## RemoteFormInvalidField

폼 핸들러 안에서 검증 에러를 명령형으로 만드는 데 쓰는 함수이자 프록시 객체입니다.

속성에 접근하면 특정 필드에 대한 이슈를 만들 수 있습니다: `issue.fieldName('message')`.
타입 구조는 입력 데이터 구조를 그대로 따르므로 타입 안전하게 필드에 접근할 수 있습니다.
`invalid(issue.foo(...), issue.nested.bar(...))`를 호출하면 검증 에러를 던집니다.

<div class="ts-block">

```dts
type RemoteFormInvalidField<T> =
	WillRecurseIndefinitely<T> extends true
		? Record<string | number, any>
		: NonNullable<T> extends
					| string
					| number
					| boolean
					| File
			? (message: string) => StandardSchemaV1.Issue
			: NonNullable<T> extends Array<infer U>
				? {
						[K in number]: RemoteFormInvalidField<U>;
					} & ((message: string) => StandardSchemaV1.Issue)
				: NonNullable<T> extends RemoteFormInput
					? {
							[K in keyof T]-?: RemoteFormInvalidField<
								T[K]
							>;
						} & ((
							message: string
						) => StandardSchemaV1.Issue)
					: Record<string, never>;
```

</div>

## RemoteFormIssue

<div class="ts-block">

```dts
interface RemoteFormIssue {/*…*/}
```

<div class="ts-block-property">

```dts
message: string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
path: Array<string | number>;
```

<div class="ts-block-property-details"></div>
</div></div>

## RemoteLiveQuery

<div class="ts-block">

```dts
type RemoteLiveQuery<T> = RemoteResource<T> &
	AsyncIterable<T> & {
		/** `true` if the live stream is currently connected. */
		readonly connected: boolean;
		/** `true` once the current live stream iterator is done. */
		readonly done: boolean;
		/** Reconnects the live stream immediately. */
		reconnect(): Promise<void>;
	};
```

</div>

## RemoteLiveQueryFunction

원격 `query.live` 함수의 타입입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#query.live)를 참고하세요.

선택적 제네릭 매개변수 `Validated`는 쿼리의 스키마가 인수를 검증하고 (선택적으로) 변환한
*뒤의* 인수 타입을 나타내며, [`requested`](/docs/kit/$app-server#requested)가
yield하는 타입과 일치합니다.

<div class="ts-block">

```dts
type RemoteLiveQueryFunction<
	Input,
	Output,
	_Validated = Input
> = (
	arg: undefined extends Input ? Input | void : Input
) => RemoteLiveQuery<Output>;
```

</div>

## RemoteLiveQueryRequestedEntry

`query.live`와 함께 호출했을 때 [`requested`](/docs/kit/$app-server#requested)가
yield하는 단일 항목입니다. `arg`는 검증된 인수이고, `query`는 클라이언트의 원래 캐시 키에 연결된
`RemoteLiveQuery`이므로 `reconnect()`가 올바른 클라이언트 구독을
대상으로 합니다.

<div class="ts-block">

```dts
type RemoteLiveQueryRequestedEntry<Validated, Output> = {
	arg: Validated;
	query: RemoteLiveQuery<Output>;
	/** Explicitly ignore this requested update. */
	ignore: () => void;
};
```

</div>

## RemoteLiveQueryRequestedResult

<div class="ts-block">

```dts
type RemoteLiveQueryRequestedResult<Validated, Output> =
	Iterable<
		RemoteLiveQueryRequestedEntry<Validated, Output>
	> &
		AsyncIterable<
			RemoteLiveQueryRequestedEntry<Validated, Output>
		> & {
			/**
			 * Call `reconnect` on all live queries selected by this `requested` invocation.
			 * This is identical to:
			 * ```ts
			 * import { requested } from '$app/server';
			 *
			 * for await (const { query } of requested(liveQuery, ...)) {
			 *   void query.reconnect();
			 * }
			 * ```
			 */
			reconnectAll: () => Promise<void>;
			/** Explicitly ignore all updates selected by this `requested` invocation. */
			ignoreAll: () => Promise<void>;
		};
```

</div>

## RemotePrerenderFunction

원격 `prerender` 함수의 타입입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#prerender)를 참고하세요.

<div class="ts-block">

```dts
type RemotePrerenderFunction<Input, Output> = (
	arg: undefined extends Input ? Input | void : Input
) => RemoteResource<Output>;
```

</div>

## RemoteQuery

<div class="ts-block">

```dts
type RemoteQuery<T> = RemoteResource<T> & {
	/**
	 * On the client, this function will update the value of the query without re-fetching it.
	 *
	 * On the server, this can be called in the context of a `command` or `form` and the specified data will accompany the action response back to the client.
	 * This prevents SvelteKit needing to refresh all queries on the page in a second server round-trip.
	 */
	set(value: T): void;
	/**
	 * On the client, this function will re-fetch the query from the server.
	 *
	 * On the server, this can be called in the context of a `command` or `form` and the refreshed data will accompany the action response back to the client.
	 * This prevents SvelteKit needing to refresh all queries on the page in a second server round-trip.
	 */
	refresh(): Promise<void>;
	/**
	 * Temporarily override a query's value during a [single-flight mutation](https://svelte.dev/docs/kit/remote-functions#Single-flight-mutations) to provide optimistic updates.
	 *
	 * ```svelte
	 * <script>
	 *   import { getTodos, addTodo } from './todos.remote.js';
	 *   const todos = getTodos();
	 * </script>
	 *
	 * <form {...addTodo.enhance(async (form) => {
	 *   await form.submit().updates(
	 *     todos.withOverride((todos) => [...todos, { text: form.fields.text.value() }])
	 *   );
	 * })}>
	 *   <input type="text" name="text" />
	 *   <button type="submit">Add Todo</button>
	 * </form>
	 * ```
	 */
	withOverride(
		update: (current: T) => T
	): RemoteQueryOverride;
};
```

</div>

## RemoteQueryFunction

원격 `query` 함수의 반환값입니다. 전체 문서는 [원격 함수](/docs/kit/remote-functions#query)를 참고하세요.

선택적 제네릭 매개변수 `Validated`는 쿼리의 스키마가 인수를 검증하고 (선택적으로) 변환한
*뒤의* 인수 타입을 나타냅니다.
이는 서버에서 쿼리의 구현 함수가 받는 타입이자,
[`requested`](/docs/kit/$app-server#requested)가 yield하는 타입입니다.
[Standard Schema](https://standardschema.dev/)로 선언한 쿼리라면
스키마에 변환이 포함될 때 `Input`과 달라집니다(예: `v.pipe(v.number(), v.transform(String))`은
`Input = number`이지만 `Validated = string`입니다). `'unchecked'` 검증기를 쓰거나
인수가 없는 쿼리에서는 기본값이 `Input`입니다.

<div class="ts-block">

```dts
type RemoteQueryFunction<
	Input,
	Output,
	_Validated = Input
> = (
	arg: undefined extends Input ? Input | void : Input
) => RemoteQuery<Output>;
```

</div>

## RemoteQueryOverride

<div class="ts-block">

```dts
type RemoteQueryOverride = () => void;
```

</div>

## RemoteQueryRequestedResult

<div class="ts-block">

```dts
type RemoteQueryRequestedResult<Validated, Output> =
	Iterable<RequestedEntry<Validated, Output>> &
		AsyncIterable<RequestedEntry<Validated, Output>> & {
			/**
			 * Call `refresh` on all queries selected by this `requested` invocation.
			 * This is identical to:
			 * ```ts
			 * import { requested } from '$app/server';
			 *
			 * for await (const { query } of requested(getPost, ...)) {
			 *   void query.refresh();
			 * }
			 * ```
			 */
			refreshAll: () => Promise<void>;
			/** Explicitly ignore all updates selected by this `requested` invocation. */
			ignoreAll: () => Promise<void>;
		};
```

</div>

## RemoteQueryUpdate

<div class="ts-block">

```dts
type RemoteQueryUpdate =
	| RemoteQuery<any>
	| RemoteLiveQuery<any>
	| RemoteQueryFunction<any, any>
	| RemoteLiveQueryFunction<any, any>
	| RemoteQueryOverride;
```

</div>

## RemoteResource

<div class="ts-block">

```dts
type RemoteResource<T> = Promise<T> & {
	/** The error in case the query fails. */
	get error(): App.Error | undefined;
	/** `true` before the first result is available and during refreshes */
	get loading(): boolean;
} & (
		| {
				/** The current value of the query. Undefined until `ready` is `true` */
				get current(): undefined;
				ready: false;
		  }
		| {
				/** The current value of the query. Undefined until `ready` is `true` */
				get current(): T;
				ready: true;
		  }
	);
```

</div>

## RequestedEntry

일반 `query`와 함께 호출했을 때 [`requested`](/docs/kit/$app-server#requested)가
yield하는 단일 항목입니다. `arg`는 검증된 인수(해당하는 경우 쿼리의 스키마가 검증하고 변환한
*뒤의* 입력)이고, `query`는 클라이언트의 원래 캐시 키에 연결된
`RemoteQuery`이므로 `refresh()` / `set()`이 올바른 클라이언트 항목을
업데이트합니다.

<div class="ts-block">

```dts
type RequestedEntry<Validated, Output> = {
	arg: Validated;
	query: RemoteQuery<Output>;
	/** Explicitly ignore this requested update. */
	ignore: () => void;
};
```

</div>

## RequestedResult

<div class="ts-block">

```dts
type RequestedResult<Validated, Output> =
	| RemoteQueryRequestedResult<Validated, Output>
	| RemoteLiveQueryRequestedResult<Validated, Output>;
```

</div>

## query

<div class="ts-block">

```dts
namespace query {
	/**
	 * Creates a batch query function that collects multiple calls and executes them in a single request
	 *
	 * See [Remote functions](https://svelte.dev/docs/kit/remote-functions#query.batch) for full documentation.
	 *
	 * @since 2.35
	 */
	function batch<Input, Output>(
		validate: 'unchecked',
		fn: (
			args: Input[]
		) => MaybePromise<(arg: Input, idx: number) => Output>
	): RemoteQueryFunction<Input, Output>;
	/**
	 * Creates a batch query function that collects multiple calls and executes them in a single request
	 *
	 * See [Remote functions](https://svelte.dev/docs/kit/remote-functions#query.batch) for full documentation.
	 *
	 * @since 2.35
	 */
	function batch<Schema extends StandardSchemaV1, Output>(
		schema: Schema,
		fn: (
			args: StandardSchemaV1.InferOutput<Schema>[]
		) => MaybePromise<
			(
				arg: StandardSchemaV1.InferOutput<Schema>,
				idx: number
			) => Output
		>
	): RemoteQueryFunction<
		StandardSchemaV1.InferInput<Schema>,
		Output,
		StandardSchemaV1.InferOutput<Schema>
	>;
	/**
	 * Creates a live remote query. When called from the browser, the function will be invoked on the server via a streaming `fetch` call.
	 *
	 * See [Remote functions](https://svelte.dev/docs/kit/remote-functions#query.live) for full documentation.
	 *
	 * */
	function live<Output>(
		fn: (
			arg: void
		) => RemoteLiveQueryUserFunctionReturnType<Output>
	): RemoteLiveQueryFunction<void, Output>;

	function live<Input, Output>(
		validate: 'unchecked',
		fn: (
			arg: Input
		) => RemoteLiveQueryUserFunctionReturnType<Output>
	): RemoteLiveQueryFunction<Input, Output>;

	function live<Schema extends StandardSchemaV1, Output>(
		schema: Schema,
		fn: (
			arg: StandardSchemaV1.InferOutput<Schema>
		) => RemoteLiveQueryUserFunctionReturnType<Output>
	): RemoteLiveQueryFunction<
		StandardSchemaV1.InferInput<Schema>,
		Output,
		StandardSchemaV1.InferOutput<Schema>
	>;
}
```

</div>


