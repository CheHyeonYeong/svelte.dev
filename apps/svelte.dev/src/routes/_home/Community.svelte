<script>
	import { Section } from '@sveltejs/site-kit/components';
	import { get_ui } from '#lib/i18n.ts';

	const t = get_ui().home;
</script>

<Section --max-width="200rem">
	<h2>{t.community_title}</h2>
	<p>
		{@html t.community}
	</p>

	<figure>
		<enhanced:img class="collage" src="./summit.png?w=800;1200;2000;2800;4400" alt={t.photos_alt} />
		<figcaption>{@html t.photos_by}</figcaption>
	</figure>
</Section>

<style>
	figure {
		position: relative;
	}

	figcaption {
		position: relative;
		top: max(-2vw, calc(-0.02 * (120rem + 2 * var(--sk-page-padding-side))));
		font: var(--sk-font-ui-medium);
		margin: 0 auto;
		padding: 0 var(--sk-page-padding-side);
		color: var(--sk-fg-3);
		text-align: center;

		/* the link is rendered from a UI string with {@html} */
		:global(a) {
			text-wrap: nowrap;
			color: inherit;
			text-decoration: underline;
		}
	}

	.collage {
		width: 100%;
		height: auto;
	}

	h2,
	p {
		text-align: center;
	}

	p {
		max-width: 28em;
		margin-left: auto;
		margin-right: auto;
	}
</style>
