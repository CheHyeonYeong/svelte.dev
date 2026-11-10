---
title: [직접 만들기]
---

이 가이드에서는 Svelte CLI용 커뮤니티 애드온을 만들고, 테스트하고, 배포하는 방법을 다룹니다.

## 빠르게 시작하기 <!-- Quick start -->

애드온을 만드는 가장 쉬운 방법은 `addon` 템플릿을 사용하는 것입니다:

```sh
npx sv create --template addon [path]
```

새로 만든 프로젝트에는 안내를 위한 `README.md`와 `CONTRIBUTING.md`가 들어 있습니다.

## 프로젝트 구조 <!-- Project structure -->

애드온은 보통 다음과 같은 모습입니다:

```js
import { transforms } from '@sveltejs/sv-utils';
import { defineAddon, defineAddonOptions } from 'sv';

export default defineAddon({
	id: 'addon-name',

	shortDescription: 'a better description of what your addon does ;)',

	options: defineAddonOptions()
		.add('who', {
			question: 'To whom should the addon say hello?',
			type: 'string' // boolean | number | select | multiselect
		})
		.build(),

	setup: ({ dependsOn, isKit, unsupported, addOption }) => {
		if (!isKit) unsupported('Requires SvelteKit');
		dependsOn('vitest');

		// dynamically add options (e.g. based on workspace state or fetched data)
		// addOption('key', { question: '...', type: 'boolean', default: true });
	},

	run: ({ isKit, cancel, sv, options, file, language, directory }) => {
		// Add "Hello [who]!" to the root page
		sv.file(
			directory.kitRoutes + '/+page.svelte',
			transforms.svelte(({ ast, svelte }) => {
				svelte.addFragment(ast, `<p>Hello ${options.who}!</p>`);
			})
		);
	},

	nextSteps: ({ options }) => ['enjoy the add-on!']
});
```

CLI는 경계가 분명한 두 개의 패키지로 나뉩니다:

- [**`sv`**](sv) = **어디서, 언제** 할지를 담당합니다. 경로, 워크스페이스 감지, 의존성 추적, 파일 I/O를 맡습니다. 엔진이 애드온 실행을 조율합니다.
- [**`@sveltejs/sv-utils`**](sv-utils) = 콘텐츠에 **무엇을** 할지를 담당합니다. 파서, 언어 도구, 타입이 지정된 변환을 제공합니다. 여기 있는 모든 것은 순수합니다. 파일 시스템에 접근하지 않고 워크스페이스도 알지 못합니다.

이렇게 나뉘어 있기 때문에 변환은 워크스페이스 없이 테스트할 수 있고, 여러 애드온에서 조합해 쓸 수 있습니다.

## 개발 <!-- Development -->

`file:` 프로토콜을 사용하면 애드온을 로컬에서 실행할 수 있습니다:

```sh
cd /path/to/test-project
npx sv add file:../path/to/my-addon
```

이렇게 하면 npm에 배포하지 않고도 빠르게 반복 작업을 할 수 있습니다.

`file:` 프로토콜은 배포할 생각이 없는 커스텀 애드온이나 비공개 애드온에도 쓸 수 있습니다. 예를 들어 팀이나 조직 전체의 프로젝트 설정을 표준화할 때 유용합니다.

> [!NOTE]
> `demo-add` 스크립트는 애드온을 실행하기 전에 자동으로 빌드합니다.

## 테스트 <!-- Testing -->

`sv/testing` 모듈은 애드온 테스트용 유틸리티를 제공합니다. `createSetupTest`는 vitest import를 받아 `setupTest` 함수를 반환하는 팩토리입니다. 템플릿으로 실제 SvelteKit 프로젝트를 만들고, 애드온을 실행한 뒤, 결과 파일에 접근할 수 있게 해 줍니다.

```js
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createSetupTest } from 'sv/testing';
import * as vitest from 'vitest';
import addon from './index.js';

const { test, testCases } = createSetupTest(vitest)(
	{ addon },
	{
		kinds: [
			{
				type: 'default',
				options: {
					'your-addon-name': { who: 'World' }
				}
			}
		],
		filter: (testCase) => testCase.variant.includes('kit'),
		browser: false
	}
);

test.concurrent.for(testCases)('my-addon $kind.type $variant', async (testCase, ctx) => {
	const cwd = ctx.cwd(testCase);

	const page = fs.readFileSync(path.resolve(cwd, 'src/routes/+page.svelte'), 'utf8');
	expect(page).toContain('Hello World!');
});
```

`vitest.config.js`에는 `sv/testing`의 전역 설정이 포함되어야 합니다:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.{js,ts}'],
		globalSetup: ['tests/setup/global.js']
	}
});
```

그리고 전역 테스트 설정 스크립트 `tests/setup/global.js`는 다음과 같습니다:

```js
import path from 'node:path';
import { setupGlobal } from 'sv/testing';
// test projects are scaffolded into `<project-root>/.test-output`
const TEST_DIR = path.resolve(import.meta.dirname, '..', '..', '.test-output');

export default setupGlobal({ TEST_DIR });
```

## 배포하기 <!-- Publishing -->

### 번들링 <!-- Bundling -->

커뮤니티 애드온은 [tsdown](https://tsdown.dev/)으로 하나의 파일로 번들됩니다. `sv`를 제외한 모든 것이 번들됩니다(`sv`는 런타임에 제공되는 peer 의존성입니다).

`sv`는 자체적으로 [`@sveltejs/sv-utils`](sv-utils) 사본을 함께 제공하므로, 이를 번들하지 않은 애드온도 여전히 로드됩니다. 다만 버전은 검증되지 않습니다. 애드온은 `sv`가 제공하는 버전이 무엇이든 그것으로 실행되며, 그 버전의 호환성이 깨지는 변경을 따라가는 것은 여러분의 몫입니다. 직접 관리하는 버전을 유지하려면 번들하세요.

### `package.json`

애드온은 `sv`를 peer 의존성으로 가져야 합니다. 선언한 `dependencies`는 런타임에 사용할 수 **없으므로**, 모든 것을 번들해야 합니다:

```jsonc
{
	"name": "@my-org/sv",
	"version": "1.0.0",
	"type": "module",
	// bundled entry point (tsdown outputs .mjs for ESM)
	"exports": {
		".": { "default": "./dist/index.mjs" }
	},
	"publishConfig": {
		"access": "public"
	},
	// packages declared here will not be available during runtime, it must be bundled
	"dependencies": {},
	"peerDependencies": {
		// minimum version required to run by this add-on
		"sv": "^0.13.0"
	},
	// Add the "sv-add" keyword so users can discover your add-on with https://www.npmx.dev/search?q=keyword:sv-add
	"keywords": ["sv-add", "svelte", "sveltekit"]
}
```

### 패키지 이름 <!-- Package names -->

이름은 npm과 같은 [제약](https://npmx.dev/package/validate-npm-package-name#user-content-naming-rules)을 따릅니다:

```sh
npx sv add my-addon
npx sv add @my-org/sv
npx sv add @my-org/foo
```

`@<org>/sv`로 배포한 애드온은 `@<org>`로도 설치할 수 있습니다. 다음은 모두 같은 패키지로 해석됩니다:

```sh
npx sv add @my-org
npx sv add @my-org/sv
npx sv add @my-org/sv@latest
```

특정 버전을 쓰려면 `@<semver>`를 덧붙이세요:

```sh
npx sv add @my-org/sv@1.2.3
npx sv add my-addon@1.2.3
```

### 진입점 <!-- Entry points -->

CLI는 먼저 `./sv`를 찾습니다. 찾지 못하면 기본값으로 `.` 진입점을 사용합니다. 따라서 두 가지 방법이 있습니다:

1. **기본 export** (애드온 전용 패키지의 경우):

```json
{
	"name": "@my-org/sveltekit-addon",
	"exports": {
		".": "./dist/addon.mjs"
	}
}
```

2. **`./sv` export** (다른 기능도 export하는 패키지의 경우):

```json
{
	"name": "@my-org/sveltekit-addon",
	"exports": {
		".": "./dist/main.mjs",
		"./sv": "./dist/addon.mjs"
	}
}
```

### npm에 배포하기 <!-- Publish to npm -->

```sh
npm login
npm publish
```

> `prepublishOnly`가 배포 전에 자동으로 빌드를 실행합니다.

## 다음 단계 <!-- Next steps -->

원한다면 애드온 실행 후 콘솔에 안내 문구를 표시할 수 있습니다:

```js
import { color } from '@sveltejs/sv-utils';

export default defineAddon({
	// ...

	nextSteps: ({ options }) => [
		`Run ${color.command('npm run dev')} to start developing`,
		`Check out the docs at https://...`
	]
});
```

## 버전 호환성 <!-- Version compatibility -->

애드온은 `peerDependencies`에 최소 `sv` 버전을 지정해야 합니다. 사용자의 `sv` 메이저 버전이 지정한 버전과 다르면 호환성 경고가 표시됩니다.

## 예시 <!-- Examples -->

실제 사례는 [공식 애드온 소스 코드](https://github.com/sveltejs/cli/tree/main/packages/sv/src/addons)에서 볼 수 있습니다.
