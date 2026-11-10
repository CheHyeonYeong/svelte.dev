---
title: 하이드레이션 가능한 데이터
---

Svelte에서 비동기 콘텐츠 데이터를 서버에서 렌더링하고 싶다면 그냥 `await`하면 됩니다. 아주 좋습니다! 하지만 함정이 하나 있습니다. 클라이언트에서 그 콘텐츠를 하이드레이트할 때 Svelte가 비동기 작업을 다시 해야 하고, 그 작업이 걸리는 시간만큼 하이드레이션이 막힙니다:

```svelte
<script>
  import { getUser } from 'my-database-library';

  // This will get the user on the server, render the user's name into the h1,
  // and then, during hydration on the client, it will get the user _again_,
  // blocking hydration until it's done.
  const user = await getUser();
</script>

<h1>{user.name}</h1>
```

하지만 이건 비효율적입니다. 서버에서 이미 데이터를 가져오는 힘든 작업을 했다면, 클라이언트에서 하이드레이션하는 동안 다시 가져오고 싶지는 않을 것입니다. `hydratable`은 이 문제를 해결하기 위해 만들어진 저수준 API입니다. 직접 쓸 일은 많지 않을 것이며, 대개는 사용하는 데이터 페칭 라이브러리가 내부적으로 사용합니다. 예를 들어 [SvelteKit의 원격 함수](/docs/kit/remote-functions)가 이 API를 기반으로 동작합니다.

위 예시를 고치면 다음과 같습니다:

```svelte
<script>
  import { hydratable } from 'svelte';
  import { getUser } from 'my-database-library';

  // During server rendering, this will serialize and stash the result of `getUser`, associating
  // it with the provided key and baking it into the `head` content. During hydration, it will
  // look for the serialized version, returning it instead of running `getUser`. After hydration
  // is done, if it's called again, it'll simply invoke `getUser`.
  const user = await hydratable('user', () => getUser());
</script>

<h1>{user.name}</h1>
```

이 API는 서버 렌더링과 하이드레이션 사이에 변하지 않는 무작위 값이나 시간 기반 값을 제공하는 데도 쓸 수 있습니다. 예를 들어 하이드레이션 때 바뀌지 않는 난수를 얻으려면 다음과 같이 합니다:

```ts
import { hydratable } from 'svelte';
const rand = hydratable('random', () => Math.random());
```

라이브러리 작성자라면 다른 라이브러리와 키가 충돌하지 않도록 `hydratable` 값의 키 앞에 반드시 라이브러리 이름을 붙이세요.

## 직렬화 <!-- Serialization -->

`hydratable` 함수가 반환하는 모든 데이터는 직렬화할 수 있어야 합니다. 그렇다고 JSON으로 제한되는 것은 아닙니다. Svelte는 [`devalue`](https://npmjs.com/package/devalue)를 사용하므로 `Map`, `Set`, `URL`, `BigInt` 등 다양한 것을 직렬화할 수 있습니다. 전체 목록은 해당 문서 페이지를 확인하세요. 게다가 Svelte의 마법 덕분에 프로미스도 걱정 없이 사용할 수 있습니다:

```svelte
<script>
  import { hydratable } from 'svelte';
  const promises = hydratable('random', () => {
    return {
      one: Promise.resolve(1),
      two: Promise.resolve(2)
    }
  });
</script>

{await promises.one}
{await promises.two}
```

## CSP

`hydratable`은 `render`가 반환하는 `head`에 인라인 `<script>` 블록을 추가합니다. [콘텐츠 보안 정책](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)(CSP)을 사용한다면 이 스크립트는 실행되지 않을 가능성이 높습니다. `render`에 `nonce`를 전달할 수 있습니다:

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';
// ---cut---
const nonce = crypto.randomUUID();

const { head, body } = await render(App, {
	csp: { nonce }
});
```

이렇게 하면 스크립트 블록에 `nonce`가 추가됩니다. 이후 이 스크립트를 포함하는 문서의 CSP 헤더에도 같은 nonce를 추가한다는 전제입니다:

```js
/// file: server.js
let response = new Response();
let nonce = 'xyz123';
// ---cut---
response.headers.set(
  'Content-Security-Policy',
  `script-src 'nonce-${nonce}'`
 );
```

`nonce`(영국 속어의 뜻은 제쳐 두고, 'number used once', 즉 한 번만 쓰는 값이라는 뜻입니다)는 반드시 개별 응답을 동적으로 서버 렌더링할 때만 사용해야 합니다.

대신 정적 HTML을 미리 생성한다면 해시를 사용해야 합니다:

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';
// ---cut---
const { head, body, hashes } = await render(App, {
	csp: { hash: true }
});
```

`hashes.script`는 `["sha256-abcd123"]` 같은 문자열 배열입니다. `nonce`와 마찬가지로 이 해시를 CSP 헤더에 사용해야 합니다:

```js
/// file: server.js
let response = new Response();
let hashes = { script: ['sha256-xyz123'] };
// ---cut---
response.headers.set(
  'Content-Security-Policy',
  `script-src ${hashes.script.map((hash) => `'${hash}'`).join(' ')}`
 );
```

`hash`는 앞으로 스트리밍 SSR과 충돌하게 될 것이므로, 가능하다면 해시보다 `nonce`를 사용하기를 권장합니다.
