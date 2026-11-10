import { get_localized_pages, get_localized_tutorial_pages } from '#lib/server/i18n.ts';
import { create_search_blocks, get_tutorial_pages } from '#lib/server/search.ts';
import { locales } from '#lib/i18n.ts';
import { json } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
	return locales.map((locale) => ({ locale }));
}

// search index for `/<locale>/...`: localized docs and tutorial (English where untranslated)
export async function GET({ params }) {
	return json({
		blocks: await create_search_blocks([
			...get_localized_pages(params.locale),
			...get_localized_tutorial_pages(params.locale, get_tutorial_pages())
		])
	});
}
