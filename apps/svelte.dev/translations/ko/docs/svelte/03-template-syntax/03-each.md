---
title: {#each ...}
tags: template-each
---

```svelte
<!--- copy: false  --->
{#each expression as name}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index}...{/each}
```

each 블록으로 값을 순회할 수 있습니다. 대상 값은 배열, 유사 배열 객체(즉, `length` 프로퍼티가 있는 모든 것), 또는 `Map`이나 `Set` 같은 이터러블일 수 있습니다. (내부적으로는 [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)으로 배열로 변환됩니다.)

값이 `null`이나 `undefined`이면 빈 배열과 똑같이 취급됩니다(해당하는 경우 [else 블록](#Else-blocks)이 렌더링됩니다).

```svelte
<h1>Shopping list</h1>
<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>
```

each 블록에는 `array.map(...)` 콜백의 두 번째 인자에 해당하는 *인덱스*를 지정할 수도 있습니다:

```svelte
{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## 키 있는 each 블록 <!-- Keyed each blocks -->

```svelte
<!--- copy: false  --->
{#each expression as name (key)}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index (key)}...{/each}
```

각 목록 항목을 고유하게 식별하는 *키* 표현식을 제공하면, Svelte는 데이터가 바뀔 때 끝에 항목을 추가하거나 제거하고 중간의 상태를 갱신하는 대신, 이 키를 사용해 항목을 삽입·이동·삭제하며 목록을 똑똑하게 갱신합니다.

키는 어떤 객체든 될 수 있지만, 객체 자체가 바뀌어도 동일성을 유지할 수 있으므로 문자열이나 숫자를 권장합니다.

```svelte
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- or with additional index value -->
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

each 블록에서는 구조 분해와 나머지 패턴을 자유롭게 사용할 수 있습니다.

```svelte
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
	<li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

## 항목 없는 each 블록 <!-- Each blocks without an item -->

```svelte
<!--- copy: false  --->
{#each expression}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression, index}...{/each}
```

무언가를 `n`번 렌더링하기만 하면 된다면 `as` 부분을 생략할 수 있습니다:

<!-- codeblock:start {"title":"Chess board"} -->
```svelte
<!--- file: App.svelte --->
<div class="chess-board">
	{#each { length: 8 }, rank}
		{#each { length: 8 }, file}
			<div class:black={(rank + file) % 2 === 1}></div>
		{/each}
	{/each}
</div>

<style>
	.chess-board {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		border: 1px solid black;
		aspect-ratio: 1;

		.black {
			background: black;
		}
	}
</style>
```
<!-- codeblock:end -->

## else 블록 <!-- Else blocks -->

```svelte
<!--- copy: false  --->
{#each expression as name}...{:else}...{/each}
```

each 블록에는 `{:else}` 절을 둘 수도 있으며, 이 절은 목록이 비어 있을 때 렌더링됩니다.

```svelte
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```
