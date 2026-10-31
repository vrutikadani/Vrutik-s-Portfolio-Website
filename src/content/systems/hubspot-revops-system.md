---
title: CRM, routing and territory system
premise: Routing carries out a coverage policy leaders agree on. It should never invent strategy in code.
kind: Revenue system
context: Geneo United (a Lumenis company), 2024 to now
evidence: [verified-work, firsthand, synthetic-public]
order: 3
featured: true
overview:
  problem: A medical-device and consumables business runs on HubSpot and Salesforce. Lifecycle stages, owners, territories and attribution all have to agree, or reports stop being trusted and leads land with the wrong rep.
  decision: Treat routing tables as data, lock manual handoffs so automation never overwrites a person, and keep lifecycle stages forward-only so funnel reports stay honest.
  result: I rebuilt lead routing for roughly 8,600 new contacts a year and restructured territory and assignment workflows for a new sales structure. The CFO thanked me in writing for the territory work, and it earned a Core Value Rockstar award.
  interesting: Almost every routing bug I fixed turned out to be a policy question nobody had answered yet.
owned: Lifecycle and routing rules, territory and assignment workflows, the weekly eligibility job behind the public provider map, data-quality custom code, and HubSpot training for sales teams.
collaborators: The CRM migration was cross-functional. I owned the company side of mapping, backfills and fixes; the corporate Salesforce team owned the platform. The provider map rule was set with Marketing.
stack: [HubSpot workflows, HubSpot custom code (Node.js), Salesforce, AlignMix, Python]
links:
  repo: https://github.com/vrutikadani/hubspot-revops-system
publicTwin: The real portal runs hundreds of workflows and can't be published. The public repo documents the design and rebuilds the four core engines as tested Python on synthetic data. Names, thresholds and customers are replaced.
---

## Product

Three groups depend on this system and want different things. Sellers want the right leads and no surprise reassignments. Leaders want coverage that matches the plan. Finance and the board want numbers that reconcile.

**Routing is policy.** The current rule set, simplified: a lead whose answer to the medical-director question is yes goes to outside sales by ZIP code. No or blank goes to inside sales. Areas without an outside rep go inside. A rep's manual handoff is never overwritten. When a leader changes coverage, I change a table, not the logic.

**One rule, two products.** The public "Find a Provider" map listed practices that had stopped buying, and once even a rep's home address. With Marketing, I wrote one eligibility rule and built a weekly custom-code job that writes the result, the inputs behind it, a last-run time and an error field to each company. The public map and seller segmentation now read the same fields.

## Engineering

Design principles I hold to (all mirrored in the public repo):

1. **One workflow, one job, one owner prefix.** Data and routing, deals and approvals, tickets and campaigns each have their own prefix.
2. **Routing tables are data.** A territory change edits a ZIP or state map. It does not add branches.
3. **Rebuild, don't patch.** When routing logic gets messy, I clone it into a dated clean rebuild, test it, then retire the old one.
4. **Humans win.** A manual owner handoff is locked.
5. **Forward-only lifecycle.** Stages only move up. Churn changes the customer type, not the stage.
6. **Notify, don't guess.** When no rule matches, the owner gets a task instead of a silent default.
7. **Dry run first.** Address repair and eligibility code run in a dry-run mode before any live write. A pilot of the address fixer on 50 deals filled 17 missing states and held 2 invalid ZIP codes for review before going wider.

## Business

Routing errors are quiet. A lead with the wrong owner looks fine in a dashboard until a deal is lost. The value here is trust: leaders use the reports, and sellers stop working around the system.

## What failed

**The silent opt-out.** During the Salesforce migration, a provider wrote in asking why our emails had stopped. I traced it to the integration writing an opt-out field at cutover, which had affected thousands of contacts. I built a review segment before any bulk change instead of re-subscribing everyone. A blind fix would have created a consent problem. Since then I check consent and lifecycle fields first after any sync change.

**One match key, one point of failure.** Updates were creating duplicate opportunities. The cause was a single ID used as the only match key, with no fallback. I recommended one system of record for opportunity data and limits on where deals can be created, and escalated the record-type fix to the team that owned it.

## What I'd build differently

Monitoring before it's needed. Integrations fail without telling anyone. An alert on sudden changes in consent fields, owners or lifecycle dates would have caught the opt-out problem in hours instead of a customer email.
