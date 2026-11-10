import { docs, get_related_links } from '#lib/server/content.ts';
import { get_localized_page } from '#lib/server/i18n.ts';
import { render_content } from '#lib/server/renderer.ts';
import { locales } from '#lib/i18n.ts';
import { error } from '@sveltejs/kit';

const translations_url = 'https://github.com/CheHyeonYeong/svelte.dev';

// localized pages are not linked from the English site, so tell the prerenderer about them
export function entries() {
	return locales.flatMap((locale) =>
		Object.keys(docs.pages).map((slug) => {
			const [, topic, ...path] = slug.split('/');
			return { locale, topic, path: path.join('/') };
		})
	);
}

export async function load({ url, params }) {
	const result = get_localized_page(params.locale, `docs/${params.topic}/${params.path}`);

	if (!result) {
		error(404);
	}

	const { document, translation_file } = result;
	const { references, referenceModules } = docs;
	const original = `/docs/${params.topic}/${params.path}`;

	return {
		document: {
			...document,
			body: await render_content(document.file, document.body, {
				origin: url.origin,
				references,
				referenceModule: referenceModules[document.file]
			})
		},
		locale: params.locale,
		translated: !!translation_file,
		original,
		edit_url: translation_file
			? `${translations_url}/edit/main/apps/svelte.dev/translations/${translation_file}`
			: `${translations_url}/tree/main/apps/svelte.dev/translations/${params.locale}`,
		related: get_related_links(original)
	};
}
