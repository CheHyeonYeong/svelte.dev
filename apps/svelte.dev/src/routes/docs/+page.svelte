<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import DocsLanding from '#lib/components/DocsLanding.svelte';
	import { ui } from '#lib/i18n.ts';

	// The old Svelte 3 docs used one giant docs page for everything, with hashes marking sections.
	// This mapping does a best effort to redirect to the new docs.
	const mappings = [
		['before-we-begin', 'overview'],
		['getting-started', 'overview'],
		['component-format', 'svelte-files'],
		['template-syntax-if', 'if'],
		['template-syntax-each', 'each'],
		['template-syntax-await', 'await'],
		['template-syntax-key', 'key'],
		['template-syntax-element-directives', 'basic-markup'],
		['template-syntax-element-directives-bind', 'bindings'],
		['template-syntax-element-directives-class', 'class'],
		['template-syntax-element-directives-style', 'style'],
		['template-syntax-element-directives-use-action', 'use'],
		['template-syntax-element-directives-transition-fn', 'transition'],
		['template-syntax-element-directives-in-fn-out-fn', 'in-and-out'],
		['template-syntax-element-directives-animate-fn', 'animate'],
		['template-syntax-component-directives', 'basic-markup'],
		// not sure what lived here
		// if I guessed right, there's not a great one for this
		['template-syntax-svelte', 'svelte-window'],
		['template-syntax', 'basic-markup'],
		['run-time-svelte-store', 'svelte-store'],
		['run-time-svelte-motion', 'svelte-motion'],
		['run-time-svelte-transition', 'svelte-transition'],
		['run-time-svelte-animate', 'svelte-animate'],
		['run-time-svelte-easing', 'svelte-easing'],
		['run-time-client-side-component-api', 'imperative-component-api'],
		['run-time-custom-element-api', 'custom-elements'],
		['run-time-server-side-component-api', 'imperative-component-api'],
		['run-time-svelte', 'svelte'],
		['run-time', 'svelte'],
		['compile-time', 'svelte-compiler'],
		['accessibility-warnings', 'compiler-warnings']
	];

	function get_url_to_redirect_to() {
		const hash = page.url.hash.replace(/^#/i, '');

		if (!hash) return;

		for (const [old_id, new_id] of mappings) {
			if (hash === old_id) return `/docs/svelte/${new_id}`;
		}
	}

	onMount(() => {
		const redirect = get_url_to_redirect_to();
		if (redirect) {
			goto(redirect, { replaceState: true });
		}
	});
</script>

<DocsLanding strings={ui.en.landing} />
