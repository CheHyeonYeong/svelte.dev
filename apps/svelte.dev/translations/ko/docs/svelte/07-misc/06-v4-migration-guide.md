---
title: Svelte 4 마이그레이션 가이드
---

이 마이그레이션 가이드는 Svelte 3에서 4로 마이그레이션하는 방법을 개괄합니다. 각 변경 사항에 대한 자세한 내용은 링크된 PR을 참고하세요. 마이그레이션 스크립트를 사용하면 이 중 일부를 자동으로 마이그레이션할 수 있습니다: `npx svelte-migrate@latest svelte-4`

라이브러리 작성자라면 Svelte 4만 지원할지, Svelte 3도 함께 지원할 수 있을지 고려해 보세요. 호환성이 깨지는 변경 대부분은 많은 사람에게 영향을 주지 않으므로, 어렵지 않게 둘 다 지원할 수 있을 것입니다. `peerDependencies`의 버전 범위를 업데이트하는 것도 잊지 마세요.

## 최소 버전 요구 사항 <!-- Minimum version requirements -->

- Node 16 이상으로 업그레이드하세요. 이전 버전은 더 이상 지원하지 않습니다. ([#8566](https://github.com/sveltejs/svelte/issues/8566))
- SvelteKit을 사용한다면 1.20.4 이상으로 업그레이드하세요 ([sveltejs/kit#10172](https://github.com/sveltejs/kit/pull/10172))
- SvelteKit 없이 Vite를 사용한다면 `vite-plugin-svelte` 2.4.1 이상으로 업그레이드하세요 ([#8516](https://github.com/sveltejs/svelte/issues/8516))
- webpack을 사용한다면 webpack 5 이상, `svelte-loader` 3.1.8 이상으로 업그레이드하세요. 이전 버전은 더 이상 지원하지 않습니다. ([#8515](https://github.com/sveltejs/svelte/issues/8515), [198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- Rollup을 사용한다면 `rollup-plugin-svelte` 7.1.5 이상으로 업그레이드하세요 ([198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- TypeScript를 사용한다면 TypeScript 5 이상으로 업그레이드하세요. 더 낮은 버전도 동작할 수 있지만 보장하지는 않습니다. ([#8488](https://github.com/sveltejs/svelte/issues/8488))

## 번들러의 브라우저 조건 <!-- Browser conditions for bundlers -->

이제 번들러는 브라우저용 프런트엔드 번들을 빌드할 때 `browser` 조건을 지정해야 합니다. SvelteKit과 Vite는 이를 자동으로 처리해 줍니다. 다른 번들러를 사용한다면 `onMount` 같은 생명주기 콜백이 호출되지 않는 현상을 볼 수 있으며, 모듈 해석 설정을 업데이트해야 합니다.
- Rollup에서는 `@rollup/plugin-node-resolve` 플러그인의 옵션에 `browser: true`를 설정하면 됩니다. 자세한 내용은 [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte/#usage) 문서를 참고하세요
- webpack에서는 `conditionNames` 배열에 `"browser"`를 추가하면 됩니다. `alias` 설정을 해 두었다면 그것도 업데이트해야 할 수 있습니다. 자세한 내용은 [`svelte-loader`](https://github.com/sveltejs/svelte-loader#usage) 문서를 참고하세요

([#8516](https://github.com/sveltejs/svelte/issues/8516))

## CJS 관련 출력 제거 <!-- Removal of CJS related output -->

Svelte는 더 이상 컴파일러 출력으로 CommonJS(CJS) 형식을 지원하지 않으며, `svelte/register` 훅과 CJS 런타임 버전도 제거했습니다. CJS 출력 형식을 계속 써야 한다면, 빌드 후 단계에서 번들러로 Svelte의 ESM 출력을 CJS로 변환하는 방법을 고려하세요. ([#8613](https://github.com/sveltejs/svelte/issues/8613))

## Svelte 함수의 더 엄격한 타입 <!-- Stricter types for Svelte functions -->

`createEventDispatcher`, `Action`, `ActionReturn`, `onMount`의 타입이 더 엄격해졌습니다:

- 이제 `createEventDispatcher`에서 페이로드가 선택적인지, 필수인지, 없는지를 지정할 수 있으며, 호출하는 곳도 그에 맞게 검사합니다 ([#7224](https://github.com/sveltejs/svelte/issues/7224))

```ts
// @errors: 2554 2345
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{
	optional: number | null;
	required: string;
	noArgument: null;
}>();

// Svelte version 3:
dispatch('optional');
dispatch('required'); // I can still omit the detail argument
dispatch('noArgument', 'surprise'); // I can still add a detail argument

// Svelte version 4 using TypeScript strict mode:
dispatch('optional');
dispatch('required'); // error, missing argument
dispatch('noArgument', 'surprise'); // error, cannot pass an argument
```

- 이제 `Action`과 `ActionReturn`의 기본 매개변수 타입은 `undefined`입니다. 따라서 액션이 매개변수를 받는다고 지정하려면 제네릭에 타입을 지정해야 합니다. 마이그레이션 스크립트가 이를 자동으로 마이그레이션합니다 ([#7442](https://github.com/sveltejs/svelte/pull/7442))

```ts
// @noErrors
---const action: Action = (node, params) => { ... } // this is now an error if you use params in any way---
+++const action: Action<HTMLElement, string> = (node, params) => { ... } // params is of type string+++
```

- 이제 `onMount`에서 함수를 비동기로 반환하면 타입 에러가 표시됩니다. 이는 파괴 시 콜백이 호출되기를 기대하는 코드의 버그일 가능성이 높기 때문입니다. 콜백은 동기적으로 반환된 함수에 대해서만 호출됩니다 ([#8136](https://github.com/sveltejs/svelte/issues/8136))

```js
// @noErrors
// Example where this change reveals an actual bug
onMount(
---	// someCleanup() not called because function handed to onMount is async
	async () => {
		const something = await foo();---
+++	// someCleanup() is called because function handed to onMount is sync
	() => {
		foo().then(something => {...});
		// ...
		return () => someCleanup();
	}
);
```

## Svelte로 만드는 커스텀 엘리먼트 <!-- Custom Elements with Svelte -->

Svelte로 커스텀 엘리먼트를 만드는 방식이 전면 개편되어 크게 개선되었습니다. `tag` 옵션은 지원 중단(deprecated)되었으며 새로운 `customElement` 옵션으로 대체됩니다:

```svelte
---<svelte:options tag="my-component" />---
+++<svelte:options customElement="my-component" />+++
```

이 변경은 고급 사용 사례를 위해 [더 많은 설정](custom-elements#Component-options)을 할 수 있도록 하기 위한 것입니다. 마이그레이션 스크립트가 코드를 자동으로 수정해 줍니다. 프로퍼티의 업데이트 타이밍도 약간 바뀌었습니다. ([#8457](https://github.com/sveltejs/svelte/issues/8457))

## SvelteComponentTyped 지원 중단 <!-- SvelteComponentTyped is deprecated -->

이제 `SvelteComponent`가 모든 타입 기능을 갖추었으므로 `SvelteComponentTyped`는 지원 중단되었습니다. `SvelteComponentTyped`를 모두 `SvelteComponent`로 바꾸세요.

```js
---import { SvelteComponentTyped } from 'svelte';---
+++import { SvelteComponent } from 'svelte';+++

---export class Foo extends SvelteComponentTyped<{ aProp: string }> {}---
+++export class Foo extends SvelteComponent<{ aProp: string }> {}+++
```

이전에 `SvelteComponent`를 컴포넌트 인스턴스 타입으로 사용했다면 이제 다소 알기 어려운 타입 에러를 볼 수 있는데, `: typeof SvelteComponent`를 `: typeof SvelteComponent<any>`로 바꾸면 해결됩니다.

```svelte
<script>
	import ComponentA from './ComponentA.svelte';
	import ComponentB from './ComponentB.svelte';
	import { SvelteComponent } from 'svelte';

	let component: typeof SvelteComponent+++<any>+++;

	function choseRandomly() {
		component = Math.random() > 0.5 ? ComponentA : ComponentB;
	}
</script>

<button on:click={choseRandomly}>random</button>
<svelte:element this={component} />
```

마이그레이션 스크립트가 두 가지 모두 자동으로 처리해 줍니다. ([#8512](https://github.com/sveltejs/svelte/issues/8512))

## 트랜지션은 기본적으로 로컬 <!-- Transitions are local by default -->

페이지 내비게이션과 관련한 혼란을 막기 위해 이제 트랜지션은 기본적으로 로컬입니다. "로컬"이란 트랜지션이 중첩된 제어 흐름 블록(`each/if/await/key`) 안에 있을 때, 바로 위 부모 블록이 아니라 그보다 위에 있는 블록이 생성/파괴되면 트랜지션이 재생되지 않는다는 뜻입니다. 다음 예에서 `slide` 인트로 애니메이션은 `success`가 `false`에서 `true`로 바뀔 때만 재생되고, `show`가 `false`에서 `true`로 바뀔 때는 재생되지 *않습니다*:

```svelte
{#if show}
	...
	{#if success}
		<p in:slide>Success</p>
	{/each}
{/if}
```

트랜지션을 전역으로 만들려면 `|global` 수식어를 추가하세요. 그러면 위에 있는 *어떤* 제어 흐름 블록이 생성/파괴되더라도 트랜지션이 재생됩니다. 마이그레이션 스크립트가 이를 자동으로 처리해 줍니다. ([#6686](https://github.com/sveltejs/svelte/issues/6686))

## 기본 슬롯 바인딩 <!-- Default slot bindings -->

기본 슬롯 바인딩은 더 이상 이름 있는 슬롯에 노출되지 않으며, 그 반대도 마찬가지입니다:

```svelte
<script>
	import Nested from './Nested.svelte';
</script>

<Nested let:count>
	<p>
		count in default slot — is available: {count}
	</p>
	<p slot="bar">
		count in bar slot — is not available: {count}
	</p>
</Nested>
```

예를 들어 기본 슬롯은 리스트에서 오고 이름 있는 슬롯은 그렇지 않은 경우 동작이 정의되어 있지 않았으므로, 이 변경으로 슬롯 바인딩이 더 일관되게 동작합니다. ([#6049](https://github.com/sveltejs/svelte/issues/6049))

## 전처리기 <!-- Preprocessors -->

전처리기를 적용하는 순서가 바뀌었습니다. 이제 전처리기는 순서대로 실행되며, 한 그룹 안에서는 markup, script, style 순서로 실행됩니다.

```js
// @errors: 2304
import { preprocess } from 'svelte/compiler';

const { code } = await preprocess(
	source,
	[
		{
			markup: () => {
				console.log('markup-1');
			},
			script: () => {
				console.log('script-1');
			},
			style: () => {
				console.log('style-1');
			}
		},
		{
			markup: () => {
				console.log('markup-2');
			},
			script: () => {
				console.log('script-2');
			},
			style: () => {
				console.log('style-2');
			}
		}
	],
	{
		filename: 'App.svelte'
	}
);

// Svelte 3 logs:
// markup-1
// markup-2
// script-1
// script-2
// style-1
// style-2

// Svelte 4 logs:
// markup-1
// script-1
// style-1
// markup-2
// script-2
// style-2
```

예를 들어 `MDsveX`를 사용한다면 이 변경의 영향을 받을 수 있습니다. 이 경우 `MDsveX`가 script나 style 전처리기보다 앞에 오도록 해야 합니다.

```js
// @noErrors
preprocess: [
---	vitePreprocess(),
	mdsvex(mdsvexConfig)---
+++	mdsvex(mdsvexConfig),
	vitePreprocess()+++
]
```

또한 각 전처리기에는 이름이 있어야 합니다. ([#8618](https://github.com/sveltejs/svelte/issues/8618))

## 새 eslint 패키지 <!-- New eslint package -->

`eslint-plugin-svelte3`는 지원 중단되었습니다. Svelte 4에서도 여전히 동작할 수 있지만 보장하지는 않습니다. 새 패키지인 [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)로 전환하기를 권장합니다. 마이그레이션 방법은 [이 GitHub 글](https://github.com/sveltejs/kit/issues/10242#issuecomment-1610798405)을 참고하세요. 또는 `npm create svelte@latest`로 새 프로젝트를 만들고 eslint(필요하다면 TypeScript도) 옵션을 선택한 다음, 관련 파일을 기존 프로젝트로 복사해도 됩니다.

## 그 밖의 호환성이 깨지는 변경 <!-- Other breaking changes -->

- 이제 아웃트로 중인 요소에 `inert` 속성이 적용되어, 보조 기술에서 보이지 않게 하고 상호작용을 막습니다. ([#8628](https://github.com/sveltejs/svelte/pull/8628))
- 이제 런타임이 `classList.toggle(name, boolean)`을 사용하므로 아주 오래된 브라우저에서는 동작하지 않을 수 있습니다. 이런 브라우저를 지원해야 한다면 [폴리필](https://github.com/eligrey/classList.js) 사용을 고려하세요. ([#8629](https://github.com/sveltejs/svelte/issues/8629))
- 이제 런타임이 `CustomEvent` 생성자를 사용하므로 아주 오래된 브라우저에서는 동작하지 않을 수 있습니다. 이런 브라우저를 지원해야 한다면 [폴리필](https://github.com/theftprevention/event-constructor-polyfill/tree/master) 사용을 고려하세요. ([#8775](https://github.com/sveltejs/svelte/pull/8775))
- `svelte/store`의 `StartStopNotifier` 인터페이스(`writable` 등의 create 함수에 전달됨)를 사용해 스토어를 처음부터 직접 구현하는 경우, 이제 set 함수뿐 아니라 update 함수도 전달해야 합니다. 스토어를 사용하기만 하거나 기존 Svelte 스토어로 스토어를 만드는 경우에는 영향이 없습니다. ([#6750](https://github.com/sveltejs/svelte/issues/6750))
- 이제 `derived`에 스토어 대신 falsy 값을 넘기면 에러를 던집니다. ([#7947](https://github.com/sveltejs/svelte/issues/7947))
- 공개 API가 아닌 내부 메서드의 사용을 더욱 막기 위해 `svelte/internal`의 타입 정의를 제거했습니다. 이 메서드 대부분은 Svelte 5에서 바뀔 가능성이 큽니다
- 이제 DOM 노드 제거가 일괄 처리되어 순서가 약간 바뀌었습니다. 이 요소에 `MutationObserver`를 사용하고 있다면 발생하는 이벤트의 순서가 달라질 수 있습니다 ([#8763](https://github.com/sveltejs/svelte/pull/8763))
- 이전에 `svelte.JSX` 네임스페이스로 전역 타입 정의를 확장했다면 `svelteHTML` 네임스페이스를 사용하도록 마이그레이션해야 합니다. 마찬가지로 `svelte.JSX` 네임스페이스의 타입 정의를 사용했다면 `svelte/elements`의 타입을 사용하도록 마이그레이션해야 합니다. 무엇을 해야 하는지에 대한 자세한 내용은 [여기](https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#im-getting-deprecation-warnings-for-sveltejsx--i-want-to-migrate-to-the-new-typings)에서 확인할 수 있습니다
