<script lang="ts">
	// reuse the English docs layout, only the data (sidebar titles and links) is localized
	import DocsLayout from '../../../../docs/[topic]/[...path=documentation]/+layout.svelte';

	let { data, children } = $props();
</script>

<DocsLayout {data} {children} />
