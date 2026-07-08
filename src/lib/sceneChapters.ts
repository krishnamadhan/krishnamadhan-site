/**
 * Chapter states for the KM Lab scene — v3 "actor troupe".
 *
 * Instead of one object morphing through parameter space, every section has
 * its own themed actor (core, helix, network, flask, rocket, atom, cricket,
 * beacon). Scroll drives a transition fraction between neighbouring
 * chapters; at each boundary the outgoing actor collapses into a travelling
 * seed of light that arcs across the page and blooms into the next actor.
 *
 * This file owns scroll → story state. KMScene.tsx owns the actors.
 */

export type Chapter = {
  id: string;
  section: string;   // DOM id this chapter belongs to
  label: string;     // HUD readout
  actor: number;     // index into the actor troupe (two chapters may share)
  x: number; y: number; scale: number;
  glow: number; warmth: number; dim: number;
};

export const CHAPTERS: Chapter[] = [
  { id: "core",    section: "top",      label: "CH.01 / KM CORE",          actor: 0, x: 1.9,  y: 0.0,  scale: 1.15, glow: 1.15, warmth: 0,    dim: 1 },
  { id: "helix",   section: "about",    label: "CH.02 / IDENTITY HELIX",   actor: 1, x: 0.45, y: -0.1, scale: 0.7,  glow: 0.5,  warmth: 0,    dim: 0.45 },
  { id: "network", section: "work",     label: "CH.03 / SYSTEMS GRID",     actor: 2, x: 3.2,  y: 0.85, scale: 0.6,  glow: 0.7,  warmth: 0,    dim: 0.25 },
  { id: "flask",   section: "projects", label: "CH.04 / LAB REACTION",     actor: 3, x: -3.6,  y: -0.2, scale: 0.55, glow: 0.75, warmth: 0.1,  dim: 0.5 },
  { id: "rocket",  section: "timeline", label: "CH.05 / LAUNCH SEQUENCE",  actor: 4, x: 3.55, y: 0.0,  scale: 0.7,  glow: 0.5,  warmth: 0.15, dim: 0.3 },
  { id: "atom",    section: "skills",   label: "CH.06 / STACK ORBITALS",   actor: 5, x: -3.6, y: 0.5,  scale: 0.62, glow: 0.7,  warmth: 0.2,  dim: 0.22 },
  { id: "cricket", section: "offduty",  label: "CH.07 / CHAMPION MODE",    actor: 6, x: 2.5,  y: 1.15, scale: 0.62, glow: 0.8,  warmth: 1,    dim: 0.5 },
  { id: "roots",   section: "roots",    label: "CH.07 / FIELD LOG",        actor: 6, x: 2.5,  y: 0.9,  scale: 0.5,  glow: 0.6,  warmth: 1,    dim: 0.4 },
  { id: "beacon",  section: "contact",  label: "CH.08 / SIGNAL BEACON",    actor: 7, x: 0.0,  y: 0.1,  scale: 0.9,  glow: 0.9,  warmth: 0.5,  dim: 0.4 },
];

export const ACTOR_COUNT = 8;

/* ── tiny shared store: scroll writes targets, R3F + HUD read them ── */
export const sceneStore = {
  /** transition state: chapters we sit between + eased fraction (0 = fully
   *  in `from`, 1 = fully in `to`). frac holds at 0 for most of a section. */
  trans: { from: 0, to: 0, frac: 0 },
  /** raw progress through the current section, 0..1 (drives e.g. rocket altitude) */
  local: 0,
  /** page dim factor for the canvas wrapper (interpolated) */
  dim: 1,
  chapterIndex: 0,
  mx: 0, my: 0,
  hotModule: -1,           // project-card hover → flask reaction intensifies
  listeners: new Set<() => void>(),
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** ease-out-back — small overshoot so incoming actors "pop" into place */
export const backOut = (t: number) => {
  const c1 = 1.30158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Recompute story state from scroll. Call from a scroll listener. */
export function updateChapterFromScroll() {
  const centre = window.scrollY + window.innerHeight * 0.5;
  const tops = CHAPTERS.map((c) => {
    const el = document.getElementById(c.section);
    return el ? el.offsetTop : Number.MAX_SAFE_INTEGER;
  });

  let i = 0;
  for (let k = 0; k < tops.length; k++) if (centre >= tops[k]) i = k;
  const next = Math.min(i + 1, CHAPTERS.length - 1);
  const span = Math.max(tops[next] - tops[i], 1);
  const raw = next === i ? 0 : clamp01((centre - tops[i]) / span);
  // hold each actor on stage for most of its section; the collapse → seed
  // flight → bloom handoff plays only in the final 30% approach.
  const ZONE = 0.7;
  const frac = raw < ZONE ? 0 : smooth((raw - ZONE) / (1 - ZONE));

  sceneStore.trans = { from: i, to: next, frac };
  sceneStore.local = raw;
  sceneStore.dim = lerp(CHAPTERS[i].dim, CHAPTERS[next].dim, frac);

  if (i !== sceneStore.chapterIndex) {
    sceneStore.chapterIndex = i;
    sceneStore.listeners.forEach((fn) => fn());
  }
}
