---
title: .svelte 파일
---

컴포넌트는 Svelte 애플리케이션을 이루는 기본 단위입니다. 컴포넌트는 HTML의 상위 집합(superset)을 사용해 `.svelte` 파일로 작성합니다.

스크립트, 스타일, 마크업 세 부분은 모두 선택 사항입니다.

<!-- prettier-ignore -->
```svelte
/// file: MyComponent.svelte
<script module>
	// module-level logic goes here
	// (you will rarely use this)
</script>

<script>
	// instance-level logic goes here
</script>

<!-- markup (zero or more items) goes here -->

<style>
	/* styles go here */
</style>
```

## `<script>`

`<script>` 블록에는 컴포넌트 인스턴스가 생성될 때 실행되는 JavaScript(`lang="ts"` 속성을 추가하면 TypeScript)가 들어갑니다. 최상위에서 선언한(또는 import한) 변수는 컴포넌트의 마크업에서 참조할 수 있습니다.

일반 JavaScript 외에도 *룬*을 사용해 [컴포넌트 props]($props)를 선언하고 컴포넌트에 반응성을 더할 수 있습니다. 룬은 다음 섹션에서 다룹니다.

<!-- TODO describe behaviour of `export` -->

## `<script module>`

`module` 속성이 있는 `<script>` 태그는 컴포넌트 인스턴스마다 실행되는 대신, 모듈이 처음 평가될 때 한 번만 실행됩니다. 이 블록에서 선언한 변수는 컴포넌트의 다른 곳에서 참조할 수 있지만, 그 반대는 불가능합니다.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

이 블록에서 바인딩을 `export`하면 컴파일된 모듈의 export가 됩니다. 기본 export는 컴포넌트 자체이므로 `export default`는 할 수 없습니다.

> [!NOTE] TypeScript를 사용하면서 `module` 블록의 export를 `.ts` 파일로 import한다면, TypeScript가 이를 인식하도록 에디터를 설정해야 합니다. Svelte의 VS Code 확장과 IntelliJ 플러그인은 이미 그렇게 되어 있지만, 그 밖의 경우에는 [TypeScript 에디터 플러그인](https://www.npmjs.com/package/typescript-svelte-plugin)을 설정해야 할 수도 있습니다.

> [!LEGACY]
> Svelte 4에서는 이 스크립트 태그를 `<script context="module">`로 만들었습니다

## `<style>`

`<style>` 블록 안의 CSS는 해당 컴포넌트로 스코프가 한정됩니다.

```svelte
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

자세한 내용은 [스타일링](scoped-styles) 섹션을 참고하세요.
