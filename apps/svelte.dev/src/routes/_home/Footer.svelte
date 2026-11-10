<script lang="ts">
	import { Section } from '@sveltejs/site-kit/components';
	import { get_ui } from '#lib/i18n.ts';

	const t = get_ui().home;
</script>

<Section>
	<p class="copyright">
		© {new Date().getFullYear()} Svelte contributors. {@html t.footer}
	</p>
</Section>

<style>
	.copyright {
		text-align: center;
	}
</style>
