// Performance budget for the built site. Fails the build if a page ships
// more than its share. Sizes are gzip, which is what a visitor downloads.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET = { html: 30_000, js: 4_000, jsLab: 12_000, fontsPreloaded: 70_000 };
const gz = (b) => gzipSync(b).length;
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); } })(DIST);

let fail = false;
const rows = [];
for (const p of pages.sort()) {
  const html = readFileSync(p);
  const srcs = [...html.toString().matchAll(/<script[^>]+src="(\/_astro\/[^"]+)"/g)].map((m) => m[1]);
  const inline = [...html.toString().matchAll(/<script(?![^>]*(src=|application\/ld\+json))[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[2]).join('');
  const jsRaw = srcs.reduce((n, s) => n + statSync(join(DIST, s)).size, 0) + Buffer.byteLength(inline);
  const jsGz = srcs.reduce((n, s) => n + gz(readFileSync(join(DIST, s))), 0) + gz(Buffer.from(inline));
  const page = '/' + relative(DIST, p).split(sep).join('/').replace('index.html', '');
  const isLab = page.startsWith('/lab/');
  const over = gz(html) > BUDGET.html || jsGz > (isLab ? BUDGET.jsLab : BUDGET.js);
  if (over) fail = true;
  rows.push({ page, htmlGz: gz(html), jsRaw, jsGz, ok: over ? 'OVER' : 'ok' });
}
const font = statSync('public/fonts/newsreader-roman.woff2').size;
if (font > BUDGET.fontsPreloaded) fail = true;
console.table(rows);
console.log(`Preloaded font: ${(font / 1000).toFixed(1)} KB (budget ${BUDGET.fontsPreloaded / 1000} KB)`);
const nonLab = rows.filter((r) => !r.page.startsWith('/lab'));
console.log(`Max JS on a non-lab page: ${Math.max(...nonLab.map((r) => r.jsRaw))} bytes raw, ${Math.max(...nonLab.map((r) => r.jsGz))} bytes gzip`);
process.exit(fail ? 1 : 0);
