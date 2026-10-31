# Backlog

Ordered by expected value. Each item says what evidence would justify it.

## Content
- [ ] Resolve everything in `CONTENT_REVIEW.md` (blocks launch)
- [ ] Approve and publish the three drafts, one per week, paired with LinkedIn posts
- [ ] Clean public resume PDF → `/resume.pdf` + `resume_download` event
- [ ] One authorized photo for About
- [ ] Case study: AR case-intake agent (Copilot Studio). Needs a public-safe rebuild or description approved by Finance
- [ ] Case study: Provider Map eligibility pipeline as its own page
- [ ] `/now` page once there's something current and public to say

## Lab
- [ ] Lab JavaScript has about 0.8 KB left of its 12 KB budget (11.2 KB after Build or buy). Before adding a 7th scenario, load each scenario's script only when it scrolls into view
- [ ] Build or buy: a cost just under $1M (e.g. $999,950) shows "$1000K"; round to "$1.0M" instead
- [ ] Build or buy: the "Buy stays cheaper at every rule-change rate" verdict should also say by how much
- [ ] Build-versus-buy explorer (illustrative inputs: effort, vendor cost, flexibility, maintenance)
- [ ] Ownership game: how incentives and territory rules create conflicting behavior
- [ ] Per-scenario OG images

## Product and design
- [ ] Per-page OG images generated at build (scripts/og.mjs already renders one)
- [ ] Visual test of Safari/WebKit and Firefox (only Chrome was tested so far)
- [ ] Real-device test on iOS Safari and Android Chrome
- [ ] Screen-reader pass with VoiceOver and NVDA (axe passes; a human pass is still needed)
- [ ] Run Impeccable and UX/UI Agent Skills design gates (not installed in this build environment)

## Measurement
- [ ] Decide whether custom events are worth adding GA4/Plausible (see LAUNCH.md §4)
- [ ] First experiment once traffic allows: does a diagram-first case-study header increase repo clicks? Define the metric first.

## Maintenance
- [ ] CI runs `npm run verify` on every pull request (workflow included; needs a Chrome binary on the runner — the GitHub ubuntu image has one)
