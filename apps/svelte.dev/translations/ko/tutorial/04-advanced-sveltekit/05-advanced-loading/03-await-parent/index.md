---
title: 부모 데이터 사용하기
---

[레이아웃 데이터](/tutorial/kit/layout-data) 소개에서 봤듯이, `+page.svelte`와 `+layout.svelte` 컴포넌트는 부모 `load` 함수가 반환한 모든 것에 접근할 수 있습니다.

가끔은 `load` 함수 자체에서 부모의 데이터에 접근하는 것이 유용합니다. `await parent()`로 할 수 있습니다.

어떻게 동작하는지 보여 주기 위해, 서로 다른 `load` 함수에서 오는 두 숫자를 더해 보겠습니다. 먼저 `src/routes/+layout.server.js`에서 데이터를 반환하세요:

```js
/// file: src/routes/+layout.server.js
export function load() {
	return { +++a: 1+++ };
}
```

그런 다음 `src/routes/sum/+layout.js`에서 그 데이터를 가져오세요:

```js
/// file: src/routes/sum/+layout.js
export async function load(+++{ parent }+++) {
	+++const { a } = await parent();+++
	return { +++b: a + 1+++ };
}
```

> [!NOTE] [유니버설](/tutorial/kit/universal-load-functions) `load` 함수가 부모 *서버* `load` 함수의 데이터를 가져올 수 있다는 점에 주목하세요. 반대는 성립하지 않습니다. 서버 load 함수는 다른 서버 load 함수에서만 부모 데이터를 가져올 수 있습니다.

마지막으로 `src/routes/sum/+page.js`에서 두 `load` 함수의 부모 데이터를 가져오세요:

```js
/// file: src/routes/sum/+page.js
export async function load(+++{ parent }+++) {
	+++const { a, b } = await parent();+++
	return { +++c: a + b+++ };
}
```

> [!NOTE] `await parent()`를 사용할 때 워터폴이 생기지 않도록 주의하세요. 부모 데이터에 의존하지 않는 다른 데이터를 `fetch`할 수 있다면 그것부터 하세요.
