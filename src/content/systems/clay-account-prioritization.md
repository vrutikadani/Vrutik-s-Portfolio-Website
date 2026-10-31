---
title: Signal-based account prioritization in Clay
premise: Rule out the noise before you pay to research it.
kind: Experiment
context: Take-home build on a Clay free trial, Oct 2026
evidence: [interview-design]
order: 6
featured: false
overview:
  problem: Find companies still running end-of-life front-end frameworks in their own software, and rank them for a seller, on a trial budget.
  decision: A cheap ICP gate removes staffing and services firms before any paid research. Research returns categories and URLs, never points. A deterministic formula scores, and a person reviews every high-tier account.
  result: 26 accounts scored for 82.3 of 1,000 credits. Six high tier; only one was both high tier and high confidence, and the table says so.
  interesting: Automated research marked three accounts as corroborated. When I opened the links, two of the three were wrong. Every automated check had passed them.
owned: All of it, as a hiring take-home.
stack: [Clay, Claygent, Formulas]
links:
  repo: https://github.com/vrutikadani/clay-account-prioritization
publicTwin: Built for a take-home case using public information only. Company-level data, no personal contact details.
---

## What it shows

The weights are a judgment, not a measurement, and the write-up says so. A sensitivity check under three other weightings left the high-tier set unchanged.

## The failure that mattered

The fix for the wrong "corroborated" calls was a human override column wired into the score, plus a rule that every high account's sources get opened before anyone maps buyers. Automation found the candidates. A person decided which evidence was real.
