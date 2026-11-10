---
title: <svelte:self>
---

Svelte는 다양한 내장 요소를 제공합니다. 그중 첫 번째인 `<svelte:self>`를 사용하면 컴포넌트가 자기 자신을 재귀적으로 포함할 수 있습니다.

이 기능은 폴더가 *다른* 폴더를 담을 수 있는 이 폴더 트리 뷰 같은 경우에 유용합니다. `Folder.svelte`에서 이렇게 하고 싶지만...

```svelte
/// file: Folder.svelte
{#if file.files}
	<Folder {...file}/>
{:else}
	<File {...file}/>
{/if}
```

...모듈은 자기 자신을 import할 수 없으므로 불가능합니다. 대신 `<svelte:self>`를 사용합니다:

```svelte
/// file: Folder.svelte
{#if file.files}
	+++<svelte:self {...file} />+++
{:else}
	<File {...file} />
{/if}
```
