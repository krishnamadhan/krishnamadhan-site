/**
 * v5 "KM Core" — precomputed morph-target buffers.
 *
 * ONE particle count, SIX formation buffers, built ONCE into Float32Arrays.
 * The field lerps between two of these per frame (no allocation in the loop).
 * Each formation is the same `count` of particles arranged as a different
 * "shape of the OS":
 *   0 nucleus   — dense spherical core + loose orbital shell (hero)
 *   1 mesh      — clustered graph nodes, wide spread (systems)
 *   2 pipeline  — vertical rail lattice / columns (professional)
 *   3 cluster   — a few dense knots + scatter (lab)
 *   4 helix     — calm standing double-helix column (roots)
 *   5 beacon    — collapsed core + a broadcast ring (contact)
 *
 * Colours: off-white base, a warm-amber minority (knots) and a cool-blue
 * minority (mesh). A small "bright" subset renders larger/hotter to read as
 * energy without a bloom pass.
 */
import * as THREE from "three";

export type Formations = {
  count: number;
  /** 6 buffers, each Float32Array(count*3) */
  targets: Float32Array[];
  /** per-particle rgb, Float32Array(count*3) */
  colors: Float32Array;
  /** per-particle base size, Float32Array(count) */
  sizes: Float32Array;
  /** per-particle idle-wander seeds */
  seed: Float32Array;
};

const OFFWHITE = new THREE.Color("#ece9e2");
const AMBER = new THREE.Color("#e0a458");
const BLUE = new THREE.Color("#6ab0d8");

// deterministic PRNG so the field is stable across renders
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildFormations(count: number): Formations {
  const rnd = mulberry32(0x5eed42);
  const targets = Array.from({ length: 6 }, () => new Float32Array(count * 3));
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seed = new Float32Array(count * 3);

  // stable per-particle randoms reused across formations
  const R = Array.from({ length: count }, () => [rnd(), rnd(), rnd(), rnd(), rnd()]);

  // mesh cluster centres (formation 1)
  const MESH_NODES = 16;
  const meshC: [number, number, number][] = [];
  for (let n = 0; n < MESH_NODES; n++) {
    meshC.push([(rnd() - 0.5) * 5.4, (rnd() - 0.5) * 3.4, (rnd() - 0.5) * 2.2]);
  }
  // lab knot centres (formation 3)
  const knots: [number, number, number][] = [
    [-0.9, 0.6, 0.3], [1.0, -0.4, -0.4], [0.2, 0.9, 0.6], [0.4, -1.0, 0.1],
  ];

  const c = new THREE.Color();

  for (let idx = 0; idx < count; idx++) {
    const [a, b, d, e, g] = R[idx];
    const i3 = idx * 3;

    // ── 0 · NUCLEUS: 72% dense core, 28% loose orbital shell
    {
      let x: number, y: number, z: number;
      const theta = a * Math.PI * 2, phi = Math.acos(2 * b - 1);
      if (d < 0.72) {
        const r = Math.cbrt(e) * 1.15;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      } else {
        const r = 2.0 + g * 0.5;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
        z = r * Math.cos(phi);
      }
      targets[0].set([x, y, z], i3);
    }

    // ── 1 · MESH: assign to a node, jitter around it; a few on graph edges
    {
      const node = meshC[Math.floor(a * MESH_NODES) % MESH_NODES];
      let x: number, y: number, z: number;
      if (d < 0.24) {
        // edge particle: interpolate between two nodes
        const n2 = meshC[Math.floor(b * MESH_NODES) % MESH_NODES];
        const t = e;
        x = node[0] + (n2[0] - node[0]) * t;
        y = node[1] + (n2[1] - node[1]) * t;
        z = node[2] + (n2[2] - node[2]) * t;
      } else {
        const jr = 0.28 + g * 0.22;
        x = node[0] + (a - 0.5) * jr * 2;
        y = node[1] + (b - 0.5) * jr * 2;
        z = node[2] + (e - 0.5) * jr * 2;
      }
      targets[1].set([x, y, z], i3);
    }

    // ── 2 · PIPELINE: 5 vertical rails, structured grid, gentle depth
    {
      const rail = Math.floor(a * 5);
      const x = (rail - 2) * 0.72 + (b - 0.5) * 0.12;
      const rows = 26;
      const row = Math.floor(e * rows);
      const y = (row / (rows - 1) - 0.5) * 4.4 + (g - 0.5) * 0.08;
      const z = (d - 0.5) * 0.5;
      targets[2].set([x, y, z], i3);
    }

    // ── 3 · CLUSTER: dense knots + loose scatter (mechanical)
    {
      let x: number, y: number, z: number;
      if (d < 0.7) {
        const k = knots[Math.floor(a * knots.length) % knots.length];
        const jr = 0.32 * Math.cbrt(e);
        const th = b * Math.PI * 2, ph = Math.acos(2 * g - 1);
        x = k[0] + jr * Math.sin(ph) * Math.cos(th);
        y = k[1] + jr * Math.sin(ph) * Math.sin(th);
        z = k[2] + jr * Math.cos(ph);
      } else {
        x = (a - 0.5) * 4.2;
        y = (b - 0.5) * 3.0;
        z = (g - 0.5) * 1.6;
      }
      targets[3].set([x, y, z], i3);
    }

    // ── 4 · HELIX: calm double-strand standing column
    {
      const strand = a < 0.5 ? 0 : Math.PI;
      const f = e; // height fraction
      const ang = f * Math.PI * 5 + strand;
      const rad = 0.82;
      const x = Math.cos(ang) * rad + (b - 0.5) * 0.08;
      const y = (f - 0.5) * 4.2;
      const z = Math.sin(ang) * rad + (g - 0.5) * 0.08;
      targets[4].set([x, y, z], i3);
    }

    // ── 5 · BEACON: tight core (70%) + a broadcast ring on the xy plane
    {
      let x: number, y: number, z: number;
      if (d < 0.7) {
        const r = Math.cbrt(e) * 0.42;
        const th = a * Math.PI * 2, ph = Math.acos(2 * b - 1);
        x = r * Math.sin(ph) * Math.cos(th);
        y = r * Math.sin(ph) * Math.sin(th);
        z = r * Math.cos(ph);
      } else {
        const ring = 1.15 + g * 0.12;
        const th = a * Math.PI * 2;
        x = Math.cos(th) * ring;
        y = Math.sin(th) * ring;
        z = (e - 0.5) * 0.16;
      }
      targets[5].set([x, y, z], i3);
    }

    // ── colour + size + seeds
    const roll = a;
    if (roll < 0.14) c.copy(AMBER).lerp(OFFWHITE, 0.25);       // warm knots
    else if (roll < 0.34) c.copy(BLUE).lerp(OFFWHITE, 0.35);   // cool mesh
    else c.copy(OFFWHITE);
    const bright = b > 0.88;                                    // ~12% energy
    if (bright) c.lerp(new THREE.Color("#ffffff"), 0.35);
    colors.set([c.r, c.g, c.b], i3);
    // crisp motes, not fog: small normal points, a modest bright subset
    sizes[idx] = bright ? 0.42 + g * 0.34 : 0.16 + e * 0.16;

    seed.set([g * 6.283, 0.4 + e * 0.7, 0.02 + d * 0.05], i3);  // phase, speed, amp
  }

  return { count, targets, colors, sizes, seed };
}
