/**
 * v5 "Kinetic Lab OS" — central scroll story store.
 *
 * A tiny mutable object read inside the R3F `useFrame` loop via refs; the DOM
 * sections write to it with framer `useScroll`/`useMotionValueEvent`. NO React
 * state lives in the animation loop. The particle field ("KM Core") reads
 * `formation A/B + blend`, a world-space placement, a dim factor, pointer
 * parallax and a hero "energy" scalar — everything it needs to morph.
 *
 * Formation indices (see formations.ts):
 *   0 nucleus · 1 mesh · 2 pipeline · 3 cluster · 4 helix · 5 beacon
 */

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** Per-anchor placement of the field, blended on scroll. World units match the
 *  KMCore camera (z≈6.4, fov 46). Positive x = right of centre. `f` = which
 *  formation this anchor snaps to; `dim` = field brightness behind that
 *  section (low behind text-heavy sections so copy always wins). */
export type Anchor = {
  id: string; f: number;
  x: number; y: number; s: number; dim: number;
};

/** DOM ids the field tracks, in document order. Hero + operator both hold the
 *  calm nucleus; the morph to the systems mesh plays in the approach to
 *  #systems (which is the hero's phase-3 window at ~220vh). */
export const ANCHORS: Anchor[] = [
  { id: "top",          f: 0, x:  2.7, y:  0.0, s: 1.00, dim: 0.95 },
  { id: "operator",     f: 0, x: -3.0, y:  0.2, s: 0.72, dim: 0.30 },
  { id: "systems",      f: 1, x:  3.1, y:  0.6, s: 0.78, dim: 0.32 },
  { id: "professional", f: 2, x: -3.3, y:  0.0, s: 0.80, dim: 0.30 },
  { id: "lab",          f: 3, x: -3.0, y: -0.2, s: 0.72, dim: 0.36 },
  { id: "roots",        f: 4, x:  2.6, y: -0.4, s: 0.66, dim: 0.30 },
  { id: "contact",      f: 5, x:  0.0, y:  0.1, s: 0.92, dim: 0.44 },
];

export const v5Store = {
  /** whole-page progress 0..1 (ambient) */
  progress: 0,
  /** hero wrapper progress 0..1 — written by the Hero component */
  heroP: 0,
  /** derived hero "energy" 0..1 — nucleus loosens / point size grows */
  energy: 0,
  /** phase-3 slice bloom 0..1 — core scatters/brightens and crosses the tear */
  slice: 0,
  /** formation blend: from index A to index B, eased fraction t */
  fA: 0, fB: 0, ft: 0,
  /** world placement targets (damped in useFrame) */
  gx: ANCHORS[0].x, gy: ANCHORS[0].y, gs: ANCHORS[0].s, dim: ANCHORS[0].dim,
  /** pointer parallax -0.5..0.5 */
  mx: 0, my: 0,
  /** systems card hover → field nudges warmer (-1 = none) */
  hotModule: -1,
  /** contact-in-view broadcast pulse trigger time (perf.now/1000), -1 = idle */
  beaconAt: -1,
};

/** Recompute formation + placement from scroll. Call from a passive scroll
 *  listener. Holds each anchor's formation for most of its span, then eases the
 *  morph over the final ZONE of the approach to the next anchor. */
export function updateFieldFromScroll() {
  const doc = document.documentElement;
  const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
  v5Store.progress = clamp01(window.scrollY / max);

  const centre = window.scrollY + window.innerHeight * 0.5;
  const tops = ANCHORS.map((a) => {
    const el = document.getElementById(a.id);
    return el ? el.getBoundingClientRect().top + window.scrollY : Number.MAX_SAFE_INTEGER;
  });

  let i = 0;
  for (let k = 0; k < tops.length; k++) if (centre >= tops[k]) i = k;
  const next = Math.min(i + 1, ANCHORS.length - 1);
  const span = Math.max(tops[next] - tops[i], 1);
  const raw = next === i ? 0 : clamp01((centre - tops[i]) / span);

  // hold formation for the first (1-ZONE), morph over the last ZONE
  const ZONE = 0.32;
  const t = raw < 1 - ZONE ? 0 : smooth((raw - (1 - ZONE)) / ZONE);

  const A = ANCHORS[i], B = ANCHORS[next];
  v5Store.fA = A.f;
  v5Store.fB = B.f;
  v5Store.ft = t;
  v5Store.gx = lerp(A.x, B.x, t);
  v5Store.gy = lerp(A.y, B.y, t);
  v5Store.gs = lerp(A.s, B.s, t);
  v5Store.dim = lerp(A.dim, B.dim, t);
}
