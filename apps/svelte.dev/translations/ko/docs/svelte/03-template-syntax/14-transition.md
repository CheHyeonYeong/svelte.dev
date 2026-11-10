---
title: transition:
tags: transitions
---

*트랜지션*은 상태 변화로 인해 요소가 DOM에 들어오거나 DOM에서 나갈 때 발생합니다.

블록(예: `{#if ...}` 블록)이 트랜지션으로 사라지는 동안에는 자체 트랜지션이 없는 요소까지 포함해 그 안의 모든 요소가 블록 안의 모든 트랜지션이 끝날 때까지 DOM에 남아 있습니다.

`transition:` 지시어는 *양방향* 트랜지션을 나타냅니다. 즉 트랜지션이 진행되는 도중에도 부드럽게 되돌릴 수 있습니다.

```svelte
<script>
	+++import { fade } from 'svelte/transition';+++

	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>toggle</button>

{#if visible}
	<div +++transition:fade+++>fades in and out</div>
{/if}
```

## 로컬 vs 글로벌 <!-- Local vs global -->

트랜지션은 기본적으로 로컬입니다. 로컬 트랜지션은 자신이 속한 블록이 생성되거나 제거될 때만 재생되며, 부모 블록이 생성되거나 제거될 때는 재생되지 *않습니다*.

```svelte
{#if x}
	{#if y}
		<p transition:fade>fades in and out only when y changes</p>

		<p transition:fade|global>fades in and out when x or y change</p>
	{/if}
{/if}
```

## 내장 트랜지션 <!-- Built-in transitions -->

여러 내장 트랜지션을 [`svelte/transition`](svelte-transition) 모듈에서 import할 수 있습니다.

## 트랜지션 매개변수 <!-- Transition parameters -->

트랜지션에는 매개변수를 넘길 수 있습니다.

(이중 `{{curlies}}`는 특별한 문법이 아닙니다. 표현식 태그 안에 객체 리터럴을 쓴 것입니다.)

```svelte
{#if visible}
	<div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
{/if}
```

## 접근성 <!-- Accessibility -->

트랜지션은 CSS가 아니라 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)로 동작합니다. 따라서 `transition-duration`과 `animation-duration`을 0으로 만드는 전역 `@media (prefers-reduced-motion: reduce)` 규칙은 트랜지션에 영향을 주지 않습니다.

움직임 줄이기를 요청한 기기에서는 [`prefersReducedMotion`](svelte-motion#prefersReducedMotion)을 사용해 트랜지션을 알맞게 조정하거나 완전히 끄세요.

## 커스텀 트랜지션 함수 <!-- Custom transition functions -->

```js
/// copy: false
// @noErrors
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

트랜지션에 커스텀 함수를 사용할 수 있습니다. 반환된 객체에 `css` 함수가 있으면 Svelte는 [웹 애니메이션](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)용 키프레임을 생성합니다.

`css`에 전달되는 `t` 인수는 `easing` 함수가 적용된 뒤의 `0`과 `1` 사이 값입니다. *in* 트랜지션은 `0`에서 `1`로, *out* 트랜지션은 `1`에서 `0`으로 진행합니다. 다시 말해 `1`은 트랜지션이 적용되지 않은 것처럼 보이는 요소 본래의 상태입니다. `u` 인수는 `1 - t`와 같습니다.

이 함수는 트랜지션이 시작되기 *전에* 서로 다른 `t`와 `u` 인수로 반복해서 호출됩니다.

```svelte
<!--- file: App.svelte --->
<script>
	import { elasticOut } from 'svelte/easing';

	/** @type {boolean} */
	export let visible;

	/**
	 * @param {HTMLElement} node
	 * @param {{ delay?: number, duration?: number, easing?: (t: number) => number }} params
	 */
	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}
```

커스텀 트랜지션 함수는 `tick` 함수를 반환할 수도 있습니다. 이 함수는 트랜지션이 진행되는 *동안* 같은 `t`와 `u` 인수로 호출됩니다.

> [!NOTE] `tick` 대신 `css`를 쓸 수 있다면 `css`를 쓰세요. 웹 애니메이션은 메인 스레드 밖에서 실행될 수 있어서 느린 기기에서 버벅임을 막아 줍니다.

```svelte
<!--- file: App.svelte --->
<script>
	export let visible = false;

	/**
	 * @param {HTMLElement} node
	 * @param {{ speed?: number }} params
	 */
	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

트랜지션이 트랜지션 객체 대신 함수를 반환하면, 그 함수는 다음 마이크로태스크에서 호출됩니다. 덕분에 여러 트랜지션이 서로 맞춰 움직일 수 있어 [크로스페이드 효과](/tutorial/deferred-transitions)를 구현할 수 있습니다.

트랜지션 함수는 세 번째 인수로 트랜지션에 대한 정보를 담은 `options`도 받습니다.

`options` 객체에서 사용할 수 있는 값은 다음과 같습니다:

- `direction` - 트랜지션 종류에 따라 `in`, `out`, `both` 중 하나

## 트랜지션 이벤트 <!-- Transition events -->

트랜지션이 있는 요소는 표준 DOM 이벤트 외에도 다음 이벤트를 발생시킵니다:

- `introstart`
- `introend`
- `outrostart`
- `outroend`

```svelte
{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		onintrostart={() => (status = 'intro started')}
		onoutrostart={() => (status = 'outro started')}
		onintroend={() => (status = 'intro ended')}
		onoutroend={() => (status = 'outro ended')}
	>
		Flies in and out
	</p>
{/if}
```
