---
title: $app/types
---

이 모듈에는 앱의 라우트에 대해 생성된 타입이 들어 있습니다.

<blockquote class="since note">
	<p>2.26부터 사용 가능</p>
</blockquote>

```js
// @noErrors
import type { RouteId, PageRouteId, EndpointRouteId, RouteParams, LayoutParams } from '$app/types';
```

## AssetPath

`static` 디렉터리에 들어 있는 모든 에셋 파일 이름의 유니언으로, `base` 경로를 기준으로 합니다.

<div class="ts-block">

```dts
type AssetPath = 'favicon.png' | 'robots.txt' | (string & {});
```

</div>

## RouteId

앱의 모든 라우트 ID의 유니언으로, `PageRouteId`와 `EndpointRouteId`를 합친 것입니다. `page.route.id`와 `event.route.id`에 사용됩니다.

<div class="ts-block">

```dts
type RouteId = '/' | '/my-route' | '/my-other-route/[param]' | '/my-endpoint';
```

</div>

## PageRouteId

앱에서 `+page`가 있는 라우트 ID의 유니언입니다.

디렉터리에 `+page`와 `+server`가 모두 있으면 그 라우트 ID는 `PageRouteId`와 `EndpointRouteId` 양쪽에 모두 포함될 수 있습니다. 아래 예시에서는 `/my-route`가 둘 다 가지고 있습니다.

<div class="ts-block">

```dts
type PageRouteId = '/' | '/my-route' | '/my-other-route/[param]';
```

</div>

## EndpointRouteId

앱에서 `+server`가 있는 라우트 ID의 유니언입니다.

디렉터리에 `+page`와 `+server`가 모두 있으면 그 라우트 ID는 `PageRouteId`와 `EndpointRouteId` 양쪽에 모두 포함될 수 있습니다. 아래 예시에서는 `/my-route`가 둘 다 가지고 있습니다.

<div class="ts-block">

```dts
type EndpointRouteId = '/my-route' | '/my-endpoint';
```

</div>

## Path

앱의 모든 유효한 경로의 유니언으로, `base` 경로를 기준으로 합니다.

<div class="ts-block">

```dts
type Path = '' | 'my-route' | `my-other-route/${string}` & {};
```

</div>

## ResolvedPathname

`Path`와 비슷하지만 앞에 [기본 경로](@sveltejs-kit-vite#paths)가 붙습니다. `page.url.pathname`에 사용됩니다.

<div class="ts-block">

```dts
type ResolvedPathname = `${'' | `/${string}`}/` | `${'' | `/${string}`}/my-route` | `${'' | `/${string}`}/my-other-route/${string}` | {};
```

</div>

## RouteParams

주어진 라우트에 연결된 매개변수를 가져오는 유틸리티입니다.

```ts
// @errors: 2552
type BlogParams = RouteParams<'/blog/[slug]'>; // { slug: string }
```

<div class="ts-block">

```dts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
```

</div>

## LayoutParams

주어진 레이아웃에 연결된 매개변수를 가져오는 유틸리티입니다. `RouteParams`와 비슷하지만 하위 라우트의 선택적 매개변수도 포함합니다. `RouteId`에 속하지 않는 레이아웃 전용 디렉터리를 포함해, 레이아웃이 있는 모든 디렉터리의 라우트 ID를 받습니다.

<div class="ts-block">

```dts
type LayoutParams<T extends '/' | '/my-layout' | '/my-other-layout'> = { /* generated */ };
```

</div>
