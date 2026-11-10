---
title: 서버 전용 모듈
---

좋은 친구처럼 SvelteKit은 비밀을 지켜 줍니다. 백엔드와 프론트엔드를 같은 저장소에서 작성하다 보면, 민감한 데이터(예를 들어 API 키가 담긴 환경 변수)를 실수로 프론트엔드 코드에 가져오기 쉽습니다. SvelteKit은 이를 완전히 막는 방법을 제공하는데, 바로 서버 전용 모듈입니다.

## 비공개 환경 변수 <!-- Private environment variables -->

[`$app/env/private`](environment-variables) 모듈은 [`hooks.server.js`](hooks)나 [`+page.server.js`](routing#page-page.server.js)처럼 서버에서만 실행되는 모듈에서만 가져올 수 있습니다.

## 서버 전용 유틸리티 <!-- Server-only utilities -->

파일 시스템에서 에셋을 읽는 [`read`]($app-server#read) 함수가 들어 있는 [`$app/server`]($app-server) 모듈도 마찬가지로 서버에서 실행되는 코드에서만 가져올 수 있습니다.

## 직접 만든 모듈 <!-- Your modules -->

모듈을 서버 전용으로 만드는 방법은 두 가지입니다:

- 파일 이름에 `server` 세그먼트를 넣습니다. 예: `server.js`, `secrets.server.ts`. 이 방법은 프로젝트 디렉터리 안의 모든 파일에 적용됩니다.
- `src/routes`나 `static` 디렉터리 안을 제외한 프로젝트 내 아무 곳의 `server` 디렉터리에 모듈을 둡니다. 예: `src/lib/server/config.js`, `src/lib/data/server/user/profile.js`.

> [!LEGACY]
>  SvelteKit 2에서는 `src/lib` 폴더 안의 `server` 디렉터리만 인식되었습니다.

> [!NOTE] 작업 디렉터리 밖에 있는 모듈과 `node_modules` 안에 있는 모듈(예: npm 패키지)에는 이 규칙이 적용되지 _않습니다_. 서버 전용 모듈이 포함된 패키지를 배포하려면 해당 파일 맨 위에 `import '$app/server'`를 추가하세요.

## 동작 방식 <!-- How it works -->

공개 코드가 서버 전용 코드를 (직접이든 간접이든) 가져올 때마다...

```js
// @errors: 7005
/// file: #lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];
```

```js
// @errors: 2307 7006 7005
/// file: src/routes/utils.js
export { atlantisCoordinates } from '#lib/server/secrets.js';

export const add = (a, b) => a + b;
```

```html
/// file: src/routes/+page.svelte
<script>
	import { add } from './utils.js';
</script>
```

...SvelteKit은 에러를 발생시킵니다:

```
Cannot import #lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information.

 src/routes/+page.svelte imports
  src/routes/utils.js imports
   #lib/server/secrets.ts

If you're only using the import as a type, change it to `import type`.
```

공개 코드인 `src/routes/+page.svelte`는 `add` 내보내기만 사용하고 비밀인 `atlantisCoordinates` 내보내기는 사용하지 않지만, 비밀 코드가 브라우저가 내려받는 JavaScript에 포함될 수 있으므로 이 가져오기 체인은 안전하지 않은 것으로 간주됩니다.

이 기능은 동적 가져오기에서도 동작하며, ``await import(`./${foo}.js`)``처럼 보간된 경우에도 마찬가지입니다.

> [!NOTE] Vitest 같은 단위 테스트 프레임워크는 서버 전용 코드와 공개 코드를 구분하지 않습니다. 그래서 테스트를 실행할 때는 `process.env.TEST === 'true'`로 판단해 잘못된 가져오기 감지를 끕니다.

## 더 읽어보기 <!-- Further reading -->

- [튜토리얼: 환경 변수](/tutorial/kit/env-static-private)
