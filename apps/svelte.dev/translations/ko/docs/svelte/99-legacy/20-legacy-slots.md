---
title: <slot>
---

Svelte 5에서는 콘텐츠를 [스니펫](snippet) 형태로 컴포넌트에 전달하고 [render 태그](@render)로 렌더링합니다.

레거시 모드에서는 컴포넌트 태그 안의 콘텐츠를 *슬롯 콘텐츠*(slotted content)로 간주하며, 컴포넌트는 `<slot>` 요소로 이를 렌더링할 수 있습니다:

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';
</script>

<Modal>This is some slotted content</Modal>
```

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
</div>
```

> [!NOTE] 일반 `<slot>` 요소를 렌더링하고 싶다면 `<svelte:element this={'slot'} />`를 사용하면 됩니다.

## 이름 있는 슬롯 <!-- Named slots -->

컴포넌트에는 기본 슬롯 외에 *이름 있는* 슬롯도 둘 수 있습니다. 부모 쪽에서는 컴포넌트 태그 바로 안에 있는 요소, 컴포넌트, [`<svelte:fragment>`](legacy-svelte-fragment)에 `slot="..."` 속성을 추가합니다.

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';

	let open = true;
</script>

{#if open}
	<Modal>
		This is some slotted content

		+++<div slot="buttons">+++
			<button on:click={() => open = false}>
				close
			</button>
		+++</div>+++
	</Modal>
{/if}
```

자식 쪽에서는 그에 맞는 `<slot name="...">` 요소를 추가합니다:

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
	<hr>
	+++<slot name="buttons"></slot>+++
</div>
```

## 폴백 콘텐츠 <!-- Fallback content -->

슬롯 콘텐츠가 제공되지 않을 때를 대비해, 컴포넌트는 `<slot>` 요소 안에 폴백 콘텐츠를 넣어 둘 수 있습니다:

```svelte
<slot>
	This will be rendered if no slotted content is provided
</slot>
```

## 슬롯 콘텐츠에 데이터 전달하기 <!-- Passing data to slotted content -->

슬롯은 0번 이상 렌더링될 수 있으며, props를 사용해 부모에게 값을 *되돌려* 전달할 수 있습니다. 부모는 `let:` 지시어로 그 값을 슬롯 템플릿에 노출합니다.

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as data}
		<li class="fancy">
			<!-- 'item' here... -->
			<slot item={process(data)} />
		</li>
	{/each}
</ul>
```

```svelte
<!--- file: App.svelte --->
<!-- ...corresponds to 'item' here: -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>
```

일반적인 축약 규칙이 적용됩니다. `let:item`은 `let:item={item}`과 같고, `<slot {item}>`은 `<slot item={item}>`과 같습니다.

이름 있는 슬롯도 값을 노출할 수 있습니다. 이때 `let:` 지시어는 `slot` 속성이 있는 요소에 붙입니다.

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" item={process(data)} />
		</li>
	{/each}
</ul>

<slot name="footer" />
```

```svelte
<!--- file: App.svelte --->
<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```


