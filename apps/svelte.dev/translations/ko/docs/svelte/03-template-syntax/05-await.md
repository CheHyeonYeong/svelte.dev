---
title: {#await ...}
tags: template-await
---

```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{:catch name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression catch name}...{/await}
```

await 블록을 사용하면 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)가 가질 수 있는 세 가지 상태, 즉 대기(pending), 이행(fulfilled), 거부(rejected)에 따라 분기할 수 있습니다.

```svelte
{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled or not a Promise -->
	<p>The value is {value}</p>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
```

> [!NOTE] 서버 사이드 렌더링 중에는 대기 상태 분기만 렌더링됩니다.
>
> 주어진 표현식이 `Promise`가 아니면 서버 사이드 렌더링 중에도 `:then` 분기만 렌더링됩니다.

프로미스가 거부될 때 렌더링할 것이 없다면(또는 에러가 날 수 없다면) `catch` 블록은 생략할 수 있습니다.

```svelte
{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled -->
	<p>The value is {value}</p>
{/await}
```

대기 상태에 관심이 없다면 첫 블록을 생략할 수도 있습니다.

```svelte
{#await promise then value}
	<p>The value is {value}</p>
{/await}
```

마찬가지로 에러 상태만 보여 주고 싶다면 `then` 블록을 생략할 수 있습니다.

```svelte
{#await promise catch error}
	<p>The error is {error}</p>
{/await}
```

> [!NOTE] `#await`와 [`import(...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)를 함께 사용하면 컴포넌트를 지연 렌더링할 수 있습니다:
>
> ```svelte
> {#await import('./Component.svelte') then { default: Component }}
> 	<Component />
> {/await}
> ```

