---
title: $app/env/private
---

API 키나 데이터베이스 자격 증명 같은 환경 변수는 `.env` 파일에 추가할 수 있으며, 그러면 애플리케이션에서 사용할 수 있게 됩니다.

> [!NOTE] `.env.local`이나 `.env.[mode]` 파일도 사용할 수 있습니다. 자세한 내용은 [Vite 문서](https://vitejs.dev/guide/env-and-mode.html#env-files)를 참고하세요. 민감한 정보가 담긴 파일은 반드시 `.gitignore` 파일에 추가하세요!

이 연습에서는 환경 변수를 사용해, 올바른 암호 문구를 아는 사용자만 웹사이트에 들어올 수 있게 하려고 합니다.

먼저 `.env`에 새 환경 변수를 추가하세요:

```env
/// file: .env
PASSPHRASE=+++"open sesame"+++
```

다음으로 `src/env.js`를 만들고, `@sveltejs/kit/env`에서 `defineEnvVars`를 import한 뒤 `PASSPHRASE`를 선언하세요:

```js
/// file: src/env.js
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PASSPHRASE: {}
});
```

환경 변수는 기본적으로 비공개이므로, 이제 `$app/env/private`에서 `PASSPHRASE`를 사용할 수 있습니다.

`src/routes/+page.server.js`를 여세요. 변수를 이름으로 import해서 [폼 액션](/tutorial/kit/the-form-element) 안에서 사용하세요:

```js
/// file: src/routes/+page.server.js
import { redirect, fail } from '@sveltejs/kit';
+++import { PASSPHRASE } from '$app/env/private';+++

export function load({ cookies }) {
	if (cookies.get('allowed')) {
		redirect(307, '/welcome');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		if (data.get('passphrase') === +++PASSPHRASE+++) {
			cookies.set('allowed', 'true');

			redirect(303, '/welcome');
		}

		return fail(403, {
			incorrect: true
		});
	}
};
```

이제 올바른 암호 문구를 아는 사람은 누구나 웹사이트에 들어올 수 있습니다.

## 비밀 유지하기 <!-- Keeping secrets -->

민감한 데이터가 실수로 브라우저에 전송되지 않도록 하는 것이 중요합니다. 브라우저에서는 해커나 악당이 쉽게 훔쳐 갈 수 있기 때문입니다.

SvelteKit을 사용하면 이런 일을 쉽게 막을 수 있습니다. `src/routes/+page.svelte`에 `PASSPHRASE`를 import하려고 하면 어떻게 되는지 보세요:

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { PASSPHRASE } from '$app/env/private';+++
	let { form } = $props();
</script>
```

에러 오버레이가 나타나 `$app/env/private`는 클라이언트 측 코드에 import할 수 없다고 알려 줍니다. 이 모듈은 다음과 같은 서버 전용 모듈에만 import할 수 있습니다:

- `+page.server.js`, `+layout.server.js`, `+server.js`, `hooks.server.js` 같은 SvelteKit 서버 모듈
- `server.js`, `foo.server.js`, `foo.server.test.js`처럼 파일 이름에 `server` 세그먼트가 있는 모듈
- `server` 디렉터리 안의 모듈(단, `src/routes`나 `static` 안의 `server` 디렉터리는 제외)

그리고 이 모듈들도 *다른* 서버 모듈에서만 import할 수 있습니다.

## 동적 vs 정적 <!-- Dynamic vs static -->

환경 변수는 기본적으로 동적입니다. 즉 값이 빌드할 때 고정되는 것이 아니라 앱이 실행될 때 읽힙니다. 따라서 앱을 한 번만 빌드하고, 서로 다른 값을 가진 여러 환경에 배포할 수 있습니다.

빌드 시점에 값을 알 수 있다면 정의에 `static: true`를 추가할 수 있습니다. 예를 들어 `.env`에 기능 플래그를 추가해 보세요:

```env
/// file: .env
PASSPHRASE="open sesame"
FEATURE_FLAG_X=enabled
```

그런 다음 정적 변수로 선언하세요:

```js
/// file: src/env.js
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PASSPHRASE: {},
	FEATURE_FLAG_X: {
		static: true
	}
});
```

정적 값은 애플리케이션 코드에 인라인되므로, 데드 코드 제거 같은 유용한 최적화가 가능해집니다:

```js
import { FEATURE_FLAG_X } from '$app/env/private';

if (FEATURE_FLAG_X === 'enabled') {
	// code in here will be removed from the build output
	// if FEATURE_FLAG_X is not enabled
}
```

> [!NOTE] SvelteKit 3 이전에는 `env.js` 파일을 선언하는 방법이 없었습니다. 대신 비공개 환경 변수를 `$env/dynamic/private`와 `$env/static/private`로 자동으로 사용할 수 있었습니다.
