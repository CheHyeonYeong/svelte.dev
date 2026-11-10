---
title: $app/paths
---



```js
// @noErrors
import { asset, match, resolve } from '$app/paths';
```

## asset

<blockquote class="since note">

2.26부터 사용 가능

</blockquote>

`static` 디렉터리에 있는 에셋의 URL을 해석합니다. [`config.paths.assets`](/docs/kit/@sveltejs-kit-vite#paths)가 설정되어 있으면 그 값을, 그렇지 않으면 기본 경로를 앞에 붙입니다.

서버 렌더링 중에는 기본 경로가 상대 경로이며, 현재 렌더링 중인 페이지에 따라 달라집니다.

```svelte
<script>
	import { asset } from '$app/paths';
</script>

<img alt="a potato" src={asset('potato.jpg')} />
```

<div class="ts-block">

```dts
function asset(file: AssetPath): string;
```

</div>



## match

<blockquote class="since note">

2.52.0부터 사용 가능

</blockquote>

경로나 URL을 라우트 ID와 매칭하고 매개변수를 추출합니다.

```js
// @errors: 7031
import { match } from '$app/paths';

const route = await match('blog/hello-world');

if (route?.id === '/blog/[slug]') {
	const slug = route.params.slug;
	const response = await fetch(`/api/posts/${slug}`);
	const post = await response.json();
}
```

<div class="ts-block">

```dts
function match(url: URL | string): Promise<
	| {
			[K in RouteId]: {
				id: K;
				params: RouteParams<K>;
			};
	  }[RouteId]
	| null
>;
```

</div>



## resolve

<blockquote class="since note">

2.26부터 사용 가능

</blockquote>

기본 경로가 있으면 이를 앞에 붙여 pathname을 해석하거나, 동적 세그먼트를 매개변수로 채워 라우트 ID를 해석합니다.
해시 라우팅 모드에서는 반환되는 URL이 `#`으로 시작합니다.

서버 렌더링 중에는 기본 경로가 상대 경로이며, 현재 렌더링 중인 페이지에 따라 달라집니다.

```js
// @errors: 7031
import { resolve } from '$app/paths';

// using a pathname
const resolved = resolve(`blog/hello-world`);

// using a route ID plus parameters
const resolved = resolve('/blog/[slug]', {
	slug: 'hello-world'
});
```

<div class="ts-block">

```dts
function resolve<
	T extends
		| RouteIdWithSearchOrHash
		| PathnameWithSearchOrHash
>(...args: ResolveArgs<T>): ResolvedPathname;
```

</div>





> [!LEGACY]
> `base`, `assets`, `resolveRoute`는 3.0에서 제거되었습니다
