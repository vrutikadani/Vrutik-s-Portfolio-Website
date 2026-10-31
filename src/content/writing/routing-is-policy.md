---
title: Every routing bug I've fixed was a policy question
description: Lead routing looks like a workflow problem. Most of the time it's an unanswered business decision hiding inside one. Notes from rebuilding routing for a medical-device sales team.
date: 2026-10-31
draft: false
kind: Field note
topics: [RevOps, Lead routing]
related: [hubspot-revops-system]
linkedin:
  summary: Most routing "bugs" are policy questions nobody answered. When I find one, I write the question down for a sales leader instead of picking an answer inside a workflow.
  hooks:
    - Every routing bug I've fixed was a policy question.
    - Automation kept undoing what reps did on purpose.
speakingAngle: Routing is policy, not code
---

A lead lands with the wrong rep. Someone files a ticket: "routing is broken."

When I dig in, the workflow is usually doing exactly what it was told. The problem is that nobody decided what *should* happen in this case.

## Three examples (simplified)

**A blank answer.** The form asks whether the practice has a medical director. Yes goes to outside sales. No goes to inside sales. What about blank? The workflow did something, but nobody had chosen it. The fix wasn't a new branch. It was a sales leader saying "blank goes inside", and me writing that down.

**An area with no outside rep.** The rule said "medical director: yes → outside rep for this ZIP." Some ZIPs had no outside rep. The workflow fell through to a default. Now the rule is explicit: no outside coverage means inside sales.

**A rep's deliberate handoff.** A rep hands a lead to a colleague on purpose. The next time the contact updates, automation reassigns it back. Nothing was broken in the code. It just didn't know a person had made a choice. Manual handoffs are now locked.

## What I do now

- When a case isn't covered, the owner gets a task. No silent defaults.
- Coverage lives in tables (ZIP to rep, state to rep), not in branches. A territory change is a table edit.
- When routing logic gets messy, I rebuild it as a dated clean version, test it, and retire the old one instead of patching.
- Policy questions go to leaders as explicit choices, in writing.

The workflow is the easy part. The rule set leaders agree on is the product.
