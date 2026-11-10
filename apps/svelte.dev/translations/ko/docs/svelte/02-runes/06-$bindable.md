---
title: $bindable
---

보통 props는 부모에서 자식으로 한 방향으로 흐릅니다. 덕분에 앱 안에서 데이터가 어떻게 흐르는지 이해하기 쉽습니다.

Svelte에서는 컴포넌트 props를 *바인딩*할 수 있습니다. 즉, 데이터가 자식에서 부모로 *거슬러 올라갈* 수도 있습니다. 자주 해야 하는 일은 아니지만(남용하면 데이터 흐름을 예측하기 어려워지고 컴포넌트를 유지보수하기 힘들어집니다), 아껴서 신중하게 사용하면 코드를 단순하게 만들 수 있습니다.

또한 자식에서 상태 프록시를 *변경*할 수 있다는 뜻이기도 합니다.

> [!NOTE] 일반 props로도 변경은 가능하지만, 절대 권장하지 않습니다. 컴포넌트가 자신이 '소유'하지 않은 상태를 변경하는 것을 감지하면 Svelte가 경고합니다.

prop을 바인딩 가능하게 지정하려면 `$bindable` 룬을 사용합니다:

<!-- prettier-ignore -->
```svelte
/// file: FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />

<style>
	input {
		font-family: 'Comic Sans MS';
		color: deeppink;
	}
</style>
```

이제 `<FancyInput>`을 사용하는 컴포넌트에서 [`bind:`](bind) 지시어를 추가할 수 있습니다([데모](/playground/untitled#H4sIAAAAAAAAE3WQwWrDMBBEf2URBSfg2nfFMZRCoYeecqx6UJx1IyqvhLUONcb_XqSkTUOSk1az7DBvJtEai0HI90nw6FHIJIhckO7i78n7IhzQctS2OuAtvXHESByEFFVoeuO5VqTYdN71DC-amvGV_MDQ9q6DrCjP0skkWymKJxYZOgxBfyKs4SGwZlxke7TWZcuVoqo8-1P1z3lraCcP2g64nk4GM5S1osrXf0JV-lrkgvGbheR-wDm_g30V8JL-1vpOCZFogpQsEsWcemtxscyhKArfOx9gjps0Lq4hzRVfemaYfu-PoIqqwKPFY_XpaIqj4tYRP7a6M3aUkD27zjSw0RTgbZN6Z8WNs66XsEP03tBXUueUJFlelvYx_wCuI3leNwIAAA==)):

<!-- prettier-ignore -->
```svelte
/// file: App.svelte
<script>
	import FancyInput from './FancyInput.svelte';

	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

부모 컴포넌트가 `bind:`를 *꼭* 사용해야 하는 것은 아닙니다. 그냥 일반 prop을 전달해도 됩니다. 자식의 말에 귀 기울이고 싶지 않은 부모도 있으니까요.

이런 경우를 위해 prop이 아예 전달되지 않았을 때 쓸 폴백 값을 지정할 수 있습니다:

```js
/// file: FancyInput.svelte
let { value = $bindable('fallback'), ...props } = $props();
```

바인딩 가능한 prop에 폴백 값이 있으면, 부모가 `bind:`를 사용할 때는 `undefined`가 아닌 값을 전달해야 합니다. 바인딩에서는 부모와 자식이 같은 값을 공유해야 하므로, 이렇게 해야 어느 값을 적용할지 모호해지지 않습니다.
