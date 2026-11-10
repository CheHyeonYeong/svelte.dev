---
title: 유니버설 load 함수
---

[앞선 로딩 섹션](page-data)에서는 `+page.server.js`와 `+layout.server.js` 파일을 사용해 서버에서 데이터를 불러왔습니다. 데이터베이스에서 직접 데이터를 가져오거나 쿠키를 읽는 등의 작업이 필요할 때 매우 편리합니다.

그런데 클라이언트 사이드 내비게이션을 할 때 서버에서 데이터를 불러오는 것이 맞지 않는 경우도 있습니다. 예를 들면 다음과 같습니다:

- 외부 API에서 데이터를 불러오는 경우
- 메모리에 데이터가 있다면 그것을 쓰고 싶은 경우
- 이미지가 뒤늦게 튀어나오지 않도록, 이미지가 프리로드될 때까지 내비게이션을 늦추고 싶은 경우
- 컴포넌트나 클래스 인스턴스처럼 직렬화할 수 없는 것을 `load`에서 반환해야 하는 경우(SvelteKit은 서버 데이터를 JSON으로 바꾸는 데 [devalue](https://github.com/Rich-Harris/devalue)를 사용합니다)

이 연습에서 다루는 것은 마지막 경우입니다. `src/routes/red/+page.server.js`, `src/routes/green/+page.server.js`, `src/routes/blue/+page.server.js`의 서버 `load` 함수는 데이터처럼 직렬화할 수 없는 `component` 함수를 반환합니다. `/red`, `/green`, `/blue`로 이동하면 터미널에 'Data returned from `load` ... is not serializable' 에러가 표시됩니다.

서버 `load` 함수를 유니버설 `load` 함수로 바꾸려면 각 `+page.server.js` 파일의 이름을 `+page.js`로 바꾸세요. 이제 이 함수들은 서버 사이드 렌더링 중에는 서버에서 실행되고, 앱이 하이드레이트되거나 사용자가 클라이언트 사이드 내비게이션을 할 때는 브라우저에서도 실행됩니다.

이제 이 `load` 함수들이 반환한 `component`를 `src/routes/+layout.svelte`를 비롯한 어디에서든 다른 값처럼 사용할 수 있습니다:

```svelte
/// file: src/routes/+layout.svelte
<nav
	class={[page.data.color && 'has-color']}
	style:background={page.data.color ?? 'var(--bg-2)'}
>
	<a href="/">home</a>
	<a href="/red">red</a>
	<a href="/green">green</a>
	<a href="/blue">blue</a>

+++	{#if page.data.component}
		<page.data.component />
	{/if}+++
</nav>
```

서버 `load` 함수와 유니버설 `load` 함수의 차이, 그리고 각각 언제 써야 하는지 더 알아보려면 [문서](/docs/kit/load#Universal-vs-server)를 읽어 보세요.
