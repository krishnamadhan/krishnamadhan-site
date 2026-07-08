# DESIGN_V5 — "Kinetic Lab OS" (the cinematic upgrade)

Planned by Fable 5 (creative director) · executed by Opus 4.8 · reviewed by
Fable 5. This is a **dramatic quality jump from v4**, not a tweak pass — but it
EVOLVES the v4 architecture, it does not restart it. Build a NEW route `/v5`;
`/v3` (the v4 design) and `/` stay byte-identical as fallbacks.

Reference feel: Awwwards editorial product-launch, a futuristic personal lab /
operating system. NOT: purple AI-avatar, neon cyberpunk dashboard, student
shader demo, fake terminal, game HUD, WebGL toy. Premium over loud. Motion
serves the story. The portrait stays human, sharp, and visible.

## Audit result (what exists — reuse vs fork vs replace)
- `src/app/v3/page.tsx` — shell: forked scene (fixed z-0) + atmos/grain +
  main z-10. REUSE the shell pattern; fork to `/v5`.
- `src/app/v3/sectionsV4.tsx` — Nav, Hero, Operator, Systems, Professional,
  Lab, Roots, Contact, Footer, LiveLab. Sections are solid; FORK and upgrade
  Hero + Systems heavily, refine the rest.
- `src/app/v3/scene/KMSceneV4.tsx` + `chapters.ts` — 8-actor troupe, one
  Canvas, scroll→`sceneStore`, seed handoff, frame-lerp poses, reduced-motion
  + no-WebGL fallback. Good engine, but 8 discrete objects ≠ the "one evolving
  object" the brief wants. **REPLACE with a single persistent particle field**
  (below); keep the store/scroll-plumbing pattern.
- `src/components/ui.tsx` — Reveal, Magnetic, KineticText, SmoothScroll
  (Lenis), etc. REUSE (import; do not edit — it's shared with `/`). If you
  need a variant, define it locally in the v5 files.
- `src/content/profile.ts` — `v4` content key. ADD a `v5` key (additive only;
  may reuse v4 copy by reference). Never change existing keys.
- Deps present: framer-motion 11, lenis 1.3, r3f 8.17, drei 9.114, three
  0.160. **No new deps** — no postprocessing lib (do bloom-free; additive
  blending + material tricks only). Procedural geometry only, no gltf/obj.

## Hard rules (non-negotiable)
- NEVER edit: `src/app/page.tsx`, `src/components/sections.tsx`,
  `src/components/scene/*`, `src/lib/sceneChapters.ts`, `src/app/styles/*`,
  `src/app/projects/*`, `src/app/v3/*` (leave the v4 route intact as fallback),
  `src/components/ui.tsx`. Build everything under `src/app/v5/*`.
- `globals.css`: append-only under a new `/* v5 */` block. `tailwind.config`:
  additive only. `profile.ts`: additive `v5` key only.
- `metadata.robots = { index: false }` on /v5.
- No emoji glyphs (no emoji font). No purple portrait, no neon face rim, no
  aurora blobs, no cheap scanlines. Restrained violet only as a single micro
  accent if at all.
- Test server PORT 3211 ONLY (3210 is Madhan's). Never pkill by pattern — kill
  the exact PID you start. Never touch pm2/banteragent. One build at a time
  (limited Pi RAM).
- Photos: only files in `public/photos/`. Hero portrait = `portrait-hero.webp`
  (punchy silver grade, already prepared). Operator = `portrait-editorial.webp`.

## Palette + type (carry v4, it's approved)
Deep charcoal `#0c0d10`, graphite panels `#15171c`/`#1b1e24`, hairlines
rgba(236,233,226,.10), warm off-white ink `#ece9e2`, body `#b8bdc7`, mute
`#7c828d`, muted blue `#6ab0d8` (the working accent), soft amber `#e0a458`
(warmth), violet `#8b7bd8` (one micro-touch max). Depth = soft black shadows,
NOT colored glow. Display type scaled UP, tight tracking, leading ~0.9. Mono
for data/labels only.

═══════════════════════════════════════════════════════════════════════════
## 1 · THE PERSISTENT PARTICLE FIELD — "KM Core" (the through-line object)
═══════════════════════════════════════════════════════════════════════════
Replace the 8-actor troupe with ONE evolving procedural particle system that
morphs formation per section on damped scroll. This is the site's spine.

- `src/app/v5/scene/KMCore.tsx` — one `<Canvas>`, one `THREE.Points` (plus at
  most ONE thin persistent wireframe "instrument frame": a couple of slowly
  rotating hairline rings for structure — off-white, opacity ≤ .25).
- Particle counts (adaptive, set once from viewport + a cheap perf probe):
  desktop 1200 · tablet 700 · mobile 320 · reduced-motion or no-WebGL → NO
  canvas, render a small static CSS/SVG emblem instead.
- **Morph targets** — precompute N formation buffers ONCE into Float32Arrays
  (no per-frame allocation). Each is the same particle count arranged as:
  1. HERO — dense spherical nucleus + a loose orbital shell (the "core").
  2. SYSTEMS — a data-mesh: clustered nodes on an implied graph, wider spread.
  3. PROFESSIONAL — a vertical pipeline/rail lattice (structured columns/grid).
  4. LAB — a looser mechanical/robotic cluster (a few dense knots + scatter).
  5. ROOTS — a calm slow helix / standing column.
  6. CONTACT — collapse toward center, then a broadcast ring emission.
- **Drive**: a single store (`v5Store`) holds a damped `progress` (0..1 over
  the whole page) and a derived `formation` float (which two targets to blend
  + blend t). `useFrame` lerps each particle from its current pos toward
  `mix(targetA, targetB, t)` with frame-rate-independent damping
  (`k = 1 - pow(damp, dt)`). Scroll writes raw progress (passive listener or
  framer `useScroll` → store); the field reads it in `useFrame` via a ref.
  NO React state in the animation loop.
- Position the field so it reads as INTEGRATED with the layout, not a floating
  backdrop: in hero it sits behind/around the portrait (right-of-center); as
  sections change it drifts and re-anchors (e.g. right gutter in Systems,
  left rail in Professional). Keep it dim (opacity/size down) behind
  text-heavy sections so copy always wins.
- Color: points off-white base; subtly tint by depth/formation toward amber
  (warm knots) and blue (cool mesh). Additive blending only on a small bright
  subset (the "energy" particles), never the whole cloud. No bloom pass.
- Perf: DPR `[1, 1.5]`; `frustumCulled={false}` on the single Points; reuse one
  geometry/material; dispose on unmount; no setState in useFrame; guard mobile
  with the low count. Target 60fps on the Pi's chromium — verify.

═══════════════════════════════════════════════════════════════════════════
## 2 · HERO — sticky 3-phase cinematic sequence (the biggest upgrade)
═══════════════════════════════════════════════════════════════════════════
A pinned hero over a tall wrapper (~220vh; use `min-h-[220vh]` outer with a
`sticky top-0 h-screen` inner stage). One `useScroll` on the outer → `p`
(0..1). Everything below is `useTransform(p, …)`, spring-smoothed via
`useSpring`. Reduced-motion: collapse to a static, fully-readable hero (no pin,
no splits) — identity + portrait + copy + CTAs visible at once.

5-second comprehension (must be legible in phase 1): **Krishna Madhan · SWE at
JPMorgan Chase · NIT Trichy · AI systems / data platforms / robotics /
automation · living-room lab with a robot + AI agents.**

**Phase 1 — Identity lock (p 0 → .33):**
- `KRISHNA` / `MADHAN` lock in at full display scale (KRISHNA solid ink,
  MADHAN outlined stroke — keep the v4 z-sandwich with the portrait).
- Portrait `portrait-hero.webp` locked, ~82vh, right-of-center, FULL opacity,
  black drop-shadow depth, face fully clear of type/cards. Rest pose ~0°.
- Copy + credibility strip + CTAs spring/stagger in.
- 3 credibility cards float in around (never over) the face.
- Particle core: calm dense nucleus behind/around the portrait.
- LIVE FROM THE LAB strip + boot line present.

**Phase 2 — System activation (p .33 → .7):**
- The name SPLITS: KRISHNA drifts up + slightly left, MADHAN down + slightly
  right, tracking opens, one line gets progressively masked/clipped by the
  slice edge forming below. Keep it elegant — small offsets, not explosive.
- Cards re-anchor into an orbit-ish arrangement around the portrait (spring
  inertia + pointer parallax ±6px). Still never over the face.
- Particle core energizes: nucleus loosens, orbital shell widens, begins
  drifting toward the Systems mesh formation. Slight camera/parallax life.
- Copy fades to make room; a thin progress/telemetry readout can appear
  (tasteful, mono, e.g. `SYSTEM ONLINE` — ONE line, not a HUD).

**Phase 3 — Transition into Systems (p .7 → 1):**
- An **editorial diagonal SLICE** (see §3) sweeps up from the lower-right,
  revealing the Systems substrate beneath the hero.
- Particles hand off: the core scatters/blooms and reforms as the data-mesh
  (formation 1→2), crossing the slice edge so it feels like the object passes
  THROUGH the tear into the next section.
- Portrait scales slightly + fades out gracefully (NOT into background — it
  exits cleanly). The `SELECTED SYSTEMS` label + `Lab Modules` title rise
  through the slice as the hero unpins.
- Net effect: the site TRANSFORMS into Systems, it doesn't just scroll.

**Mobile hero (390px — intentional, not degraded):** keep the pin but simpler
— portrait-first at top (face fully visible under the nav, ~46vh), name over
its lower third, copy/CTAs/cards/LIVE strip below. Phase 2 split is gentler
(mostly opacity + small y). Phase 3 slice still plays but shorter. Particle
count 320, intensity down. No horizontal overflow, no giant canvas over text.

═══════════════════════════════════════════════════════════════════════════
## 3 · EDITORIAL SLICE TRANSITION (premium, not a cartoon tear)
═══════════════════════════════════════════════════════════════════════════
- A diagonal structural cut revealing the deeper layer, driven by hero `p` in
  phase 3 (and reusable once more between two later sections if it stays
  tasteful — otherwise hero→systems only).
- Implement with CSS `mask-image` / `clip-path` (a `polygon()` with a few
  subtle jagged notches, animated via a CSS var or inline style from the
  scroll value) OR an SVG `<clipPath>`. The edge may carry a 1px light seam
  and very subtle noise/jitter — refined, no glitch RGB-split, no comic tear.
- The revealed substrate is a slightly darker graphite with a faint grid /
  telemetry texture so it reads as "the layer underneath the OS".
- Reduced-motion: no animated slice — sections simply stack with a hairline
  divider.

═══════════════════════════════════════════════════════════════════════════
## 4 · SYSTEMS — the strongest section, with REAL proof modules
═══════════════════════════════════════════════════════════════════════════
Keep the editorial list-cards (index numerals, name, what, why, stack, status,
case link). **Replace the 5 identical "SCREEN CAPTURE — COMING SOON" boxes**
with 5 DISTINCT, on-brand, abstract proof modules — pure CSS/SVG, no images,
each looks intentionally designed (a small piece of that system's "telemetry"):
- 01 Banter Agent → a WhatsApp-style trace: 3–4 mono chat bubbles (a Tanglish
  line, a game trigger, a bot reply) + typing dots. Graphite bubbles, amber
  timestamp ticks.
- 02 Cosmo → robot telemetry: labeled bars for mood/energy/attachment, a row
  of behavior-tree node ticks, `TEMP 47°C · BATTERY · CURIOUS`. Blue/amber.
- 03 IPL Fantasy → a mini live leaderboard / score ticker: 4 rows rank·name·
  pts with a moving highlight, a small `LIVE` dot.
- 04 BSPL → an auction/draft board: a grid of player chips with bid values and
  one "SOLD" state.
- 05 KM·OS → an architecture/system grid: nodes + labels (Next.js · R3F ·
  Pi 5) or a tiny code/scene capture rendered as styled mono text.
Each module: `aspect` framed, `v4/v5-panel` styling, hairline border, a small
honest label (`REPRESENTATIVE TELEMETRY` or per-module caption). They may have
one subtle looping micro-motion (typing dots, ticker, pulse) — reduced-motion
static. Add a `demo / GitHub` placeholder row where real. List these as asset
TODOs (swap for real captures later).
- Card hover: lift + border brighten + the particle field can nudge warmer
  (reuse the `hotModule` store idea) — subtle.

═══════════════════════════════════════════════════════════════════════════
## 5 · OTHER SECTIONS (refine, keep structure)
═══════════════════════════════════════════════════════════════════════════
- **Operator**: keep the magazine identity block; ensure the particle field
  sits clear of the frame and text.
- **Professional**: keep capability rows + trajectory rail + skill cloud
  (recruiter-friendly, employer internals vague). Particle field = the
  pipeline/rail formation behind, dim. Add scroll-reveal stagger.
- **Lab**: keep field-log strip, cricket line, Tanglish (one, premium not
  meme-heavy). Field formation = the mechanical cluster, dim.
- **Roots**: Arunachala / Tiruvannamalai / coordinates — mature, minimal,
  generous whitespace. Helix formation, calm.
- **Contact**: strong CTA `Open to AI systems, platform engineering, robotics,
  and agentic workflow collaborations.` Big mono email (magnetic), socials
  (keep #todo placeholders), footer signoff. Beacon formation + one broadcast
  emission on enter.

═══════════════════════════════════════════════════════════════════════════
## 6 · MOTION ARCHITECTURE + ACCESSIBILITY + PERF
═══════════════════════════════════════════════════════════════════════════
- Centralize scroll story in `src/app/v5/scene/store.ts` (`v5Store`): raw
  progress, damped progress, per-section formation index/blend, pointer mx/my,
  hotModule. DOM sections use framer `useScroll`/`useTransform`/`useSpring`;
  the canvas reads `v5Store` in `useFrame` via refs. No high-frequency setState.
- Lenis smooth scroll via the existing `SmoothScroll` (import from ui). Do NOT
  trap scroll; the pin must release cleanly; no scroll-jacking beyond the
  hero pin. Keyboard: CTAs and links focusable; skip-to-content ok.
- `prefers-reduced-motion`: static hero (no pin/splits/slice), static particle
  emblem, sections stack. Content fully readable with WebGL OFF (fallback
  emblem + normal layout). Contrast AA on all body copy.
- Perf: adaptive particle counts, precomputed buffers, DPR cap, dispose on
  unmount, no re-renders in useFrame, no postprocessing. Verify 60fps + no
  console errors.

═══════════════════════════════════════════════════════════════════════════
## 7 · FILES (create under src/app/v5/)
═══════════════════════════════════════════════════════════════════════════
- `src/app/v5/page.tsx` — shell (fork of v3 page): atmos + grain + `<KMCore/>`
  + Nav + main + Footer, robots noindex, title "…Kinetic Lab OS (v5 preview)".
- `src/app/v5/sections.tsx` — all sections (fork of sectionsV4, upgraded Hero
  + Systems proof modules + slice).
- `src/app/v5/scene/KMCore.tsx` — the particle field + canvas shell + fallback.
- `src/app/v5/scene/store.ts` — v5Store + scroll math + helpers.
- `src/app/v5/scene/formations.ts` — the morph-target buffer generators.
- `src/app/v5/proof.tsx` — the 5 abstract proof modules (or inline in sections).
- `globals.css` `/* v5 */` block; `tailwind.config` additive; `profile.ts` `v5`.

═══════════════════════════════════════════════════════════════════════════
## 8 · VERIFY (executor, before reporting)
═══════════════════════════════════════════════════════════════════════════
- `npm run typecheck && npm run build` clean. (`npm run lint` has no eslint
  config in this repo — skip, note it; build-time type check covers types.)
- Serve on 3211; adapt `scripts/tmp-capture-v3.mjs` → a v5 variant targeting
  `/v5` and the new section ids; capture to `artifacts/verification/v10-v5/`:
  desktop 1440×900 — hero phase1, hero phase2 (~scroll 8%), hero phase3 /
  slice (~scroll 14%), systems (proof modules visible), professional, lab,
  roots, contact; laptop 1280×800 hero; mobile 390×844 — hero, hero-midscroll,
  systems, contact. (Real-time scrolling; NO --virtual-time-budget; mobile via
  playwright viewport, NOT --window-size.)
- LOOK at every shot with the Read tool. Self-check, strict: face clearly
  visible in 5s and never covered; name split reads premium not broken; slice
  looks refined not cartoonish; proof modules look designed not placeholder;
  particle field integrated not floating; no neon/purple/cyberpunk regression;
  no 390px overflow; copy readable on every panel. Fix and recapture until
  true. Watch the browser console for R3F/errors.
- Commit: `design(v5): kinetic lab OS — particle core, sticky hero, slice,
  proof modules`. Do not commit gitignored/onnx/build junk (check git status).

## Report back
Visual changes · kinetic/scroll-system changes · files created/modified · what
was preserved (v3/v4 + `/` intact) · remaining real-asset/link TODOs · any
performance concerns (fps, particle counts, mobile).

## Review loop
Executor reports → Fable reviews screenshots + diff (strict: first impression,
portrait visibility, scroll story, transitions, proof modules, mobile, no
cyberpunk/placeholder) → comments → fix → repeat until sign-off → Fable
deploys `/v5` to Vercel + posts the before/after summary to Madhan.
