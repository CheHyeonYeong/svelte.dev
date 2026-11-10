---
title: 원격 함수
---

<blockquote class="since note">
	<p>2.27부터 사용 가능</p>
</blockquote>

원격 함수는 클라이언트와 서버 사이의 타입 안전한 통신을 위한 도구입니다. 앱 어디에서나 *호출*할 수 있지만 항상 서버에서 *실행*되므로, 환경 변수나 데이터베이스 클라이언트 같은 것을 담고 있는 [서버 전용 모듈](server-only-modules)에 안전하게 접근할 수 있습니다.

Svelte의 실험적 [`await`](/docs/svelte/await-expressions) 지원과 함께 사용하면 컴포넌트 안에서 바로 데이터를 불러오고 조작할 수 있습니다.

이 기능은 현재 실험적 기능이므로 버그가 있을 가능성이 높고 예고 없이 바뀔 수 있습니다. 사용하려면 `vite.config.js`의 SvelteKit 플러그인에 `compilerOptions.experimental.async`와 `experimental.remoteFunctions` 옵션을 추가해 직접 활성화해야 합니다:

```js
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			experimental: {
				+++remoteFunctions: true+++
			},
			compilerOptions: {
				experimental: {
					+++async: true+++
				}
			}
		})
	],
});
```

## 개요 <!-- Overview -->

원격 함수는 *원격 모듈*에서 내보냅니다. 원격 모듈은 파일 이름에 `remote` 부분이 들어간 파일입니다(예: `remote.ts`, `data.remote.ts`). 원격 함수에는 `query`, `form`, `command`, `prerender` 네 가지 종류가 있습니다. 클라이언트에서는 내보낸 함수가 `fetch` 래퍼로 변환되며, 이 래퍼는 생성된 HTTP 엔드포인트를 통해 서버에 있는 대응 함수를 호출합니다. 원격 모듈은 `src` 디렉터리 안 어디에나 둘 수 있으며(`server` 디렉터리 안은 제외합니다. 그 안의 파일은 [클라이언트 사이드 코드에서 가져올 수 없습니다](server-only-modules)), `peerDependencies`에 `@sveltejs/kit`을 명시한 서드파티 라이브러리도 원격 모듈을 제공할 수 있습니다.

## query

`query` 함수를 사용하면 서버에서 동적 데이터를 읽을 수 있습니다.

> [!NOTE] _정적_ 데이터라면 대신 [`prerender`](#prerender) 함수를 고려하세요. 페이지 전체가 프리렌더링될 때(즉 페이지나 상위 레이아웃에 [`export const prerender = true`](page-options#prerender)가 적용된 경우), 예를 들어 [`adapter-static`](adapter-static)을 사용할 때는 쿼리를 사용할 수 없습니다.

```js
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import { query } from '$app/server';
import * as db from '#lib/server/database.js';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
```

> [!NOTE] 이 페이지 곳곳에서 `#lib/server/database.js`나 `#lib/server/auth.js` 같은 가상의 모듈을 가져오는 코드를 보게 될 것입니다. 이는 순전히 설명을 위한 것이며, 원하는 데이터베이스 클라이언트와 인증 설정을 무엇이든 사용할 수 있습니다.
>
> 위의 `db.sql` 함수는 보간된 값을 모두 이스케이프하는 [태그드 템플릿 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)입니다.

`getPosts`가 반환하는 쿼리는 `posts`로 이행되는 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)처럼 동작합니다:

```svelte
<!--- file: src/routes/blog/+page.svelte --->
<script>
	import { getPosts } from './data.remote';
</script>

<h1>Recent posts</h1>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

프로미스가 이행될 때까지, 그리고 오류가 발생하면 가장 가까운 [`<svelte:boundary>`](../svelte/svelte-boundary)가 동작합니다.

`await`를 사용하는 방식을 권장하지만, 대안으로 쿼리에는 `loading`, `error`, `current` 속성도 있습니다:

```svelte
<!--- file: src/routes/blog/+page.svelte --->
<script>
	import { getPosts } from './data.remote';

	const query = getPosts();
</script>

<h1>Recent posts</h1>

{#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else}
	<ul>
		{#each query.current as { title, slug }}
			<li><a href="/blog/{slug}">{title}</a></li>
		{/each}
	</ul>
{/if}
```

> [!NOTE] 이 문서의 나머지 부분에서는 `await` 방식을 사용합니다.

### 쿼리 인수 <!-- Query arguments -->

쿼리 함수는 개별 게시물의 `slug` 같은 인수를 받을 수 있습니다:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	import { getPost } from '../data.remote';

	let { params } = $props();

	const post = $derived(await getPost(params.slug));
</script>

<h1>{post.title}</h1>
<div>{@html post.content}</div>
```

`getPost`는 HTTP 엔드포인트를 노출하므로, 이 인수가 올바른 타입인지 검증하는 것이 중요합니다. 이를 위해 [Zod](https://zod.dev/)나 [Valibot](https://valibot.dev/) 같은 [Standard Schema](https://standardschema.dev/) 유효성 검사 라이브러리를 사용할 수 있습니다:

```js
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import * as db from '#lib/server/database.js';

export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post
		WHERE slug = ${slug}
	`;

	if (!post) error(404, 'Not found');
	return post;
});
```

인수와 반환값은 모두 [devalue](https://github.com/sveltejs/devalue)로 직렬화되며, devalue는 JSON뿐 아니라 `Date`, `Map` 같은 타입(그리고 [transport 훅](hooks#transport)에서 정의한 사용자 정의 타입)도 처리합니다.

> [!NOTE] `query`와 `prerender`의 인수(반환값은 제외)에서는 객체, 맵, 세트를 정렬하므로 같은 멤버를 가진 인스턴스는 같은 캐시 키가 됩니다. 예를 들어 `getPosts({ limit: 10, offset: 10 })`과 `getPosts({ offset: 10, limit: 10 })`은 같은 캐시 키가 됩니다. 순서가 중요하다면 배열을 사용해야 합니다.

### 중복 제거 <!-- Deduplication -->

쿼리 함수를 호출하면 SvelteKit은 호출에 사용한 인수를 직렬화해 캐시 키로 사용합니다. 서버에서는 이를 이용해 요청 범위의 캐시를 만들므로, 같은 쿼리를 여러 번 호출해도 작업은 한 번만 일어납니다. 클라이언트에서도 SvelteKit은 비슷하게 동작합니다. 같은 쿼리를 똑같이 여러 번 호출하면 모두 같은 인스턴스를 가리킵니다.

쿼리는 컴포넌트, 이벤트 핸들러, 유니버설 `load` 함수, 비동기 콜백 등 어떤 맥락에서든 `await`할 수 있으며, SvelteKit은 같은 쿼리를 사용하는 다른 소비자와 중복을 제거합니다. 예를 들면 다음과 같습니다:

```svelte
<script>
	import { getData } from './data.remote.js';

  // awaited inside the component template — populates the cache
  const data = getData();
</script>

<p>{await data}</p>

<!-- this dedupes with the component-level use above; no extra request -->
<button onclick={async () => console.log(await getData())}>
	click me!
</button>
```

캐시는 쿼리가 활발히 사용되는 동안, 즉 컴포넌트에서 렌더링되거나, 현재 await되고 있거나, 그 밖의 방식으로 참조되는 동안 공유됩니다. 더 이상 아무것도 쿼리를 사용하지 않으면 캐시된 값은 해제됩니다.

### 쿼리 새로 고치기 <!-- Refreshing queries -->

모든 쿼리는 `refresh` 메서드로 다시 가져올 수 있으며, 이 메서드는 서버에서 최신 값을 받아옵니다:

```svelte
<button onclick={() => getPosts().refresh()}>
	Check for new posts
</button>
```

> [!NOTE] 쿼리는 페이지에 있는 동안 캐시되므로 `getPosts() === getPosts()`입니다. 따라서 쿼리를 업데이트하려고 `const posts = getPosts()` 같은 참조를 따로 들고 있을 필요가 없습니다.

## query.batch

`query.batch`는 `query`와 비슷하게 동작하지만, 같은 매크로태스크 안에서 일어나는 요청을 한데 모아 처리(batch)합니다. 이렇게 하면 이른바 n+1 문제가 해결됩니다. 예를 들어 쿼리마다 별도의 데이터베이스 호출이 일어나는 대신, 동시에 발생한 쿼리가 한 그룹으로 묶입니다.

서버에서 콜백은 함수 호출에 사용된 인수들의 배열을 받습니다. 콜백은 `(input: Input, index: number) => Output` 형태의 함수를 반환해야 합니다. 그러면 SvelteKit은 각 입력 인수로 이 함수를 호출해 개별 호출을 각각의 결과로 이행합니다.

```js
/// file: weather.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { query } from '$app/server';
import * as db from '#lib/server/database.js';

export const getWeather = query.batch(v.string(), async (cityIds) => {
	const weather = await db.sql`
		SELECT * FROM weather
		WHERE city_id = ANY(${cityIds})
	`;
	const lookup = new Map(weather.map(w => [w.city_id, w]));

	return (cityId) => lookup.get(cityId);
});
```

```svelte
<!--- file: Weather.svelte --->
<script>
	import CityWeather from './CityWeather.svelte';
	import { getWeather } from './weather.remote';

	let { cities } = $props();
	let limit = $state(5);
</script>

<h2>Weather</h2>

{#each cities.slice(0, limit) as city}
	<h3>{city.name}</h3>
	<CityWeather weather={await getWeather(city.id)} />
{/each}

{#if cities.length > limit}
	<button onclick={() => limit += 5}>
		Load more
	</button>
{/if}
```

## query.live

`query.live`는 서버의 실시간 데이터에 접근하기 위한 것입니다. `query`와 비슷하게 동작하지만, 콜백(보통 비동기 [제너레이터 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function*))이 `AsyncIterable`을 반환합니다:

```js
import { query } from '$app/server';

export const getTime = query.live(async function* () {
	while (true) {
		yield new Date();
		await new Promise((f) => setTimeout(f, 1000));
	}
});
```

서버 사이드 렌더링 중에 `await getTime()`은 처음 yield된 값을 반환한 뒤 이터레이터를 닫습니다. 이 초기값은 직렬화되어 하이드레이션 중에 재사용됩니다.

클라이언트에서는 쿼리가 컴포넌트에서 활발히 사용되는 동안 연결을 유지합니다. 여러 인스턴스는 하나의 연결을 공유합니다. 활성 사용처가 하나도 남지 않으면 스트림 연결이 끊어지고 서버 측 반복도 멈춥니다.

라이브 쿼리는 `connected` 속성과 `reconnect()` 메서드를 제공합니다:

```svelte
<script>
	import { getTime } from './time.remote.js';

	const time = getTime();
</script>

<p>{await time}</p>
<p>connected: {time.connected}</p>
<button onclick={() => time.reconnect()}>Reconnect</button>
```

연결이 끊어지면 `connected`가 `false`가 됩니다. SvelteKit은 지수 백오프(exponential backoff)로 수동적으로 재연결을 시도하고, `navigator.onLine`이 `false`에서 `true`로 바뀌면 능동적으로 재연결합니다.

라이브 쿼리는 스스로 업데이트되므로, `query`와 달리 `refresh()` 메서드가 없습니다.

(반응형 `current` 속성 대신) 값이 흘러나오는 기반 스트림에 명령형으로 직접 접근해야 한다면, 라이브 쿼리 인스턴스 자체가 [비동기 이터러블](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)이라는 점을 활용하세요. 인스턴스를 바로 `for await`로 순회할 수 있습니다:

```js
// @filename: time.remote.ts
import type { RemoteLiveQueryFunction } from '$app/server';
export declare const getTime: RemoteLiveQueryFunction<undefined, Date>;
// @errors: 2304
// @filename: index.js
import { getTime } from './time.remote.js';
// ---cut---
async function logTimes() {
	for await (const value of getTime()) {
		console.log(value);
		if (someCondition) break;
	}
}
```

같은 라이브 쿼리를 사용하는 여러 소비자는 (`await`나 `current`를 통한 반응형 방식이든, 명령형 `for await` 루프든) 하나의 기반 연결을 공유합니다. `for await` 이터레이터에 처음 yield되는 값은, 이미 받은 값이 있다면 가장 최근에 받은 값입니다. 이는 리소스를 직접 await할 때의 의미와 같습니다. 그 뒤로는 서버에서 새 값이 도착할 때마다 yield됩니다. 소비자가 이터레이터를 소진하는 속도보다 값이 더 빨리 도착하면 대기 중인 값 중 가장 최신 값만 유지됩니다. 라이브 스트림은 이벤트 로그가 아닙니다.

서버에서도 마찬가지로 `for await`는 기반 제너레이터의 요청별 공유 반복에 합류하므로, 같은 요청 안의 동시 소비자들 때문에 사용자 정의 제너레이터가 여러 번 실행되지 않습니다.

> [!NOTE] 라이브 쿼리 응답을 서비스 워커에서 캐시하지 않는 것이 매우 중요합니다. 복제된 응답은 페이지가 닫힌 뒤에도 한참 동안 스트리밍을 계속하기 때문입니다. 캐시 로직이 `no-store`를 포함한 `Cache-Control` 헤더가 있는 응답을 모두 제외하는지 확인하세요.

## form

`form` 함수를 사용하면 서버에 데이터를 쉽게 쓸 수 있습니다. 이 함수는 제출된 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)로 구성한 `data`를 받는 콜백을 인수로 받고...

```ts
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}

declare module '#lib/server/auth.js' {
	interface User {
		name: string;
	}

	/**
	 * Gets a user's info from their cookies, using `getRequestEvent`
	 */
	export function getUser(): Promise<User | null>;
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { query, form } from '$app/server';
import * as db from '#lib/server/database.js';
import * as auth from '#lib/server/auth.js';

export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => { /* ... */ });

export const createPost = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content:v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, content }) => {
		// Check the user is logged in
		const user = await auth.getUser();
		if (!user) error(401, 'Unauthorized');

		const slug = title.toLowerCase().replace(/ /g, '-');

		// Insert into the database
		await db.sql`
			INSERT INTO post (slug, title, content)
			VALUES (${slug}, ${title}, ${content})
		`;

		// Redirect to the newly created page
		redirect(303, `/blog/${slug}`);
	}
);
```

...`<form>` 요소에 펼쳐 넣을(spread) 수 있는 객체를 반환합니다. 콜백은 폼이 제출될 때마다 호출됩니다.

```svelte
<!--- file: src/routes/blog/new/+page.svelte --->
<script>
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}>
	<!-- form content goes here -->

	<button>Publish!</button>
</form>
```

폼 객체에는 `method`와 `action` 속성이 있어 JavaScript 없이도 동작합니다(즉 데이터를 제출하고 페이지를 다시 불러옵니다). 또한 JavaScript를 사용할 수 있을 때 폼을 점진적으로 향상시켜, 전체 페이지를 다시 불러오지 *않고* 데이터를 제출하게 해 주는 [어태치먼트(attachment)](/docs/svelte/@attach)도 가지고 있습니다.

`query`와 마찬가지로, 콜백이 제출된 `data`를 사용한다면 `form`의 첫 번째 인수로 [Standard Schema](https://standardschema.dev)를 전달해 [검증](#query-Query-arguments)해야 합니다.

### 필드 <!-- Fields -->

폼은 스키마로 정의되는 *필드*들로 구성됩니다. `createPost`의 경우 `title`과 `content`라는 두 필드가 있으며, 둘 다 문자열입니다. 필드의 속성을 얻으려면 사용할 [input 타입](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types)을 지정해 필드의 `.as(...)` 메서드를 호출합니다. 대부분의 input 타입에서는 두 번째 인수를 전달해(`.as(type, value)`) 렌더링되는 값을 제어할 수도 있습니다:

```svelte
<form {...createPost}>
	<label>
		<h2>Title</h2>
		+++<input {...createPost.fields.title.as('text')} />+++
	</label>

	<label>
		<h2>Write your post</h2>
		+++<textarea {...createPost.fields.content.as('text')}></textarea>+++
	</label>

	<button>Publish!</button>
</form>
```

이 속성들 덕분에 SvelteKit은 올바른 input 타입을 설정하고, 핸들러에 전달되는 `data`를 구성하는 데 쓰이는 `name`을 설정하며, 폼의 `value`를 채우고(예를 들어 제출에 실패한 뒤 사용자가 모든 것을 다시 입력하지 않아도 되도록), [`aria-invalid`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid) 상태를 설정할 수 있습니다.

`.as(...)`에 두 번째 인수를 전달하는 방식은 수정 폼이나 [`for(...)`](#form-Multiple-instances-of-a-form)로 만든 여러 인스턴스처럼 기존 데이터로 폼을 렌더링할 때 유용합니다. 요소가 렌더링될 때 값을 설정할 뿐 아니라, 폼이 초기화될 때의 요소 값도 결정합니다. `radio`, `submit`, `hidden` input에는 항상 이 값이 필요하고, `checkbox` input은 배열 필드의 한 선택지를 나타낼 때 이 값이 필요합니다. 이런 `radio`와 `checkbox` input에서는 두 번째 인수가 선택지를 식별하므로, 현재 체크되어 있는지 여부는 세 번째 인수로 전달합니다. 예: `.as('radio', option, settings.visibility === option)`, `.as('checkbox', tag, settings.tags.includes(tag))`. `file` input은 이런 방식으로 값을 채울 수 없습니다.

> [!NOTE] 생성되는 `name` 속성은 JS 객체 표기법을 사용합니다(예: `nested.array[0].value`). `object['nested-array'][0].value`처럼 따옴표가 필요한 문자열 키는 지원하지 않습니다. 내부적으로 불리언 체크박스와 숫자 필드의 이름에는 각각 `b:`와 `n:` 접두사가 붙어, 유효성 검사 전에 문자열 값을 변환하라고 SvelteKit에 알려 줍니다.

필드는 객체와 배열 안에 중첩될 수 있고, 값은 문자열, 숫자, 불리언, `File` 객체일 수 있습니다. 예를 들어 스키마가 다음과 같다면...

```js
/// file: data.remote.js
import * as v from 'valibot';
import { form } from '$app/server';
// ---cut---
const datingProfile = v.object({
	name: v.string(),
	photo: v.file(),
	info: v.object({
		height: v.number(),
		likesDogs: v.optional(v.boolean(), false)
	}),
	attributes: v.array(v.string())
});

export const createProfile = form(datingProfile, (data) => { /* ... */ });
```

...폼은 다음과 같은 모습일 수 있습니다:

```svelte
<script>
	import { createProfile } from './data.remote';

	const { name, photo, info, attributes } = createProfile.fields;
</script>

<form {...createProfile} enctype="multipart/form-data">
	<label>
		<input {...name.as('text')} /> Name
	</label>

	<label>
		<input {...photo.as('file')} /> Photo
	</label>

	<label>
		<input {...info.height.as('number')} /> Height (cm)
	</label>

	<label>
		<input {...info.likesDogs.as('checkbox')} /> I like dogs
	</label>

	<h2>My best attributes</h2>
	<input {...attributes[0].as('text')} />
	<input {...attributes[1].as('text')} />
	<input {...attributes[2].as('text')} />

	<button>submit</button>
</form>
```

폼에 `file` input이 있으므로 `enctype="multipart/form-data"` 속성을 추가했습니다. `info.height`와 `info.likesDogs`의 값은 각각 숫자와 불리언으로 변환됩니다.

> [!NOTE] `checkbox` input이 체크되지 않으면, SvelteKit이 데이터를 구성하는 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 객체에 그 값이 포함되지 않습니다. 따라서 스키마에서 값을 단순히 선택 사항으로 표시하는 대신 기본값 `false`를 지정해야 합니다. Valibot에서는 그냥 `v.boolean()` 대신 `v.optional(v.boolean(), false)`를, Zod에서는 그냥 `z.boolean()` 대신 `z.boolean().default(false)`를 사용한다는 뜻입니다.

모두 같은 필드에 속하는 `radio`와 `checkbox` input의 경우, `.as(...)`의 두 번째 인수로 `value`를 지정해야 합니다:

```js
/// file: constants.js
export const operatingSystems = /** @type {const} */ (['windows', 'mac', 'linux']);
export const languages = /** @type {const} */ (['html', 'css', 'js']);
```

```js
/// file: data.remote.js
// @filename: constants.js
export const operatingSystems = /** @type {const} */ (['windows', 'mac', 'linux']);
export const languages = /** @type {const} */ (['html', 'css', 'js']);
// @filename: index.js
import * as v from 'valibot';
import { form } from '$app/server';
// ---cut---
import { operatingSystems, languages } from './constants';

export const survey = form(
	v.object({
		operatingSystem: v.picklist(operatingSystems),
		languages: v.optional(v.array(v.picklist(languages)), []),
	}),
	(data) => { /* ... */ },
);
```

```svelte
<form {...survey}>
	<h2>Which operating system do you use?</h2>

	{#each operatingSystems as os}
		<label>
			<input {...survey.fields.operatingSystem.as('radio', os)}>
			{os}
		</label>
	{/each}

	<h2>Which languages do you write code in?</h2>

	{#each languages as language}
		<label>
			<input {...survey.fields.languages.as('checkbox', language)}>
			{language}
		</label>
	{/each}

	<button>submit</button>
</form>
```

또는 `select`와 `select multiple`을 사용할 수도 있습니다:

```svelte
<form {...survey}>
	<h2>Which operating system do you use?</h2>

	<select {...survey.fields.operatingSystem.as('select')}>
		{#each operatingSystems as os}
			<option>{os}</option>
		{/each}
	</select>

	<h2>Which languages do you write code in?</h2>

	<select {...survey.fields.languages.as('select multiple')}>
		{#each languages as language}
			<option>{language}</option>
		{/each}
	</select>

	<button>submit</button>
</form>
```

> [!NOTE] 체크되지 않은 `checkbox` input과 마찬가지로, 아무것도 선택하지 않으면 데이터는 `undefined`가 됩니다. 그래서 `languages` 필드는 그냥 `v.array(...)`가 아니라 `v.optional(v.array(...), [])`를 사용합니다.

### 프로그래밍 방식의 유효성 검사 <!-- Programmatic validation -->

선언적인 스키마 유효성 검사 외에도, `@sveltejs/kit`의 `invalid` 헬퍼를 사용해 폼 핸들러 안에서 프로그래밍 방식으로 필드를 유효하지 않다고 표시할 수 있습니다. 어떤 작업을 실제로 수행해 보기 전까지는 유효한지 알 수 없는 경우에 유용합니다.

- `redirect`나 `error`와 똑같이 예외를 던집니다
- 여러 인수를 받을 수 있으며, 각 인수는 문자열(폼 전체에 관한 문제로, `fields.allIssues()`에만 표시됩니다)이거나 Standard Schema를 따르는 이슈(특정 필드에 관한 문제)입니다. 이런 이슈를 타입 안전하게 만들려면 `issue` 매개변수를 사용하세요:

```js
// @errors: 18046
/// file: src/routes/shop/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function buy(qty: number): Promise<void>
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { invalid } from '@sveltejs/kit';
import { form } from '$app/server';
import * as db from '#lib/server/database.js';

export const buyHotcakes = form(
	v.object({
		qty: v.pipe(
			v.number(),
			v.minValue(1, 'you must buy at least one hotcake')
		)
	}),
	async (data, issue) => {
		try {
			await db.buy(data.qty);
		} catch (e) {
			if (e.code === 'OUT_OF_STOCK') {
				invalid(
					issue.qty(`we don't have enough hotcakes`)
				);
			}
		}
	}
);
```

### 유효성 검사 <!-- Validation -->

제출된 데이터가 스키마를 통과하지 못하면 콜백은 실행되지 않습니다. 대신 유효하지 않은 각 필드의 `issues()` 메서드가 `{ message: string }` 객체의 배열을 반환하고, (`as(...)`가 반환하는) `aria-invalid` 속성이 `true`로 설정됩니다:

```svelte
<form {...createPost}>
	<label>
		<h2>Title</h2>

+++		{#each createPost.fields.title.issues() as issue}
			<p class="issue">{issue.message}</p>
		{/each}+++

		<input {...createPost.fields.title.as('text')} />
	</label>

	<label>
		<h2>Write your post</h2>

+++		{#each createPost.fields.content.issues() as issue}
			<p class="issue">{issue.message}</p>
		{/each}+++

		<textarea {...createPost.fields.content.as('text')}></textarea>
	</label>

	<button>Publish!</button>
</form>
```

`title`이 유효하거나 아직 검사되지 않았다면 `createPost.fields.title.issues()`는 `undefined`를 반환합니다.

폼이 제출될 때까지 기다렸다가 데이터를 검사할 필요는 없습니다. 예를 들어 `oninput` 콜백(키를 누를 때마다 데이터를 검사합니다)이나 `onchange` 콜백에서 프로그래밍 방식으로 `validate()`를 호출할 수 있습니다:

```svelte
<form {...createPost} oninput={() => createPost.validate()}>
	<!-- -->
</form>
```

기본적으로 사용자가 아직 상호작용하지 않은 폼 컨트롤에 속한 이슈는 무시됩니다. _모든_ 입력을 검사하려면 `validate({ includeUntouched: true })`를 호출하세요.

클라이언트 사이드 유효성 검사를 위해 _사전(preflight)_ 스키마를 지정할 수 있습니다. 이 스키마는 `issues()`를 채우고, 데이터가 유효하지 않으면 서버로 전송되지 않게 막습니다:

```svelte
<script>
	import * as v from 'valibot';
	import { createPost } from '../data.remote';

	const schema = v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	});
</script>

<h1>Create a new post</h1>

<form {...+++createPost.preflight(schema)+++}>
	<!-- -->
</form>
```

> [!NOTE] 적절하다면 사전 스키마로 서버 사이드 스키마와 같은 객체를 사용해도 되지만, '이 값이 이미 데이터베이스에 있는가' 같은 서버 측 검사는 할 수 없습니다. `.remote.ts`나 `.remote.js` 파일에서는 스키마를 내보낼 수 없으므로, 스키마는 공유 모듈에서 내보내거나 `<form>`이 있는 컴포넌트의 `<script module>` 블록에서 내보내야 합니다.

한 필드에 속한 이슈뿐 아니라 _모든_ 이슈의 목록을 얻으려면 `fields.allIssues()` 메서드를 사용하면 됩니다:

```svelte
{#each createPost.fields.allIssues() as issue}
	<p>{issue.message}</p>
{/each}
```

개별 필드와 마찬가지로, 폼 전체가 유효하면(또는 아직 검사되지 않았다면) `createPost.fields.allIssues()`는 `undefined`를 반환합니다.

### 입력 값 읽기/설정하기 <!-- Getting/setting inputs -->

각 필드에는 현재 값을 반영하는 `value()` 메서드가 있습니다. 사용자가 폼과 상호작용하면 자동으로 업데이트됩니다:

```svelte
<form {...createPost}>
	<!-- -->
</form>

<div class="preview">
	<h2>{createPost.fields.title.value()}</h2>
	<div>{@html render(createPost.fields.content.value())}</div>
</div>
```

또는 `createPost.fields.value()`는 `{ title, content }` 객체를 반환합니다.

필드의 `value()`는 `as`의 두 번째 인수로 제공한 기본값(`fields.title.as('text', '...')`처럼)을 필드가 수정되거나 제출되기 전까지는 반영하지 _않습니다_. `set(...)` 메서드로 필드(또는 필드 묶음)를 프로그래밍 방식으로 업데이트할 수 있습니다:

```svelte
<script>
	import { createPost } from '../data.remote';

	// this...
	createPost.fields.set({
		title: 'My new blog post',
		content: 'Lorem ipsum dolor sit amet...'
	});

	// ...is equivalent to this:
	createPost.fields.title.set('My new blog post');
	createPost.fields.content.set('Lorem ipsum dolor sit amet');
</script>
```

### 민감한 데이터 다루기 <!-- Handling sensitive data -->

점진적으로 향상되지 않은 폼 제출(즉 어떤 이유로든 JavaScript를 사용할 수 없는 경우)에서는 제출된 데이터가 유효하지 않을 때에도 `value()`가 채워지므로, 사용자가 폼 전체를 처음부터 다시 작성할 필요가 없습니다.

이름 앞에 밑줄을 붙이면 (비밀번호나 신용카드 번호 같은) 민감한 데이터가 사용자에게 다시 전송되지 않게 막을 수 있습니다:

```svelte
<form {...register}>
	<label>
		Username
		<input {...register.fields.username.as('text')} />
	</label>

	<label>
		Password
		<input +++{...register.fields._password.as('password')}+++ />
	</label>

	<button>Sign up!</button>
</form>
```

이 예제에서 데이터가 유효하지 않으면, 페이지를 다시 불러올 때 첫 번째 `<input>`만 채워집니다.

### 반환값과 리디렉션 <!-- Returns and redirects -->

위 예제는 [`redirect(...)`](@sveltejs-kit#redirect)를 사용해 사용자를 새로 만든 페이지로 보냅니다. 또는 콜백이 데이터를 반환할 수도 있으며, 그 경우 데이터는 `createPost.result`로 사용할 수 있습니다:

```ts
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}

declare module '#lib/server/auth.js' {
	interface User {
		name: string;
	}

	/**
	 * Gets a user's info from their cookies, using `getRequestEvent`
	 */
	export function getUser(): Promise<User | null>;
}
// @filename: index.js
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { query, form } from '$app/server';
import * as db from '#lib/server/database.js';
import * as auth from '#lib/server/auth.js';

export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => { /* ... */ });

// ---cut---
export const createPost = form(
	v.object({/* ... */}),
	async (data) => {
		// ...

		return { success: true };
	}
);
```

```svelte
<!--- file: src/routes/blog/new/+page.svelte --->
<script>
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}>
	<!-- -->
</form>

{#if createPost.result?.success}
	<p>Successfully published!</p>
{/if}
```

이 값은 *일시적*입니다. 다시 제출하거나, 다른 곳으로 이동하거나, 페이지를 다시 불러오면 사라집니다.

> [!NOTE] `result` 값이 꼭 성공을 나타낼 필요는 없습니다. 유효성 검사 오류와, 페이지를 다시 불러올 때 폼을 다시 채워야 하는 데이터를 담을 수도 있습니다.

제출 중에 오류가 발생하면 가장 가까운 `+error.svelte` 페이지가 렌더링됩니다.

### enhance

`enhance` 메서드로 폼이 제출될 때 일어나는 일을 커스터마이징할 수 있습니다:

```svelte
<!--- file: src/routes/blog/new/+page.svelte --->
<script>
	import { createPost } from '../data.remote';
	import { showToast } from '#lib/toast.js';
</script>

<h1>Create a new post</h1>

<form {...createPost.enhance(async (form) => {
	try {
		if (await form.submit()) {
			form.element.reset();

			showToast('Successfully published!');
		} else {
			showToast('Invalid data!');
		}
	} catch (error) {
		showToast('Oh no! Something went wrong');
	}
})}>
	<!-- -->
</form>
```

> [!NOTE] `enhance`를 사용하면 `<form>`이 자동으로 초기화되지 않습니다. 입력을 비우고 싶다면 `form.element.reset()`을 호출해야 합니다.

콜백은 폼 인스턴스의 복사본을 받습니다. 이 복사본에는 `enhance`를 제외한 모든 속성과 메서드가 있으며, `form.submit()`은 enhance 콜백을 다시 실행하지 않고 바로 제출을 수행합니다. 콜백 안에서 `form.element`는 항상 정의되어 있습니다.

### 폼의 여러 인스턴스 <!-- Multiple instances of a form -->

어떤 폼은 목록의 일부로 반복될 수 있습니다. 이런 경우 `for(id)`로 폼 함수의 인스턴스를 따로따로 만들어 서로 격리할 수 있습니다.

인스턴스마다 다른 값을 렌더링해야 한다면, 그 값을 `.as(...)`의 두 번째 인수로 전달하세요:

```svelte
<!--- file: src/routes/todos/+page.svelte --->
<script>
	import { getTodos, modifyTodo } from '../data.remote';
</script>

<h1>Todos</h1>

{#each await getTodos() as todo}
	{const modify = modifyTodo.for(todo.id)}
	<form {...modify}>
		<input {...modify.fields.description.as('text', todo.description)} />
		<button disabled={!!modify.pending}>save changes</button>
	</form>
{/each}
```

### 여러 개의 제출 버튼 <!-- Multiple submit buttons -->

`<form>`에 제출 버튼을 여러 개 둘 수 있습니다. 예를 들어 어떤 버튼을 클릭했는지에 따라 로그인하거나 회원 가입하는 폼 하나를 만들 수 있습니다.

이렇게 하려면 스키마에 버튼 값을 위한 필드를 추가하고, `as('submit', value)`로 그 필드를 연결하세요:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<script>
	import { loginOrRegister } from '#lib/auth';
</script>

<form {...loginOrRegister}>
	<label>
		Your username
		<input {...loginOrRegister.fields.username.as('text')} />
	</label>

	<label>
		Your password
		<input {...loginOrRegister.fields._password.as('password')} />
	</label>

	<button {...loginOrRegister.fields.action.as('submit', 'login')}>login</button>
	<button {...loginOrRegister.fields.action.as('submit', 'register')}>register</button>
</form>
```

폼 핸들러에서는 어떤 버튼을 클릭했는지 확인할 수 있습니다:

```js
/// file: #lib/auth.js
import * as v from 'valibot';
import { form } from '$app/server';

export const loginOrRegister = form(
	v.object({
		username: v.string(),
		_password: v.string(),
		action: v.picklist(['login', 'register'])
	}),
	async ({ username, _password, action }) => {
		if (action === 'login') {
			// handle login
		} else {
			// handle registration
		}
	}
);
```

## command

`command` 함수는 `form`처럼 서버에 데이터를 쓸 수 있게 해 줍니다. `form`과 달리 특정 요소에 묶이지 않으며 어디에서나 호출할 수 있습니다.

> [!NOTE] 가능하면 `form`을 우선 사용하세요. JavaScript가 비활성화되어 있거나 불러오지 못했을 때에도 자연스럽게 동작하기 때문입니다.

`query`, `form`과 마찬가지로, 함수가 인수를 받는다면 `command`의 첫 번째 인수로 [Standard Schema](https://standardschema.dev)를 전달해 [검증](#query-Query-arguments)해야 합니다.

```ts
/// file: likes.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { query, command } from '$app/server';
import * as db from '#lib/server/database.js';

export const getLikes = query(v.string(), async (id) => {
	const [row] = await db.sql`
		SELECT likes
		FROM item
		WHERE id = ${id}
	`;

	return row.likes;
});

export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;
});
```

이제 (예를 들어) 이벤트 핸들러에서 `addLike`를 호출하기만 하면 됩니다:

```svelte
<!--- file: +page.svelte --->
<script>
	import { getLikes, addLike } from './likes.remote';
	import { showToast } from '#lib/toast.js';

	let { item } = $props();
</script>

<button
	onclick={async () => {
		try {
			await addLike(item.id);
		} catch (error) {
			showToast('Something went wrong!');
		}
	}}
>
	add like
</button>

<p>likes: {await getLikes(item.id)}</p>
```

> [!NOTE] 커맨드는 렌더링 중에 호출할 수 없습니다.

## 단일 왕복 변경 <!-- Single-flight mutations -->

[`form`](#form)과 [`command`](#command)는 둘 다 *데이터 변경*을 위한 것입니다. 많은 경우 데이터를 변경하면 다른 데이터가 무효화됩니다. 기본적으로 `form`은 제출이 성공하면 모든 쿼리와 load 함수를 자동으로 무효화해, 전통적인 전체 페이지 새로 고침에서 일어나는 일을 흉내 냅니다. 반면 `command`는 아무것도 하지 않습니다. 보통 두 방식 모두 이상적인 해결책은 아닙니다. 폼 제출 하나가 웹 페이지에 표시된 *모든 것*을 바꾸는 일은 드물기 때문에, 모든 것을 무효화하는 것은 낭비일 가능성이 큽니다. `command`의 경우, 아무것도 하지 않으면 앱을 *충분히* 무효화하지 못해 오래된 데이터가 표시된 채로 남을 가능성이 큽니다. 어느 경우든 서버와 두 번 왕복해야 하는 일이 흔합니다. 한 번은 변경을 실행하기 위해, 그리고 그것이 끝난 뒤 한 번 더 새로 고쳐야 하는 쿼리의 데이터를 다시 요청하기 위해서입니다.

SvelteKit은 *단일 왕복 변경*으로 이 두 문제를 모두 해결합니다. `form` 제출이나 `command` 호출이 쿼리를 새로 고치고, 그 결과를 단 한 번의 요청으로 클라이언트에 돌려줄 수 있습니다.

### 서버 주도 새로 고침 <!-- Server-driven refreshes -->

대부분의 경우 서버 핸들러는 자신이 받은 인수를 바탕으로 어떤 클라이언트 데이터를 업데이트해야 하는지 알고 있습니다:

```js
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { query, form } from '$app/server';
const slug = '';
const post = { id: '' };
/** @type {any} */
const externalApi = '';
// ---cut---
export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => { /* ... */ });

export const createPost = form(
	v.object({/* ... */}),
	async (data) => {
		// form logic goes here...

		// Refresh `getPosts()` on the server, and send
		// the data back with the result of `createPost`
		// it's safe to throw away the promise from `refresh`,
		// as the framework awaits it for us before serving the response
		+++void getPosts().refresh();+++

		// Redirect to the newly created page
		redirect(303, `/blog/${slug}`);
	}
);

export const updatePost = form(
	v.object({ id: v.string() }),
	async (post) => {
		// form logic goes here...
		const result = externalApi.update(post);

		// The API already gives us the updated post,
		// no need to refresh it, we can set it directly
		+++getPost(post.id).set(result);+++
	}
);
```

쿼리는 인수를 기준으로 키가 정해지므로, 서버의 `getPost(post.id).set(result)`는 클라이언트에서 일치하는 `getPost(id)`를 찾아 업데이트해야 한다는 것을 압니다. `getPosts().refresh()`도 마찬가지로, 클라이언트에서 인수 없는 `getPosts()`를 찾아야 한다는 것을 압니다.

`form` 핸들러 어디에서든 `refresh()`, `set()`, `reconnect()`를 호출하면 그 제출에 대해서는 모든 쿼리와 load 함수를 무효화하는 기본 동작이 대체되므로, 새로 고친 쿼리만 업데이트됩니다.

### 변경 중 라이브 쿼리 재연결하기 <!-- Reconnecting live queries in mutations -->

단일 왕복 변경으로 `query.live` 인스턴스를 재연결할 수도 있습니다. `form`/`command` 핸들러에서 재연결하려는 라이브 쿼리 리소스의 `.reconnect()`를 호출하세요:

```js
import * as v from 'valibot';
import { form, query } from '$app/server';

export const getNotifications = query.live(v.string(), async function* (userId) {
	while (true) {
		yield await db.notifications(userId);
		await wait(1000);
	}
});

export const markAllRead = form(v.object({ userId: v.string() }), async ({ userId }) => {
	// mutation logic...
	+++getNotifications(userId).reconnect();+++
});
```

이렇게 하면 일치하는 활성 클라이언트 인스턴스의 재연결이 예약되고, 변경 응답의 일부로(즉 form/command 결과와 같은 왕복에서) 적용됩니다. 예를 들어 커맨드가 쿠키를 수정했고, 라이브 쿼리가 그 쿠키를 반영하려면 다시 시작해야 하는 경우에 필요할 수 있습니다.

### 클라이언트 요청 새로 고침 <!-- Client-requested refreshes -->

안타깝게도 현실이 앞의 예제처럼 늘 단순하지는 않습니다. 서버는 어떤 쿼리 *함수*를 업데이트해야 하는지는 항상 알지만, 구체적으로 어떤 쿼리 *인스턴스*를 업데이트해야 하는지는 모를 수 있습니다. 예를 들어 클라이언트에 `getPosts({ filter: 'author:santa' })`가 렌더링되어 있다면, 서버 핸들러에서 `getPosts().refresh()`를 호출해도 그것은 업데이트되지 않습니다. 대신 `getPosts({ filter: 'author:santa' }).refresh()`를 호출해야 합니다. 하지만 특히 쿼리 인수가 키 하나짜리 객체보다 복잡하다면, 현재 클라이언트에 어떤 필터 조합이 렌더링되어 있는지 어떻게 알 수 있을까요?

SvelteKit은 클라이언트가 `submit().updates`(`form`의 경우)나 `myCommand().updates`(`command`의 경우)로 특정 데이터를 업데이트하도록 서버에 *요청*할 수 있게 해 이 문제를 쉽게 만들어 줍니다:

```ts
import type { RemoteQueryUpdate, RemoteQuery } from '$app/server';
interface Post {}
declare function submit(): Promise<any> & {
	updates(...updates: RemoteQueryUpdate[]): Promise<any>;
}

declare function getPosts(args: { filter: string }): RemoteQuery<Post[]>;
declare const newPost: Post;
// ---cut---
await submit().updates(
	// to request all active instances of getPosts
	getPosts,
	// to request a specific instance
	getPosts({ filter: 'author:santa' }),
	// to request a specific instance with an optimistic override
	getPosts({ filter: 'author:santa' }).withOverride((posts) => [newPost, ...posts])
);
```

클라이언트에서 업데이트를 요청하는 것만으로는 충분하지 않습니다. 서버에서도 그 요청을 받아들여야 합니다:

```js
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
const slug = '';
const post = { id: '' };
/** @type {any} */
const externalApi = '';
// ---cut---
import { query, form, requested } from '$app/server';

export const getPosts = query(v.object({ filter: v.string() }), async ({ filter }) => { /* ... */ });

export const createPost = form(
	v.object({/* ... */}),
	async (data) => {
		// form logic goes here...

		+++for (const { query } of requested(getPosts, 1)) {+++
		+++	void query.refresh();+++
		+++}+++

		// Redirect to the newly created page
		redirect(303, `/blog/${slug}`);
	}
);
```

`requested`를 사용하면 클라이언트가 새로 고침을 요청한 쿼리에 접근할 수 있습니다. 각 항목은 `{ arg, query, ignore }` 객체입니다. `arg`는 쿼리의 구현 함수가 받은 값, 즉 스키마가 검증하고 (해당하는 경우) 변환한 *뒤의* 인수이고, `query`는 클라이언트의 원래 캐시 키에 이미 바인딩된 `RemoteQuery`이므로 `query.refresh()` / `query.set(...)`을 호출하면 올바른 클라이언트 인스턴스가 업데이트됩니다. 특정 인스턴스를 일부러 업데이트하지 않으려면 `ignore()`를 호출하세요:

```js
import { requested, query } from '$app/server';

export const getPosts = query('unchecked', ({ filter }) => {
	return ['foo', 'bar'];
});
// ---cut---
for (const { arg, query, ignore } of requested(getPosts, 10)) {
	if (arg.filter === 'author:santa') {
		void query.refresh();
	} else {
		ignore();
	}
}
```

요청된 업데이트는 모두 새로 고치거나, 설정하거나, (라이브 쿼리라면) 재연결하거나, 명시적으로 무시해야 합니다. 그렇지 않으면 해당 쿼리는 클라이언트에서 오류 상태가 됩니다. 인수를 파싱하거나 검증하는 데 실패하면 그 쿼리도 오류가 되지만, 커맨드 전체가 실패하지는 않습니다.

`requested`의 두 번째 매개변수 `limit`은 반환할 항목의 최대 개수입니다. 이 한도를 넘는 새로 고침 요청은 클라이언트에서 실패합니다.

> [!NOTE] 새로 고침 요청 목록은 클라이언트가 제어하므로 `limit`이 필수입니다. 각 항목마다 서버는 인수를 검증하고 대개 데이터를 다시 가져와야 하므로, 목록에 제한이 없으면 서비스 거부(denial-of-service) 공격의 위험이 있습니다. 요청 하나당 감당할 수 있는 최악의 경우를 반영해 한도를 정하세요. 새로 고침 개수에 상관없이 받아들이기로 명시적으로 결정했다면 `Infinity`를 전달할 _수도_ 있지만, 권장하지 않습니다.

또한 요청된 쿼리 인스턴스를 새로 고치기만 하면 될 때는 `requested`의 간단한 축약형을 사용할 수 있습니다:

```ts
import { requested } from '$app/server';
import type { RemoteQueryFunction } from '$app/server';
declare const getPosts: RemoteQueryFunction<any, any>;
// ---cut---
// this is the same as looping over the result and calling `void query.refresh()`.
await requested(getPosts, 1).refreshAll();
```

선택된 업데이트를 모두 일부러 무시하려면 `ignoreAll`을 사용하세요:

```js
import { requested, query } from '$app/server';

export const getPosts = query('unchecked', ({ filter }) => {
	return ['foo', 'bar'];
});

// ---cut---
await requested(getPosts, 10).ignoreAll();
```

`ignoreAll`은 지정한 `limit` 안의 항목만 무시합니다. 넘치는 항목은 여전히 클라이언트에서 실패합니다.

> [!NOTE] 왜 커맨드가 새로 고칠 수 있는 쿼리를 하나하나 명시해야 할까요? 이유는 두 가지입니다:
>
> - **번들 크기.** 커맨드가 앱의 *어떤* 쿼리든 암묵적으로 새로 고칠 수 있다면, 어떤 쿼리가 호출될지 미리 알 수 없으므로 SvelteKit은 모든 쿼리의 코드를 커맨드의 서버 번들에 포함해야 합니다.
> - **서비스 거부.** 악의적인 사용자라면 누구나 네트워크 탭을 살펴 앱이 사용하는 쿼리를 알아낸 뒤, 클라이언트가 지정한 수천 개의 새로 고침 목록과 함께 커맨드를 POST할 수 있습니다. 유일한 방어책은 서버 핸들러가 어떤 쿼리를, 그리고 몇 개까지 새로 고칠지 선언하는 것입니다(그래서 `limit`이 필수입니다).

## prerender

`prerender` 함수는 `query`와 비슷하지만, 빌드 시점에 호출되어 결과를 프리렌더링한다는 점이 다릅니다. 다시 배포할 때마다 많아야 한 번 바뀌는 데이터에 사용하세요.

```js
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import { prerender } from '$app/server';
import * as db from '#lib/server/database.js';

export const getPosts = prerender(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
```

다른 부분은 동적인 페이지에서도 `prerender` 함수를 사용할 수 있으므로, 데이터의 일부만 프리렌더링할 수 있습니다. 프리렌더링된 데이터는 다른 정적 에셋과 함께 CDN에 둘 수 있으므로 내비게이션이 매우 빨라집니다.

브라우저에서 프리렌더링된 데이터는 [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache) API로 저장됩니다. 이 캐시는 페이지를 다시 불러와도 유지되며, 사용자가 앱의 새 배포를 처음 방문할 때 지워집니다.

### 프리렌더 인수 <!-- Prerender arguments -->

쿼리와 마찬가지로 프리렌더 함수도 인수를 받을 수 있으며, 이 인수는 [Standard Schema](https://standardschema.dev/)로 [검증](#query-Query-arguments)해야 합니다:

```js
/// file: src/routes/blog/data.remote.js
// @filename: ambient.d.ts
declare module '#lib/server/database.js' {
	export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
}
// @filename: index.js
// ---cut---
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import * as db from '#lib/server/database.js';

export const getPosts = prerender(async () => { /* ... */ });

export const getPost = prerender(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post
		WHERE slug = ${slug}
	`;

	if (!post) error(404, 'Not found');
	return post;
});
```

[페이지를 프리렌더링](page-options#prerender)하는 동안 SvelteKit의 크롤러가 찾아낸 `getPost(...)` 호출은 모두 자동으로 저장되지만, `inputs` 옵션으로 어떤 값으로 호출할지 직접 지정할 수도 있습니다:

```js
/// file: src/routes/blog/data.remote.js
import * as v from 'valibot';
import { prerender } from '$app/server';
// ---cut---

export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		inputs: () => [
			'first-post',
			'second-post',
			'third-post'
		]
	}
);
```

기본적으로 프리렌더 함수는 서버 번들에서 제외되므로, 프리렌더링되지 _않은_ 인수로는 호출할 수 없습니다. 이 동작을 바꾸려면 `dynamic: true`를 설정하세요:

```js
/// file: src/routes/blog/data.remote.js
import * as v from 'valibot';
import { prerender } from '$app/server';
// ---cut---

export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		+++dynamic: true+++,
		inputs: () => [
			'first-post',
			'second-post',
			'third-post'
		]
	}
);
```

## 유효성 검사 오류 처리하기 <!-- Handling validation errors -->

_여러분이_ 원격 함수에 유효하지 않은 데이터를 전달하지 않는 한, `command`, `query`, `prerender` 함수에 전달된 인수가 유효성 검사에 실패하는 이유는 두 가지뿐입니다:

- 배포 사이에 함수 시그니처가 바뀌었고, 일부 사용자가 아직 앱의 이전 버전을 사용하고 있는 경우
- 누군가 노출된 엔드포인트에 잘못된 데이터를 찔러 넣어 사이트를 공격하려는 경우

두 번째 경우에는 공격자에게 어떤 도움도 주고 싶지 않으므로, SvelteKit은 일반적인 [400 Bad Request](https://http.dog/400) 응답을 생성합니다. 유효성 검사 실패는 `kind: 'validation'`, `{ status, message }`를 담은 `error` 객체, 그리고 유효성 검사 `issues`와 함께 서버 [`handleError`](hooks#handleError) 훅을 거칩니다. 이 이슈들을 사용해 실패를 기록하거나 응답을 커스터마이징할 수 있습니다:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit/hooks').HandleServerError} */
export function handleError({ kind, issues }) {
	if (kind === 'validation') {
		console.error(issues);
		return {
			message: 'Nice try, hacker!'
		};
	}
}
```

유효성 검사 이슈는 공격자에게 유용한 정보가 될 수 있으므로 노출할 때 신중해야 합니다. `error`를 그대로 반환하는 것은 안전합니다. `issues`와 달리 일반적인 상태와 메시지만 담고 있기 때문입니다.

무엇을 하는지 잘 알고 있고 유효성 검사를 사용하지 않으려면, 스키마 대신 문자열 `'unchecked'`를 전달하면 됩니다:

```ts
/// file: data.remote.ts
import { query } from '$app/server';

export const getStuff = query('unchecked', async ({ id }: { id: string }) => {
	// the shape might not actually be what TypeScript thinks
	// since bad actors might call this function with other arguments
});
```

## `getRequestEvent` 사용하기 <!-- Using `getRequestEvent` -->

`query`, `form`, `command` 안에서는 [`getRequestEvent`]($app-server#getRequestEvent)를 사용해 현재 [`RequestEvent`](@sveltejs-kit#RequestEvent) 객체를 얻을 수 있습니다. 이를 이용하면 예를 들어 쿠키를 다루는 추상화를 쉽게 만들 수 있습니다:

```ts
/// file: user.remote.js
// @filename: ambient.d.ts
interface User {
	name: string;
	avatar: string;
}

declare module '#lib/server/database.js' {
	export function findUser(sessionId: string | undefined): Promise<User | null>;
}

// @filename: index.js
// ---cut---
import { getRequestEvent, query } from '$app/server';
import { findUser } from '#lib/server/database.js';

export const getProfile = query(async () => {
	const user = await getUser();

	return user && {
		name: user.name,
		avatar: user.avatar
	};
});

// this query could be called from multiple places, but
// the function will only run once per request
const getUser = query(async () => {
	const { cookies } = getRequestEvent();

	return await findUser(cookies.get('session_id'));
});
```

원격 함수 안에서는 `RequestEvent`의 일부 속성이 다르게 동작한다는 점에 유의하세요:

- 헤더를 설정할 수 없습니다(쿠키 쓰기는 예외이며, 그것도 `form`과 `command` 함수 안에서만 가능합니다)
- `query` 함수(`query.batch`와 `query.live` 포함) 안에서 `route`, `params`, `url`에 접근하면 오류가 발생합니다. 쿼리는 인수를 기준으로 캐시되고 사용자가 이동해도 다시 실행되지 않으므로, 이 값들에 의존하는 결과는 캐시가 알아채지 못한 채 오래된 상태가 됩니다. 대신 페이지의 값을 쿼리 인수로 전달하세요. [`handle`](hooks#handle) 훅에서 쿠키나 헤더로부터 신뢰할 수 있는 컨텍스트를 만들어 `locals`에 넣을 수는 있지만, 쿼리 요청의 경우 `handle`이 보는 URL은 페이지의 URL이 아니라 원격 엔드포인트의 URL이라는 점에 유의하세요
- `form`과 `command` 함수에서 `route`, `params`, `url`은 원격 함수를 호출한 페이지에 관한 값이며, SvelteKit이 원격 함수를 위해 만든 엔드포인트의 URL이 _아닙니다_. 이 값들은 조작될 수 있는 요청의 일부이므로, 사용자가 특정 데이터에 접근할 권한이 있는지 판단하는 데 절대 사용하지 마세요

## 리디렉션 <!-- Redirects -->

`query`, `form`, `prerender` 함수 안에서는 [`redirect(...)`](@sveltejs-kit#redirect) 함수를 사용할 수 있습니다. `command` 함수 안에서는 사용할 수 *없습니다*. 이곳에서는 리디렉션을 피해야 하기 때문입니다. (꼭 필요하다면 `{ redirect: location }` 객체를 반환하고 클라이언트에서 처리하면 됩니다.)
