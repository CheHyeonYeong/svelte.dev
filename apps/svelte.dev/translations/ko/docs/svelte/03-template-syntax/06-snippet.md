---
title: {#snippet ...}
---

```svelte
<!--- copy: false  --->
{#snippet name()}...{/snippet}
```

```svelte
<!--- copy: false  --->
{#snippet name(param1, param2, paramN)}...{/snippet}
```

스니펫은 [render 태그](@render)와 함께, 컴포넌트 안에서 재사용할 수 있는 마크업 조각을 만드는 방법입니다. [이렇게](/playground/untitled#H4sIAAAAAAAAE5VUYW-kIBD9K8Tmsm2yXXRzvQ-s3eR-R-0HqqOQKhAZb9sz_vdDkV1t000vRmHewMx7w2AflbIGG7GnPlK8gYhFv42JthG-m9Gwf6BGcLbVXZuPSGrzVho8ZirDGpDIhldgySN5GpEMez9kaNuckY1ANJZRamRuu2ZnhEZt6a84pvs43mzD4pMsUDDi8DMkQFYCGdkvsJwblFq5uCik9bmJ4JZwUkv1eoknWigX2eGNN6aGXa6bjV8ybP-X7sM36T58SVcrIIV2xVIaA41xeD5kKqWXuqpUJEefOqVuOkL9DfBchGrzWfu0vb-RpTd3o-zBR045Ga3HfuE5BmJpKauuhbPtENlUF2sqR9jqpsPSxWsMrlngyj3VJiyYjJXb1-lMa7IWC-iSk2M5Zzh-SJjShe-siq5kpZRPs55BbSGU5YPyte4vVV_VfFXxVb10dSLf17pS2lM5HnpPxw4Zpv6x-F57p0jI3OKlVnhv5V9wPQrNYQQ9D_f6aGHlC89fq1Z3qmDkJCTCweOGF4VUFSPJvD_DhreVdA0eu8ehJJ5x91dBaBkpWm3ureCFPt3uzRv56d4kdp-2euG38XZ6dsnd3ZmPG9yRBCrzRUvi-MccOdwz3qE-fOZ7AwAhlrtTUx3c76vRhSwlFBHDtoPhefgHX3dM0PkEAAA=) 중복된 코드를 작성하는 대신...

```svelte
{#each images as image}
	{#if image.href}
		<a href={image.href}>
			<figure>
				<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
				<figcaption>{image.caption}</figcaption>
			</figure>
		</a>
	{:else}
		<figure>
			<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
			<figcaption>{image.caption}</figcaption>
		</figure>
	{/if}
{/each}
```

...[이렇게](/playground/untitled#H4sIAAAAAAAAE5VUYW-bMBD9KxbRlERKY4jWfSA02n5H6QcXDmwVbMs-lnaI_z6D7TTt1moTAnPvzvfenQ_GpBEd2CS_HxPJekjy5IfWyS7BFz0b9id0CM62ajDVjBS2MkLjqZQldoBE9KwFS-7I_YyUOPqlRGuqnKw5orY5pVpUduj3mitUln5LU3pI0_UuBp9FjTwnDr9AHETLMSeHK6xiGoWSLi9yYT034cwSRjohn17zcQPNFTs8s153sK9Uv_Yh0-5_5d7-o9zbD-UqCaRWrllSYZQxLw_HUhb0ta-y4NnJUxfUvc7QuLJSaO0a3oh2MLBZat8u-wsPnXzKQvTtVVF34xK5d69ThFmHEQ4SpzeVRediTG8rjD5vBSeN3E5JyHh6R1DQK9-iml5kjzQUN_lSgVU8DhYLx7wwjSvRkMDvTjiwF4zM1kXZ7DlF1eN3A7IG85e-zRrYEjjm0FkI4Cc7Ripm0pHOChexhcWXzreeZyRMU6Mk3ljxC9w4QH-cQZ_b3T5pjHxk1VNr1CDrnJy5QDh6XLO6FrLNSRb2l9gz0wo3S6m7HErSgLsPGMHkpDZK31jOanXeHPQz-eruLHUP0z6yTbpbrn223V70uMXNSpQSZjpL0y8hcxxpNqA6_ql3BQAxlxvfpQ_uT9GrWjQC6iRHM8D0MP0GQsIi92QEAAA=) 작성할 수 있습니다:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>
			{@render figure(image)}
		</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

함수 선언과 마찬가지로 스니펫은 매개변수를 몇 개든 가질 수 있고, 매개변수에 기본값을 줄 수 있으며, 각 매개변수를 구조 분해할 수도 있습니다. 다만 나머지 매개변수는 사용할 수 없습니다.

## 스니펫 스코프 <!-- Snippet scope -->

스니펫은 컴포넌트 안 어디에서나 선언할 수 있습니다. 스니펫은 자신의 바깥에서 선언된 값, 예를 들어 `<script>` 태그나 `{#each ...}` 블록 안의 값을 참조할 수 있습니다...

<!-- codeblock:start {"title":"Snippets"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let { message = `it's great to see you!` } = $props();
</script>

{#snippet hello(name)}
	<p>hello {name}! {message}!</p>
{/snippet}

{@render hello('alice')}
{@render hello('bob')}
```
<!-- codeblock:end -->

...그리고 같은 렉시컬 스코프에 있는 모든 것(즉, 형제 요소와 그 형제 요소의 자식)에서 '보입니다':

```svelte
<div>
	{#snippet x()}
		{#snippet y()}...{/snippet}

		<!-- this is fine -->
		{@render y()}
	{/snippet}

	<!-- this will error, as `y` is not in scope -->
	{@render y()}
</div>

<!-- this will also error, as `x` is not in scope -->
{@render x()}
```

스니펫은 자기 자신과 서로를 참조할 수 있습니다:

<!-- codeblock:start {"title":"Self-referencing snippets"} -->
```svelte
<!--- file: App.svelte --->
{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{@render countdown(10)}
```
<!-- codeblock:end -->

## 컴포넌트에 스니펫 전달하기 <!-- Passing snippets to components -->

### 명시적 props <!-- Explicit props -->

템플릿 안에서 스니펫은 다른 값과 똑같은 값입니다. 따라서 props로 컴포넌트에 전달할 수 있습니다:

<!-- codeblock:start {"title":"Explicit snippet props"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Table from './Table.svelte';

	const fruits = [
		{ name: 'apples', qty: 5, price: 2 },
		{ name: 'bananas', qty: 10, price: 1 },
		{ name: 'cherries', qty: 20, price: 0.5 }
	];
</script>

{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
	<th>total</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
	<td>{d.price}</td>
	<td>{d.qty * d.price}</td>
{/snippet}

<Table data={fruits} +++{header} {row}+++ />
```

```svelte
<!--- file: Table.svelte --->
<script>
	let { data, header, row } = $props();
</script>

<table>
	{#if header}
		<thead>
			<tr>{@render header()}</tr>
		</thead>
	{/if}

	<tbody>
		{#each data as d}
			<tr>{@render row(d)}</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		text-align: left;
		border-spacing: 0;
	}

	tbody tr:nth-child(2n+1) {
		background: ButtonFace;
	}

	table :global(th), table :global(td) {
		padding: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

컴포넌트에 데이터 대신 콘텐츠를 전달한다고 생각하면 됩니다. 웹 컴포넌트의 슬롯과 비슷한 개념입니다.

### 암시적 props <!-- Implicit props -->

작성 편의를 위해, 컴포넌트 *안에* 직접 선언한 스니펫은 암시적으로 그 컴포넌트의 props가 됩니다:

<!-- codeblock:start {"title":"Implicit snippet props"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Table from './Table.svelte';

	const fruits = [
		{ name: 'apples', qty: 5, price: 2 },
		{ name: 'bananas', qty: 10, price: 1 },
		{ name: 'cherries', qty: 20, price: 0.5 }
	];
</script>

<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th>
		<th>qty</th>
		<th>price</th>
		<th>total</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
		<td>{d.price}</td>
		<td>{d.qty * d.price}</td>
	{/snippet}
</Table>
```

```svelte
<!--- file: Table.svelte --->
<script>
	let { data, header, row } = $props();
</script>

<table>
	{#if header}
		<thead>
			<tr>{@render header()}</tr>
		</thead>
	{/if}

	<tbody>
		{#each data as d}
			<tr>{@render row(d)}</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		text-align: left;
		border-spacing: 0;
	}

	tbody tr:nth-child(2n+1) {
		background: ButtonFace;
	}

	table :global(th), table :global(td) {
		padding: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

### 암시적 `children` 스니펫 <!-- Implicit `children` snippet -->

컴포넌트 태그 안의 내용 중 스니펫 선언이 *아닌* 것은 모두 암시적으로 `children` 스니펫의 일부가 됩니다:

<!-- codeblock:start {"title":"Implicit children snippet","selected":"Button.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Button from './Button.svelte';
</script>

<Button>click me</Button>
```

```svelte
<!--- file: Button.svelte --->
<script>
	let { children } = $props();
</script>

<!-- result will be <button>click me</button> -->
<button>{@render children()}</button>
```
<!-- codeblock:end -->

> [!NOTE] 컴포넌트 안에 내용이 있으면 `children`이라는 prop을 둘 수 없다는 점에 유의하세요. 이런 이유로 이 이름의 prop은 피하는 것이 좋습니다

### 선택적 스니펫 props <!-- Optional snippet props -->

스니펫 props를 선택적으로 선언할 수 있습니다. 옵셔널 체이닝을 사용해 스니펫이 설정되지 않았을 때 아무것도 렌더링하지 않거나...

```svelte
<script>
    let { children } = $props();
</script>

{@render children?.()}
```

...`#if` 블록을 사용해 폴백 콘텐츠를 렌더링할 수 있습니다:

```svelte
<script>
    let { children } = $props();
</script>

{#if children}
    {@render children()}
{:else}
    fallback content
{/if}
```

## 스니펫 타입 지정 <!-- Typing snippets -->

스니펫은 `'svelte'`에서 import한 `Snippet` 인터페이스를 구현합니다:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>;
	}

	let { data, children, row }: Props = $props();
</script>
```

이렇게 바꾸면 `data` prop과 `row` 스니펫을 제공하지 않고 컴포넌트를 사용하려 할 때 빨간 물결선이 나타납니다. 스니펫은 매개변수를 여러 개 가질 수 있으므로 `Snippet`에 전달하는 타입 인자가 튜플이라는 점에 주목하세요.

제네릭을 선언하면 `data`와 `row`가 같은 타입을 가리키도록 더 엄격하게 만들 수 있습니다:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		data,
		children,
		row
	}: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

## 스니펫 export하기 <!-- Exporting snippets -->

`.svelte` 파일의 최상위에 선언한 스니펫은 모듈이 아닌 `<script>`의 선언을 (직접이든 다른 스니펫을 거쳐 간접적이든) 참조하지 않는다면, `<script module>`에서 export해 다른 컴포넌트에서 사용할 수 있습니다:

<!-- codeblock:start {"title":"Exported snippets","selected":"snippets.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import { add } from './snippets.svelte';
</script>

{@render add(1, 2)}

```

```svelte
<!--- file: snippets.svelte --->
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```
<!-- codeblock:end -->

> [!NOTE]
> 이 기능은 Svelte 5.5.0 이상이 필요합니다

## 프로그래밍 방식으로 스니펫 만들기 <!-- Programmatic snippets -->

[`createRawSnippet`](svelte#createRawSnippet) API를 사용하면 프로그래밍 방식으로 스니펫을 만들 수 있습니다. 고급 사용 사례를 위한 기능입니다.

## 스니펫과 슬롯 <!-- Snippets and slots -->

Svelte 4에서는 [슬롯](legacy-slots)을 사용해 컴포넌트에 콘텐츠를 전달할 수 있습니다. 스니펫이 더 강력하고 유연하므로 Svelte 5에서 슬롯은 지원 중단(deprecated)되었습니다.
