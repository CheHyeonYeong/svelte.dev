import { docs, index } from './content.ts';
import type { NavigationLink } from '@sveltejs/site-kit';

export const nav_links: NavigationLink[] = [
	{
		title: 'Docs',
		slug: 'docs',
		sections: [
			docs.topics['docs/svelte'],
			docs.topics['docs/kit'],
			docs.topics['docs/cli'],
			docs.topics['docs/ai']
		].map((topic) => ({
			title: topic.metadata.title,
			path: '/' + topic.slug, // this will make the UI show a flyout menu for the docs nav entry
			sections: topic.children.map((section) => ({
				title: section.metadata.title,
				sections: section.children.map((page) => ({
					title: page.metadata.title,
					path: '/' + page.slug
				}))
			}))
		}))
	},
	{
		title: 'Playground',
		slug: 'playground',
		match: /^\/(playground|apps)(\/|$)/,
		sections: [
			{ title: 'Create new app', path: '/playground', match: false, sections: [] },
			{ title: 'Your saved apps', path: '/apps', match: /^\/apps$/, sections: [] }
		]
	},
	{
		title: 'Tutorial',
		slug: 'tutorial',
		sections: index.tutorial.children.map((topic) => ({
			title: topic.metadata.title,
			sections: topic.children.map((section) => ({
				title: section.metadata.title,
				sections: section.children.map((page) => ({
					title: page.metadata.title,
					path:
						'/tutorial/' +
						(page.slug.includes('sveltekit/') ? 'kit' : 'svelte') +
						'/' +
						page.slug.split('/').pop()
				}))
			}))
		}))
	},
	{
		title: 'Packages',
		slug: 'packages'
	},
	{
		title: 'Blog',
		slug: 'blog'
	}
];
