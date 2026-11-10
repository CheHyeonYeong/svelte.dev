<script lang="ts">
	// reuse the English tutorial page, only the data (text and titles) is localized
	import TutorialPage from '../../../tutorial/[...slug]/+page.svelte';

	let props = $props();
</script>

<TutorialPage {...props} />
