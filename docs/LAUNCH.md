# Launch, operations and maintenance

Nothing here has been done yet. Every step that costs money, publishes, or changes DNS needs Vrutik's go-ahead.

## 1. Before launch

1. Work through `docs/CONTENT_REVIEW.md`.
2. Run `npm run verify` and keep the output (it must be all green).
3. Decide the domain. `SITE_URL` defaults to `https://vrutikadani.com` as a placeholder; it has **not** been checked for availability.

## 2. Deploy on Cloudflare Pages (free)

1. Push this folder to a new GitHub repo (for example `vrutikadani/site`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: `NODE_VERSION=22`, `SITE_URL=https://<your-domain>`
   - Optional: `PUBLIC_CF_BEACON_TOKEN=<token>` (step 4)
4. Every push to `main` deploys. Every pull request gets its own preview URL.
5. For a private review build with drafts visible, add `SHOW_DRAFTS=true` to the **Preview** environment only. Never to Production.

`public/_headers` sets security headers (CSP, HSTS, frame-deny, nosniff) and long cache lifetimes for fonts and hashed assets.

## 3. Domain and DNS

1. Buy the domain (Cloudflare Registrar is at-cost; about $10.46/yr for .com as of Oct 2026).
2. Pages project → Custom domains → add `yourdomain.com` and `www.yourdomain.com`. Cloudflare creates the DNS records.
3. Add a redirect rule: `www` → apex, 301.
4. Set `SITE_URL` to the final origin and redeploy, so canonical URLs, the sitemap and OG tags are right.

## 4. Analytics

1. Cloudflare dashboard → Analytics & Logs → Web Analytics → Add site → copy the token.
2. Set `PUBLIC_CF_BEACON_TOKEN` and redeploy. With no token, no analytics script loads at all.
3. Cloudflare Web Analytics counts page views, referrers, countries, devices and Core Web Vitals. It does **not** record custom events.
4. Custom events (`project_open`, `pivot_route_selected`, `lab_scenario_completed`...) are already wired through `src/lib/track.ts`. They push to `window.dataLayer` if a tool is added later. Add GA4 or Plausible only when a question needs those numbers. Then load it in `Base.astro` and update the CSP in `_headers`.
5. Events never include typed text, emails or form content. There's a test for it.

## 5. Search Console and Bing

1. Google Search Console → Add property → Domain → verify with the DNS TXT record (Cloudflare DNS).
2. Submit `https://<domain>/sitemap-index.xml`.
3. Bing Webmaster Tools → Import from Google Search Console.

## 6. Monthly report (private, no custom backend)

Once a month, about 20 minutes:

| Source | Export | Look for |
|---|---|---|
| Cloudflare Web Analytics | Top pages, referrers, countries, devices, Web Vitals | Which systems pages get read; LCP/INP at p75 |
| Search Console | Queries, pages, CTR | Which questions bring people in |
| LinkedIn | Post analytics | Which posts send visits |
| GitHub | Repo traffic (Insights → Traffic) | Referrals from the site |

Paste the exports into one sheet. Note counts as counts and rates as rates. Small numbers are small: don't call a winner on 30 visits.

## 7. Rollback

Cloudflare Pages keeps every deployment. Pages project → Deployments → pick the last good one → "Rollback to this deployment". Takes seconds. Or `git revert` the bad commit and push.

## 8. Monthly maintenance checklist

- [ ] `npm outdated`; update Astro and test tools in a branch; `npm run verify`
- [ ] `npm audit` (dev-only findings in Lighthouse's deps don't ship to visitors)
- [ ] Check external links (`npm run links` lists them)
- [ ] Review the analytics report; add one line to `docs/DECISION_LOG.md`
- [ ] Update `docs/BACKLOG.md`
- [ ] Domain renewal date (yearly)

## 9. Publishing a new piece of writing

1. Copy `templates/writing.md` to `src/content/writing/<short-name>.md`.
2. Write. Keep `draft: true`.
3. `npm run dev`, open `http://localhost:4321/writing/<short-name>/`. Drafts show locally with `SHOW_DRAFTS=true npm run dev`.
4. When it's ready: set `draft: false` and the real `date`. Commit and push.
5. The page, RSS, sitemap, llms.txt and Writing nav update on their own.
6. Use the `linkedin.summary` and `hooks` from the front matter for the LinkedIn post, and link the article.

New systems work the same way with `templates/system.md` in `src/content/systems/`.
