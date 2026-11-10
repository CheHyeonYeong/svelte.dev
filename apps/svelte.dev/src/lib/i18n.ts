import { getContext, setContext } from 'svelte';
import { locales, type Locale } from './locales.ts';

// This module is shared between client and server, so it must not import server-only code.
export { locales, type Locale };

export function is_locale(value: string): value is Locale {
	return (locales as readonly string[]).includes(value);
}

/** Returns the locale a pathname belongs to, e.g. `/ko/docs/svelte/overview` -> `ko` */
export function get_locale(pathname: string): Locale | undefined {
	const segment = pathname.split('/')[1];
	return segment && is_locale(segment) ? segment : undefined;
}

/** Removes the locale prefix from a pathname, e.g. `/ko/docs/svelte/overview` -> `/docs/svelte/overview` */
export function strip_locale(pathname: string) {
	const locale = get_locale(pathname);
	return locale ? pathname.slice(locale.length + 1) || '/' : pathname;
}

export interface UI {
	/** Value for `<html lang>` */
	lang: string;
	/** Name of the language, in that language */
	name: string;
	nav: Record<'docs' | 'playground' | 'tutorial' | 'packages' | 'blog' | 'search', string>;
	search_placeholder: string;
	on_this_page: string;
	/** Suffix of docs page titles, e.g. "Svelte Docs" */
	docs_title: string;
	/** Suffix of tutorial page titles */
	tutorial_title: string;
	previous: string;
	next: string;
	edit_page: string;
	untranslated: string;
	view_original: string;
	contribute: string;
	edit_translation: string;
	/** The docs landing page (`/docs`) */
	landing: {
		head_title: string;
		title: string;
		/** HTML */
		intro: string;
		options: Array<{ href: string; title: string; description: string; external?: boolean }>;
	};
	/** The home page. Values marked HTML may contain links */
	home: {
		head_title: string;
		description: string;
		hero_title: string;
		get_started: string;
		docs_href: string;
		hero_alt: string;
		pronunciation_alt: string;
		definition: string;
		/** HTML */
		blurb: string;
		blurb_2: string;
		companies: string;
		documentary: string;
		community_title: string;
		/** HTML */
		community: string;
		photos_alt: string;
		/** HTML */
		photos_by: string;
		/** HTML */
		supporters: string;
		/** HTML, after "© <year> Svelte contributors." */
		footer: string;
	};
	/** The tutorial (`/tutorial`) */
	tutorial: {
		menu: string;
		reset: string;
		solve: string;
		previous_exercise: string;
		next_exercise: string;
		toggle_vim: string;
		copy_disabled_title: string;
		copy_disabled_body: string;
		copy_enable: string;
		ok: string;
	};
}

export const ui: Record<'en' | Locale, UI> = {
	en: {
		lang: 'en',
		name: 'English',
		nav: {
			docs: 'Docs',
			playground: 'Playground',
			tutorial: 'Tutorial',
			packages: 'Packages',
			blog: 'Blog',
			search: 'Search'
		},
		search_placeholder: 'Search',
		on_this_page: 'On this page',
		docs_title: 'Docs',
		tutorial_title: 'Svelte Tutorial',
		previous: 'previous',
		next: 'next',
		edit_page: 'Edit this page on GitHub',
		untranslated: '',
		view_original: '',
		contribute: '',
		edit_translation: '',
		landing: {
			head_title: 'Docs • Svelte',
			title: 'Documentation',
			intro:
				'Head to the <a href="/docs/svelte">Svelte</a> or <a href="/docs/kit">SvelteKit</a> reference docs, or choose your adventure:',
			options: [
				{
					href: '/tutorial',
					title: 'I’m brand new here',
					description:
						'We recommend starting with the interactive tutorial, which will teach you how to use Svelte right here in your browser.'
				},
				{
					href: '/docs/svelte/v5-migration-guide',
					title: 'I’m migrating an app from Svelte 4',
					description:
						'If you’re already experienced with an older version of Svelte, the migration guide will bring you up to speed on the changes in Svelte 5.'
				},
				{
					href: '/playground',
					title: 'I just want to try it out',
					description:
						'Head over to the playground to see examples, create your own Svelte apps in the browser, and share them with other people.'
				},
				{
					href: '/docs/llms',
					title: 'I’m a Large Language Model (LLM)',
					description:
						'If you’re an artificial intelligence, or trying to teach one how to use Svelte, we offer the documentation in plaintext format. Beep boop.'
				},
				{
					href: 'https://v4.svelte.dev',
					title: 'I’m looking for the old docs',
					description:
						'If you’re developing a site using only Svelte 3 or Svelte 4, the old site may be a helpful reference until you upgrade.'
				},
				{
					href: '/chat',
					title: 'Help! I’m stuck',
					description:
						'Join our Discord server where you can hang out with fellow Svelte users and ask them questions. It’s like an LLM but with people.',
					external: true
				}
			]
		},
		home: {
			head_title: 'Svelte • Web development for the rest of us',
			description: 'Web development for the rest of us',
			hero_title: 'web development for the rest of us',
			get_started: 'get started',
			docs_href: '/docs',
			hero_alt: 'The Svelte compiler packaging up your component code',
			pronunciation_alt: 'Svelte pronunciation guide',
			definition: 'attractively thin, graceful and stylish',
			blurb:
				'Svelte is a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browser, using languages you already know — HTML, CSS and JavaScript. <strong>It’s a love letter to web development.</strong>',
			blurb_2:
				'But don’t take our word for it. Developers consistently rank Svelte as the framework they’re most excited about using.',
			companies: 'used by companies you’ve heard of',
			documentary: 'Watch the full Svelte Origins documentary',
			community_title: 'join our friendly community',
			community:
				'Our sister organisation, <a href="https://www.sveltesociety.dev/">Svelte Society</a>, organises events around the globe. Find your chapter and join us in <a href="/chat">our Discord server</a>.',
			photos_alt: 'Photos by Marcel Cutts from the 2022 Svelte Summit in Stockholm',
			photos_by: 'Photos by <a href="https://marcel.gg/">Marcel Cutts</a>',
			supporters:
				'Backed by <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a> and countless donors, developed by full-time and part-time maintainers, Svelte is here to stay.',
			footer:
				'Svelte is <a href="https://github.com/sveltejs/svelte">free and open source software</a> released under the MIT license.'
		},
		tutorial: {
			menu: 'Menu',
			reset: 'reset',
			solve: 'solve',
			previous_exercise: 'Previous exercise',
			next_exercise: 'Next exercise',
			toggle_vim: 'Toggle Vim mode',
			copy_disabled_title: 'Copy and paste is currently disabled!',
			copy_disabled_body:
				'We recommend typing the code into the editor to complete the exercise, as this results in better retention and understanding.',
			copy_enable: 'enable copy-and-paste for the duration of this session',
			ok: 'OK'
		}
	},
	ko: {
		lang: 'ko',
		name: '한국어',
		nav: {
			docs: '문서',
			playground: '플레이그라운드',
			tutorial: '튜토리얼',
			packages: '패키지',
			blog: '블로그',
			search: '검색'
		},
		search_placeholder: '검색',
		on_this_page: '이 페이지의 내용',
		docs_title: '문서',
		tutorial_title: 'Svelte 튜토리얼',
		previous: '이전',
		next: '다음',
		edit_page: 'GitHub에서 이 페이지 수정하기',
		untranslated: '이 페이지는 아직 한국어로 번역되지 않아 영어 원문을 보여줍니다.',
		view_original: '영어 원문 보기',
		contribute: '번역에 참여하기',
		edit_translation: 'GitHub에서 번역 수정하기',
		landing: {
			head_title: '문서 • Svelte',
			title: '문서',
			intro:
				'<a href="/ko/docs/svelte">Svelte</a> 또는 <a href="/ko/docs/kit">SvelteKit</a> 레퍼런스 문서로 바로 가거나, 아래에서 원하는 길을 고르세요:',
			options: [
				{
					href: '/tutorial',
					title: '처음 왔어요',
					description:
						'인터랙티브 튜토리얼로 시작하기를 권합니다. 브라우저에서 바로 Svelte 사용법을 배울 수 있습니다.'
				},
				{
					href: '/ko/docs/svelte/v5-migration-guide',
					title: 'Svelte 4 앱을 마이그레이션하고 있어요',
					description:
						'이전 버전의 Svelte를 써 봤다면, 마이그레이션 가이드로 Svelte 5에서 바뀐 점을 빠르게 따라잡을 수 있습니다.'
				},
				{
					href: '/playground',
					title: '일단 써 보고 싶어요',
					description:
						'플레이그라운드에서 예제를 보고, 브라우저에서 직접 Svelte 앱을 만들어 다른 사람과 공유해 보세요.'
				},
				{
					href: '/docs/llms',
					title: '저는 대규모 언어 모델(LLM)이에요',
					description:
						'인공지능이거나 인공지능에게 Svelte 사용법을 가르치려 한다면, 일반 텍스트 형식의 문서를 이용하세요. 삐빅.'
				},
				{
					href: 'https://v4.svelte.dev',
					title: '예전 문서를 찾고 있어요',
					description:
						'Svelte 3이나 Svelte 4만으로 사이트를 개발하고 있다면, 업그레이드하기 전까지 예전 사이트가 참고가 될 수 있습니다.'
				},
				{
					href: '/chat',
					title: '도와주세요! 막혔어요',
					description:
						'Discord 서버에 들어와 다른 Svelte 사용자들과 어울리며 질문해 보세요. LLM 같지만 사람이 답해 줍니다.',
					external: true
				}
			]
		},
		home: {
			head_title: 'Svelte • 우리 모두를 위한 웹 개발',
			description: '우리 모두를 위한 웹 개발',
			hero_title: '우리 모두를 위한 웹 개발',
			get_started: '시작하기',
			docs_href: '/ko/docs',
			hero_alt: '컴포넌트 코드를 포장하는 Svelte 컴파일러',
			pronunciation_alt: 'Svelte 발음 안내',
			definition: '매력적으로 날씬하고, 우아하며, 세련된',
			blurb:
				'Svelte는 컴파일러를 사용하는 UI 프레임워크입니다. 이미 알고 있는 HTML, CSS, JavaScript로, 브라우저에서 최소한의 일만 하는 놀랍도록 간결한 컴포넌트를 작성할 수 있습니다. <strong>웹 개발에 보내는 러브레터입니다.</strong>',
			blurb_2:
				'저희 말만 믿지 마세요. 개발자들은 꾸준히 Svelte를 가장 써 보고 싶은 프레임워크로 꼽습니다.',
			companies: '여러분이 아는 기업들이 씁니다',
			documentary: 'Svelte Origins 다큐멘터리 전체 보기',
			community_title: '친절한 커뮤니티에 함께하세요',
			community:
				'자매 단체인 <a href="https://www.sveltesociety.dev/">Svelte Society</a>가 전 세계에서 행사를 엽니다. 가까운 지역 모임을 찾아보고, <a href="/chat">Discord 서버</a>에서 함께하세요.',
			photos_alt: '2022년 스톡홀름 Svelte Summit 사진 (촬영: Marcel Cutts)',
			photos_by: '사진: <a href="https://marcel.gg/">Marcel Cutts</a>',
			supporters:
				'<a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>과 수많은 후원자가 지원하고, 전업·비전업 메인테이너들이 개발합니다. Svelte는 앞으로도 계속됩니다.',
			footer:
				'Svelte는 MIT 라이선스로 배포되는 <a href="https://github.com/sveltejs/svelte">무료 오픈 소스 소프트웨어</a>입니다.'
		},
		tutorial: {
			menu: '메뉴',
			reset: '초기화',
			solve: '정답 보기',
			previous_exercise: '이전 연습 문제',
			next_exercise: '다음 연습 문제',
			toggle_vim: 'Vim 모드 전환',
			copy_disabled_title: '지금은 복사·붙여넣기를 할 수 없습니다!',
			copy_disabled_body:
				'코드를 에디터에 직접 입력하며 연습 문제를 풀어 보세요. 그래야 더 오래 기억하고 더 잘 이해할 수 있습니다.',
			copy_enable: '이번 세션 동안 복사·붙여넣기 허용하기',
			ok: '확인'
		}
	}
};

const key = Symbol('ui');

/** Sets the UI strings for all components below (used by `/[locale]/...` layouts) */
export function set_ui(strings: UI) {
	setContext(key, strings);
}

/** UI strings for the current locale, English outside of `/[locale]/...` routes */
export function get_ui(): UI {
	return getContext<UI | undefined>(key) ?? ui.en;
}
