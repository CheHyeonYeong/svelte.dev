---
title: 웹 표준
---

이 문서 곳곳에서 SvelteKit이 기반으로 삼는 표준 [Web API](https://developer.mozilla.org/en-US/docs/Web/API)를 언급합니다. 바퀴를 새로 발명하는 대신 *플랫폼을 활용하므로*, 이미 갖고 있는 웹 개발 실력을 SvelteKit에서도 그대로 쓸 수 있습니다. 반대로 SvelteKit을 배우는 데 들인 시간은 다른 곳에서도 더 나은 웹 개발자가 되는 데 도움이 됩니다.

이 API들은 모든 최신 브라우저는 물론 Cloudflare Workers, Deno, Vercel Functions 같은 브라우저가 아닌 여러 환경에서도 사용할 수 있습니다. 특히 다음 API들에 익숙해지게 될 것입니다:

## Fetch API <!-- Fetch APIs -->

SvelteKit은 네트워크에서 데이터를 가져올 때 [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)를 사용합니다. 브라우저뿐 아니라 [훅](hooks)과 [서버 라우트](routing#server)에서도 사용할 수 있습니다.

> [!NOTE] [`load`](load) 함수, [서버 훅](hooks), [API 라우트](routing#server), [원격 함수](remote-functions)에서는 특별한 버전의 `fetch`를 사용할 수 있습니다. 이 `fetch`는 서버 사이드 렌더링 중에 HTTP 호출 없이 엔드포인트를 직접 호출하면서도 자격 증명을 유지합니다. (`load` 밖의 서버 사이드 코드에서 자격 증명을 포함한 fetch를 하려면 `cookie`나 `authorization` 헤더를 직접 전달해야 합니다.) 또한 서버 사이드 `fetch`는 보통 완전한 URL이 필요하지만, 이 `fetch`로는 상대 경로로 요청할 수도 있습니다.

`fetch` 자체 외에도 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)에는 다음 인터페이스들이 있습니다:

### Request

[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 인스턴스는 [훅](hooks)과 [서버 라우트](routing#server)에서 `event.request`로 접근할 수 있습니다. 엔드포인트로 전송된 데이터를 가져오는 `request.json()`이나 `request.formData()` 같은 유용한 메서드가 들어 있습니다.

### Response

[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 인스턴스는 `await fetch(...)`와 `+server.js` 파일의 핸들러가 반환합니다. 근본적으로 SvelteKit 앱은 `Request`를 `Response`로 바꾸는 기계입니다.

### Headers

[`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 인터페이스로 들어오는 `request.headers`를 읽고 나가는 `response.headers`를 설정할 수 있습니다. 예를 들어 아래처럼 `request.headers`를 가져오고, [`Response.json`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static)으로 수정한 `response.headers`를 보낼 수 있습니다:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent/+server.js
/** @type {import('./$types').RequestHandler} */
export function GET({ request }) {
	// log all headers
	console.log(...request.headers);

	// create a JSON Response using a header we received
	return Response.json({
		// retrieve a specific header
		userAgent: request.headers.get('user-agent')
	}, {
		// set a header on the response
		headers: { 'x-custom-header': 'potato' }
	});
}
```

## FormData

HTML 네이티브 폼 제출을 다룰 때는 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 객체를 사용하게 됩니다.

```js
// @errors: 2461
/// file: src/routes/hello/+server.js
/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const body = await event.request.formData();

	// log all fields
	console.log([...body]);

	return Response.json({
		// get a specific field's value
		name: body.get('name') ?? 'world'
	});
}
```

## 스트림 API <!-- Stream APIs -->

대부분의 경우 엔드포인트는 위의 `userAgent` 예제처럼 완전한 데이터를 반환합니다. 하지만 한 번에 메모리에 담기에는 너무 큰 응답이나 여러 조각으로 나누어 전달되는 응답을 반환해야 할 때도 있는데, 이를 위해 플랫폼은 [스트림](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), 즉 [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream), [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)을 제공합니다.

## URL API <!-- URL APIs -->

URL은 [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) 인터페이스로 표현되며, 이 인터페이스에는 `origin`과 `pathname`(브라우저에서는 `hash`도) 같은 유용한 속성이 있습니다. 이 인터페이스는 [훅](hooks)과 [서버 라우트](routing#server)의 `event.url`, [페이지](routing#page)의 [`page.url`]($app-state), [`beforeNavigate`와 `afterNavigate`]($app-navigation)의 `from`과 `to` 등 여러 곳에서 등장합니다.

### URLSearchParams

URL이 있는 곳이라면 어디서든 `url.searchParams`로 쿼리 매개변수에 접근할 수 있습니다. 이는 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)의 인스턴스입니다:

```js
// @filename: ambient.d.ts
declare global {
	const url: URL;
}

export {};

// @filename: index.js
// ---cut---
const foo = url.searchParams.get('foo');
```

## Web Crypto

[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)는 전역 `crypto`로 사용할 수 있습니다. 내부적으로 [콘텐츠 보안 정책(CSP)](@sveltejs-kit-vite#csp) 헤더에 쓰이지만, UUID 생성 같은 용도로도 사용할 수 있습니다:

```js
const uuid = crypto.randomUUID();
```
