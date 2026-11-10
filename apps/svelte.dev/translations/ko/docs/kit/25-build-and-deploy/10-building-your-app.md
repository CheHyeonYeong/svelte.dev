---
title: 앱 빌드하기
---

SvelteKit 앱의 빌드는 두 단계로 이루어지며, 두 단계 모두 `vite build`를 실행할 때(보통 `npm run build`를 통해) 진행됩니다.

먼저 Vite가 서버 코드, 브라우저 코드, 그리고 (있다면) 서비스 워커의 최적화된 프로덕션 빌드를 만듭니다. 필요한 경우 [프리렌더링](page-options#prerender)도 이 단계에서 실행됩니다.

다음으로 *어댑터*가 이 프로덕션 빌드를 받아 대상 환경에 맞게 조정합니다. 이에 대해서는 다음 페이지들에서 자세히 다룹니다.

## 빌드 중에 <!-- During the build -->

SvelteKit은 분석을 위해 빌드 중에 `+page/layout(.server).js` 파일(그리고 이 파일들이 import하는 모든 파일)을 불러옵니다. 이 단계에서 실행되면 _안 되는_ 코드는 [`$app/env`]($app-env)의 `building`이 `false`인지 확인해야 합니다:

```js
+++import { building } from '$app/env';+++
import { initialiseDatabase } from '#lib/server/database.js';

+++if (!building) {+++
	initialiseDatabase();
+++}+++

export function load() {
	// ...
}
```

## 앱 미리 보기 <!-- Preview your app -->

빌드한 뒤에는 `vite preview`(`npm run preview`를 통해)로 프로덕션 빌드를 로컬에서 확인할 수 있습니다. 이 명령은 앱을 Node에서 실행하므로 배포된 앱을 완벽하게 재현하지는 않는다는 점에 유의하세요. [`platform` 객체](adapters#Platform-specific-context) 같은 어댑터별 조정은 미리 보기에 적용되지 않습니다.
