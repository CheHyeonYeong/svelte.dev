---
title: 어댑터 작성하기
---

원하는 환경을 위한 어댑터가 아직 없다면 직접 만들 수 있습니다. 여러분의 플랫폼과 비슷한 플랫폼용 [어댑터의 소스를 살펴보고](https://github.com/sveltejs/kit/tree/main/packages) 출발점으로 복사해 쓰는 것을 권장합니다.

어댑터 패키지는 `Adapter`를 생성하는 다음 API를 구현합니다:

```js
// @errors: 2322
// @filename: ambient.d.ts
type AdapterSpecificOptions = any;

// @filename: index.js
// ---cut---
import { getRequest, setResponse } from '@sveltejs/kit/node';

/** @param {AdapterSpecificOptions} options */
export default function (options) {
	/** @type {import('@sveltejs/kit').Adapter} */
	const adapter = {
		name: 'adapter-package-name',
		async adapt(builder) {
			// adapter implementation
		},
		async emulate() {
			return {
				async platform({ config, prerender }) {
					// the returned object becomes `event.platform` during dev, build and
					// preview. Its shape is that of `App.Platform`
				}
			}
		},
		supports: {
			read: ({ config, route }) => {
				// Return `true` if the route with the given `config` can use `read`
				// from `$app/server` in production, return `false` if it can't.
				// Or throw a descriptive error describing how to configure the deployment
			},
			instrumentation: () => {
				// Return `true` if this adapter supports loading `instrumentation.server.js`.
				// Return `false if it can't, or throw a descriptive error.
			}
		},
		vite: {
			getRequest(options) {
				const request = getRequest(options);
				// modify the Request object here if needed
				return request;
			},
			setResponse(res, response) {
				// handle WebSockets here, for example
				setResponse(res, response);
			},
			plugins: {
				// add plugins here to integrate with Vite
				pre: [],
				post: []
			}
		}
	};

	return adapter;
}
```

이 중 `name`과 `adapt`는 필수입니다. `emulate`, `vite`, `supports`는 선택 사항입니다.

`adapt` 메서드 안에서 어댑터가 해야 할 일은 다음과 같습니다:

- 빌드 디렉터리를 비웁니다
- `builder.writeClient`, `builder.writeServer`, `builder.writePrerendered`로 SvelteKit 결과물을 기록합니다
- 다음과 같은 코드를 출력합니다:
	- `${builder.generateServerInstance()}`가 생성한 `server` 인스턴스를 import합니다
	- `await server.init({ env, read })`를 실행합니다
	- 플랫폼에서 오는 요청을 수신하고, 필요하면 표준 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)로 변환한 뒤, `server.respond(request, { getClientAddress })` 함수를 호출해 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 생성하고 그것으로 응답합니다
	- `server.respond`에 전달하는 `platform` 옵션을 통해 플랫폼별 정보를 SvelteKit에 노출합니다
- 필요하다면 대상 플랫폼에서 의존성을 설치할 필요가 없도록 결과물을 번들합니다
- 사용자의 정적 파일과 생성된 JS/CSS를 대상 플랫폼에 맞는 위치에 둡니다

가능하다면 어댑터 결과물은 `build/` 디렉터리 아래에 두고, 중간 결과물은 `.svelte-kit/[adapter-name]` 아래에 두는 것을 권장합니다.
