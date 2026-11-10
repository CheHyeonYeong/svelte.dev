---
title: animate:
---

애니메이션은 [키 있는 each 블록](each#Keyed-each-blocks)의 내용 순서가 바뀔 때 발생합니다. 요소가 추가되거나 제거될 때는 실행되지 않고, each 블록 안에 있는 기존 데이터 항목의 인덱스가 바뀔 때만 실행됩니다. animate 지시어는 키 있는 each 블록의 *직계* 자식 요소에 있어야 합니다.

애니메이션에는 Svelte의 [내장 애니메이션 함수](svelte-animate)나 [커스텀 애니메이션 함수](#Custom-animation-functions)를 사용할 수 있습니다.

```svelte
<!-- When `list` is reordered the animation will run -->
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

## 애니메이션 매개변수 <!-- Animation Parameters -->

액션이나 트랜지션과 마찬가지로 애니메이션에도 매개변수를 넘길 수 있습니다.

(이중 `{{curlies}}`는 특별한 문법이 아닙니다. 표현식 태그 안에 객체 리터럴을 쓴 것입니다.)

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## 커스텀 애니메이션 함수 <!-- Custom animation functions -->

```js
/// copy: false
// @noErrors
animation = (node: HTMLElement, { from: DOMRect, to: DOMRect } , params: any) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

애니메이션에는 `node`, `animation` 객체, 그리고 `parameters`를 인수로 받는 커스텀 함수를 사용할 수 있습니다. `animation` 매개변수는 `from`과 `to` 속성을 가진 객체로, 각 속성에는 요소의 `start`와 `end` 위치에서의 기하 정보를 나타내는 [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#Properties)가 들어 있습니다. `from` 속성은 시작 위치에 있는 요소의 DOMRect이고, `to` 속성은 리스트의 순서가 바뀌고 DOM이 업데이트된 뒤 최종 위치에 있는 요소의 DOMRect입니다.

반환된 객체에 `css` 메서드가 있으면 Svelte는 요소에서 재생되는 [웹 애니메이션](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)을 만듭니다.

`css`에 전달되는 `t` 인수는 `easing` 함수가 적용된 뒤 `0`에서 `1`까지 변하는 값입니다. `u` 인수는 `1 - t`와 같습니다.

이 함수는 애니메이션이 시작되기 *전에* 서로 다른 `t`와 `u` 인수로 반복해서 호출됩니다.

<!-- TODO: Types -->

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

커스텀 애니메이션 함수는 `tick` 함수를 반환할 수도 있습니다. 이 함수는 애니메이션이 진행되는 *동안* 같은 `t`와 `u` 인수로 호출됩니다.

> [!NOTE] `tick` 대신 `css`를 쓸 수 있다면 `css`를 쓰세요. 웹 애니메이션은 메인 스레드 밖에서 실행될 수 있어서 느린 기기에서 버벅임을 막아 줍니다.

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```
