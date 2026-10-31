# Working rules for AI agents (Codex, Claude, others)

This repo is Vrutik Adani's personal website. More than one AI agent works on it.
Read this file before every task. A human (Vrutik) approves every merge.

## How we share work

- One task = one branch = one agent. Branch names: `codex/<task>` or `claude/<task>`.
- Never push to `main`. Open a pull request.
- Before opening a PR, run `npm run verify`. It must pass. Paste the summary lines in the PR.
- Keep PRs small. One feature or one content change per PR.
- If you change a rule in this file, say so in the PR title.

## Content rules (most important)

The site's value is that every claim is true. Breaking these is worse than any bug.

1. **Never invent facts.** No new jobs, titles, dates, numbers, awards, talks, quotes or results. If a page needs a fact you don't have, leave a `TODO(vrutik):` comment and say so in the PR.
2. **Employers to use:** Geneo United (a Lumenis company), Arizona State University, Leap.club (Konflake Tech), Mastek Enterprise Solutions, Uplara Inc. **Never** add PNC, a PGDM or Blue Star Limited.
3. **No company numbers.** No revenue, payouts, plan (AOP) figures, or CRM record counts from Geneo. Company numbers are never Vrutik's personal output.
4. **No colleague names or quotes.**
5. **Public GitHub repos use synthetic data.** Never describe them as employer code.
6. **Plans and forecasts are not results.** Interview/take-home work is labeled "Hiring case", never "deployed".
7. **Every system page keeps its evidence labels** (`evidence:` in front matter). See `src/lib/evidence.ts`.
8. **Writing stays `draft: true`** until Vrutik approves it.

## Style rules

- Plain, short sentences. American English. First person for Vrutik's voice.
- No "passionate", "leveraging", "cutting-edge", "transforming", "spearheaded", "robust", "seamless".
- Money as $X.XM or $XK, one decimal at most.

## Engineering rules

- Static Astro site. No client framework (no React/Vue) without a written reason in the PR.
- JavaScript budget: under 4 KB gzip on normal pages, 12 KB on `/lab/`. `npm run budget` enforces it.
- New colors and spacing go through `src/styles/tokens.css` (three tiers; see `DESIGN.md`).
- Every interactive control: keyboard usable, 44px touch target, works in light and dark, respects reduced motion.
- Decision Lab logic lives in `src/lib/lab/*.ts` and must match the public repos. Add a unit test in `tests/unit/` for any rule change.
- No new third-party scripts, cookies or trackers. Analytics events never include typed text.

## Where things are

See `README.md`. Open questions and pending decisions: `docs/CONTENT_REVIEW.md`. Ideas: `docs/BACKLOG.md`.
