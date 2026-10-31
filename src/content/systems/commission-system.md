---
title: Commission system
premise: Commission is revenue infrastructure. Every rate lives in one place, and every payout ties back to a deal.
kind: Finance control
context: Geneo United (a Lumenis company), 2025 to now
evidence: [verified-work, synthetic-public]
order: 2
featured: true
overview:
  problem: After a Finance leadership departure, nobody owned seller pay. Plans changed every quarter. The old model had numbers typed into formulas, so one plan change meant hunting through hundreds of cells.
  decision: Rebuild the model so every quota, tier break, rate and cap lives in one parameter block. Reconcile every deal to the CRM. Run an independent check before anything reaches payroll.
  result: I calculate, reconcile and route commissions for roughly 30 sellers and leaders each quarter. Quarterly files go through Finance review before payroll. Attainment visibility is moving to commission software.
  interesting: The hardest calls were not formulas. They were readings of what a plan was meant to do.
owned: Calculation, reconciliation, plan-rule modeling, explanations to sellers, and routing each file for approval.
collaborators: The Director of Finance reviews the files. The CFO and sales leadership make plan decisions.
stack: [Excel, HubSpot, Salesforce, SAP, Python]
links:
  repo: https://github.com/vrutikadani/commission-engine
publicTwin: The public engine rebuilds the same kinds of rules in Python with synthetic plans, reps and deals. No real plans, names or figures are included.
---

## Product

The users are sellers who want to know what they earned, leaders who approve it, and Finance, which has to defend it. All three need the same thing: a number they can trace.

The plans themselves carry the complexity: tier ladders, monthly advances with a quarterly true-up, ramp quotas for new hires, financing deals that count differently based on the deposit, leadership plans with accelerators and caps, and exceptions that appear mid-quarter.

## Engineering

**One parameter block.** Quotas, tier breaks, rates, caps and the quarter's dates all sit in one place. Rolling to a new quarter is a parameter change, not a rebuild. The public engine follows the same rule: every constant is in `plans_q3.json`.

**Honest true-ups.** The quarter is settled as earned minus advances. An older version floored the true-up at zero, which hid overpayments. I removed the floor, so a negative balance shows up and gets a decision.

**Earned versus payable.** When a cap binds, earned and payable appear on separate lines. A reviewer can see both the plan math and the policy limit.

**Independent checks.** Before payroll, the numbers are recomputed a second way and compared against a CRM attainment view. The engine trusts the deal log, so a wrong close date or owner produces a confident wrong payout. The second check exists for that reason.

## Business

Pay errors cost trust faster than almost anything else in a sales team. The goal was not a clever model. It was a quarter close where nobody has to take the number on faith.

## What failed, and what I did

**The amendment that would have cut pay.** Two plan amendments changed how financed deals count toward tiers. My first build, read literally, lowered two reps' pay. The amendment's purpose was to help reps reach a higher tier, never to reduce pay. I rebuilt from a clean baseline with an upward-only reading and sent the one open scope question to leadership. The wrong version never reached payroll.

**Escalating, not deciding.** When a question was a policy choice rather than a calculation, I wrote it up as an explicit choice for leadership instead of picking an answer inside a formula.

## What I'd build differently

Retro tier rates create a cliff at each break. That is a plan-design choice worth questioning, not a property of the model. I'd also move the second check from a manual step to a scheduled comparison with an alert.
