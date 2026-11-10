<!-- @component
The docs landing page (`/docs`, `/<locale>/docs`). Text and links come from `strings`.
-->
<script lang="ts">
	import type { UI } from '#lib/i18n.ts';

	let { strings }: { strings: UI['landing'] } = $props();
</script>

<svelte:head>
	<title>{strings.head_title}</title>
</svelte:head>

<div class="page">
	<h1>{strings.title}</h1>
	<p>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, trusted strings -->
		{@html strings.intro}
	</p>

	<div class="options">
		{#each strings.options as option}
			<a href={option.href} class:external={option.external}>
				<h2>{option.title}</h2>
				<p>{option.description}</p>
			</a>
		{/each}
	</div>
</div>

<style>
	.page {
		padding: var(--sk-page-padding-top) var(--sk-page-padding-side);
		max-width: var(--sk-page-content-width);
		box-sizing: content-box;
		margin: auto;
		text-wrap: balance;
	}

	.options a {
		display: block;
		color: inherit;
		margin: 1em -1.6rem;
		padding: 1.6rem;
		background-color: var(--sk-bg-1);
		border-radius: var(--sk-border-radius);

		&:hover {
			background-color: var(--sk-bg-2);
			filter: drop-shadow(1px 2px 4px rgb(0 0 0 / 0.1));
			text-decoration: none;
			transform: var(--safari-fix);
			-webkit-transform: var(--safari-fix);

			h2 {
				text-decoration: underline;
			}
		}

		h2 {
			position: relative;
			padding-right: 4rem;

			&::after {
				content: '';
				position: absolute;
				width: 3rem;
				height: 3rem;
				top: 0.2rem;
				right: 0;

				background: var(--sk-fg-accent);
				mask: url(icons/arrow-right) no-repeat 100% 50%;
				mask-size: 100%;
			}

			.external &::after {
				mask-image: url(icons/external-link);
			}
		}

		p:last-child {
			margin-bottom: 0;
		}

		@media (min-width: 480px) {
			margin: 1em -2.4rem;
			padding: 2.4rem;
		}
	}
</style>
