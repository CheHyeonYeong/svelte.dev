---
title: 트윈 값
---

값이 바뀌고 있다는 것을 전달하는 좋은 방법 중 하나는 *모션*을 사용하는 것입니다. Svelte에는 사용자 인터페이스에 모션을 더하는 클래스가 들어 있습니다.

`svelte/motion`에서 `Tween` 클래스를 import하세요:

```svelte
/// file: App.svelte
<script>
	+++import { Tween } from 'svelte/motion';+++

	let progress = $state(0);
</script>
```

`progress`를 `Tween`의 인스턴스로 바꾸세요:

```svelte
/// file: App.svelte
<script>
	import { Tween } from 'svelte/motion';

	let progress = +++new Tween+++(0);
</script>
```

`Tween` 클래스에는 쓰기 가능한 `target` 속성과 읽기 전용 `current` 속성이 있습니다. `<progress>` 요소를 수정하고...

```svelte
<progress value={progress.+++current+++}></progress>
```

...각 이벤트 핸들러도 수정하세요:

```svelte
<button onclick={() => (progress.+++target+++ = 0)}>
	0%
</button>
```

버튼을 클릭하면 진행 막대가 새 값으로 애니메이션됩니다. 하지만 조금 기계적이고 밋밋합니다. 이징 함수를 추가해야 합니다:

```svelte
/// file: App.svelte
<script>
	import { Tween } from 'svelte/motion';
	+++import { cubicOut } from 'svelte/easing';+++

	let progress = new Tween(0, +++{
		duration: 400,
		easing: cubicOut
	}+++);
</script>
```

> [!NOTE] `svelte/easing` 모듈에는 [Penner 이징 방정식](https://web.archive.org/web/20190805215728/http://robertpenner.com/easing/)이 들어 있습니다. 또는 `p`와 `t`가 모두 0과 1 사이의 값인 `p => t` 함수를 직접 넘길 수도 있습니다.

`Tween`에서 사용할 수 있는 옵션 전체는 다음과 같습니다:

- `delay` — 트윈이 시작되기 전까지의 밀리초
- `duration` — 트윈의 지속 시간(밀리초) 또는 `(from, to) => milliseconds` 함수. 함수를 쓰면 (예를 들어) 값이 크게 바뀔 때 트윈을 더 길게 지정할 수 있습니다
- `easing` — `p => t` 함수
- `interpolate` — 임의의 값 사이를 보간하는 커스텀 `(from, to) => t => value` 함수. 기본적으로 Svelte는 숫자, 날짜, 그리고 모양이 같은 배열과 객체(숫자와 날짜, 또는 다른 유효한 배열과 객체만 담고 있는 경우) 사이를 보간합니다. (예를 들어) 색상 문자열이나 변환 행렬을 보간하려면 커스텀 보간 함수를 넘기세요

`progress.target`에 직접 할당하는 대신 `progress.set(value, options)`를 호출할 수도 있습니다. 이 경우 `options`가 기본값을 덮어씁니다. `set` 메서드는 트윈이 끝나면 resolve되는 프로미스를 반환합니다.
