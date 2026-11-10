---
title: 스프링
---

`Spring` 클래스는 `Tween`의 대안으로, 자주 바뀌는 값에 더 잘 어울리는 경우가 많습니다.

이 예제에는 마우스를 따라다니는 원이 있고, 원의 좌표와 크기라는 두 가지 값이 있습니다. 이 값들을 스프링으로 바꿔 봅시다:

```svelte
/// file: App.svelte
<script>
	+++import { Spring } from 'svelte/motion+++';

	let coords = +++new Spring+++({ x: 50, y: 50 });
	let size = +++new Spring+++(10);
</script>
```

`Tween`과 마찬가지로 스프링에는 쓰기 가능한 `target` 속성과 읽기 전용 `current` 속성이 있습니다. 이벤트 핸들러를 수정하고...

```svelte
<svg
	onmousemove={(e) => {
		coords.+++target+++ = { x: e.clientX, y: e.clientY };
	}}
	onmousedown={() => (size.+++target+++ = 30)}
	onmouseup={() => (size.+++target+++ = 10)}
	role="presentation"
>
```

...`<circle>`의 속성도 수정하세요:

```svelte
<circle
	cx={coords.+++current+++.x}
	cy={coords.+++current+++.y}
	r={size.+++current+++}
></circle>
```

두 스프링 모두 기본 `stiffness`와 `damping` 값을 가지고 있는데, 이 값들이 스프링의, 음... 탄성을 결정합니다. 초깃값을 직접 지정할 수도 있습니다:

```js
/// file: App.svelte
let coords = new Spring({ x: 50, y: 50 }, +++{
	stiffness: 0.1,
	damping: 0.25
}+++);
```

마우스를 이리저리 흔들어 보고, 슬라이더를 드래그해 보면서 값이 스프링의 동작에 어떤 영향을 주는지 느껴 보세요. 스프링이 움직이는 도중에도 값을 조정할 수 있다는 점에 주목하세요.
