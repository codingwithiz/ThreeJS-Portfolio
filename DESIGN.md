# Art Direction — "Terra Nocturne"

Warm, organic, crafted dark. The feeling of a naturalist's night field-journal meeting modern
engineering: tactile, calm, confident, hand-made — the opposite of cold blue-tech "AI slop".
This document is the source of truth for the visual language. Every component should reference it.

## Mood
- Warm darkness, not cold black. Espresso/umber base, candle-amber light, living-green accents.
- Tactile & analog: film grain, paper-like surfaces, topographic/contour line motifs, soft edges.
- Editorial / journal structure: numbered sections (`01 — About`), expressive headlines, generous margins.
- Motion is slow and natural (organic easing), with one well-orchestrated load reveal per view.

## Palette
| Token | Hex | Use |
|---|---|---|
| `bg` | `#14110E` | page background (warm espresso) |
| `surface` | `#211B14` | cards / panels |
| `surface.light` | `#2A2118` | raised / hover surfaces |
| `edge` | `#33291E` | borders / hairlines |
| `ink` | `#F4EDE2` | primary text (warm cream) |
| `ink.muted` | `#B7A893` | secondary text |
| `amber` / `accent` | `#E3A857` | **signature accent** — CTAs, highlights, the "." after the name |
| `sage` | `#8FA67E` | secondary accent — tags, supporting highlights |
| `clay` | `#C75D43` | emphasis / warm pop, used sparingly |

Dominant warm-dark base + a single confident amber accent. Sage and clay are seasoning, not co-stars.

## Typography
- **Display:** Fraunces (variable, optical) — expressive serif for headlines & numbers. Use italic for
  accent words (e.g. *Engineer*). Tight leading on big type (`.9`), negative tracking.
- **Body:** General Sans — clean humanist sans for paragraphs, UI, labels.
- Fluid type scale via `clamp()`. Section labels: small, uppercase, wide tracking (`.3em`), muted.

## Texture & form
- Subtle film grain overlay (SVG `feTurbulence`, opacity ~4%, `mix-blend: overlay`).
- Faint topographic contour rings / warm radial gradient glows for depth — never flat.
- Organic, soft radii (14–22px). Avoid hard glassmorphism everywhere; prefer warm matte surfaces.

## Motion
- Easing: organic / `cubic-bezier(.22,1,.36,1)`-style. Reveals stagger on scroll & on load.
- Hover: warmth + slight lift, never harsh. Optional custom cursor dot.
- Always respect `prefers-reduced-motion` — decorative motion off, content still readable.

## Balance rule
Distinctive & artistic, but a recruiter must grasp **who he is + his impact in ~10 seconds**. Keep the
hero value-prop, impact stats, and project scanning fast and legible underneath the craft.
