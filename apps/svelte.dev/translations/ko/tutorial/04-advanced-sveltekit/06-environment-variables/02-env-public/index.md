---
title: $app/env/public
---

어떤 환경 변수는 브라우저에 노출해도 안전합니다. 이 연습에서는 그중 두 개를 사용해 페이지의 색 구성을 제어하겠습니다.

`.env`의 두 환경 변수에 값을 추가하세요:

```env
/// file: .env
THEME_BACKGROUND=+++"steelblue"+++
THEME_FOREGROUND=+++"bisque"+++
```

다음으로 `src/env.js`를 만드세요. `@sveltejs/kit/env`에서 `defineEnvVars`를 import하고, 두 변수 모두 `public: true`로 설정하세요:

```js
/// file: src/env.js
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	THEME_BACKGROUND: {
		public: true
	},
	THEME_FOREGROUND: {
		public: true
	}
});
```

이제 `src/routes/+page.svelte`에서 `$app/env/public`으로부터 변수를 import할 수 있습니다:

```svelte
/// file: src/routes/+page.svelte
<script>
---	const THEME_BACKGROUND = 'white';
	const THEME_FOREGROUND = 'black';---
+++	import {
		THEME_BACKGROUND,
		THEME_FOREGROUND
	} from '$app/env/public';+++
</script>
```

환경 변수는 기본적으로 동적이어서, 앱이 시작될 때 값을 읽습니다. 앱을 빌드할 때 값을 알 수 있는 변수라면 설정에 `static: true`를 추가해 값을 번들에 인라인할 수 있고, 데드 코드 제거 같은 최적화가 가능해집니다.

> [!NOTE] SvelteKit 3 이전에는 `env.js` 파일을 선언하는 방법이 없었습니다. 대신 환경 변수에 `PUBLIC_` 접두사를 붙여야 `$env/dynamic/public`과 `$env/static/public`으로 사용할 수 있었습니다.
