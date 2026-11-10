---
title: props 펼치기
---

이 연습 문제의 `App.svelte`에서는 `PackageInfo.svelte`가 기대하는 `name` prop을 전달하는 것을 깜빡했습니다. 그래서 `<code>` 요소가 비어 있고 npm 링크도 깨져 있습니다.

prop을 추가해서 고칠 *수도* 있지만...

```svelte
/// file: App.svelte
<PackageInfo
	+++name={pkg.name}+++
	version={pkg.version}
	description={pkg.description}
	website={pkg.website}
/>
```

...`pkg`의 속성들이 컴포넌트가 기대하는 props와 일치하므로, 대신 컴포넌트에 '펼쳐서' 전달할 수 있습니다:

```svelte
/// file: App.svelte
<PackageInfo +++{...pkg}+++ />
```

> [!NOTE] 반대로 `PackageInfo.svelte`에서는 나머지 속성을 사용해 컴포넌트에 전달된 모든 props를 담은 객체를 얻을 수 있습니다...
>
> ```js
> let { name, ...stuff } = $props();
> ```
>
> ...또는 [구조 분해](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)를 아예 생략할 수도 있습니다:
>
> ```js
> let stuff = $props();
> ```
>
> ...이 경우 객체 경로로 속성에 접근할 수 있습니다:
>
> ```js
> console.log(stuff.name, stuff.version, stuff.description, stuff.website);
> ```
