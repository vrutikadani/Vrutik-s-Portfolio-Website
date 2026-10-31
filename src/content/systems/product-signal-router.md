---
title: Product Signal Router
premise: Signal strength is not actionability. A strong signal can still be the wrong thing to send.
kind: Reference build
context: Began as an interview case study; rebuilt as a public reference build, 2026
evidence: [interview-design, synthetic-public]
order: 5
featured: false
overview:
  problem: Product usage data can tell sellers which self-serve accounts are growing. Joining usage to the CRM is easy. Deciding what deserves a seller's time is not.
  decision: Answer three questions separately (how strong is the signal, how far can we trust it, can this owner act today?) and only then decide. A single score would rank an account with an open deal at the top.
  result: A tested Python pipeline with a live demo. Each account gets one daily decision (surface, hold, suppress, route or no signal) with the rules it passed and the reason it stopped.
  interesting: Adversarial replay broke suppression, ownership, episode state, identity and the evaluator itself. The postmortem shows how each fix changed the design.
owned: All of it. Designed for a hiring case, never deployed at a company.
stack: [Python, Replay harness, In-browser demo]
links:
  repo: https://github.com/vrutikadani/product-signal-router
  demo: https://vrutikadani.github.io/product-signal-router/
publicTwin: Interview design rebuilt on synthetic data. It has never run in production.
---

## Product

The user is a seller with too many accounts. An alert feed they learn to ignore is worse than no feed at all. So the product goal is fewer, better signals, and a clear reason for everything held back.

Seller feedback changes later decisions: "not a fit" quiets an account for 90 days unless the signal gets stronger; "wrong owner" routes it until the CRM owner changes.

## Engineering

| Question | Output | Changes the decision? |
|---|---|---|
| How much qualifying change is there? | Strength: none, medium, high | None never surfaces |
| How far should we trust the reading? | Confidence with reasons | Only low blocks; otherwise it ranks |
| Can this owner act today? | Rules passed and blocking reasons | Any blocking rule stops it |

Reliability details: account-day deduplication so a replay never opens a second signal, episodes instead of daily re-alerts, a weekly cap per owner, and an optional AI summary that runs *after* the decision, sees only aggregates, and can fail without changing anything.

## What failed

An early version relied on medium confidence to stop bad signals. It didn't. Now anything that must stop a signal is a rule in strength or actionability, and confidence only orders and explains. Misses are measured too: a replay harness reports recall and explains every missed conversion.

## Business

Thresholds here are starting points, not fitted values. The design assumes a backtest replaces them. Saying that up front is part of the work.
