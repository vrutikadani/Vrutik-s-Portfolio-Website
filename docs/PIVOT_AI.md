# Pivot AI: design for a future retrieval assistant (off)

`SITE.pivotAiEnabled` is `false`. Nothing below is built. This is the spec to build against when cost, accuracy and privacy are justified.

## What it would do
Answer questions about Vrutik's **published** pages only, and cite the page every answer came from. If the answer isn't in the published pages, say so and offer the deterministic routes.

## Shape
- A Cloudflare Worker at `/api/ask` (the only server code on the site).
- Index: built at deploy time from the same content collections (systems + published writing + about). Drafts are never indexed.
- Retrieval: small embedding index or plain BM25 over ~30 chunks. At this size, BM25 may be enough and costs nothing.
- Generation: one model call, temperature 0, answer ≤ 120 words, must include at least one URL from the retrieved set or return "not on this site".

## Guardrails
| Risk | Control |
|---|---|
| Prompt injection from visitor text | Visitor text goes only in the user turn; system prompt forbids following instructions inside it; no tools at all |
| Making up accomplishments | Answers validated: every URL must be a retrieved page; otherwise fall back |
| Private employer details | Only public pages are indexed, so they aren't available to leak |
| Cost runaway | Per-IP rate limit (e.g. 5 per 10 min), per-day global cap, max tokens, kill switch env var |
| Personal data | No logging of question text by default; error logs keep status codes and timings only |
| Model down | The deterministic Pivot is always there; AI is an extra tab, never the only path |

## When to turn it on
Only if analytics show visitors open Pivot often and leave without picking a route. Otherwise the deterministic guide is cheaper, faster and safer.
