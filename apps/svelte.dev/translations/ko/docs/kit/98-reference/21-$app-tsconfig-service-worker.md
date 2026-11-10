---
title: $app/tsconfig/service-worker
---

이 모듈에는 서비스 워커에 맞춘 TypeScript 설정이 들어 있습니다:

```json
/// file: src/service-worker/tsconfig.json
{
	"extends": "$app/tsconfig/service-worker"
}
```

[`$app/tsconfig`]($app-tsconfig)와 같은 제약을 지키는 한, 이 설정에 직접 `compilerOptions`를 추가해 확장할 수 있습니다.
