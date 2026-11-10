---
title: 프리로딩
---

이 연습에서 `/slow-a`와 `/slow-b` 라우트는 둘 다 `load` 함수에 인위적인 지연이 있어서, 이동하는 데 시간이 오래 걸립니다.

데이터를 항상 더 빨리 불러올 수 있는 것은 아니지만(직접 어떻게 할 수 없는 경우도 있습니다), SvelteKit은 내비게이션을 *미리 예상해서* 속도를 높일 수 있습니다. `<a>` 요소에 `data-sveltekit-preload-data` 속성이 있으면, 사용자가 링크 위에 마우스를 올리거나(데스크톱) 탭하는(모바일) 즉시 SvelteKit이 내비게이션을 시작합니다. 첫 번째 링크에 추가해 보세요:

```svelte
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">home</a>
	<a href="/slow-a" +++data-sveltekit-preload-data+++>slow-a</a>
	<a href="/slow-b">slow-b</a>
</nav>
```

이제 `/slow-a`로 훨씬 빠르게 이동합니다. (`click` 이벤트가 등록되기를 기다리지 않고) 마우스를 올리거나 탭할 때 내비게이션을 시작하는 것이 별 차이가 없어 보일 수 있지만, 실제로는 보통 200ms 이상을 절약합니다. 굼뜬 느낌과 경쾌한 느낌을 가르기에 충분한 차이입니다.

이 속성은 개별 링크에 붙일 수도 있고, 링크를 *포함하는* 어떤 요소에든 붙일 수도 있습니다. 기본 프로젝트 템플릿에는 `<body>` 요소에 이 속성이 들어 있습니다:

```html
<body data-sveltekit-preload-data="hover">
	%sveltekit.body%
</body>
```

속성에 다음 값 중 하나를 지정해 동작을 더 세밀하게 조정할 수 있습니다:

- `"hover"` (기본값, 모바일에서는 `"tap"`으로 폴백)
- `"tap"` — 탭할 때만 프리로드를 시작
- `"false"` — 프리로드를 끔

`data-sveltekit-preload-data`를 사용하면 때때로 헛짚는 경우, 즉 일어나지 않을 내비게이션을 예상해 데이터를 불러오는 경우가 생길 수 있고, 이는 바람직하지 않을 수 있습니다. 대안으로 `data-sveltekit-preload-code`를 사용하면 데이터를 미리 불러오지 않고 해당 라우트에 필요한 JavaScript만 프리로드할 수 있습니다. 이 속성에는 다음 값을 지정할 수 있습니다:

- `"eager"` — 내비게이션 직후 페이지의 모든 것을 프리로드
- `"viewport"` — 뷰포트에 나타나는 모든 것을 프리로드
- `"hover"` (기본값) 위와 같음
- `"tap"` — 위와 같음
- `"false"` — 위와 같음

`$app/navigation`에서 import한 `preloadCode`와 `preloadData`로 프로그래밍 방식으로 프리로드를 시작할 수도 있습니다:

```js
import { preloadCode, preloadData } from '$app/navigation';

// preload the code and data needed to navigate to /foo
preloadData('/foo');

// preload the code needed to navigate to /bar, but not the data
preloadCode('/bar');
```
