import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';

export async function GET(context: APIContext) {
  // Drafts never go into the feed, even in a preview build.
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${SITE.name}: field notes`,
    description: 'Writing on AI agents, CRM architecture and revenue systems.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title, description: p.data.description, pubDate: p.data.date,
      link: `/writing/${p.id}/`, categories: p.data.topics,
    })),
  });
}
