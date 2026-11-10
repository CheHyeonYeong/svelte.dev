---
title: 매개변수 매처
path: /colors/ff3e00
---

라우터가 잘못된 입력과 일치하지 않도록 *매처*를 지정할 수 있습니다. 예를 들어 `/colors/[color]` 같은 라우트가 `/colors/ff3e00` 같은 16진수 값과는 일치하지만 `/colors/octarine` 같은 색 이름이나 그 밖의 임의 입력과는 일치하지 않게 하고 싶을 수 있습니다.

매처는 `src/params.js` 파일에 정의합니다. 파일을 만들고 `defineParams`로 `hex` 매처를 추가하세요:

```js
/// file: src/params.js
import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	hex(value) {
		return /^[0-9a-f]{6}$/.test(value) ? value : undefined;
	}
});
```

매처는 `page.params`에 추가될 파싱된 값을 반환하고, 값이 일치하지 않으면 `undefined`를 반환합니다. 여기서는 유효한 16진수 값을 그대로 반환하므로 `page.params.color`는 계속 문자열입니다.

그런 다음 새 매처를 사용하기 위해 `src/routes/colors/[color]`의 이름을 `src/routes/colors/[color=hex]`로 바꾸세요.

이제 누군가 이 라우트로 이동할 때마다 SvelteKit은 `color`가 유효한 `hex` 값인지 확인하고 매처가 반환한 값을 사용합니다. 매처가 `undefined`를 반환하면 SvelteKit은 다른 라우트와 일치하는지 시도한 뒤, 결국 404를 반환합니다.

> [!NOTE] 매처는 서버와 브라우저 양쪽에서 실행됩니다.

> [!NOTE] 매처는 함수 대신 [Standard Schema](https://standardschema.dev)일 수도 있습니다. [Valibot](https://valibot.dev)이나 [Zod](https://zod.dev) 스키마가 그 예입니다. 자세한 내용은 [문서](/docs/kit/advanced-routing#Matching)를 참고하세요.
