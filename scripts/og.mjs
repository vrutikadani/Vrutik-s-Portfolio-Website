// Renders the default social-preview image (1200x630) from HTML, using the
// site's own fonts. Run after changing the brand: `node scripts/og.mjs`.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const font = (f) => `data:font/woff2;base64,${readFileSync(`public/fonts/${f}`).toString('base64')}`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:N;src:url(${font('newsreader-roman.woff2')});font-weight:200 800}
@font-face{font-family:N;font-style:italic;src:url(${font('newsreader-italic.woff2')});font-weight:200 800}
@font-face{font-family:M;src:url(${font('jetbrains-mono.woff2')})}
body{margin:0;width:1200px;height:630px;background:#eeefe9;color:#1c1b18;font-family:N;display:grid;grid-template-columns:1fr 380px;align-items:center;padding:0 80px;box-sizing:border-box}
.e{font-family:M;font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:#5b574e}
h1{font-size:76px;font-weight:450;line-height:1.02;letter-spacing:-.02em;margin:22px 0 28px}
.k{display:flex;gap:28px;font-family:M;font-size:22px;color:#3a3832}.k i{display:inline-block;width:16px;height:16px;margin-right:10px}
.r{background:#1f4e79}.m{background:#8a5a00;border-radius:50%}.p{background:#b33a12;clip-path:polygon(50% 0,100% 100%,0 100%)}
</style></head><body><div>
<div class="e">Vrutik Adani · GTM Systems &amp; AI Engineer</div>
<h1>The interesting work starts <em>after</em> the dashboard.</h1>
<div class="k"><span><i class="r"></i>code decides</span><span><i class="m"></i>model helps</span><span><i class="p"></i>a person asks</span></div>
</div>
<svg viewBox="0 0 32 32" width="300" height="300"><circle cx="16" cy="16" r="13.5" fill="none" stroke="#1c1b18" stroke-width="1"/><path d="M16 1.5v3.2M30.5 16h-3.2M16 30.5v-3.2M1.5 16h3.2" stroke="#1c1b18" stroke-width="1"/><g transform="rotate(-35 16 16)"><path d="M16 6.5 19 16h-6z" fill="#b33a12"/><path d="M16 25.5 13 16h6z" fill="#1c1b18" opacity=".35"/></g><circle cx="16" cy="16" r="1.8" fill="#eeefe9" stroke="#1c1b18" stroke-width=".8"/></svg>
</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og/default.png' });
await browser.close();
console.log('wrote public/og/default.png');
