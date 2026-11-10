---
title: 고급 라우팅
tags: routing
---

## 나머지 매개변수 <!-- Rest parameters -->

라우트 세그먼트의 개수를 알 수 없다면 나머지(rest) 문법을 사용할 수 있습니다. 예를 들어 GitHub의 파일 뷰어는 다음과 같이 구현할 수 있습니다...

```sh
/[org]/[repo]/tree/[branch]/[...file]
```

...이 경우 `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md`로 요청하면 페이지에서 다음 매개변수를 사용할 수 있습니다:

```js
// @noErrors
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'main',
	file: 'documentation/docs/04-advanced-routing.md'
}
```

> [!NOTE] `src/routes/a/[...rest]/z/+page.svelte`는 `/a/b/z`, `/a/b/c/z` 등은 물론 `/a/z`(즉, 매개변수가 전혀 없는 경우)와도 일치합니다. 나머지 매개변수의 값이 올바른지 반드시 확인하세요. 예를 들어 [매처](#Matching)를 사용할 수 있습니다.

### 404 페이지 <!-- 404 pages -->

나머지 매개변수를 사용하면 404 페이지를 직접 만들어 렌더링할 수도 있습니다. 다음과 같은 라우트가 있다고 해 봅시다...

```tree
src/routes/
├ marx-brothers/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

...`/marx-brothers/karl`에 방문하면 일치하는 라우트가 없으므로 `marx-brothers/+error.svelte` 파일은 렌더링되지 _않습니다_. 중첩된 에러 페이지를 렌더링하려면 모든 `/marx-brothers/*` 요청과 일치하는 라우트를 만들고, 거기서 404를 반환해야 합니다:

```tree
src/routes/
├ marx-brothers/
+++| ├ [...path]/+++
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
/// file: src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	error(404, 'Not Found');
}
```

> [!NOTE] 404 상황을 처리하지 않으면 [`handleError`](hooks#handleError)에 `kind: 'framework'`인 [프레임워크 에러](errors#Framework-errors)로 나타납니다. 처리하면 `kind: 'app'`으로 나타납니다.

## 선택적 매개변수 <!-- Optional parameters -->

`[lang]/home` 같은 라우트에는 `lang`이라는 필수 매개변수가 있습니다. 때로는 이런 매개변수를 선택적으로 만드는 편이 좋은데, 이 예시라면 `home`과 `en/home`이 모두 같은 페이지를 가리키게 할 수 있습니다. 매개변수를 대괄호 한 쌍으로 더 감싸면 됩니다: `[[lang]]/home`

매개변수는 '탐욕적으로(greedily)' 일치하므로, 선택적 라우트 매개변수는 나머지 매개변수 뒤에 올 수 없습니다(`[...rest]/[[optional]]`). 그렇게 하면 선택적 매개변수는 항상 쓰이지 않기 때문입니다.

## 매칭 <!-- Matching -->

`src/routes/fruits/[page]` 같은 라우트는 `/fruits/apple`과 일치하지만 `/fruits/rocketship`과도 일치합니다. 이는 원하는 동작이 아닙니다. `src/params.js` 파일(또는 `src/params.ts`)에 *매처*를 추가하면 라우트 매개변수가 올바른 형식인지 보장할 수 있습니다...

```js
/// file: src/params.js
import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	fruit: (param) => {
		if (param !== 'apple' && param !== 'orange') return;
		return param;
	}
});
```

...그리고 라우트를 다음과 같이 확장합니다:

```
src/routes/fruits/[page+++=fruit+++]
```

경로명이 일치하지 않으면 SvelteKit은 (아래에서 설명할 정렬 순서에 따라) 다른 라우트와 일치하는지 시도한 뒤, 결국 404를 반환합니다. 일치하면 반환된 값이 매개변수 값으로 전달됩니다.

[Standard Schema](https://standardschema.dev)를 사용할 수도 있습니다. 예를 들어 [Valibot](https://valibot.dev)을 쓰면 다음과 같습니다:

```js
/// file: src/params.js
import { defineParams } from '@sveltejs/kit/params';
import * as v from 'valibot';

export const params = defineParams({
	number: v.pipe(v.string(), v.toNumber())
});
```

검증에 실패하면 라우트가 일치하지 않습니다. 성공하면 매개변수는 스키마의 출력 타입으로 타입이 지정되며, 이 타입은 `string`, `boolean`, `number`(위 예시처럼) 또는 `bigint`를 확장해야 합니다:

```js
/// file: src/routes/items/[id=number]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	console.log(typeof params.id); // 'number'
}
```

변환은 *대칭적*이어야 합니다. 숫자로 변환했다면 그 숫자에 `toString()`을 호출했을 때 원래 문자열이 나와야 합니다. 그래야 [`resolve`]($app-paths#resolve) 함수가 경로명을 올바르게 만들 수 있습니다:

```js
import { resolve } from '$app/paths';

resolve('/blog/[id=number]', { id: 1 });
```

> [!NOTE] 매처는 서버와 브라우저 양쪽에서 실행됩니다.

> [!NOTE] SvelteKit 3 이전에는 각 매개변수 매처를 `params` 폴더 아래의 별도 파일에 정의해야 했고(예: `export const match = (param) => param === 'foo';`가 들어 있는 `src/params/foo.js`), 매칭 여부는 매처가 truthy 값을 반환하는지로 결정되었습니다(즉, 값 변환은 일어나지 않았습니다).

## 정렬 <!-- Sorting -->

하나의 경로에 여러 라우트가 일치할 수 있습니다. 예를 들어 다음 라우트는 모두 `/foo-abc`와 일치합니다:

```sh
src/routes/[...catchall]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/foo-abc/+page.svelte
```

SvelteKit은 어떤 라우트가 요청되었는지 알아야 합니다. 그래서 다음 규칙에 따라 라우트를 정렬합니다...

- 더 구체적인 라우트가 우선순위가 높습니다(예: 매개변수가 없는 라우트는 동적 매개변수가 하나 있는 라우트보다 더 구체적입니다)
- [매처](#Matching)가 있는 매개변수(`[name=type]`)는 매처가 없는 매개변수(`[name]`)보다 우선순위가 높습니다
- `[[optional]]`과 `[...rest]` 매개변수는 라우트의 마지막 부분이 아니라면 무시되며, 마지막 부분이라면 가장 낮은 우선순위로 취급됩니다. 다시 말해 정렬할 때 `x/[[y]]/z`는 `x/z`와 같게 취급됩니다
- 우선순위가 같으면 알파벳 순으로 정합니다

...결과적으로 다음과 같은 순서가 되며, `/foo-abc`는 `src/routes/foo-abc/+page.svelte`를, `/foo-def`는 덜 구체적인 라우트가 아닌 `src/routes/foo-[c]/+page.svelte`를 호출합니다:

```sh
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## 인코딩 <!-- Encoding -->

어떤 문자는 파일 시스템에서 쓸 수 없습니다. Linux와 Mac에서는 `/`, Windows에서는 `\ / : * ? " < > |`가 그렇습니다. `#`과 `%` 문자는 URL에서 특별한 의미가 있고, `[ ] ( )` 문자는 SvelteKit에서 특별한 의미가 있으므로 이 문자들도 라우트 이름에 직접 쓸 수 없습니다.

라우트에서 이런 문자를 쓰려면 16진수 이스케이프 시퀀스를 사용하면 됩니다. 형식은 `[x+nn]`이며, `nn`은 16진수 문자 코드입니다:

- `\` — `[x+5c]`
- `/` — `[x+2f]`
- `:` — `[x+3a]`
- `*` — `[x+2a]`
- `?` — `[x+3f]`
- `"` — `[x+22]`
- `<` — `[x+3c]`
- `>` — `[x+3e]`
- `|` — `[x+7c]`
- `#` — `[x+23]`
- `%` — `[x+25]`
- `[` — `[x+5b]`
- `]` — `[x+5d]`
- `(` — `[x+28]`
- `)` — `[x+29]`

예를 들어 `/smileys/:-)` 라우트를 만들려면 `src/routes/smileys/[x+3a]-[x+29]/+page.svelte` 파일을 만들면 됩니다.

문자의 16진수 코드는 JavaScript로 알아낼 수 있습니다:

```js
':'.charCodeAt(0).toString(16); // '3a', hence '[x+3a]'
```

유니코드 이스케이프 시퀀스를 사용할 수도 있습니다. 보통은 인코딩하지 않은 문자를 직접 쓰면 되므로 필요 없지만, 어떤 이유로 예를 들어 파일 이름에 이모지를 넣을 수 없다면 이스케이프된 문자를 사용할 수 있습니다. 다시 말해 다음 둘은 같습니다:

```
src/routes/[u+d83e][u+dd2a]/+page.svelte
src/routes/🤪/+page.svelte
```

유니코드 이스케이프 시퀀스의 형식은 `[u+nnnn]`이며, `nnnn`은 `0000`부터 `10ffff` 사이의 유효한 값입니다. (JavaScript 문자열 이스케이프와 달리 `ffff`보다 큰 코드 포인트를 나타내기 위해 서로게이트 쌍을 쓸 필요가 없습니다.) 유니코드 인코딩에 대해 더 알아보려면 [Programming with Unicode](https://unicodebook.readthedocs.io/unicode_encodings.html)를 참고하세요.

> [!NOTE] TypeScript는 `.` 문자로 시작하는 디렉터리를 잘 [처리하지 못하므로](https://github.com/microsoft/TypeScript/issues/13399), [`.well-known`](https://en.wikipedia.org/wiki/Well-known_URI) 같은 라우트를 만들 때는 이 문자를 인코딩하는 것이 유용할 수 있습니다: `src/routes/[x+2e]well-known/...`

## 고급 레이아웃 <!-- Advanced layouts -->

기본적으로 *레이아웃 계층*은 *라우트 계층*을 그대로 따릅니다. 하지만 경우에 따라서는 이것이 원하는 동작이 아닐 수 있습니다.

### (group)

어떤 라우트는 하나의 레이아웃을 써야 하는 '앱' 라우트이고(예: `/dashboard`나 `/item`), 다른 라우트는 다른 레이아웃을 써야 하는 '마케팅' 라우트일 수 있습니다(`/about`이나 `/testimonials`). 이런 라우트는 이름을 괄호로 감싼 디렉터리로 묶을 수 있습니다. 일반 디렉터리와 달리 `(app)`과 `(marketing)`은 그 안에 있는 라우트의 URL 경로명에 영향을 주지 않습니다:

```tree
src/routes/
+++│ (app)/+++
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
+++│ (marketing)/+++
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

`+page`를 `(group)` 안에 직접 넣을 수도 있습니다. 예를 들어 `/`가 `(app)` 페이지나 `(marketing)` 페이지여야 하는 경우입니다.

### 레이아웃에서 벗어나기 <!-- Breaking out of layouts -->

루트 레이아웃은 앱의 모든 페이지에 적용되며, 생략하면 기본값은 `{@render children()}`입니다. 일부 페이지가 나머지와 다른 레이아웃 계층을 갖게 하려면, 공통 레이아웃을 상속하지 않아야 하는 라우트를 _제외한_ 앱 전체를 하나 이상의 그룹 안에 넣으면 됩니다.

위 예시에서 `/admin` 라우트는 `(app)` 레이아웃도, `(marketing)` 레이아웃도 상속하지 않습니다.

### +page@

페이지는 라우트별로 현재 레이아웃 계층에서 벗어날 수 있습니다. 이전 예시의 `(app)` 그룹 안에 `/item/[id]/embed` 라우트가 있다고 해 봅시다:

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+++│ │ │ │ └ +page.svelte+++
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

보통 이 라우트는 루트 레이아웃, `(app)` 레이아웃, `item` 레이아웃, `[id]` 레이아웃을 상속합니다. `@` 뒤에 세그먼트 이름을 붙이면(루트 레이아웃이라면 빈 문자열) 이 레이아웃 중 하나로 초기화할 수 있습니다. 이 예시에서는 다음 중에서 고를 수 있습니다:

- `+page@[id].svelte` - `src/routes/(app)/item/[id]/+layout.svelte`를 상속합니다
- `+page@item.svelte` - `src/routes/(app)/item/+layout.svelte`를 상속합니다
- `+page@(app).svelte` - `src/routes/(app)/+layout.svelte`를 상속합니다
- `+page@.svelte` - `src/routes/+layout.svelte`를 상속합니다

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+++│ │ │ │ └ +page@(app).svelte+++
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### +layout@

페이지와 마찬가지로 레이아웃도 같은 방법으로 *자기 자신*이 부모 레이아웃 계층에서 벗어날 수 있습니다. 예를 들어 `+layout@.svelte` 컴포넌트는 모든 자식 라우트의 계층을 초기화합니다.

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page.svelte  // uses (app)/item/[id]/+layout.svelte
│ │ │ ├ +layout.svelte  // inherits from (app)/item/+layout@.svelte
│ │ │ └ +page.svelte    // uses (app)/item/+layout@.svelte
│ │ └ +layout@.svelte   // inherits from root layout, skipping (app)/+layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### 레이아웃 그룹을 써야 할 때 <!-- When to use layout groups -->

모든 사례가 레이아웃 그룹에 적합한 것은 아니며, 꼭 써야 한다는 부담을 가질 필요도 없습니다. 사례에 따라 `(group)`이 복잡하게 중첩될 수도 있고, 예외 하나 때문에 `(group)`을 도입하고 싶지 않을 수도 있습니다. 컴포지션(재사용 가능한 `load` 함수나 Svelte 컴포넌트)이나 if 문 같은 다른 수단으로 원하는 결과를 얻어도 전혀 문제없습니다. 다음 예시는 루트 레이아웃으로 되돌아가면서, 다른 레이아웃에서도 쓸 수 있는 컴포넌트와 함수를 재사용하는 레이아웃입니다:

```svelte
<!--- file: src/routes/nested/route/+layout@.svelte --->
<script>
	import ReusableLayout from '#lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
/// file: src/routes/nested/route/+layout.js
// @filename: ambient.d.ts
declare module "#lib/reusable-load-function.js" {
	export function reusableLoad(event: import('@sveltejs/kit').LoadEvent): Promise<Record<string, any>>;
}
// @filename: index.js
// ---cut---
import { reusableLoad } from '#lib/reusable-load-function.js';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	// Add additional logic here, if needed
	return reusableLoad(event);
}
```

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 고급 라우팅](/tutorial/kit/optional-params)
