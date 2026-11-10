---
title: Bun 서버
---

[`adapter-bun`](https://github.com/sveltejs/kit/tree/main/packages/adapter-bun)은 SvelteKit 애플리케이션을 독립 실행형 [Bun](https://bun.com/) 서버로 빌드합니다. 생성된 서버는 요청 처리에 `Bun.serve`를 사용하고, 클라이언트 에셋, 프리렌더링 결과물, 그리고 `$app/server`의 [`read`](https://svelte.dev/docs/kit/$app-server#read)로 읽은 파일은 `Bun.file` 응답으로 제공합니다.

> [!NOTE] Bun 1.4 이상이 필요합니다.

## 사용법 <!-- Usage -->

`npx sv add sveltekit-adapter="adapter:bun"`을 실행하거나, `npm i -D @sveltejs/adapter-bun`으로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter()
		})
	]
});
```

어댑터는 Bun의 빌드 API를 호출하므로 프로덕션 빌드 자체도 Bun에서 실행해야 합니다. `--bun` 플래그는 Vite의 Node.js 셔뱅(shebang)을 덮어씁니다:

```sh
bun run --bun build
```

기본 빌드 결과물은 `build`에 기록됩니다. 다음 명령으로 시작하세요:

```sh
bun ./build
```

애플리케이션을 실행하려면 출력 디렉터리, 프로젝트의 `package.json`, 그리고 `node_modules`의 프로덕션 의존성이 필요합니다. 프로덕션 의존성은 `package.json`과 `bun.lock`을 복사한 뒤 `bun install --production --frozen-lockfile`을 실행해 만들 수 있습니다(앱에 의존성이 하나도 없다면 이 단계는 건너뛰어도 됩니다). 개발 의존성은 앱에 번들됩니다. 특정 패키지를 번들에 포함할지 외부로 둘지 정하려면 `package.json`에서 각각 `devDependencies` 또는 `dependencies`에 넣으세요.

클라이언트 에셋과 프리렌더링 결과물은 Bun 네이티브 라우트로 등록됩니다. 이 라우트는 `GET`과 `HEAD` 요청만 처리하고, 다른 메서드는 SvelteKit으로 넘어갑니다. 모든 에셋에는 빌드 중에 계산된 ETag가 붙으므로, 조건부 요청은 빈 `304` 응답으로 재검증됩니다. MIME 타입, 파일 시스템 기반 파일의 바이트 범위, 그리고 모든 에셋을 메모리에 버퍼링하지 않는 스트리밍은 Bun이 제공합니다. SvelteKit의 `immutable` 디렉터리 아래에 있는 파일에는 `Cache-Control: public,max-age=31536000,immutable`이 붙습니다.

> [!NOTE] Bun은 라우트 경로명의 `*`를 와일드카드로 취급합니다. 어댑터는 `*` 문자 자체가 들어간 클라이언트 파일 이름과 프리렌더링 파일 이름을 거부하므로, 빌드하기 전에 해당 파일의 이름을 바꾸세요.

## 옵션 <!-- Options -->

```js
// @errors: 2307 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				out: 'build',
				envPrefix: '',
				serverOptions: {
					idleTimeout: 30
				}
			})
		})
	]
});
```

### out

출력 디렉터리입니다. 기본값은 `build`입니다.

### precompress

`precompress: true`로 설정하면 빌드 중에 클라이언트 에셋과 프리렌더링된 에셋의 `.br`, `.gz` 버전을 생성합니다. 생성된 라우트는 요청마다 `Accept-Encoding`을 협상해 gzip보다 brotli를 우선하며, 각 버전은 자체 ETag를 가집니다. `buildOptions.compile`이 설정되어 있으면 내장된 에셋을 고유 경로(identity path)로 import하므로 이 옵션은 무시됩니다.

### envPrefix

아래에서 설명하는 모든 배포용 환경 변수에 붙일 접두사입니다. 접두사 없는 이름이 호스트가 관리하는 변수와 충돌할 때 유용합니다:

```js
// @errors: 2307
import adapter from '@sveltejs/adapter-bun';
// ---cut---
adapter({ envPrefix: 'MY_APP_' });
```

```sh
MY_APP_HOST=127.0.0.1 MY_APP_PORT=4000 bun ./build
```

접두사가 설정되어 있으면, 서버는 시작할 때 그 접두사가 붙은 알 수 없는 환경 변수를 발견하면 실패합니다. 이렇게 이름 충돌과 오타를 잡아냅니다.

### serverOptions

`Bun.serve`에 전달되는 JSON 직렬화 가능한 기본값입니다. 지원하는 속성은 다음과 같습니다:

- `hostname`
- `port`
- `unix`
- `reusePort`
- `ipv6Only`
- `idleTimeout`
- `maxRequestBodySize`
- `development`

환경 변수가 이 기본값보다 우선합니다. Unix 소켓이 설정되어 있으면 `hostname`, `port`, `reusePort`, `ipv6Only`보다 우선합니다.

`fetch`와 `routes`는 생성된 서버가 직접 관리합니다. `websocket`, `error`, TLS, HTTP/3, HTTP/1 설정은 `serverOptions`로 노출하지 않습니다. 애플리케이션에 이런 `Bun.serve` 옵션이 필요하다면 Bun과의 통합을 직접 구성하세요.

### buildOptions

`buildOptions`는 서버를 실행 파일로 만드는 `Bun.build` 호출을 설정하므로 `compile`이 설정된 경우에만 적용됩니다. 어댑터는 `sourcemap`, `minify`, `bytecode`, `banner`, `footer`, `drop`, `features`, `optimizeImports`, `external`, `compile`을 받습니다. 진입점, 출력 디렉터리, 최상위 `target`, 모듈 `format`은 예약되어 있습니다. 소스 맵의 기본값은 `external`이며, 끄려면 `sourcemap: 'none'`으로 설정하세요.

#### 컴파일된 실행 파일 <!-- Compiled executables -->

`compile: true`로 설정하면 `<out>/server`에 단일 실행 파일이 생성됩니다:

```js
// @errors: 2307
import adapter from '@sveltejs/adapter-bun';
// ---cut---
adapter({
	buildOptions: {
		compile: true
	}
});
```

Bun 런타임을 따로 설치하지 않아도 빌드하고 실행할 수 있습니다:

```sh
bun run --bun build
./build/server
```

실행 파일에는 서버 코드, 클라이언트 에셋, 프리렌더링 결과물, Bun 런타임이 내장됩니다. `compile`에는 Bun 대상 문자열(기본 `server` 파일 이름은 유지됨)이나 옵션 객체를 넣을 수도 있습니다. 실행 파일의 이름을 바꾸거나 크로스 컴파일하려면 옵션 객체를 넘기세요:

```js
// @errors: 2307
import adapter from '@sveltejs/adapter-bun';
// ---cut---
adapter({
	out: 'dist',
	buildOptions: {
		compile: {
			outfile: 'application',
			target: 'bun-linux-x64'
		},
		minify: true,
		bytecode: true,
		sourcemap: 'linked'
	}
});
```

이 예시의 결과물은 `dist/application`입니다. 플랫폼 대상, 네이티브 의존성, 그 밖의 제약 사항은 [Bun의 실행 파일 컴파일 규칙](https://bun.com/docs/bundler/executables)을 따릅니다.

실행 파일은 의존성을 찾을 `node_modules`가 없으므로 프로덕션 의존성을 번들에 포함합니다. 대신 런타임에 `node_modules`에서 패키지를 찾게 하려면, 그 패키지를 `external`에 나열하고 `compile: { autoloadPackageJson: true }`로 설정하세요. `jsdom`처럼 자기 위치를 기준으로 파일을 읽는 패키지는 이 방법으로만 동작합니다.

## 환경 변수 <!-- Environment variables -->

Bun은 `.env` 파일을 자동으로 로드합니다. `envPrefix`가 설정되어 있다면 이 절의 모든 이름 앞에 그 접두사를 붙이세요.

### 리스너 <!-- Listener -->

`HOST`와 `PORT`는 TCP 리스너를 설정합니다. 둘 다 없고 `serverOptions` 기본값도 없으면 서버는 `3000`번 포트에서 연결을 기다립니다.

```sh
HOST=127.0.0.1 PORT=4000 bun ./build
```

`SOCKET_PATH`를 쓰면 대신 Unix 도메인 소켓을 사용합니다. 이 값이 있으면 TCP 전용 옵션은 무시됩니다:

```sh
SOCKET_PATH=/tmp/sveltekit.sock bun ./build
```

`REUSE_PORT`는 Bun의 `reusePort` 옵션을, `IPV6_ONLY`는 `ipv6Only`를 켭니다. 불리언 변수는 대소문자와 관계없이 `1`, `true`, `yes`, `on` 또는 `0`, `false`, `no`, `off`를 받습니다.

### 요청 제한과 진단 <!-- Request limits and diagnostics -->

`BODY_SIZE_LIMIT`은 `Bun.serve`의 `maxRequestBodySize`를 제어합니다. 기본값은 `512K`입니다. 값은 바이트 단위의 정수가 되어야 하며, `768K`나 `1.5M`처럼 대소문자를 구분하지 않는 2진 단위 접미사 `K`, `M`, `G`를 쓸 수 있습니다. `Infinity`로 설정하면 제한이 없어집니다.

`CONNECTION_IDLE_TIMEOUT`은 Bun의 요청별 비활성 타임아웃을 초 단위로 설정합니다. `0`부터 `255`까지의 정수여야 하며, `0`이면 타임아웃이 꺼집니다. 생성된 핸들러는 콘텐츠 타입이 `text/event-stream`으로 시작하는 응답에서는 타임아웃을 끄고 `X-Accel-Buffering: no`도 추가합니다. 이름을 일부러 `IDLE_TIMEOUT`으로 하지 않은 것은 adapter-node에서 이 이름이 다른 의미(N초 동안 요청이 없으면 서버를 종료)로 쓰이기 때문입니다.

`DEVELOPMENT`는 Bun의 개발 모드 에러 페이지를 켭니다. 생성된 서버에서는 기본값이 `false`입니다.

### 프록시 뒤의 공개 출처 <!-- Public origin behind a proxy -->

[`paths.origin`](@sveltejs-kit-vite#paths)이 설정되어 있으면 그 값이 모든 요청에서 신뢰할 수 있는 출처가 됩니다. 그렇지 않으면 어댑터는 `Host` 헤더에서 호스트를 알아내고, 프로덕션 배포에서는 보통 앞단에서 TLS를 종료하므로 스킴을 `https`로 가정합니다. 이 가정이 틀렸다면(예를 들어 일반 HTTP로 직접 서비스하는 경우) `paths.origin`이나 `PROTOCOL_HEADER`를 설정하세요.

신뢰할 수 있는 리버스 프록시 뒤에서는 `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`로 공개 스킴, 호스트, 포트가 담긴 헤더의 이름을 지정합니다:

```sh
PROTOCOL_HEADER=x-forwarded-proto \
HOST_HEADER=x-forwarded-host \
PORT_HEADER=x-forwarded-port \
bun ./build
```

프로토콜 헤더에는 콜론 없이 `http` 또는 `https`가 들어 있어야 합니다. 포트 헤더에는 숫자가 들어 있어야 합니다. 값이 올바르지 않으면 `400 Bad Request` 응답이 반환됩니다. 헤더가 있지만 비어 있으면 무시하고 대체 값을 사용합니다.

> [!CAUTION] 직접 제어하는 프록시를 통해서만 요청이 서버에 도달할 수 있을 때에만 전달된 헤더를 신뢰하세요. 클라이언트가 직접 접속하면 이 헤더를 위조할 수 있습니다.

### 프록시 뒤의 클라이언트 주소 <!-- Client addresses behind a proxy -->

[`event.getClientAddress()`](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent)는 기본적으로 `server.requestIP(request).address`를 사용합니다. 직접 연결된 상대가 프록시라면 `ADDRESS_HEADER`에 신뢰할 수 있는 프록시 헤더의 이름을 설정하세요:

```sh
ADDRESS_HEADER=true-client-ip bun ./build
```

`x-forwarded-for`를 쓴다면 `XFF_DEPTH`에 신뢰할 수 있는 프록시의 수도 설정하세요. 기본 깊이는 `1`이며, 어댑터는 쉼표로 구분된 목록의 오른쪽부터 주소를 고르므로 클라이언트가 왼쪽에 넣은 항목은 신뢰할 수 있는 결과를 바꿀 수 없습니다:

```sh
ADDRESS_HEADER=x-forwarded-for XFF_DEPTH=2 bun ./build
```

`XFF_DEPTH`는 `1` 이상의 정수여야 합니다. 설정한 헤더가 없거나 설정한 깊이보다 주소가 적으면 `getClientAddress()`가 에러를 던집니다.

## 플랫폼 API <!-- Platform API -->

요청 이벤트의 `platform` 속성은 Bun 서버 인스턴스를 노출합니다:

```js
/** @type {import('./$types').RequestHandler} */
export function GET({ getClientAddress, platform }) {
	return Response.json({
		address: getClientAddress(),
		serverId: platform.server.id,
		pendingRequests: platform.server.pendingRequests,
		pendingWebSockets: platform.server.pendingWebSockets
	});
}
```

## 정상 종료 <!-- Graceful shutdown -->

`SIGINT`나 `SIGTERM`을 받으면 생성된 서버는 `server.stop()`을 호출합니다. Bun은 새 연결을 더 이상 받지 않고, 어댑터는 대기 중인 요청이 끝나기를 기다린 뒤 신호 이름과 함께 `sveltekit:shutdown` 프로세스 이벤트를 발생시킵니다:

```js
process.on('sveltekit:shutdown', async (reason) => {
	await jobs.stop();
	await db.close();
});
```

`SHUTDOWN_TIMEOUT`초가 지난 뒤에도 열려 있는 연결은 강제로 닫히므로, 열려 있는 이벤트 스트림 같은 유휴 연결이 종료를 무한정 늦출 수 없습니다. 값은 음이 아닌 정수여야 하며 기본값은 `30`입니다.

종료 신호를 한 번 더 보내면 프로세스가 상태 코드 `1`로 강제 종료됩니다.
