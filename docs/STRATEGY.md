# Strategy: research, visitors, concepts and the chosen direction

Phase 1 output. Written Oct 31, 2026.

## 1. Research audit (summary)

Sites inspected through page fetches, not a visual browser. Anything rendered only in canvas or client-side JavaScript could not be inspected, and is marked so. Screenshots of the reference sites were **not** captured.

| Site | Genuinely distinctive | Principle to reinterpret | Do not copy | Weaknesses seen in markup |
|---|---|---|---|---|
| kashishkalra.com | One sharp thesis line; each project has its own idea | One-sentence **premise with a point of view** per project | Her visual-essay format and voice | No h1/h2, empty alt, leftover cart icon |
| aashay.vercel.app | (Not inspectable: client-only render) OS metaphor | A metaphor must hold up the content | The OS-desktop trope | Nothing in the HTML for crawlers or link previews |
| rauno.me | Manifesto homepage; items labelled by kind | **Typed artifacts**: every item says what it is | "Make it ___" litany, his craft prototypes | `user-scalable=no` blocks zoom; unlabeled icon links |
| emilkowal.ski | Extreme restraint; live demos inside articles | Show evidence inline; a "today" line | The animation-craft theme | Mostly clean |
| joshwcomeau.com | Teaching through interactive widgets | One interactive explainer per flagship idea | Mascot, sounds, whimsy | Heavy hydrated JS on widget pages |
| brittanychiang.com | The best accessibility basics in the set | Experience as structured records | The layout (cloned everywhere) | Ships React for a static page |
| bruno-simon.com | (Mostly not inspectable: WebGL) the site is the proof | The medium should prove the claim | Everything | Content locked in canvas |
| aashnadoshi.com | (Not inspectable: client-only) | One identity line, not a list of hats | Hyphenated role stack | Generator's OG image left in place |
| nickvelten.nl | Outcome-first track-record cards | Lead with the decision or result | Mixed-case type, growth-hacker tone | Empty alt, tag cloud noise |
| Webflow "8 examples" | Mostly artists and entertainers | Sophia Amoruso: set up an assumption, then knock it down with evidence | Split-letter text animations | Screen readers read split text as garbage |

**What makes the fast ones feel fast:** the content is in the first HTML response, there is little on the first screen, and interactivity lives only on the pages that need it.

**Devil's advocate:** most references are design engineers whose craft *is* how the site looks. Vrutik's audience will judge systems thinking. A craft aesthetic without equally strong evidence would read as style over substance.

## 2. Visitors and their shortest path

| Visitor | What they need to believe | Shortest path |
|---|---|---|
| Engineering leader | Real decisions, tests, failure handling | Home → GTM Decision Engine → postmortem → repo |
| Founder / exec | Judgment about money, risk, ownership | Home → rule strip → Commission system → About |
| Technical product leader | Discovery, rollout, tradeoffs | AI agent → Product view → Lab lens: Product |
| Recruiter | Where he fits, dates, contact | Home hero → About#experience → Contact |
| Builder | Something to run | Systems → "Public builds you can run" → repo |
| Event organizer | Topics backed by work | Speaking → system pages → Contact#speaking |
| General visitor | Who he is, in plain words | Home hero → Decision map legend → Lab scenario 1 |

Nobody has to choose a persona. Pivot offers the same paths as a shortcut.

## 3. Three concepts

| | A. Editorial Field Guide | B. Decision Atlas | C. Builder's Workshop |
|---|---|---|---|
| Feel | Technical publication | Interactive map of signals and decisions | Studio desk of prototypes and notes |
| Type | Serif + mono | Mono-heavy, data UI | Sans + handwriting |
| Color | Paper, ink, one accent | Dark canvas, signal colors | Kraft, sticky-note yellow |
| Homepage | Thesis, illustration, ruled list of systems | Full-screen navigable graph | Pinboard of artifacts |
| Mobile | Excellent (it's text) | Hard; graphs don't shrink | Medium; pinboards become lists |
| Accessibility | Easy | Hard (spatial UI) | Medium |
| Speed | Fastest | Slowest (graph JS) | Medium |
| Maintenance | Markdown files | Graph data for every page | Many small assets |
| Risk | Can look plain | Gimmick; content hidden behind interaction | Can look like a student portfolio |
| Fit | Execs, recruiters, editors | Engineers (briefly) | Builders |

**Decision:** A as the base, with B's best idea confined to one place: the Decision Lab. That keeps every page fast and readable, and gives the site one memorable interactive experience that proves the thesis instead of decorating it. C's "notebook" warmth survives as italic annotations in the illustrations.

## 4. Information architecture

```
/                 Home: thesis, decision map, rule, 3 systems, lab teaser, notes, proof, person, CTA
/systems/         Index split: "Systems I run" vs "Public builds you can run"
/systems/[slug]   30-second version → Product → Engineering → Business → failures → next
/lab/             5 scenarios + lens switch (Business / Product / Engineering)
/writing/         Hidden from nav until at least one piece is published
/writing/[slug]   Draft banner + noindex until approved
/about/           Story, how I work, experience, education, recognition, evidence labels
/speaking/        Talks he can give (stated honestly: no conference talks yet)
/contact/         Intent-based routes to LinkedIn (email when approved)
/rss.xml /sitemap-index.xml /robots.txt /llms.txt
```

`/now` was not built: there is no public-safe, current content for it yet. It's in the backlog.

## 5. Cost model

Checked Oct 31, 2026. Recheck before buying anything.

| Item | Cost | Notes |
|---|---|---|
| Hosting: Cloudflare Pages, Free | $0 | 500 builds/month, 20,000 files, 25 MiB per file ([limits](https://developers.cloudflare.com/pages/platform/limits/)). This site uses 17 pages and ~40 files. |
| Domain (.com) at Cloudflare Registrar | ~$10.46/yr, rising to ~$11.17 for renewals after Nov 1, 2026 | At-cost pricing ([costgoat, updated Oct 20, 2026](https://costgoat.com/pricing/cloudflare-domains)) |
| Analytics: Cloudflare Web Analytics | $0 | Page views only; no custom events |
| Optional: GA4 or Plausible for custom events | $0 (GA4) or paid (Plausible) | Only if the event data would change a decision |
| Optional: contact form (Cloudflare Worker + email) | ~$0 at this volume | Not built; LinkedIn covers it today |
| Optional: Pivot AI (retrieval assistant) | Per-token model cost | Off. See `PIVOT_AI.md` for caps before enabling |
| Optional: newsletter | $0–$10+/mo | Not justified until there are regular posts |

**Expected monthly cost at launch: $0, plus about $11 a year for the domain.**
