---
title: AI first-touch sales agent
premise: The model writes the email. Code decides who gets one.
kind: Agent
context: Geneo United (a Lumenis company), 2026
evidence: [firsthand, synthetic-public]
order: 1
featured: true
overview:
  problem: Inbound web-form leads waited in a manual queue until an SDR had time. Most were students, job seekers or the merely curious, so SDR hours went into first emails that went nowhere while real buyers cooled off.
  decision: Keep eligibility, suppression and routing in deterministic code. Give the model two jobs only, drafting the email and reading the reply. Put a person in front of every send until the drafts earned trust.
  result: The agent now handles first touch on inbound leads. By my count it removed roughly 12 hours a week of manual SDR work. Before it sent anything on its own, I reviewed 50+ drafts and reply labels.
  interesting: The design question was never "what can the model do?" It was "what should it never be allowed to decide?"
owned: Problem framing, the decision boundary, the Python service on the Claude API and HubSpot APIs, the review gate, and day-to-day monitoring.
collaborators: The SDR team defined what a good handoff looks like and reviews what the agent passes them.
stack: [Python, Claude API, HubSpot APIs, Email]
links:
  repo: https://github.com/vrutikadani/ai-sdr-agent
publicTwin: The production agent runs on company systems I can't publish. The public repo is a from-scratch rebuild on synthetic leads. No production prompts, data or code are in it.
---

## Product

The people this serves are SDRs, and their scarce resource is attention. A first email to a student costs as much SDR time as a first email to a dermatologist who wants pricing. So the product problem was triage, not writing.

I started from the decisions, not the model. For each step I asked who should make the call and what it costs when they get it wrong:

| Decision | Made by | Why |
|---|---|---|
| Is this lead worth an email? | Rules | SDRs must trust routing, so every point has a written reason |
| Is this address suppressed? | Rules | An opt-out is a legal fact, not a judgment call |
| Is this draft safe to send? | Rules | Wrong recipient, an unfilled template and length are all checkable |
| What did the reply mean? | Model | The only truly ambiguous step |
| What happens next? | Rules | The model's label picks a branch. It never writes to the CRM |
| Anything uncertain | A person | Low confidence or any guardrail failure goes to review |

**Launching on evidence, not a date.** The agent had two modes. In draft mode every email waited for a person. It stayed there until I had reviewed 50+ drafts and classifications without a wrong one. The stop condition was agreed before launch: one email to the wrong person, or one wrong draft, pauses sending.

**What I dropped.** I tried voice as the first channel and dropped it. Email is cheaper, it leaves a record, and this buyer replies to email.

## Engineering

The pipeline is short on purpose: score the lead with rules, draft from a template, run guardrails, send or queue, read the reply, branch.

Two rules override everything else. An unsubscribe is honored even when the classifier is unsure. A hard bounce suppresses the address for good. In the public rebuild, opt-out patterns are matched *before* the model ever sees the reply, so a confident wrong label cannot keep emailing someone who said stop.

Failure handling I designed for:

- **Malformed model output** is parsed as `unclear` with confidence 0 and goes to review.
- **A duplicate webhook** delivering the same reply twice is skipped by Message-ID.
- **A reply from a colleague or an old thread** is matched by In-Reply-To, then References, then sender. An address shared by two leads goes to a person.
- **Out-of-office replies** are ignored.

**Evaluation, honestly.** In production, evaluation is review-based: I read drafts and labels and watch replies, misclassifications, bounces, opt-outs and broken threads. It is not instrumented yet. There is no held-out test set or alerting. The public rebuild shows what I'm moving toward. Its 40 labeled replies are graded on two things separately: was the label right, and was the *action* right? A missed opt-out is graded critical and fails CI. The first run caught three of them ("take me off your mailing list", "Don't email me", "STOP"). The rule was widened in the next commit.

## Business

The value case is time and speed: SDR hours stop going to non-buyers, and real buyers hear back fast. I counted roughly 12 hours a week from the queue the agent replaced. I'd want a cleaner baseline before I quoted that number to a CFO, and I say so.

Why build instead of buy? Off-the-shelf AI SDR tools could not use our scoring rules or respect our routing. The parts that make this safe are the boring parts, and those had to be ours.

## What could still fail

- The inputs change before the model does. A new form, campaign or market shifts the reply mix. I watch the label mix week over week for that reason.
- An over-broad opt-out rule loses some real leads. That is deliberate: a lost lead costs less than an ignored opt-out.

## What I'd build differently

Instrument evaluation from day one. A fixed reply set, tracked accuracy by label, and an alert on review-queue volume would let me change a prompt or a model with numbers, not a feeling.
