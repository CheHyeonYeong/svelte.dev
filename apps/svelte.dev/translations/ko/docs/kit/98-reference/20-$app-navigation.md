---
title: $app/navigation
tags: invalidation, preloading
---



```js
// @noErrors
import {
	afterNavigate,
	beforeNavigate,
	disableScrollHandling,
	goto,
	invalidate,
	invalidateAll,
	onNavigate,
	preloadCode,
	preloadData,
	pushState,
	refreshAll,
	replaceState,
	snapshot
} from '$app/navigation';
```

## afterNavigate

현재 컴포넌트가 마운트될 때, 그리고 어떤 URL로 이동할 때마다 전달받은 `callback`을 실행하는 생명주기 함수입니다.

`afterNavigate`는 컴포넌트 초기화 중에 호출해야 합니다. 컴포넌트가 마운트되어 있는 동안 계속 활성 상태를 유지합니다.

<div class="ts-block">

```dts
function afterNavigate(
	callback: (navigation: AfterNavigate) => void
): void;
```

</div>



## beforeNavigate

링크를 클릭하든, `goto(...)`를 호출하든, 브라우저의 뒤로/앞으로 버튼을 사용하든, 어떤 URL로 이동하기 전에 실행되는 내비게이션 인터셉터입니다.

`cancel()`을 호출하면 내비게이션이 완료되지 않도록 막습니다. `navigation.type === 'leave'`인 경우 — 즉 사용자가 앱을 떠나는(또는 탭을 닫는) 경우 — `cancel`을 호출하면 브라우저 고유의 페이지 이탈 확인 대화상자가 뜹니다. 이 경우 내비게이션이 취소될지는 사용자의 응답에 따라 달라집니다.

내비게이션 대상이 SvelteKit이 관리하는 라우트가 아니라면(따라서 SvelteKit의 클라이언트 사이드 라우터가 제어하지 않는다면) `navigation.to.route.id`는 `null`이 됩니다.

내비게이션이 (취소되지 않을 경우) 문서를 언로드하게 된다면 — 다시 말해 `'leave'` 내비게이션이거나 `navigation.to.route === null`인 `'link'` 내비게이션이라면 — `navigation.willUnload`는 `true`입니다.

`beforeNavigate`는 컴포넌트 초기화 중에 호출해야 합니다. 컴포넌트가 마운트되어 있는 동안 계속 활성 상태를 유지합니다.

<div class="ts-block">

```dts
function beforeNavigate(
	callback: (navigation: BeforeNavigate) => void
): void;
```

</div>



## disableScrollHandling

내비게이션에 따라 페이지가 업데이트되는 중에(예를 들어 `onMount`, `afterNavigate`, 액션 안에서) 호출하면 SvelteKit에 내장된 스크롤 처리를 비활성화합니다.
사용자의 기대를 깨뜨리기 때문에 일반적으로 권장하지 않습니다.

<div class="ts-block">

```dts
function disableScrollHandling(): void;
```

</div>



## goto

주어진 라우트로 코드를 통해 이동할 수 있게 해 주며, 스크롤과 포커스를 (일반적인 내비게이션처럼) 초기화할지
아니면 유지할지 같은 세부 사항을 제어할 수 있습니다.

SvelteKit이 이동을 마치거나(이동에 실패하면 프로미스가 reject됩니다) 상태 변경이 적용되면 resolve되는 프로미스(Promise)를 반환합니다.

`goto`는 앱에 속한 라우트로 이동하기 위한 것이며, 라우트를 해석할 수 없으면 reject됩니다.
외부 URL이라면 `goto(url)`을 호출하는 대신 `window.location = url`을 사용해 전체 페이지 내비게이션을 수행하세요.

<div class="ts-block">

```dts
function goto(
	url: string | URL,
	opts?: GotoOptions
): Promise<void>;
```

</div>



## invalidate

현재 활성화된 페이지에 속한 `load` 함수 중 `fetch`나 `depends`를 통해 해당 `url`에 의존하는 함수를 다시 실행합니다. 이후 페이지가 업데이트되면 resolve되는 `Promise`를 반환합니다.

인수를 `string`이나 `URL`로 전달하는 경우, `fetch`나 `depends`에 전달한 URL과 (쿼리 매개변수까지 포함해) 같은 URL로 해석되어야 합니다.
사용자 정의 식별자를 만들려면 `[a-z]+:`로 시작하는 문자열(예: `custom:state`)을 사용하세요. 이는 유효한 URL입니다.

`function` 인수로는 사용자 정의 조건 함수를 정의할 수 있습니다. 이 함수는 전체 `URL`을 받으며, `true`를 반환하면 `load`를 다시 실행합니다.
정확히 일치하는 URL 대신 패턴을 기준으로 무효화하고 싶을 때 유용합니다.

```ts
// Example: Match '/path' regardless of the query parameters
import { invalidate } from '$app/navigation';

invalidate((url) => url.pathname === '/path');
```

<div class="ts-block">

```dts
function invalidate(
	resource: string | URL | ((url: URL) => boolean),
	keepState?: boolean
): Promise<void>;
```

</div>



## invalidateAll

<blockquote class="tag deprecated note">

대신 [`refreshAll`](/docs/kit/$app-navigation#refreshAll)을 사용하세요. `invalidateAll`과 달리 `refreshAll`은 `page.state`를 초기화하지 않습니다.

</blockquote>

현재 활성화된 페이지에 속한 모든 `load` 함수와 `query` 함수를 다시 실행합니다. 이후 페이지가 업데이트되면 resolve되는 `Promise`를 반환합니다.

이 함수는 `page.state`를 빈 객체로 초기화한다는 점에 유의하세요. `page.state`를 유지하고 싶다면(예를 들어 [얕은 라우팅](/docs/kit/shallow-routing)을 사용할 때) 대신 `refreshAll`을 사용하세요.

<div class="ts-block">

```dts
function invalidateAll(): Promise<void>;
```

</div>



## onNavigate

새 URL로 이동하기 직전에 전달받은 `callback`을 실행하는 생명주기 함수입니다. 전체 페이지 내비게이션에서는 실행되지 않습니다.

`Promise`를 반환하면 SvelteKit은 그 프로미스가 resolve될 때까지 기다린 뒤 내비게이션을 완료합니다. 이를 이용해 예를 들어 `document.startViewTransition`을 사용할 수 있습니다. 사용자에게는 내비게이션이 멈춘 것처럼 보이므로 resolve가 오래 걸리는 프로미스는 피하세요.

콜백이 함수(또는 함수로 resolve되는 `Promise`)를 반환하면, 그 함수는 DOM이 업데이트된 뒤에 호출됩니다.

`onNavigate`는 컴포넌트 초기화 중에 호출해야 합니다. 컴포넌트가 마운트되어 있는 동안 계속 활성 상태를 유지합니다.

<div class="ts-block">

```dts
function onNavigate(
	callback: (
		navigation: OnNavigate
	) => MaybePromise<(() => void) | void>
): void;
```

</div>



## preloadCode

아직 가져오지 않은 라우트의 코드를 코드로 직접 import합니다.
보통 이후의 내비게이션 속도를 높이기 위해 호출합니다.

`/about`이나 `/blog/[slug]` 같은 라우트 ID를 받습니다. 경로명(pathname)과 달리 라우트 ID에는
앱의 [기본 경로](/docs/kit/@sveltejs-kit-vite#paths)가 앞에 붙지 않습니다.
라우트 ID가 아닌 경로명을 가지고 있다면 `$app/paths`의
[`match`](/docs/kit/$app-paths#match)로 변환할 수 있습니다:

```js
// @errors: 7031
import { match } from '$app/paths';
import { preloadCode } from '$app/navigation';

const matched = await match('/blog/hello-world');
if (matched) await preloadCode(matched.id);
```

`preloadData`와 달리 `load` 함수는 호출하지 않습니다.
모듈을 모두 import하면 resolve되는 프로미스를 반환합니다.

<div class="ts-block">

```dts
function preloadCode(
	id: import('$app/types').RouteId
): Promise<void>;
```

</div>



## preloadData

주어진 페이지를 코드로 직접 프리로드합니다. 이는 다음을 뜻합니다.
 1. 해당 페이지의 코드가 로드되었는지 확인하고,
 2. 적절한 옵션으로 페이지의 load 함수를 호출합니다.

사용자가 `data-sveltekit-preload-data`가 있는 `<a>` 요소를 탭하거나 마우스를 올렸을 때 SvelteKit이 하는 동작과 같습니다.
다음 내비게이션 대상이 `href`라면 load가 반환한 값을 그대로 사용하므로 내비게이션이 즉시 이루어집니다.
프리로드가 완료되면 새 라우트의 `load` 함수를 실행한 결과로 resolve되는 프로미스를 반환합니다.

<div class="ts-block">

```dts
function preloadData(href: string): Promise<
	(
		| {
				type: 'loaded';
				data: Record<string, any>;
		  }
		| {
				type: 'redirect';
				location: string;
		  }
		| {
				type: 'error';
				error: App.Error;
		  }
	) & {
		status: number;
	}
>;
```

</div>



## pushState

<blockquote class="tag deprecated note">

대신 `goto(url, { state, shallow: true })`를 사용하세요.

</blockquote>

주어진 `page.state`로 새 히스토리 항목을 코드로 직접 만듭니다. [얕은 라우팅](/docs/kit/shallow-routing)에 사용합니다.

<div class="ts-block">

```dts
function pushState(
	url: string | URL,
	state: App.PageState
): Promise<void>;
```

</div>



## refreshAll

현재 활성화된 모든 원격 함수를 새로 고치고, 현재 활성화된 페이지에 속한 모든 `load` 함수를 다시 실행합니다.
이후 페이지가 업데이트되면 resolve되는 `Promise`를 반환합니다.

<div class="ts-block">

```dts
function refreshAll(): Promise<void>;
```

</div>



## replaceState

<blockquote class="tag deprecated note">

대신 `goto(url, { state, shallow: true, replace: true })`를 사용하세요.

</blockquote>

코드에서 직접 현재 히스토리 항목을 주어진 `page.state`로 교체합니다. [얕은 라우팅](/docs/kit/shallow-routing)에 사용합니다.

<div class="ts-block">

```dts
function replaceState(
	url: string | URL,
	state: App.PageState
): Promise<void>;
```

</div>



## snapshot

이동하기 전에 상태를 캡처해 두었다가 히스토리를 오갈 때 복원하는 생명주기 함수입니다.

기본적으로 스냅샷 `id`는 호출 위치를 바탕으로 생성됩니다. 배포가 바뀌어도 스냅샷을 안정적으로 유지하거나, 공유 헬퍼를 여러 곳에서 쓸 때 각각을 구분하려면 `id`를 명시적으로 전달하세요.

선택 사항인 `reset` 콜백은 새 히스토리 항목이 만들어질 때처럼 복원할 캡처 값이 없는 내비게이션에서 실행됩니다. 캡처한 값은 앱의 transport 훅으로 직렬화됩니다.

`snapshot`은 컴포넌트 초기화 중에 호출해야 합니다. 컴포넌트가 마운트되어 있는 동안 계속 활성 상태를 유지합니다.

<div class="ts-block">

```dts
function snapshot<T>(options: {
	id?: string;
	capture: () => T;
	restore: (value: T) => void;
	reset?: () => void;
}): void;
```

</div>



## AfterNavigate

[`afterNavigate`](/docs/kit/$app-navigation#afterNavigate) 콜백에 전달되는 인수입니다.

<div class="ts-block">

```dts
type AfterNavigate = (Navigation | NavigationEnter) & {
	type: Exclude<NavigationType, 'leave'>;
	/**
	 * Since `afterNavigate` callbacks are called after a navigation completes, they will never be called with a navigation that unloads the page.
	 */
	willUnload: false;
};
```

</div>

## BeforeNavigate

[`beforeNavigate`](/docs/kit/$app-navigation#beforeNavigate) 콜백에 전달되는 인수입니다.

<div class="ts-block">

```dts
type BeforeNavigate = Navigation & {
	/**
	 * Call this to prevent the navigation from starting.
	 */
	cancel: () => void;
};
```

</div>

## GotoOptions

<div class="ts-block">

```dts
interface GotoOptions {/*…*/}
```

<div class="ts-block-property">

```dts
replace?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 새 히스토리 항목을 만드는 대신 현재 히스토리 항목을 교체합니다.

</div>
</div>

<div class="ts-block-property">

```dts
replaceState?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 대신 `replace`를 사용하세요.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
shallow?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 이동하지 않고 URL과 `page.state`만 업데이트합니다.

</div>
</div>

<div class="ts-block-property">

```dts
reset?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true, or false when `shallow` is true`

</div>

`true`이면 내비게이션이 완료된 뒤 스크롤 위치를 (페이지 맨 위로, URL에 `#hash`가 있으면
그와 일치하는 요소로) 초기화하고 포커스를 (`<body>`로, `autofocus` 요소가 있으면
그 요소로) 초기화합니다.

`false`이면 현재 스크롤 위치와 포커스된 요소를 그대로 둡니다.

</div>
</div>

<div class="ts-block-property">

```dts
refreshAll?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 페이지의 모든 `load` 함수와 쿼리를 다시 실행합니다.

</div>
</div>

<div class="ts-block-property">

```dts
invalidate?: Array<string | URL | ((url: URL) => boolean)>;
```

<div class="ts-block-property-details">

이 URL 중 하나에 의존하는 `load` 함수를 다시 실행합니다.

</div>
</div>

<div class="ts-block-property">

```dts
invalidateAll?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 대신 `refreshAll`을 사용하세요.

</div>

</div>
</div>

<div class="ts-block-property">

```dts
state?: App.PageState;
```

<div class="ts-block-property-details">

`page.state`로 사용할 수 있게 될 선택적 객체입니다.

</div>
</div>

<div class="ts-block-property">

```dts
persistState?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 페이지를 완전히 새로 고친 뒤에도 `page.state`가 복원됩니다.

</div>
</div></div>

## Navigation

<div class="ts-block">

```dts
type Navigation =
	| NavigationExternal
	| NavigationFormSubmit
	| NavigationPopState
	| NavigationLink;
```

</div>

## NavigationBase

<div class="ts-block">

```dts
interface NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: NavigationType;
```

<div class="ts-block-property-details">

내비게이션의 종류입니다:
- `enter`: 앱이 하이드레이트되었거나 시작되었습니다
- `form`: 사용자가 `<form method="GET">`을 제출했습니다
- `goto`: `goto(...)` 호출이나 리디렉션으로 내비게이션이 일어났습니다
- `leave`: 탭이 닫히거나 다른 문서로 이동하고 있어서 앱을 떠나는 중입니다
- `link`: 링크 클릭으로 내비게이션이 일어났습니다
- `popstate`: 뒤로/앞으로 이동으로 내비게이션이 일어났습니다

</div>
</div>

<div class="ts-block-property">

```dts
shallow: boolean;
```

<div class="ts-block-property-details">

얕은 내비게이션인지 여부입니다.

</div>
</div>

<div class="ts-block-property">

```dts
from: NavigationTarget | null;
```

<div class="ts-block-property-details">

내비게이션이 시작된 곳

</div>
</div>

<div class="ts-block-property">

```dts
to: NavigationTarget | null;
```

<div class="ts-block-property-details">

내비게이션이 향하는 곳/도착한 곳

</div>
</div>

<div class="ts-block-property">

```dts
willUnload: boolean;
```

<div class="ts-block-property-details">

내비게이션으로 인해 페이지가 언로드되는지 여부입니다(즉, 클라이언트 사이드 내비게이션이 아닌 경우).

</div>
</div>

<div class="ts-block-property">

```dts
complete: Promise<void>;
```

<div class="ts-block-property-details">

내비게이션이 완료되면 resolve되고, 내비게이션이 실패하거나 중단되면
reject되는 프로미스입니다. `willUnload` 내비게이션인 경우 이 프로미스는 절대 resolve되지 않습니다

</div>
</div></div>

## NavigationEnter

앱이 시작되거나 하이드레이트될 때 일어나는 내비게이션

<div class="ts-block">

```dts
interface NavigationEnter extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'enter';
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
from: null;
```

<div class="ts-block-property-details">

앱이 막 시작되었으므로 이동해 온 이전 페이지가 없습니다

</div>
</div>

<div class="ts-block-property">

```dts
delta?: undefined;
```

<div class="ts-block-property-details">

히스토리 뒤로/앞으로 내비게이션인 경우, 뒤로/앞으로 이동할 단계 수

</div>
</div>

<div class="ts-block-property">

```dts
event?: undefined;
```

<div class="ts-block-property-details">

`popstate`나 `link`로 내비게이션이 일어났을 때 발생한 `Event` 객체입니다.

</div>
</div></div>

## NavigationExternal

<div class="ts-block">

```dts
type NavigationExternal = NavigationGoto | NavigationLeave;
```

</div>

## NavigationFormSubmit

`<form method="GET">`으로 일어난 내비게이션

<div class="ts-block">

```dts
interface NavigationFormSubmit extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'form';
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
event: SubmitEvent;
```

<div class="ts-block-property-details">

내비게이션을 일으킨 `SubmitEvent`

</div>
</div></div>

## NavigationGoto

`goto(...)` 호출이나 리디렉션으로 일어난 내비게이션

<div class="ts-block">

```dts
interface NavigationGoto extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'goto';
```

<div class="ts-block-property-details"></div>
</div></div>

## NavigationLeave

탭이 닫히거나 사용자가 다른 문서로 이동해서 일어난 내비게이션

<div class="ts-block">

```dts
interface NavigationLeave extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'leave';
```

<div class="ts-block-property-details"></div>
</div></div>

## NavigationLink

링크 클릭으로 일어난 내비게이션

<div class="ts-block">

```dts
interface NavigationLink extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'link';
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
event: PointerEvent;
```

<div class="ts-block-property-details">

내비게이션을 일으킨 `PointerEvent`

</div>
</div></div>

## NavigationPopState

뒤로/앞으로 이동으로 일어난 내비게이션

<div class="ts-block">

```dts
interface NavigationPopState extends NavigationBase {/*…*/}
```

<div class="ts-block-property">

```dts
type: 'popstate';
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
delta: number;
```

<div class="ts-block-property-details">

히스토리 뒤로/앞으로 내비게이션인 경우, 뒤로/앞으로 이동할 단계 수

</div>
</div>

<div class="ts-block-property">

```dts
event: PopStateEvent;
```

<div class="ts-block-property-details">

내비게이션을 일으킨 `PopStateEvent`

</div>
</div></div>

## NavigationTarget

특정 내비게이션의 대상에 대한 정보입니다.

<div class="ts-block">

```dts
interface NavigationTarget<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null
> {/*…*/}
```

<div class="ts-block-property">

```dts
params: Params | null;
```

<div class="ts-block-property-details">

대상 페이지의 매개변수입니다. 예를 들어 `/blog/[slug]` 같은 라우트라면 `{ slug: string }` 객체입니다.
대상이 SvelteKit 앱에 속하지 않으면(라우트로 해석할 수 없으면) `null`입니다.

</div>
</div>

<div class="ts-block-property">

```dts
route: {/*…*/};
```

<div class="ts-block-property-details">

대상 라우트에 대한 정보

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
id: RouteId | null;
```

<div class="ts-block-property-details">

현재 라우트의 ID입니다. 예를 들어 `src/routes/blog/[slug]`라면 `/blog/[slug]`가 됩니다. 일치하는 라우트가 없으면 `null`입니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
url: URL;
```

<div class="ts-block-property-details">

이동하는 대상 URL

</div>
</div>

<div class="ts-block-property">

```dts
scroll: { x: number; y: number } | null;
```

<div class="ts-block-property-details">

이 내비게이션과 연관된 스크롤 위치입니다.

`from` 대상에서는 내비게이션이 일어난 시점의 스크롤 위치입니다.

`to` 대상에서는 복원될(또는 복원된) 스크롤 위치를 나타냅니다:
- `beforeNavigate`와 `onNavigate`에서는 `popstate` 내비게이션(뒤로/앞으로 버튼)에서만 사용할 수 있으며,
	다른 종류의 내비게이션에서는 최종 스크롤 위치를 미리 알 수 없으므로
	`null`입니다.
- `afterNavigate`에서는 항상 내비게이션이 완료된 뒤 적용된
	스크롤 위치입니다.

</div>
</div></div>

## NavigationType

- `enter`: 앱이 하이드레이트되었거나 시작되었습니다
- `form`: 사용자가 `<form method="GET">`을 제출했습니다
- `goto`: `goto(...)` 호출이나 리디렉션으로 내비게이션이 일어났습니다
- `leave`: 탭이 닫히거나 다른 문서로 이동하고 있어서 앱을 떠나는 중입니다
- `link`: 링크 클릭으로 내비게이션이 일어났습니다
- `popstate`: 뒤로/앞으로 이동으로 내비게이션이 일어났습니다

<div class="ts-block">

```dts
type NavigationType =
	| 'enter'
	| 'form'
	| 'leave'
	| 'link'
	| 'goto'
	| 'popstate';
```

</div>

## OnNavigate

[`onNavigate`](/docs/kit/$app-navigation#onNavigate) 콜백에 전달되는 인수입니다.

<div class="ts-block">

```dts
type OnNavigate = Navigation & {
	type: Exclude<NavigationType, 'enter' | 'leave'>;
	/**
	 * Since `onNavigate` callbacks are called immediately before a client-side navigation, they will never be called with a navigation that unloads the page.
	 */
	willUnload: false;
};
```

</div>


