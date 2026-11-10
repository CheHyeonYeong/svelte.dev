---
title: @sveltejs/kit/env
---



```js
// @noErrors
import { defineEnvVars } from '@sveltejs/kit/env';
```

## defineEnvVars

`$app/env/public`과 `$app/env/private`을 통해 제공되는
[환경 변수](/docs/kit/environment-variables)를 정의하는 유틸리티입니다.

```js
// @errors: 7031
import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
	API_URL: {
		schema: v.pipe(v.string(), v.url())
	},
	PORT: {
		schema: (value) => {
			if (value === undefined) return 3000;
			const port = Number(value);
			if (!Number.isInteger(port)) throw new Error('PORT must be an integer');
			return port;
		}
	}
});
```

<div class="ts-block">

```dts
function defineEnvVars<
	T extends Record<string, EnvVarConfig<any>>
>(variables: T): DefinedEnvVars<T>;
```

</div>



## DefinedEnvVars

[`defineEnvVars`](/docs/kit/@sveltejs-kit-env#defineEnvVars)의 반환 타입입니다.

<div class="ts-block">

```dts
type DefinedEnvVars<
	T extends Record<string, EnvVarConfig<any>>
> = {
	readonly [K in keyof T]: EnvVarEntry<T[K]>;
};
```

</div>

## EnvVarConfig

[`defineEnvVars`](/docs/kit/@sveltejs-kit-env#defineEnvVars)로 만든 `variables` 객체를 `src/env.ts`에서
내보내면 [환경 변수](/docs/kit/environment-variables)를 설정할 수 있습니다.

<div class="ts-block">

```dts
interface EnvVarConfig<T> {/*…*/}
```

<div class="ts-block-property">

```dts
public?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

클라이언트 사이드 코드에서 이 환경 변수에 접근할 수 있는지 여부입니다.
- `true`이면 `$app/env/public`에서 가져올 수 있습니다
- `false`이면 [서버 전용 모듈](/docs/kit/server-only-modules)인 `$app/env/private`에서 가져올 수 있습니다

</div>
</div>

<div class="ts-block-property">

```dts
static?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

값을 빌드 시점에 정할지, 앱이 실행될 때 정할지를 나타냅니다.
- `true`이면 빌드 시점의 값이 번들에 인라인됩니다. 덕분에 데드 코드 제거 같은 최적화가 가능합니다
- `false`이면 앱이 시작될 때 환경에서 값을 읽습니다

</div>
</div>

<div class="ts-block-property">

```dts
schema?: StandardSchemaV1<string | undefined, T> | ((value: string | undefined) => T | undefined);
```

<div class="ts-block-property-details">

앱이 시작될 때 값에 적용되는 [Standard Schema](https://standardschema.dev/) 검증기입니다.
또는 (변환되었을 수도 있는) 값을 반환하거나, 문제를 설명하는 에러를 던지는
함수를 지정할 수도 있습니다. `undefined`를 반환해도 되므로, 함수로 선택적 변수를 표현할 수 있습니다.
검증기는 문자열이 아니어도 어떤 값이든 출력할 수 있지만, 공개(public)이면서 정적이 아닌 값은 브라우저로 보낼 수 있도록
[devalue](https://github.com/sveltejs/devalue)로 직렬화할 수 있어야 합니다.

생략하면 값은 반드시 설정되어 있어야 하지만, 빈 문자열이어도 됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
description?: string;
```

<div class="ts-block-property-details">

마우스를 올렸을 때 보여 줄 인라인 문서에 쓰이는 변수 설명입니다.

</div>
</div></div>


