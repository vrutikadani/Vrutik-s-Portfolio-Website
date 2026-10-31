# vrutikadani.com

Personal site for Vrutik Adani, GTM Systems & AI Engineer. Static Astro, plain CSS, no client framework.

**Speed targets (all met locally, Lighthouse, simulated mobile):** LCP 0.7–0.9 s, CLS 0, TBT ≤ 30 ms. Most pages ship 2.2 KB of gzipped JavaScript; the Decision Lab ships 9.6 KB.

## Run it

```bash
npm install
npm run dev                      # http://localhost:4321
SHOW_DRAFTS=true npm run dev     # also shows draft writing
```

## Check it

```bash
npm run verify     # types, unit tests, build, draft-leak check, size budget, links, browser tests
```

Browser tests use Playwright. Point them at a local Chrome with `CHROME_PATH=/path/to/chrome` if Playwright's own browser isn't installed.

| Script | What it does |
|---|---|
| `npm run check` | Astro + TypeScript type check |
| `npm test` | 20 unit tests for the Decision Lab rules and helpers |
| `npm run budget` | Fails if any page goes over its HTML or JS budget |
| `npm run links` | Every internal link and anchor resolves |
| `npm run test:e2e` | 46 browser tests: axe (WCAG 2.2 AA) on every page, light and dark, Pivot, every Lab scenario, no-JS lens, mobile menu, SEO tags, analytics privacy |
| `npm run og` | Re-render the social preview image |

## Where things live

```
src/
  site.config.ts        Name, links, email, flags. Change facts here.
  content/systems/      One Markdown file per system (case study)
  content/writing/      Articles. draft: true keeps them out of production
  lib/lab/              Decision Lab rules (ports of the public repos) + renderers
  components/           Header, Footer, Pivot, DecisionMap, EvidenceTag
  pages/                Routes, plus rss.xml, robots.txt, llms.txt
  styles/tokens.css     Three-tier design tokens
public/_headers         Security and cache headers for Cloudflare Pages
templates/              Copy these to add a system or an article
docs/                   Strategy, launch guide, content review, backlog, decision log
DESIGN.md               The design system
```

## Before launch

Read `docs/CONTENT_REVIEW.md`. Then follow `docs/LAUNCH.md`.
