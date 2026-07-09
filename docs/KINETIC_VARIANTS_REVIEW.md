# KINETIC VARIANTS — REVIEW & SCORES

Reviewed 2026-07-10 from 90 screenshots (1440/1280/390 × hero/mid/content) in
`artifacts/kinetic/`. Axes 1–10: first impression · kinetic wow · premium feel ·
readability · personal identity · recruiter credibility · mobile quality ·
technical feasibility · performance.

## Scoreboard

| Variant | First | Wow | Premium | Read | Identity | Recruiter | Mobile | Feasible | Perf | TOTAL |
|---------|-------|-----|---------|------|----------|-----------|--------|----------|------|-------|
| **v5 Magazine** | 10 | 8 | 9 | 9 | 10 | 9 | 9 | 9 | 9 | **82** |
| **v1 Page Tear** | 9 | 8 | 9 | 9 | 9 | 9 | 7 | 9 | 9 | **78** |
| **v6 Pipeline** | 8 | 8 | 9 | 9 | 7 | 10 | 9 | 9 | 9 | **78** |
| v10 Living Room | 9 | 9 | 8 | 8 | 10 | 7 | 6 | 8 | 9 | 74 |
| v7 Field Log | 7 | 7 | 8 | 9 | 8 | 7 | 8 | 9 | 9 | 72 |
| v9 Horizontal | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 7 | 71 |
| v3 Particles | 8 | 9 | 8 | 8 | 7 | 7 | 7 | 8 | 6 | 68 |
| v8 OS Physics | 7 | 7 | 8 | 8 | 8 | 8 | 7 | 8 | 7 | 68 |
| v2 Fabric | 8 | 7 | 7 | 8 | 9 | 8 | 6 | 8 | 6 | 67 |
| v4 Lab Core | 6 | 6 | 6 | 9 | 8 | 9 | 6 | 8 | 6 | 64 |

## Per-variant notes

**v5 Magazine — WINNER.** The z-sandwich cover (KRISHNA behind the head,
MADHAN in front) is an instant "this is different" moment and the best
5-second identity read of the ten. Mobile cover is stunning. Fix: front type
sits over the eyes at 390px (drop from 38% → ~46/48%); deconstructed portrait
collides with rising panel 1 at 1440.

**v1 Page Tear — best physical moment.** Warm-paper editorial cover over the
dark machine room; the peel shards mid-tear read as real paper. Costs nothing
(transform + clip-path only). Mobile loses the portrait (md-only). The tear is
the single most memorable transition of the set.

**v6 Pipeline — best systems storytelling + recruiter case.** ETL stages
powering on before the lab systems is the exact JPMC→lab bridge the brief
asked for. Mobile (spine left, cards indented) is the best mobile content
layout of the ten. Hero is the most conventional — needs v5/v1's drama.

**v10 Living Room — best personal signature.** The self-drawing blueprint of
the real lab + power-on beat is the most surprising idea. Label collisions at
390 and around the router; as a full hero it under-serves recruiters — better
as a section than a hero.

**v7 Field Log** — mood-reactive status bar is a genuine delight; BUG: pupil
centering (framer x/y overrides Tailwind -translate-50%) leaves eyes looking
down-right. Charming but a narrower story than v5/v6.

**v9 Horizontal** — competent cinema, numeral parallax works, mobile fallback
clean. Nothing wrong; nothing unforgettable. Trace bubble clips at frame top.

**v3 Particles** — detonation is the biggest raw wow; identity dims mid-hero
and 4.2k-point per-frame loop is the heaviest thing shipped. Keep as garnish,
not as the spine.

**v8 OS Physics** — momentum drag is fun; docked grid leaves dead bands
(10%/55% rows), banter window clips. R3F bundle pulled in only via a util
import (splittable). Good, not winning.

**v2 Fabric** — cloth reads well live; texture edge streaks at the displaced
plane border look like artifacts in stills; portrait-right composition fights
the credibility strip at 1440.

**v4 Lab Core** — the right-column content is excellent recruiter material,
but flat-shaded boxes read as "programmer art" — weakest first impression.

## Final recommendation
- **Best single variant:** v5 Magazine
- **Best hero interaction:** v1's tear — applied TO v5's cover
- **Best systems section:** v6 pipeline machine (stages → stations)
- **Best mobile layout:** v6 content spine + v5 cover
- **Best visual language:** v1's warm-paper cover over the v4 graphite room
- **Merge plan for /kinetic/final:**
  1. HERO (sticky ~300vh): v5 magazine cover re-set on v1's warm paper —
     cutout portrait, KRISHNA (ink) behind head / MADHAN (blue) in front,
     masthead + cover lines. At ~35% scroll the entire cover TEARS open
     (v1 jagged halves) revealing the dark machine room + live lab status.
  2. SYSTEMS: v6 spine with packets; 3 professional stages power on, then
     3 lab system stations (full SystemCards with proofs).
  3. SIGNATURE: v10 blueprint as a compact self-drawing section (draw on
     inView, power-on after), labels decluttered, hidden desc on mobile.
  4. CONTACT: shared block + footer.
  - Carry fixes: v5 front-type % (clear the face), v6 trace overflow-hidden,
    no R3F on final (perf: transform/SVG only → light first-load).
