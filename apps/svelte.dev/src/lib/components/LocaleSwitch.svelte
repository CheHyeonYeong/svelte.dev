<!-- @component
Links a docs page to the same page in the other languages. Only rendered on docs pages,
since those are the only pages that have translations.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { get_locale, locales, strip_locale, ui } from '#lib/i18n.ts';

	const DOCS_PAGE = '/docs/[topic]/[...path=documentation]';

	const locale = $derived(get_locale(page.url.pathname));
	const english = $derived(strip_locale(page.url.pathname));
	const is_docs_page = $derived(
		page.route.id === DOCS_PAGE || page.route.id === `/[locale=locale]${DOCS_PAGE}`
	);

	const alternatives = $derived([
		{ lang: 'en', name: ui.en.name, href: english },
		...locales.map((l) => ({ lang: ui[l].lang, name: ui[l].name, href: `/${l}${english}` }))
	]);
</script>

<svelte:head>
	{#if is_docs_page && page.status === 200}
		{#each alternatives as { lang, href }}
			<link rel="alternate" hreflang={lang} href="https://svelte.dev{href}" />
		{/each}
	{/if}
</svelte:head>

{#if is_docs_page && page.status === 200}
	<div class="locale-switch">
		{#each alternatives as { lang, name, href }}
			{#if lang !== (locale ? ui[locale].lang : 'en')}
				<a class="raised" {href} hreflang={lang} {lang} data-sveltekit-noscroll>{name}</a>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.locale-switch {
		display: flex;
		gap: 0.4rem;
	}

	a {
		display: flex;
		align-items: center;
		height: 3.2rem;
		padding: 0 1rem;
		border-radius: var(--sk-border-radius);
		font: var(--sk-font-ui-small);
		color: var(--sk-fg-2);
		text-decoration: none;
		white-space: nowrap;
	}
</style>
