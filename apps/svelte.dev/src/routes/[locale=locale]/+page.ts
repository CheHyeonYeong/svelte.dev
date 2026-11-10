import { locales } from '#lib/i18n.ts';

// `/<locale>` isn't linked from the English home page's crawl roots, so list it
export function entries() {
	return locales.map((locale) => ({ locale }));
}
