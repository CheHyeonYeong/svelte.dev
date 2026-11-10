import { docs } from '#lib/server/content.ts';
import { error, redirect } from '@sveltejs/kit';

// mirrors `/docs/[topic]`: the topic root redirects to its first page
export async function load({ params }) {
	const document = docs.topics[`docs/${params.topic}`];

	if (!document) {
		// in many cases, `/docs/foo` is now `/docs/svelte/foo` (e.g. relative `../svelte-store` links)
		if (docs.pages[`docs/svelte/${params.topic}`]) {
			redirect(308, `/${params.locale}/docs/svelte/${params.topic}`);
		}

		error(404);
	}

	redirect(307, `/${params.locale}/${document.children[0].children[0].slug}`);
}
