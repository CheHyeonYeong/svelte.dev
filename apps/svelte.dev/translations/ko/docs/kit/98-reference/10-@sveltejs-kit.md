---
title: @sveltejs/kit
---



```js
// @noErrors
import {
	VERSION,
	error,
	fail,
	invalid,
	isActionFailure,
	isHttpError,
	isRedirect,
	isValidationError,
	json,
	normalizeUrl,
	redirect,
	text
} from '@sveltejs/kit';
```

## VERSION

<div class="ts-block">

```dts
const VERSION: string;
```

</div>



## error

HTTP 상태 코드와 선택적인 메시지를 담은 에러를 던집니다.
요청을 처리하는 중에 호출하면 SvelteKit이
에러 응답을 반환하며, 이 에러는 _예상된_ 에러로 `handleError`에 전달됩니다.
던져진 에러를 직접 잡지(catch) 않도록 주의하세요. 잡으면 SvelteKit이 에러를 처리할 수 없습니다.

<div class="ts-block">

```dts
function error(
	status: {
		status: number;
		message: string;
	} extends App.Error
		? number
		: never,
	message?: string | undefined
): never;
```

</div>

<div class="ts-block">

```dts
function error(
	status: number,
	message: string,
	properties: keyof Omit<
		App.Error,
		'status' | 'message'
	> extends never
		? never
		: Omit<App.Error, 'status' | 'message'>
): never;
```

</div>

<div class="ts-block">

```dts
function error(
	status: number,
	properties: Omit<App.Error, 'status'> & {
		status?: App.Error['status'];
	}
): never;
```

</div>



## fail

`ActionFailure` 객체를 만듭니다. 폼 제출이 실패했을 때 호출하세요.

<div class="ts-block">

```dts
function fail(status: number): ActionFailure<undefined>;
```

</div>

<div class="ts-block">

```dts
function fail<T = undefined>(
	status: number,
	data: T
): ActionFailure<T>;
```

</div>



## invalid

<blockquote class="since note">

2.47.3부터 사용 가능

</blockquote>

검증 에러를 던져 폼 검증을 명령형으로 실패시킬 때 사용합니다.
폼 액션에 전달되는 `issue`와 함께 사용하면 필드별 이슈를 만들 수 있습니다.

```ts
import { invalid } from '@sveltejs/kit';
import { form } from '$app/server';
import { tryLogin } from '#lib/server/auth';
import * as v from 'valibot';

export const login = form(
	v.object({ name: v.string(), _password: v.string() }),
	async ({ name, _password }) => {
		const success = tryLogin(name, _password);
		if (!success) {
			invalid('Incorrect username or password');
		}

		// ...
	}
);
```

<div class="ts-block">

```dts
function invalid(
	...issues: (StandardSchemaV1.Issue | string)[]
): never;
```

</div>



## isActionFailure

`fail`이 던진 액션 실패인지 확인합니다.

<div class="ts-block">

```dts
function isActionFailure(
	e: unknown
): e is ActionFailure<undefined>;
```

</div>



## isHttpError

`error`가 던진 에러인지 확인합니다.

<div class="ts-block">

```dts
function isHttpError<T extends number>(
	e: unknown,
	status?: T
): e is HttpError & {
	status: T extends undefined ? never : T;
};
```

</div>



## isRedirect

`redirect`가 던진 리디렉션인지 확인합니다.

<div class="ts-block">

```dts
function isRedirect(e: unknown): e is Redirect;
```

</div>



## isValidationError

<blockquote class="since note">

2.47.3부터 사용 가능

</blockquote>

`invalid`가 던진 검증 에러인지 확인합니다.

<div class="ts-block">

```dts
function isValidationError(
	e: unknown
): e is ValidationError;
```

</div>



## json

<blockquote class="tag deprecated note">

`Response.json`을 사용하세요

</blockquote>

주어진 데이터로 JSON `Response` 객체를 만듭니다.

<div class="ts-block">

```dts
function json(data: any, init?: ResponseInit): Response;
```

</div>



## normalizeUrl

<blockquote class="since note">

2.18.0부터 사용 가능

</blockquote>

URL 경로명(pathname)에서 SvelteKit 내부용 접미사와 후행 슬래시를 제거합니다.
정규화된 URL과 함께, 새 경로명(검색 문자열을 포함할 수 있음)이나 URL을 바탕으로
제거했던 접미사를 다시 붙이는 메서드를 반환합니다.
```js
// @errors: 7031
import { normalizeUrl } from '@sveltejs/kit';

const { url, denormalize } = normalizeUrl('/blog/post/__data.json');
console.log(url.pathname); // /blog/post
console.log(denormalize('/blog/post/a')); // /blog/post/a/__data.json
```

<div class="ts-block">

```dts
function normalizeUrl(url: URL | string): {
	url: URL;
	wasNormalized: boolean;
	denormalize: (url?: string | URL) => URL;
};
```

</div>



## redirect

요청을 리디렉션합니다. 요청을 처리하는 중에 호출하면 SvelteKit이 리디렉션 응답을 반환합니다.
던져진 리디렉션을 직접 잡지(catch) 않도록 주의하세요. 잡으면 SvelteKit이 리디렉션을 처리할 수 없습니다.

가장 많이 쓰는 상태 코드:
 * `303 See Other`: GET 요청으로 리디렉션합니다(폼 POST 요청 뒤에 자주 쓰입니다)
 * `307 Temporary Redirect`: 리디렉션할 때 요청 메서드를 유지합니다
 * `308 Permanent Redirect`: 리디렉션할 때 요청 메서드를 유지하며, SEO가 새 페이지로 이전됩니다

[모든 리디렉션 상태 코드 보기](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages)

<div class="ts-block">

```dts
function redirect(
	status:
		| 300
		| 301
		| 302
		| 303
		| 304
		| 305
		| 306
		| 307
		| 308
		| ({} & number),
	location: string | URL,
	options?: {
		external?: boolean | string[];
	}
): never;
```

</div>



## text

<blockquote class="tag deprecated note">

`new Response`를 사용하세요

</blockquote>

주어진 본문으로 `Response` 객체를 만듭니다.

<div class="ts-block">

```dts
function text(body: string, init?: ResponseInit): Response;
```

</div>



## Action

`+page.server.js`의 `export const actions = {...}`에 들어가는 폼 액션 메서드의 형태입니다.
자세한 내용은 [폼 액션](/docs/kit/form-actions)을 참고하세요.

<div class="ts-block">

```dts
type Action<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	OutputData extends Record<string, any> | void = Record<
		string,
		any
	> | void,
	RouteId extends AppRouteId | null = AppRouteId | null
> = (
	event: RequestEvent<Params, RouteId>
) => MaybePromise<OutputData>;
```

</div>

## ActionFailure

<div class="ts-block">

```dts
interface ActionFailure<T = undefined> {/*…*/}
```

<div class="ts-block-property">

```dts
status: number;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
data: T;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
[uniqueSymbol]: true;
```

<div class="ts-block-property-details"></div>
</div></div>

## Actions

`+page.server.js`의 `export const actions = {...}` 객체의 형태입니다.
자세한 내용은 [폼 액션](/docs/kit/form-actions)을 참고하세요.

<div class="ts-block">

```dts
type Actions<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	OutputData extends Record<string, any> | void = Record<
		string,
		any
	> | void,
	RouteId extends AppRouteId | null = AppRouteId | null
> = Record<string, Action<Params, OutputData, RouteId>>;
```

</div>

## Adapter

[어댑터](/docs/kit/adapters)는 프로덕션 빌드를 받아, 원하는 플랫폼에 배포할 수 있는 형태로 바꾸는 역할을 합니다.

<div class="ts-block">

```dts
interface Adapter {/*…*/}
```

<div class="ts-block-property">

```dts
name: string;
```

<div class="ts-block-property-details">

로그에 쓰이는 어댑터 이름입니다. 보통 패키지 이름과 같습니다.

</div>
</div>

<div class="ts-block-property">

```dts
adapt: (builder: Builder) => MaybePromise<void>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `builder` 앱을 변환(adapt)하는 메서드를 담은, SvelteKit이 제공하는 객체

</div>

이 함수는 SvelteKit이 앱을 빌드한 뒤에 호출됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
supports?: {/*…*/};
```

<div class="ts-block-property-details">

개발 및 빌드 중에 호출되어, 특정 기능이 이 어댑터로 배포한 프로덕션 환경에서 동작할지 판단하는 검사입니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
read?: (details: { config: Record<string, any>; route: { id: string } }) => boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `details.config` 라우트에서 `export const config`로 내보낸, 병합된 어댑터 전용 라우트 설정

</div>

`$app/server`의 `read`를 지원하는지 검사합니다.

</div>
</div>
<div class="ts-block-property">

```dts
instrumentation?: () => boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v2.31.0

</div>

`instrumentation.server.js`를 지원하는지 검사합니다. 통과하려면 어댑터가 애플리케이션 코드보다 먼저 `instrumentation.server.js`를 실행할 수 있어야 합니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
emulate?: () => MaybePromise<Emulator>;
```

<div class="ts-block-property-details">

`Emulator`를 만듭니다. 이를 통해 어댑터는 개발, 빌드, 프리렌더링 중의
환경에 영향을 줄 수 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
vite?: AdapterViteConfig | ((ctx: { config: ValidatedConfig }) => AdapterViteConfig);
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

Vite를 설정하고 Vite와 상호작용하기 위한 옵션

</div>
</div></div>

## AdapterViteConfig

<div class="ts-block">

```dts
interface AdapterViteConfig {/*…*/}
```

<div class="ts-block-property">

```dts
getRequest?: typeof getRequest;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

이 함수는 Vite의 개발 및 미리보기(preview) 모드에서
`http.IncomingMessage`를 `Request` 객체로 변환하는 기본 동작을 덮어씁니다.
원래의 `setRequest` 함수를 호출하려면 `@sveltejs/kit/node`에서 가져오세요.

</div>
</div>

<div class="ts-block-property">

```dts
setResponse?: typeof setResponse;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

이 함수는 Vite의 개발 및 미리보기(preview) 모드에서
`Response` 객체를 `http.ServerResponse`에 쓰는 기본 동작을 덮어씁니다.
원래의 `setResponse` 함수를 호출하려면 `@sveltejs/kit/node`에서 가져오세요.

</div>
</div>

<div class="ts-block-property">

```dts
plugins?:
	| Plugin[]
	| {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

어댑터가 주입하는 Vite 플러그인입니다. 기본적으로
SvelteKit의 플러그인보다 앞에 배치됩니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
pre?: Plugin[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

SvelteKit 자체 플러그인보다 앞에 배치되는 Vite 플러그인입니다.

</div>
</div>
<div class="ts-block-property">

```dts
post?: Plugin[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

SvelteKit 자체 플러그인보다 뒤에 배치되는 Vite 플러그인입니다.

</div>
</div></div>

</div>
</div></div>

## AwaitedActions

<div class="ts-block">

```dts
type AwaitedActions<
	T extends Record<string, (...args: any) => any>
> = OptionalUnion<
	{
		[Key in keyof T]: UnpackValidationError<
			Awaited<ReturnType<T[Key]>>
		>;
	}[keyof T]
>;
```

</div>

## Builder

이 객체는 어댑터의 `adapt` 함수에 전달됩니다.
앱을 변환하는 데 유용한 여러 메서드와 속성을 담고 있습니다.

<div class="ts-block">

```dts
interface Builder {/*…*/}
```

<div class="ts-block-property">

```dts
log: Logger;
```

<div class="ts-block-property-details">

콘솔에 메시지를 출력합니다. `log.info`와 `log.minor`는 Vite의 `logLevel`이 `info`일 때만 출력됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
rimraf: (dir: string) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 대신 `fs.rmSync(dir, { force: true, recursive: true })`를 사용하세요

</div>

`dir`과 그 안의 모든 내용을 삭제합니다.

</div>
</div>

<div class="ts-block-property">

```dts
mkdirp: (dir: string) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 대신 `fs.mkdirSync(dir, { recursive: true })`를 사용하세요

</div>

`dir`과 필요한 상위 디렉터리를 모두 만듭니다.

</div>
</div>

<div class="ts-block-property">

```dts
config: ValidatedConfig;
```

<div class="ts-block-property-details">

완전히 해석된(resolved) SvelteKit 설정입니다.

</div>
</div>

<div class="ts-block-property">

```dts
prerendered: Prerendered;
```

<div class="ts-block-property-details">

프리렌더링된 페이지와 에셋에 대한 정보입니다(있는 경우).

</div>
</div>

<div class="ts-block-property">

```dts
routes: RouteDefinition[];
```

<div class="ts-block-property-details">

모든 라우트의 배열(프리렌더링된 라우트 포함)

</div>
</div>

<div class="ts-block-property">

```dts
manifest: typeof import('$app/manifest');
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

`$app/manifest` 모듈의 값입니다.
유일한 차이는 서비스 워커가 있으면 `manifest.assets`에 서비스 워커도 포함된다는 점입니다.

</div>
</div>

<div class="ts-block-property">

```dts
mimeTypes: Record<string, string>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v3.0.0

</div>

파일 확장자를 MIME 타입에 대응시킨 레코드

</div>
</div>

<div class="ts-block-property">

```dts
createEntries?: (fn: (route: RouteDefinition) => AdapterEntry) => Promise<void>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `fn` 여러 라우트를 하나의 진입점으로 묶는 함수
- <span class="tag deprecated">deprecated</span> 3.0에서 제거되었습니다. 대신 `builder.routes`를 사용하세요

</div>

앱의 라우트 하나 이상에 대응하는 별도의 함수를 만듭니다.

</div>
</div>

<div class="ts-block-property">

```dts
findServerAssets: (routes: RouteDefinition[]) => string[];
```

<div class="ts-block-property-details">

`routes`에 속한 서버 파일이 가져오는 모든 에셋을 찾습니다

</div>
</div>

<div class="ts-block-property">

```dts
generateFallback: (dest: string) => Promise<void>;
```

<div class="ts-block-property-details">

일치하는 라우트가 없을 때 정적 웹 서버가 사용할 폴백 페이지를 생성합니다. 싱글 페이지 앱에 유용합니다.

</div>
</div>

<div class="ts-block-property">

```dts
generateEnvModule: () => void;
```

<div class="ts-block-property-details">

앱이 `$app/env/public`을 사용하는 경우, 공개 환경 변수를 `$app/env/public`으로 노출하는 모듈을 생성합니다.

</div>
</div>

<div class="ts-block-property">

```dts
generateManifest?: (opts: { relativePath: string; routes?: RouteDefinition[] }) => string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `opts.relativePath` 서버 빌드 결과물의 기준 디렉터리에 대한 상대 경로
- <span class="tag deprecated">deprecated</span> 3.0에서 제거되었습니다. 대신 `builder.generateServerInstance`나 `builder.manifest`를 사용하세요

</div>

SvelteKit [서버](/docs/kit/@sveltejs-kit#Server)를 초기화하는 데 쓸 서버 사이드 매니페스트를 생성합니다.

</div>
</div>

<div class="ts-block-property">

```dts
getBuildDirectory: (name: string) => string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 빌드 디렉터리를 기준으로 한 파일 경로

</div>

`outDir` 안의 `name` 디렉터리로 가는 경로를 해석합니다. 예: `/path/to/.svelte-kit/my-adapter`.

</div>
</div>

<div class="ts-block-property">

```dts
getClientDirectory: () => string;
```

<div class="ts-block-property-details">

`static` 디렉터리의 내용을 포함해, 클라이언트 사이드 에셋이 담긴 디렉터리의 완전히 해석된 경로를 가져옵니다.

</div>
</div>

<div class="ts-block-property">

```dts
getServerDirectory: () => string;
```

<div class="ts-block-property-details">

서버 사이드 코드가 담긴 디렉터리의 완전히 해석된 경로를 가져옵니다.

</div>
</div>

<div class="ts-block-property">

```dts
getAppPath: () => string;
```

<div class="ts-block-property-details">

설정된 `base` 경로를 포함한 애플리케이션 경로를 가져옵니다. 예: `my-base-path/_app`.

</div>
</div>

<div class="ts-block-property">

```dts
generateServerInstance: (
	dest: string,
	opts?: {
		routes?: RouteDefinition[];
		serverDirectory?: string;
	}
) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `opts.routes` 서버 매니페스트에 포함할 라우트의 부분 집합
- `opts.serverDirectory` 서버 코드가 담긴 디렉터리. 기본값은 `getServerDirectory()`입니다.
- <span class="tag since">available since</span> v3.0.0

</div>

SvelteKit [Server](/docs/kit/@sveltejs-kit#Server) 인스턴스를 노출하는 모듈을 생성합니다.

</div>
</div>

<div class="ts-block-property">

```dts
writeClient: (dest: string) => string[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `dest` 대상 폴더
- <span class="tag">returns</span> `dest`에 쓴 파일의 배열

</div>

클라이언트 에셋을 `dest`에 씁니다.

</div>
</div>

<div class="ts-block-property">

```dts
writePrerendered: (dest: string) => string[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `dest` 대상 폴더
- <span class="tag">returns</span> `dest`에 쓴 파일의 배열

</div>

프리렌더링된 파일을 `dest`에 씁니다.

</div>
</div>

<div class="ts-block-property">

```dts
writeServer: (dest: string) => string[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `dest` 대상 폴더
- <span class="tag">returns</span> `dest`에 쓴 파일의 배열

</div>

서버 사이드 코드를 `dest`에 씁니다.

</div>
</div>

<div class="ts-block-property">

```dts
createInstrumentationInitializer: (options: {
	outputDirectory: string;
	environment?: string;
	serverDirectory?: string;
}) => string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `options` 다음 속성을 담은 객체:
- `options.outputDirectory` 초기화 모듈(initializer)을 만들 디렉터리.
- `options.environment` 플랫폼의 환경 변수를 기본 내보내기(default export)로 내보내는 모듈의 내용. 생략하면 `process.env`를 사용합니다.
- `options.serverDirectory` 서버 빌드 결과물이 담긴 디렉터리. 기본값은 `getServerDirectory()`입니다.
- <span class="tag">returns</span> 생성된 초기화 모듈의 파일 시스템 경로.
- <span class="tag since">available since</span> v3.0.0

</div>

서버 계측 코드가 실행되기 전에 `$env/dynamic/private`를 채우는 초기화 모듈을 생성합니다.
반환된 모듈은 이후의 모든 번들링 또는 트레이싱 단계에 포함하세요.

</div>
</div>

<div class="ts-block-property">

```dts
copy: (
	from: string,
	to: string,
	opts?: {
		filter?(basename: string): boolean;
		replace?: Record<string, string>;
	}
) => string[];
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `from` 원본 파일 또는 디렉터리
- `to` 대상 파일 또는 디렉터리
- `opts.filter` 파일이나 디렉터리를 복사할지 결정하는 함수
- `opts.replace` 치환할 문자열의 맵
- <span class="tag">returns</span> 복사된 파일의 배열

</div>

파일이나 디렉터리를 복사합니다.

</div>
</div>

<div class="ts-block-property">

```dts
hasServerInstrumentationFile: () => boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">returns</span> 서버 계측 파일이 있으면 true, 없으면 false
- <span class="tag since">available since</span> v2.31.0

</div>

서버 계측 파일이 있는지 확인합니다.

</div>
</div>

<div class="ts-block-property">

```dts
instrument: (args: {
	entrypoint: string;
	instrumentation: string;
	start?: string;
	initializer: string;
	module?:
		| {
				exports: string[];
		  }
		| {
				generateText: (args: {
					instrumentation: string;
					start: string;
					initializer: string;
				}) => string;
		  };
}) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `options` 다음 속성을 담은 객체:
- `options.entrypoint` 추적할 진입점의 경로.
- `options.instrumentation` 계측 파일의 경로.
- `options.start` 시작 파일의 이름. `entrypoint`의 이름이 이것으로 바뀝니다.
- `options.initializer` 번들링되었거나 복사된 계측 초기화 모듈의 파일 시스템 경로.
- `options.module` 결과로 만들어지는 진입점 모듈에 대한 설정.
- `options.module.generateText` 초기화 모듈, 계측 파일, 시작 파일의 상대 경로를 받아 추적할 모듈의 텍스트를 생성하는 함수. `instrumentation`보다 먼저 `initializer`를 가져와야 하고, 계측 코드가 실행된 뒤에 `start`를 동적으로 가져와야 합니다. 지정하지 않으면 최상위 await를 사용하는 기본 구현이 쓰입니다.
- <span class="tag since">available since</span> v3.0.0

</div>

`entrypoint`를 `instrumentation`으로 계측합니다.

`entrypoint`의 이름을 `start`로 바꾸고, `entrypoint` 위치에
`instrumentation`을 가져온 다음 `start`를 동적으로 가져오는 새 모듈을 만듭니다. 이렇게 하면
계측 라이브러리에 필요한 모듈 훅이 애플리케이션 코드보다 먼저 로드됩니다.

`initializer`는 `createInstrumentationInitializer`가 생성한 모듈입니다. 이 메서드를 호출하기 전에
모든 번들링 또는 트레이싱 단계에 포함되어 있어야 합니다.

주의 사항:
- "라이브 내보내기(live exports)"는 동작하지 않습니다. 어댑터가 라이브 내보내기를 사용한다면, 사용자가 시작할 때 서버 계측 코드를 직접 가져와야 합니다.
- `tla`가 `false`이면 OTEL 자동 계측이 제대로 동작하지 않을 수 있습니다. 환경이 지원한다면 사용하세요.
- `hasServerInstrumentationFile`로 사용자에게 서버 계측 파일이 있는지 확인하세요. 없다면 이 작업을 하지 않아야 합니다.

</div>
</div>

<div class="ts-block-property">

```dts
compress: (directory: string) => Promise<string[]>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `directory` 압축할 파일이 담긴 디렉터리
- <span class="tag">returns</span> `directory`에서 압축된 파일의 배열

</div>

필요한 경우 `directory`의 파일을 gzip과 brotli로 압축합니다. 원본 옆에 `.gz`와 `.br` 파일을 생성합니다.

</div>
</div></div>

## Cookies

<div class="ts-block">

```dts
interface Cookies {/*…*/}
```

<div class="ts-block-property">

```dts
get: (name: string, opts?: import('cookie').ParseOptions) => string | undefined;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 쿠키 이름
- `opts` `cookie.parseCookie`에 그대로 전달되는 옵션. 문서는 [여기](https://github.com/jshttp/cookie?tab=readme-ov-file#cookieparsecookiestr-options)에서 확인하세요

</div>

앞서 `cookies.set`으로 설정했거나 요청 헤더에 담긴 쿠키를 가져옵니다.

</div>
</div>

<div class="ts-block-property">

```dts
getAll: (opts?: import('cookie').ParseOptions) => Array<{ name: string; value: string }>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `opts` `cookie.parseCookie`에 그대로 전달되는 옵션. 문서는 [여기](https://github.com/jshttp/cookie?tab=readme-ov-file#cookieparsecookiestr-options)에서 확인하세요

</div>

앞서 `cookies.set`으로 설정했거나 요청 헤더에 담긴 쿠키를 모두 가져옵니다.

</div>
</div>

<div class="ts-block-property">

```dts
set: (name: string, value: string, opts?: import('cookie').SerializeOptions) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 쿠키 이름
- `value` 쿠키 값
- `opts` 위에서 설명한 SvelteKit 기본값과 함께 `cookie.stringifySetCookie`에 전달되는 옵션. 문서는 [여기](https://github.com/jshttp/cookie?tab=readme-ov-file#cookiestringifysetcookiesetcookieobj-options)에서 확인하세요

</div>

쿠키를 설정합니다. 응답에 `set-cookie` 헤더를 추가할 뿐 아니라, 현재 요청이 처리되는 동안 `cookies.get`이나 `cookies.getAll`로 그 쿠키를 읽을 수 있게 합니다.

`httpOnly`의 기본값은 `true`이며, `secure`도 기본값이 `true`입니다(단, 개발 중에는 `false`). 클라이언트 사이드 JavaScript에서 쿠키를 읽거나 HTTP로 쿠키를 전송하려면 이 옵션들을 명시적으로 꺼야 합니다.

`path` 옵션의 기본값은 `'/'`입니다. 상대 경로를 쓸 수도 있고, `path: ''`로 설정해 현재 경로와 그 하위 경로에서만 쿠키를 쓸 수 있게 할 수도 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
delete: (name: string, opts?: import('cookie').SerializeOptions) => void;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 쿠키 이름
- `opts` 위에서 설명한 SvelteKit 기본값과 함께 `cookie.stringifySetCookie`에 전달되는 옵션. 문서는 [여기](https://github.com/jshttp/cookie?tab=readme-ov-file#cookiestringifysetcookiesetcookieobj-options)에서 확인하세요

</div>

쿠키 값을 빈 문자열로, 만료일을 과거로 설정해 쿠키를 삭제합니다.

`httpOnly`의 기본값은 `true`이며, `secure`도 기본값이 `true`입니다(단, 개발 중에는 `false`). 클라이언트 사이드 JavaScript에서 쿠키를 읽거나 HTTP로 쿠키를 전송하려면 이 옵션들을 명시적으로 꺼야 합니다.

`path` 옵션의 기본값은 `'/'`입니다. 상대 경로를 쓸 수도 있고, `path: ''`로 설정해 현재 경로와 그 하위 경로에서만 쿠키를 쓸 수 있게 할 수도 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
parse: typeof import('cookie').parseSetCookie;
```

<div class="ts-block-property-details">

`Set-Cookie` 헤더 하나를 파싱합니다. 이를 이용해 외부에서 받은 쿠키를 적용할 수 있습니다:

```js
// @errors: 7031
import { getRequestEvent } from '$app/server';

export async function GET() {
	const { cookies } = getRequestEvent();

	const response = await fetch('...');

	for (const str of response.headers.getSetCookie()) {
		const { name, value, ...options } = cookies.parse(str);
		cookies.set(name, value, options);
	}

	// ...
}
```

쉼표로 구분된 하나의 문자열을 반환하는 `headers.get('set-cookie')`가 _아니라_, 쿠키 헤더 배열을 반환하는 `headers.getSetCookie()`를 쓴다는 점에 주의하세요.

</div>
</div>

<div class="ts-block-property">

```dts
serialize: (name: string, value: string, opts?: import('cookie').SerializeOptions) => string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- `name` 쿠키 이름
- `value` 쿠키 값
- `opts` 위에서 설명한 SvelteKit 기본값과 함께 `cookie.stringifySetCookie`에 전달되는 옵션. 문서는 [여기](https://github.com/jshttp/cookie?tab=readme-ov-file#cookiestringifysetcookiesetcookieobj-options)에서 확인하세요

</div>

쿠키 이름-값 쌍을 `Set-Cookie` 헤더 문자열로 직렬화하되, 응답에 적용하지는 않습니다.

`httpOnly`의 기본값은 `true`이며, `secure`도 기본값이 `true`입니다(단, 개발 중에는 `false`). 클라이언트 사이드 JavaScript에서 쿠키를 읽거나 HTTP로 쿠키를 전송하려면 이 옵션들을 명시적으로 꺼야 합니다.

`path` 옵션의 기본값은 `'/'`입니다. 상대 경로를 쓸 수도 있고, `path: ''`로 설정해 현재 경로와 그 하위 경로에서만 쿠키를 쓸 수 있게 할 수도 있습니다.

</div>
</div></div>

## Emulator

개발, 빌드, 프리렌더링 중의 환경에 영향을 주는 함수 모음

<div class="ts-block">

```dts
interface Emulator {/*…*/}
```

<div class="ts-block-property">

```dts
platform?(details: { config: any; prerender: PrerenderOption }): MaybePromise<App.Platform>;
```

<div class="ts-block-property-details">

현재 라우트의 `config`와 `prerender` 옵션을 인자로 호출되어
`App.Platform` 객체를 반환하는 함수

</div>
</div></div>

## HttpError

[`error`](/docs/kit/@sveltejs-kit#error) 함수가 반환하는 객체입니다.

<div class="ts-block">

```dts
interface HttpError {/*…*/}
```

<div class="ts-block-property">

```dts
status: number;
```

<div class="ts-block-property-details">

400-599 범위의 [HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses)입니다.

</div>
</div>

<div class="ts-block-property">

```dts
body: App.Error;
```

<div class="ts-block-property-details">

에러의 내용입니다.

</div>
</div></div>

## Load

`PageLoad`와 `LayoutLoad`의 제네릭 형태입니다. 이들은 `./$types`에서 가져와 쓰고([생성된 타입](/docs/kit/types#Generated-types) 참고),
`Load`를 직접 쓰지 않는 것이 좋습니다.

<div class="ts-block">

```dts
type Load<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	InputData extends Record<string, unknown> | null = Record<
		string,
		any
	> | null,
	ParentData extends Record<string, unknown> = Record<
		string,
		any
	>,
	OutputData extends Record<string, unknown> | void =
		Record<string, any> | void,
	RouteId extends AppRouteId | null = AppRouteId | null
> = (
	event: LoadEvent<Params, InputData, ParentData, RouteId>
) => MaybePromise<OutputData>;
```

</div>

## LoadEvent

`PageLoadEvent`와 `LayoutLoadEvent`의 제네릭 형태입니다. 이들은 `./$types`에서 가져와 쓰고([생성된 타입](/docs/kit/types#Generated-types) 참고),
`LoadEvent`를 직접 쓰지 않는 것이 좋습니다.

<div class="ts-block">

```dts
interface LoadEvent<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	Data extends Record<string, unknown> | null = Record<
		string,
		any
	> | null,
	ParentData extends Record<string, unknown> = Record<
		string,
		any
	>,
	RouteId extends AppRouteId | null = AppRouteId | null
> extends NavigationEvent<Params, RouteId> {/*…*/}
```

<div class="ts-block-property">

```dts
fetch: typeof fetch;
```

<div class="ts-block-property-details">

`fetch`는 [네이티브 `fetch` 웹 API](https://developer.mozilla.org/en-US/docs/Web/API/fetch)와 같지만, 몇 가지 기능이 더 있습니다:

- 페이지 요청의 `cookie`와 `authorization` 헤더를 물려받으므로, 서버에서 자격 증명이 포함된 요청을 보낼 수 있습니다.
- 서버에서 상대 경로로 요청을 보낼 수 있습니다(보통 서버 환경에서 `fetch`를 쓰려면 origin이 포함된 URL이 필요합니다).
- 서버에서 실행될 때 내부 요청(예: `+server.js` 라우트에 대한 요청)은 HTTP 호출의 오버헤드 없이 핸들러 함수로 바로 전달됩니다.
- 서버 사이드 렌더링 중에는 `Response` 객체의 `text`와 `json` 메서드를 가로채 응답을 캡처하고, 렌더링된 HTML에 인라인으로 넣습니다. [`filterSerializedResponseHeaders`](/docs/kit/hooks#handle)로 명시적으로 포함하지 않는 한 헤더는 직렬화되지 _않는다는_ 점에 유의하세요
- 하이드레이션 중에는 HTML에서 응답을 읽으므로, 일관성이 보장되고 추가 네트워크 요청이 생기지 않습니다.

쿠키로 자격 증명이 포함된 요청을 보내는 방법은 [여기](/docs/kit/load#Cookies)에서 더 알아볼 수 있습니다

</div>
</div>

<div class="ts-block-property">

```dts
data: Data;
```

<div class="ts-block-property-details">

라우트의 서버 `load` 함수(`+layout.server.js` 또는 `+page.server.js`)가 반환한 데이터가 있으면 그 데이터를 담고 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
setHeaders: (headers: Record<string, string>) => void;
```

<div class="ts-block-property-details">

응답에 헤더를 설정해야 한다면 이 메서드를 사용하면 됩니다. 예를 들어 페이지를 캐시하고 싶을 때 유용합니다:

```js
// @errors: 7031
/// file: src/routes/blog/+page.js
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/articles.json`;
	const response = await fetch(url);

	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

같은 헤더를 여러 번 설정하면(서로 다른 `load` 함수에서라도) 에러가 발생합니다. 하나의 헤더는 한 번만 설정할 수 있습니다.

`setHeaders`로는 `set-cookie` 헤더를 추가할 수 없습니다. 대신 서버 전용 `load` 함수에서 [`cookies`](/docs/kit/@sveltejs-kit#Cookies) API를 사용하세요.

`load` 함수가 브라우저에서 실행될 때는 `setHeaders`가 아무 효과도 없습니다.

</div>
</div>

<div class="ts-block-property">

```dts
parent: () => Promise<ParentData>;
```

<div class="ts-block-property-details">

`await parent()`는 상위 `+layout.js` `load` 함수의 데이터를 반환합니다.
`+layout.js`가 없으면 암묵적으로 `({ data }) => data` 함수로 취급됩니다. 즉, 상위 `+layout.server.js` 파일의 데이터를 그대로 반환해 전달합니다.

`await parent()`를 사용할 때 의도치 않은 워터폴(waterfall)이 생기지 않도록 주의하세요. 예를 들어 상위 데이터를 반환값에 병합하기만 한다면, 다른 데이터를 가져온 _뒤에_ 호출하세요.

</div>
</div>

<div class="ts-block-property">

```dts
depends: (...deps: Array<`${string}:${string}`>) => void;
```

<div class="ts-block-property-details">

이 함수는 `load` 함수가 하나 이상의 URL이나 사용자 정의 식별자에 *의존*한다고 선언합니다. 이후 이 값을 [`invalidate()`](/docs/kit/$app-navigation#invalidate)에 넘겨 `load`를 다시 실행하게 할 수 있습니다.

대부분의 경우 `fetch`가 대신 `depends`를 호출하므로 이 함수가 필요하지 않습니다. `fetch`를 거치지 않는 사용자 정의 API 클라이언트를 쓸 때만 필요합니다.

URL은 절대 경로이거나 로드 중인 페이지를 기준으로 한 상대 경로일 수 있으며, 반드시 [인코딩](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)되어 있어야 합니다.

사용자 정의 식별자는 [URI 명세](https://www.rfc-editor.org/rfc/rfc3986.html)를 따르도록 하나 이상의 소문자 뒤에 콜론이 오는 접두사를 붙여야 합니다.

다음 예제는 `depends`로 사용자 정의 식별자에 대한 의존성을 등록하는 방법을 보여 줍니다. 버튼을 클릭하면 이 식별자가 `invalidate`되어 `load` 함수가 다시 실행됩니다.

```js
// @errors: 7031
/// file: src/routes/+page.js
let count = 0;
export async function load({ depends }) {
	depends('increase:count');

	return { count: count++ };
}
```

```html
/// file: src/routes/+page.svelte
<script>
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	const increase = async () => {
		await invalidate('increase:count');
	}
</script>

<p>{data.count}<p>
<button on:click={increase}>Increase Count</button>
```

</div>
</div>

<div class="ts-block-property">

```dts
untrack: <T>(fn: () => T) => T;
```

<div class="ts-block-property-details">

콜백 안에서 동기적으로 호출되는 모든 것에 대해 의존성 추적을 끄려면 이 함수를 사용하세요. 예:

```js
// @errors: 7031
/// file: src/routes/+page.server.js
export async function load({ untrack, url }) {
	// Untrack url.pathname so that path changes don't trigger a rerun
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

</div>
</div>

<div class="ts-block-property">

```dts
tracing: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v2.31.0

</div>

트레이싱용 span에 접근합니다. 트레이싱이 활성화되지 않았거나 함수가 브라우저에서 실행 중이면 이 span들은 아무 동작도 하지 않습니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
enabled: boolean;
```

<div class="ts-block-property-details">

트레이싱이 활성화되었는지 여부입니다.

</div>
</div>
<div class="ts-block-property">

```dts
root: Span;
```

<div class="ts-block-property-details">

요청의 루트 span입니다. 이 span의 이름은 `sveltekit.handle.root`입니다.

</div>
</div>
<div class="ts-block-property">

```dts
current: Span;
```

<div class="ts-block-property-details">

현재 `load` 함수와 연결된 span입니다.

</div>
</div></div>

</div>
</div></div>

## LoadProperties

<div class="ts-block">

```dts
type LoadProperties<
	input extends Record<string, any> | void
> = input extends void
	? undefined // needs to be undefined, because void will break intellisense
	: input extends Record<string, any>
		? input
		: unknown;
```

</div>

## NavigationEvent

<div class="ts-block">

```dts
interface NavigationEvent<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null
> {/*…*/}
```

<div class="ts-block-property">

```dts
params: Params;
```

<div class="ts-block-property-details">

현재 페이지의 매개변수입니다. 예를 들어 `/blog/[slug]` 같은 라우트라면 `{ slug: string }` 객체입니다

</div>
</div>

<div class="ts-block-property">

```dts
route: {/*…*/};
```

<div class="ts-block-property-details">

현재 라우트에 대한 정보

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
id: RouteId;
```

<div class="ts-block-property-details">

현재 라우트의 ID입니다. 예를 들어 `src/routes/blog/[slug]`라면 `/blog/[slug]`가 됩니다. 일치하는 라우트가 없으면 `null`입니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
url: URL;
```

<div class="ts-block-property-details">

현재 페이지의 URL

</div>
</div></div>

## PrerenderOption

<div class="ts-block">

```dts
type PrerenderOption = boolean | 'auto';
```

</div>

## Redirect

[`redirect`](/docs/kit/@sveltejs-kit#redirect) 함수가 반환하는 객체입니다.

<div class="ts-block">

```dts
interface Redirect {/*…*/}
```

<div class="ts-block-property">

```dts
status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
```

<div class="ts-block-property-details">

300-308 범위의 [HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages)입니다.

</div>
</div>

<div class="ts-block-property">

```dts
location: string;
```

<div class="ts-block-property-details">

리디렉션할 위치입니다.

</div>
</div></div>

## RequestEvent

<div class="ts-block">

```dts
interface RequestEvent<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null
> {/*…*/}
```

<div class="ts-block-property">

```dts
readonly cookies: Cookies;
```

<div class="ts-block-property-details">

현재 요청과 관련된 쿠키를 가져오거나 설정합니다

</div>
</div>

<div class="ts-block-property">

```dts
readonly fetch: typeof fetch;
```

<div class="ts-block-property-details">

`fetch`는 [네이티브 `fetch` 웹 API](https://developer.mozilla.org/en-US/docs/Web/API/fetch)와 같지만, 몇 가지 기능이 더 있습니다:

- 페이지 요청의 `cookie`와 `authorization` 헤더를 물려받으므로, 서버에서 자격 증명이 포함된 요청을 보낼 수 있습니다.
- 서버에서 상대 경로로 요청을 보낼 수 있습니다(보통 서버 환경에서 `fetch`를 쓰려면 origin이 포함된 URL이 필요합니다).
- 서버에서 실행될 때 내부 요청(예: `+server.js` 라우트에 대한 요청)은 HTTP 호출의 오버헤드 없이 핸들러 함수로 바로 전달됩니다.
- 서버 사이드 렌더링 중에는 `Response` 객체의 `text`와 `json` 메서드를 가로채 응답을 캡처하고, 렌더링된 HTML에 인라인으로 넣습니다. [`filterSerializedResponseHeaders`](/docs/kit/hooks#handle)로 명시적으로 포함하지 않는 한 헤더는 직렬화되지 _않는다는_ 점에 유의하세요
- 하이드레이션 중에는 HTML에서 응답을 읽으므로, 일관성이 보장되고 추가 네트워크 요청이 생기지 않습니다.

쿠키로 자격 증명이 포함된 요청을 보내는 방법은 [여기](/docs/kit/load#Cookies)에서 더 알아볼 수 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly getClientAddress: () => string;
```

<div class="ts-block-property-details">

어댑터가 설정한 클라이언트 IP 주소입니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly locals: App.Locals;
```

<div class="ts-block-property-details">

[`server handle hook`](/docs/kit/hooks#handle)에서 요청에 추가한 사용자 정의 데이터를 담고 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly params: Params;
```

<div class="ts-block-property-details">

현재 라우트의 매개변수입니다. 예를 들어 `/blog/[slug]` 같은 라우트라면 `{ slug: string }` 객체입니다.

`query` 함수(`query.batch`와 `query.live` 포함) 안에서 이 속성에 접근하면 에러가 발생합니다.
대신 페이지의 값을 쿼리의 인자로 넘기세요. `form`과 `command` 함수 안에서는 원격 함수를 호출한 페이지를 기준으로 하며,
SvelteKit이 원격 함수용으로 만드는 엔드포인트의 URL을 기준으로 하지 _않습니다_. 이 값은 조작될 수 있는 요청의 일부이므로,
사용자가 특정 데이터에 접근할 권한이 있는지 판단하는 데 절대 사용하지 마세요.

</div>
</div>

<div class="ts-block-property">

```dts
readonly platform: Readonly<App.Platform> | undefined;
```

<div class="ts-block-property-details">

어댑터를 통해 제공되는 추가 데이터입니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly request: Request;
```

<div class="ts-block-property-details">

원본 요청 객체입니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly route: {/*…*/};
```

<div class="ts-block-property-details">

현재 라우트에 대한 정보입니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
id: RouteId;
```

<div class="ts-block-property-details">

현재 라우트의 ID입니다. 예를 들어 `src/routes/blog/[slug]`라면 `/blog/[slug]`가 됩니다. 일치하는 라우트가 없으면 `null`입니다.

`query` 함수(`query.batch`와 `query.live` 포함) 안에서 이 속성에 접근하면 에러가 발생합니다.
대신 페이지의 값을 쿼리의 인자로 넘기세요. `form`과 `command` 함수 안에서는 원격 함수를 호출한 페이지를 기준으로 하며,
SvelteKit이 원격 함수용으로 만드는 엔드포인트의 URL을 기준으로 하지 _않습니다_. 이 값은 조작될 수 있는 요청의 일부이므로,
사용자가 특정 데이터에 접근할 권한이 있는지 판단하는 데 절대 사용하지 마세요.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
readonly setHeaders: (headers: Record<string, string>) => void;
```

<div class="ts-block-property-details">

응답에 헤더를 설정해야 한다면 이 메서드를 사용하면 됩니다. 예를 들어 페이지를 캐시하고 싶을 때 유용합니다:

```js
// @errors: 7031
/// file: src/routes/blog/+page.js
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/articles.json`;
	const response = await fetch(url);

	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

같은 헤더를 여러 번 설정하면(서로 다른 `load` 함수에서라도) 에러가 발생합니다. 하나의 헤더는 한 번만 설정할 수 있습니다.

`setHeaders`로는 `set-cookie` 헤더를 추가할 수 없습니다. 대신 [`cookies`](/docs/kit/@sveltejs-kit#Cookies) API를 사용하세요.

</div>
</div>

<div class="ts-block-property">

```dts
readonly url: URL;
```

<div class="ts-block-property-details">

요청된 URL입니다.

`query` 함수(`query.batch`와 `query.live` 포함) 안에서 이 속성에 접근하면 에러가 발생합니다.
대신 페이지의 값을 쿼리의 인자로 넘기세요. `form`과 `command` 함수 안에서는 원격 함수를 호출한 페이지를 기준으로 하며,
SvelteKit이 원격 함수용으로 만드는 엔드포인트의 URL을 기준으로 하지 _않습니다_. 이 값은 조작될 수 있는 요청의 일부이므로,
사용자가 특정 데이터에 접근할 권한이 있는지 판단하는 데 절대 사용하지 마세요.

</div>
</div>

<div class="ts-block-property">

```dts
readonly isDataRequest: boolean;
```

<div class="ts-block-property-details">

클라이언트가 `+page/layout.server.js` 데이터를 요청한 경우 `true`입니다. 이 경우 `url` 속성에서는 데이터 요청과 관련된
내부 정보가 제거됩니다. 이 구분이 중요하다면 대신 이 속성을 사용하세요.

</div>
</div>

<div class="ts-block-property">

```dts
readonly isSubRequest: boolean;
```

<div class="ts-block-property-details">

실제 HTTP 요청을 보내는 오버헤드 없이 SvelteKit에서 직접 들어온 `+server.js` 호출이면 `true`입니다. 서버에서 같은 origin으로 `fetch` 요청을 보낼 때 이렇게 됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
readonly tracing: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v2.31.0

</div>

트레이싱용 span에 접근합니다. 트레이싱이 활성화되지 않았으면 이 span들은 아무 동작도 하지 않습니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
enabled: boolean;
```

<div class="ts-block-property-details">

트레이싱이 활성화되었는지 여부입니다.

</div>
</div>
<div class="ts-block-property">

```dts
root: Span;
```

<div class="ts-block-property-details">

요청의 루트 span입니다. 이 span의 이름은 `sveltekit.handle.root`입니다.

</div>
</div>
<div class="ts-block-property">

```dts
current: Span;
```

<div class="ts-block-property-details">

현재 `handle` 훅, `load` 함수, 폼 액션 또는 `+server` 핸들러와 연결된 span입니다.

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
readonly isRemoteRequest: boolean;
```

<div class="ts-block-property-details">

요청이 원격 함수를 통해 클라이언트에서 온 경우 `true`입니다. 이 경우 `url` 속성에서는 데이터 요청과 관련된
내부 정보가 제거됩니다. 이 구분이 중요하다면 대신 이 속성을 사용하세요.

</div>
</div></div>

## RequestHandler

`+server.js` 파일에서 내보내는 `(event: RequestEvent) => Response` 함수로, HTTP 동사(`GET`, `PUT`, `PATCH` 등)에 대응하며 해당 메서드의 요청을 처리합니다.

첫 번째 제네릭 인자로 `Params`를 받으며, 대신 [생성된 타입](/docs/kit/types#Generated-types)을 사용하면 생략할 수 있습니다.

<div class="ts-block">

```dts
type RequestHandler<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null
> = (
	event: RequestEvent<Params, RouteId>
) => MaybePromise<Response>;
```

</div>

## RouteDefinition

<div class="ts-block">

```dts
interface RouteDefinition<Config = any> {/*…*/}
```

<div class="ts-block-property">

```dts
id: string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
api: {
	methods: Array<HttpMethod | '*'>;
};
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
page: {
	methods: Array<Extract<HttpMethod, 'GET' | 'POST'>>;
};
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
pattern: RegExp;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
prerender: PrerenderOption;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
segments: RouteSegment[];
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
methods: Array<HttpMethod | '*'>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
config: Config;
```

<div class="ts-block-property-details"></div>
</div></div>

## Server

<div class="ts-block">

```dts
interface Server {/*…*/}
```

<div class="ts-block-property">

```dts
init(options: ServerInitOptions): Promise<void>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
respond(request: Request, options: RequestOptions): Promise<Response>;
```

<div class="ts-block-property-details"></div>
</div></div>

## ServerInitOptions

<div class="ts-block">

```dts
interface ServerInitOptions {/*…*/}
```

<div class="ts-block-property">

```dts
env: Record<string, string | undefined>;
```

<div class="ts-block-property-details">

환경 변수의 맵입니다.

</div>
</div>

<div class="ts-block-property">

```dts
read?: (file: string) => MaybePromise<ReadableStream | null>;
```

<div class="ts-block-property-details">

에셋 파일 이름을 `ReadableStream`으로 바꾸는 함수입니다. `$app/server`에서 내보내는 `read`가 동작하려면 필요합니다.

</div>
</div></div>

## ServerLoad

`PageServerLoad`와 `LayoutServerLoad`의 제네릭 형태입니다. 이들은 `./$types`에서 가져와 쓰고([생성된 타입](/docs/kit/types#Generated-types) 참고),
`ServerLoad`를 직접 쓰지 않는 것이 좋습니다.

<div class="ts-block">

```dts
type ServerLoad<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	ParentData extends Record<string, any> = Record<
		string,
		any
	>,
	OutputData extends Record<string, any> | void = Record<
		string,
		any
	> | void,
	RouteId extends AppRouteId | null = AppRouteId | null
> = (
	event: ServerLoadEvent<Params, ParentData, RouteId>
) => MaybePromise<OutputData>;
```

</div>

## ServerLoadEvent

<div class="ts-block">

```dts
interface ServerLoadEvent<
	Params extends AppLayoutParams<'/'> =
		AppLayoutParams<'/'>,
	ParentData extends Record<string, any> = Record<
		string,
		any
	>,
	RouteId extends AppRouteId | null = AppRouteId | null
> extends RequestEvent<Params, RouteId> {/*…*/}
```

<div class="ts-block-property">

```dts
parent: () => Promise<ParentData>;
```

<div class="ts-block-property-details">

`await parent()`는 상위 `+layout.server.js` `load` 함수의 데이터를 반환합니다.

`await parent()`를 사용할 때 의도치 않은 워터폴(waterfall)이 생기지 않도록 주의하세요. 예를 들어 상위 데이터를 반환값에 병합하기만 한다면, 다른 데이터를 가져온 _뒤에_ 호출하세요.

</div>
</div>

<div class="ts-block-property">

```dts
depends: (...deps: string[]) => void;
```

<div class="ts-block-property-details">

이 함수는 `load` 함수가 하나 이상의 URL이나 사용자 정의 식별자에 *의존*한다고 선언합니다. 이후 이 값을 [`invalidate()`](/docs/kit/$app-navigation#invalidate)에 넘겨 `load`를 다시 실행하게 할 수 있습니다.

대부분의 경우 `fetch`가 대신 `depends`를 호출하므로 이 함수가 필요하지 않습니다. `fetch`를 거치지 않는 사용자 정의 API 클라이언트를 쓸 때만 필요합니다.

URL은 절대 경로이거나 로드 중인 페이지를 기준으로 한 상대 경로일 수 있으며, 반드시 [인코딩](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)되어 있어야 합니다.

사용자 정의 식별자는 [URI 명세](https://www.rfc-editor.org/rfc/rfc3986.html)를 따르도록 하나 이상의 소문자 뒤에 콜론이 오는 접두사를 붙여야 합니다.

다음 예제는 `depends`로 사용자 정의 식별자에 대한 의존성을 등록하는 방법을 보여 줍니다. 버튼을 클릭하면 이 식별자가 `invalidate`되어 `load` 함수가 다시 실행됩니다.

```js
// @errors: 7031
/// file: src/routes/+page.js
let count = 0;
export async function load({ depends }) {
	depends('increase:count');

	return { count: count++ };
}
```

```html
/// file: src/routes/+page.svelte
<script>
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	const increase = async () => {
		await invalidate('increase:count');
	}
</script>

<p>{data.count}<p>
<button on:click={increase}>Increase Count</button>
```

</div>
</div>

<div class="ts-block-property">

```dts
untrack: <T>(fn: () => T) => T;
```

<div class="ts-block-property-details">

콜백 안에서 동기적으로 호출되는 모든 것에 대해 의존성 추적을 끄려면 이 함수를 사용하세요. 예:

```js
// @errors: 7031
/// file: src/routes/+page.js
export async function load({ untrack, url }) {
	// Untrack url.pathname so that path changes don't trigger a rerun
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

</div>
</div>

<div class="ts-block-property">

```dts
tracing: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v2.31.0

</div>

트레이싱용 span에 접근합니다. 트레이싱이 활성화되지 않았으면 이 span들은 아무 동작도 하지 않습니다.

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
enabled: boolean;
```

<div class="ts-block-property-details">

트레이싱이 활성화되었는지 여부입니다.

</div>
</div>
<div class="ts-block-property">

```dts
root: Span;
```

<div class="ts-block-property-details">

요청의 루트 span입니다. 이 span의 이름은 `sveltekit.handle.root`입니다.

</div>
</div>
<div class="ts-block-property">

```dts
current: Span;
```

<div class="ts-block-property-details">

현재 서버 `load` 함수와 연결된 span입니다.

</div>
</div></div>

</div>
</div></div>

## Snapshot

<blockquote class="tag deprecated note">

대신 `$app/navigation`의 [`snapshot`](/docs/kit/$app-navigation#snapshot) 헬퍼를 사용하세요.

</blockquote>

페이지나 레이아웃 컴포넌트에서 내보내는 `export const snapshot`의 타입입니다.

<div class="ts-block">

```dts
interface Snapshot<T = any> {/*…*/}
```

<div class="ts-block-property">

```dts
capture: () => T;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
restore: (snapshot: T) => void;
```

<div class="ts-block-property-details"></div>
</div></div>

## ValidationError

`invalid`가 던지는 검증 에러입니다.

<div class="ts-block">

```dts
interface ValidationError {/*…*/}
```

<div class="ts-block-property">

```dts
issues: StandardSchemaV1.Issue[];
```

<div class="ts-block-property-details">

검증 이슈

</div>
</div>

<div class="ts-block-property">

```dts
remote?: {
	name?: string;
	file?: string;
};
```

<div class="ts-block-property-details">

검증에 실패한 원격 함수에 대한 정보

</div>
</div></div>



## Private types

다음 타입은 위에서 설명한 공개 타입에서 참조되지만, 직접 가져올 수는 없습니다:

### AdapterEntry

<div class="ts-block">

```dts
interface AdapterEntry {/*…*/}
```

<div class="ts-block-property">

```dts
id: string;
```

<div class="ts-block-property-details">

HTTP 서비스(예: 서버리스 함수)를 고유하게 식별하며 중복 제거에 쓰이는 문자열입니다.
예를 들어 `/foo/a-[b]`와 `/foo/[c]`는 서로 다른 라우트이지만,
Netlify _redirects 파일에서는 둘 다 `/foo/:param`으로 표현되므로 같은 ID를 공유합니다

</div>
</div>

<div class="ts-block-property">

```dts
filter(route: RouteDefinition): boolean;
```

<div class="ts-block-property-details">

후보 라우트를 현재 라우트와 비교해
현재 라우트와 함께 묶어야 하는지 판단하는 함수입니다.

사용 사례:
- 폴백 페이지: `/foo/[c]`는 `/foo/a-[b]`의 폴백이고, `/[...catchall]`은 모든 라우트의 폴백입니다
- 공통 `config`를 공유하는 라우트 묶기: `/foo`는 엣지에 배포하고, `/bar`와 `/baz`는 서버리스 함수로 배포해야 하는 경우

</div>
</div>

<div class="ts-block-property">

```dts
complete(entry: { generateManifest(opts: { relativePath: string }): string }): MaybePromise<void>;
```

<div class="ts-block-property-details">

엔트리가 만들어진 뒤 호출되는 함수입니다. 여기에서
함수를 파일 시스템에 쓰고 리디렉션 매니페스트를 생성해야 합니다.

</div>
</div></div>

### Csp

<div class="ts-block">

```dts
namespace Csp {
	type ActionSource =
		| 'strict-dynamic'
		| 'report-sample'
		| 'report-sha256'
		| 'report-sha384'
		| 'report-sha512';
	type BaseSource =
		| 'self'
		| 'unsafe-eval'
		| 'unsafe-hashes'
		| 'unsafe-inline'
		| 'unsafe-allow-redirects'
		| 'unsafe-webtransport-hashes'
		| 'wasm-unsafe-eval'
		| 'trusted-types-eval'
		| 'none';
	type CryptoSource =
		`${'nonce' | 'sha256' | 'sha384' | 'sha512'}-${string}`;
	type FrameSource =
		| HostSource
		| SchemeSource
		| 'self'
		| 'none';
	type HostNameScheme = `${string}.${string}` | 'localhost';
	type HostSource =
		`${HostProtocolSchemes}${HostNameScheme}${PortScheme}`;
	type HostProtocolSchemes = `${string}://` | '';
	type HttpDelineator = '/' | '?' | '#' | '\\';
	type PortScheme = `:${number}` | '' | ':*';
	type SchemeSource =
		| 'http:'
		| 'https:'
		| 'ws:'
		| 'wss:'
		| 'data:'
		| 'mediastream:'
		| 'blob:'
		| 'filesystem:'
		| (`${string}:` & {});
	type Source =
		| HostSource
		| SchemeSource
		| CryptoSource
		| BaseSource;
	type Sources = Source[];
}
```

</div>

### CspDirectives

<div class="ts-block">

```dts
interface CspDirectives {/*…*/}
```

<div class="ts-block-property">

```dts
'child-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'default-src'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'frame-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'worker-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'connect-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'font-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'img-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'manifest-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'media-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'object-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'prefetch-src'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'script-src'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'script-src-elem'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'script-src-attr'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'style-src'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'style-src-elem'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'style-src-attr'?: Csp.Sources;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'base-uri'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
sandbox?: Array<
| 'allow-downloads-without-user-activation'
| 'allow-forms'
| 'allow-modals'
| 'allow-orientation-lock'
| 'allow-pointer-lock'
| 'allow-popups'
| 'allow-popups-to-escape-sandbox'
| 'allow-presentation'
| 'allow-same-origin'
| 'allow-scripts'
| 'allow-storage-access-by-user-activation'
| 'allow-top-navigation'
| 'allow-top-navigation-by-user-activation'
>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'form-action'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'frame-ancestors'?: Array<Csp.HostSource | Csp.SchemeSource | Csp.FrameSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'navigate-to'?: Array<Csp.Source | Csp.ActionSource>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'report-uri'?: string[];
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'report-to'?: string[];
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'require-trusted-types-for'?: Array<'script'>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'trusted-types'?: Array<'none' | 'allow-duplicates' | '*' | string>;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'upgrade-insecure-requests'?: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
'require-sri-for'?: Array<'script' | 'style' | 'script style'>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 

</div>

</div>
</div>

<div class="ts-block-property">

```dts
'block-all-mixed-content'?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 

</div>

</div>
</div>

<div class="ts-block-property">

```dts
'plugin-types'?: Array<`${string}/${string}` | 'none'>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 

</div>

</div>
</div>

<div class="ts-block-property">

```dts
referrer?: Array<
| 'no-referrer'
| 'no-referrer-when-downgrade'
| 'origin'
| 'origin-when-cross-origin'
| 'same-origin'
| 'strict-origin'
| 'strict-origin-when-cross-origin'
| 'unsafe-url'
| 'none'
>;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 

</div>

</div>
</div></div>

### DeepPartial

<div class="ts-block">

```dts
type DeepPartial<T> = T extends
	| Record<PropertyKey, unknown>
	| unknown[]
	? {
			[K in keyof T]?: T[K] extends
				| Record<PropertyKey, unknown>
				| unknown[]
				? DeepPartial<T[K]>
				: T[K];
		}
	: T | undefined;
```

</div>

### HasNonOptionalBoolean

<div class="ts-block">

```dts
type HasNonOptionalBoolean<T> =
	IsAny<T> extends true
		? never
		: [T] extends [boolean]
			? true
			: T extends Array<infer U>
				? HasNonOptionalBoolean<U>
				: T extends Record<string, any>
					? {
							[K in keyof T]: HasNonOptionalBoolean<T[K]>;
						}[keyof T]
					: never;
```

</div>

### HttpMethod

<div class="ts-block">

```dts
type HttpMethod =
	| 'GET'
	| 'HEAD'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PATCH'
	| 'OPTIONS'
	| 'QUERY';
```

</div>

### IsAny

<div class="ts-block">

```dts
type IsAny<T> = 0 extends 1 & T ? true : false;
```

</div>

### Logger

<div class="ts-block">

```dts
interface Logger {/*…*/}
```

<div class="ts-block-property">

```dts
(msg: string): void;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
success(msg: string): void;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
error(msg: string): void;
```

<div class="ts-block-property-details">

stderr에 굵은 빨간색 메시지를 출력합니다

</div>
</div>

<div class="ts-block-property">

```dts
warn(msg: string): void;
```

<div class="ts-block-property-details">

stderr에 굵은 노란색 메시지를 출력합니다

</div>
</div>

<div class="ts-block-property">

```dts
minor(msg: string): void;
```

<div class="ts-block-property-details">

`verbose === true`이면 stdout에 흐린 텍스트를 출력합니다

</div>
</div>

<div class="ts-block-property">

```dts
info(msg: string): void;
```

<div class="ts-block-property-details">

`verbose === true`이면 stdout에 출력합니다

</div>
</div>

<div class="ts-block-property">

```dts
err(msg: string): void;
```

<div class="ts-block-property-details">

서식 없이 stderr에 출력합니다

</div>
</div>

<div class="ts-block-property">

```dts
prettyError(error: unknown, caller?: string): void;
```

<div class="ts-block-property-details">

굵은 빨간색 메시지를 출력하고, 이어서 각 에러의 스택 트레이스를 출력합니다(`.cause` 체인을 따라감)

</div>
</div></div>

### MaybePromise

<div class="ts-block">

```dts
type MaybePromise<T> = T | Promise<T>;
```

</div>

### PrerenderEntryGeneratorMismatchHandler

<div class="ts-block">

```dts
interface PrerenderEntryGeneratorMismatchHandler {/*…*/}
```

<div class="ts-block-property">

```dts
(details: { generatedFromId: string; entry: string; matchedId: string; message: string }): void;
```

<div class="ts-block-property-details"></div>
</div></div>

### PrerenderEntryGeneratorMismatchHandlerValue

<div class="ts-block">

```dts
type PrerenderEntryGeneratorMismatchHandlerValue =
	| 'fail'
	| 'warn'
	| 'ignore'
	| PrerenderEntryGeneratorMismatchHandler;
```

</div>

### PrerenderHttpErrorHandler

<div class="ts-block">

```dts
interface PrerenderHttpErrorHandler {/*…*/}
```

<div class="ts-block-property">

```dts
(details: {
status: number;
path: string;
referrer: string | null;
referenceType: 'linked' | 'fetched';
message: string;
}): void;
```

<div class="ts-block-property-details"></div>
</div></div>

### PrerenderHttpErrorHandlerValue

<div class="ts-block">

```dts
type PrerenderHttpErrorHandlerValue =
	| 'fail'
	| 'warn'
	| 'ignore'
	| PrerenderHttpErrorHandler;
```

</div>

### PrerenderInvalidUrlHandler

<div class="ts-block">

```dts
interface PrerenderInvalidUrlHandler {/*…*/}
```

<div class="ts-block-property">

```dts
(details: { href: string; referrer: string | null; message: string }): void;
```

<div class="ts-block-property-details"></div>
</div></div>

### PrerenderInvalidUrlHandlerValue

<div class="ts-block">

```dts
type PrerenderInvalidUrlHandlerValue =
	| 'fail'
	| 'warn'
	| 'ignore'
	| PrerenderInvalidUrlHandler;
```

</div>

### PrerenderMap

<div class="ts-block">

```dts
type PrerenderMap = Map<string, PrerenderOption>;
```

</div>

### PrerenderMissingIdHandler

<div class="ts-block">

```dts
interface PrerenderMissingIdHandler {/*…*/}
```

<div class="ts-block-property">

```dts
(details: { path: string; id: string; referrers: string[]; message: string }): void;
```

<div class="ts-block-property-details"></div>
</div></div>

### PrerenderMissingIdHandlerValue

<div class="ts-block">

```dts
type PrerenderMissingIdHandlerValue =
	| 'fail'
	| 'warn'
	| 'ignore'
	| PrerenderMissingIdHandler;
```

</div>

### PrerenderOption

<div class="ts-block">

```dts
type PrerenderOption = boolean | 'auto';
```

</div>

### PrerenderUnseenRoutesHandler

<div class="ts-block">

```dts
interface PrerenderUnseenRoutesHandler {/*…*/}
```

<div class="ts-block-property">

```dts
(details: { routes: string[]; message: string }): void;
```

<div class="ts-block-property-details"></div>
</div></div>

### PrerenderUnseenRoutesHandlerValue

<div class="ts-block">

```dts
type PrerenderUnseenRoutesHandlerValue =
	| 'fail'
	| 'warn'
	| 'ignore'
	| PrerenderUnseenRoutesHandler;
```

</div>

### Prerendered

<div class="ts-block">

```dts
interface Prerendered {/*…*/}
```

<div class="ts-block-property">

```dts
pages: Map<
string,
{
	/** The location of the .html file relative to the output directory */
	file: string;
}
>;
```

<div class="ts-block-property-details">

`path`를 `{ file }` 객체에 대응시킨 맵입니다. `/foo` 같은 경로는 `foo.html`에, `/bar/` 같은 경로는 `bar/index.html`에 대응합니다.

</div>
</div>

<div class="ts-block-property">

```dts
assets: Map<
string,
{
	/** The MIME type of the asset */
	type: string;
}
>;
```

<div class="ts-block-property-details">

`path`를 `{ type }` 객체에 대응시킨 맵입니다.

</div>
</div>

<div class="ts-block-property">

```dts
redirects: Map<
string,
{
	status: number;
	location: string;
}
>;
```

<div class="ts-block-property-details">

프리렌더링 중에 만난 리디렉션의 맵입니다.

</div>
</div>

<div class="ts-block-property">

```dts
paths: string[];
```

<div class="ts-block-property-details">

프리렌더링된 경로의 배열(trailingSlash 설정과 관계없이 후행 슬래시 없음)

</div>
</div></div>

### RequestOptions

<div class="ts-block">

```dts
interface RequestOptions {/*…*/}
```

<div class="ts-block-property">

```dts
getClientAddress(): string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
platform?: App.Platform;
```

<div class="ts-block-property-details"></div>
</div></div>

### RouteSegment

<div class="ts-block">

```dts
interface RouteSegment {/*…*/}
```

<div class="ts-block-property">

```dts
content: string;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
dynamic: boolean;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
rest: boolean;
```

<div class="ts-block-property-details"></div>
</div></div>

### TrailingSlash

<div class="ts-block">

```dts
type TrailingSlash = 'never' | 'always' | 'ignore';
```

</div>


