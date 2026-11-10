import { get_localized_nav_links } from '#lib/server/i18n.ts';

export async function load({ params }) {
	return {
		locale: params.locale,
		// overrides the English `nav_links` of the root layout
		nav_links: get_localized_nav_links(params.locale)
	};
}
