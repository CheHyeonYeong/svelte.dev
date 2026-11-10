import { getContext, setContext } from 'svelte';

/**
 * Locales that have (partial) translations of the docs in `apps/svelte.dev/translations/<locale>`.
 * This module is shared between client and server, so it must not import server-only code.
 */
export const locales = ['ko'] as const;

export type Locale = (typeof locales)[number];

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
