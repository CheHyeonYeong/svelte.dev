---
title: 링크 옵션
tags: preloading
---

SvelteKit에서는 (프레임워크 전용 `<Link>` 컴포넌트가 아니라) `<a>` 요소를 사용해 앱의 라우트 사이를 이동합니다. 사용자가 앱이 '소유한' `href`를 가진 링크를 클릭하면(예를 들어 외부 사이트로 가는 링크가 아니라면), SvelteKit은 새 페이지의 코드를 가져온 뒤 데이터를 가져오는 데 필요한 `load` 함수를 호출해 새 페이지로 이동합니다.

`data-sveltekit-*` 속성으로 링크의 동작을 바꿀 수 있습니다. 이 속성은 `<a>` 자체에 적용할 수도 있고, 부모 요소에 적용할 수도 있습니다.

이 옵션들은 [`method="GET"`](form-actions#GET-vs-POST)인 `<form>` 요소에도 적용됩니다.

## data-sveltekit-preload-data

브라우저가 사용자의 링크 클릭을 인식하기 전에, 사용자가 (데스크톱에서) 링크 위에 마우스를 올렸다는 것이나 `touchstart` 또는 `mousedown` 이벤트가 발생했다는 것을 감지할 수 있습니다. 두 경우 모두 곧 `click` 이벤트가 올 것이라고 꽤 정확하게 추측할 수 있습니다.

SvelteKit은 이 정보를 활용해 코드 가져오기와 페이지 데이터 가져오기를 미리 시작할 수 있습니다. 이렇게 하면 수백 밀리초를 더 벌 수 있는데, 이는 굼뜨게 느껴지는 사용자 인터페이스와 기민하게 느껴지는 인터페이스를 가르는 차이입니다.

이 동작은 `data-sveltekit-preload-data` 속성으로 제어할 수 있으며, 이 속성은 다음 두 값 중 하나를 가질 수 있습니다:

- `"hover"`는 마우스가 링크 위에 멈추면 프리로드를 시작한다는 뜻입니다. 모바일에서는 `touchstart` 시점에 프리로드가 시작됩니다
- `"tap"`은 `touchstart`나 `mousedown` 이벤트가 감지되자마자 프리로드를 시작한다는 뜻입니다

기본 프로젝트 템플릿에는 `src/app.html`의 `<body>` 요소에 `data-sveltekit-preload-data="hover"` 속성이 적용되어 있으므로, 기본적으로 모든 링크가 호버 시 프리로드됩니다:

```html
<body data-sveltekit-preload-data="hover">
	<div style="display: contents">%sveltekit.body%</div>
</body>
```

사용자가 링크 위에 마우스를 올렸을 때 `load`를 호출하는 것이 바람직하지 않을 때도 있습니다. 잘못된 예측으로 이어지기 쉽거나(호버 뒤에 반드시 클릭이 오는 것은 아닙니다), 데이터가 매우 빠르게 갱신되어 지연이 생기면 오래된 데이터가 될 수 있기 때문입니다.

이런 경우에는 `"tap"` 값을 지정하면 됩니다. 그러면 SvelteKit은 사용자가 링크를 탭하거나 클릭할 때만 `load`를 호출합니다:

```html
<a data-sveltekit-preload-data="tap" href="/stonks">
	Get current stonk values
</a>
```

> [!NOTE] `$app/navigation`의 `preloadData`를 사용해 프로그래밍 방식으로 호출할 수도 있습니다.

사용자가 데이터 사용량 줄이기를 선택한 경우, 즉 [`navigator.connection.saveData`](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)가 `true`인 경우에는 데이터를 절대 프리로드하지 않습니다.

## data-sveltekit-preload-code

링크의 *데이터*는 프리로드하고 싶지 않은 경우에도 *코드*는 프리로드하는 것이 도움이 될 수 있습니다. `data-sveltekit-preload-code` 속성은 `data-sveltekit-preload-data`와 비슷하게 동작하지만, '적극성'이 높은 순서대로 다음 네 가지 값 중 하나를 가질 수 있다는 점이 다릅니다:

- `"eager"`는 링크를 즉시 프리로드한다는 뜻입니다
- `"viewport"`는 링크가 뷰포트에 들어오면 프리로드한다는 뜻입니다
- `"hover"` - 위와 같지만, 코드만 프리로드합니다
- `"tap"` - 위와 같지만, 코드만 프리로드합니다

`viewport`와 `eager`는 내비게이션 직후 DOM에 있는 링크에만 적용된다는 점에 유의하세요. 링크가 나중에 추가되면(예를 들어 `{#if ...}` 블록 안에서) `hover`나 `tap`으로 트리거될 때까지 프리로드되지 않습니다. 이는 DOM의 변경을 공격적으로 관찰하면서 생기는 성능 문제를 피하기 위해서입니다.

> [!NOTE] 코드 프리로드는 데이터 프리로드의 전제 조건이므로, 이 속성은 존재하는 `data-sveltekit-preload-data` 속성보다 더 적극적인 값을 지정할 때만 효과가 있습니다.

`data-sveltekit-preload-data`와 마찬가지로, 사용자가 데이터 사용량 줄이기를 선택했다면 이 속성은 무시됩니다.

## data-sveltekit-reload

가끔은 SvelteKit이 링크를 처리하지 않고 브라우저가 처리하도록 해야 할 때가 있습니다. 링크에 `data-sveltekit-reload` 속성을 추가하면...

```html
<a data-sveltekit-reload href="/path">Path</a>
```

...링크를 클릭했을 때 전체 페이지 내비게이션이 일어납니다.

`rel="external"` 속성이 있는 링크도 똑같이 처리됩니다. 또한 이런 링크는 [프리렌더링](page-options#prerender) 중에 무시됩니다.

## data-sveltekit-replacestate

내비게이션이 브라우저의 세션 기록에 새 항목을 만들지 않기를 원할 때가 있습니다. 링크에 `data-sveltekit-replacestate` 속성을 추가하면...

```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

...링크를 클릭했을 때 `pushState`로 새 항목을 만드는 대신 현재 `history` 항목을 대체합니다.

## data-sveltekit-reset

내부 링크로 이동할 때 SvelteKit은 브라우저의 기본 내비게이션 동작을 그대로 따릅니다. 스크롤 위치를 0,0으로 바꿔 사용자가 페이지의 맨 왼쪽 위에 오게 하고(링크에 `#hash`가 있으면 일치하는 ID를 가진 요소로 스크롤합니다), [포커스를 초기화](accessibility#Focus-management)합니다.

경우에 따라 이 동작을 끄고 싶을 수 있습니다. 링크에 `data-sveltekit-reset="false"` 속성을 추가하면...

```html
<a href="path" data-sveltekit-reset="false">Path</a>
```

...링크를 클릭한 뒤에도 현재 스크롤 위치와 포커스된 요소가 유지됩니다.

이 속성은 `<form method="GET">`에도 사용할 수 있습니다. 예를 들어 사용자가 입력하는 동안 제출되는 검색 폼에서 텍스트 입력에 포커스를 유지하고 싶을 때 유용합니다:

```html
<form data-sveltekit-reset="false">
	<input type="text" name="query">
</form>
```

일반적으로 링크에서는 포커스 유지를 피하세요. 포커스된 요소가 (이전에 포커스된 요소가 아니라) `<a>` 태그가 되고, 스크린 리더 같은 보조 기술 사용자는 보통 내비게이션 뒤에 포커스가 이동하기를 기대하기 때문입니다. 또한 이 속성은 내비게이션 후에도 여전히 존재하는 요소에만 사용해야 합니다. 요소가 더 이상 존재하지 않으면 사용자의 포커스를 잃게 되어, 보조 기술 사용자에게 혼란스러운 경험을 줍니다.

## 옵션 끄기 <!-- Disabling options -->

이 옵션들이 활성화된 요소 안에서 옵션을 끄려면 `"false"` 값을 사용하세요:

```html
<div data-sveltekit-preload-data>
	<!-- these links will be preloaded -->
	<a href="/a">a</a>
	<a href="/b">b</a>
	<a href="/c">c</a>

	<div data-sveltekit-preload-data="false">
		<!-- these links will NOT be preloaded -->
		<a href="/d">d</a>
		<a href="/e">e</a>
		<a href="/f">f</a>
	</div>
</div>
```

요소에 조건부로 속성을 적용하려면 다음과 같이 하세요:

```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```
