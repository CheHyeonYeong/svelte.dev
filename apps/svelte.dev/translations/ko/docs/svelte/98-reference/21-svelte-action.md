---
title: svelte/action
---

이 모듈은 [액션](use)의 타입을 제공합니다. 액션은 [어태치먼트](@attach)로 대체되었습니다.

## Action

액션은 요소가 생성될 때 호출되는 함수입니다.
이 인터페이스로 그런 액션의 타입을 지정할 수 있습니다.
다음 예시는 `<div>` 요소에서만 동작하고,
기본값이 있는 매개변수를 선택적으로 받는 액션을 정의합니다.
```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```
`Action<HTMLDivElement>`와 `Action<HTMLDivElement, undefined>`는 둘 다 액션이 매개변수를 받지 않는다는 뜻입니다.

함수에서 `update`와 `destroy` 메서드를 가진 객체를 반환할 수 있고, 액션이 어떤 추가 속성과 이벤트를 갖는지 타입으로 지정할 수 있습니다.
자세한 내용은 `ActionReturn` 인터페이스를 보세요.

<div class="ts-block">

```dts
interface Action<
	Element = HTMLElement,
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<
		never,
		any
	>
> {/*…*/}
```

<div class="ts-block-property">

```dts
<Node extends Element>(
	...args: undefined extends Parameter
		? [node: Node, parameter?: Parameter]
		: [node: Node, parameter: Parameter]
): void | ActionReturn<Parameter, Attributes>;
```

<div class="ts-block-property-details"></div>
</div></div>

## ActionReturn

액션은 이 인터페이스에 정의된 두 속성을 담은 객체를 반환할 수 있습니다. 두 속성 모두 선택 사항입니다.
- update: 액션은 매개변수를 가질 수 있습니다. 이 메서드는 그 매개변수가 바뀔 때마다
	Svelte가 마크업에 업데이트를 적용한 직후에 호출됩니다. `ActionReturn`과 `ActionReturn<undefined>`는 둘 다
	액션이 매개변수를 받지 않는다는 뜻입니다.
- destroy: 요소가 언마운트된 뒤 호출되는 메서드

또한 액션이 적용된 요소에서 어떤 추가 속성과 이벤트를 사용할 수 있게 하는지 지정할 수 있습니다.
이는 TypeScript 타입에만 적용되며 런타임에는 아무 영향도 주지 않습니다.

사용 예시는 다음과 같습니다.
```ts
interface Attributes {
	newprop?: string;
	'on:event': (e: CustomEvent<boolean>) => void;
}

export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	// ...
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```

<div class="ts-block">

```dts
interface ActionReturn<
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<
		never,
		any
	>
> {/*…*/}
```

<div class="ts-block-property">

```dts
update?: (parameter: Parameter) => void;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
destroy?: () => void;
```

<div class="ts-block-property-details"></div>
</div></div>


