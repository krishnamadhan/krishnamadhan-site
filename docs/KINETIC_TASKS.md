# KINETIC REDESIGN — TASK TRACKER

> Single source of truth for the kinetic exploration. If a session dies, resume
> from the first unchecked item. Status log: `docs/KINETIC_REDESIGN_LOG.md`.
> Scores + convergence: `docs/KINETIC_VARIANTS_REVIEW.md`.

## Ground rules (do not violate)
- NEVER break `/` or `/v3` — all work is additive under `src/app/kinetic/`.
- Palette: v4 tokens only (`v4-bg/panel/ink/body/mute/blue/amber`, restrained `v4-violet`). No purple avatar look, no neon, no aurora blobs, no scanline overload.
- Procedural geometry only — no .gltf/.obj. DPR capped `[1, 1.5]`. Mobile lighter than desktop.
- Every variant: reduced-motion fallback (`useReducedMotion`), readable text, working mobile.
- Content ONLY from `src/content/profile.ts` (v4/v5 keys). Proof modules from `src/app/v5/proof.tsx` — no "COMING SOON" boxes.
- Commit after each variant: `design(kinetic): vN — <name>`. No force-push. No deletes.

## Phase A — Creative direction  ✅ when all checked
- [x] A1. Write this tracker + LOG + REVIEW skeleton
- [x] A2. Shared infra `src/app/kinetic/_shared/` (content adapter, KFrame nav/footer, SafeCanvas, section primitives) + `/kinetic` index page + `/kinetic/layout.tsx` metadata
- [x] A3. Commit "chore(kinetic): scaffolding + docs"

## Phase B — 10 variants (one commit each)
- [x] B1. `/kinetic/v1` — Editorial Page Tear (paper cover tears open on scroll → lab beneath; SVG jagged clip-path halves)
- [x] B2. `/kinetic/v2` — Fabric / Flag Hero (R3F plane vertex-wave portrait panel; scroll-velocity flutter; SVG turbulence fallback)
- [x] B3. `/kinetic/v3` — Particle Explosion → Stack (R3F points: core → explode → reassemble into text/grid formations)
- [x] B4. `/kinetic/v4` — Mechanical Lab Core (one persistent object morphs: identity → systems map → pipeline → robot → beacon)
- [x] B5. `/kinetic/v5` — Editorial Portrait Magazine Cover (type-behind-head masking; cover breaks into proof panels on scroll)
- [x] B6. `/kinetic/v6` — Data Pipeline Scroll Machine (SVG spine, packets travel with scroll, stations activate cards)
- [x] B7. `/kinetic/v7` — Robot Pet Field Log (Cosmo eyes follow pointer; mood-reactive sticky status; dated log entries)
- [x] B8. `/kinetic/v8` — OS Window Physics (windows drift → dock/snap on scroll; drag with inertia; elegant KM·OS chrome)
- [x] B9. `/kinetic/v9` — Cinematic Horizontal Scroll (sticky 400vw track, scene handoffs; native vertical on mobile)
- [x] B10. `/kinetic/v10` — Wildcard: "The Living Room" (SVG blueprint of the actual lab draws itself; zoom per device → system)

## Phase C — Verify + review
- [x] C1. `npm run typecheck && npm run lint && npm run build`
- [ ] C2. Screenshots per variant at 1440 / 1280 / 390 → `artifacts/kinetic/` (use docs/capture pattern, playwright-core)
- [ ] C3. Score all 10 in `docs/KINETIC_VARIANTS_REVIEW.md` (9 axes, 1–10)
- [ ] C4. Write final recommendation (best variant / hero / systems / mobile / visual language / merge plan)

## Phase D — Convergence
- [ ] D1. Build `/kinetic/final` from merge plan
- [ ] D2. Verify acceptance criteria (see LOG header) + build + screenshots
- [ ] D3. Final commit + LOG closeout

## Phase E — Continuity
- [x] E1. `scripts/kinetic-status.sh` (log-only status + next-step printer) + hourly cron

## Resume protocol (cold session)
1. `cd /home/pi/krishnamadhan-site && git log --oneline -5` — see last completed step
2. Read `docs/KINETIC_REDESIGN_LOG.md` bottom entry → "NEXT STEP" line
3. Continue from first unchecked box above. Never redo checked work; never `git reset`.
