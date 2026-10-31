---
title: Every write-back needs an inverse
description: A bug where a seller's correction fixed future decisions but left the CRM wrong, and the design rule it taught me about automations that write to a system of record.
date: 2026-10-24
draft: true
kind: Teardown
topics: [CRM architecture, Reliability]
related: [gtm-decision-engine]
linkedin:
  summary: The worst bug in my decision engine left every dashboard green. A correction stopped the mistake from repeating but never undid what the system had already written to the CRM.
  hooks:
    - The worst bug I found left every dashboard green.
    - Idempotency stops a write from happening twice. It does nothing about a write that should no longer exist.
speakingAngle: Corrections are events with side effects
---

This happened in a [reference build](/systems/gtm-decision-engine/) on synthetic data, during adversarial testing. It never touched a real system. It's still the most useful bug I've found this year.

## The sequence

1. The engine tells a seller that a former champion, Chris Walker, just joined a target account. Identity confidence is high, because the CRM contact's profile URL matches the vendor's signal.
2. The seller accepts. The engine writes to the CRM: it links Chris to the new account and creates a task.
3. The seller calls and finds out it's a different Chris Walker. Our CRM had the wrong profile URL. She marks it **wrong person**.
4. The correction does what it was designed to do. It stores an exclusion so this match never comes back, opens a data-quality task, and re-evaluates the signal as suppressed.
5. Nothing undoes step 2.

The CRM still says our champion works there. The seller still has a task to email a stranger.

## Why nothing caught it

Every check said things were fine. The run's state was correct. The rerun's trace was correct. The feedback test passed, because it checked that the mistake did not *repeat*.

The damage was in another system, and nothing asserted on it.

## The design gap

The engine handled repeats but not reversal. Idempotency keys guarantee each write happens at most once. They say nothing about a write that should no longer exist. The state machine treated "accepted → corrected" as a state change, not as an event with consequences.

## The fix

Each correction reason now maps to the write types it makes untrue. "Wrong person" invalidates the association and the task. "Wrong play" invalidates only the task, because the association is still true.

The compensating step reads what the CRM *actually holds* for that decision. It doesn't trust the engine's memory of what it wrote, because a write can crash halfway.

## The rule

Before an automation writes to a system of record, answer one question: if a person later says this was wrong, which of these writes become false, and who removes them?

If the answer is "nobody", the automation isn't finished.
