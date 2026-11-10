<script lang="ts">
	import '@sveltejs/site-kit/styles/index.css';
	import { browser, dev } from '$app/env';
	import { page } from '$app/state';
	import { Shell, Banner } from '@sveltejs/site-kit/components';
	import { Nav } from '@sveltejs/site-kit/nav';
	import { SearchBox } from '@sveltejs/site-kit/search';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit-next';
	import { inject } from '@vercel/analytics';
	import { beforeNavigate } from '$app/navigation';
	import { get_locale, ui } from '#lib/i18n.ts';
	import LocaleSwitch from '#lib/components/LocaleSwitch.svelte';

	if (!dev) {
		injectSpeedInsights();
		inject({ mode: 'production' });
	}

	// Make all navigations between SvelteKit-tutorial and non-SvelteKit-tutorial pages (and vice versa)
	// a full page navigation to ensure webcontainers get the correct origin restriction headers while
	// ensuring those headers don't interfere with the rest of the page. These headers would have bad
	// consequences on how we have to handle integration of images etc from other domains for example.
	beforeNavigate(({ from, to, cancel }) => {
		if (!from || !to) return;

		if (
			from.url.pathname.startsWith('/tutorial/kit/') !== to.url.pathname.startsWith('/tutorial/kit')
		) {
			cancel();
			location.href = to.url.href;
		}
	});

	let { data, children: layout_children } = $props();

	const locale = $derived(get_locale(page.url.pathname));
	const t = $derived(ui[locale ?? 'en']);

	// title of the current section, shown in the mobile nav
	const section = $derived(page.url.pathname.split('/')[locale ? 2 : 1]);
	const title = $derived(t.nav[section as keyof typeof t.nav] ?? '');

	// `/[locale]/...` layouts override the English nav links
	const nav_links = $derived(page.data.nav_links ?? data.nav_links);

	// the server sets `<html lang>` for the initial page (see hooks.server.js), keep it in sync on client-side navigation
	$effect(() => {
		document.documentElement.lang = t.lang;
	});
</script>

<svelte:head>
	{#if !page.route.id || !(page.route.id.startsWith('/blog/') || /^\/docs\/[^\/]+\/[^\/]+$/.test(page.route.id))}
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
		<meta name="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	{/if}
</svelte:head>

<Shell nav_visible={page.route.id !== '/(authed)/playground/[...id]/embed'}>
	{#snippet top_nav()}
		<Nav {title} links={nav_links} search_label={t.search_placeholder}>
			{#snippet menu()}
				<LocaleSwitch />
			{/snippet}
		</Nav>
	{/snippet}

	{#snippet children()}
		{@render layout_children()}
	{/snippet}

	{#snippet banner()}
		{#if data.banner}
			<Banner banner={data.banner} />
		{/if}
	{/snippet}
</Shell>

{#if browser}
	<!-- each locale has its own search index, so recreate the search box when it changes -->
	{#key locale}
		<SearchBox
			index={locale ? `/${locale}/content.json` : '/content.json'}
			placeholder={t.search_placeholder}
		/>
	{/key}
{/if}
