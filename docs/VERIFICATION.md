# Verification report

Run on Oct 31, 2026 in a Linux build environment with Node 22 and Google Chrome (headless). Command: `CHROME_PATH=/usr/bin/google-chrome npm run verify`, exit code 0.

## Passed

| Check | Result |
|---|---|
| Type check (`astro check`) | 0 errors, 0 warnings |
| Unit tests (Decision Lab rules, renderers, reading time) | 20 / 20 |
| Production build | 14 pages; no draft writing leaked |
| Size budget | Every page within budget. Normal pages: 4.8 KB JS raw / 2.2 KB gzip. Lab: 23 KB raw / 9.6 KB gzip. HTML 8–17 KB gzip. Preloaded font 58 KB |
| Internal links and anchors | 0 broken across all pages |
| Browser tests, desktop Chrome and Pixel 7 emulation | 45 passed, 1 skipped (mobile-only test on desktop) |
| Accessibility (axe, WCAG 2.0/2.1/2.2 A and AA) | 0 violations on 11 pages × 2 viewports, plus color contrast in dark mode on 3 pages |
| No horizontal overflow | Checked on every tested page at both viewports |
| Lab works without JavaScript | First paint is server-rendered; the lens switch is pure CSS |
| Analytics privacy | Typed text never appears in tracked events |
| SEO | Canonical, description, OG image (HTTP 200), robots.txt, sitemap, RSS, llms.txt |

## Lighthouse (local preview server, before the final palette tweak)

| Page | Mobile perf / a11y / best / SEO | Mobile LCP | CLS | TBT | Desktop LCP |
|---|---|---|---|---|---|
| Home | 100 / 100 / 100 / 100 | 0.7 s | 0 | 20 ms | 0.2 s |
| Decision Lab | 100 / 100 / 100 / 100 | 0.9 s | 0 | 30 ms | 0.3 s |
| AI agent case study | 100 / 100 / 100 / 100 | 0.8 s | 0 | 0 ms | 0.2 s |
| About | 100 / 100 / 100 / 100 | 0.7 s | 0 | 10 ms | 0.2 s |

These are lab numbers from a local server with Lighthouse's simulated mobile throttling. Real-visitor numbers (Core Web Vitals at p75) come from Cloudflare Web Analytics after launch.

## Visual review

Screenshots taken at 320, 390, 768, 1024, 1440 and 1920 px, light and dark. Fixed during review: an illustration label overflowing its box, a stray animation dot before the first frame, missing spacing around inline marks, and the Pivot button losing its accessible name on phones.

## Not verified

- Safari / WebKit and Firefox (only Chrome was available)
- Real iOS and Android devices
- A human screen-reader pass (VoiceOver, NVDA)
- Impeccable and UX/UI Agent Skills design gates (not installed or run; their repositories were not reviewed in this pass)
- Reference sites were read through page fetches, not inspected visually; no reference screenshots were captured
- External links (GitHub, LinkedIn, live demos) were listed but not fetched
- Production deploy, DNS, analytics and Search Console (none done; need approval)
