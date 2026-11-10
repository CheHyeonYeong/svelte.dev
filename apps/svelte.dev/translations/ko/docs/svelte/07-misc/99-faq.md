---
title: 자주 묻는 질문
---

## Svelte가 처음입니다. 어디서부터 시작해야 하나요? <!-- I'm new to Svelte. Where should I start? -->

직접 해 보는 [튜토리얼](/tutorial)을 따라가 보는 것이 가장 좋은 시작 방법이라고 생각합니다. 각 단계는 주로 한 가지 측면에 집중하며 따라가기 쉽습니다. 브라우저에서 바로 실제 Svelte 컴포넌트를 수정하고 실행해 보게 됩니다.

5~10분이면 시작하기에 충분합니다. 1시간 30분이면 튜토리얼 전체를 마칠 수 있습니다.

## 어디서 도움을 받을 수 있나요? <!-- Where can I get support? -->

특정 문법에 대한 질문이라면 [레퍼런스 문서](/docs/svelte)부터 보는 것이 좋습니다.

Stack Overflow는 코드 수준의 질문을 하거나 특정 에러에서 막혔을 때 많이 찾는 포럼입니다. [Svelte](https://stackoverflow.com/questions/tagged/svelte+or+svelte-3) 태그가 붙은 기존 질문을 읽어 보거나 [직접 질문하세요](https://stackoverflow.com/questions/ask?tags=svelte)!

모범 사례나 애플리케이션 아키텍처에 대해 토론하거나, 그저 다른 Svelte 사용자와 알고 지내기에 좋은 온라인 포럼과 채팅도 있습니다. [Discord](/chat)나 [Reddit 채널](https://www.reddit.com/r/sveltejs/)이 그 예입니다. 답이 있는 코드 수준의 질문이라면 보통 Stack Overflow가 더 적합합니다.

## 서드파티 자료가 있나요? <!-- Are there any third-party resources? -->

Svelte Society에서 [책과 영상 목록](https://sveltesociety.dev/collection/a-list-of-books-and-courses-ac01dd10363184fa)을 관리하고 있습니다.

## VS Code에서 .svelte 파일에 문법 강조를 적용하려면 어떻게 하나요? <!-- How can I get VS Code to syntax-highlight my .svelte files? -->

[Svelte용 공식 VS Code 확장](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)이 있습니다.

## .svelte 파일을 자동으로 포맷하는 도구가 있나요? <!-- Is there a tool to automatically format my .svelte files? -->

prettier를 [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 플러그인과 함께 사용할 수 있습니다.

## 컴포넌트를 문서화하려면 어떻게 하나요? <!-- How do I document my components? -->

Svelte Language Server를 사용하는 에디터에서는 특별한 형식의 주석으로 컴포넌트, 함수, export를 문서화할 수 있습니다.

````svelte
<script>
	/** What should we call the user? */
	export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```svelte
  <main name="Arethra">
  ```
-->
<main>
	<h1>
		Hello, {name}
	</h1>
</main>
````

참고: 컴포넌트를 설명하는 HTML 주석에는 `@component`가 반드시 있어야 합니다.

## Svelte는 규모가 커져도 괜찮나요? <!-- Does Svelte scale? -->

언젠가 이에 대한 블로그 글이 올라올 예정이지만, 그동안은 [이 이슈](https://github.com/sveltejs/svelte/issues/2546)를 확인해 보세요.

## UI 컴포넌트 라이브러리가 있나요? <!-- Is there a UI component library? -->

[패키지 페이지](/packages)에 여러 [UI 컴포넌트 라이브러리](/packages#component-libraries)와 독립형 컴포넌트가 소개되어 있습니다.

## Svelte 앱은 어떻게 테스트하나요? <!-- How do I test Svelte apps? -->

애플리케이션의 구조와 로직이 정의된 위치에 따라, 제대로 테스트하기 위한 가장 좋은 방법이 달라집니다. 모든 로직이 컴포넌트 안에 있어야 하는 것은 아니라는 점이 중요합니다. 데이터 변환, 컴포넌트 간 상태 관리, 로깅 같은 관심사가 그렇습니다. Svelte 라이브러리에는 자체 테스트 스위트가 있으므로, Svelte가 제공하는 구현 세부 사항을 검증하는 테스트를 작성할 필요는 없다는 점을 기억하세요.

Svelte 애플리케이션에는 보통 단위 테스트, 컴포넌트 테스트, 엔드 투 엔드(E2E) 테스트의 세 가지 테스트가 있습니다.

*단위 테스트*: 비즈니스 로직을 독립적으로 테스트하는 데 집중합니다. 대개 개별 함수와 엣지 케이스를 검증합니다. 이런 테스트의 범위를 최소화하면 가볍고 빠르게 유지할 수 있으며, Svelte 컴포넌트에서 로직을 최대한 많이 추출하면 애플리케이션의 더 많은 부분을 단위 테스트로 다룰 수 있습니다. 새 SvelteKit 프로젝트를 만들 때 단위 테스트용 [Vitest](https://vitest.dev/)를 설정할지 묻습니다. 그 밖에도 사용할 수 있는 테스트 러너가 여럿 있습니다.

*컴포넌트 테스트*: Svelte 컴포넌트가 생명주기 전반에 걸쳐 기대한 대로 마운트되고 상호작용하는지 검증하려면 문서 객체 모델(DOM)을 제공하는 도구가 필요합니다. (Svelte는 일반 라이브러리가 아니라 컴파일러이므로) 컴포넌트를 컴파일하고 마운트해서, 요소 구조, 리스너, 상태, 그리고 Svelte 컴포넌트가 제공하는 그 밖의 모든 기능에 대해 단언할 수 있습니다. 컴포넌트 테스트 도구로는 jsdom 같은 인메모리 구현을 [Vitest](https://vitest.dev/) 같은 테스트 러너와 함께 쓰는 것부터, [Playwright](https://playwright.dev/docs/test-components)나 [Cypress](https://www.cypress.io/)처럼 실제 브라우저를 활용해 시각적 테스트 기능을 제공하는 도구까지 다양합니다.

*엔드 투 엔드 테스트*: 사용자가 애플리케이션과 상호작용할 수 있는지 확인하려면, 프로덕션에 최대한 가까운 방식으로 애플리케이션 전체를 테스트해야 합니다. 이를 위해 배포된 버전의 애플리케이션을 불러와 상호작용하면서 사용자가 애플리케이션과 상호작용하는 방식을 시뮬레이션하는 엔드 투 엔드(E2E) 테스트를 작성합니다. 새 SvelteKit 프로젝트를 만들 때 엔드 투 엔드 테스트용 [Playwright](https://playwright.dev/)를 설정할지 묻습니다. 그 밖에도 사용할 수 있는 E2E 테스트 라이브러리가 많습니다.

테스트를 시작하는 데 도움이 되는 자료:

- [테스트에 관한 Svelte 문서](/docs/svelte/testing)
- [Svelte CLI로 Vitest 설정하기](/docs/cli/vitest)
- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/example/)
- [Cypress에서 Svelte 컴포넌트 테스트하기](https://docs.cypress.io/guides/component-testing/svelte/overview)
- [JSDOM과 함께 uvu 테스트 러너를 사용하는 예제](https://github.com/lukeed/uvu/tree/master/examples/svelte)
- [Vitest와 Playwright로 Svelte 컴포넌트 테스트하기](https://davipon.hashnode.dev/test-svelte-component-using-vitest-playwright)
- [WebdriverIO로 컴포넌트 테스트하기](https://webdriver.io/docs/component-testing/svelte)

## 라우터가 있나요? <!-- Is there a router? -->

공식 라우팅 라이브러리는 [SvelteKit](/docs/kit)입니다. SvelteKit은 파일 시스템 라우터, 서버 사이드 렌더링(SSR), 핫 모듈 리로딩(HMR)을 사용하기 쉬운 하나의 패키지로 제공합니다. React의 Next.js, Vue의 Nuxt.js와 비슷한 점이 있습니다. SvelteKit은 클라이언트 사이드 애플리케이션을 위한 해시 기반 라우팅도 지원합니다.

하지만 어떤 라우터 라이브러리든 사용할 수 있습니다. 사용할 수 있는 라우터 일부를 [패키지 페이지](/packages#routing)에서 소개하고 있습니다.

## Svelte로 모바일 앱을 만들려면 어떻게 하나요? <!-- How do I write a mobile app with Svelte? -->

대부분의 모바일 앱은 JavaScript 없이 작성되지만, 모바일 앱을 만들 때 기존 Svelte 컴포넌트와 Svelte 지식을 활용하고 싶다면 [Tauri](https://v2.tauri.app/start/frontend/sveltekit/)나 [Capacitor](https://capacitorjs.com/solution/svelte)로 [SvelteKit SPA](https://kit.svelte.dev/docs/single-page-apps)를 모바일 앱으로 바꿀 수 있습니다. 카메라, 위치 정보, 푸시 알림 같은 모바일 기능은 두 플랫폼 모두에서 플러그인으로 사용할 수 있습니다.

React Native가 제공하는 인프라를 활용하는 [Symbiote Native](https://docs.symbiote-native.dev/)를 사용하면 네이티브 컴포넌트로 컴파일되는 앱을 Svelte로 작성할 수도 있습니다.

[Svelte 5의 커스텀 렌더러 지원](https://github.com/sveltejs/svelte/issues/15470) 작업은 완료되었지만, 이 기능은 아직 병합되지 않았습니다. 커스텀 렌더링 API가 도입되면 Lynx JS나 Svelte Native 같은 다른 모바일 프레임워크도 지원할 수 있게 됩니다. Symbiote Native도 이 API를 도입할 예정입니다. Svelte Native는 Svelte 4에서 쓸 수 있던 선택지였지만, 현재 Svelte 5는 이를 지원하지 않습니다. Svelte Native를 사용하면 DOM 요소 대신 [NativeScript UI 컴포넌트](https://docs.nativescript.org/ui/)를 담은 Svelte 컴포넌트로 NativeScript 앱을 작성할 수 있습니다.

## 사용하지 않는 스타일을 제거하지 않게 할 수 있나요? <!-- Can I tell Svelte not to remove my unused styles? -->

아니요. Svelte는 그대로 두면 생길 문제를 막기 위해 컴포넌트에서 해당 스타일을 제거하고 경고를 표시합니다.

Svelte의 컴포넌트 스타일 범위 지정은 해당 컴포넌트에 고유한 클래스를 생성해, 컴포넌트 안에서 Svelte가 제어하는 관련 요소에 추가하고, 그 컴포넌트 스타일의 각 선택자에도 추가하는 방식으로 동작합니다. 컴파일러가 스타일 선택자가 어떤 요소에 적용되는지 알 수 없을 때, 그 선택자를 유지하는 방법은 두 가지인데 둘 다 좋지 않습니다:

- 선택자를 유지하고 범위 지정 클래스를 추가하면, 선택자는 컴포넌트 안에서 기대한 요소와 일치하지 않을 가능성이 크고, 그 요소가 자식 컴포넌트나 `{@html ...}`로 만들어졌다면 절대 일치하지 않습니다.
- 범위 지정 클래스를 추가하지 않고 선택자를 유지하면, 그 스타일은 전역 스타일이 되어 페이지 전체에 영향을 줍니다.

컴파일 시점에 Svelte가 식별할 수 없는 무언가에 스타일을 적용해야 한다면, `:global(...)`을 사용해 명시적으로 전역 스타일을 선택해야 합니다. 다만 선택자의 일부만 `:global(...)`로 감쌀 수 있다는 점도 기억하세요. `.foo :global(.bar) { ... }`는 컴포넌트의 `.foo` 요소 안에 나타나는 모든 `.bar` 요소에 스타일을 적용합니다. 현재 컴포넌트에 기준이 되는 부모 요소가 있기만 하면, 이런 부분 전역 선택자로 거의 항상 원하는 결과를 얻을 수 있습니다.

## Svelte v2를 아직 사용할 수 있나요? <!-- Is Svelte v2 still available? -->

새 기능은 추가되지 않으며, 버그는 아주 심각하거나 일종의 보안 취약점이 있는 경우에만 수정될 것입니다.

문서는 [여기](https://github.com/sveltejs/v2.svelte.dev/tree/master/content)에서 여전히 볼 수 있습니다.

## 핫 모듈 리로딩은 어떻게 하나요? <!-- How do I do hot module reloading? -->

[SvelteKit](/docs/kit) 사용을 권장합니다. SvelteKit은 HMR을 기본으로 지원하며 [Vite](https://vitejs.dev/)와 [svelte-hmr](https://github.com/sveltejs/svelte-hmr)를 기반으로 만들어졌습니다. [rollup](https://github.com/rixo/rollup-plugin-svelte-hot)과 [webpack](https://github.com/sveltejs/svelte-loader)용 커뮤니티 플러그인도 있습니다.
