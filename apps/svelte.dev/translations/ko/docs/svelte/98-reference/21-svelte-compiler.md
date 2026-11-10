---
title: svelte/compiler
---



```js
// @noErrors
import {
	VERSION,
	compile,
	compileModule,
	migrate,
	parse,
	parseCss,
	preprocess,
	print,
	walk
} from 'svelte/compiler';
```

## VERSION

package.json에 설정된 현재 버전입니다.

<div class="ts-block">

```dts
const VERSION: string;
```

</div>



## compile

`compile`은 `.svelte` 소스 코드를 컴포넌트를 export하는 JavaScript 모듈로 변환합니다

<div class="ts-block">

```dts
function compile(
	source: string,
	options: CompileOptions
): CompileResult;
```

</div>



## compileModule

`compileModule`은 룬이 포함된 JavaScript 소스 코드를 받아 JavaScript 모듈로 변환합니다.

<div class="ts-block">

```dts
function compileModule(
	source: string,
	options: ModuleCompileOptions
): CompileResult;
```

</div>



## migrate

Svelte 코드가 룬, 이벤트 속성, 렌더 태그를 사용하도록 최대한 마이그레이션합니다.
코드가 너무 복잡해서 자동으로 마이그레이션할 수 없으면 에러를 던질 수 있습니다.

<div class="ts-block">

```dts
function migrate(
	source: string,
	{
		filename,
		use_ts
	}?:
		| {
				filename?: string;
				use_ts?: boolean;
		  }
		| undefined
): {
	code: string;
};
```

</div>



## parse

parse 함수는 컴포넌트를 파싱하여 추상 구문 트리(AST)만 반환합니다.

`modern` 옵션(Svelte 5에서는 기본값 `false`)을 사용하면 파서가 레거시 AST 대신 모던 AST를 반환합니다.
Svelte 6에서는 `modern`의 기본값이 `true`가 되며, Svelte 7에서는 이 옵션이 제거됩니다.

<div class="ts-block">

```dts
function parse(
	source: string,
	options: {
		filename?: string;
		modern: true;
		loose?: boolean;
	}
): AST.Root;
```

</div>

<div class="ts-block">

```dts
function parse(
	source: string,
	options?:
		| {
				filename?: string;
				modern?: false;
				loose?: boolean;
		  }
		| undefined
): Record<string, any>;
```

</div>



## parseCss

parseCss 함수는 CSS 스타일시트를 파싱하여 추상 구문 트리를 반환합니다.

<div class="ts-block">

```dts
function parseCss(source: string): AST.CSS.StyleSheetFile;
```

</div>



## preprocess

preprocess 함수는 컴포넌트 소스 코드를 원하는 대로 변환할 수 있는 편리한 훅을 제공합니다.
예를 들어 `<style lang="sass">` 블록을 일반 CSS로 변환하는 데 쓸 수 있습니다.

<div class="ts-block">

```dts
function preprocess(
	source: string,
	preprocessor: PreprocessorGroup | PreprocessorGroup[],
	options?:
		| {
				filename?: string;
		  }
		| undefined
): Promise<Processed>;
```

</div>



## print

`print`는 Svelte AST 노드를 다시 Svelte 소스 코드로 변환합니다.
주로 컴파일러의 모던 AST 표현을 사용해 컴포넌트를 파싱하고 변환하는 도구를 위한 함수입니다.

`print(ast)`에는 modern: true로 parse해서 만든 AST 노드나, 그 모던 AST 안의 하위 노드를 넘겨야 합니다.
결과에는 생성된 소스와 그에 대응하는 소스 맵이 들어 있습니다.
출력은 유효한 Svelte 코드이지만, 공백이나 따옴표 같은 서식은 원본과 다를 수 있습니다.

<div class="ts-block">

```dts
function print(
	ast: AST.SvelteNode,
	options?: Options | undefined
): {
	code: string;
	map: any;
};
```

</div>



## walk

<blockquote class="tag deprecated note">

`import { walk } from 'estree-walker'`로 대체하세요

</blockquote>

<div class="ts-block">

```dts
function walk(): never;
```

</div>



## AST

<div class="ts-block">

```dts
namespace AST {
	export interface BaseNode {
		type: string;
		start: number;
		end: number;
	}

	export interface Fragment {
		type: 'Fragment';
		nodes: Array<
			Text | Tag | ElementLike | Block | Comment
		>;
	}

	export interface Root extends BaseNode {
		type: 'Root';
		/**
		 * Inline options provided by `<svelte:options>` — these override options passed to `compile(...)`
		 */
		options: SvelteOptions | null;
		fragment: Fragment;
		/** The parsed `<style>` element, if exists */
		css: AST.CSS.StyleSheet | null;
		/** The parsed `<script>` element, if exists */
		instance: Script | null;
		/** The parsed `<script module>` element, if exists */
		module: Script | null;
		/** Comments found in <script> and {expressions} */
		comments: JSComment[];
	}

	export interface SvelteOptions {
		// start/end info (needed for warnings and for our Prettier plugin)
		start: number;
		end: number;
		// options
		runes?: boolean;
		immutable?: boolean;
		accessors?: boolean;
		preserveWhitespace?: boolean;
		namespace?: Namespace;
		css?: 'injected';
		customElement?: {
			tag?: string;
			shadow?:
				| 'open'
				| 'none'
				| ObjectExpression
				| undefined;
			props?: Record<
				string,
				{
					attribute?: string;
					reflect?: boolean;
					type?:
						| 'Array'
						| 'Boolean'
						| 'Number'
						| 'Object'
						| 'String';
				}
			>;
			/**
			 * Is of type
			 * ```ts
			 * (ceClass: new () => HTMLElement) => new () => HTMLElement
			 * ```
			 */
			extend?: ArrowFunctionExpression | Identifier;
		};
		attributes: Attribute[];
	}

	/** Static text */
	export interface Text extends BaseNode {
		type: 'Text';
		/** Text with decoded HTML entities */
		data: string;
		/** The original text, with undecoded HTML entities */
		raw: string;
	}

	/** A (possibly reactive) template expression — `{...}` */
	export interface ExpressionTag extends BaseNode {
		type: 'ExpressionTag';
		expression: Expression;
	}

	/** A (possibly reactive) HTML template expression — `{@html ...}` */
	export interface HtmlTag extends BaseNode {
		type: 'HtmlTag';
		expression: Expression;
	}

	/** An HTML comment */
	// TODO rename to disambiguate
	export interface Comment extends BaseNode {
		type: 'Comment';
		/** the contents of the comment */
		data: string;
	}

	/** A `{@const ...}` tag */
	export interface ConstTag extends BaseNode {
		type: 'ConstTag';
		declaration: VariableDeclaration & {
			declarations: [
				VariableDeclarator & {
					id: Pattern;
					init: Expression;
				}
			];
		};
	}

	/** A `{let ...}` or `{const ...}` tag */
	export interface DeclarationTag extends BaseNode {
		type: 'DeclarationTag';
		declaration: VariableDeclaration;
	}

	/** A `{@debug ...}` tag */
	export interface DebugTag extends BaseNode {
		type: 'DebugTag';
		identifiers: Identifier[];
	}

	/** A `{@render foo(...)} tag */
	export interface RenderTag extends BaseNode {
		type: 'RenderTag';
		expression:
			| SimpleCallExpression
			| (ChainExpression & {
					expression: SimpleCallExpression;
			  });
	}

	/** A `{@attach foo(...)} tag */
	export interface AttachTag extends BaseNode {
		type: 'AttachTag';
		expression: Expression;
	}

	/** An `animate:` directive */
	export interface AnimateDirective extends BaseAttribute {
		type: 'AnimateDirective';
		/** The 'x' in `animate:x` */
		name: string;
		/** The y in `animate:x={y}` */
		expression: null | Expression;
	}

	/** A `bind:` directive */
	export interface BindDirective extends BaseAttribute {
		type: 'BindDirective';
		/** The 'x' in `bind:x` */
		name: string;
		/** The y in `bind:x={y}` */
		expression:
			| Identifier
			| MemberExpression
			| SequenceExpression;
	}

	/** A `class:` directive */
	export interface ClassDirective extends BaseAttribute {
		type: 'ClassDirective';
		/** The 'x' in `class:x` */
		name: 'class';
		/** The 'y' in `class:x={y}`, or the `x` in `class:x` */
		expression: Expression;
	}

	/** A `let:` directive */
	export interface LetDirective extends BaseAttribute {
		type: 'LetDirective';
		/** The 'x' in `let:x` */
		name: string;
		/** The 'y' in `let:x={y}` */
		expression:
			| null
			| Identifier
			| ArrayExpression
			| ObjectExpression;
	}

	/** An `on:` directive */
	export interface OnDirective extends BaseAttribute {
		type: 'OnDirective';
		/** The 'x' in `on:x` */
		name: string;
		/** The 'y' in `on:x={y}` */
		expression: null | Expression;
		modifiers: Array<
			| 'capture'
			| 'nonpassive'
			| 'once'
			| 'passive'
			| 'preventDefault'
			| 'self'
			| 'stopImmediatePropagation'
			| 'stopPropagation'
			| 'trusted'
		>;
	}

	/** A `style:` directive */
	export interface StyleDirective extends BaseAttribute {
		type: 'StyleDirective';
		/** The 'x' in `style:x` */
		name: string;
		/** The 'y' in `style:x={y}` */
		value:
			| true
			| ExpressionTag
			| Array<ExpressionTag | Text>;
		modifiers: Array<'important'>;
	}

	// TODO have separate in/out/transition directives
	/** A `transition:`, `in:` or `out:` directive */
	export interface TransitionDirective extends BaseAttribute {
		type: 'TransitionDirective';
		/** The 'x' in `transition:x` */
		name: string;
		/** The 'y' in `transition:x={y}` */
		expression: null | Expression;
		modifiers: Array<'local' | 'global'>;
		/** True if this is a `transition:` or `in:` directive */
		intro: boolean;
		/** True if this is a `transition:` or `out:` directive */
		outro: boolean;
	}

	/** A `use:` directive */
	export interface UseDirective extends BaseAttribute {
		type: 'UseDirective';
		/** The 'x' in `use:x` */
		name: string;
		/** The 'y' in `use:x={y}` */
		expression: null | Expression;
	}

	export interface BaseElement extends BaseNode {
		name: string;
		name_loc: SourceLocation;
		attributes: Array<
			Attribute | SpreadAttribute | Directive | AttachTag
		>;
		fragment: Fragment;
	}

	export interface Component extends BaseElement {
		type: 'Component';
	}

	export interface TitleElement extends BaseElement {
		type: 'TitleElement';
		name: 'title';
	}

	export interface SlotElement extends BaseElement {
		type: 'SlotElement';
		name: 'slot';
	}

	export interface RegularElement extends BaseElement {
		type: 'RegularElement';
	}

	export interface SvelteBody extends BaseElement {
		type: 'SvelteBody';
		name: 'svelte:body';
	}

	export interface SvelteComponent extends BaseElement {
		type: 'SvelteComponent';
		name: 'svelte:component';
		expression: Expression;
	}

	export interface SvelteDocument extends BaseElement {
		type: 'SvelteDocument';
		name: 'svelte:document';
	}

	export interface SvelteElement extends BaseElement {
		type: 'SvelteElement';
		name: 'svelte:element';
		tag: Expression;
	}

	export interface SvelteFragment extends BaseElement {
		type: 'SvelteFragment';
		name: 'svelte:fragment';
	}

	export interface SvelteBoundary extends BaseElement {
		type: 'SvelteBoundary';
		name: 'svelte:boundary';
	}

	export interface SvelteHead extends BaseElement {
		type: 'SvelteHead';
		name: 'svelte:head';
	}

	/** This is only an intermediate representation while parsing, it doesn't exist in the final AST */
	export interface SvelteOptionsRaw extends BaseElement {
		type: 'SvelteOptions';
		name: 'svelte:options';
	}

	export interface SvelteSelf extends BaseElement {
		type: 'SvelteSelf';
		name: 'svelte:self';
	}

	export interface SvelteWindow extends BaseElement {
		type: 'SvelteWindow';
		name: 'svelte:window';
	}

	/** An `{#each ...}` block */
	export interface EachBlock extends BaseNode {
		type: 'EachBlock';
		expression: Expression;
		/** The `entry` in `{#each item as entry}`. `null` if `as` part is omitted */
		context: Pattern | null;
		body: Fragment;
		fallback?: Fragment;
		index?: string;
		key?: Expression;
	}

	/** An `{#if ...}` block */
	export interface IfBlock extends BaseNode {
		type: 'IfBlock';
		elseif: boolean;
		test: Expression;
		consequent: Fragment;
		alternate: Fragment | null;
	}

	/** An `{#await ...}` block */
	export interface AwaitBlock extends BaseNode {
		type: 'AwaitBlock';
		expression: Expression;
		// TODO can/should we move these inside the ThenBlock and CatchBlock?
		/** The resolved value inside the `then` block */
		value: Pattern | null;
		/** The rejection reason inside the `catch` block */
		error: Pattern | null;
		pending: Fragment | null;
		then: Fragment | null;
		catch: Fragment | null;
	}

	export interface KeyBlock extends BaseNode {
		type: 'KeyBlock';
		expression: Expression;
		fragment: Fragment;
	}

	export interface SnippetBlock extends BaseNode {
		type: 'SnippetBlock';
		expression: Identifier;
		parameters: Pattern[];
		typeParams?: string;
		body: Fragment;
	}

	export interface BaseAttribute extends BaseNode {
		name: string;
		name_loc: SourceLocation | null;
	}

	export interface Attribute extends BaseAttribute {
		type: 'Attribute';
		/**
		 * Quoted/string values are represented by an array, even if they contain a single expression like `"{x}"`
		 */
		value:
			| true
			| ExpressionTag
			| Array<Text | ExpressionTag>;
	}

	export interface SpreadAttribute extends BaseNode {
		type: 'SpreadAttribute';
		expression: Expression;
	}

	export interface Script extends BaseNode {
		type: 'Script';
		context: 'default' | 'module';
		content: Program;
		attributes: Attribute[];
	}

	export interface JSComment {
		type: 'Line' | 'Block';
		value: string;
		start: number;
		end: number;
		loc: {
			start: { line: number; column: number };
			end: { line: number; column: number };
		};
	}

	export type AttributeLike =
		| Attribute
		| SpreadAttribute
		| Directive;

	export type Directive =
		| AST.AnimateDirective
		| AST.BindDirective
		| AST.ClassDirective
		| AST.LetDirective
		| AST.OnDirective
		| AST.StyleDirective
		| AST.TransitionDirective
		| AST.UseDirective;

	export type Block =
		| AST.EachBlock
		| AST.IfBlock
		| AST.AwaitBlock
		| AST.KeyBlock
		| AST.SnippetBlock;

	export type ElementLike =
		| AST.Component
		| AST.TitleElement
		| AST.SlotElement
		| AST.RegularElement
		| AST.SvelteBody
		| AST.SvelteBoundary
		| AST.SvelteComponent
		| AST.SvelteDocument
		| AST.SvelteElement
		| AST.SvelteFragment
		| AST.SvelteHead
		| AST.SvelteOptionsRaw
		| AST.SvelteSelf
		| AST.SvelteWindow
		| AST.SvelteBoundary;

	export type Tag =
		| AST.AttachTag
		| AST.ConstTag
		| AST.DeclarationTag
		| AST.DebugTag
		| AST.ExpressionTag
		| AST.HtmlTag
		| AST.RenderTag;

	export type TemplateNode =
		| AST.Root
		| AST.Text
		| Tag
		| ElementLike
		| AST.Attribute
		| AST.SpreadAttribute
		| Directive
		| AST.AttachTag
		| AST.Comment
		| Block;

	export type SvelteNode =
		| Node
		| TemplateNode
		| AST.Fragment
		| _CSS.Node
		| Script;

	export type { _CSS as CSS };
}
```

</div>

## CompileError

<div class="ts-block">

```dts
interface CompileError extends ICompileDiagnostic {}
```

</div>

## CompileOptions

<div class="ts-block">

```dts
interface CompileOptions extends ModuleCompileOptions {/*…*/}
```

<div class="ts-block-property">

```dts
name?: string;
```

<div class="ts-block-property-details">

결과 JavaScript 클래스의 이름을 설정합니다(다만 스코프 안의 다른 변수와 충돌하면 컴파일러가 이름을 바꿉니다).
지정하지 않으면 `filename`에서 추론합니다

</div>
</div>

<div class="ts-block-property">

```dts
customElement?: boolean | ((options: { filename: string }) => boolean);
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 일반 Svelte 컴포넌트 대신 커스텀 엘리먼트 생성자를 만들도록 컴파일러에 지시합니다.

`{ filename }`을 받아 불리언을 반환하는 함수를 넘길 수도 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
accessors?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`
- <span class="tag deprecated">deprecated</span> 룬 모드에서는 아무 효과가 없습니다

</div>

`true`이면 컴포넌트의 props에 대한 getter와 setter를 만듭니다. `false`이면 읽기 전용으로 export된 값(즉 `const`, `class`, `function`으로 선언된 값)에 대해서만 만듭니다. `customElement: true`로 컴파일하면 이 옵션의 기본값은 `true`입니다.

</div>
</div>

<div class="ts-block-property">

```dts
namespace?: Namespace;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `'html'`

</div>

요소의 네임스페이스입니다. 예: `"html"`, `"svg"`, `"mathml"`.

</div>
</div>

<div class="ts-block-property">

```dts
immutable?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`
- <span class="tag deprecated">deprecated</span> 룬 모드에서는 아무 효과가 없습니다

</div>

`true`이면 어떤 객체도 변경(mutate)하지 않겠다고 컴파일러에 약속하는 것입니다.
그러면 컴파일러가 값이 바뀌었는지 덜 보수적으로 검사할 수 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
css?: 'injected' | 'external' | ((options: { filename: string }) => 'injected' | 'external');
```

<div class="ts-block-property-details">

- `'injected'`: `render(...)`를 사용할 때는 스타일이 `head`에 포함되고, 컴포넌트가 마운트될 때는 (아직 없다면) 문서에 주입됩니다. 커스텀 엘리먼트로 컴파일한 컴포넌트에서는 스타일이 섀도 루트에 주입됩니다.
- `'external'`: CSS가 컴파일 결과의 `css` 필드로만 반환됩니다. 대부분의 Svelte 번들러 플러그인은 이 값을 `'external'`로 설정하고 정적으로 생성된 CSS를 사용해 성능을 높입니다. JavaScript 번들이 작아지고 출력물을 캐시 가능한 `.css` 파일로 제공할 수 있기 때문입니다.
`customElement` 모드로 컴파일할 때는 항상 `'injected'`입니다.

`{ filename }`을 받아 `'injected'` 또는 `'external'`을 반환하는 함수를 넘길 수도 있습니다.

</div>
</div>

<div class="ts-block-property">

```dts
cssHash?: CssHashGetter;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `undefined`

</div>

`{ hash, css, name, filename }` 인자를 받아 스코프 CSS의 클래스 이름으로 쓸 문자열을 반환하는 함수입니다.
기본적으로 `svelte-${hash(filename ?? css)}`를 반환합니다.

</div>
</div>

<div class="ts-block-property">

```dts
preserveComments?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 HTML 주석을 출력에 남깁니다. 기본적으로는 제거됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
preserveWhitespace?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 요소 안과 요소 사이의 공백을 가능한 한 제거하거나 공백 하나로 합치지 않고, 입력한 그대로 유지합니다.

</div>
</div>

<div class="ts-block-property">

```dts
fragments?: 'html' | 'tree';
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `'html'`
- <span class="tag since">available since</span> v5.33

</div>

DOM 프래그먼트를 복제할 때 사용할 전략입니다:

- `html`은 `<template>`을 `innerHTML`로 채운 뒤 복제합니다. 더 빠르지만, 앱의 [콘텐츠 보안 정책(Content Security Policy)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)에 [`require-trusted-types-for 'script'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for)가 포함되어 있으면 사용할 수 없습니다
- `tree`는 프래그먼트를 요소 하나씩 만든 *다음에* 복제합니다. 더 느리지만 어디서나 동작합니다

</div>
</div>

<div class="ts-block-property">

```dts
runes?: boolean | undefined | ((options: { filename: string }) => boolean | undefined);
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `undefined`

</div>

룬을 사용한 흔적이 없어도 컴파일러를 강제로 룬 모드로 만들려면 `true`로 설정하세요.
룬을 사용한 흔적이 있어도 컴파일러가 룬을 무시하게 하려면 `false`로 설정하세요.
컴포넌트 코드에서 룬 모드 여부를 추론하려면 `undefined`(기본값)로 설정하세요.
Svelte로 컴파일하는 JS/TS 모듈에서는 항상 `true`입니다.
Svelte 6에서는 기본값이 `true`가 됩니다.
`svelte.config.js`에서 이 값을 `true`로 설정하면 `node_modules` 안의 컴포넌트까지 포함해 프로젝트 전체가 룬 모드로 강제된다는 점에 유의하세요.
이는 아마 원하는 동작이 아닐 것입니다. Vite를 사용한다면 대신 [dynamicCompileOptions](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#dynamiccompileoptions)를 사용하는 것을 고려하세요.

</div>
</div>

<div class="ts-block-property">

```dts
discloseVersion?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `true`

</div>

`true`이면 전역 `window.__svelte.v`에 저장된 `Set`에 Svelte 메이저 버전을 추가하여 브라우저에 노출합니다.

</div>
</div>

<div class="ts-block-property">

```dts
compatibility?: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag deprecated">deprecated</span> 코드를 마이그레이션하기 전까지 임시방편으로만 사용하세요

</div>

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
componentApi?: 4 | 5;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `5`

</div>

Svelte 파일의 default export를 Svelte 4에서와 같은 방식으로 인스턴스화할 수 있도록 변환을 적용합니다 —
브라우저용으로 컴파일할 때는 클래스로(`svelte/legacy`의 `createClassComponent(MyComponent, {...})`를 사용하는 것처럼),
서버용으로 컴파일할 때는 `.render(...)` 메서드를 가진 객체로 인스턴스화됩니다

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
sourcemap?: object | string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `null`

</div>

최종 출력 소스 맵에 병합될 초기 소스 맵입니다.
보통 전처리기의 소스 맵입니다.

</div>
</div>

<div class="ts-block-property">

```dts
outputFilename?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `null`

</div>

JavaScript 소스 맵에 사용됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
cssOutputFilename?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `null`

</div>

CSS 소스 맵에 사용됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
hmr?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 핫 리로딩을 지원하도록 컴포넌트를 컴파일합니다.

</div>
</div>

<div class="ts-block-property">

```dts
modernAst?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 모던 버전의 AST를 반환합니다.
Svelte 6에서는 기본값이 `true`가 되며, Svelte 7에서는 이 옵션이 제거됩니다.

</div>
</div></div>

## CompileResult

`svelte/compiler`의 `compile`이 반환하는 값

<div class="ts-block">

```dts
interface CompileResult {/*…*/}
```

<div class="ts-block-property">

```dts
js: {/*…*/};
```

<div class="ts-block-property-details">

컴파일된 JavaScript

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
code: string;
```

<div class="ts-block-property-details">

생성된 코드

</div>
</div>
<div class="ts-block-property">

```dts
map: SourceMap;
```

<div class="ts-block-property-details">

소스 맵

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
css: null | {/*…*/};
```

<div class="ts-block-property-details">

컴파일된 CSS

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
code: string;
```

<div class="ts-block-property-details">

생성된 코드

</div>
</div>
<div class="ts-block-property">

```dts
map: SourceMap;
```

<div class="ts-block-property-details">

소스 맵

</div>
</div>
<div class="ts-block-property">

```dts
hasGlobal: boolean;
```

<div class="ts-block-property-details">

CSS에 전역 규칙이 포함되어 있는지 여부

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
warnings: Warning[];
```

<div class="ts-block-property-details">

컴파일 중에 생성된 경고 객체의 배열입니다. 각 경고에는 다음 속성이 있습니다:
- `code`는 경고의 종류를 나타내는 문자열입니다
- `message`는 문제를 사람이 읽을 수 있는 말로 설명합니다
- `start`와 `end`는 경고가 특정 위치와 관련된 경우에 있으며, `line`, `column`, `character` 속성을 가진 객체입니다

</div>
</div>

<div class="ts-block-property">

```dts
metadata: {/*…*/};
```

<div class="ts-block-property-details">

컴파일된 컴포넌트에 대한 메타데이터

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
runes: boolean;
```

<div class="ts-block-property-details">

명시적인 옵션 때문이든 사용 방식에서 추론했든, 파일이 룬 모드로 컴파일되었는지 여부입니다.
`compileModule`에서는 항상 `true`입니다

</div>
</div></div>

</div>
</div>

<div class="ts-block-property">

```dts
ast: any;
```

<div class="ts-block-property-details">

AST

</div>
</div></div>

## MarkupPreprocessor

코드 문자열을 받아 처리된 버전을 반환하는 마크업 전처리기입니다.

<div class="ts-block">

```dts
type MarkupPreprocessor = (options: {
	/**
	 * The whole Svelte file content
	 */
	content: string;
	/**
	 * The filename of the Svelte file
	 */
	filename?: string;
}) => Processed | void | Promise<Processed | void>;
```

</div>

## ModuleCompileOptions

<div class="ts-block">

```dts
interface ModuleCompileOptions {/*…*/}
```

<div class="ts-block-property">

```dts
dev?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `false`

</div>

`true`이면 개발 중에 런타임 검사를 수행하고 디버깅 정보를 제공하는 코드가 추가됩니다.

</div>
</div>

<div class="ts-block-property">

```dts
generate?: 'client' | 'server' | false;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `'client'`

</div>

`"client"`이면 Svelte가 브라우저에서 실행되도록 설계된 코드를 생성합니다.
`"server"`이면 Svelte가 서버 사이드 렌더링에 적합한 코드를 생성합니다.
`false`이면 아무것도 생성하지 않습니다. 경고에만 관심 있는 도구에 유용합니다.

</div>
</div>

<div class="ts-block-property">

```dts
filename?: string;
```

<div class="ts-block-property-details">

디버깅 힌트와 소스 맵에 사용됩니다. 번들러 플러그인이 자동으로 설정합니다.

</div>
</div>

<div class="ts-block-property">

```dts
rootDir?: string;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag">default</span> `process.cwd() on node-like environments, undefined elsewhere`

</div>

파일 이름에 파일 시스템 정보가 새어 나가지 않도록 하는 데 사용됩니다. 번들러 플러그인이 자동으로 설정합니다.

</div>
</div>

<div class="ts-block-property">

```dts
warningFilter?: (warning: Warning) => boolean;
```

<div class="ts-block-property-details">

`Warning`을 인자로 받아 불리언을 반환하는 함수입니다.
경고를 걸러 낼 때 사용하세요. 경고를 유지하려면 `true`를, 버리려면 `false`를 반환하세요.

</div>
</div>

<div class="ts-block-property">

```dts
experimental?: {/*…*/};
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v5.36

</div>

실험적 옵션

<div class="ts-block-property-children"><div class="ts-block-property">

```dts
async?: boolean;
```

<div class="ts-block-property-details">

<div class="ts-block-property-bullets">

- <span class="tag since">available since</span> v5.36

</div>

파생 상태, 템플릿 표현식, 컴포넌트 최상위에서 `await` 키워드를 사용할 수 있게 합니다

</div>
</div></div>

</div>
</div></div>

## Preprocessor

코드 문자열을 받아 처리된 버전을 반환하는 script/style 전처리기입니다.

<div class="ts-block">

```dts
type Preprocessor = (options: {
	/**
	 * The script/style tag content
	 */
	content: string;
	/**
	 * The attributes on the script/style tag
	 */
	attributes: Record<string, string | boolean>;
	/**
	 * The whole Svelte file content
	 */
	markup: string;
	/**
	 * The filename of the Svelte file
	 */
	filename?: string;
}) => Processed | void | Promise<Processed | void>;
```

</div>

## PreprocessorGroup

전처리기 그룹은 Svelte 파일에 적용되는 전처리기들의 모음입니다.

<div class="ts-block">

```dts
interface PreprocessorGroup {/*…*/}
```

<div class="ts-block-property">

```dts
name?: string;
```

<div class="ts-block-property-details">

전처리기의 이름입니다. 다음 메이저 버전에서는 필수 옵션이 됩니다

</div>
</div>

<div class="ts-block-property">

```dts
markup?: MarkupPreprocessor;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
style?: Preprocessor;
```

<div class="ts-block-property-details"></div>
</div>

<div class="ts-block-property">

```dts
script?: Preprocessor;
```

<div class="ts-block-property-details"></div>
</div></div>

## Processed

전처리기 실행 결과입니다. 전처리기가 결과를 반환하지 않으면 코드가 바뀌지 않은 것으로 간주합니다.

<div class="ts-block">

```dts
interface Processed {/*…*/}
```

<div class="ts-block-property">

```dts
code: string;
```

<div class="ts-block-property-details">

새 코드

</div>
</div>

<div class="ts-block-property">

```dts
map?: string | object;
```

<div class="ts-block-property-details">

원본 코드로 매핑되는 소스 맵

</div>
</div>

<div class="ts-block-property">

```dts
dependencies?: string[];
```

<div class="ts-block-property-details">

변경을 감시할 추가 파일 목록

</div>
</div>

<div class="ts-block-property">

```dts
attributes?: Record<string, string | boolean>;
```

<div class="ts-block-property-details">

script/style 전처리기 전용: 태그에 설정할 업데이트된 속성입니다. undefined이면 속성은 바뀌지 않습니다.

</div>
</div>

<div class="ts-block-property">

```dts
toString?: () => string;
```

<div class="ts-block-property-details"></div>
</div></div>

## Warning

<div class="ts-block">

```dts
interface Warning extends ICompileDiagnostic {}
```

</div>


