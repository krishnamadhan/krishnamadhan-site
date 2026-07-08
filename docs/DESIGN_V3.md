# DESIGN_V3 — "Operator Edition" (dark lab, refined)

Planned by Fable 5 · executed by Opus 4.8 · reviewed by Fable 5.
Board: AB-043 follow-up. Madhan's verdict: current dark lab wins on fluidity;
variants A/B/C rejected as templates but keep their best details.

## Goal
A NEW route `/v3` with the SAME structure, sections and 3D actor scene as the
current home page, but: (1) genuinely readable, (2) hero that feels like a real
photograph, not clip art, (3) Madhan's actual face integrated (background-cut
portrait reacting to scroll), (4) unmistakably personal — not "generic dev
template". The live `/` page must remain byte-identical in behavior.

## Hard rules
- Do NOT edit: `src/app/page.tsx`, `src/components/sections.tsx`,
  `src/components/scene/*`, `src/lib/sceneChapters.ts`, `src/app/styles/*`,
  `src/app/projects/*`, `globals.css` existing rules (append-only under a
  clearly-marked `/* v3 */` block if needed).
- Build `/v3` as `src/app/v3/page.tsx` + `src/app/v3/sections3.tsx` (+ a small
  `v3.css` or appended globals block). COPY from the current files, then edit
  the copies freely. Reuse `KMScene`, `ui.tsx` components and section DOM ids
  unchanged so the existing 3D actor troupe just works.
- `metadata.robots = { index: false }` on /v3 (private review).
- No new npm deps. No emoji as UI glyphs (no emoji font on some systems).
- Photos: use ONLY the prepared assets below. No external/generated imagery.
- Test server: port 3211 (3210 is Madhan's live preview — leave it alone).
  Never touch pm2/banteragent. Build with `npm run build`.

## Prepared assets (already in public/photos/)
- `portrait-cutout.webp` — 779×1093 alpha cutout of Madhan (u2netp matte,
  original pixels). Rim-light must be CSS `filter: drop-shadow(...)`, subtle
  (cyan, blur ≥ 20px, alpha ≤ .35). NO thick halo.
- `hero-bg-trek.webp`, `hero-bg-ocean.webp` — 1100×1467 dark-graded real
  photos (his own) for the hero backdrop. Pick whichever grades better behind
  cyan/violet; layer under a gradient scrim `linear-gradient(180deg,
  rgba(4,6,13,.55), rgba(4,6,13,.92) 75%)` + existing grain/vignette so it
  reads as environment, not wallpaper.
- Existing: portrait.webp, trophy.webp, trek.webp, ocean.webp, voyage.webp.

## 1 · Readability system (the core fix)
Current failure: `text-dim` #9aa6bd at 14px over noisy overlays ≈ 3.8:1.
Target WCAG AA (≥4.5:1) for ALL body copy. Concretely, in v3 copies:
- Body copy: #c3cde0 (not #9aa6bd), `text-base` (16px) min, `leading-relaxed`.
  Keep #9aa6bd only for decorative micro-labels ≥11px uppercase.
- `module-label`: bump to 10px, color rgba(75,225,255,.9).
- Anywhere text sits over the scene/photos: give it a solid-ish panel
  (`bg-void/70 backdrop-blur-sm rounded-xl` or stronger) — never raw text
  over busy pixels. Benchmark: brittanychiang.com (two-col sticky, calm
  measure ~65ch, bright links).
- Kill `.scanline` and dotted noise behind paragraphs in v3; keep them for
  purely decorative chambers.
- Headings: keep display font, but subheads full-opacity white.
- Marquee/coord decorations: fine, but never as the only label for content.

## 2 · Hero ("looks real, not clip art")
- Backdrop: hero-bg photo full-bleed + scrim (above). The 3D core still
  renders (scene untouched) — it now reads as an instrument floating IN a
  real dusk environment, which is the intent.
- Right side: `portrait-cutout.webp`, bottom-anchored, ~46vh tall desktop.
  Scroll reaction (rAF or framer `useScroll`, respect reduced-motion):
  progress 0→1 over first viewport → `rotateY(-10deg→-2deg)
  translateX(0→-24px) translateY(0→30px)`, `filter: grayscale(.65→0)
  saturate(1.05)`, opacity fades to 0 by 120vh so he "turns/steps aside" as
  the story starts. Perspective 900px on the wrapper. Subtle cyan drop-shadow
  rim; a faint ground-glow ellipse under him ties him into the scene.
- Name/intro left column exactly as current, but with readability tokens.
- Mobile: cutout becomes a smaller foreground element (~38vh) behind-right of
  the headline with heavier scrim; never covers text.

## 3 · Personality layer (exclusively-Madhan)
Add (content in the v3 files, or extend profile.ts with NEW optional keys —
additive only):
- Boot line under nav: `KM·OS 26.2 — booted from a Raspberry Pi 5 in a
  Bangalore living room` (it's literally true; say so).
- Hero chips get coordinates: `TIRUVANNAMALAI 12.23°N 79.07°E` ·
  `BANGALORE 12.97°N 77.59°E`.
- A "LIVE FROM THE LAB" status strip (styled live, values build-time):
  `cosmo: curious · banteragent: online · board: 12 open tasks · lights:
  TV-sync evening window`. Monospace, green LEDs. This is HIS lab, no
  template has this.
- Tanglish accents, sparing and confident: section outros like
  `"semma scene, let's build" — the friend group, probably`. Max 2–3 across
  the page; must read as in-jokes, not decoration.
- Cricket: in Field Log, add the one-liner stat row `Right-hand bat ·
  tournament winner · 2 fantasy platforms built to settle arguments`.
- Roots: name Arunachala hill ("grew up under Arunachala") — poetic, public,
  no org names (respect profile.review.md).
- Footer sign-off: `Built on the same Pi that runs the robot. 47°C, mostly.`

## 4 · Section-by-section deltas (structure unchanged)
- About: two-column sticky (brittanychiang pattern) — left sticky identity
  card w/ portrait.webp (small, arch mask ok), right readable prose.
- Work: keep systems map, raise node label contrast, panel behind intro.
- Projects: current cards but body text tokens + clearer CTA row.
- Timeline: alternate cards keep, but connective line gets era markers with
  full-contrast labels.
- Skills: chips 16px, remove float animation on reduced-motion.
- Field Log: photos keep warm treatment; captions on scrim panels; cricket
  stat row (above).
- Contact: keep beacon; email as large readable mono link.

## 5 · Verification (executor must do before reporting)
- `npm run typecheck && npm run build` clean.
- `node scripts/capture-scene.mjs artifacts/verification/v8-v3 http://localhost:3211`
  won't work for /v3 (it hits `/`) — write `scripts/tmp-capture-v3.mjs`
  variant targeting `/v3` (same pattern: real chromium, scroll to each
  section id, plus 390px-CSS mobile via --force-device-scale-factor trick or
  viewport emulation in playwright: `viewport:{width:390,height:844}` works
  in playwright — use that for mobile hero + one content section).
- Self-check every screenshot for: unreadable text over busy background,
  cutout halo artifacts, layout collisions with the 3D actors
  (actor positions are per-section; content panels may overlap them slightly
  — that's fine — but body text must sit on panels).
- Commit everything on completion with a `design(v3): ...` message.

## Review loop
Executor reports → Fable 5 reviews screenshots + code diff → comments via
SendMessage → executor fixes → repeat until Fable signs off → Madhan reviews
at http://192.168.1.200:3210/v3 (preview server rebuild needed: kill 3210,
`npm run build`, restart — do NOT do this yourself; Fable handles it).
