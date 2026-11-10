---
title: svelte/reactivity/window
---

이 모듈은 여러 `window` 값의 반응형 버전을 export합니다. 각각에는 반응형 `current` 속성이 있어서, [`<svelte:window>`](svelte-window) 바인딩을 쓰거나 이벤트 리스너를 직접 만들지 않고도 반응형 컨텍스트(템플릿, [파생 값]($derived), [이펙트]($effect))에서 참조할 수 있습니다.

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```



```js
// @noErrors
import {
	devicePixelRatio,
	innerHeight,
	innerWidth,
	online,
	outerHeight,
	outerWidth,
	screenLeft,
	screenTop,
	scrollX,
	scrollY
} from 'svelte/reactivity/window';
```

## devicePixelRatio

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`devicePixelRatio.current`는 `window.devicePixelRatio`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.
동작이 브라우저마다 다르다는 점에 유의하세요. Chrome에서는 현재 확대/축소 수준에 반응하지만,
Firefox와 Safari에서는 반응하지 않습니다.

<div class="ts-block">

```dts
const devicePixelRatio: {
	get current(): number | undefined;
};
```

</div>



## innerHeight

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`innerHeight.current`는 `window.innerHeight`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const innerHeight: ReactiveValue<number | undefined>;
```

</div>



## innerWidth

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`innerWidth.current`는 `window.innerWidth`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const innerWidth: ReactiveValue<number | undefined>;
```

</div>



## online

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`online.current`는 `navigator.onLine`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const online: ReactiveValue<boolean | undefined>;
```

</div>



## outerHeight

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`outerHeight.current`는 `window.outerHeight`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const outerHeight: ReactiveValue<number | undefined>;
```

</div>



## outerWidth

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`outerWidth.current`는 `window.outerWidth`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const outerWidth: ReactiveValue<number | undefined>;
```

</div>



## screenLeft

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`screenLeft.current`는 `window.screenLeft`의 반응형 뷰입니다. `requestAnimationFrame` 콜백 안에서 갱신됩니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const screenLeft: ReactiveValue<number | undefined>;
```

</div>



## screenTop

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`screenTop.current`는 `window.screenTop`의 반응형 뷰입니다. `requestAnimationFrame` 콜백 안에서 갱신됩니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const screenTop: ReactiveValue<number | undefined>;
```

</div>



## scrollX

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`scrollX.current`는 `window.scrollX`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const scrollX: ReactiveValue<number | undefined>;
```

</div>



## scrollY

<blockquote class="since note">

5.11.0부터 사용 가능

</blockquote>

`scrollY.current`는 `window.scrollY`의 반응형 뷰입니다. 서버에서는 `undefined`입니다.

<div class="ts-block">

```dts
const scrollY: ReactiveValue<number | undefined>;
```

</div>




