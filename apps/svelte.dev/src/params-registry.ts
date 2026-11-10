import { defineParams } from '@sveltejs/kit/params';
import { is_locale } from '#lib/i18n.ts';

const reserved_endpoints = new Set(['llms.txt', 'llms-small.txt']);

export const params = defineParams({
	documentation(param) {
		const final_segment = param.split('/').at(-1);
		return !final_segment || !reserved_endpoints.has(final_segment) ? param : undefined;
	},
	locale(param) {
		return is_locale(param) ? param : undefined;
	}
});
