---
title: The model writes the email. Code decides who gets one.
description: How I split work between deterministic rules, a language model and a person when building an AI first-touch sales agent, and why the split matters more than the prompt.
date: 2026-10-30
draft: true
kind: Essay
topics: [AI agents, GTM engineering]
related: [ai-first-touch-agent]
linkedin:
  summary: Most AI SDR demos show what the model can do. The more useful design question is what it should never be allowed to decide. Here is the table I used.
  hooks:
    - The model writes the email. Code decides who gets one.
    - I didn't launch our AI agent on a date. I launched it on draft 50.
    - An opt-out is a legal fact, not a judgment call. So why would you let a model make it?
speakingAngle: "Where the model stops: designing decision boundaries for GTM agents"
---

When people ask how an AI sales agent works, they usually mean the prompt. The prompt was the least interesting part of the one I built.

The interesting part was a table. For each decision the agent makes, who makes it: a rule, the model, or a person?

## Start with the decisions, not the model

An inbound first-touch agent makes about six decisions:

1. Is this lead worth an email at all?
2. Is this address allowed to receive one?
3. Is this particular draft safe to send?
4. What did the reply mean?
5. What happens next?
6. What do we do when we're not sure?

Only one of those is genuinely ambiguous. Number 4. A reply like "who do I talk to about financing?" is a buying signal phrased as a question. "Pricing please. Actually never mind, take me off your list" is two intents in one message. Language is messy, and reading messy language is what models are good at.

Everything else is checkable. Whether a lead is a dermatologist or a student is a rule. Whether an address opted out is a fact. Whether a draft greets the wrong person or leaks a template variable can be tested before it leaves.

## The rule I build by

> Keep decisions about money, ownership and eligibility deterministic. Let the model handle language. Put a person in front of customers first.

In practice that means the model's output never touches the CRM directly. Its label picks a branch in plain code. If the label is unclear or the confidence is low, the lead goes to a person.

Two rules sit above everything else, including the model. An unsubscribe is honored even when the classifier is unsure. A hard bounce suppresses the address permanently. In the public rebuild, opt-out patterns are matched *before* the model ever sees the reply, so a confident wrong answer can't keep emailing someone who said stop.

## Launch on evidence, not on a date

The agent ran in draft mode first. Every email waited for a person. It stayed there until I'd reviewed more than 50 drafts and reply labels without a wrong one. The stop condition was agreed before launch: one email to the wrong person, or one wrong draft, pauses sending.

## The honest gap

My production evaluation is still review-based. I read drafts, watch the reply-label mix, and track bounces, opt-outs and broken threads. That works at this volume, but it isn't a test suite.

In the [public rebuild](https://github.com/vrutikadani/ai-sdr-agent) I grade 40 labeled replies on two separate things: was the label right, and was the *action* right? A wrong label that lands in human review is a safe miss. An ignored opt-out is critical and fails CI. The first run caught three of those. That's the shape I'm moving production toward.

## What I'd tell someone building one

- Write the decision table before the prompt.
- Make the expensive mistakes impossible in code, not unlikely in a prompt.
- Grade outcomes by what they cost, not just label accuracy.
- Watch the inputs. When the reply mix shifts, a new form or campaign usually changed before the model got worse.
