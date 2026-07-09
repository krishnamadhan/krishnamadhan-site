# KINETIC VARIANTS — REVIEW & SCORES

> Filled in Phase C after all 10 variants build clean and are screenshotted.
> Axes (1–10): first impression · kinetic wow · premium feel · readability ·
> personal identity · recruiter credibility · mobile quality · technical
> feasibility · performance.

## Scoreboard

| Variant | First | Wow | Premium | Read | Identity | Recruiter | Mobile | Feasible | Perf | TOTAL |
|---------|-------|-----|---------|------|----------|-----------|--------|----------|------|-------|
| v1 Page Tear | – | – | – | – | – | – | – | – | – | – |
| v2 Fabric | – | – | – | – | – | – | – | – | – | – |
| v3 Particles | – | – | – | – | – | – | – | – | – | – |
| v4 Lab Core | – | – | – | – | – | – | – | – | – | – |
| v5 Magazine | – | – | – | – | – | – | – | – | – | – |
| v6 Pipeline | – | – | – | – | – | – | – | – | – | – |
| v7 Field Log | – | – | – | – | – | – | – | – | – | – |
| v8 OS Physics | – | – | – | – | – | – | – | – | – | – |
| v9 Horizontal | – | – | – | – | – | – | – | – | – | – |
| v10 Living Room | – | – | – | – | – | – | – | – | – | – |

## Per-variant notes
(one block per variant after screenshot review: what lands, what fails, verdict)

## Final recommendation
- Best single variant: TBD
- Best hero interaction: TBD
- Best systems section: TBD
- Best mobile layout: TBD
- Best visual language: TBD
- Merge plan for /kinetic/final: TBD

## Engineering facts (pre-screenshot, from build)
- Bundle first-load: v1 156kB · v5 155kB · v6 150kB · v7 147kB · v10 151kB (no R3F) — v2 359 · v3 359 · v4 359 · v8 364 · v9 364kB (R3F in chunk; v8/v9 only via a shared util import — splittable).
- All 10 static-render clean; / and /v3 byte-untouched.
- Reduced-motion: v1/v5/v10 static compositions; v2 img fallback + no letter wave; v3/v4 static canvas fallback divs; v6 spine pre-inked, stations powered; v7 eyes static, no blink; v8 pre-docked; v9 native vertical.
- Mobile-lighter: v2 fewer cloth segments; v3 1800 vs 4200 particles; v8/v9 skip sticky physics entirely on touch.
- Known caveats to verify on screenshots: v1 paper-face duplicate render cost; v5 depends on portrait-cutout.webp quality; v8 window overlap below 1280px; v6 packet visibility on mobile (spine at left edge); v10 SVG label collision at 390px.
