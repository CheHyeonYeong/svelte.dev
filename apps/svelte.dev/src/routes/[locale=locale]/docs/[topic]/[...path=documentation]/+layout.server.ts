import { get_localized_sections } from '#lib/server/i18n.ts';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const sections = get_localized_sections(params.locale, params.topic);

	if (!sections) {
		error(404, 'Not found');
	}

	return { sections };
}
