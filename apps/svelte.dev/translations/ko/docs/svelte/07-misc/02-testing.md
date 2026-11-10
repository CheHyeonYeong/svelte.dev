---
title: 테스트
---

테스트는 코드를 작성하고 유지 관리하며 회귀(regression)를 막는 데 도움이 됩니다. 테스트 프레임워크는 코드가 어떻게 동작해야 하는지에 대한 단언(assertion)이나 기대(expectation)를 기술할 수 있게 해 이를 돕습니다. Svelte는 어떤 테스트 프레임워크를 쓰든 상관하지 않습니다. [Vitest](https://vitest.dev/), [Jasmine](https://jasmine.github.io/), [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev/) 같은 도구로 단위 테스트, 통합 테스트, 엔드 투 엔드 테스트를 작성할 수 있습니다.

## Vitest로 단위 테스트와 컴포넌트 테스트하기 <!-- Unit and component tests with Vitest -->

단위 테스트는 코드의 작고 독립된 부분을 테스트합니다. 통합 테스트는 애플리케이션의 여러 부분이 함께 잘 동작하는지 테스트합니다. (SvelteKit을 통해서든) Vite를 사용한다면 [Vitest](https://vitest.dev/)를 권장합니다. Svelte CLI를 사용하면 프로젝트를 만들 때나 그 이후에 [Vitest를 설정](/docs/cli/vitest)할 수 있습니다.

Vitest를 직접 설정하려면 먼저 설치하세요:

```sh
npm install -D vitest
```

그런 다음 `vite.config.js`를 수정하세요:

<!-- prettier-ignore -->
```js
/// file: vite.config.js
import { defineConfig } from +++'vitest/config'+++;

export default defineConfig({
	// ...
	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
```

> [!NOTE] (예를 들어 백엔드 라이브러리도 테스트하기 때문에) 모든 패키지의 브라우저 버전을 불러오는 것이 바람직하지 않다면, [별칭 설정을 써야 할 수도 있습니다](https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1909993331)

이제 `.js/.ts` 파일 안의 코드에 대한 단위 테스트를 작성할 수 있습니다:

```js
/// file: multiplier.svelte.test.js
// @filename: multiplier.svelte.ts
export function multiplier(initial: number, k: number) {
	let count = $state(initial);

	return {
		get value() {
			return count * k;
		},
		set: (c: number) => {
			count = c;
		}
	};
}
// @filename: multiplier.svelte.test.js
// ---cut---
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);

	expect(double.value).toEqual(0);

	double.set(5);

	expect(double.value).toEqual(10);
});
```

```js
/// file: multiplier.svelte.js
/**
 * @param {number} initial
 * @param {number} k
 */
export function multiplier(initial, k) {
	let count = $state(initial);

	return {
		get value() {
			return count * k;
		},
		/** @param {number} c */
		set: (c) => {
			count = c;
		}
	};
}
```

### 테스트 파일에서 룬 사용하기 <!-- Using runes inside your test files -->

Vitest는 테스트 파일을 소스 파일과 같은 방식으로 처리하므로, 파일 이름에 `.svelte`가 들어 있다면 테스트 안에서 룬을 사용할 수 있습니다:

```js
/// file: multiplier.svelte.test.js
// @filename: multiplier.svelte.ts
export function multiplier(getCount: () => number, k: number) {
	return {
		get value() {
			return getCount() * k;
		}
	};
}
// @filename: multiplier.svelte.test.js
// ---cut---
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);

	expect(double.value).toEqual(0);

	count = 5;

	expect(double.value).toEqual(10);
});
```

```js
/// file: multiplier.svelte.js
/**
 * @param {() => number} getCount
 * @param {number} k
 */
export function multiplier(getCount, k) {
	return {
		get value() {
			return getCount() * k;
		}
	};
}
```

테스트하는 코드가 이펙트를 사용한다면 테스트를 `$effect.root`로 감싸야 합니다:

```js
/// file: logger.svelte.test.js
// @filename: logger.svelte.ts
export function logger(fn: () => void) {}
// @filename: logger.svelte.test.js
// ---cut---
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { logger } from './logger.svelte.js';

test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);

		// logger uses an $effect to log updates of its input
		let log = logger(() => count);

		// effects normally run after a microtask,
		// use flushSync to execute all pending effects synchronously
		flushSync();
		expect(log).toEqual([0]);

		count = 1;
		flushSync();

		expect(log).toEqual([0, 1]);
	});

	cleanup();
});
```

```js
/// file: logger.svelte.js
/**
 * @param {() => any} getValue
 */
export function logger(getValue) {
	/** @type {any[]} */
	let log = [];

	$effect(() => {
		log.push(getValue());
	});

	return log;
}
```

### 컴포넌트 테스트 <!-- Component testing -->

컴포넌트를 독립적으로 테스트할 수 있습니다. 앱 전체를 띄우지 않고도 컴포넌트를 (실제 또는 모의) 브라우저에서 렌더링하고, 동작을 시뮬레이션하고, 단언을 작성할 수 있습니다.

> [!NOTE] 컴포넌트 테스트를 작성하기 전에, 정말 컴포넌트를 테스트해야 하는지, 아니면 컴포넌트 *안의* 로직을 테스트하려는 것인지 생각해 보세요. 후자라면 그 로직을 추출해 컴포넌트의 오버헤드 없이 독립적으로 테스트하는 것을 고려하세요.

시작하려면 jsdom(DOM API를 흉내 내는 라이브러리)을 설치하세요:

```sh
npm install -D jsdom
```

그런 다음 `vite.config.js`를 수정하세요:

```js
/// file: vite.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		/* ... */
	],
	test: {
		// If you are testing components client-side, you need to set up a DOM environment.
		// If not all your files should have this environment, you can use a
		// `// @vitest-environment jsdom` comment at the top of the test files instead.
		environment: 'jsdom'
	},
	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
```

그러고 나면 테스트 파일을 만들어 테스트할 컴포넌트를 import하고, 코드로 컴포넌트와 상호작용하며, 결과에 대한 기대를 작성할 수 있습니다:

```js
/// file: component.test.js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
	// Instantiate the component using Svelte's `mount` API
	const component = mount(Component, {
		target: document.body, // `document` exists because of jsdom
		props: { initial: 0 }
	});

	expect(document.body.innerHTML).toBe('<button>0</button>');

	// Click the button, then flush the changes so you can synchronously write expectations
	document.body.querySelector('button')?.click();
	flushSync();

	expect(document.body.innerHTML).toBe('<button>1</button>');

	// Remove the component from the DOM
	unmount(component);
});
```

이 과정은 아주 간단하지만, 저수준이고 다소 깨지기 쉽습니다. 컴포넌트의 정확한 구조는 자주 바뀔 수 있기 때문입니다. [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) 같은 도구를 쓰면 테스트를 간소화할 수 있습니다. 위 테스트는 다음과 같이 다시 쓸 수 있습니다:

```js
// @errors: 2339
/// file: component.test.js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', async () => {
	const user = userEvent.setup();
	render(Component);

	const button = screen.getByRole('button');
	expect(button).toHaveTextContent(0);

	await user.click(button);
	expect(button).toHaveTextContent(1);
});
```

양방향 바인딩, 컨텍스트, 스니펫 props가 관련된 컴포넌트 테스트를 작성할 때는 해당 테스트 전용 래퍼 컴포넌트를 만들어 그 래퍼와 상호작용하는 것이 가장 좋습니다. `@testing-library/svelte`에 몇 가지 [예제](https://testing-library.com/docs/svelte-testing-library/example)가 있습니다.

## Storybook으로 컴포넌트 테스트하기 <!-- Component tests with Storybook -->

[Storybook](https://storybook.js.org)은 UI 컴포넌트를 개발하고 문서화하는 도구이며, 컴포넌트 테스트에도 사용할 수 있습니다. 테스트는 Vitest의 브라우저 모드로 실행되며, 이 모드는 가장 현실적인 테스트 환경을 위해 컴포넌트를 실제 브라우저에서 렌더링합니다.

시작하려면 먼저 `npx sv add storybook`으로 프로젝트에 Storybook을 설치하고([Svelte CLI 사용](/docs/cli/storybook)), 테스트 기능이 포함된 권장 설정을 선택하세요. 이미 Storybook을 사용하고 있거나 Storybook의 테스트 기능에 대해 더 알고 싶다면 [Storybook 테스트 문서](https://storybook.js.org/docs/writing-tests?renderer=svelte)를 따라 시작하세요.

컴포넌트의 다양한 변형에 대한 스토리를 만들고 [play 함수](https://storybook.js.org/docs/writing-tests/interaction-testing?renderer=svelte#writing-interaction-tests)로 상호작용을 테스트할 수 있습니다. play 함수를 쓰면 Testing Library와 Vitest API로 동작을 시뮬레이션하고 단언을 작성할 수 있습니다. 다음은 테스트할 수 있는 두 스토리의 예입니다. 하나는 빈 LoginForm 컴포넌트를 렌더링하고, 다른 하나는 사용자가 폼을 채우는 상황을 시뮬레이션합니다:

```svelte
/// file: LoginForm.stories.svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';

	import LoginForm from './LoginForm.svelte';

	const { Story } = defineMeta({
		component: LoginForm,
		args: {
			// Pass a mock function to the `onSubmit` prop
			onSubmit: fn(),
		}
	});
</script>

<Story name="Empty Form" />

<Story
	name="Filled Form"
	play={async ({ args, canvas, userEvent }) => {
		// Simulate a user filling out the form
		await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
		await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
		await userEvent.click(canvas.getByRole('button'));

		// Run assertions
		await expect(args.onSubmit).toHaveBeenCalledTimes(1);
		await expect(canvas.getByText('You’re in!')).toBeInTheDocument();
	}}
/>
```

## Playwright로 엔드 투 엔드 테스트하기 <!-- End-to-end tests with Playwright -->

E2E('end to end'의 줄임말) 테스트는 사용자의 눈으로 애플리케이션 전체를 테스트합니다. 이 절에서는 [Playwright](https://playwright.dev/)를 예로 들지만, [Cypress](https://www.cypress.io/)나 [NightwatchJS](https://nightwatchjs.org/) 같은 다른 도구를 써도 됩니다.

Svelte CLI를 사용하면 프로젝트를 만들 때나 그 이후에 [Playwright를 설정](/docs/cli/playwright)할 수 있습니다. [`npm init playwright`로 설정](https://playwright.dev/docs/intro)할 수도 있습니다. 또한 IDE 안에서 테스트를 실행할 수 있도록 [VS Code 확장](https://playwright.dev/docs/getting-started-vscode) 같은 IDE 플러그인을 설치하는 것도 좋습니다.

`npm init playwright`를 실행했거나 Vite를 사용하지 않는다면, 테스트를 실행하기 전에 할 일(주로 특정 포트에서 애플리케이션 시작하기)을 Playwright에 알려 주도록 Playwright 설정을 수정해야 할 수 있습니다. 예를 들면 다음과 같습니다:

```js
/// file: playwright.config.js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
```

이제 테스트를 작성할 수 있습니다. 이 테스트는 Svelte라는 프레임워크를 전혀 알지 못하므로, 주로 DOM과 상호작용하며 단언을 작성하게 됩니다.

```js
// @errors: 2307 7031
/// file: tests/hello-world.spec.js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```
