---
title: 두 load 함수 함께 쓰기
---

가끔은 서버 load 함수와 유니버설 load 함수를 함께 써야 할 때가 있습니다. 예를 들어 서버에서 데이터를 반환하면서, 서버 데이터로는 직렬화할 수 없는 값도 함께 반환해야 할 수 있습니다.

이 예제에서는 `src/routes/+page.server.js`에서 받은 데이터가 `cool`인지 아닌지에 따라 `load`에서 다른 컴포넌트를 반환하려고 합니다.

`src/routes/+page.js`에서는 `data` 속성으로 서버 데이터에 접근할 수 있습니다:

```js
/// file: src/routes/+page.js
export async function load(+++{ data }+++) {
	const module = +++data.cool+++
		? await import('./CoolComponent.svelte')
		: await import('./BoringComponent.svelte');

	return {
		component: module.default,
		message: +++data.message+++
	};
}
```

> [!NOTE] 데이터가 병합되지는 않는다는 점에 유의하세요. 유니버설 `load` 함수에서 `message`를 명시적으로 반환해야 합니다.
