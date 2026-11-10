---
title: await
---

Svelte 5.36부터는 이전에 쓸 수 없었던 세 곳에서 컴포넌트 안에 `await` 키워드를 사용할 수 있습니다:

- 컴포넌트 `<script>`의 최상위
- `$derived(...)` 선언 안
- 마크업 안

이 기능은 현재 실험적 기능이므로, Svelte를 [설정하는](/docs/kit/configuration) 곳(보통 `svelte.config.js`)에 `experimental.async` 옵션을 추가해 직접 활성화해야 합니다:

```js
/// file: svelte.config.js
export default {
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

이 실험적 플래그는 Svelte 6에서 제거될 예정입니다.

## 동기화된 업데이트 <!-- Synchronized updates -->

`await` 표현식이 특정 상태에 의존하면, UI가 일관되지 않은 상태로 남지 않도록 비동기 작업이 끝날 때까지 그 상태의 변경이 UI에 반영되지 않습니다. 다시 말해 다음과 같은 예시에서...

<!-- codeblock:start {"title":"Synchronized updates"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let a = $state(1);
	let b = $state(2);

	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500)); // artificial delay
		return a + b;
	}
</script>

<input type="number" bind:value={a}>
<input type="number" bind:value={b}>

<p>{a} + {b} = {await add(a, b)}</p>
```
<!-- codeblock:end -->

...`a`를 증가시켜도 `<p>`의 내용이 곧바로 다음과 같이 바뀌지 *않습니다* —

```html
<p>2 + 2 = 3</p>
```

— 대신 `add(a, b)`가 resolve되면 텍스트가 `2 + 2 = 4`로 바뀝니다.

업데이트는 겹칠 수 있습니다. 앞서 시작된 느린 업데이트가 아직 진행 중이어도 빠른 업데이트는 UI에 반영됩니다.

## 동시성 <!-- Concurrency -->

Svelte는 가능한 한 많은 비동기 작업을 병렬로 처리합니다. 예를 들어 마크업에 `await` 표현식이 두 개 있다면...

```svelte
<p>{await one(x)}</p>
<p>{await two(y)}</p>
```

...두 함수는 *눈으로 보기에는* 순차적이지만 서로 독립적인 표현식이므로 동시에 실행됩니다.

`<script>` 안이나 async 함수 안에서 순차적으로 쓰인 `await` 표현식에는 이 내용이 적용되지 않습니다. 이들은 여느 비동기 JavaScript처럼 실행됩니다. 단, 서로 독립적인 `$derived` 표현식은 처음 생성될 때는 순차적으로 실행되더라도 이후에는 각자 독립적으로 업데이트됩니다:

```js
/** @param {number} x */
async function one(x) { return x; }
/** @param {number} y */
async function two(y) { return y; }
let x = $state(1);
let y = $state(2);
// ---cut---
// `b` will not be created until `a` has resolved,
// but once created they will update independently
// even if `x` and `y` update simultaneously
let a = $derived(await one(x));
let b = $derived(await two(y));
```

> [!NOTE] 이런 코드를 작성하면 Svelte가 [`await_waterfall`](runtime-warnings#Client-warnings-await_waterfall) 경고를 보여 줄 것입니다

## 로딩 상태 표시하기 <!-- Indicating loading states -->

플레이스홀더 UI를 렌더링하려면 콘텐츠를 [`pending`](svelte-boundary#Properties-pending) 스니펫이 있는 `<svelte:boundary>`로 감싸면 됩니다. 이 스니펫은 바운더리가 처음 생성될 때 표시되고, 이후의 업데이트에서는 표시되지 않습니다. 이후의 업데이트는 전역적으로 조율되기 때문입니다.

바운더리의 콘텐츠가 처음으로 resolve되어 `pending` 스니펫을 대체하고 나면, 이후의 비동기 작업은 [`$effect.pending()`]($effect#$effect.pending)으로 감지할 수 있습니다. 예를 들어 폼 필드 옆에 "입력값을 비동기로 검증하는 중" 스피너를 보여 줄 때 이것을 사용합니다.

[`settled()`](svelte#settled)를 사용하면 현재 업데이트가 완료될 때 resolve되는 프로미스를 얻을 수도 있습니다:

```js
let color = 'red';
let answer = -1;
let updating = false;
// ---cut---
import { tick, settled } from 'svelte';

async function onclick() {
	updating = true;

	// without this, the change to `updating` will be
	// grouped with the other changes, meaning it
	// won't be reflected in the UI
	await tick();

	color = 'octarine';
	answer = 42;

	await settled();

	// any updates affected by `color` or `answer`
	// have now been applied
	updating = false;
}
```

## 에러 처리 <!-- Error handling -->

`await` 표현식에서 발생한 에러는 가장 가까운 [에러 바운더리](svelte-boundary)로 전파됩니다.

## 서버 사이드 렌더링 <!-- Server-side rendering -->

Svelte는 `render(...)` API로 비동기 서버 사이드 렌더링(SSR)을 지원합니다. 사용하려면 반환값을 await하기만 하면 됩니다:

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = +++await+++ render(App);
```

> [!NOTE] SvelteKit 같은 프레임워크를 사용한다면 이 작업은 프레임워크가 대신 해 줍니다.

SSR 중에 `pending` 스니펫이 있는 `<svelte:boundary>`를 만나면, 그 스니펫이 렌더링되고 나머지 콘텐츠는 무시됩니다. `pending` 스니펫이 있는 바운더리 바깥에서 만나는 모든 `await` 표현식은 `await render(...)`가 반환되기 전에 resolve되어 그 내용이 렌더링됩니다.

> [!NOTE] 앞으로 백그라운드에서 콘텐츠를 렌더링하는 스트리밍 구현을 추가할 계획입니다.

## 포크 <!-- Forking -->

5.42에 추가된 [`fork(...)`](svelte#fork) API를 사용하면 가까운 미래에 일어날 것으로 *예상되는* `await` 표현식을 미리 실행할 수 있습니다. 이 기능은 주로 SvelteKit 같은 프레임워크가 (예를 들어) 사용자가 이동하려는 의도를 보일 때 프리로드를 구현하기 위한 것입니다.

```svelte
<script>
	import { fork } from 'svelte';
	import Menu from './Menu.svelte';

	let open = $state(false);

	/** @type {import('svelte').Fork | null} */
	let pending = null;

	function preload() {
		pending ??= fork(() => {
			open = true;
		});
	}

	function discard() {
		pending?.discard();
		pending = null;
	}
</script>

<button
	onfocusin={preload}
	onfocusout={discard}
	onpointerenter={preload}
	onpointerleave={discard}
	onclick={() => {
		pending?.commit();
		pending = null;

		// in case `pending` didn't exist
		// (if it did, this is a no-op)
		open = true;
	}}
>open menu</button>

{#if open}
	<!-- any async work inside this component will start
	     as soon as the fork is created -->
	<Menu onclose={() => open = false} />
{/if}
```

## 주의사항 <!-- Caveats -->

실험적 기능이므로 `await`의 처리 방식(그리고 `$effect.pending()` 같은 관련 API)의 세부 사항은 semver 메이저 릴리스가 아니더라도 호환성이 깨지는 변경이 생길 수 있습니다. 다만 그런 변경은 최소한으로 유지하려고 합니다.

## 호환성이 깨지는 변경 <!-- Breaking changes -->

`experimental.async` 옵션이 `true`이면 이펙트가 실행되는 순서가 조금 달라집니다. 구체적으로, `{#if ...}`나 `{#each ...}` 같은 *블록* 이펙트가 같은 컴포넌트 안의 `$effect.pre`나 `beforeUpdate`보다 먼저 실행됩니다. 그래서 [아주 드문 상황](/playground/untitled?#H4sIAAAAAAAAE22R3VLDIBCFX2WLvUhnTHsf0zre-Q7WmfwtFV2BgU1rJ5N3F0jaOuoVcPbw7VkYhK4_URTiGYkMnIyjDjLsFGO3EvdCKkIvipdB8NlGXxSCPt96snbtj0gctab2-J_eGs2oOWBE6VunLO_2es-EDKZ5x5ZhC0vPNWM2gHXGouNzAex6hHH1cPHil_Lsb95YT9VQX6KUAbS2DrNsBdsdDFHe8_XSYjH1SrhELTe3MLpsemajweiWVPuxHSbKNd-8eQTdE0EBf4OOaSg2hwNhhE_ABB_ulJzjj9FULvIcqgm5vnAqUB7wWFMfhuugQWkcAr8hVD-mq8D12kOep24J_IszToOXdveGDsuNnZwbJUNlXsKnhJdhUcTo42s41YpOSneikDV5HL8BktM6yRcCAAA=)에서는 더 이상 존재하지 않아야 할 블록이 업데이트될 수 있습니다. 하지만 이는 이펙트 안에서 상태를 업데이트하는 경우에만 일어나며, [그런 코드는 피해야 합니다]($effect#When-not-to-use-$effect).
