---
title: 타입
---

## 생성된 타입 <!-- Generated types -->

`RequestHandler`와 `Load` 타입은 모두 `Params` 인자를 받으므로 `params` 객체에 타입을 지정할 수 있습니다. 예를 들어 이 엔드포인트는 `foo`, `bar`, `baz` 매개변수를 기대합니다:

```js
/// file: src/routes/[foo]/[bar]/[baz]/+server.js
// @errors: 2355 2322 1360
/**
 * @type {import('@sveltejs/kit').RequestHandler<{
 *   foo: string;
 *   bar: string;
 *   baz: string
 * }>}
 */
export async function GET({ params }) {
	// ...
}
```

말할 것도 없이 이렇게 일일이 작성하는 것은 번거롭고 이식성도 떨어집니다(`[foo]` 디렉터리 이름을 `[qux]`로 바꾸면 타입이 더 이상 실제와 맞지 않게 됩니다).

이 문제를 해결하기 위해 SvelteKit은 각 엔드포인트와 페이지마다 `.d.ts` 파일을 생성합니다:

```ts
/// file: .svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts
/// link: true
import type * as Kit from '@sveltejs/kit';

type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
};

export type RequestHandler = Kit.RequestHandler<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
```

TypeScript 설정의 [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs) 옵션 덕분에, 이 파일들을 엔드포인트와 페이지에서 같은 디렉터리에 있는 파일처럼 import할 수 있습니다:

```js
/// file: src/routes/[foo]/[bar]/[baz]/+server.js
// @filename: $types.d.ts
import type * as Kit from '@sveltejs/kit';

type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
}

export type RequestHandler = Kit.RequestHandler<RouteParams>;

// @filename: index.js
// @errors: 2355 2322
// ---cut---
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	// ...
}
```

```js
/// file: src/routes/[foo]/[bar]/[baz]/+page.js
// @filename: $types.d.ts
import type * as Kit from '@sveltejs/kit';

type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
}

export type PageLoad = Kit.Load<RouteParams>;

// @filename: index.js
// @errors: 2355
// ---cut---
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	// ...
}
```

그러면 `load` 함수의 반환 타입은 `$types` 모듈을 통해 각각 `PageData`와 `LayoutData`로 사용할 수 있고, 모든 `Actions` 반환값의 유니언은 `ActionData`로 사용할 수 있습니다.

버전 2.16.0부터는 두 가지 헬퍼 타입이 추가로 제공됩니다. `PageProps`는 `data: PageData`와 함께, 액션이 정의되어 있으면 `form: ActionData`도 정의합니다. `LayoutProps`는 `data: LayoutData`와 `children: Snippet`을 정의합니다.

```svelte
<!--- file: src/routes/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

> [!LEGACY]
> 2.16.0 이전:
> ```svelte
> <!--- file: src/routes/+page.svelte --->
> <script>
> 	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
> 	let { data, form } = $props();
> </script>
> ```
>
> Svelte 4를 사용하는 경우:
> ```svelte
> <!--- file: src/routes/+page.svelte --->
> <script>
>   /** @type {import('./$types').PageData} */
>   export let data;
>   /** @type {import('./$types').ActionData} */
>   export let form;
> </script>
> ```

> [!NOTE] 이것이 동작하려면 여러분의 `tsconfig.json`이나 `jsconfig.json`이 생성된 `$app/types`를 확장해야 합니다:
>
> `{ "extends": "$app/tsconfig" }`

## app.d.ts

`app.d.ts` 파일에는 앱의 앰비언트(ambient) 타입, 즉 명시적으로 import하지 않아도 사용할 수 있는 타입을 둡니다.

이 파일에는 항상 `App` 네임스페이스가 들어 있습니다. 이 네임스페이스에는 여러분이 다루는 몇몇 SvelteKit 기능의 형태에 영향을 주는 여러 타입이 있습니다.

`App` 네임스페이스를 선언하면 앱 안의 객체에 어떤 타입을 지정할지 SvelteKit에 알려 줄 수 있습니다. 기본적으로 새 프로젝트에는 다음 내용이 담긴 `src/app.d.ts` 파일이 있습니다:

```ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```

`export {}` 줄이 있는 이유는, 이 줄이 없으면 파일이 _앰비언트 모듈_로 취급되어 `import` 선언을 추가할 수 없게 되기 때문입니다.
앰비언트 `declare module` 선언을 추가해야 한다면 `src/ambient.d.ts` 같은 별도 파일에 작성하세요.

이 인터페이스들을 채우면 `event.locals`, `event.platform`, 그리고 `load` 함수의 `data`를 사용할 때 타입 안전성을 얻을 수 있습니다.

## Error

예상된 에러와 예상치 못한 에러의 공통 형태를 정의합니다. 예상된 에러는 `error` 함수로 던집니다. 모든 에러는 `handleError` 훅을 거치며, 이 훅은 이 형태를 반환해야 합니다(`status`와 `message`는 생략하면 잡힌 에러의 값이 기본값으로 쓰이므로 선택 사항입니다).

<div class="ts-block">

```dts
interface Error {/*…*/}
```

<div class="ts-block-property">

```dts
status: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
message: string;
```

<div class="ts-block-property-details"></div>
</div></div>

## Locals

`event.locals`를 정의하는 인터페이스입니다. `event.locals`는 서버 [훅](/docs/kit/hooks)(`handle`, `handleError`), 서버 전용 `load` 함수, `+server.js` 파일에서 접근할 수 있습니다.

<div class="ts-block">

```dts
interface Locals {}
```

</div>

## PageData

[page.data 상태](/docs/kit/$app-state#page), 즉 모든 페이지가 공유하는 데이터의 공통 형태를 정의합니다.
`./$types`의 `Load`와 `ServerLoad` 함수 타입도 이에 맞게 좁혀집니다.
특정 페이지에만 있는 데이터에는 선택적 속성을 사용하세요. 인덱스 시그니처(`[key: string]: any`)는 추가하지 마세요.

<div class="ts-block">

```dts
interface PageData {}
```

</div>

## PageState

`page.state` 객체의 형태입니다. 이 객체는 [`goto`](/docs/kit/$app-navigation#goto)로 조작할 수 있습니다.

<div class="ts-block">

```dts
interface PageState {}
```

</div>

## Platform

어댑터가 `event.platform`을 통해 [플랫폼별 컨텍스트](/docs/kit/adapters#Platform-specific-context)를 제공한다면 여기에서 지정할 수 있습니다.

<div class="ts-block">

```dts
interface Platform {}
```

</div>


