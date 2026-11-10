<!-- @component
Links a page to the same page in the other languages. Only rendered on pages that have
localized routes (docs and tutorial).
-->
<script lang="ts">
	import { page } from '$app/state';
	import { get_locale, locales, strip_locale, ui } from '#lib/i18n.ts';

	// routes that exist both as `/...` and `/[locale=locale]/...`
	const LOCALIZED_ROUTES = [
		'/',
		'/docs',
		'/docs/[topic]/[...path=documentation]',
		'/tutorial/[...slug]'
	];

	const locale = $derived(get_locale(page.url.pathname));
	const english = $derived(strip_locale(page.url.pathname));
	const is_localized = $derived(
		LOCALIZED_ROUTES.some(
			(id) =>
				page.route.id === id || page.route.id === `/[locale=locale]${id === '/' ? '' : id}`
		)
	);

	const alternatives = $derived([
		{ lang: 'en', name: ui.en.name, href: english },
		...locales.map((l) => ({
			lang: ui[l].lang,
			name: ui[l].name,
			href: english === '/' ? `/${l}` : `/${l}${english}`
		}))
	]);
</script>

<svelte:head>
	{#if is_localized && page.status === 200}
		{#each alternatives as { lang, href }}
			<link rel="alternate" hreflang={lang} href="https://svelte.dev{href}" />
		{/each}
	{/if}
</svelte:head>

{#if is_localized && page.status === 200}
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
