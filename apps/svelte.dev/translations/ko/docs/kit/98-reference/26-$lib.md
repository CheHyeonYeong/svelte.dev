---
title: '#lib'
tags: lib
---

[`sv` CLI](/docs/cli/overview)로 새 SvelteKit 프로젝트를 만들면, `package.json`에 다음 내용을 추가해 `src/lib` 디렉터리를 가리키는 `#lib` import 별칭을 자동으로 만들어 줍니다:

```json
{
	"imports": {
		"#lib": "./src/lib/index.js",
		"#lib/*": "./src/lib/*"
	}
}
```

`#` 접두사는 Node에 내장된 [서브패스 import](https://nodejs.org/api/packages.html#subpath-imports) 기능을 활용합니다. 이 기능에서 `#`은 패키지 내부 별칭용으로 예약되어 있습니다. Vite와 TypeScript 모두 이를 기본으로 해석합니다.

> [!LEGACY]
> 이전에는 이 별칭이 `$lib`였고 SvelteKit이 자동으로 설정했습니다. 이제는 `#lib`이며 `package.json`의 `imports` 필드에 직접 선언해야 합니다. `import { foo } from '$lib/foo.js'`는 `import { foo } from '#lib/foo.js'`가 됩니다.

```svelte
<!--- file: src/lib/Component.svelte --->
A reusable component
```

```svelte
<!--- file: src/routes/+page.svelte --->
<script>
	import Component from '#lib/Component.svelte';
</script>

<Component />
```
