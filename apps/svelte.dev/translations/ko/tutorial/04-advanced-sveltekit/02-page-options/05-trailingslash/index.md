---
title: trailingSlash
---

`/foo`와 `/foo/` 같은 두 URL은 똑같아 보이지만 실제로는 다릅니다. `./bar` 같은 상대 URL은 첫 번째 경우 `/bar`로, 두 번째 경우 `/foo/bar`로 해석되고, 검색 엔진은 둘을 별개의 항목으로 취급해 SEO에 해를 끼칩니다.

요컨대 후행 슬래시를 대충 다루는 것은 좋지 않습니다. SvelteKit은 기본적으로 후행 슬래시를 제거하므로, `/foo/`를 요청하면 `/foo`로 리디렉션됩니다.

반대로 후행 슬래시가 항상 붙도록 하고 싶다면 `trailingSlash` 옵션을 그에 맞게 지정하면 됩니다:

```js
/// file: src/routes/always/+page.server.js
export const trailingSlash = 'always';
```

두 경우를 모두 허용하려면(권장하지 않습니다!) `'ignore'`를 사용하세요:

```js
/// file: src/routes/ignore/+page.server.js
export const trailingSlash = 'ignore';
```

기본값은 `'never'`입니다.

후행 슬래시를 붙이는지 여부는 프리렌더링에 영향을 줍니다. `/always/` 같은 URL은 디스크에 `always/index.html`로 저장되고, `/never` 같은 URL은 `never.html`로 저장됩니다.
