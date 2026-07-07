/**
 * Chapter states for the persistent KM Lab object. One object, eight modes —
 * the scene interpolates continuously between neighbouring chapters based on
 * scroll, so the object *evolves* (never pops) as the story progresses.
 *
 * All parameters are continuous morph controls:
 *  x/y       world position (desktop; x is damped on mobile)
 *  scale     overall size            glow    emissive/ring intensity
 *  warmth    0 = cyan lab, 1 = amber field-log
 *  spread    ring radius multiplier  flat    rings tilt toward a flat disc
 *  split     0 = modules docked in core, 1 = orbiting free
 *  squash    vertical compression (timeline capsule)
 *  spin      rotation speed multiplier
 *  pulse     beacon breathing (contact)
 */

export type Chapter = {
  id: string;
  section: string;   // DOM id this chapter belongs to
  label: string;     // HUD readout
  x: number; y: number; scale: number;
  glow: number; warmth: number;
  spread: number; flat: number; split: number;
  squash: number; spin: number; pulse: number; dim: number;
};

export const CHAPTERS: Chapter[] = [
  { id: "core",      section: "top",      label: "CH.01 / KM CORE",       x: 1.9,  y: 0.0,  scale: 1.15, glow: 1.15, warmth: 0,    spread: 1.0, flat: 0,    split: 0,   squash: 1,    spin: 1.0,  pulse: 0 , dim: 1 },
  { id: "lens",      section: "about",    label: "CH.02 / IDENTITY",      x: 2.6,  y: 0.2,  scale: 0.55, glow: 0.45, warmth: 0,    spread: 0.8, flat: 0.85, split: 0,   squash: 1,    spin: 0.5,  pulse: 0 , dim: 0.45 },
  { id: "map",       section: "work",     label: "CH.03 / SYSTEMS",       x: 0.0,  y: -0.2, scale: 0.8,  glow: 0.7,  warmth: 0,    spread: 1.0, flat: 0.6,  split: 0.85, squash: 1,   spin: 0.7,  pulse: 0 , dim: 0.3 },
  { id: "modules",   section: "projects", label: "CH.04 / LAB MODULES",   x: -2.8, y: 0.0,  scale: 0.6,  glow: 0.55, warmth: 0.1,  spread: 0.8, flat: 0.2,  split: 1,   squash: 1,    spin: 0.9,  pulse: 0 , dim: 0.5 },
  { id: "capsule",   section: "timeline", label: "CH.05 / TRAJECTORY",    x: 2.4,  y: -0.3, scale: 0.45, glow: 0.35, warmth: 0.15, spread: 0.7, flat: 0.3,  split: 0.2, squash: 0.55, spin: 0.25, pulse: 0 , dim: 0.3 },
  { id: "orbital",   section: "skills",   label: "CH.06 / STACK",         x: 0.0,  y: 0.1,  scale: 0.75, glow: 0.7,  warmth: 0.2,  spread: 1.0, flat: 0.9,  split: 0.9, squash: 1,    spin: 0.6,  pulse: 0 , dim: 0.3 },
  { id: "fieldlens", section: "offduty",  label: "CH.07 / FIELD LOG",     x: -2.4, y: 0.2,  scale: 0.6,  glow: 0.8,  warmth: 1,    spread: 0.9, flat: 0.95, split: 0,   squash: 1,    spin: 0.4,  pulse: 0 , dim: 0.5 },
  { id: "roots",     section: "roots",    label: "CH.07 / FIELD LOG",     x: -2.4, y: 0.1,  scale: 0.5,  glow: 0.6,  warmth: 1,    spread: 0.9, flat: 0.95, split: 0,   squash: 1,    spin: 0.35, pulse: 0 , dim: 0.4 },
  { id: "beacon",    section: "contact",  label: "CH.08 / SIGNAL",        x: 0.0,  y: 0.0,  scale: 0.95, glow: 0.9,  warmth: 0.5,  spread: 0.9, flat: 0,    split: 0.3, squash: 1,    spin: 0.8,  pulse: 1 , dim: 0.4 },
];

/* ── tiny shared store: scroll writes targets, R3F + HUD read them ── */
export const sceneStore = {
  /* interpolated chapter params (target — the scene lerps toward these) */
  params: { ...CHAPTERS[0] } as Chapter,
  chapterIndex: 0,
  mx: 0, my: 0,
  hotModule: -1,           // project-card hover → pulse matching module
  listeners: new Set<() => void>(),
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

const NUM = ["x", "y", "scale", "glow", "warmth", "spread", "flat", "split", "squash", "spin", "pulse", "dim"] as const;

/** Recompute interpolated params from scroll. Call from a scroll listener. */
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
  const frac = next === i ? 0 : smooth(Math.min(Math.max((centre - tops[i]) / span, 0), 1));

  const a = CHAPTERS[i], b = CHAPTERS[next];
  for (const k of NUM) (sceneStore.params as Record<string, unknown>)[k] = lerp(a[k], b[k], frac);
  const idx = frac > 0.5 ? next : i;
  if (idx !== sceneStore.chapterIndex) {
    sceneStore.chapterIndex = idx;
    sceneStore.listeners.forEach((fn) => fn());
  }
}