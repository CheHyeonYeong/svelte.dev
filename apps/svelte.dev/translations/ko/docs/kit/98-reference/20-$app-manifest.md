---
title: $app/manifest
---



```js
// @noErrors
import { assets, immutable, prerendered, routes } from '$app/manifest';
```

이 모듈은 [서비스 워커](/docs/kit/service-workers)를 비롯한 여러 컨텍스트에서 사용할 수 있습니다.
빌드 결과물, 정적 파일, 프리렌더링된 페이지, 라우트에 대한 정보를 export합니다.

## assets

`static` 디렉터리(또는 `config.files.assets`로 지정한 디렉터리)에 있는 파일을 나타내는 `{ path: AssetPath }` 객체의 배열입니다.
경로는 [기본 경로](/docs/kit/@sveltejs-kit-vite#paths)를 기준으로 한 상대 경로이며, [`asset(...)`](/docs/kit/$app-paths#asset)과 함께 사용할 수 있습니다.

<div class="ts-block">

```dts
const assets: Array<{
	path: import('$app/types').AssetPath;
}>;
```

</div>



## immutable

Vite가 생성한 파일을 나타내는 `{ path: string }` 객체의 배열입니다.
경로는 [기본 경로](/docs/kit/@sveltejs-kit-vite#paths)를 기준으로 한 상대 경로이며, [서비스 워커](/docs/kit/service-workers) 안에서 `cache.add(...)`와 함께 사용하기 위한 것입니다.
개발 중에는 빈 배열입니다.

<div class="ts-block">

```dts
const immutable: Array<{ path: string }>;
```

</div>



## prerendered

프리렌더링된 페이지와 엔드포인트를 나타내는 `{ path: Path }` 객체의 배열이며, 경로는 [기본 경로](/docs/kit/@sveltejs-kit-vite#paths)를 기준으로 합니다.
개발 중에는 빈 배열입니다.

<div class="ts-block">

```dts
const prerendered: Array<{
	path: import('$app/types').Path;
}>;
```

</div>



## routes

앱의 라우트를 나타내는 객체의 배열입니다. 라우터가 매칭할 수 있는 라우트만
포함되며, `+layout`만 들어 있는 디렉터리는 그 자체로 라우트가 아닙니다.

각 객체에는 `id`와 함께, 라우트에 `+page`나 `+server`가 있는지를 나타내는 불리언 값
`page`와 `endpoint`가 있습니다. 둘 다 있는 라우트라면 둘 다 `true`이므로, 각 기능별로
따로 필터링할 수 있습니다:

```js
// @errors: 7031
import { routes } from '$app/manifest';

const pages = routes.filter((route) => route.page);
const endpoints = routes.filter((route) => route.endpoint);
```

<div class="ts-block">

```dts
const routes: ManifestRoute[];
```

</div>



## ManifestRoute

앱의 라우트와 그 기능을 나타냅니다. `page`는 `+page`가 있는지를,
`endpoint`는 `+server`가 있는지를 나타냅니다. 두 파일이 모두 있으면 둘 다 `true`입니다.

<div class="ts-block">

```dts
type ManifestRoute =
	| {
			id: Exclude<
				import('$app/types').PageRouteId,
				import('$app/types').EndpointRouteId
			>;
			page: true;
			endpoint: false;
	  }
	| {
			id: Exclude<
				import('$app/types').EndpointRouteId,
				import('$app/types').PageRouteId
			>;
			page: false;
			endpoint: true;
	  }
	| {
			id: Extract<
				import('$app/types').PageRouteId,
				import('$app/types').EndpointRouteId
			>;
			page: true;
			endpoint: true;
	  };
```

</div>


