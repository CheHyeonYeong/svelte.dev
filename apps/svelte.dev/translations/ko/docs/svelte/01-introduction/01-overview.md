---
title: 개요
---

Svelte는 웹 사용자 인터페이스를 만들기 위한 프레임워크입니다. Svelte는 컴파일러를 사용해 HTML, CSS, JavaScript로 작성한 선언적 컴포넌트를...

```svelte
<!--- file: App.svelte --->
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>

<button onclick={greet}>click me</button>

<style>
	button {
		font-size: 2em;
	}
</style>
```

...군더더기 없이 철저하게 최적화된 JavaScript로 바꿔 줍니다.

독립적인 컴포넌트부터 야심 찬 풀스택 앱(Svelte의 짝꿍 애플리케이션 프레임워크인 [SvelteKit](../kit) 사용)까지, 그리고 그 사이의 모든 것을 Svelte로 만들 수 있습니다.

이 페이지들은 레퍼런스 문서입니다. Svelte가 처음이라면 [인터랙티브 튜토리얼](/tutorial)로 먼저 시작하고, 궁금한 점이 생겼을 때 이곳으로 돌아오기를 권합니다.

[플레이그라운드](/playground)에서 Svelte를 온라인으로 바로 써 볼 수도 있고, 기능을 더 갖춘 환경이 필요하다면 [StackBlitz](https://sveltekit.new)를 이용할 수 있습니다.
