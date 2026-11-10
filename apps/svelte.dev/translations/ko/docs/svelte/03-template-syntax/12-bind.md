---
title: bind:
tags: template-bind
---

데이터는 보통 부모에서 자식으로, 아래로 흐릅니다. `bind:` 지시어를 사용하면 데이터가 반대 방향, 즉 자식에서 부모로 흐르게 할 수 있습니다.

일반적인 문법은 `bind:property={expression}`이며, 여기서 `expression`은 [*lvalue*](https://press.rebus.community/programmingfundamentals/chapter/lvalue-and-rvalue/)(즉, 변수나 객체 프로퍼티)입니다. 표현식이 프로퍼티와 이름이 같은 식별자라면 표현식을 생략할 수 있습니다. 즉, 다음 두 코드는 같습니다:

<!-- prettier-ignore -->
```svelte
<input bind:value={value} />
<input bind:value />
```


Svelte는 바인딩된 값을 갱신하는 이벤트 리스너를 만듭니다. 요소에 같은 이벤트에 대한 리스너가 이미 있다면, 그 리스너는 바인딩된 값이 갱신되기 전에 실행됩니다.

대부분의 바인딩은 *양방향*입니다. 즉, 값이 바뀌면 요소에 반영되고 그 반대도 마찬가지입니다. 일부 바인딩은 *읽기 전용*이어서 값을 바꿔도 요소에 아무런 영향이 없습니다.

## 함수 바인딩 <!-- Function bindings -->

`get`과 `set`이 함수인 `bind:property={get, set}`을 사용할 수도 있으며, 이를 통해 유효성 검사와 변환을 수행할 수 있습니다:

```svelte
<input bind:value={
	() => value,
	(v) => value = v.toLowerCase()}
/>
```

[크기 바인딩](#Dimensions) 같은 읽기 전용 바인딩의 경우 `get` 값은 `null`이어야 합니다:

```svelte
<div
	bind:clientWidth={null, redraw}
	bind:clientHeight={null, redraw}
>...</div>
```

> [!NOTE]
> 함수 바인딩은 Svelte 5.9.0 이상에서 사용할 수 있습니다.

## `<input bind:value>`

`<input>` 요소에 `bind:value` 지시어를 쓰면 입력의 `value` 프로퍼티가 바인딩됩니다:

<!-- prettier-ignore -->
```svelte
<script>
	let message = $state('hello');
</script>

<input bind:value={message} />
<p>{message}</p>
```

숫자 입력(`type="number"` 또는 `type="range"`)의 경우 값은 숫자로 강제 변환됩니다:

<!-- codeblock:start {"title":"Numeric bindings"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let a = $state(1);
	let b = $state(2);
</script>

<label>
	<input type="number" bind:value={a} min="0" max="10" />
	<input type="range" bind:value={a} min="0" max="10" />
</label>

<label>
	<input type="number" bind:value={b} min="0" max="10" />
	<input type="range" bind:value={b} min="0" max="10" />
</label>

<p>{a} + {b} = {a + b}</p>
```
<!-- codeblock:end -->

입력이 비어 있거나 (`type="number"`의 경우) 유효하지 않으면 값은 `undefined`입니다.

5.6.0부터 `<input>`에 `defaultValue`가 있고 폼의 일부라면, 폼이 리셋될 때 빈 문자열 대신 그 값으로 되돌아갑니다. 단, 첫 렌더링에서는 바인딩 값이 `null`이나 `undefined`가 아닌 한 바인딩 값이 우선합니다.

```svelte
<script>
	let value = $state('');
</script>

<form>
	<input bind:value defaultValue="not the empty string">
	<input type="reset" value="Reset">
</form>
```

> [!NOTE]
> 리셋 버튼은 꼭 필요할 때만 쓰고, 사용자가 폼을 제출하려다 실수로 누르지 않도록 하세요.

## `<input bind:checked>`

체크박스 입력은 `bind:checked`로 바인딩할 수 있습니다:

```svelte
<label>
	<input type="checkbox" bind:checked={accepted} />
	Accept terms and conditions
</label>
```

5.6.0부터 `<input>`에 `defaultChecked` 속성이 있고 폼의 일부라면, 폼이 리셋될 때 `false` 대신 그 값으로 되돌아갑니다. 단, 첫 렌더링에서는 바인딩 값이 `null`이나 `undefined`가 아닌 한 바인딩 값이 우선합니다.

```svelte
<script>
	let checked = $state(true);
</script>

<form>
	<input type="checkbox" bind:checked defaultChecked={true}>
	<input type="reset" value="Reset">
</form>
```

> [!NOTE] 라디오 입력에는 `bind:checked` 대신 `bind:group`을 사용하세요.

## `<input bind:indeterminate>`

체크박스는 체크 여부와 별개로 [indeterminate](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate)(불확정) 상태가 될 수 있습니다:

```svelte
<script>
	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<form>
	<input type="checkbox" bind:checked bind:indeterminate>

	{#if indeterminate}
		waiting...
	{:else if checked}
		checked
	{:else}
		unchecked
	{/if}
</form>
```

## `<input bind:group>`

함께 동작하는 입력들은 `bind:group`을 사용할 수 있습니다:

<!-- codeblock:start {"title":"bind:group"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let tortilla = $state('Plain');

	/** @type {string[]} */
	let fillings = $state([]);
</script>

<h1>Customize your burrito</h1>

<!-- grouped radio inputs are mutually exclusive -->
<label><input type="radio" bind:group={tortilla} value="Plain" /> Plain</label>
<label><input type="radio" bind:group={tortilla} value="Whole wheat" /> Whole wheat</label>
<label><input type="radio" bind:group={tortilla} value="Spinach" /> Spinach</label>

<!-- grouped checkbox inputs populate an array -->
<label><input type="checkbox" bind:group={fillings} value="Rice" /> Rice</label>
<label><input type="checkbox" bind:group={fillings} value="Beans" /> Beans</label>
<label><input type="checkbox" bind:group={fillings} value="Cheese" /> Cheese</label>
<label><input type="checkbox" bind:group={fillings} value="Guac (extra)" /> Guac (extra)</label>

<p>Tortilla: {tortilla}</p>
<p>Fillings: {fillings.join(', ') || 'None'}</p>

<style>
	label {
		display: block;
	}
</style>
```
<!-- codeblock:end -->

> [!NOTE] `bind:group`은 입력들이 같은 Svelte 컴포넌트 안에 있을 때만 동작합니다.

## `<input bind:files>`

`type="file"`인 `<input>` 요소에서는 `bind:files`를 사용해 [선택된 파일의 `FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList)를 얻을 수 있습니다. 프로그래밍 방식으로 파일을 갱신하려면 항상 `FileList` 객체를 사용해야 합니다. 현재 `FileList` 객체는 직접 생성할 수 없으므로, 새 [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) 객체를 만들고 거기서 `files`를 가져와야 합니다.

```svelte
<script>
	let files = $state();

	function clear() {
		files = new DataTransfer().files; // null or undefined does not work
	}
</script>

<label for="avatar">Upload a picture:</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
<button onclick={clear}>clear</button>
```

`FileList` 객체는 수정할 수도 없으므로, 예를 들어 목록에서 파일 하나를 지우고 싶다면 새 `DataTransfer` 객체를 만들고 남길 파일을 추가해야 합니다.

> [!NOTE] 서버 사이드 JS 런타임에서는 `DataTransfer`를 사용할 수 없을 수 있습니다. 컴포넌트가 서버 사이드에서 렌더링될 경우 `files`에 바인딩된 상태를 초기화하지 않은 채로 두면 생길 수 있는 에러를 막을 수 있습니다.

## `<select bind:value>`

`<select>`의 값 바인딩은 선택된 `<option>`의 `value` 프로퍼티에 대응하며, 이 값은 (DOM에서 보통 그렇듯 문자열만이 아니라) 어떤 값이든 될 수 있습니다.

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
	<option value={c}>c</option>
</select>
```

`<select multiple>` 요소는 체크박스 그룹과 비슷하게 동작합니다. 바인딩된 변수는 선택된 각 `<option>`의 `value` 프로퍼티를 항목으로 갖는 배열입니다.

```svelte
<select multiple bind:value={fillings}>
	<option value="Rice">Rice</option>
	<option value="Beans">Beans</option>
	<option value="Cheese">Cheese</option>
	<option value="Guac (extra)">Guac (extra)</option>
</select>
```

`<option>`의 값이 텍스트 내용과 같다면 속성을 생략할 수 있습니다.

```svelte
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
	<option>Guac (extra)</option>
</select>
```

처음에 선택되어 있어야 할 `<option>`(`<select multiple>`이라면 여러 옵션)에 `selected` 속성을 추가해 `<select>`에 기본값을 줄 수 있습니다. `<select>`가 폼의 일부라면 폼이 리셋될 때 그 선택으로 되돌아갑니다. 단, 첫 렌더링에서는 바인딩 값이 `undefined`가 아니면 바인딩 값이 우선합니다.

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b} selected>b</option>
	<option value={c}>c</option>
</select>
```

5.57.0부터 `<select>`에 `defaultValue`가 있고 폼의 일부라면, 폼이 리셋될 때 빈 문자열 대신 그 값으로 되돌아갑니다. 단, 첫 렌더링에서는 바인딩 값이 `null`이나 `undefined`가 아닌 한 바인딩 값이 우선합니다.

```svelte
<form>
	<select bind:value defaultValue="b">
		<option>a</option>
		<option>b</option>
		<option>c</option>
	</select>
	<input type="reset" value="Reset">
</form>
```

## `<audio>`

`<audio>` 요소에는 고유한 바인딩이 있습니다. 양방향 바인딩 다섯 개와...

- [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
- [`playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate)
- [`paused`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused)
- [`volume`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume)
- [`muted`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted)

...읽기 전용 바인딩 여섯 개입니다:

- [`duration`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration)
- [`buffered`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered)
- [`seekable`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable)
- [`seeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event)
- [`ended`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended)
- [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState)
- [`played`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/played)

```svelte
<audio src={clip} bind:duration bind:currentTime bind:paused></audio>
```

## `<video>`

`<video>` 요소에는 [`<audio>`](#audio) 요소와 똑같은 바인딩이 모두 있고, 여기에 읽기 전용 [`videoWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth)와 [`videoHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight) 바인딩이 더해집니다.

## `<img>`

`<img>` 요소에는 읽기 전용 바인딩이 두 개 있습니다:

- [`naturalWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth)
- [`naturalHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight)

## `<details bind:open>`

`<details>` 요소는 `open` 프로퍼티에 대한 바인딩을 지원합니다.

```svelte
<details bind:open={isOpen}>
	<summary>How do you comfort a JavaScript bug?</summary>
	<p>You console it.</p>
</details>
```

## `window`와 `document` <!-- `window` and `document` -->

`window`와 `document`의 프로퍼티에 바인딩하려면 [`<svelte:window>`](svelte-window)와 [`<svelte:document>`](svelte-document)를 참고하세요.

## contenteditable 바인딩 <!-- Contenteditable bindings -->

`contenteditable` 속성이 있는 요소는 다음 바인딩을 지원합니다:

- [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [`innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)
- [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!NOTE] [`innerText`와 `textContent` 사이에는 미묘한 차이](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext)가 있습니다.

<!-- for some reason puts the comment and html on same line -->
<!-- prettier-ignore -->
```svelte
<div contenteditable="true" bind:innerHTML={html}></div>
```

## 크기 <!-- Dimensions -->

보이는 모든 요소에는 `ResizeObserver`로 측정하는 다음 읽기 전용 바인딩이 있습니다:

- [`clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)
- [`clientHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight)
- [`offsetWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
- [`offsetHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)
- [`contentRect`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)
- [`contentBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize)
- [`borderBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize)
- [`devicePixelContentBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize)

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```

> [!NOTE] `display: inline` 요소는 (`<img>`나 `<canvas>`처럼 '고유한' 크기를 가진 요소를 제외하면) 너비나 높이가 없으며 `ResizeObserver`로 관찰할 수 없습니다. 이런 요소는 `display` 스타일을 `inline-block` 같은 다른 값으로 바꿔야 합니다. CSS 변형(transform)은 `ResizeObserver` 콜백을 실행하지 않는다는 점도 알아 두세요.

## bind:this

```svelte
<!--- copy: false --->
bind:this={dom_node}
```

DOM 노드에 대한 참조를 얻으려면 `bind:this`를 사용합니다. 값은 컴포넌트가 마운트될 때까지 `undefined`입니다. 즉, 컴포넌트 초기화 중이 아니라 이펙트나 이벤트 핸들러 안에서 읽어야 합니다:

```svelte
<script>
	/** @type {HTMLCanvasElement} */
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>

<canvas bind:this={canvas}></canvas>
```

컴포넌트도 `bind:this`를 지원하므로 컴포넌트 인스턴스와 프로그래밍 방식으로 상호작용할 수 있습니다.

```svelte
<!--- file: App.svelte --->
<ShoppingCart bind:this={cart} />

<button onclick={() => cart.empty()}> Empty shopping cart </button>
```

```svelte
<!--- file: ShoppingCart.svelte --->
<script>
	// All instance exports are available on the instance object
	export function empty() {
		// ...
	}
</script>
```

> [!NOTE] [함수 바인딩](#Function-bindings)을 사용하는 경우, 컴포넌트나 요소가 파괴될 때 올바른 값이 null로 지워지도록 getter가 필요합니다.

## 컴포넌트의 bind:_property_ <!-- bind:_property_ for components -->

```svelte
bind:property={variable}
```

요소와 같은 문법으로 컴포넌트 props에 바인딩할 수 있습니다.

```svelte
<Keypad bind:value={pin} />
```

Svelte props는 바인딩하지 않아도 반응형이지만, 기본적으로 그 반응성은 컴포넌트 안쪽, 즉 아래 방향으로만 흐릅니다. `bind:property`를 사용하면 컴포넌트 안에서 일어난 프로퍼티 변경이 컴포넌트 밖으로 다시 흘러 올라갈 수 있습니다.

프로퍼티를 바인딩 가능하게 표시하려면 [`$bindable`]($bindable) 룬을 사용합니다:

```svelte
<script>
	let { readonlyProperty, bindableProperty = $bindable() } = $props();
</script>
```

프로퍼티를 바인딩 가능하게 선언한다는 것은 `bind:`로 사용*할 수 있다*는 뜻이지, `bind:`로 사용*해야 한다*는 뜻은 아닙니다.

바인딩 가능한 프로퍼티는 폴백 값을 가질 수 있습니다:

```svelte
<script>
	let { bindableProperty = $bindable('fallback value') } = $props();
</script>
```

이 폴백 값은 프로퍼티가 바인딩되지 *않았을* 때*만* 적용됩니다. 프로퍼티가 바인딩되어 있고 폴백 값이 있다면 부모는 `undefined`가 아닌 값을 제공해야 하며, 그렇지 않으면 런타임 에러가 발생합니다. 이는 어떤 값이 적용되어야 하는지 불분명해 이해하기 어려운 상황을 막아 줍니다.
