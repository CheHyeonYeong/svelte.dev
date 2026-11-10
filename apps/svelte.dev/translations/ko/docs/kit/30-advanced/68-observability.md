---
title: 관측 가능성
---

<blockquote class="since note">
	<p>2.31부터 사용 가능</p>
</blockquote>

성능을 개선하거나 골치 아픈 버그의 근본 원인을 찾기 위해 애플리케이션이 어떻게 동작하는지 관측해야 할 때가 있습니다. 이를 돕기 위해 SvelteKit은 다음 항목에 대해 서버 사이드 [OpenTelemetry](https://opentelemetry.io) 스팬(span)을 내보낼 수 있습니다:

- [`handle`](hooks#handle) 훅과 [`sequence`](@sveltejs-kit-hooks#sequence) 안에서 실행되는 `handle` 함수(서로의 자식, 그리고 루트 `handle` 훅의 자식으로 표시됩니다)
- 서버 [`load`](load) 함수, 그리고 서버에서 실행될 때의 유니버설 `load` 함수
- [폼 액션](form-actions)
- [`+server`](routing#server) 핸들러
- [원격 함수](remote-functions)

하지만 SvelteKit에 스팬을 내보내라고 하는 것만으로는 큰 도움이 되지 않습니다. 스팬을 보려면 실제로 어딘가에 수집해야 합니다. SvelteKit은 트레이싱 설정과 계측 코드를 작성할 곳으로 `src/instrumentation.server.ts`를 제공합니다. 이 파일이 있으면 애플리케이션 코드보다 먼저 로드됩니다(배포 플랫폼이 이를 지원하고 어댑터가 이 파일을 인식하는 경우).

SvelteKit의 내장 스팬 내보내기를 활성화하려면 `vite.config.js`에서 SvelteKit 플러그인의 `tracing.server` 옵션을 `true`로 설정하세요:

```js
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			+++tracing: {
				server: true
			}+++
		})
	]
});
```

> [!NOTE] 트레이싱, 그리고 더 크게는 관측 가능성 계측은 무시할 수 없는 오버헤드를 일으킬 수 있습니다. 트레이싱을 전면적으로 도입하기 전에 정말 필요한지, 아니면 개발 환경과 프리뷰 환경에서만 켜는 편이 더 적절한지 생각해 보세요.

## 내장 트레이싱 확장하기 <!-- Augmenting the built-in tracing -->

SvelteKit은 요청 이벤트에서 `root` 스팬과 `current` 스팬에 접근할 수 있게 해 줍니다. 루트 스팬은 루트 `handle` 함수와 연결된 스팬이며, 현재 스팬은 컨텍스트에 따라 `handle`, `load`, 폼 액션, `+server` 핸들러, 원격 함수 중 하나와 연결될 수 있습니다. 이 스팬에 기록하고 싶은 속성을 무엇이든 추가할 수 있습니다:

```js
/// file: #lib/authenticate.ts

// @filename: ambient.d.ts
declare module '#lib/auth-core.js' {
	export function getAuthenticatedUser(): Promise<{ id: string }>
}

// @filename: index.js
// ---cut---
import { getRequestEvent } from '$app/server';
import { getAuthenticatedUser } from '#lib/auth-core.js';

async function authenticate() {
	const user = await getAuthenticatedUser();
	const event = getRequestEvent();
	event.tracing.root.setAttribute('userId', user.id);
}
```

## 개발 환경 빠른 시작 <!-- Development quickstart -->

첫 트레이스를 보려면 로컬 수집기(collector)를 설정해야 합니다. 이 예시에서는 사용하기 쉬운 빠른 시작 명령을 제공하는 [Jaeger](https://www.jaegertracing.io/docs/getting-started/)를 사용합니다. 수집기가 로컬에서 실행되면 다음을 진행하세요:

- 앞에서 설명한 대로 `vite.config.js` 파일에서 트레이싱을 활성화하고, `src/instrumentation.server.js`를 만듭니다(SvelteKit이 자동으로 로드합니다)
- 패키지 매니저로 필요한 의존성을 설치합니다:
  ```sh
  npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle
  ```
- 다음 내용으로 `src/instrumentation.server.js`를 만듭니다:

```js
// @errors: 2307
/// file: src/instrumentation.server.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { register } from 'import-in-the-middle/register-hooks.mjs';

register();

const sdk = new NodeSDK({
	serviceName: 'test-sveltekit-tracing',
	traceExporter: new OTLPTraceExporter(),
	instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

이제 서버 사이드 요청이 트레이스를 생성하기 시작하며, Jaeger의 웹 콘솔 [localhost:16686](http://localhost:16686)에서 확인할 수 있습니다.

> [!NOTE] `import-in-the-middle/register-hooks.mjs`는 [`module.registerHooks()`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)로 로더를 등록하며, 이 API는 애플리케이션 스레드에서 훅을 동기적으로 실행합니다. 덕분에 예전의 `module.register()` 기반 설정에 필요했던 스레드 간 메시지 채널을 쓰지 않아도 됩니다.
>
> 동기 로더에는 Node.js 22.22.3+, 24.11.1+, 25.1.0+ 또는 26.0.0+가 필요합니다. 이보다 오래된 Node.js 버전에서는 `register()`가 에러를 던집니다. 이런 버전을 지원해야 한다면 비동기 로더로 대체하세요:
>
> ```js
> // @errors: 2307
> /// file: src/instrumentation.server.js
> import { NodeSDK } from '@opentelemetry/sdk-node';
> import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
> import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
> import { register, supportsSyncHooks } from 'import-in-the-middle/register-hooks.mjs';
> import { createAddHookMessageChannel } from 'import-in-the-middle';
> import { register as registerAsync } from 'node:module';
>
> if (supportsSyncHooks()) {
> 	register();
> } else {
> 	const { registerOptions } = createAddHookMessageChannel();
> 	registerAsync('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);
> }
>
> const sdk = new NodeSDK({
> 	serviceName: 'test-sveltekit-tracing',
> 	traceExporter: new OTLPTraceExporter(),
> 	instrumentations: [getNodeAutoInstrumentations()]
> });
>
> sdk.start();
> ```
>
> 비동기 `module.register()` API는 Node.js 25.9.0에서 지원 중단(deprecated)되었고 26.0.0부터는 런타임 지원 중단 경고를 내보내므로, Node.js 버전이 지원한다면 가능한 한 동기 방식을 사용하세요.

## `@opentelemetry/api`

SvelteKit은 스팬을 생성하기 위해 `@opentelemetry/api`를 사용합니다. 이 패키지는 선택적 피어 의존성(optional peer dependency)으로 선언되어 있으므로, 트레이스가 필요 없는 사용자는 설치 크기나 런타임 성능에 아무런 영향을 받지 않습니다. 대부분의 경우 SvelteKit의 스팬을 수집하도록 애플리케이션을 설정한다면 `@opentelemetry/sdk-node`나 `@vercel/otel` 같은 라이브러리를 설치하게 되는데, 이 라이브러리들은 `@opentelemetry/api`에 의존하므로 SvelteKit의 의존성도 함께 충족됩니다. SvelteKit에서 `@opentelemetry/api`를 찾을 수 없다는 에러가 나온다면, 아직 트레이스 수집을 설정하지 않았기 때문일 수 있습니다. 설정을 *마쳤는데도* 계속 에러가 보인다면 `@opentelemetry/api`를 직접 설치하면 됩니다.

## 번들링 시 주의 사항 <!-- Bundling caveats -->

OpenTelemetry 자동 계측은 일반적으로 import를 가로채 모듈의 내보내기를 계측된 버전으로 교체하거나 감싸는 방식으로 동작합니다. 위 예시에서 `import-in-the-middle`이 하는 일이 바로 이것입니다. ESM 모듈의 내보내기는 변경할 수 없으므로, 가로채기 장치(interceptor)는 계측 대상 모듈이 평가되기 전에 설치되어야 합니다. 그래서 `instrumentation.server.js`는 특별한 진입점이며, SvelteKit은 애플리케이션 코드를 동적으로 가져오기 전에 이 파일이 실행되도록 순서를 조정합니다. 의도된 순서는 다음과 같습니다:

1. `instrumentation.server.js`가 `my-database-library`에 대한 가로채기 장치를 등록합니다
2. 애플리케이션이 `my-database-library`를 가져옵니다
3. 가로채기 장치가 그 import를 관찰하고 계측된 내보내기를 반환합니다

번들링은 두 가지 방식으로 이 순서를 방해할 수 있습니다.

첫째, 번들러가 `instrumentation.server.js`에서 가져온 코드와 애플리케이션 코드를 같은 공유 청크에 넣을 수 있습니다. 그러면 계측을 초기화하려고 그 청크를 가져올 때, 가로채기 장치가 설치되기도 전에 애플리케이션 코드가 평가될 수 있습니다. 애플리케이션을 동적으로 가져올 즈음에는 이미 모듈이 ESM 모듈 캐시에 들어 있어서 계측하기에는 너무 늦습니다.

피할 수 없는 닭과 달걀 문제도 있습니다. [`$app/env/*` 모듈](environment-variables)을 가져오면 `src/env.js` 모듈과 그 의존성이 평가됩니다. 이 때문에 계측은 `src/env`가 가져오는 모듈을 가로챌 수 없습니다. 그 모듈은 `instrumentation.server.js`가 시작되기 전에 실행되어야 하기 때문입니다. 따라서 계측해야 하는 것은 `src/env.js`에서 가져오지 않도록 하세요.

둘째, 번들러가 계측하려는 모듈을 인라인하거나 변환할 수 있습니다. 예를 들어 다음 코드를...

```js
// @errors: 2307 example library
import { query } from 'my-database-library';
```

...애플리케이션 청크에 직접 삽입된 코드로 바꾸거나, `import { query } from './chunks/abc.js'` 같은 import로 바꿀 수 있습니다. 그러면 런타임에는 가로채기 장치가 관찰할 `my-database-library` import가 더 이상 존재하지 않습니다. 트리 셰이킹과 내보내기 재작성도 모듈의 형태를 OpenTelemetry 계측이 인식하지 못하는 방식으로 바꿀 수 있습니다.

SvelteKit은 `@opentelemetry/api`를 자동으로 외부화(externalize)해서 SvelteKit 런타임과 여러분의 계측 코드가 같은 모듈 인스턴스를 공유하도록 합니다. 다른 라이브러리가 기대한 대로 계측되지 않는다면, Vite에 그 라이브러리를 서버 번들에서 제외하라고 알려 주세요:

```js
/// file: vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: ['my-database-library']
	}
});
```

외부화하면 서버 출력에 `my-database-library`를 그대로 가져오는 import가 유지됩니다. 그러면 Node.js는 `instrumentation.server.js`가 가로채기 장치를 등록한 뒤 런타임에 패키지를 로드하므로, 계측이 그 패키지를 감쌀 기회를 얻습니다. 계측 대상 패키지와, 그 계측에서 import가 보여야 하는 패키지들을 외부화하세요. 애플리케이션 소스 파일은 외부화하지 말고, 의존성을 무분별하게 외부화하는 것도 피하세요. 그렇게 하면 의존성이 확인(resolve)되고 배포되는 방식이 바뀔 수 있습니다.

런타임에 필요한 의존성은 배포된 애플리케이션에서 사용할 수 있도록 `devDependencies`가 아니라 `dependencies`에 나열해야 합니다. `adapter-node`도 Vite 출력을 번들링할 때 이 구분을 사용합니다. `dependencies`에 나열된 패키지는 깊은 경로의 import까지 포함해 최종 번들에서 자동으로 외부에 둡니다. 그래도 그 이전 단계인 SSR 빌드에서 Vite가 패키지를 번들링하지 않도록 하려면 `ssr.external`이 필요할 수 있습니다.

다른 공식 어댑터는 이처럼 `dependencies` 기반의 외부화 규칙을 자체적으로 적용하지 않습니다. 어떤 어댑터나 배포 플랫폼은 자체적인 트레이싱 또는 번들링 단계를 수행하고, 어떤 것은 런타임 패키지 import를 아예 지원하지 않습니다. 이런 환경에서는 Vite의 `ssr.external` 설정이 충분하지 않거나 지원되지 않을 수 있습니다. 의존성을 외부에 둘 수 있는지 어댑터나 플랫폼 문서를 참고해 확인하세요.
