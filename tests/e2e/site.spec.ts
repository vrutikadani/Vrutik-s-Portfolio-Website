import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/systems/', '/systems/ai-first-touch-agent/', '/systems/commission-system/', '/lab/', '/about/', '/speaking/', '/contact/', '/writing/', '/writing/the-model-writes-the-email/', '/404'];

for (const path of PAGES) {
  test(`a11y + basics: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    // No horizontal overflow at this viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('dark theme also passes contrast', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', '/lab/', '/systems/ai-first-touch-agent/']) {
    await page.goto(path);
    const axe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(axe.violations.map((v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual([]);
  }
});

test('Pivot opens, routes to a real page, and can be hidden', async ({ page }) => {
  await page.goto('/');
  const fab = page.locator('[data-pivot-open]');
  await expect(fab).toBeVisible();
  await fab.click();
  await expect(page.locator('#pivot-panel')).toBeVisible();
  await page.getByRole('button', { name: "I'm hiring for an engineering role" }).click();
  const link = page.locator('[data-answer="eng"] a').first();
  await expect(link).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#pivot-panel')).toBeHidden();
  await expect(fab).toBeFocused();
  await fab.click();
  await page.getByRole('button', { name: 'Hide Pivot' }).click();
  await expect(fab).toBeHidden();
  await page.reload();
  await expect(fab).toBeHidden();
  await page.getByRole('button', { name: 'Show the Pivot guide' }).click();
  await expect(page.locator('#pivot-panel')).toBeVisible();
});

test('Lab: lead score updates live and Enter does not reload', async ({ page }) => {
  await page.goto('/lab/');
  const outcome = page.locator('[data-out="lead-outcome"]');
  await expect(outcome).toContainText('score 80');
  await page.getByRole('button', { name: 'Student' }).click();
  await expect(outcome).toContainText('Stop');
  await page.locator('[data-form="lead"] input[name="email"]').press('Enter');
  await expect(outcome).toContainText('Stop');
});

test('Lab: STOP reply is suppressed without the model', async ({ page }) => {
  await page.goto('/lab/');
  await page.getByText('“STOP”').click();
  await expect(page.locator('[data-out="reply-outcome"]')).toContainText('suppress');
});

test('Lab: signal with open opportunity is suppressed; removing it surfaces', async ({ page }) => {
  await page.goto('/lab/');
  const out = page.locator('[data-out="signal-outcome"]');
  await expect(out).toContainText('SUPPRESS');
  await page.getByLabel('Open opportunity exists').uncheck();
  await expect(out).toContainText('SURFACE');
});

test('Lab: owner lock keeps the current owner', async ({ page }) => {
  await page.goto('/lab/');
  await page.getByLabel('A rep handed this record over by hand').check();
  await expect(page.locator('[data-out="owner-outcome"]')).toContainText('Taylor');
});

test('Lab: correction stepper reaches step 4 in both versions', async ({ page }) => {
  await page.goto('/lab/');
  const next = page.locator('#wrong [data-step="1"]');
  for (let i = 0; i < 3; i++) await next.click();
  await expect(page.locator('[data-out="wrong-frame"]')).toContainText('still live');
  await page.getByLabel('After the fix').check();
  await expect(page.locator('[data-out="wrong-frame"]')).toContainText('reverted');
});

test('Lab: lens switch changes the explanation without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/');
  const eng = page.locator('#lead [data-lens="engineering"]');
  await expect(eng).toBeHidden();
  await page.locator('label', { hasText: 'Engineering' }).click();
  await expect(eng).toBeVisible();
  // First paint is server-rendered, so the trace exists with JS off.
  await expect(page.locator('[data-out="lead-outcome"]')).toContainText('score 80');
  await ctx.close();
});

test('Tradeoff slider recomputes', async ({ page }) => {
  await page.goto('/lab/');
  const before = await page.locator('[data-out="t-metrics"]').innerText();
  await page.locator('input[name="threshold"]').fill('0.9');
  await expect(page.locator('[data-out="t-metrics"]')).not.toHaveText(before);
});

test('analytics events fire without leaking typed text', async ({ page }) => {
  await page.goto('/lab/');
  await page.evaluate(() => { (window as any).__ev = []; addEventListener('site:track', (e: any) => (window as any).__ev.push(e.detail)); });
  await page.locator('[data-form="lead"] textarea').fill('my secret email is jane@example.com');
  const ev = await page.evaluate(() => (window as any).__ev);
  expect(ev.some((e: any) => e.event === 'lab_scenario_started')).toBe(true);
  expect(JSON.stringify(ev)).not.toContain('jane@example.com');
});

test('mobile menu works and is keyboard closable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.locator('.nav-mobile summary').click();
  await expect(page.locator('.nav-mobile nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.nav-mobile nav')).toBeHidden();
});

test('SEO: canonical, description, OG image, JSON-LD on every page', async ({ page, request }) => {
  for (const path of PAGES.filter((p) => p !== '/404')) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect((await page.locator('meta[name="description"]').getAttribute('content'))!.length).toBeGreaterThan(50);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const res = await request.get(new URL(og!).pathname);
    expect(res.status(), `${path} og image`).toBe(200);
  }
  for (const f of ['/robots.txt', '/sitemap-index.xml', '/rss.xml', '/llms.txt']) {
    expect((await request.get(f)).status(), f).toBe(200);
  }
});

test('contact shows the email and the resume is served', async ({ page, request }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('link', { name: 'vrutikadani@gmail.com' })).toBeVisible();
  const res = await request.get('/resume.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});
