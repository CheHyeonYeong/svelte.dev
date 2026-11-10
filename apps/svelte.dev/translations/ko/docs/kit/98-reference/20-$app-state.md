---
title: $app/state
tags: app-state
---

SvelteKit은 `$app/state` 모듈을 통해 읽기 전용 상태 객체 세 가지 — `page`, `navigating`, `updated` — 를 제공합니다.



```js
// @noErrors
import { navigating, page, updated } from '$app/state';
```

## navigating

진행 중인 내비게이션을 나타내는 읽기 전용 객체로, `from`, `to`, `type` 및 (`type === 'popstate'`인 경우) `delta` 속성을 가집니다.
진행 중인 내비게이션이 없거나 서버에서 렌더링하는 동안에는 값이 `null`입니다.

<div class="ts-block">

```dts
const navigating:
	| Navigation
	| {
			from: null;
			to: null;
			type: null;
			willUnload: null;
			delta: null;
			complete: null;
	  };
```

</div>



## page

현재 페이지에 대한 정보를 담은 읽기 전용 반응형 객체로, 다음과 같은 용도로 쓰입니다:
- 컴포넌트 트리 어디에서든 모든 페이지/레이아웃의 `data`를 합친 값 가져오기([데이터 불러오기](/docs/kit/load)도 참고하세요)
- 컴포넌트 트리 어디에서든 `form` prop의 현재 값 가져오기([폼 액션](/docs/kit/form-actions)도 참고하세요)
- `goto`로 설정한 페이지 상태 가져오기([goto](/docs/kit/$app-navigation#goto)와 [얕은 라우팅](/docs/kit/shallow-routing)도 참고하세요)
- 현재 URL, 현재 라우트와 그 매개변수, 얕은 내비게이션의 대상, 에러 발생 여부 같은 메타데이터 가져오기

```svelte
<!--- file: +layout.svelte --->
<script>
	import { page } from '$app/state';
</script>

<p>Currently at {page.url.pathname}</p>

{#if page.error}
	<span class="red">Problem detected</span>
{:else}
	<span class="small">All systems operational</span>
{/if}
```

`page`의 변경 사항은 룬에서만 반영됩니다. (레거시 반응성 문법에서는 변경 사항이 반영되지 않습니다)

```svelte
<!--- file: +page.svelte --->
<script>
	import { page } from '$app/state';
	const id = $derived(page.params.id); // This will correctly update id for usage on this page
	$: badId = page.params.id; // Do not use; will never update after initial load
</script>
```

서버에서는 렌더링 중에만 값을 읽을 수 있습니다(다시 말해 `load` 함수 같은 곳에서는 읽을 수 _없습니다_). 브라우저에서는 언제든 값을 읽을 수 있습니다.

<div class="ts-block">

```dts
const page: Page;
```

</div>



## updated

초깃값이 `false`인 읽기 전용 반응형 값입니다. SvelteKit은 데이터, 원격 함수, 폼 액션 응답을 받을 때(`x-sveltekit-version` 헤더를 통해), 탭이 다시 포커스를 얻거나 화면에 보이게 될 때, 그리고 일정한 폴링 간격마다([`version.pollInterval`](/docs/kit/@sveltejs-kit-vite#version) 참고) 새 버전이 있는지 확인합니다. 새 버전이 감지되면 `updated.current`가 `true`로 설정됩니다. `updated.check()`를 호출하면 폴링과 관계없이 즉시 확인합니다.

<div class="ts-block">

```dts
const updated: {
	get current(): boolean;
	check(): Promise<boolean>;
};
```

</div>



## Page

[`page`](/docs/kit/$app-state#page) 반응형 객체의 형태입니다.

<div class="ts-block">

```dts
interface Page<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null
> {/*…*/}
```

<div class="ts-block-property">

```dts
url: ReadonlyURL & { readonly pathname: ResolvedPathname | (string & {}) };
```

<div class="ts-block-property-details">

현재 페이지의 URL입니다.

</div>
</div>

<div class="ts-block-property">

```dts
params: Params;
```

<div class="ts-block-property-details">

현재 페이지의 매개변수입니다. 예를 들어 `/blog/[slug]` 같은 라우트라면 `{ slug: string }` 객체입니다.

</div>
</div>

<div class="ts-block-property">

```dts
route: {/*…*/};
```

<div class="ts-block-property-details">

현재 라우트에 대한 정보입니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
id: RouteId;
```

<div class="ts-block-property-details">

현재 라우트의 ID입니다. 예를 들어 `src/routes/blog/[slug]`라면 `/blog/[slug]`가 됩니다. 일치하는 라우트가 없으면 `null`입니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
status: number;
```

<div class="ts-block-property-details">

현재 페이지의 HTTP 상태 코드입니다.

</div>
</div>

<div class="ts-block-property">

```dts
error: App.Error | null;
```

<div class="ts-block-property-details">

현재 페이지의 에러 객체입니다(있는 경우). `handleError` 훅에서 채워집니다.

</div>
</div>

<div class="ts-block-property">

```dts
data: App.PageData & Record<string, any>;
```

<div class="ts-block-property-details">

현재 페이지에 있는 모든 `load` 함수의 데이터를 합친 결과입니다. 공통 타입은 `App.PageData`로 지정할 수 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
state: App.PageState;
```

<div class="ts-block-property-details">

페이지 상태입니다. `$app/navigation`의 [`goto`](/docs/kit/$app-navigation#goto)로 조작할 수 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
shallow: {/*…*/} | null;
```

<div class="ts-block-property-details">

현재 얕은 내비게이션의 대상에 대한 정보입니다. 얕은 내비게이션이 일어나지 않았다면 `null`입니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
params: AppLayoutParams<'/'> | null;
```

<div class="ts-block-property-details">

대상 라우트의 매개변수입니다. URL이 어떤 라우트로도 해석되지 않으면 `null`입니다.

</div>
</div>
<div class="ts-block-property">

```dts
route: { id: AppRouteId } | null;
```

<div class="ts-block-property-details">

대상 라우트에 대한 정보입니다. URL이 어떤 라우트로도 해석되지 않으면 `null`입니다.

</div>
</div>
<div class="ts-block-property">

```dts
url: ReadonlyURL;
```

<div class="ts-block-property-details">

`goto(..., { shallow: true })`에 전달된 정규화된 URL입니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
form: any;
```

<div class="ts-block-property-details">

폼을 제출한 뒤에만 채워집니다. 자세한 내용은 [폼 액션](/docs/kit/form-actions)을 참고하세요.

</div>
</div></div>

## ReadonlyURL

<div class="ts-block">

```dts
type ReadonlyURL = Readonly<
	Omit<URL, 'searchParams'> & {
		searchParams: ReadonlyURLSearchParams;
	}
>;
```

</div>

## ReadonlyURLSearchParams

<div class="ts-block">

```dts
type ReadonlyURLSearchParams = Omit<
	URLSearchParams,
	'set' | 'append' | 'delete' | 'sort'
>;
```

</div>


