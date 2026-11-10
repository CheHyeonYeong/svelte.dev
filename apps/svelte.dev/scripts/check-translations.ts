/**
 * Checks translations in `translations/<locale>/{docs,tutorial}` against their English originals in `content/`.
 *
 * Usage:
 *   node scripts/check-translations.ts                 # all translations
 *   node scripts/check-translations.ts <file> [...]    # specific translation files
 *
 * A translation must keep everything that isn't prose identical to the original, because it is rendered
 * with the same pipeline (type-checked code blocks, references, anchors):
 * - code blocks are byte-for-byte identical
 * - every heading keeps its id (translated headings use `## 번역된 제목 <!-- Original heading -->`)
 * - HTML block lines (e.g. `<div class="ts-block">`), link targets and callouts (`> [!NOTE]`) are the same
 * - frontmatter is the same, except for `title` (and the generated `NOTE` line, which is dropped)
 * Line counts are compared too (as a warning), since keeping lines aligned makes later diffs easy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify, split_heading } from '../../../packages/site-kit/src/lib/markdown/utils.ts';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const translations_dir = path.join(root, 'translations');
const content_dir = path.join(root, 'content');

function walk(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		// tutorial exercise files (`+assets`) are code, not translations
		if (entry.isDirectory()) return entry.name === '+assets' ? [] : walk(full);
		return entry.name.endsWith('.md') ? [full] : [];
	});
}

function split_frontmatter(text: string) {
	// some originals start with a byte order mark
	text = text.replace(/^\uFEFF/, '');
	const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
	if (!match) return { frontmatter: new Map<string, string>(), body: text };

	const frontmatter = new Map<string, string>();
	for (const line of match[1].split('\n')) {
		const i = line.indexOf(':');
		if (i > 0) frontmatter.set(line.slice(0, i).trim(), line.slice(i + 1).trim());
	}

	return { frontmatter, body: text.slice(match[0].length) };
}

/** Splits markdown into code blocks and the prose between them */
function parse(body: string) {
	const code: string[] = [];
	const prose: string[] = [];
	let current: string[] | null = null;
	let fence = '';

	for (const line of body.split('\n')) {
		if (current) {
			current.push(line);
			if (line.trimStart().startsWith(fence) && line.trim() === fence) {
				code.push(current.join('\n'));
				current = null;
			}
		} else {
			const match = /^(\s*)(`{3,}|~{3,})/.exec(line);
			if (match) {
				fence = match[2];
				current = [line];
			} else {
				prose.push(line);
			}
		}
	}

	if (current) code.push(current.join('\n'));

	return { code, prose };
}

/** Heading ids as the renderer computes them (nested headings join their parents' slugs) */
function heading_ids(prose: string[]) {
	const stack: string[] = [];
	const ids: string[] = [];

	for (const line of prose) {
		const match = /^(#{1,6})\s+(.*)$/.exec(line);
		if (!match) continue;

		const depth = match[1].length;
		stack[depth - 1] = slugify(split_heading(match[2]).id);
		stack.length = depth;
		ids.push(`h${depth}#${stack.filter(Boolean).join('-')}`);
	}

	return ids;
}

const html_lines = (prose: string[]) =>
	prose.map((line) => line.trim()).filter((line) => /^<\/?[a-z][\w-]*(\s[^>]*)?>$/.test(line));

const links = (prose: string[]) =>
	[...prose.join('\n').matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((match) => match[1]);

const callouts = (prose: string[]) =>
	prose.map((line) => /^>\s*\[!([A-Z]+)\]/.exec(line)?.[1]).filter(Boolean) as string[];

/** Items in `a` that are missing from `b` (multiset difference) */
function difference(a: string[], b: string[]) {
	const counts = new Map<string, number>();
	for (const item of b) counts.set(item, (counts.get(item) ?? 0) + 1);

	return a.filter((item) => {
		const count = counts.get(item) ?? 0;
		if (count === 0) return true;
		counts.set(item, count - 1);
		return false;
	});
}

function check(file: string) {
	const errors: string[] = [];
	const warnings: string[] = [];

	const relative = path.relative(translations_dir, file).split(path.sep).join('/');
	const [, ...rest] = relative.split('/');
	const original_file = path.join(content_dir, ...rest);

	if (!fs.existsSync(original_file)) {
		return { errors: [`no English original at content/${rest.join('/')}`], warnings };
	}

	const translation = split_frontmatter(fs.readFileSync(file, 'utf-8'));
	const original = split_frontmatter(fs.readFileSync(original_file, 'utf-8'));

	// frontmatter
	if (!translation.frontmatter.get('title')) errors.push('missing `title` in frontmatter');
	for (const [key, value] of original.frontmatter) {
		if (key === 'NOTE' || key === 'title') continue;
		if (translation.frontmatter.get(key) !== value) {
			errors.push(`frontmatter \`${key}\` must stay \`${value}\``);
		}
	}
	if (translation.frontmatter.has('NOTE')) {
		errors.push('remove the generated `NOTE: do not edit this file` line from the frontmatter');
	}

	const t = parse(translation.body);
	const o = parse(original.body);

	// code blocks
	if (t.code.length !== o.code.length) {
		errors.push(`expected ${o.code.length} code blocks, found ${t.code.length}`);
	}
	for (let i = 0; i < Math.min(t.code.length, o.code.length); i += 1) {
		if (t.code[i] !== o.code[i]) {
			const first_line = o.code[i].split('\n').slice(0, 2).join(' / ');
			errors.push(`code block #${i + 1} differs from the original (starts with: ${first_line})`);
		}
	}

	// headings
	const t_ids = heading_ids(t.prose);
	const o_ids = heading_ids(o.prose);
	if (t_ids.join('\n') !== o_ids.join('\n')) {
		const missing = difference(o_ids, t_ids);
		const extra = difference(t_ids, o_ids);
		errors.push(
			'heading ids differ from the original' +
				(missing.length ? `\n      missing: ${missing.join(', ')}` : '') +
				(extra.length ? `\n      unexpected: ${extra.join(', ')}` : '') +
				(!missing.length && !extra.length ? ' (order differs)' : '') +
				'\n      keep the id with `## 번역된 제목 <!-- Original heading -->`'
		);
	}

	// html, links, callouts
	for (const [name, get] of [
		['HTML lines', html_lines],
		['link targets', links],
		['callouts', callouts]
	] as const) {
		const missing = difference(get(o.prose), get(t.prose));
		const extra = difference(get(t.prose), get(o.prose));
		if (missing.length || extra.length) {
			errors.push(
				`${name} differ from the original` +
					(missing.length ? `\n      missing: ${missing.join(' ')}` : '') +
					(extra.length ? `\n      unexpected: ${extra.join(' ')}` : '')
			);
		}
	}

	// line alignment
	const t_lines = translation.body.split('\n').length;
	const o_lines = original.body.split('\n').length;
	if (t_lines !== o_lines) {
		warnings.push(`body has ${t_lines} lines, the original has ${o_lines}`);
	}

	return { errors, warnings };
}

const files = process.argv.slice(2).length
	? process.argv.slice(2).map((file) => path.resolve(file))
	: fs.readdirSync(translations_dir).flatMap((locale) =>
			['docs', 'tutorial']
				.map((section) => path.join(translations_dir, locale, section))
				.filter((dir) => fs.existsSync(dir))
				.flatMap(walk)
		);

let failed = 0;

for (const file of files) {
	const { errors, warnings } = check(file);
	const name = path.relative(root, file);

	if (errors.length) {
		failed += 1;
		console.log(`✗ ${name}`);
		for (const error of errors) console.log(`    error: ${error}`);
	} else {
		console.log(`✓ ${name}`);
	}

	for (const warning of warnings) console.log(`    warning: ${warning}`);
}

console.log(`\n${files.length - failed}/${files.length} translations passed`);
process.exit(failed ? 1 : 0);
