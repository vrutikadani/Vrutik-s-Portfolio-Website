// Screenshots of key pages at real viewport sizes, for visual review.
// Usage: node scripts/shots.mjs <outDir>   (preview server must be running on :4321)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const out = process.argv[2] || 'shots';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const jobs = [];
for (const w of [320, 390, 768, 1024, 1440, 1920]) jobs.push(['/', w, 'light', false]);
for (const p of ['/systems/', '/systems/ai-first-touch-agent/', '/lab/', '/about/', '/speaking/', '/contact/', '/writing/the-model-writes-the-email/'])
  for (const w of [390, 1440]) jobs.push([p, w, 'light', true]);
jobs.push(['/', 1440, 'dark', false], ['/lab/', 390, 'dark', false], ['/', 390, 'dark', false]);
for (const [path, w, scheme, full] of jobs) {
  const page = await browser.newPage({ viewport: { width: w, height: w < 800 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  const name = `${path.replace(/\//g, '_') || 'home'}-${w}-${scheme}${full ? '-full' : ''}.png`;
  await page.screenshot({ path: `${out}/${name}`, fullPage: full });
  await page.close();
}
await browser.close();
console.log('done', jobs.length);
