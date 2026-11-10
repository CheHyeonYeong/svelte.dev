---
title: svelte/server
---



```js
// @noErrors
import { render } from 'svelte/server';
```

## render

서버에서만, 그리고 `server` 옵션으로 컴파일할 때만 사용할 수 있습니다.
컴포넌트를 받아 `body`와 `head` 속성을 가진 객체를 반환합니다. 앱을 서버에서 렌더링할 때 이 값으로 HTML을 채울 수 있습니다.

<div class="ts-block">

```dts
function render<
	Comp extends SvelteComponent<any> | Component<any>,
	Props extends ComponentProps<Comp> = ComponentProps<Comp>
>(
	...args: {} extends Props
		? [
				component: Comp extends SvelteComponent<any>
					? ComponentType<Comp>
					: Comp,
				options?: {
					props?: Omit<Props, '$$slots' | '$$events'>;
					context?: Map<any, any>;
					idPrefix?: string;
					csp?: Csp;
					transformError?: (
						error: unknown
					) => unknown | Promise<unknown>;
				}
			]
		: [
				component: Comp extends SvelteComponent<any>
					? ComponentType<Comp>
					: Comp,
				options: {
					props: Omit<Props, '$$slots' | '$$events'>;
					context?: Map<any, any>;
					idPrefix?: string;
					csp?: Csp;
					transformError?: (
						error: unknown
					) => unknown | Promise<unknown>;
				}
			]
): RenderOutput;
```

</div>



## Csp

<div class="ts-block">

```dts
type Csp = { nonce?: string; hash?: boolean };
```

</div>

## RenderOutput

<div class="ts-block">

```dts
type RenderOutput = SyncRenderOutput &
	PromiseLike<SyncRenderOutput>;
```

</div>

## Sha256Source

<div class="ts-block">

```dts
type Sha256Source = `sha256-${string}`;
```

</div>

## SyncRenderOutput

<div class="ts-block">

```dts
interface SyncRenderOutput {/*…*/}
```

<div class="ts-block-property">

```dts
head: string;
```

<div class="ts-block-property-details">

`<head>`에 들어가는 HTML

</div>
</div>

<div class="ts-block-property">

```dts
html: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 대신 `body`를 사용하세요

</div>

</div>
</div>

<div class="ts-block-property">

```dts
body: string;
```

<div class="ts-block-property-details">

`<body>` 안 어딘가에 들어가는 HTML

</div>
</div>

<div class="ts-block-property">

```dts
hashes: {
	script: Sha256Source[];
};
```

<div class="ts-block-property-details"></div>
</div></div>


