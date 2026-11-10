---
title: $app/tsconfig
---

이 모듈에는 앱에 맞춘 TypeScript 설정이 들어 있습니다. 여러분의 설정은 이를 확장해야 하며, 일반적인 `tsconfig.json`은 다음과 같습니다:

```json
/// file: tsconfig.json
{
	"extends": "$app/tsconfig",
	"include": ["src", "test"],
	"exclude": ["src/service-worker"]
}
```

이 설정에 직접 `compilerOptions`를 추가해 확장할 수 있습니다. 다만 다음 속성을 덮어쓰면 문제가 생길 수 있으며, 그런 경우 SvelteKit이 경고를 표시합니다:

- `paths` — Vite와 TypeScript의 동작을 맞추기 위해, (지원 중단된) [`alias`](@sveltejs-kit-vite#alias) 설정 옵션과 `package.json`에 지정한 [서브패스 import](https://nodejs.org/api/packages.html#subpath-imports)로부터 만들어집니다. `paths`를 직접 쓰기보다는 서브패스 import를 설정하는 것이 좋습니다
- `types` — 앱이 [환경 변수](environment-variables) 등을 위해 생성된 모듈 선언을 '볼' 수 있어야 하므로, 이 배열에는 반드시 `"$app/types"`가 포함되어야 합니다
- `isolatedModules` — Vite는 모듈을 하나씩 컴파일하므로 반드시 `true`여야 합니다
- `verbatimModuleSyntax` — `.svelte` 파일에서 타입 import를 안전하게 쓸 수 있도록 반드시 `true`여야 합니다

위 예시 설정에서 `src/service-worker`를 제외한 이유는 서비스 워커가 별도의 TypeScript 프로젝트에 있어야 하기 때문입니다. 서비스 워커를 사용한다면 [`$app/tsconfig/service-worker`]($app-tsconfig-service-worker)를 확장하는 `src/service-worker/tsconfig.json`을 만드세요.
