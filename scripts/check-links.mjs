// Checks every internal link and anchor in the built site. External links are
// listed but not fetched, so CI doesn't fail when a third-party site is down.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const DIST = 'dist';
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); } })(DIST);
const ids = new Map(pages.map((p) => [p, new Set([...readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const resolve = (href) => {
  const [path] = href.split('#');
  const clean = path.split('?')[0];
  const cands = [join(DIST, clean), join(DIST, clean, 'index.html')];
  return cands.find((c) => existsSync(c) && statSync(c).isFile());
};
let bad = 0; const external = new Set();
for (const p of pages) {
  const html = readFileSync(p, 'utf8');
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(mailto:|tel:|data:)/.test(href)) continue;
    if (/^https?:/.test(href)) { external.add(href); continue; }
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.get(p).has(href.slice(1))) { console.log(`✗ ${p}: missing anchor ${href}`); bad++; }
      continue;
    }
    const target = resolve(href);
    if (!target) { console.log(`✗ ${p}: broken ${href}`); bad++; continue; }
    const hash = href.split('#')[1];
    if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) { console.log(`✗ ${p}: missing anchor ${href}`); bad++; }
  }
}
console.log(`${pages.length} pages checked, ${bad} broken internal links. ${external.size} external links (not fetched):`);
for (const e of [...external].sort()) console.log('  ' + e);
process.exit(bad ? 1 : 0);
