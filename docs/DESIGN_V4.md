# DESIGN_V4 — "Premium Kinetic Editorial" (round 4, replaces v3.1 look)

Planned by Fable 5 · executed by Opus 4.8 · reviewed by Fable 5. Board: AB-043.
Madhan's verdict on v3.1: portrait treatment reads like a **cheap AI-generated
avatar / neon gaming profile** — kill the purple-heavy look completely. Target:
a premium, confident, kinetic-editorial portfolio at Awwwards/Dribbble quality.
Inspiration (structure/feel only, do NOT copy): Dribbble shot 22469576
"Matthew — Personal Portfolio" — huge editorial type, neutral palette, real
photographic portrait overlapping the typography, calm confidence.

**Route stays `/v3`** (Madhan's preview URL). Rewrite its implementation.
Old v3.1 look is preserved in git history — do not preserve it in code.
"Do not preserve the current visual style out of politeness." — Madhan.

## Hard rules (unchanged from v3, non-negotiable)
- Do NOT edit: `src/app/page.tsx`, `src/components/sections.tsx`,
  `src/components/scene/*`, `src/lib/sceneChapters.ts`, `src/app/styles/*`,
  `src/app/projects/*`. The live `/` must render byte-identical.
- `globals.css`: existing rules untouched; append under `/* v4 */`. The old
  `/* v3 */`+`/* v3.1 */` blocks: DELETE the v3.1 aurora/duotone/alive rules
  that nothing references after your rewrite (grep first); keep any rule `/`
  or other routes use (they don't — but verify).
- `tailwind.config.ts`: additive-only (new color tokens OK, never edit
  existing token values).
- `src/content/profile.ts`: additive-only — add a `v4` key; never change
  existing keys (sections.tsx on `/` reads them).
- No new npm deps (framer-motion + R3F/drei already installed — enough).
- No emoji glyphs (no emoji font here) — text glyphs only (`>_`, `◆`, `→`).
- Test server: **port 3211 only** (3210 is Madhan's; never touch it).
  Never touch pm2/banteragent. `ss -tlnp | grep 3211` before starting.
- Photos: ONLY files in `public/photos/` (his own pixels; no generative AI).
- `metadata.robots = { index: false }` stays on /v3.
- No console errors; `npm run lint && npm run typecheck && npm run build`
  must pass clean. Commit at the end: `design(v4): premium kinetic editorial`.

## 0 · Audit first (do this before writing code)
Read: `src/app/v3/*`, `src/components/ui.tsx`, `src/components/scene/KMScene.tsx`,
`src/lib/sceneChapters.ts`, `src/content/profile.ts`, `globals.css`,
`tailwind.config.ts`. Understand the actor-troupe scene (CHAPTERS[].actor,
seed-of-light handoff, sceneStore) — you will FORK it (below), not modify it.

## 1 · Palette + type (the identity shift)
Kill: neon cyan-on-dark as the dominant voice, purple/violet washes, aurora
blobs, duotone screen-blend portrait, rose accents, glow shadows everywhere.

New tokens (add to tailwind config under new names, e.g. `v4-*`):
- `v4-bg` #0c0d10 — deep charcoal (near-black, slightly cool)
- `v4-panel` #15171c / `v4-raised` #1b1e24 — graphite panels
- `v4-line` rgba(236,233,226,.10) — hairline borders
- `v4-ink` #ece9e2 — warm off-white (headlines, key copy)
- `v4-body` #b8bdc7 — body copy (AA on v4-bg at 16px)
- `v4-mute` #7c828d — micro-labels only (≥11px uppercase)
- `v4-blue` #6ab0d8 — muted cyan/blue, THE accent (links, active, data)
- `v4-amber` #e0a458 — soft amber, warmth (status, highlights, sparingly)
- `v4-violet` #8b7bd8 — micro-accent ONLY (one or two touches per page max)
Glows: almost none. Shadows are soft black depth (`0 20px 60px rgba(0,0,0,.5)`),
not colored halos. Panels get 1px `v4-line` borders + subtle top-edge light
(`inset 0 1px 0 rgba(255,255,255,.04)`).

Type: keep the loaded fonts (display + mono — no new fonts). Display scale UP:
hero name `clamp(3.8rem, 11vw, 9rem)`, section titles `clamp(2.2rem,5vw,4rem)`,
tracking tight (-0.02em), leading 0.95. Body 16–18px `v4-body`. Mono reserved
for data/labels/status — not decoration.

Terminal gimmick — reduce, don't erase: KEEP the `KM·OS` wordmark, the boot
line under the nav, and the LIVE FROM THE LAB strip (they're personality).
DROP: ScrollHUD, ChapterHUD, `SYS.ONLINE`, `CH.01`, `000% TRAVERSED`, scanline
overlays, coordinate-chip clutter in the hero (coordinates move to Roots).

## 2 · Hero (5-second test: who/where/what/proof)
A recruiter must get in 5s: **Krishna Madhan · Software Engineer at JPMorgan
Chase · NIT Trichy · builds AI systems, data platforms, robotics · runs a
real home lab.**

Composition (Matthew-style editorial, made his own):
- Backdrop: `v4-bg` flat + very subtle texture (existing grain + a faint
  radial warmth top-right, amber at ~4% opacity). NO photo backdrop, NO blobs.
- Giant display name: `KRISHNA` / `MADHAN` stacked, `v4-ink`, the second line
  can be outlined text (`-webkit-text-stroke: 1px` v4-ink, transparent fill)
  for editorial contrast. Portrait OVERLAPS the type (z-sandwich: first line
  behind portrait, second line in front — two text layers, or clip tricks).
- Portrait: **`portrait-mono.webp`** (silver-graphite B&W — already prepared,
  779×1093 alpha). Centered-right, bottom-anchored, ~72vh desktop. NO blend
  mode, NO colored rim, NO glow. Optional: very subtle warm grade via CSS
  `filter: sepia(.08) contrast(1.02)`. It should read like a printed
  editorial photo, not a hologram.
- Scroll reaction (keep the "face turns with scroll" — Madhan loves it, but
  premium-subtle now): over first 100vh → `rotateY(-7deg→5deg)`,
  `translateY(0→-40px)`, scale(1→1.04), opacity→0 by ~110vh. Perspective
  1100px, origin bottom center. Desktop pointer parallax ±6px. Reduced-motion:
  static.
- Floating status cards (2–3, glass-graphite `v4-raised/80 backdrop-blur`,
  1px border, SMALL): e.g. card A `SWE · JPMorgan Chase` + `Data platforms,
  AWS`, card B `B.Tech · NIT Trichy`, card C `NOW BUILDING — Cosmo, a
  Raspberry Pi robot` with a tiny amber LED. Slight float animation (6s ease,
  ±6px, staggered; off under reduced-motion). Positioned around the portrait,
  never over his face.
- Under the name: one-line positioning statement (see copy §6) + a slim
  credibility strip: `JPMorgan Chase · NIT Trichy · AWS · Python/TS · 3
  systems running 24/7 in my living room` (mono, `v4-mute`, hairline rules).
- CTA row: `View systems` (primary — `v4-ink` bg, `v4-bg` text, magnetic) +
  `Contact` (ghost). Keep Magnetic from ui.tsx.
- LIVE FROM THE LAB strip: keep, restyle to v4 tokens (amber LEDs not green).
- Page-load intro (once, ≤1.2s total): boot line types in fast (~0.5s), name
  lines rise with clip-path reveal (staggered 80ms), portrait fades/slides up
  8px, cards float in last. No fake loading screens. Reduced-motion: instant.
- Mobile (390px is the primary test): name still huge (~15vw), portrait
  ~48vh behind-right with a bottom scrim fading to `v4-bg` so text wins;
  status cards collapse to a horizontal scroll row or stacked chips below the
  CTA; everything thumb-reachable, no horizontal overflow.

## 3 · Scene fork (persistent evolving hero object, neutralized)
The actor troupe is the site's soul (Madhan: "more fluid than any template").
Keep it, but the neon palette fights the new look. **Fork, don't modify:**
- Copy `src/components/scene/*` → `src/app/v3/scene/` and
  `src/lib/sceneChapters.ts` → `src/app/v3/scene/chapters.ts`. `/v3` imports
  only the fork. (`/` keeps the originals untouched.)
- Palette swap in the fork: wireframes/lines `#ece9e2` at low opacity,
  accents `v4-amber` and `v4-blue` (≤ one violet moment). Kill/soften bloom:
  core actor reads as a graphite-and-ember instrument, not a neon sun.
  Points/particles: warm white, small, sparse.
- Update the fork's chapter→section-id map to the NEW section ids (§4) and
  reassign actors sensibly (core→hero, flask→lab, rocket→timeline moment in
  professional, bat→lab/cricket, beacon→contact...). Keep the seed-of-light
  handoff — it IS the "persistent evolving hero object" the brief asks for.
- Dim scene opacity behind text-heavy sections (sceneStore.dim already
  supports this pattern) so panels stay readable.

## 4 · Sections (rework; new ids; nav follows)
Structure A–F. Fold the old 9 sections into 6. Nav links update to match.
1. `#top` — Hero (§2).
2. `#systems` — **Selected Systems / Lab Modules** — THE strongest section.
   4–5 flagship cards (from profile: IPL Fantasy, BanterAgent, Cosmo robot,
   BSPL, this site/KM·OS). Each card: name, one-line WHAT, one-line WHY it's
   interesting, stack chips, status (`LIVE` amber / `IN LAB` blue / `SHIPPED`),
   and a proof-placeholder block (16:10 `v4-panel` frame, mono caption
   `SCREEN CAPTURE — COMING SOON` — an honest TODO, listed in your report).
   Layout: editorial list-cards (large index numerals 01–05, hover: card
   lifts, numeral fills, magnetic pull). Case-study links where
   `/projects/[slug]` pages exist.
3. `#professional` — **Professional Systems** (recruiter-friendly, concrete):
   JPMorgan work rendered as capability rows, not vague blurbs: AWS-based
   data platforms · ETL design · Terraform infra · Spinnaker deployment
   pipelines · data-mesh architecture · incident RCA · vendor data
   integrations. Pull from existing profile experience content; write rows as
   `capability — one concrete sentence of what he did with it`. Include a
   compact timeline rail (NIT Trichy → JPMC roles) — this absorbs the old
   Timeline section. Skills absorb here too as a quiet chip cloud grouped by
   domain (languages / cloud+infra / data / AI+robotics).
4. `#lab` — **Personal Lab** (playful but premium): the Pi rack story —
   robot (Cosmo), WhatsApp agent, lights, fantasy platforms "built to settle
   friend-group arguments". Field-log photos (trophy/trek/voyage) as a
   restrained editorial strip w/ scrim captions. Cricket stat one-liner keeps.
   One Tanglish accent allowed here (in-joke tone, e.g. the "semma scene"
   line). This absorbs old OffDuty.
5. `#roots` — **Roots** (mature, brief): grew up under Arunachala
   (Tiruvannamalai), community values, coordinates chips live HERE now
   (`TIRUVANNAMALAI 12.23°N 79.07°E · BANGALORE 12.97°N 77.59°E`). No org
   names (profile.review.md). Quiet full-width moment, generous whitespace.
6. `#contact` — **Contact** (strong CTA): headline `Open to AI systems,
   platform engineering, robotics, and agentic workflow collaborations.`
   Big mono email link (magnetic), social row (keep #todo-placeholders as-is
   from profile), footer sign-off keeps: `Built on the same Pi that runs the
   robot. 47°C, mostly.`

## 5 · Motion system (kinetic = felt, everywhere, cheap)
- Scroll-driven section-title reveals: chars/words rise+clip stagger
  (framer, `whileInView`, once). Body panels: fade+12px rise, 60ms stagger.
- Magnetic hover on ALL interactive elements (buttons, cards, email) — ui.tsx
  Magnetic; extend to cards via a small wrapper if needed.
- Large headings get a slow scroll parallax drift (±20px translateY via
  useScroll) so the page breathes.
- Card hovers: lift 4px + border brightens + soft shadow deepens (200ms).
- The scene fork provides the continuous object narrative between sections.
- ALL motion: transform/opacity only (GPU), disabled or reduced under
  `prefers-reduced-motion`. 60fps on the Pi's chromium — test.

## 6 · Copy rewrite (confident, specific, zero cringe)
Add to `profile.ts` under `v4` (additive). Tone: senior engineer who builds
real things, a little wry, never "passionate about leveraging synergies".
- Hero positioning: `Systems engineer by profession. Experimental builder by
  instinct.` then one concrete line: `I design data platforms at JPMorgan
  Chase and run a living-room lab where a Raspberry Pi robot, a WhatsApp
  agent, and two fantasy-cricket platforms stay online 24/7.`
- Section intros ≤ 2 sentences, concrete nouns over adjectives.
- Status/stat lines carry the proof (uptime, counts, "56-node behavior
  tree", "10-year friend group as production users").
- Ban list: "crafting", "digital experiences", "passionate", "journey",
  "wizard/ninja/guru", exclamation marks.

## 7 · Verification (before reporting back)
- `npm run lint && npm run typecheck && npm run build` clean.
- Update `scripts/tmp-capture-v3.mjs` for the new section ids → capture to
  `artifacts/verification/v9-v4/`: desktop 1440×900 every section, mobile
  390×844 (playwright viewport) hero + hero-midscroll(~60vh) + systems +
  contact. Plus one desktop hero-midscroll shot proving portrait rotation.
- Self-review every shot: contrast (body on panels, AA), no neon regression,
  portrait never sticker-like, no layout collisions, no overflow at 390px.
- Report: what changed visually / motion added / files touched / asset TODOs
  (proof screenshots per system, OG image, real social links).

## Review loop
Executor reports → Fable reviews screenshots+diff → comments → fix → repeat
until sign-off → Fable deploys to Vercel + posts summary to Madhan.

---

# Round 5 — Portrait presence (v4.1)

Madhan's verdict on v4: redesign direction approved, but the portrait is now
"barely visible… too hidden, too dark, too secondary — weakens the personal
identity". The site must clearly read as HIS portfolio, not an anonymous
kinetic product page. Everything else stays (palette, sections, motion,
no-purple). This is a scoped fix, NOT a redesign restart.

Root causes found in the current build (fix all three):
1. `.v4-portrait-scrim` bottom-fade mask (`black 62% → transparent`) is
   applied on DESKTOP too — it was meant for mobile. It makes his chest/arms
   translucent (scene wireframes show through his shirt) and he reads like a
   faded background texture. Desktop must have NO fade mask, or at most a
   ~6% bottom ground-fade.
2. `portrait-mono.webp` is mid-heavy/dark against #0c0d10.
   **New asset prepared: `public/photos/portrait-hero.webp`** (779×1093 alpha)
   — punchier silver grade: deep blacks, lifted mids, bright highlights,
   clarity pass. Use it for the hero. Keep `sepia(.08)`-level warmth max.
3. rotateY(-7°) at rest turns the face away on load. Rest pose must be ~0°.

## 5.1 Hero portrait (layout A — bigger, right-of-center, type wraps)
- Portrait `portrait-hero.webp`, desktop ~82vh (max-h ~760px), right-of-center
  (roughly right: 6–10% of container), bottom-anchored. FULL opacity at rest.
- Depth instead of fade: CSS `filter: drop-shadow(0 30px 70px rgba(0,0,0,.55))`
  (black editorial depth, NOT colored glow) so he lifts off the background.
- Z-sandwich stays (KRISHNA behind, MADHAN stroke in front) but the stroke
  line must cross his CHEST, never above the chin. Verify at 1280/1440/1600:
  full face unobstructed by type, cards, and wireframes.
- Scene: in the fork's chapters, nudge the hero core actor left/away from the
  portrait or dim it slightly so wireframe lines don't slice the face zone.
- Scroll motion, calmer: rotateY 0→4°, translateY 0→-30px, scale 1→1.03,
  opacity 1 until 0.75 then →0 by 1.1. Keep pointer parallax ±6px. The
  portrait must feel alive but stable — presence first, motion second.
- Cards: keep current around-the-face placement; card B must not touch hair.

## 5.2 NEW "Operator" block (compact, after hero, before #systems)
An editorial magazine-style identity moment so the human is unmissable:
- Left (or right): `portrait-editorial.webp` (colour grade) in a tall
  graphite frame — `v4-raised` panel, 1px `v4-line` border, deep soft shadow;
  image `object-cover object-top` so it crops to head-and-torso; the portrait
  may break ~24px out of the frame's top edge (magazine-cover feel, do it
  with a plain overflow trick, no masks that eat the face).
- Right: eyebrow `OPERATOR`, then 4 credibility rows separated by hairlines,
  mono labels + ink values:
  `ROLE — Software Engineer, JPMorgan Chase` ·
  `SCHOOL — B.Tech, NIT Trichy` ·
  `FOCUS — AI systems · data platforms · robotics` ·
  `LAB — Raspberry Pi rack in a Bangalore living room, online 24/7`.
  Under them one short human line (2 sentences max, v4 tone, from a new
  additive `v4.operator` key in profile.ts).
- Section id `#operator`; do NOT add it to the nav (keeps nav 5 links);
  scene chapters: either no actor here or reuse hero dim; keep it compact
  (~70vh desktop, auto mobile).

## 5.3 Mobile hero recomposition (390px is the test)
Current mobile buries the face behind the CTA/cards. Switch to
portrait-first: portrait ~44–50vh, top-right area under the nav, face fully
visible in the first screen; name overlaps its lower third; copy + CTAs +
card row + LIVE strip follow below. The heavy scrim shrinks to a band under
the text only — his face zone must NOT be dimmed. If the first screen gets
tight, the credibility strip may move below the fold; face + name + one CTA
must fit 390×844.

## 5.4 Verify (executor)
- typecheck + build clean; recapture full v9-v4 set (overwrite) PLUS a
  1280×800 desktop hero shot (name it 12-hero-1280.png).
- Self-check each shot: is the face CLEARLY visible in 5s? Any card/type/
  wireframe on the face? Mobile first screen shows the face?
- Commit `design(v4.1): portrait presence — hero grade, operator block,
  mobile recomposition`.
