---
title: $app/env
---



```js
// @noErrors
import { browser, building, dev, version } from '$app/env';
```

## browser

앱이 브라우저에서 실행 중이면 `true`입니다.

<div class="ts-block">

```dts
const browser: boolean;
```

</div>



## building

SvelteKit은 `build` 단계에서 앱을 실제로 실행해 분석합니다. 이 과정 동안 `building`은 `true`입니다. 프리렌더링 중에도 마찬가지입니다.

<div class="ts-block">

```dts
const building: boolean;
```

</div>



## dev

개발 서버가 실행 중인지 여부입니다. 이 값이 `NODE_ENV`나 `MODE`와 일치한다는 보장은 없습니다.

<div class="ts-block">

```dts
const dev: boolean;
```

</div>



## version

`config.version.name`의 값입니다.

<div class="ts-block">

```dts
const version: string;
```

</div>




