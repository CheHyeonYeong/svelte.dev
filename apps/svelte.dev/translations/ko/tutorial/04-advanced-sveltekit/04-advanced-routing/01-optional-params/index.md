---
title: 선택적 매개변수
---

[라우팅](/tutorial/kit/pages)을 다룬 첫 장에서 [동적 매개변수](/tutorial/kit/params)가 있는 라우트를 만드는 방법을 배웠습니다.

때로는 매개변수를 선택적으로 만들면 편리합니다. 대표적인 예는 `/fr/...`, `/de/...`처럼 경로로 로케일을 정하면서 기본 로케일도 두고 싶은 경우입니다.

이렇게 하려면 대괄호를 두 겹으로 씁니다. `[lang]` 디렉터리의 이름을 `[[lang]]`으로 바꾸세요.

이제 앱이 빌드에 실패합니다. `src/routes/+page.svelte`와 `src/routes/[[lang]]/+page.svelte`가 둘 다 `/`와 일치하기 때문입니다. `src/routes/+page.svelte`를 삭제하세요. (에러 페이지에서 벗어나려면 앱을 새로고침해야 할 수도 있습니다.)

마지막으로 `src/routes/[[lang]]/+page.server.js`를 수정해 기본 로케일을 지정하세요:

```js
/// file: src/routes/[[lang]]/+page.server.js
const greetings = {
	en: 'hello!',
	de: 'hallo!',
	fr: 'bonjour!'
};

export function load({ params }) {
	return {
		greeting: greetings[params.lang +++?? 'en'+++]
	};
}
```
