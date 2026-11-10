---
title: <svelte:boundary>
---

에러 때문에 앱이 망가진 상태로 남지 않도록, `<svelte:boundary>` 요소를 사용해 에러를 *에러 바운더리* 안에 가둘 수 있습니다.

이 예제에서 `<FlakyComponent>`에는 버그가 있습니다. 버튼을 클릭하면 `mouse`가 `null`이 되어 템플릿의 `{mouse.x}`와 `{mouse.y}` 표현식이 렌더링에 실패합니다.

이상적으로는 버그를 고치면 그만입니다. 하지만 항상 그럴 수 있는 것은 아닙니다. 컴포넌트가 다른 사람의 것일 때도 있고, 그저 예상치 못한 상황에 대비해야 할 때도 있습니다. 먼저 `<FlakyComponent />`를 `<svelte:boundary>`로 감싸세요:

```svelte
<!--- file: App.svelte --->
+++<svelte:boundary>+++
	<FlakyComponent />
+++</svelte:boundary>+++
```

바운더리가 핸들러를 지정하지 않았기 때문에 아직은 아무것도 바뀌지 않았습니다. 에러가 발생했을 때 보여 줄 UI를 제공하는 `failed` [스니펫](snippets-and-render-tags)을 추가하세요:

```svelte
<!--- file: App.svelte --->
<svelte:boundary>
	<FlakyComponent />

+++	{#snippet failed(error)}
		<p>Oops! {error.message}</p>
	{/snippet}+++
</svelte:boundary>
```

이제 버튼을 클릭하면 바운더리의 내용이 스니펫으로 바뀝니다. `failed`에 전달되는 두 번째 인자를 활용해서 상태를 초기화해 볼 수 있습니다:

```svelte
<!--- file: App.svelte --->
<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error+++, reset+++)}
		<p>Oops! {error.message}</p>
		+++<button onclick={reset}>Reset</button>+++
	{/snippet}
</svelte:boundary>
```

`failed` 스니펫에 전달되는 것과 같은 인자로 호출되는 `onerror` 핸들러를 지정할 수도 있습니다:

```svelte
<!--- file: App.svelte --->
<svelte:boundary +++onerror={(e) => console.error(e)}+++>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<p>Oops! {error.message}</p>
		<button onclick={reset}>Reset</button>
	{/snippet}
</svelte:boundary>
```

이는 에러 정보를 리포팅 서비스로 보내거나, 에러 바운더리 바깥에 UI를 추가할 때 유용합니다.
