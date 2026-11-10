<script lang="ts">
	// reuse the English docs page, only the data is localized
	import DocsPage from '../../../../docs/[topic]/[...path=documentation]/+page.svelte';
	import { get_ui } from '#lib/i18n.ts';

	let { data } = $props();

	const t = get_ui();
</script>

<aside class="translation-notice" lang={t.lang}>
	{#if !data.translated}
		<p>{t.untranslated}</p>
	{/if}
	<p>
		<a href={data.original} hreflang="en">{t.view_original}</a>
		{#if !data.translated}
			· <a href={data.edit_url}>{t.contribute}</a>
		{/if}
	</p>
</aside>

<DocsPage
	{data}
	edit={{ url: data.edit_url, label: data.translated ? t.edit_translation : t.contribute }}
/>

<style>
	.translation-notice {
		margin: 0 0 3rem;
		padding: 1.2rem 1.6rem;
		border-left: 3px solid var(--sk-fg-accent);
		background: var(--sk-bg-2);
		font: var(--sk-font-ui-medium);
		color: var(--sk-fg-2);

		p {
			margin: 0;
		}

		p + p {
			margin-top: 0.6rem;
		}
	}
</style>
