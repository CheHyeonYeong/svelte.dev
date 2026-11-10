---
title: 첫 번째 컴포넌트
---

Svelte에서 애플리케이션은 하나 이상의 *컴포넌트*로 이루어집니다. 컴포넌트는 함께 쓰이는 HTML, CSS, JavaScript를 하나로 감싼, 재사용할 수 있는 독립적인 코드 덩어리이며 `.svelte` 파일에 작성합니다. 오른쪽 코드 에디터에 열려 있는 `App.svelte` 파일이 간단한 컴포넌트입니다.

## 데이터 추가하기 <!-- Adding data -->

정적인 마크업만 렌더링하는 컴포넌트는 그다지 흥미롭지 않습니다. 데이터를 추가해 봅시다.

먼저 컴포넌트에 script 태그를 추가하고 `name` 변수를 선언하세요:

```svelte
/// file: App.svelte
+++<script>
	let name = 'Svelte';
</script>+++

<h1>Hello world!</h1>
```

그러면 마크업에서 `name`을 참조할 수 있습니다:

```svelte
/// file: App.svelte
<h1>Hello +++{name}+++!</h1>
```

중괄호 안에는 어떤 JavaScript든 넣을 수 있습니다. `name`을 `name.toUpperCase()`로 바꿔서 더 우렁찬 인사를 만들어 보세요.

```svelte
/// file: App.svelte
<h1>Hello {name+++.toUpperCase()+++}!</h1>
```
