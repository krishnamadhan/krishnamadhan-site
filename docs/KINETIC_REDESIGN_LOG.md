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

### 2026-07-10 00:45 — V1–V4 implemented (typecheck clean)
- v1 Page Tear: jagged clip-path halves peel apart over dark machine room; 320vh sticky; reduced-motion static path.
- v2 Fabric: R3F cloth plane (portrait texture, left-edge pinned, scroll-velocity gust), wind-riding letters, velocity skew.
- v3 Particles: 4.2k points torus-knot core → detonation → canvas-sampled "SYSTEMS" text; phase HUD.
- v4 Lab Core: 5 modules morph monolith→orbit map→pipeline→robot(eyes)→beacon; sticky split; chapter progress.
- Shared: KFrame switcher, SystemCard+v5 proofs, CredStrip/LabStatus, SafeCanvas dpr[1,1.5].
- E1 done: scripts/kinetic-status.sh + hourly cron (17 * * * *), log-only.
- NEXT STEP: implement B5 /kinetic/v5 magazine cover (portrait z-sandwich type), then B6..B10.

### 2026-07-10 01:20 — V5–V7 implemented (typecheck clean) + AB-049 delegated
- v5 Magazine: KRISHNA behind portrait cutout / MADHAN in front (z-sandwich); scroll deconstructs cover → intro column + 3 rising proof panels.
- v6 Pipeline: luminous spine + amber packets (motion values, no re-renders); 3 ETL stages + 3 lab systems power on as flow reaches them; flow-meter HUD.
- v7 Field Log: Cosmo OLED eyes (pointer-tracking, blinking); sticky mood bar reacts per section (curious/excited/focused/attached); real field notes as dated entries.
- Parallel: AB-049 voice-clone V1 delegated to codex (spec in board notes), AB-050 phase-2 filed blocked. Memory: project_voice_clone.md.
- NEXT STEP: B8 /kinetic/v8 OS window physics, then B9 horizontal, B10 living room.

### 2026-07-10 02:00 — ALL 10 VARIANTS BUILT ✅ (build clean, 28 routes)
- v8 OS Physics: 6 draggable momentum windows scatter→dock over 300vh; menu bar with live lab status; mobile pre-docked.
- v9 Horizontal: 400vw film strip, ghost numerals + title parallax, progress rail; mobile native vertical.
- v10 Living Room: SVG blueprint of the actual lab self-draws (pathLength), 5 device callouts surface, room POWERS ON at p>0.88 (LED glows, TV lights, Cosmo eyes wake).
- npm run build ✅ — /kinetic/v1..v10 all static, / and /v3 untouched. Note: lint not configured in repo (interactive prompt) — typecheck+build are the gates.
- Perf note for review: v2/v3/v4/v8/v9 carry R3F in first load (359-364kB); v8/v9 only via useIsMobile import — trivial to split later.
- NEXT STEP: C2 screenshots (1440/1280/390) via playwright-core, then C3 scoring.

### 2026-07-10 03:05 — PHASE C+D COMPLETE ✅ /kinetic/final SHIPPED
- 90 variant screenshots + 16 final screenshots in artifacts/kinetic/.
- Scores in KINETIC_VARIANTS_REVIEW.md. Winners: v5 Magazine (82) > v1 Tear = v6 Pipeline (78) > v10 Living Room (74).
- /kinetic/final = v5 paper magazine cover (type-behind-portrait, face clear at all widths)
  → v1 jagged tear into the machine room → v6 pipeline (3 JPMC stages + 3 lab stations power on)
  → v10 blueprint signature (self-draws on approach, room powers on) → contact.
  158kB first load, NO R3F on the final route. Reduced-motion + mobile verified by screenshot.
- Acceptance criteria: all met (memorable hero transformation ✅ physical tear ✅ identity in 5s ✅
  proof-driven cards ✅ mobile ✅ reduced-motion ✅ build ✅ / and /v3 untouched ✅ no neon/purple ✅).
- Bugs logged for variant polish (only if variants get promoted): v7 pupil centering, v8 dock spacing,
  v2 cloth edge streak, v5 portrait/panel collision.
- Server on :3210 stopped after capture. Hourly status cron stays until Madhan reviews; remove with
  `crontab -e` (kinetic-status line) once /kinetic/final is approved.
- NEXT STEP (Madhan): open /kinetic (index) on the LAN preview or Vercel preview, compare variants,
  bless /kinetic/final or request merges. Then AB-043/AB-044 fold-in to main site.
