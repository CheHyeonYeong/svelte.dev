---
title: '#lib 서브패스 import'
---

SvelteKit은 디렉터리 기반 라우팅을 사용하므로, 모듈과 컴포넌트를 그것을 사용하는 라우트 옆에 두기 쉽습니다. '코드는 사용하는 곳 가까이에 두라'는 것이 좋은 경험칙입니다.

하지만 때로는 같은 코드를 여러 곳에서 사용합니다. 이럴 때는 import 앞에 `../../../../`를 붙이지 않고도 모든 라우트에서 접근할 수 있는 장소가 있으면 편리합니다. 이 앱의 `package.json`에는 `#lib/*`를 `src/lib` 디렉터리에 대응시키는 [패키지 서브패스 import](https://nodejs.org/api/packages.html#subpath-imports)가 선언되어 있습니다:

```json
/// file: package.json
{
	// ...
	"imports": {
		"#lib": "./src/lib/index.js",
		"#lib/*": "./src/lib/*"
	}
}
```

이는 Node의 표준 기능으로, 새 SvelteKit 앱을 만들면 `package.json`에 자동으로 설정됩니다. 이 설정 덕분에 어떤 모듈에서든 `#lib`로 `src/lib` 안의 모든 것에 접근할 수 있습니다.

이 연습 문제의 두 `+page.svelte` 파일은 모두 `src/lib/message.js`를 import합니다. 그런데 `/a/deeply/nested/route`로 이동하면 접두사를 잘못 적었기 때문에 앱이 깨집니다. `#lib/message.js`를 사용하도록 고쳐 보세요:

```svelte
/// file: src/routes/a/deeply/nested/route/+page.svelte
<script>
	import { message } from +++'#lib/message.js'+++;
</script>

<h1>a deeply nested route</h1>
<p>{message}</p>
```

`src/routes/+page.svelte`도 똑같이 고쳐 보세요:

```svelte
/// file: src/routes/+page.svelte
<script>
	import { message } from +++'#lib/message.js'+++;
</script>

<h1>home</h1>
<p>{message}</p>
```
