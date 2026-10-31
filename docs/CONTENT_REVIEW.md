# Content review: things Vrutik must confirm before launch

Every public claim on the site was taken from the V4 Master Playbook, the evidence index, the public GitHub repos, or the resume. These are the items that need a yes, a fix, or a removal.

## Resolved Oct 31, 2026

| # | Item | Decision |
|---|---|---|
| 1 | Awards | Three separate company awards, listed separately: Presidential Award "Execution is Expected" (Jan 2025, National Sales Meeting); Core Value Rockstar "Execution is Expected" (Jan 2026, territory restructure); Core Value Rockstar "Data Drives Decisions" (Oct 2026, dashboards). |
| 2 | Public email | vrutikadani@gmail.com, on Contact. |
| 3 | Resume download | Current resume added at `/resume.pdf` for now (About, Contact, Pivot). **Known issues in that PDF:** it lists PNC (which this site omits), says "4+ years", shows the older ~$20M AOP figure, and publishes a phone number and a different email. Replace it with a clean version when ready: overwrite `public/resume.pdf`. |
| 4 | Payroll title on About | Removed. |
| 5 | commission-engine README | Repo updated to match the playbook wording (commit 1036ab7). |

## Still open

| # | Where | What to do |
|---|---|---|
| 1 | Writing (3 drafts) | Read, edit, set `draft: false` and a real date for each one you approve. Hidden until then. |
| 2 | Photo | Add one authorized photo if you want one. |

## Claims that rest on firsthand evidence only

Labeled "Firsthand account" on the site. Keep the proof ready.

- AI agent: "roughly 12 hours a week" of SDR time, "50+ drafts reviewed". The page already says the baseline needs tightening.
- CRM system: "rebuilt lead routing for roughly 8,600 new contacts a year" (on your resume already).
- ZIP pilot: "50 deals, 17 states filled, 2 ZIPs held" (from the chat record).

## Deliberately left out

- All company revenue, payout amounts ($352.3K etc.), AOP figures and HubSpot counts. Company numbers aren't personal output, and comp data is sensitive.
- Colleague names and quotes. Recognition is described, never quoted.
- Leap.club, Uplara and ASU percentages (DAU +18%, churn −5%, conversion +10%, ticket time −60%): the playbook flags them as historical with unknown denominators.
- Clay / Common Room / Gong production use at Geneo: the weakest claim in the playbook. Only the public Clay take-home appears.
- Breeze assistant: a configured vendor feature; not a system page.
- PNC, PGDM, Blue Star: excluded by your rules.

## Conflict found in a public repo

`commission-engine/README.md` says the Excel model was moved "to automated commission software" and reps "now see attainment live". The playbook says payout is still calculated in the governed workbook and attainment visibility is *moving* to Spiff. The site uses the playbook wording. **Update the repo README to match**, or confirm Spiff is live and update the site.

## Employer review

The site names Geneo United and Lumenis and describes internal systems at a design level, with no customer data. Check Lumenis social media and disclosure policy before launch, the same as for LinkedIn posts.
