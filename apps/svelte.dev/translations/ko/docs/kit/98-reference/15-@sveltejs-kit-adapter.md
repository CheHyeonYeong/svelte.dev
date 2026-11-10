---
title:  @sveltejs/kit/adapter
---



```js
// @noErrors
import { applyReroute } from '@sveltejs/kit/adapter';
```

## applyReroute

<blockquote class="since note">

3.0.0부터 사용 가능

</blockquote>

`reroute` 훅이 들어온 요청과 다른 URL 경로명을 반환했을 때,
catch-all 요청 핸들러가 그 요청을 다른 핸들러로 넘기도록
도와줍니다.

어댑터가 여러 서버리스 함수를 배포할 수 있다면,
처리되지 않은 요청을 받을 "catch-all" 함수도 함께 배포하는 것이 좋습니다.
그 함수 안에서 이것을 실행하면 앱의 `reroute` 훅이 요청 URL을 다시 쓰고,
적절한 다음 서버리스 함수가 있다면 그 함수를 호출할 수 있습니다.

<div class="ts-block">

```dts
function applyReroute(
	response: Response,
	next: (url: URL) => Response | Promise<Response>
): Response | Promise<Response>;
```

</div>




