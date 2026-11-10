<script lang="ts">
	import { set_ui, ui } from '#lib/i18n.ts';

	let { data, children } = $props();

	// the locale can't change without leaving this layout, so reading it once is fine
	// svelte-ignore state_referenced_locally
	set_ui(ui[data.locale]);
</script>

{@render children()}
