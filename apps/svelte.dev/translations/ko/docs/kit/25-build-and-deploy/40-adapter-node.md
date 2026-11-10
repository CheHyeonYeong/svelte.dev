---
title: Node 서버
---

독립 실행형 Node 서버를 생성하려면 [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node)를 사용하세요.

빠르게 시작하려면 SvelteKit의 [공식 Railway 템플릿](https://railway.com/deploy/svelte-kit)으로 프로젝트를 배포해 보세요.

## 사용법 <!-- Usage -->

[`npx sv add sveltekit-adapter="adapter:node"`](/docs/cli/sveltekit-adapter)를 실행하거나, `npm i -D @sveltejs/adapter-node`로 설치한 뒤 `vite.config.js`에 어댑터를 추가하세요:

```js
// @errors: 2307 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-node';
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

## 배포하기 <!-- Deploying -->

먼저 `npm run build`로 앱을 빌드합니다. 그러면 어댑터 옵션에 지정한 출력 디렉터리(기본값은 `build`)에 프로덕션 서버가 만들어집니다.

애플리케이션을 실행하려면 출력 디렉터리, 프로젝트의 `package.json`, 그리고 `node_modules`의 프로덕션 의존성이 필요합니다. 프로덕션 의존성은 `package.json`과 `package-lock.json`을 복사한 뒤 `npm ci --omit dev`를 실행해 만들 수 있습니다(앱에 의존성이 하나도 없다면 이 단계는 건너뛰어도 됩니다). 그런 다음 이 명령으로 앱을 시작할 수 있습니다:

```sh
node build
```

개발 의존성은 [Rolldown](https://rolldown.rs/)을 통해 앱에 번들됩니다. 특정 패키지를 번들에 포함할지 외부로 둘지 정하려면 `package.json`에서 각각 `devDependencies` 또는 `dependencies`에 넣으세요.

클라이언트 에셋과 프리렌더링 결과물은 빌드 중에 기록된 파일 목록을 바탕으로 제공됩니다.

### 응답 압축하기 <!-- Compressing responses -->

보통은 서버에서 나가는 응답을 압축하고 싶을 것입니다. 이미 SSL이나 로드 밸런싱을 위해 리버스 프록시 뒤에 서버를 배포하고 있다면, Node.js는 싱글 스레드이므로 압축도 그 계층에서 처리하는 편이 대개 성능이 더 좋습니다.

하지만 [커스텀 서버](#Custom-server)를 만들면서 그곳에 압축 미들웨어를 추가하고 싶다면 [`@polka/compression`](https://www.npmjs.com/package/@polka/compression)을 사용하길 권합니다. SvelteKit은 응답을 스트리밍하는데, 더 널리 쓰이는 `compression` 패키지는 스트리밍을 지원하지 않아 사용 시 에러가 날 수 있기 때문입니다.

## 환경 변수 <!-- Environment variables -->

`dev`와 `preview`에서 SvelteKit은 `.env` 파일(또는 [Vite가 정하는 대로](https://vitejs.dev/guide/env-and-mode.html#env-files) `.env.local`이나 `.env.[mode]`)에서 환경 변수를 읽습니다.

프로덕션에서는 `.env` 파일이 자동으로 로드되지 _않습니다_. 로드하려면 빌드된 앱을 실행할 때 [`--env-file`](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) 플래그를 사용하세요:

```sh
node +++--env-file=.env+++ build
```

### `PORT`, `HOST`, `SOCKET_PATH` <!-- `PORT`, `HOST` and `SOCKET_PATH` -->

기본적으로 서버는 `0.0.0.0`의 3000번 포트에서 연결을 받습니다. 이 값은 `PORT`와 `HOST` 환경 변수로 바꿀 수 있습니다:

```sh
HOST=127.0.0.1 PORT=4000 node build
```

또는 지정한 소켓 경로에서 연결을 받도록 서버를 설정할 수도 있습니다. `SOCKET_PATH` 환경 변수로 이렇게 설정하면 `HOST`와 `PORT` 환경 변수는 무시됩니다.

```sh
SOCKET_PATH=/tmp/socket node build
```

### `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER` <!-- `PROTOCOL_HEADER`, `HOST_HEADER`, and `PORT_HEADER` -->

HTTP에는 SvelteKit이 현재 요청되고 있는 URL을 확실하게 알아낼 방법이 없습니다. 기본적으로 SvelteKit은 요청의 `host` 헤더(그리고 `PROTOCOL_HEADER`가 설정되지 않았다면 `https` 프로토콜)로부터 출처를 알아냅니다.

요청 시점에 알 수 없는 출처에서 앱이 제공된다면(예를 들어 `host` 헤더를 전달하지 않는 리버스 프록시 뒤에 있거나, 요청의 호스트와 다른 정식 출처를 CSRF 검사에 쓰고 싶은 경우) `vite.config.js`에서 [`paths.origin`](@sveltejs-kit-vite#paths) 옵션을 설정할 수 있습니다:

```js
// @errors: 2307
/// file: vite.config.js
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			paths: {
				origin: process.env.ORIGIN
			}
		})
	]
});
```

`paths.origin`이 설정되지 않았다면(기본값) `adapter-node`는 요청에서 `host` 헤더(그리고 설정되어 있다면 `PROTOCOL_HEADER`/`PORT_HEADER`)를 사용해 출처를 알아내고, 그에 맞게 `request.url`을 설정합니다. 설정되어 있다면 그 값을 폼 제출과 원격 함수 호출의 CSRF 검사에서 신뢰할 수 있는 자기 출처로 사용하고, 프리렌더링 중에는 `url.origin`의 값으로 사용합니다.

또는 요청 프로토콜과 호스트를 SvelteKit에 알려 주는 헤더를 지정할 수도 있습니다. SvelteKit은 이를 바탕으로 출처 URL을 구성합니다:

```sh
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build
```

> [!NOTE] [`x-forwarded-proto`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto)와 [`x-forwarded-host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host)는 리버스 프록시(로드 밸런서나 CDN 등)를 사용할 때 원래의 프로토콜과 호스트를 전달하는 사실상의 표준 헤더입니다. 이 변수들은 서버가 신뢰할 수 있는 리버스 프록시 뒤에 있을 때만 설정해야 합니다. 그렇지 않으면 클라이언트가 이 헤더를 위조할 수 있습니다.
>
> 프록시를 비표준 포트에서 호스팅하고 있고 리버스 프록시가 `x-forwarded-port`를 지원한다면 `PORT_HEADER=x-forwarded-port`도 설정할 수 있습니다.

`adapter-node`가 배포의 URL을 올바르게 알아내지 못하면 [폼 액션](form-actions)을 사용할 때 다음 에러가 날 수 있습니다:

> Cross-site POST form submissions are forbidden

### `ADDRESS_HEADER`, `XFF_DEPTH` <!-- `ADDRESS_HEADER` and `XFF_DEPTH` -->

훅과 엔드포인트에 전달되는 [`RequestEvent`](@sveltejs-kit#RequestEvent) 객체에는 클라이언트의 IP 주소를 반환하는 `event.getClientAddress()` 함수가 들어 있습니다. 기본적으로 이 값은 연결한 쪽의 `remoteAddress`입니다. 서버가 하나 이상의 프록시(로드 밸런서 등) 뒤에 있다면 이 값에는 클라이언트가 아니라 가장 안쪽 프록시의 IP 주소가 들어가므로, 주소를 읽어 올 `ADDRESS_HEADER`를 지정해야 합니다:

```sh
ADDRESS_HEADER=True-Client-IP node build
```

> [!NOTE] 헤더는 쉽게 위조될 수 있습니다. `PROTOCOL_HEADER`, `HOST_HEADER`와 마찬가지로 이 값을 설정하기 전에 [무엇을 하는지 제대로 알고 있어야](https://adam-p.ca/blog/2022/03/x-forwarded-for/) 합니다.

`ADDRESS_HEADER`가 `X-Forwarded-For`라면 헤더 값에는 쉼표로 구분된 IP 주소 목록이 들어 있습니다. `XFF_DEPTH` 환경 변수에는 서버 앞에 신뢰할 수 있는 프록시가 몇 개 있는지 지정해야 합니다. 예를 들어 신뢰할 수 있는 프록시가 세 개라면, 프록시 3은 원래 연결의 주소와 처음 두 프록시의 주소를 전달합니다:

```
<client address>, <proxy 1 address>, <proxy 2 address>
```

가장 왼쪽 주소를 읽으라고 안내하는 가이드도 있지만, 그렇게 하면 [위조에 취약해집니다](https://adam-p.ca/blog/2022/03/x-forwarded-for/):

```
<spoofed address>, <client address>, <proxy 1 address>, <proxy 2 address>
```

SvelteKit은 그 대신 신뢰할 수 있는 프록시의 수를 고려해 *오른쪽*부터 읽습니다. 이 경우에는 `XFF_DEPTH=3`을 사용합니다.

> [!NOTE] 그래도 가장 왼쪽 주소를 읽어야 한다면(그리고 위조는 신경 쓰지 않는다면), 예를 들어 IP 주소가 *신뢰할 수 있는* 것보다 *실제* 주소인 것이 더 중요한 위치 정보 서비스를 제공하려는 경우라면, 앱 안에서 `x-forwarded-for` 헤더를 직접 확인하면 됩니다.

### `BODY_SIZE_LIMIT`

스트리밍 중을 포함해, 받아들일 요청 본문의 최대 크기(바이트)입니다. 본문 크기는 킬로바이트(`K`), 메가바이트(`M`), 기가바이트(`G`) 단위 접미사를 붙여 지정할 수도 있습니다. 예: `512K`, `1M`. 기본값은 512kb입니다. 이 옵션은 `Infinity`(이전 버전의 어댑터에서는 0) 값으로 끌 수 있으며, 더 정교한 처리가 필요하다면 [`handle`](hooks#handle)에서 직접 검사를 구현하면 됩니다.

### `SHUTDOWN_TIMEOUT`

`SIGTERM`이나 `SIGINT` 신호를 받은 뒤 남아 있는 연결을 강제로 닫기 전까지 기다리는 시간(초)입니다. 기본값은 `30`입니다. 내부적으로 어댑터는 [`closeAllConnections`](https://nodejs.org/api/http.html#servercloseallconnections)를 호출합니다. 자세한 내용은 [정상 종료](#Graceful-shutdown)를 참고하세요.

### `IDLE_TIMEOUT`

systemd 소켓 활성화를 사용할 때 `IDLE_TIMEOUT`은 요청이 들어오지 않으면 앱을 자동으로 잠재울 때까지의 시간(초)을 지정합니다. 설정하지 않으면 앱은 계속 실행됩니다. 자세한 내용은 [소켓 활성화](#Socket-activation)를 참고하세요.

### `KEEP_ALIVE_TIMEOUT`, `HEADERS_TIMEOUT` <!-- `KEEP_ALIVE_TIMEOUT` and `HEADERS_TIMEOUT` -->

[`keepAliveTimeout`](https://nodejs.org/api/http.html#serverkeepalivetimeout)과 [`headersTimeout`](https://nodejs.org/api/http.html#serverheaderstimeout)에 쓰일 시간(초)입니다.

## 옵션 <!-- Options -->

어댑터는 여러 옵션으로 설정할 수 있습니다:

```js
// @errors: 2307 2554
/// file: vite.config.js
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				// default options are shown
				out: 'build',
				precompress: true,
				envPrefix: ''
			})
		})
	]
});
```

### out

서버를 빌드할 디렉터리입니다. 기본값은 `build`입니다. 즉, 서버가 만들어진 뒤 `node build`를 실행하면 로컬에서 서버가 시작됩니다.

### precompress

빌드 중에 클라이언트 에셋과 프리렌더링된 에셋의 `.br`, `.gz` 버전을 생성합니다. 서버는 요청마다 `Accept-Encoding`을 협상해 gzip보다 brotli를 우선하며, 각 버전은 자체 ETag를 가집니다. 기본값은 `true`입니다.

### envPrefix

배포 설정에 쓰이는 환경 변수의 이름을 바꿔야 한다면(예를 들어 직접 제어할 수 없는 환경 변수와 충돌하지 않도록) 접두사를 지정할 수 있습니다:

```js
envPrefix: 'MY_CUSTOM_';
```

```sh
MY_CUSTOM_HOST=127.0.0.1 \
MY_CUSTOM_PORT=4000 \
node build
```

## 정상 종료 <!-- Graceful shutdown -->

기본적으로 `adapter-node`는 `SIGTERM`이나 `SIGINT` 신호를 받으면 HTTP 서버를 정상적으로 종료합니다. 이때 다음과 같이 동작합니다:

1. 새 요청을 거부합니다([`server.close`](https://nodejs.org/api/http.html#serverclosecallback))
2. 이미 들어왔지만 아직 응답을 받지 못한 요청이 끝나기를 기다리고, 연결이 유휴 상태가 되면 닫습니다([`server.closeIdleConnections`](https://nodejs.org/api/http.html#servercloseidleconnections))
3. 마지막으로 [`SHUTDOWN_TIMEOUT`](#Environment-variables-SHUTDOWN_TIMEOUT)초가 지난 뒤에도 여전히 활성 상태인 연결을 모두 닫습니다. ([`server.closeAllConnections`](https://nodejs.org/api/http.html#servercloseallconnections))

> [!NOTE] 이 동작을 바꾸고 싶다면 [커스텀 서버](#Custom-server)를 사용하면 됩니다.

HTTP 서버가 모든 연결을 닫은 뒤 발생하는 `sveltekit:shutdown` 이벤트를 수신할 수 있습니다. Node의 `exit` 이벤트와 달리 `sveltekit:shutdown` 이벤트는 비동기 작업을 지원하며, 열려 있는 데이터베이스 연결처럼 서버에 처리되지 않은 작업이 남아 있더라도 모든 연결이 닫히면 항상 발생합니다.

```js
// @errors: 2304
process.on('sveltekit:shutdown', async (reason) => {
	await jobs.stop();
	await db.close();
});
```

`reason` 매개변수는 다음 값 중 하나입니다:

- `SIGINT` - `SIGINT` 신호로 종료가 시작됨
- `SIGTERM` - `SIGTERM` 신호로 종료가 시작됨
- `IDLE` - [`IDLE_TIMEOUT`](#Environment-variables-IDLE_TIMEOUT)으로 종료가 시작됨

## 소켓 활성화 <!-- Socket activation -->

오늘날 대부분의 Linux 운영체제는 systemd라는 최신 프로세스 관리자를 사용해 서버를 시작하고 서비스를 실행·관리합니다. 서버가 소켓을 할당하고 필요할 때 앱을 시작하고 확장하도록 설정할 수 있습니다. 이를 [소켓 활성화(socket activation)](https://0pointer.de/blog/projects/socket-activated-containers.html)라고 합니다. 이 경우 OS는 앱에 `LISTEN_PID`와 `LISTEN_FDS`라는 두 환경 변수를 전달합니다. 그러면 어댑터는 파일 디스크립터 3에서 연결을 기다리는데, 이는 여러분이 직접 만들어야 하는 systemd 소켓 유닛을 가리킵니다.

> [!NOTE] systemd 소켓 활성화를 사용할 때도 [`envPrefix`](#Options-envPrefix)를 쓸 수 있습니다. `LISTEN_PID`와 `LISTEN_FDS`는 항상 접두사 없이 읽습니다.

소켓 활성화를 활용하려면 다음 단계를 따르세요.

1. 앱을 [systemd 서비스](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)로 실행합니다. 호스트 시스템에서 직접 실행해도 되고, 컨테이너 안에서(예를 들어 Docker나 systemd 포터블 서비스를 사용해) 실행해도 됩니다. 앱에 [`IDLE_TIMEOUT`](#Environment-variables-IDLE_TIMEOUT) 환경 변수도 함께 전달하면, `IDLE_TIMEOUT`초 동안 요청이 없을 때 앱이 정상 종료됩니다. 새 요청이 들어오면 systemd가 앱을 자동으로 다시 시작합니다.

```ini
/// file: /etc/systemd/system/myapp.service
[Service]
Environment=NODE_ENV=production IDLE_TIMEOUT=60
ExecStart=/usr/bin/node /usr/bin/myapp/build
```

2. 함께 쓸 [소켓 유닛](https://www.freedesktop.org/software/systemd/man/latest/systemd.socket.html)을 만듭니다. 어댑터는 소켓 하나만 받습니다.

```ini
/// file: /etc/systemd/system/myapp.socket
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

3. `sudo systemctl daemon-reload`를 실행해 systemd가 두 유닛을 모두 인식하게 합니다. 그런 다음 `sudo systemctl enable --now myapp.socket`으로 부팅 시 소켓이 활성화되도록 하고 바로 시작합니다. 그러면 `localhost:3000`으로 첫 요청이 들어올 때 앱이 자동으로 시작됩니다.

## 커스텀 서버 <!-- Custom server -->

빌드 디렉터리에는 `index.js`와 `handler.js`라는 두 진입점이 있습니다. `index.js`를 실행하면(기본 빌드 디렉터리를 쓴다면 `node build`) 설정한 포트에서 서버가 시작됩니다.

또는 [Express](https://github.com/expressjs/express), [Connect](https://github.com/senchalabs/connect), [Polka](https://github.com/lukeed/polka)(또는 내장된 [`http.createServer`](https://nodejs.org/dist/latest/docs/api/http.html#httpcreateserveroptions-requestlistener))와 함께 쓸 수 있는 핸들러를 내보내는 `handler.js` 파일을 import해 직접 서버를 구성할 수도 있습니다:

```js
// @errors: 2307 7006
/// file: my-server.js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
```

> [!NOTE] 커스텀 서버에서 `handler.js`를 사용하면 핸들러 자체가 읽는 환경 변수만 적용됩니다: `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT`.
>
> 서버 생명주기 변수(`PORT`, `HOST`, `SOCKET_PATH`, `SHUTDOWN_TIMEOUT`, `IDLE_TIMEOUT`, `KEEP_ALIVE_TIMEOUT`, `HEADERS_TIMEOUT`, `LISTEN_PID`, `LISTEN_FDS`)는 기본 `node build` 서버에서만 적용됩니다. 같은 동작이 필요하다면 커스텀 서버에서 직접 구현하세요. 예를 들어 위 코드는 `PORT`와 관계없이 하드코딩된 `3000`에서 연결을 기다립니다.
