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

export const ui: Record<
	Locale,
	{
		/** Value for `<html lang>` */
		lang: string;
		untranslated: string;
		view_original: string;
		contribute: string;
		edit_translation: string;
	}
> = {
	ko: {
		lang: 'ko',
		untranslated: '이 페이지는 아직 한국어로 번역되지 않아 영어 원문을 보여줍니다.',
		view_original: '영어 원문 보기',
		contribute: '번역에 참여하기',
		edit_translation: 'GitHub에서 번역 수정하기'
	}
};
