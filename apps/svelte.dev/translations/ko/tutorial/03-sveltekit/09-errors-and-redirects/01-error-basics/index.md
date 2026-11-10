---
title: 기본
---

SvelteKit의 에러에는 크게 두 종류가 있습니다. 바로 *앱* 에러와 *알 수 없는* 에러입니다.

앱 에러는 `src/routes/app/+page.server.js`에서처럼 `@sveltejs/kit`의 [`error`](/docs/kit/@sveltejs-kit#error) 헬퍼로 throw한 에러입니다:

```js
/// file: src/routes/app/+page.server.js
import { error } from '@sveltejs/kit';

export function load() {
	error(420, 'Enhance your calm');
}
```

그 밖의 에러는 모두(`src/routes/unknown/+page.server.js`에 있는 에러처럼) 알 수 없는 에러로 취급됩니다:

```js
/// file: src/routes/unknown/+page.server.js
export function load() {
	throw new Error('Kaboom!');
}
```

앱 에러를 throw한다는 것은 SvelteKit에 '걱정 마, 내가 뭘 하는지 알고 있어'라고 말하는 것과 같습니다. 반면 알 수 없는 에러는 앱의 버그로 간주됩니다. 알 수 없는 에러가 throw되면 그 메시지와 스택 트레이스가 콘솔에 기록됩니다.

> [!NOTE] 이후 챕터에서 `handleError` 훅으로 직접 에러를 처리하는 방법을 배웁니다.

이 앱의 링크를 클릭해 보면 중요한 차이를 발견할 수 있습니다. 앱 에러 메시지는 사용자에게 보이지만, 알 수 없는 에러 메시지는 가려지고 500 상태 코드와 함께 일반적인 'Internal Error' 메시지로 바뀝니다. 에러 메시지에 민감한 데이터가 담겨 있을 수 있기 때문입니다.
