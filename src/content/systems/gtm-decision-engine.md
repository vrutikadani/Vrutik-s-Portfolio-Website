---
title: GTM Decision Engine
premise: Uncertainty is a state, not a number in a log.
kind: Reference build
context: Public reference implementation, 2026
evidence: [synthetic-public]
order: 4
featured: false
overview:
  problem: A former champion changes jobs, or a competitor starts showing up on calls. Most "signal" tools turn that into an alert and hope. Sellers learn to ignore the feed.
  decision: Decide in code, let a model help with three bounded jobs, and ask a person whenever identity or ownership is unclear. Every decision, including withheld ones, keeps a full trace.
  result: A working engine with a live in-browser demo, six seeded scenarios, nine architecture decision records, 40 tests and a written postmortem of its hardest failure.
  interesting: The worst bug left every dashboard green. A correction stopped the mistake from repeating but left the CRM wrong.
owned: All of it. This is a personal reference build on synthetic data.
stack: [Python, FastAPI, SQLite, In-browser demo]
links:
  repo: https://github.com/vrutikadani/gtm-decision-engine
  demo: https://vrutikadani.github.io/gtm-decision-engine/
publicTwin: Synthetic reference implementation. It shows architecture, decision boundaries, evaluation and reliability. No employer data or production logic is included.
---

## Product

A seller gets one card when the system acts: the account, why now, who, the evidence, an approved play and a next step. Their feedback changes what happens next. When the system is unsure, the seller sees nothing until a person resolves it.

| | |
|---|---|
| **Code decides** | identity thresholds, champion evidence, ownership, suppression, cooldowns, play eligibility, state transitions, CRM write-back |
| **Model helps** | labels buying intent, extracts competitor mentions with verbatim quotes, drafts one sentence of copy |
| **A person asks** | ambiguous identity, ownership in flux, corrections |

## Engineering

- **Ambiguous identity is a state.** Two people with the same name who each score 0.47 become `NEEDS_REVIEW` with a named reviewer.
- **Provenance on every claim.** Each line on a seller card points to the record it came from. A brief claim without a verbatim quote is rejected.
- **An outbox with idempotency keys** so each CRM write happens at most once, even across crashes and retries.
- **Twelve injectable failures** in the demo, from a duplicate webhook to a crash right after a CRM write.

The architecture decisions are written down as ADRs, including why the model never picks a person, a play or an owner.

## What failed

The hardest failure is in the [postmortem](https://github.com/vrutikadani/gtm-decision-engine/blob/main/docs/FAILURE_POSTMORTEM.md). A seller accepted a card, the engine wrote to the CRM, and then the seller corrected it: wrong person. The correction did its job going forward. Nothing undid the CRM writes it made untrue.

The fix: every correction reason maps to the write types it invalidates, and a compensating write checks what the CRM *actually holds* rather than trusting what the engine thinks it wrote. The lesson I took: every write-back needs a defined inverse.

## Business

The scarce resource in a revenue team is seller attention. A system that sends fewer, better-explained actions, and admits what it doesn't know, earns more of it than one that sends everything.
