---
title: 패키징
---

SvelteKit으로는 앱뿐만 아니라 컴포넌트 라이브러리도 만들 수 있으며, 이때 `@sveltejs/package` 패키지를 사용합니다(`npx sv create`에 이를 설정해 주는 옵션이 있습니다).

앱을 만들 때는 `src/routes`의 내용이 외부에 공개되는 부분이고, [`src/lib`]($lib)에는 앱의 내부 라이브러리가 들어 있습니다.

컴포넌트 라이브러리는 SvelteKit 앱과 구조가 똑같지만, `src/lib`가 외부에 공개되는 부분이고 루트의 `package.json`이 패키지를 배포하는 데 사용된다는 점이 다릅니다. `src/routes`는 라이브러리와 함께 제공되는 문서나 데모 사이트일 수도 있고, 개발 중에 사용하는 샌드박스일 수도 있습니다.

`@sveltejs/package`의 `svelte-package` 명령을 실행하면 `src/lib`의 내용을 가져와 다음을 담은 `dist` 디렉터리([설정](#Options) 가능)를 생성합니다:

- `src/lib`의 모든 파일. Svelte 컴포넌트는 전처리되고, TypeScript 파일은 JavaScript로 트랜스파일됩니다.
- Svelte, JavaScript, TypeScript 파일에 대해 생성된 타입 정의(`d.ts` 파일). 이를 위해서는 `typescript >= 4.0.0`을 설치해야 합니다. 타입 정의는 구현 파일 옆에 배치되며, 직접 작성한 `d.ts` 파일은 그대로 복사됩니다. [생성을 끌](#Options) 수도 있지만, 끄지 않기를 강력히 권장합니다. 라이브러리 사용자 중에는 TypeScript를 쓰는 사람도 있을 수 있고, 그들에게는 이 타입 정의 파일이 필요하기 때문입니다.

> [!NOTE] `@sveltejs/package` 버전 1은 `package.json`을 생성했습니다. 이제는 그렇지 않으며, 대신 프로젝트의 `package.json`을 사용하고 그 내용이 올바른지 검증합니다. 아직 버전 1을 사용하고 있다면 마이그레이션 방법은 [이 PR](https://github.com/sveltejs/kit/pull/8922)을 참고하세요.

## package.json의 구조 <!-- Anatomy of a package.json -->

이제 공개적으로 사용될 라이브러리를 만드는 것이므로 `package.json`의 내용이 더 중요해집니다. 이 파일을 통해 패키지의 진입점, npm에 배포할 파일, 라이브러리의 의존성을 설정합니다. 가장 중요한 필드를 하나씩 살펴보겠습니다.

### name

패키지의 이름입니다. 다른 사람들이 이 이름으로 패키지를 설치할 수 있으며, `https://npmjs.com/package/<name>`에서 볼 수 있습니다.

```json
{
	"name": "your-library"
}
```

자세한 내용은 [여기](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name)를 참고하세요.

### license

모든 패키지에는 사람들이 패키지를 어떻게 사용할 수 있는지 알 수 있도록 license 필드가 있어야 합니다. 널리 쓰이면서도 보증 없는 배포와 재사용에 매우 관대한 라이선스로 `MIT`가 있습니다.

```json
{
	"license": "MIT"
}
```

자세한 내용은 [여기](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#license)를 참고하세요. 패키지에 `LICENSE` 파일도 포함해야 한다는 점에 유의하세요.

### files

npm이 어떤 파일을 묶어 npm에 업로드할지 알려 줍니다. 출력 폴더(기본값은 `dist`)가 포함되어야 합니다. `package.json`, `README`, `LICENSE`는 항상 포함되므로 따로 지정할 필요가 없습니다.

```json
{
	"files": ["dist"]
}
```

불필요한 파일(단위 테스트나 `src/routes`에서만 가져오는 모듈 등)을 제외하려면 `.npmignore` 파일에 추가하면 됩니다. 그러면 패키지가 더 작아져서 더 빨리 설치됩니다.

자세한 내용은 [여기](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files)를 참고하세요.

### exports

`"exports"` 필드에는 패키지의 진입점이 들어 있습니다. `npx sv create`로 새 라이브러리 프로젝트를 만들었다면, 패키지 루트 하나만 내보내도록 설정되어 있습니다:

```json
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js"
		}
	}
}
```

이는 번들러와 도구에 패키지의 진입점이 루트 하나뿐이며, 모든 것을 다음과 같이 루트를 통해 가져와야 한다고 알려 줍니다:

```js
// @errors: 2307
import { Something } from 'your-library';
```

`types`와 `svelte` 키는 [내보내기 조건(export condition)](https://nodejs.org/api/packages.html#conditional-exports)입니다. 이 키는 도구가 `your-library` import를 찾을 때 어떤 파일을 가져와야 하는지 알려 줍니다:

- TypeScript는 `types` 조건을 보고 타입 정의 파일을 찾습니다. 타입 정의를 배포하지 않는다면 이 조건을 빼세요.
- Svelte를 인식하는 도구는 `svelte` 조건을 보고 이것이 Svelte 컴포넌트 라이브러리라는 것을 압니다. Svelte 컴포넌트를 하나도 내보내지 않고 Svelte가 아닌 프로젝트에서도 동작할 수 있는 라이브러리(예를 들어 Svelte 스토어 라이브러리)를 배포한다면 이 조건을 `default`로 바꿔도 됩니다.

> [!NOTE] 이전 버전의 `@sveltejs/package`는 `package.json` 내보내기도 추가했습니다. 이제는 모든 도구가 명시적으로 내보내지 않은 `package.json`도 처리할 수 있으므로 더 이상 템플릿에 포함되지 않습니다.

`exports`를 원하는 대로 조정하고 진입점을 더 추가할 수 있습니다. 예를 들어 컴포넌트를 다시 내보내는 `src/lib/index.js` 파일 대신 `src/lib/Foo.svelte` 컴포넌트를 직접 노출하고 싶다면, 다음과 같은 내보내기 맵을 만들 수 있습니다...

```json
{
	"exports": {
		"./Foo.svelte": {
			"types": "./dist/Foo.svelte.d.ts",
			"svelte": "./dist/Foo.svelte"
		}
	}
}
```

...그러면 라이브러리 사용자는 다음과 같이 컴포넌트를 가져올 수 있습니다:

```js
// @filename: ambient.d.ts
declare module 'your-library/Foo.svelte';

// @filename: index.js
// ---cut---
import Foo from 'your-library/Foo.svelte';
```

> [!NOTE] 타입 정의를 제공한다면 이렇게 할 때 추가로 주의해야 합니다. 주의 사항에 대한 자세한 내용은 [여기](#TypeScript)를 참고하세요

일반적으로 내보내기 맵의 각 키는 사용자가 패키지에서 무언가를 가져올 때 사용해야 하는 경로이고, 값은 가져올 파일의 경로이거나 그 파일 경로들을 담은 내보내기 조건 맵입니다.

`exports`에 대한 자세한 내용은 [여기](https://nodejs.org/docs/latest-v18.x/api/packages.html#package-entry-points)를 참고하세요.

### svelte

도구가 Svelte 컴포넌트 라이브러리를 인식할 수 있게 해 주던 레거시 필드입니다. `svelte` [내보내기 조건](#Anatomy-of-a-package.json-exports)을 사용한다면 더 이상 필요하지 않지만, 아직 내보내기 조건을 모르는 오래된 도구와의 하위 호환성을 위해 남겨 두는 것이 좋습니다. 이 필드는 루트 진입점을 가리켜야 합니다.

```json
{
	"svelte": "./dist/index.js"
}
```

### sideEffects

`package.json`의 `sideEffects` 필드는 번들러가 모듈에 부수 효과가 있는 코드가 포함될 수 있는지 판단하는 데 사용됩니다. 모듈을 가져왔을 때 모듈 밖의 다른 스크립트에서 관찰할 수 있는 변경을 일으킨다면 그 모듈은 부수 효과가 있는 것으로 간주됩니다. 예를 들어 전역 변수나 JavaScript 내장 객체의 프로토타입을 수정하는 것이 부수 효과에 해당합니다. 부수 효과는 애플리케이션의 다른 부분의 동작에 영향을 줄 수 있으므로, 이런 파일/모듈은 그 내보내기가 애플리케이션에서 사용되는지와 관계없이 최종 번들에 포함됩니다. 코드에서 부수 효과를 피하는 것이 모범 사례입니다.

`package.json`에 `sideEffects` 필드를 설정하면 번들러가 사용되지 않는 내보내기를 최종 번들에서 더 적극적으로 제거할 수 있습니다. 이 과정을 트리 셰이킹(tree-shaking)이라고 합니다. 그 결과 더 작고 효율적인 번들이 만들어집니다. 번들러마다 `sideEffects`를 처리하는 방식은 다양합니다. Vite에는 필요하지 않지만, 라이브러리가 [webpack과 호환되도록](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) 모든 CSS 파일에 부수 효과가 있다고 명시하기를 권장합니다. 새로 만든 프로젝트에는 다음 설정이 기본으로 들어 있습니다:

```json
/// file: package.json
{
	"sideEffects": ["**/*.css"]
}
```

> [!NOTE] 라이브러리의 스크립트에 부수 효과가 있다면 반드시 `sideEffects` 필드를 업데이트하세요. 새로 만든 프로젝트에서는 기본적으로 모든 스크립트가 부수 효과가 없는 것으로 표시됩니다. 부수 효과가 있는 파일이 부수 효과가 없는 것으로 잘못 표시되면 기능이 망가질 수 있습니다.

패키지에 부수 효과가 있는 파일이 있다면 배열로 지정할 수 있습니다:

```json
/// file: package.json
{
	"sideEffects": [
		"**/*.css",
		"./dist/sideEffectfulFile.js"
	]
}
```

이렇게 하면 지정한 파일만 부수 효과가 있는 것으로 취급됩니다.

## TypeScript

직접 TypeScript를 사용하지 않더라도, TypeScript를 쓰는 사람들이 라이브러리를 사용할 때 제대로 된 인텔리센스를 얻을 수 있도록 라이브러리의 타입 정의를 함께 배포해야 합니다. `@sveltejs/package`는 타입 생성 과정을 대부분 알아서 처리해 줍니다. 기본적으로 라이브러리를 패키징할 때 JavaScript, TypeScript, Svelte 파일에 대한 타입 정의가 자동으로 생성됩니다. [exports](#Anatomy-of-a-package.json-exports) 맵의 `types` 조건이 올바른 파일을 가리키는지만 확인하면 됩니다. `npx sv create`로 라이브러리 프로젝트를 초기화하면 루트 내보내기에 대해서는 이 설정이 자동으로 되어 있습니다.

하지만 루트 내보내기 외에 다른 것이 있다면(예를 들어 `your-library/foo` import를 제공한다면) 타입 정의를 제공할 때 추가로 주의해야 합니다. 안타깝게도 TypeScript는 기본적으로 `{ "./foo": { "types": "./dist/foo.d.ts", ... }}` 같은 내보내기의 `types` 조건을 확인하지 _않습니다_. 대신 라이브러리 루트를 기준으로 `foo.d.ts`를 찾습니다(즉, `your-library/dist/foo.d.ts`가 아니라 `your-library/foo.d.ts`). 이를 해결하는 방법은 두 가지입니다:

첫 번째 방법은 라이브러리 사용자에게 `tsconfig.json`(또는 `jsconfig.json`)의 `moduleResolution` 옵션을 `bundler`(TypeScript 5부터 사용 가능하며, 앞으로 가장 좋고 권장되는 옵션), `node16`, `nodenext` 중 하나로 설정하도록 요구하는 것입니다. 이렇게 하면 TypeScript가 실제로 내보내기 맵을 보고 타입을 올바르게 확인합니다.

두 번째 방법은 TypeScript의 `typesVersions` 기능을 (편법으로) 활용해 타입을 연결하는 것입니다. 이는 TypeScript가 TypeScript 버전에 따라 서로 다른 타입 정의를 확인하는 데 사용하는 `package.json` 안의 필드로, 이를 위한 경로 매핑 기능도 들어 있습니다. 이 경로 매핑 기능을 활용해 원하는 결과를 얻습니다. 위에서 언급한 `foo` 내보내기라면 해당하는 `typesVersions`는 다음과 같습니다:

```json
{
	"exports": {
		"./foo": {
			"types": "./dist/foo.d.ts",
			"svelte": "./dist/foo.js"
		}
	},
	"typesVersions": {
		">4.0": {
			"foo": ["./dist/foo.d.ts"]
		}
	}
}
```

`>4.0`은 사용하는 TypeScript 버전이 4보다 크면(실제로는 항상 참일 것입니다) 안쪽 맵을 확인하라고 TypeScript에 알려 줍니다. 안쪽 맵은 `your-library/foo`의 타입이 `./dist/foo.d.ts`에 있다고 TypeScript에 알려 주는데, 이는 사실상 `exports` 조건을 그대로 재현한 것입니다. 와일드카드 `*`를 사용하면 같은 내용을 반복하지 않고 여러 타입 정의를 한 번에 사용할 수 있게 할 수도 있습니다. `typesVersions`를 사용하기로 했다면 루트 import(`"index.d.ts": [..]`로 정의됨)를 포함한 모든 타입 import를 이 필드로 선언해야 한다는 점에 유의하세요.

이 기능에 대한 자세한 내용은 [여기](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions)에서 읽을 수 있습니다.

## 모범 사례 <!-- Best practices -->

다른 SvelteKit 프로젝트에서만 사용할 패키지가 아니라면, 패키지에서 `$app/env` 같은 SvelteKit 전용 모듈은 사용하지 않아야 합니다. 예를 들어 `import { browser } from '$app/env'` 대신 `import { BROWSER } from 'esm-env'`를 사용할 수 있습니다([esm-env 문서 참고](https://github.com/benmccann/esm-env)). 또한 `$app/state`, `$app/navigation` 등에 직접 의존하기보다 현재 URL이나 내비게이션 동작 같은 것을 prop으로 전달받는 편이 좋을 수 있습니다. 이렇게 더 범용적인 방식으로 작성하면 테스트, UI 데모 등을 위한 도구를 설정하기도 더 쉬워집니다.

라이브러리 코드의 별칭에는 [서브패스 import(subpath imports)](https://nodejs.org/api/packages.html#subpath-imports)를 사용하세요. `svelte-package`는 패키징할 때 package.json의 `imports` 필드에 있는 `#`으로 시작하는 import를 상대 경로로 다시 씁니다.

패키지에 가하는 변경이 버그 수정인지, 새 기능인지, 호환성이 깨지는 변경인지 신중하게 판단하고 그에 맞게 패키지 버전을 업데이트해야 합니다. 기존 라이브러리의 `exports`에서 경로를 제거하거나 그 안의 `export` 조건을 제거한다면 호환성이 깨지는 변경으로 간주해야 한다는 점에 유의하세요.

```json
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
// changing `svelte` to `default` is a breaking change:
---			"svelte": "./dist/index.js"---
+++			"default": "./dist/index.js"+++
		},
// removing this is a breaking change:
---		"./foo": {
			"types": "./dist/foo.d.ts",
			"svelte": "./dist/foo.js",
			"default": "./dist/foo.js"
		},---
// adding this is ok:
+++		"./bar": {
			"types": "./dist/bar.d.ts",
			"svelte": "./dist/bar.js",
			"default": "./dist/bar.js"
		}+++
	}
}
```

## 소스 맵 <!-- Source maps -->

`tsconfig.json`에 `"declarationMap": true`를 설정하면 이른바 선언 맵(`d.ts.map` 파일)을 만들 수 있습니다. 그러면 VS Code 같은 에디터에서 _정의로 이동(Go to Definition)_ 같은 기능을 사용할 때 원본 `.ts`나 `.svelte` 파일로 이동할 수 있습니다. 이를 위해서는 선언 파일 안의 상대 경로가 디스크의 파일을 가리키도록 소스 파일도 dist 폴더와 함께 배포해야 합니다. Svelte CLI가 제안하는 대로 라이브러리 코드를 모두 `src/lib` 안에 두었다면, `package.json`의 `files`에 `src/lib`를 추가하기만 하면 됩니다:

```json
{
	"files": [
		"dist",
		"!dist/**/*.test.*",
		"!dist/**/*.spec.*",
		+++"src/lib",
		"!src/lib/**/*.test.*",
		"!src/lib/**/*.spec.*"+++
	]
}
```

## 옵션 <!-- Options -->

`svelte-package`는 다음 옵션을 받습니다:

- `-w`/`--watch` — `src/lib`의 파일 변경을 감시하고 패키지를 다시 빌드합니다
- `-i`/`--input` — 패키지의 모든 파일이 들어 있는 입력 디렉터리입니다. 기본값은 `src/lib`입니다
- `-o`/`--output` — 처리된 파일이 쓰이는 출력 디렉터리입니다. `package.json`의 `exports`는 그 안의 파일을 가리켜야 하고, `files` 배열에는 그 폴더가 포함되어야 합니다. 기본값은 `dist`입니다
- `-p`/`--preserve-output` — 패키징 전에 출력 디렉터리가 삭제되지 않도록 합니다. 기본값은 `false`이며, 출력 디렉터리를 먼저 비운다는 뜻입니다
- `-t`/`--types` — 타입 정의(`d.ts` 파일)를 생성할지 여부입니다. 생태계 라이브러리의 품질을 높여 주므로 생성하기를 강력히 권장합니다. 기본값은 `true`입니다
- `--tsconfig` - tsconfig 또는 jsconfig의 경로입니다. 지정하지 않으면 작업 공간 경로에서 가장 가까운 상위 tsconfig/jsconfig를 찾습니다.

## 배포하기 <!-- Publishing -->

생성된 패키지를 배포하려면:

```sh
npm publish
```

## 주의 사항 <!-- Caveats -->

모든 상대 파일 import는 Node의 ESM 알고리즘에 따라 완전히 지정되어야 합니다. 즉 `src/lib/something/index.js` 같은 파일이라면 확장자를 포함한 파일 이름을 써야 합니다:

```js
// @errors: 2307
import { something } from './something+++/index.js+++';
```

TypeScript를 사용한다면 `.ts` 파일도 같은 방식으로 가져와야 하지만, `.ts`가 _아니라_ `.js` 확장자를 써야 합니다. (이는 우리가 어떻게 할 수 없는 TypeScript의 설계 결정입니다.) `tsconfig.json`이나 `jsconfig.json`에서 `"moduleResolution": "NodeNext"`를 설정하면 도움이 됩니다.

Svelte 파일(전처리됨)과 TypeScript 파일(JavaScript로 트랜스파일됨)을 제외한 모든 파일은 그대로 복사됩니다.
