import { lexer, type Token, type Tokens } from 'marked';
import type { Document } from '@sveltejs/site-kit';
import { transform, slugify, split_heading, clean } from '@sveltejs/site-kit/markdown';
import type { Block } from '@sveltejs/site-kit/search';
import { examples, index } from './content.ts';
import { get_slug } from '../../routes/tutorial/[...slug]/content.server';

function get_href(parts: string[]) {
	return parts.length > 1 ? `/${parts[0]}#${parts.at(-1)}` : `/${parts[0]}`;
}

/** The tutorial exercises, with the slugs they're served at */
export function get_tutorial_pages(): Document[] {
	return index.tutorial.children.flatMap((part) =>
		part.children.flatMap((chapter) =>
			chapter.children.map((exercise) => ({
				...exercise,
				slug: get_slug(part, exercise)
			}))
		)
	);
}

/**
 * Creates the search blocks for the given documents (docs pages, tutorial exercises)
 * plus the playground examples. Used by `/content.json` and `/[locale]/content.json`.
 */
export async function create_search_blocks(documents: Document[]) {
	const blocks: Block[] = [];

	for (const document of documents) {
		const { slug, body, metadata } = document;
		const breadcrumbs = document.breadcrumbs.map((x) => clean(x.title));

		// skill content embedded in <details> blocks (AI docs) contains its own
		// headings that don't exist as anchors on the page — exclude from search
		const searchable_body = /^(\w+\/)?docs\/ai\//.test(slug)
			? body.replace(/<details>.*?<\/details>/gs, '')
			: body;

		const rank = +(metadata.rank ?? (slug.startsWith('tutorial/') ? 1 : 0));
		const tokens = lexer(searchable_body.trim());
		const sections: Array<{ heading: Tokens.Heading; content: Token[] }> = [];
		const intro: Token[] = [];
		let section: (typeof sections)[number] | undefined;

		for (const token of tokens) {
			if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) {
				const next_section = { heading: token as Tokens.Heading, content: [] };
				sections.push(next_section);
				section = next_section;
			} else {
				(section?.content ?? intro).push(token);
			}
		}

		blocks.push({
			breadcrumbs: [...breadcrumbs, clean(metadata.title ?? '')],
			href: get_href([slug]),
			content: await plaintext(
				intro
					.map((token) => token.raw)
					.join('')
					.trim()
			),
			rank
		});

		let h2: { text: string; id: string } | undefined;
		for (const section of sections) {
			// translated headings keep the English id: `## 번역된 제목 <!-- Original heading -->`
			const { title: text, id } = split_heading(section.heading.text);
			const { depth } = section.heading;
			if (depth === 2) h2 = { text, id };

			const headings = depth === 3 && h2 ? [h2, { text, id }] : [{ text, id }];
			const content = section.content
				.map((token) => token.raw)
				.join('')
				.trim();
			if (depth === 2 && !content) continue;

			blocks.push({
				breadcrumbs: [
					...breadcrumbs,
					clean(metadata.title),
					...headings.map((heading) => clean(heading.text))
				],
				href: get_href([slug, headings.map((heading) => slugify(heading.id)).join('-')]),
				content: await plaintext(content),
				rank
			});
		}
	}

	for (const section of examples) {
		if (section.metadata.private) continue;
		for (const example of section.children) {
			if (example.metadata.private) continue;
			blocks.push({
				breadcrumbs: ['Examples', section.metadata.title, example.metadata.title],
				href: `/playground/${example.slug.split('/').pop()}`,
				content: '',
				rank: 10
			});
		}
	}

	return blocks;
}

async function plaintext(markdown: string) {
	const block = (token: Tokens.Blockquote | Tokens.ListItem | Tokens.TableRow) => {
		if ('text' in token) {
			return token.text;
		}
		// this should never happen, but abort loudly if it does
		console.error(token);
		throw new Error('Unexpected token while generating /content.json (see above)');
	};

	const inline = ({ text }: any) => text;

	return (
		await transform(markdown, {
			code: ({ text }) => {
				const raw = text.split('// ---cut---\n').pop() ?? '';

				return raw
					.replace(/^\/\/ @noErrors.*$/gm, ' ')
					.replace(/^\/\/ @errors.+$/gm, ' ')
					.replace(/^\/\/\/ file:.+$/gm, ' ');
			},
			blockquote: block,
			html: () => '\n',
			heading: ({ text }) => `${text}\n`,
			hr: () => '',
			list({ items }) {
				return items.map(this.listitem!).join('\n');
			},
			listitem: block,
			checkbox: () => '',
			paragraph({ tokens }) {
				return this.parser!.parseInline(tokens);
			},
			table({ header, rows }) {
				const tHeader = this.tablerow!({ text: header.map(this.tablecell!).join() });
				const tBody = rows
					.map((row) => this.tablerow!({ text: row.map(this.tablecell!).join() }))
					.join('\n');
				return `${tHeader}\n${tBody}`;
			},
			tablerow: block,
			tablecell: ({ text }) => {
				return text + ' ';
			},
			strong: inline,
			em: inline,
			codespan: inline,
			br: () => '',
			del: inline,
			link: inline,
			image: inline,
			text: inline
		})
	)
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#(\d+);/g, (match, code) => {
			return String.fromCharCode(code);
		})
		.trim();
}
