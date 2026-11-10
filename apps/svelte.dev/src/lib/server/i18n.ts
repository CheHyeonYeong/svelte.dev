import { read } from '$app/server';
import type { Document, DocumentSummary, NavigationLink } from '@sveltejs/site-kit';
import { create_index } from '@sveltejs/site-kit/server/content';
import { docs, index } from './content.ts';
import { nav_links } from './nav.ts';
import { locales, ui, type Locale } from '#lib/i18n.ts';

/**
 * Translated docs live in `apps/svelte.dev/translations/<locale>/docs/...` and mirror
 * the structure of `apps/svelte.dev/content/docs/...`. They are deliberately kept outside
 * of `content/` so that they never end up in the English index.
 */
const documents = import.meta.glob<string>('./*/docs/**/*.md', {
	eager: true,
	query: '?url',
	import: 'default',
	base: '../../../translations'
});

// Translations are usually partial (a page may be translated while its parent `index.md` is not),
// and `create_index` expects complete trees, so each file is indexed on its own. We only need
// the parsed metadata, body and sections here; the tree structure comes from the English docs.
const translated: Record<string, Document> = {};

for (const [key, url] of Object.entries(documents)) {
	Object.assign(translated, await create_index({ [key]: url }, {}, read));
}

/** Translated documents, keyed by locale and then by the slug of the English original */
const translations = Object.fromEntries(locales.map((locale) => [locale, {}])) as Record<
	Locale,
	Record<string, Document>
>;

for (const [slug, document] of Object.entries(translated)) {
	const [locale, ...rest] = slug.split('/');
	if (locale in translations) {
		translations[locale as Locale][rest.join('/')] = document;
	}
}

/** Same slug derivation as `create_index`, applied to a file path like `docs/svelte/01-introduction/01-overview.md` */
function slug_of(file: string) {
	return file.replace(/(^|\/)[\d-]+-/g, '$1').replace(/(\/index)?\.md$/, '');
}

function section_ids(document: Document) {
	return document.sections.flatMap((section) => [
		section.slug,
		...section.subsections.map((subsection) => subsection.slug)
	]);
}

// Translated headings must keep the ids of the English headings, otherwise links like
// `/docs/svelte/getting-started#Editor-tooling` break. Fail loudly with a helpful message.
for (const locale of locales) {
	for (const [slug, translation] of Object.entries(translations[locale])) {
		const original = index[slug];

		if (!original) {
			throw new Error(
				`translations/${translation.file} has no English original (expected content/${slug}.md or similar)`
			);
		}

		const expected = section_ids(original);
		const actual = section_ids(translation);
		const missing = expected.filter((id) => !actual.includes(id));
		const extra = actual.filter((id) => !expected.includes(id));

		if (missing.length > 0 || extra.length > 0) {
			throw new Error(
				`Heading ids of translations/${translation.file} do not match the English original.\n` +
					(missing.length ? `  missing: ${missing.join(', ')}\n` : '') +
					(extra.length ? `  unexpected: ${extra.map((id) => id || '(empty)').join(', ')}\n` : '') +
					`Keep the original id by appending the English heading as a comment, e.g. \`## 에디터 도구 <!-- Editor tooling -->\``
			);
		}
	}
}

function find(locale: Locale, document: Document) {
	return translations[locale][slug_of(document.file)];
}

function title_of(locale: Locale, document: Document) {
	return find(locale, document)?.metadata.title ?? document.metadata.title;
}

function localize_summary(locale: Locale, document: Document): DocumentSummary {
	return {
		slug: `${locale}/${document.slug}`,
		metadata: { ...document.metadata, title: title_of(locale, document) },
		children: document.children.map((child) => localize_summary(locale, child))
	};
}

/** Sidebar sections for a docs topic, with translated titles and locale-prefixed links */
export function get_localized_sections(locale: Locale, topic: string) {
	const document = docs.topics[`docs/${topic}`];
	return document?.children.map((section) => localize_summary(locale, section));
}

/**
 * A docs page for the given locale. Falls back to the English content when the page
 * has not been translated yet, so that every page is reachable under `/<locale>/docs/...`.
 */
export function get_localized_page(locale: Locale, slug: string) {
	const page = docs.pages[slug];
	if (!page) return;

	const translation = find(locale, page);

	const link = (target: Document['prev']) => {
		if (!target) return null;
		const original = docs.pages[target.slug];
		return {
			slug: `${locale}/${target.slug}`,
			title: original ? title_of(locale, original) : target.title
		};
	};

	// breadcrumbs are the titles of the parent documents, e.g. Docs • Svelte • Introduction
	const parts = slug_of(page.file).split('/');
	const breadcrumbs = parts.slice(0, -1).map((_, i) => {
		const parent = index[parts.slice(0, i + 1).join('/')];
		return { title: parent ? title_of(locale, parent) : '' };
	});

	const document: Document = {
		...page,
		breadcrumbs,
		prev: link(page.prev),
		next: link(page.next),
		...(translation && {
			metadata: { ...page.metadata, title: translation.metadata.title },
			body: translation.body,
			sections: translation.sections
		})
	};

	return {
		document,
		/** Path of the translation file relative to `apps/svelte.dev/translations`, if it exists */
		translation_file: translation?.file
	};
}

/** All docs pages for the given locale with locale-prefixed slugs, for the search index */
export function get_localized_pages(locale: Locale) {
	return Object.keys(docs.pages).map((slug) => {
		const { document } = get_localized_page(locale, slug)!;
		return { ...document, slug: `${locale}/${document.slug}` };
	});
}

/** The top navigation, with translated labels and the docs menu pointing to `/<locale>/docs/...` */
export function get_localized_nav_links(locale: Locale): NavigationLink[] {
	const labels = ui[locale].nav;

	return nav_links.map((link) => {
		const title = labels[link.slug as keyof typeof labels] ?? link.title;
		if (link.slug !== 'docs') return { ...link, title };

		return {
			...link,
			title,
			slug: `${locale}/docs`,
			sections: (link.sections ?? []).map((topic) => {
				const document = docs.topics[topic.path!.slice(1)];
				return {
					title: topic.title,
					path: `/${locale}${topic.path}`,
					sections: document.children.map((section) => ({
						title: title_of(locale, section),
						sections: section.children.map((page) => ({
							title: title_of(locale, page),
							path: `/${locale}/${page.slug}`
						}))
					}))
				};
			})
		};
	});
}
