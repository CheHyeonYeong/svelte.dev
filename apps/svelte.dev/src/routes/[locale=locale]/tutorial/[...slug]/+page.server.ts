import { redirect } from '@sveltejs/kit';
import { load_exercise, parts } from '../../../tutorial/[...slug]/content.server';
import { get_related_links } from '#lib/server/content.ts';
import { locales } from '#lib/i18n.ts';

// mirrors `/tutorial/[...slug]`, with the text translated where a translation exists
const aliases: Record<string, string> = {
	'kit/env-static-private': 'kit/env-private',
	'kit/env-dynamic-private': 'kit/env-private',
	'kit/env-static-public': 'kit/env-public',
	'kit/env-dynamic-public': 'kit/env-public',
	'kit/invalidate-all': 'kit/refresh-all'
};

export async function load({ url, params }) {
	const base = `/${params.locale}/tutorial`;

	if (!params.slug || params.slug === 'svelte') redirect(307, `${base}/svelte/welcome-to-svelte`);
	if (params.slug === 'kit') redirect(307, `${base}/kit/introducing-sveltekit`);
	if (!params.slug.includes('/')) redirect(307, `${base}/svelte/${params.slug}`);

	const alias = aliases[params.slug];
	if (alias) redirect(308, `${base}/${alias}`);

	return {
		exercise: await load_exercise(params.slug, params.locale),
		related: get_related_links(url.pathname.slice(params.locale.length + 1))
	};
}

// localized pages are not linked from the English site's crawl roots, so list them all
export function entries() {
	return locales.flatMap((locale) => [
		{ locale, slug: '' },
		{ locale, slug: 'svelte' },
		{ locale, slug: 'kit' },
		...Object.keys(aliases).map((slug) => ({ locale, slug })),
		...parts.flatMap((part) =>
			part.chapters.flatMap((chapter) =>
				chapter.exercises.map((exercise) => ({ locale, slug: exercise.slug }))
			)
		)
	]);
}
