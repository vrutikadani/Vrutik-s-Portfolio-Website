// Fails if any writing marked `draft: true` made it into the production build.
// Published pieces (draft: false) are expected to be there.
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const dir = 'src/content/writing';
const drafts = readdirSync(dir)
  .filter((f) => /\.mdx?$/.test(f) && /^draft:\s*true/m.test(readFileSync(`${dir}/${f}`, 'utf8')))
  .map((f) => f.replace(/\.mdx?$/, ''));
const leaked = drafts.filter((slug) => existsSync(`dist/writing/${slug}`));
const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';
const linked = drafts.filter((slug) => html.includes(`/writing/${slug}/`));
if (leaked.length || linked.length) {
  console.error(`Draft writing leaked into the production build: ${[...new Set([...leaked, ...linked])].join(', ')}`);
  process.exit(1);
}
console.log(`No drafts in production build (${drafts.length} draft${drafts.length === 1 ? '' : 's'} held back)`);
