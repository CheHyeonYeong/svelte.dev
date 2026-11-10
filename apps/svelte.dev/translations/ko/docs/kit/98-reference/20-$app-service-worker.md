---
title: $app/service-worker
---

이 모듈은 서비스 워커에서만 import할 수 있습니다.



```js
// @noErrors
import { self } from '$app/service-worker';
```

## self

서비스 워커의 실행 컨텍스트입니다. 이 export는 import하는 모듈이
[`$app/tsconfig/service-worker`](/docs/kit/$app-tsconfig-service-worker)를 확장하는 `tsconfig.json`의 적용을 받는 경우,
서비스 워커를 올바른 타입과 함께 더 쉽게 사용할 수 있도록 제공됩니다.

<div class="ts-block">

```dts
const self: ServiceWorkerGlobalScope;
```

</div>




