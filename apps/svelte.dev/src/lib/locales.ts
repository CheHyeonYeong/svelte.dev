/**
 * Locales that have (partial) translations in `apps/svelte.dev/translations/<locale>`.
 * Kept free of imports so that config files (`vite.config.ts`, `vercel.ts`) can use it.
 */
export const locales = ['ko'] as const;

export type Locale = (typeof locales)[number];

/** Whether a pathname is part of the SvelteKit tutorial (`/tutorial/kit/...` or `/<locale>/tutorial/kit/...`), which needs cross-origin isolation */
export function is_kit_tutorial(pathname: string) {
	return new RegExp(`^(/(${locales.join('|')}))?/tutorial/kit(/|$)`).test(pathname);
}
