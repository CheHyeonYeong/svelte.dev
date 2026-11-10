import { docs } from '#lib/server/content.ts';
import { create_search_blocks, get_tutorial_pages } from '#lib/server/search.ts';
import { json } from '@sveltejs/kit';

export const prerender = true;

export async function GET() {
	return json({
		blocks: await create_search_blocks([...Object.values(docs.pages), ...get_tutorial_pages()])
	});
}
