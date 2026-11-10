---
title: 서비스 워커
---

서비스 워커는 앱 안에서 네트워크 요청을 처리하는 프록시 서버 역할을 합니다. 이를 통해 앱을 오프라인에서도 동작하게 만들 수 있습니다. 오프라인 지원이 필요하지 않더라도(또는 만드는 앱의 종류 때문에 현실적으로 구현할 수 없더라도), 빌드된 JS와 CSS를 미리 캐시해 내비게이션 속도를 높이기 위해 서비스 워커를 쓸 만한 경우가 많습니다.

SvelteKit에서는 `src/service-worker/index.ts` 파일이 있으면 번들링되어 자동으로 등록됩니다.

> [!NOTE] `src/service-worker.ts`나 `.js`도 사용할 수 있지만, 아래의 [타입 안전성](#Type-safety) 섹션을 참고하세요

## 서비스 워커 내부 <!-- Inside the service worker -->

서비스 워커가 쓸모 있는 일을 하려면 몇 가지를 가져와야 할 것입니다:

- [`$app/service-worker`]($app-service-worker)는 `self`를 내보냅니다. 이는 ([이 단계](#Type-safety)를 따랐다면) [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope) 타입이 지정된 `globalThis`일 뿐이며, 덕분에 `fetch` 이벤트의 타입이 올바르게 지정됩니다
- [`$app/env`]($app-env)는 `version`을 내보내며, 배포 단위로 구분되는 캐시를 만들 때 유용합니다
- [`$app/manifest`]($app-manifest)는 `immutable` 빌드 파일, `assets`, 그리고 모든 `prerendered` 콘텐츠를 내보내므로 이를 이용해 캐시를 채울 수 있습니다

일반적인 서비스 워커는 다음과 같습니다:

```js
/// file: src/service-worker.js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
// ---cut---
import { self } from '$app/service-worker';
import { version } from '$app/env';
import { immutable, assets } from '$app/manifest';
import { resolve } from '$app/paths';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// `immutable`/`assets` paths from `$app/manifest` are relative to the
// base path, so resolve them to absolute pathnames that can be matched
// against `url.pathname` in the `fetch` handler
const ASSETS = [
	...immutable.map((asset) => resolve(asset.path)), // the Vite output
	...assets.map((asset) => resolve(asset.path))  // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `immutable`/`assets` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first...
		try {
			const response = await fetch(event.request);

			if (response.status === 200 && !response.headers.get('cache-control')?.includes('no-store')) {
				// ...and cache responses in the background for next time....
				void cache.put(event.request, response.clone());
			}

			return response;
		} catch (error) {
			// ...otherwise fall back to previously cached data if it exists...
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// ...or throw the error
			throw error;
		}
	}

	event.respondWith(respond());
});
```

> [!NOTE] 캐시할 때는 주의하세요! 경우에 따라서는 오래된 데이터가 오프라인일 때 사용할 수 없는 데이터보다 더 나쁠 수 있습니다. 또한 브라우저는 캐시가 너무 가득 차면 비우므로, 동영상 파일 같은 큰 에셋을 캐시할 때도 주의해야 합니다.

## 타입 안전성 <!-- Type safety -->

서비스 워커는 앱의 나머지 부분과 다른 컨텍스트에서 실행됩니다. 따라서 다른 타입이 필요합니다. 프로젝트 루트의 `tsconfig.json`이 서비스 워커 코드를 제외하도록 하고...

```json
/// file: tsconfig.json
{
	"extends": "$app/tsconfig",
	"include": ["src", "test"],
	"exclude": ["src/service-worker"]
}
```

...`src/service-worker/index.ts` 파일 옆에 별도의 `tsconfig.json`을 두어야 합니다. 이 파일은 [`$app/tsconfig/service-worker`]($app-tsconfig-service-worker)를 확장해 올바른 타입을 설정해야 합니다:

```json
/// file: src/service-worker/tsconfig.json
{
	"extends": "$app/tsconfig/service-worker"
}
```

## 수동 등록 <!-- Manual registration -->

직접 작성한 로직으로 서비스 워커를 등록해야 한다면 [자동 등록을 끌](@sveltejs-kit-vite#serviceWorker) 수 있습니다. 서버에서 렌더링된 HTML에 삽입되는 기본 등록 코드는 대략 다음과 같습니다:

```js
if ('serviceWorker' in navigator) {
	const script_url = './service-worker.js';
	const policy = globalThis?.window?.trustedTypes?.createPolicy(
		'sveltekit-trusted-url',
		{ createScriptURL(url) { return url; } }
	);
	const sanitised = policy?.createScriptURL(script_url) ?? script_url;
	addEventListener('load', function () {
		navigator.serviceWorker.register(sanitised, { type: 'module' });
	});
}
```

> [!NOTE] 서비스 워커는 프로덕션용으로는 번들링되지만, 개발 중에는 번들링되지 않습니다.

## 서비스 워커 업데이트하기 <!-- Updating the service worker -->

브라우저는 서비스 워커의 범위(scope) 안에서 전체 페이지 내비게이션이 일어날 때, 그리고 `push`나 `sync` 같은 기능 이벤트가 발생한 뒤에 업데이트된 서비스 워커가 있는지 확인합니다. 클라이언트 사이드 내비게이션은 이 중 어디에도 해당하지 않으므로, 앱 안에서 이동하는 것만으로는 새 배포의 서비스 워커가 적용되지 않습니다.

SvelteKit은 에러 복구 과정에서만 [`registration.update()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update)를 호출합니다. 라우트 모듈을 불러오지 못하거나 내비게이션 결과가 에러 상태이고, [버전 폴링](@sveltejs-kit-vite#version)이 앱이 다시 배포되었음을 감지하면, SvelteKit이 전체 페이지 내비게이션으로 대체하기 전에 서비스 워커가 업데이트됩니다.

새 배포가 더 적극적으로 적용되기를 원한다면 업데이트 확인을 직접 트리거할 수 있습니다. 예를 들어 루트 레이아웃에서 모든 클라이언트 사이드 내비게이션마다 확인할 수 있습니다:

```js
import { afterNavigate } from '$app/navigation';

afterNavigate(async () => {
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.getRegistration();
		await registration?.update();
	}
});
```

이렇게 해도 (새 서비스 워커가 있다면) 새 서비스 워커가 기존 페이지를 즉시 넘겨받지는 않습니다. 대신 백그라운드에서 설치되고, 기존 서비스 워커가 관리하는 탭의 수가 0이 되는 즉시 제어를 넘겨받습니다.

## 다른 방법 <!-- Other solutions -->

SvelteKit의 서비스 워커 구현은 다루기 쉽도록 설계되었으며, 대부분의 사용자에게 좋은 해결책일 것입니다. 하지만 SvelteKit 밖에서는 많은 PWA 애플리케이션이 [Workbox](https://web.dev/learn/pwa/workbox) 라이브러리를 활용합니다. Workbox에 익숙하다면 [Vite PWA 플러그인](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html)이 더 마음에 들 수 있습니다.

## 참고 자료 <!-- References -->

서비스 워커에 대한 보다 일반적인 정보는 [MDN 웹 문서](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)를 추천합니다.
