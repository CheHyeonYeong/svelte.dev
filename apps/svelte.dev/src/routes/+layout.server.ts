import { PRERENDER } from '$app/env/private';
import { nav_links } from '#lib/server/nav.ts';
import type { BannerData } from '@sveltejs/site-kit';

// by default, all pages are prerendered
export const prerender = PRERENDER !== 'false';

const banner: BannerData = {
	id: 'ljubljana-2026-tickets-available',
	start: new Date('1 August, 2026 00:00:00 UTC'),
	end: new Date('20 November, 2026 23:59:59 UTC'),
	arrow: true,
	content: {
		lg: 'Svelte Summit Ljubljana and online, Nov 19-20: Tickets now available!',
		sm: 'Svelte Summit Nov 19-20'
	},
	href: 'https://www.sveltesummit.com/'
};

export const load = async () => {
	return {
		nav_links,
		banner
	};
};
