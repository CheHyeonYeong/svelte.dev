import { is_locale } from '#lib/i18n.ts';

/** @param {string} param */
export function match(param) {
	return is_locale(param);
}
