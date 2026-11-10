---
title: 쿠키 읽고 쓰기
---

[`setHeaders`](headers) 함수는 `Set-Cookie` 헤더에는 사용할 수 없습니다. 대신 `cookies` API를 사용해야 합니다.

`load` 함수에서는 `cookies.get(name, options)`로 쿠키를 읽을 수 있습니다:

```js
/// file: src/routes/+page.server.js
export function load(+++{ cookies }+++) {
	+++const visited = cookies.get('visited');+++

	return {
		visited: visited === 'true'
	};
}
```

쿠키를 설정하려면 `cookies.set(name, value, options)`를 사용하세요. SvelteKit은 `path`를 기본적으로 `/`로 지정하므로 앱 전체에서 쿠키를 사용할 수 있습니다.

```js
/// file: src/routes/+page.server.js
export function load({ cookies }) {
	const visited = cookies.get('visited');

	+++cookies.set('visited', 'true');+++

	return {
		visited: visited === 'true'
	};
}
```

이제 iframe을 새로고침하면 `Hello stranger!`가 `Hello friend!`로 바뀝니다.

`cookies.set(name, ...)`을 호출하면 `Set-Cookie` 헤더가 작성될 뿐 *아니라* 내부 쿠키 맵도 갱신됩니다. 따라서 같은 요청 안에서 이후에 `cookies.get(name)`을 호출하면 갱신된 값이 반환됩니다. 내부적으로 `cookies` API는 널리 쓰이는 `cookie` 패키지를 사용하며, `cookies.set`에 전달하는 옵션은 대체로 이 패키지의 [`Set-Cookie` 객체](https://github.com/jshttp/cookie#set-cookie-object)를 따릅니다. SvelteKit은 쿠키를 더 안전하게 만들기 위해 다음 기본값을 설정합니다:

```js
{
	httpOnly: true,
	secure: true,
	sameSite: 'lax',
	path: '/'
}
```
