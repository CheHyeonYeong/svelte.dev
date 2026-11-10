<script lang="ts">
	import DocsLanding from '#lib/components/DocsLanding.svelte';
	import { get_ui } from '#lib/i18n.ts';
</script>

<DocsLanding strings={get_ui().landing} />
