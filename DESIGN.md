# Design system

The site should feel like a well-edited technical publication written by someone who builds systems. Cool drafting paper, ink, one red pencil. (A warmer cream was tried first and dropped: it reads as a generic AI-site default.) Everything else is earned.

## The idea: three marks

Every decision in Vrutik's work is made by one of three things. The brand uses them as its only symbols.

| Mark | Shape | Light | Dark | Meaning |
|---|---|---|---|---|
| Rules | ■ square | `#1F4E79` | `#8DB8E8` | Code decides |
| Model | ● circle | `#8A5A00` | `#E0AE4A` | The model helps |
| Person | ▲ triangle | `#B33A12` | `#F08A63` | A person asks |

Each mark has a shape **and** a color, so color is never the only signal (WCAG 1.4.1). The person mark doubles as the accent color, the editor's red pencil, used for numbers, kinds and the active nav item. Nowhere else.

All three pass 4.5:1 on their backgrounds (light: 7.6, 5.2, 5.2; dark: 9.0, 9.1, 7.5).

## Tokens (three tiers, `src/styles/tokens.css`)

1. **Primitives**: raw values (`--paper-100`, `--ink-900`, `--blue-700`, type steps, spacing). Components never use these directly.
2. **Semantics**: meaning (`--surface`, `--surface-raised`, `--text`, `--text-muted`, `--line`, `--rules`, `--model`, `--person`, `--focus`). Dark mode only redefines this tier.
3. **Components**: per-component choices built on semantics (`--btn-bg`, `--chip-bg`, `--trace-pass`, `--pivot-needle`).

Dark mode follows the OS unless the visitor picks a theme. The choice is set before first paint by a 120-byte inline script, so there's no flash.

## Typography

| Role | Face | Why |
|---|---|---|
| Display and reading | **Newsreader** (variable, OFL) | Designed for on-screen reading by Production Type. Optical sizing makes headlines feel set, not scaled. The italic carries the "handwritten annotation" voice. |
| Labels, data, UI | **JetBrains Mono** (variable, OFL) | Says "system" without a fake terminal. Used for eyebrows, nav, traces, evidence chips. |

No third family. Fonts are self-hosted, Latin-subset, `font-display: swap`, and only the roman Newsreader (58 KB) is preloaded. Metric-adjusted fallbacks (`size-adjust`) keep the layout still while fonts load.

Fluid type scale from `--step--1` (≈14px) to `--step-4` (≈74px). Body text is 17–19px with a 66-character measure.

## Layout

- Editorial grid with deliberate asymmetry: big left column for the argument, narrow right column for facts and evidence.
- Lists, not card grids. Systems, talks and experience are ruled rows with typed labels ("Agent", "Revenue system", "Reference build"), borrowing the "typed artifacts" idea from the research audit.
- A 1px ink rule opens each list; 1px paper rules separate rows.
- Gutters scale from 16px on phones to 40px on desktop.

## Illustration

`DecisionMap.astro` is the signature piece: scattered inputs pass a square gate, language goes to the circle, uncertainty goes to the triangle, and four clean outcomes come out. Original hand-written SVG, about 4 KB, with a text description for screen readers. Italic annotations act as the "notebook" voice.

The Pivot glyph (compass ring plus needle) is the wordmark mark, the favicon, the guide, and the 404 illustration. Its needle turns toward the route a visitor picks.

No stock photos, robots, gradients, glass or 3D.

## Motion

| Where | What | Why it exists |
|---|---|---|
| Hero | Four dots travel the decision paths (SMIL, no JS) | Shows that decisions flow, and which ones go to a person |
| Pivot needle | Rotates to the chosen route (420ms, slight overshoot) | Confirms the choice; the only "character" moment |
| Buttons | 1px lift on hover | Affordance |
| Pivot panel | 240ms fade and rise | Origin of the panel |

All motion stops under `prefers-reduced-motion`. The hero dots are hidden entirely.

## Components

| Component | File | Notes |
|---|---|---|
| Header with wordmark, nav, theme toggle | `Header.astro` | Mobile menu is `<details>`, so it works without JS |
| Pivot guide | `Pivot.astro` | Deterministic routes, keyboard and screen-reader friendly, dismissible, remembered |
| Evidence chip | `EvidenceTag.astro` | Links to its definition on /about/#evidence |
| Decision map | `DecisionMap.astro` | Signature illustration |
| Lab trace | `lib/lab/render.ts` | Same renderer server-side (first paint) and client-side (updates) |

## Accessibility rules

- One `h1` per page, ordered headings, landmarks, skip link.
- Touch targets ≥ 44px. Focus ring is 2px `--focus`, offset 3px.
- The lab's lens switch is pure CSS (`:has()`), so it works with JavaScript off.
- Every interactive result region uses `aria-live="polite"` on the outcome only, not the whole trace, so screen readers aren't flooded.
