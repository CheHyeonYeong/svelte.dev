---
title: sv-utils
---

`@sveltejs/sv-utils`는 코드를 파싱하고, 변환하고, 생성하기 위한 애드온 유틸리티입니다.

```sh
npm install -D @sveltejs/sv-utils
```

## transforms

`transforms`는 추상 구문 트리(AST)를 통해 파일을 수정할 수 있게 해 주는, 파서를 인식하는 함수 모음입니다. 콜백 함수를 받으며, 반환값은 `sv.file()`에 바로 전달할 수 있도록 설계되어 있습니다. 어떤 파서를 쓸지는 변환 타입에 이미 정해져 있습니다. 파서를 직접 호출할 일이 없으므로 vite 설정을 실수로 Svelte로 파싱하는 일도 생기지 않습니다.

각 변환은 관련 유틸리티를 콜백에 주입하므로, import는 하나만 있으면 됩니다:

```js
import { transforms } from '@sveltejs/sv-utils';

transforms.script(/* ... */);
transforms.svelte(/* ... */);
// ...
```

### `transforms.script`

JavaScript/TypeScript 파일을 변환합니다. 콜백은 `{ ast, comments, content, js }`를 받습니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	file.viteConfig,
	transforms.script(({ ast, js }) => {
		js.imports.addDefault(ast, { as: 'foo', from: 'foo' });
		js.vite.addPlugin(ast, { code: 'foo()' });
	})
);
```

### `transforms.svelte`

Svelte 컴포넌트를 변환합니다. 콜백은 `{ ast, content, svelte, js }`를 받습니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	layoutPath,
	transforms.svelte(({ ast, svelte }) => {
		svelte.addFragment(ast, '<Foo />');
	})
);
```

### `transforms.svelteScript`

`<script>` 블록이 반드시 있는 상태로 Svelte 컴포넌트를 변환합니다. 첫 번째 인자로 `{ language }`를 전달하세요. 콜백은 `{ ast, content, svelte, js }`를 받으며, 이때 `ast.instance`는 항상 null이 아닙니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	layoutPath,
	transforms.svelteScript({ language: 'ts' }, ({ ast, svelte, js }) => {
		js.imports.addDefault(ast.instance.content, { as: 'Foo', from: './Foo.svelte' });
		svelte.addFragment(ast, '<Foo />');
	})
);
```

### `transforms.css`

CSS 파일을 변환합니다. 콜백은 `{ ast, content, css }`를 받습니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	file.stylesheet,
	transforms.css(({ ast, css }) => {
		css.addAtRule(ast, { name: 'import', params: "'tailwindcss'" });
	})
);
```

### `transforms.json`

JSON 파일을 변환합니다. `data` 객체를 직접 변경하세요. 콜백은 `{ data, content, json }`을 받습니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	file.typeConfig,
	transforms.json(({ data }) => {
		data.compilerOptions ??= {};
		data.compilerOptions.strict = true;
	})
);
```

### `transforms.yaml` / `transforms.toml`

`transforms.json`과 같은 패턴으로, 각각 YAML 파일과 TOML 파일에 사용합니다. 콜백은 `{ data, content }`를 받습니다.

### `transforms.text`

일반 텍스트 파일(.env, .gitignore 등)을 변환합니다. 파서 없이 문자열을 받아 문자열을 반환합니다. 콜백은 `{ content, text }`를 받습니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	'.env',
	transforms.text(({ content }) => {
		return content + '\nDATABASE_URL="file:local.db"';
	})
);
```

### 변환 중단하기 <!-- Aborting a transform -->

어떤 변환 콜백에서든 `false`를 반환하면 중단됩니다. 이때 원래 콘텐츠가 변경 없이 반환됩니다.

```js
// @noErrors
import { transforms } from '@sveltejs/sv-utils';

sv.file(
	'eslint.config.js',
	transforms.script(({ ast, js }) => {
		const { value: existing } = js.exports.createDefault(ast, { fallback: myConfig });
		if (existing !== myConfig) {
			// config already exists, don't touch it
			return false;
		}
		// ... continue modifying ast
	})
);
```

### 단독 사용과 테스트 <!-- Standalone usage & testing -->

변환은 커링된 함수입니다. 콜백으로 호출한 뒤 콘텐츠에 적용하세요:

```js
import { transforms } from '@sveltejs/sv-utils';

const transform = transforms.script(({ ast, js }) => {
	js.imports.addDefault(ast, { as: 'foo', from: 'foo' });
});
const result = transform('export default {}');
```

### 조합 가능성 <!-- Composability -->

변환과 직접 편집을 섞어 써야 할 때는 콘텐츠 콜백과 함께 `sv.file`을 사용하고, 커링된 변환을 직접 호출하세요:

```js
// @noErrors
sv.file(path, (content) => {
	// curried
	const transform = transforms.script(({ ast, js }) => {
		js.imports.addDefault(ast, { as: 'foo', from: 'bar' });
	});

	// parser manipulation
	content = transform(content);

	// raw string manipulation
	content = content.replace('foo', 'baz');

	return content;
});
```

애드온은 재사용할 수 있는 변환 함수를 export할 수도 있습니다:

```js
// @errors: 7006
import { transforms } from '@sveltejs/sv-utils';

// reusable - export from your package
export const addFooImport = transforms.svelte(({ ast, svelte, js }) => {
	svelte.ensureScript(ast, { language });
	js.imports.addDefault(ast.instance.content, { as: 'Foo', from: './Foo.svelte' });
});
```

```js
sv.file('+page.svelte', addFooImport);
sv.file('index.svelte', addFooImport);
```

## 파서 (저수준) <!-- Parsers (low-level) -->

`transforms`는 대부분의 사용자 요구(예: 조건부 파싱, 파서 주변의 에러 처리)를 충족합니다. 그렇지 않은 경우에는 저수준 API인 `parse`를 사용할 수 있습니다:

```js
// @noErrors
import { parse } from '@sveltejs/sv-utils';

const { ast, generateCode } = parse.script(content);
const { ast, generateCode } = parse.svelte(content);
const { ast, generateCode } = parse.css(content);
const { data, generateCode } = parse.json(content);
const { data, generateCode } = parse.yaml(content);
const { data, generateCode } = parse.toml(content);
const { ast, generateCode } = parse.html(content);
```

## 언어 도구 <!-- Language tooling -->

AST 조작을 위한 네임스페이스별 헬퍼:

- **`js.*`** - import, export, 객체, 배열, 변수, 함수, vite 설정 헬퍼, SvelteKit 헬퍼
- **`css.*`** - 규칙, 선언, at-rule, import
- **`svelte.*`** - ensureScript, addSlot, addFragment
- **`json.*`** - arrayUpsert, packageScriptsUpsert
- **`html.*`** - 속성 조작
- **`text.*`** - 단순 텍스트 파일(.env, .gitignore)의 줄 upsert

## Svelte 설정 <!-- Svelte config -->

svelte/kit 설정은 두 곳에 둘 수 있습니다. `vite.config.{js,ts}`의 `sveltekit()` 플러그인에 바로 전달하거나, 별도의 `svelte.config.{js,ts}`에서 default export로 내보내는 것입니다. `sv`로 만든 프로젝트는 설정을 `vite.config.js` 안에 두며 `svelte.config.js`를 포함하지 않습니다.

`svelteConfig`를 사용하면 애드온이 설정이 어디에 있는지 알 필요 없이 그 설정을 읽고 편집할 수 있습니다. 설정은 `vite.config.{js,ts}`의 `sveltekit()` 인자일 수도 있고, `svelte.config.{js,ts}`의 default export일 수도 있습니다.

### `svelteConfig.edit`

옵션을 이름으로 지정하면 헬퍼가 각 옵션을 알맞은 위치에 써 주므로, `kit` 중첩을 직접 다룰 필요가 없습니다. Svelte 수준 옵션(`compilerOptions`, `preprocess`, `extensions`, `vitePlugin`)은 설정 객체에 바로 놓입니다. 그 밖의 모든 옵션(`adapter`, `alias`, `files`, `typescript`, …)은 kit 옵션으로, vite 설정에서는 `sveltekit()` 인자에 평평하게 펼쳐지고 `svelte.config`에서는 `kit` 아래에 중첩됩니다.

```js
// @noErrors
import { svelteConfig } from '@sveltejs/sv-utils';

// inside an add-on's `run({ sv, cwd })`:
svelteConfig.edit({ sv, cwd }, ({ ast, property, override, js }) => {
	// svelte-level option - get-or-create its value, then mutate in place:
	js.array.append(property('extensions', { fallback: js.array.create() }), '.svx');

	// kit option - routed automatically, no `kit` nesting to think about:
	js.imports.addDefault(ast, { from: '@sveltejs/adapter-node', as: 'adapter' });
	override({
		adapter: js.functions.createCall({ name: 'adapter', args: [], useIdentifiers: true })
	});
});
```

- **`property(name, { fallback })`** - 제자리에서 변경할 옵션 값(배열, 중첩 객체)을 가져오거나, 없으면 만듭니다.
- **`override(props, { dropLeadingComments })`** - 옵션을 설정하거나 교체합니다. `dropLeadingComments`는 더 이상 맞지 않게 된 앞쪽 주석(예: 어댑터를 바꿀 때 adapter-auto 관련 메모)을 지웁니다.

`sv.file`을 통해 쓰기 때문에 이 편집도 다른 편집과 똑같이 추적됩니다. 프로젝트에 두 설정 파일이 모두 없으면 `svelte.config.js`를 만듭니다.

### `svelteConfig.find` / `svelteConfig.read`

저수준 구성 요소로, 둘 다 주입된 `read(path)`(파일 내용 또는 `null`을 반환)를 통해 후보 파일을 읽기 때문에 감지가 정적으로 이루어집니다. 즉 설정은 절대 실행되지 않습니다:

- **`svelteConfig.find(read)`** - `{ path, kind }` 또는 `null`을 반환합니다(`kind`는 `'vite'` 또는 `'svelte'`이며, 둘 다 있으면 `svelte.config`가 우선합니다).
- **`svelteConfig.read(read)`** - 한 번에 찾고 파싱하여 `{ location, config, kit }`(객체 표현식) 또는 `null`을 반환합니다.

## 패키지 매니저 헬퍼 <!-- Package manager helpers -->

### `pnpm.allowBuilds`

`pnpm-workspace.yaml`의 pnpm "allow builds" 설정에 패키지를 추가하는 변환을 반환합니다. 프로젝트가 pnpm을 사용할 때 `sv.file`과 함께 사용하세요.

`cwd`는 대상 프로젝트입니다. 그곳에서 실행될 pnpm 버전(`pnpm --version`으로 확인)이 형식을 결정하므로, 실행하는 쪽의 `packageManager` 고정 버전은 사용되지 않습니다.

- pnpm `>= 11`: 통합된 `allowBuilds` 맵(`{ pkg: true }`)에 쓰며, 레거시 `onlyBuiltDependencies` 목록이 있으면 맵으로 마이그레이션합니다.
- pnpm `< 11`: 레거시 `onlyBuiltDependencies` 목록에 씁니다.

```js
// @noErrors
import { pnpm } from '@sveltejs/sv-utils';

if (packageManager === 'pnpm') {
	sv.file(
		file.findUp('pnpm-workspace.yaml'),
		pnpm.allowBuilds({ cwd, packages: ['my-native-dep'] })
	);
}
```

## 브라우저에서 사용하기 <!-- Browser usage -->

패키지 루트는 Node 전용 API(파일 시스템, 패키지 매니저 감지, 셸 조회, 터미널 색상)를 불러옵니다. 브라우저 번들(브라우저 내 플레이그라운드, 샌드박스 등)에서는 대신 `@sveltejs/sv-utils/browser`를 import하세요. 이 모듈은 환경에 구애받지 않는 부분만 제공합니다: `parse`, `transforms`, 언어 네임스페이스(`js`, `svelte`, `css`, `html`, `json`, `text`), `Walker`, `dedent`, 버전 헬퍼, `sanitizeName`, `minimizeDiff`, `createPrinter`, `downloadJson`.

```js
// @noErrors
import { parse, transforms } from '@sveltejs/sv-utils/browser';
```
