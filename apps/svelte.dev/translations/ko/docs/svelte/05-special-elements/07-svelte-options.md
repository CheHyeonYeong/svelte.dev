---
title: <svelte:options>
---

```svelte
<svelte:options option={value} />
```

`<svelte:options>` 요소는 컴포넌트별 컴파일러 옵션을 지정하는 곳이며, 각 옵션은 [컴파일러 섹션](svelte-compiler#compile)에 자세히 설명되어 있습니다. 사용할 수 있는 옵션은 다음과 같습니다:

- `runes={true}` — 컴포넌트를 강제로 *룬 모드*로 만듭니다([레거시 API](legacy-overview) 섹션 참고)
- `runes={false}` — 컴포넌트를 강제로 *레거시 모드*로 만듭니다
- `namespace="..."` — 이 컴포넌트가 사용될 네임스페이스로, "html"(기본값), "svg", "mathml" 중 하나입니다
- `customElement={...}` — 이 컴포넌트를 커스텀 엘리먼트로 컴파일할 때 사용할 [옵션](custom-elements#Component-options)입니다. 문자열을 전달하면 `tag` 옵션으로 사용됩니다
- `css="injected"` — 컴포넌트가 스타일을 인라인으로 주입합니다. 서버 사이드 렌더링 중에는 `head`에 `<style>` 태그로 주입되고, 클라이언트 사이드 렌더링 중에는 JavaScript를 통해 로드됩니다

> [!LEGACY] 지원 중단된 옵션
> Svelte 4에는 다음 옵션도 있었습니다. 이 옵션들은 Svelte 5에서 지원 중단(deprecated)되었으며 룬 모드에서는 동작하지 않습니다.
>
> - `immutable={true}` — 변경 가능한 데이터를 전혀 사용하지 않으므로, 컴파일러가 값이 바뀌었는지 판단할 때 단순한 참조 동등성 검사를 할 수 있습니다
> - `immutable={false}` — 기본값입니다. Svelte가 변경 가능한 객체가 바뀌었는지를 더 보수적으로 판단합니다
> - `accessors={true}` — 컴포넌트의 props에 대한 getter와 setter를 추가합니다
> - `accessors={false}` — 기본값입니다

```svelte
<svelte:options customElement="my-custom-element" />
```
