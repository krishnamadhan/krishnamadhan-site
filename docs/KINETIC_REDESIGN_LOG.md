# KINETIC REDESIGN — WORKING LOG

Mission: 10 radically different kinetic portfolio variants at `/kinetic/v1..v10`,
review + score, converge into `/kinetic/final`. Production `/` and `/v3` untouched.

## Acceptance criteria for /kinetic/final
- Dramatically better than /v3; memorable hero scroll transformation
- ≥1 physical-feeling effect (tear / fabric / particles / deconstruction)
- Clear portrait/identity in 5s: Krishna Madhan · SWE @ JPMorgan Chase · NIT Trichy · AI systems · data platforms · robot pet · Banter Agent · living-room lab
- Alive, proof-driven systems cards (no placeholders) · polished mobile · reduced-motion works · build passes

## Creative direction (Phase A output) — the 10 concepts

| # | Concept | Core kinetic mechanic | Signature moment |
|---|---------|----------------------|------------------|
| v1 | Editorial Page Tear | Warm-paper editorial cover over dark lab; scroll tears it open along a procedural jagged diagonal (two clip-path halves rotate/peel apart, shadowed edges) | The premium cover physically rips to reveal the machine room underneath |
| v2 | Fabric / Flag | Portrait+name panel as R3F plane, vertex sine-field displacement; amplitude driven by scroll velocity + pointer, spring-damped settle | The identity banner ripples like heavy silk when you scroll fast, then calms |
| v3 | Particle Explosion | ~4k R3F points morph: lab-core knot → blast outward (per-particle velocity, damping) → reassemble as "SYSTEMS" text sampled from canvas | The core detonates mid-scroll and the debris becomes typography |
| v4 | Mechanical Lab Core | ONE persistent procedural object, 5 states across sections: monolith → orbiting modules map → pipeline conveyor → robot silhouette (glowing eyes) → contact beacon | Same object the whole page — it *becomes* each chapter |
| v5 | Magazine Cover | Portrait-cutout z-sandwich (type behind head, type in front); scroll folds the cover into a grid of proof panels | KRISHNA threads behind his head like a Vogue masthead, then the cover deconstructs |
| v6 | Pipeline Machine | Full-page SVG spine; data packets travel the path with scroll; each systems card is a station that powers on when a packet arrives | Scrolling literally runs the pipeline; cards ingest packets |
| v7 | Field Log | Cosmo's OLED eyes (procedural) track pointer and blink; sticky robot status bar whose mood/energy react to the section being read; dated log entries | The site is narrated by the robot, and it watches you read |
| v8 | OS Window Physics | KM·OS windows drift freely in hero; scroll docks them with spring snap into tiled layouts per section; draggable with inertia | Windows have weight — flick one and it glides, snaps home on scroll |
| v9 | Horizontal Cinema | Sticky viewport, vertical scroll drives 400vw horizontal track through 4 scenes with parallax type handoffs; mobile = native vertical | Scenes hand off like film cuts, giant numerals sliding between |
| v10 | The Living Room (wildcard) | SVG blueprint line-drawing of the ACTUAL lab (shelf, Pi, robot, TV, LED strip, router) inks itself in on scroll; each device zooms → becomes that system's card | His real living room becomes the site map — the most personal possible portfolio |

Shared: v4 palette tokens, profile.ts content, v5 proof modules, KFrame switcher nav,
reduced-motion via framer `useReducedMotion`, DPR cap [1,1.5], mobile-light.

---

## LOG (append-only; newest at bottom; every entry ends with NEXT STEP)

### 2026-07-10 00:20 — Session 1 start
- Phase A begun. Repo verified clean on master @ 9e582bb. Routes present: /, /v3, /v5, /styles/*, /projects/*.
- Docs created: KINETIC_TASKS.md, this LOG, KINETIC_VARIANTS_REVIEW.md skeleton.
- NEXT STEP: build `src/app/kinetic/_shared/` + `/kinetic` index, commit scaffolding (task A2/A3).
