// A plain-text index of the site for AI assistants and other readers.
// Not a ranking trick; just a clean summary with links to the real pages.
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';

export async function GET({ site }: APIContext) {
  const u = (p: string) => new URL(p, site).href;
  const systems = (await getCollection('systems')).sort((a, b) => a.data.order - b.data.order);
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  const lines = [
    `# ${SITE.name}`, '',
    `> ${SITE.description}`, '',
    'Vrutik Adani works on GTM systems and AI engineering at Geneo United, a Lumenis company in medical aesthetics.',
    'Public repositories use synthetic data and are never employer code. Each system page states what kind of evidence backs it.', '',
    '## Systems',
    ...systems.map((s) => `- [${s.data.title}](${u(`/systems/${s.id}/`)}): ${s.data.premise}`), '',
    ...(posts.length ? ['## Writing', ...posts.map((p) => `- [${p.data.title}](${u(`/writing/${p.id}/`)}): ${p.data.description}`), ''] : []),
    '## More',
    `- [Decision Lab](${u('/lab/')}): interactive scenarios on synthetic data`,
    `- [About](${u('/about/')}): experience, education, recognition, evidence labels`,
    `- [LinkedIn](${SITE.links.linkedin})`,
    `- [GitHub](${SITE.links.github})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
