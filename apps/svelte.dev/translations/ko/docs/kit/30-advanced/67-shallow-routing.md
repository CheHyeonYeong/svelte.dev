---
title: 페이지 상태와 얕은 라우팅
---

SvelteKit 앱 안에서 이동하면 *기록 항목*(history entry)이 생성됩니다. 뒤로 가기와 앞으로 가기 버튼을 클릭하면 이 항목 목록을 따라 이동하면서, 필요에 따라 `load` 함수를 다시 실행하고, 페이지 컴포넌트를 교체하고, 스크롤 위치와 포커스된 요소를 업데이트합니다.

때로는 전체 내비게이션을 수행하지 *않고* 기록 항목을 만드는 것이 유용합니다. 이를 *얕은 라우팅*이라고 합니다.

예를 들어 사용자가 뒤로 가기로 닫을 수 있는 모달 대화 상자를 보여 주고 싶을 수 있습니다. 이는 특히 UI와 직접 상호작용하는 것보다 스와이프 제스처가 더 자연스러운 경우가 많은 모바일 기기에서 유용합니다. 이런 경우 기록 항목과 연결되지 *않은* 모달은 사용자를 답답하게 만들 수 있습니다. 사용자가 모달을 닫으려고 뒤로 스와이프했다가 엉뚱한 페이지에 도착할 수 있기 때문입니다.

SvelteKit은 [`goto`]($app-navigation#goto) 함수로 이를 가능하게 합니다. `shallow: true` 옵션을 사용하면 이동하지 않고도 기록 항목에 상태를 연결할 수 있습니다:

```svelte
<!--- file: +page.svelte --->
<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';

	function showModal() {
		goto('', {
			state: { showModal: true },
			shallow: true
		});
	}
</script>

<button onclick={showModal}>open</button>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

상태는 [page 객체]($app-state#page)의 `page.state`로 전역에서 접근할 수 있습니다. [`App.PageState`](types#PageState) 인터페이스를 (보통 `src/app.d.ts`에) 선언하면 페이지 상태를 타입 안전하게 만들 수 있습니다.

모달은 뒤로 이동하거나(`page.state.showModal` 해제), `close` 콜백이 실행되도록 모달과 상호작용해서 닫을 수 있습니다. `close` 콜백은 프로그래밍 방식으로 뒤로 이동합니다.

얕은 내비게이션 중에 브라우저 URL 표시줄의 내용을 업데이트할 수도 있습니다:

```js
import { goto } from '$app/navigation';
const state = { active: true };
// ---cut---
goto('/another/page', {
	state,
	shallow: true
});
```

> [!NOTE] 사용자가 새로고침하면 현재 렌더링된 페이지가 *아니라* `/another/page`로 이동합니다. [주의 사항](#Caveats)을 참고하세요.

표시되는 URL을 업데이트하든 하지 않든, [`beforeNavigate`]($app-navigation#beforeNavigate), [`onNavigate`]($app-navigation#onNavigate), [`afterNavigate`]($app-navigation#afterNavigate)는 `navigation.type === 'goto'`이고 `navigation.shallow === true`인 상태로 실행됩니다.

얕은 라우팅이 활성화되면 `page.shallow`는 사용자가 그곳으로 이동했을 때(예를 들어 페이지를 새로고침했을 때) 렌더링*될* 페이지를 설명하는 `{ url, params, route }` 객체가 됩니다. `page.url`, `page.params`, `page.route`는 계속 현재 렌더링된 페이지를 설명합니다.

```svelte
<!--- file: +page.svelte --->
<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
</script>

<p>The user-visible URL is {page.shallow?.url.href ?? page.url.href}</p>
<p>The actual page you're on is {page.url.href}</p>

<button onclick={() => goto('/shallow', { shallow: true })}>enter shallow route</button>
```

`shallow: true` 없이 일반적으로 `goto`를 호출하거나 일반 링크를 클릭하면 얕은 라우팅에서 빠져나갑니다.

얕은 항목으로 뒤로 가거나 앞으로 가면 그 항목의 `page.state`와 `page.shallow`가 복원됩니다. 렌더링된 페이지, 따라서 `page.url`은 여전히 `goto`가 호출되었을 때 사용자가 있던 페이지입니다. 표시되는 URL로 이동하려면 `shallow: true` 없이 `goto(page.shallow.url)`을 호출하세요.

> [!LEGACY]
> SvelteKit 2에서는 이 기능을 `pushState`와 `replaceState`로 구현했지만, 이제는 지원 중단(deprecated)되었습니다. 대신 `shallow: true`와 함께 `goto`를 사용하고, 현재 기록 항목을 대체할 때는 `replace` 옵션을 사용하세요.

## 라우팅 옵션 <!-- Routing options -->

기본적으로 위의 예시는 기록 스택에 새 내비게이션 항목을 만듭니다. 이를 원하지 않는다면 기존 내비게이션 항목을 대체할 수 있습니다:

```js
import { goto } from '$app/navigation';
const url = new URL('https://example.com');
const state = { showModal: true };
// ---cut---
goto(url, {
	state,
	replace: true
});
```

기본적으로 `goto`로 설정한 상태는 새로고침 후 복원되지 않습니다. 이를 바꾸려면 `persistState`를 사용하세요:

```js
import { goto } from '$app/navigation';
const url = new URL('https://example.com');
const state = { showModal: true };
// ---cut---
goto(url, {
	state,
	persistState: true
});
```

얕은 내비게이션은 기본적으로 현재 스크롤 위치와 포커스된 요소를 유지합니다. `reset: true`로 이 동작을 끌 수 있습니다:

```js
import { goto } from '$app/navigation';
const url = new URL('https://example.com');
// ---cut---
goto(url, {
	shallow: true,
	reset: true
});
```

> [!NOTE]
> `page.state`는 JavaScript가 로드된 뒤에야 채워지므로 UI가 깜빡일 수 있습니다. 신중하게 사용하세요.

## 라우트의 데이터 불러오기 <!-- Loading data for a route -->

얕은 라우팅을 할 때 현재 페이지 안에 다른 `+page.svelte`를 렌더링하고 싶을 수 있습니다. 예를 들어 사진 썸네일을 클릭하면 사진 페이지로 이동하지 않고 상세 보기를 띄울 수 있습니다.

이렇게 하려면 그 `+page.svelte`가 기대하는 데이터를 불러와야 합니다. 편리한 방법은 `<a>` 요소의 `click` 핸들러 안에서 [`preloadData`]($app-navigation#preloadData)를 사용하는 것입니다. 요소(또는 부모 요소)가 [`data-sveltekit-preload-data`](link-options#data-sveltekit-preload-data)를 사용한다면 데이터는 이미 요청된 상태이며, `preloadData`는 그 요청을 재사용합니다.

```svelte
<!--- file: src/routes/photos/+page.svelte --->
<script>
	import { preloadData, goto } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';
	import PhotoPage from './[id]/+page.svelte';

	let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
	<a
		href="/photos/{thumbnail.id}"
		onclick={async (e) => {
			if (innerWidth < 640        // bail if the screen is too small
				|| e.shiftKey             // or the link is opened in a new window
				|| e.metaKey || e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
				// should also consider clicking with a mouse scroll wheel
			) return;

			// prevent navigation
			e.preventDefault();

			const { href } = e.currentTarget;

			// run `load` functions (or rather, get the result of the `load` functions
			// that are already running because of `data-sveltekit-preload-data`)
			const result = await preloadData(href);

			if (result.type === 'loaded' && result.status === 200) {
				goto(href, { shallow: true, state: { selected: result.data } });
			} else {
				// something bad happened! try navigating
				goto(href);
			}
		}}
	>
		<img alt={thumbnail.alt} src={thumbnail.src} />
	</a>
{/each}

{#if page.state.selected}
	<Modal onclose={() => history.back()}>
		<!-- pass page data to the +page.svelte component,
		     just like SvelteKit would on navigation -->
		<PhotoPage data={page.state.selected} />
	</Modal>
{/if}
```

## 주의 사항 <!-- Caveats -->

얕은 라우팅에는 JavaScript가 필요합니다. 사용할 때 주의하고, JavaScript를 사용할 수 없는 경우를 위한 합리적인 대체 동작을 고민해 보세요.

서버는 기록 상태를 알지 못합니다. 따라서 SSR 중에 `page.state`는 빈 객체이며, 새로고침하면 이전의 `page.shallow.url`이 있을 경우 그곳으로 바로 이동합니다. 다시 말해 새로고침 전에 `page.shallow.url.pathname`이 `/photos/123`이었다면, 새로고침 후에는 `persistState` 옵션과 관계없이 `page.url.pathname`은 `/photos/123`이 되고 `page.shallow`는 `null`이 됩니다. (이는 클라이언트 앱이 시작될 때 UI가 깜빡이지 않도록 초기 페이지 로드에만 적용됩니다.)
