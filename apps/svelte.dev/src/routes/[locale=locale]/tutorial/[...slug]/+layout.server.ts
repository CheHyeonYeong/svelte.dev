import { get_localized_parts } from '../../../tutorial/[...slug]/content.server';

export async function load({ params }) {
	return {
		index: get_localized_parts(params.locale)
	};
}
