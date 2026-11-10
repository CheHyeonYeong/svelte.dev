---
title: 환경 변수
tags: env
---

환경 변수는 앱에 필요하지만 앱의 소스 코드와는 별도로 존재하는 값입니다. 환경 변수를 사용하면 API 키나 데이터베이스 자격 증명 같은 민감한 정보를 버전 관리 시스템에 저장하지 않고도 사용할 수 있습니다.

개발 중과 빌드 시점에는 `.env`나 `.env.local` 파일에 정의된 변수가 환경에 추가됩니다:

```env
/// file: .env.local
API_KEY=19f401ba-e8b0-48c4-8c77-b0ebb26d97fe
```

아래 설정을 마치고 나면, 다음 모듈에서 이 변수들을 가져올 수 있습니다:

- [`$app/env/private`]($app-env-private)
- [`$app/env/public`]($app-env-public)

> [!LEGACY]
> `$env/*` 모듈과 `$app/environment`는 SvelteKit 3에서 지원 중단(deprecated)되었으며(SvelteKit 4에서 제거될 예정입니다), 그 대신 SvelteKit 2.62에서 실험적 옵션으로 추가된 명시적 환경 변수를 사용합니다.

## 설정 <!-- Setup -->

`variables` 객체를 내보내는 `src/env.ts`(또는 `src/env.js`) 파일을 추가하세요:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	// ...
});
```

[`defineEnvVars`](@sveltejs-kit-env#defineEnvVars)에 전달하는 객체의 각 값은 해당 환경 변수를 설정하는 [`EnvVarConfig`](@sveltejs-kit-env#EnvVarConfig) 객체입니다.

> [!NOTE] `defineEnvVars`는 인수를 아무것도 바꾸지 않고 그대로 반환합니다. 순전히 타입 안전성을 돕기 위해 존재하는 함수입니다.

## 비공개 변수 <!-- Private variables -->

기본적으로 모든 변수는 비공개로 간주됩니다. 예를 들어 `API_KEY`는 드러내고 싶지 않을 것입니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	+++API_KEY: {}+++
});
```

> [!NOTE] 이 변수에는 설정이 필요 없으므로 빈 객체(`{}`)를 사용할 수 있습니다.

이제 `API_KEY`가 정의되었으므로 `$app/env/private`를 통해 앱 코드에서 가져올 수 있습니다:

```js
import { API_KEY } from '$app/env/private';
```

`$app/env/private` 모듈은 브라우저에서 실행되는 코드로는 가져올 수 없으므로, 실수로 비밀 값을 JavaScript 번들에 노출하는 일이 없습니다.

## 공개 변수 <!-- Public variables -->

어떤 변수는 브라우저에 노출해도 전혀 안전하며, 오히려 노출해야 하기도 합니다. 이런 변수에는 `public: true`를 지정할 수 있습니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GOOGLE_ANALYTICS_ID: {
		+++public: true+++
	}
});
```

이제 `GOOGLE_ANALYTICS_ID`를 `$app/env/public`에서 가져오거나, `app.html` 템플릿에서 `%sveltekit.env.GOOGLE_ANALYTICS_ID%`로 사용할 수 있습니다:

```html
<!--- file: src/app.html --->
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%

		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id=+++%sveltekit.env.GOOGLE_ANALYTICS_ID%+++"
		></script>

		<script>
			window.dataLayer ??= [];
			function gtag(){dataLayer.push(arguments)}
			gtag('js', new Date());
			gtag('config', +++'%sveltekit.env.GOOGLE_ANALYTICS_ID%'+++);
		</script>
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

## 유효성 검사 <!-- Validation -->

[Zod](https://zod.dev/)나 [Valibot](https://valibot.dev/) 같은 [Standard Schema](https://standardschema.dev/) 검증기를 지정해 환경 변수 값이 올바른지 확인할 수 있습니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';
+++import * as v from 'valibot';+++

export const variables = defineEnvVars({
	GOOGLE_ANALYTICS_ID: {
		public: true,
		+++schema: v.pipe(v.string(), v.regex(/G-[A-Z0-9]+/))+++
	}
});
```

스키마 라이브러리를 들여오고 싶지 않다면, (필요하면 변환한) 값을 반환하거나 문제를 설명하는 오류를 던지는 함수를 전달할 수 있습니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GOOGLE_ANALYTICS_ID: {
		public: true,
		schema: (value) => {
			if (!value?.startsWith('G-')) throw new Error('expected a Google Analytics ID');
			return value;
		}
	}
});
```

값이 유효하지 않으면 앱이 시작(또는 빌드)되지 않습니다. 둘 중 하나에서만 검사를 건너뛰려면 `$app/env`의 [`building`]($app-env#building)을 선택적 값을 허용하는 검증기와 함께 사용하세요:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';
+++import { building } from '$app/env'+++
import * as v from 'valibot';

export const variables = defineEnvVars({
	SECRET: {
		// optional when building but required when starting the app
		+++schema: building ? v.optional(v.string()) : v.string()+++
	}
});
```

검증기를 사용해 값을 선택 사항으로 만들거나 변환할 수 있습니다(문자열을 불리언으로 바꾸거나 JSON을 파싱하는 등). 방법은 사용하는 유효성 검사 라이브러리의 문서를 참고하세요.

## 정적 변수 <!-- Static variables -->

기본적으로 변수는 동적입니다. 변수를 `static: true`로 설정하면 애플리케이션 코드에 인라인되어, 데드 코드 제거 같은 최적화가 가능해집니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
	SHOW_DEBUG_OVERLAY: {
		public: true,
		+++static: true,+++

		// coerce to true/false
		schema: v.pipe(
			v.optional(v.string(), ''),
			v.transform((str) => str !== '')
		)
	}
});
```

이 변수는 `static`이므로, 여기 나온 `<DebugOverlay>` 컴포넌트는 `SHOW_DEBUG_OVERLAY`가 truthy가 아닌 한 JavaScript 번들에서 제외됩니다:

```svelte
<script>
	import { SHOW_DEBUG_OVERLAY } from '$app/env/public';
	import DebugOverlay from '#lib/components/DebugOverlay.svelte';
</script>

{#if SHOW_DEBUG_OVERLAY}
	<DebugOverlay />
{/if}
```

하지만 앱을 빌드하기 전에 변수를 설정하면...

```bash
SHOW_DEBUG_OVERLAY=true npm run build
```

...컴포넌트가 포함되어 표시됩니다.

## 변수 문서화하기 <!-- Documenting variables -->

`description`을 추가해 환경 변수의 용도를 문서화할 수 있습니다:

```ts
/// file: src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	CACHE_TTL_SECONDS: {
		description: 'How long to cache responses, in seconds'
	}
});
```

앱 코드에서 `CACHE_TTL_SECONDS`에 마우스를 올리면 그 설명이 표시됩니다.
