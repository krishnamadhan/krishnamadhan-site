"use client";

/**
 * KINETIC V4 — Mechanical Lab Core Transformation
 * ONE persistent object carries the whole page. Five modules morph through
 * five chapter states as you scroll: identity monolith → orbiting systems
 * map → data pipeline conveyor → robot companion (eyes light up) → contact
 * beacon. Sticky split layout; every transform is damp-lerped in useFrame.
 * Reduced motion / no WebGL: chapters render as plain editorial sections.
 */
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { K, IDENTITY } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ContactBlock } from "../_shared/ui";
import { SafeCanvas, damp } from "../_shared/three";

type M = { p: [number, number, number]; s: [number, number, number]; r: number };
/* 5 states × 5 modules: pos / scale / y-rotation */
const STATES: M[][] = [
  // 0 — monolith: tight slab stack
  [-0.88, -0.44, 0, 0.44, 0.88].map((y) => ({ p: [0, y, 0], s: [1.15, 0.4, 0.75], r: 0 })) as M[],
  // 1 — systems map: pentagon orbit
  Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { p: [Math.cos(a) * 1.55, Math.sin(a) * 1.25, 0], s: [0.5, 0.5, 0.5], r: a } as M;
  }),
  // 2 — pipeline: conveyor row
  Array.from({ length: 5 }, (_, i) => ({ p: [(i - 2) * 1.05, 0, 0], s: [0.62, 0.62, 0.62], r: 0 } as M)),
  // 3 — robot: torso ×2, head, arms ×2
  [
    { p: [0, -0.75, 0], s: [1.0, 0.55, 0.7], r: 0 },
    { p: [0, -0.15, 0], s: [0.9, 0.5, 0.65], r: 0 },
    { p: [0, 0.72, 0], s: [0.72, 0.62, 0.62], r: 0 },
    { p: [-0.78, -0.2, 0], s: [0.24, 0.7, 0.3], r: 0 },
    { p: [0.78, -0.2, 0], s: [0.24, 0.7, 0.3], r: 0 },
  ],
  // 4 — beacon: collapsed pedestal
  [-0.5, -0.25, 0, 0.25, 0.5].map((y, i) => ({ p: [0, y * 0.8, 0], s: [0.55 - Math.abs(i - 2) * 0.08, 0.18, 0.55 - Math.abs(i - 2) * 0.08], r: 0 })) as M[],
];
/* per-state globals: ring, eyes, beam opacity */
const GLOBALS = [
  { ring: 0.3, eyes: 0, beam: 0 },
  { ring: 0.55, eyes: 0, beam: 0 },
  { ring: 0, eyes: 0, beam: 0 },
  { ring: 0, eyes: 1, beam: 0 },
  { ring: 0.9, eyes: 0, beam: 0.65 },
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function LabCore({ prog }: { prog: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mods = useRef<(THREE.Mesh | null)[]>([]);
  const ring = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime;
    const f = Math.min(Math.max(prog.current, 0), 1) * 4; // 0..4
    const a = Math.min(Math.floor(f), 3), frac = smooth(Math.min(f - a, 1));
    const pipeW = Math.max(0, 1 - Math.abs(f - 2)); // pipeline pulse weight
    for (let i = 0; i < 5; i++) {
      const m = mods.current[i]; if (!m) continue;
      const A = STATES[a][i], B = STATES[a + 1][i];
      const bob = pipeW * Math.sin(t * 3 - i * 0.9) * 0.07 + (f < 1 ? Math.sin(t * 1.2 + i) * 0.02 : 0);
      m.position.x = damp(m.position.x, lerp(A.p[0], B.p[0], frac), 5, dt);
      m.position.y = damp(m.position.y, lerp(A.p[1], B.p[1], frac) + bob, 5, dt);
      m.position.z = damp(m.position.z, lerp(A.p[2], B.p[2], frac), 5, dt);
      m.scale.x = damp(m.scale.x, lerp(A.s[0], B.s[0], frac), 5, dt);
      m.scale.y = damp(m.scale.y, lerp(A.s[1], B.s[1], frac), 5, dt);
      m.scale.z = damp(m.scale.z, lerp(A.s[2], B.s[2], frac), 5, dt);
      m.rotation.y = damp(m.rotation.y, lerp(A.r, B.r, frac), 5, dt);
      const mat = mats.current[i];
      if (mat) {
        const pulse = pipeW * (0.5 + 0.5 * Math.sin(t * 4 - i * 1.2));
        mat.emissiveIntensity = damp(mat.emissiveIntensity, 0.15 + pulse * 0.9, 6, dt);
      }
    }
    const G = GLOBALS[a], H = GLOBALS[Math.min(a + 1, 4)];
    const ringO = lerp(G.ring, H.ring, frac), eyesO = lerp(G.eyes, H.eyes, frac), beamO = lerp(G.beam, H.beam, frac);
    if (ring.current) {
      const rm = ring.current.material as THREE.MeshBasicMaterial;
      rm.opacity = damp(rm.opacity, ringO * (f > 3.5 ? 0.6 + 0.4 * Math.sin(t * 2.4) : 1), 5, dt);
      ring.current.rotation.z = t * 0.25;
      const rs = f > 3.5 ? 1.35 + 0.12 * Math.sin(t * 2.4) : 1.6;
      ring.current.scale.setScalar(damp(ring.current.scale.x, rs, 4, dt));
    }
    [eyeL, eyeR].forEach((e) => {
      if (!e.current) return;
      const em = e.current.material as THREE.MeshBasicMaterial;
      const blink = Math.sin(t * 0.7) > 0.985 ? 0.1 : 1;
      em.opacity = damp(em.opacity, eyesO * blink, 8, dt);
    });
    if (beam.current) {
      const bm = beam.current.material as THREE.MeshBasicMaterial;
      bm.opacity = damp(bm.opacity, beamO * (0.35 + 0.25 * Math.sin(t * 3)), 5, dt);
    }
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, pointer.x * 0.25 + (f > 0.5 && f < 1.5 ? t * 0.1 : 0), 2.2, dt);
      group.current.rotation.x = damp(group.current.rotation.x, -pointer.y * 0.08, 2.2, dt);
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#e0a458" />
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} ref={(el) => { mods.current[i] = el; }}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            ref={(el) => { mats.current[i] = el; }}
            color="#232730" metalness={0.55} roughness={0.4}
            emissive={i === 2 ? "#e0a458" : "#6ab0d8"} emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      <mesh ref={ring} scale={1.6}>
        <torusGeometry args={[1.35, 0.012, 8, 90]} />
        <meshBasicMaterial color="#6ab0d8" transparent opacity={0.3} />
      </mesh>
      <mesh ref={eyeL} position={[-0.17, 0.74, 0.34]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#e0a458" transparent opacity={0} />
      </mesh>
      <mesh ref={eyeR} position={[0.17, 0.74, 0.34]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#e0a458" transparent opacity={0} />
      </mesh>
      <mesh ref={beam} position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.06, 0.16, 3.2, 12, 1, true]} />
        <meshBasicMaterial color="#e0a458" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

const CHAPTERS = [
  { tag: "01 · IDENTITY CORE", title: "Krishna Madhan", body: "" },
  { tag: "02 · SYSTEMS MAP", title: "Five systems in orbit", body: "Everything in the lab talks to everything else — one Pi, five running systems, zero staged demos." },
  { tag: "03 · DATA PIPELINE", title: "The professional conveyor", body: K.professional.intro },
  { tag: "04 · ROBOT COMPANION", title: "Cosmo wakes up", body: "The same modules, reassembled into a pet — behaviour tree, moods, memory. The lab's proof that machines can feel alive." },
  { tag: "05 · CONTACT BEACON", title: "Signal me", body: "" },
];

export default function V4() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const [chapter, setChapter] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    prog.current = v;
    setChapter(Math.min(Math.floor(v * 4 + 0.35), 4));
  });

  return (
    <KFrame variant={4}>
      <div ref={wrap} className="relative md:grid md:grid-cols-2">
        {/* sticky core */}
        <div className="sticky top-0 z-0 h-[42vh] md:h-screen">
          <SafeCanvas className="h-full w-full" camera={{ position: [0, 0, 5.4], fov: 44 }}
            fallback={<div className="flex h-full items-center justify-center"><span className="font-display text-6xl text-v4-panel">KM</span></div>}>
            <LabCore prog={prog} />
          </SafeCanvas>
          <div className="pointer-events-none absolute bottom-5 left-6 md:left-10" aria-hidden>
            <p className="font-display text-[10px] tracking-[0.3em] text-v4-amber">{CHAPTERS[chapter].tag}</p>
            <div className="mt-2 flex gap-1.5">
              {CHAPTERS.map((_, i) => (
                <span key={i} className={`h-0.5 w-7 rounded-full transition-colors duration-300 ${i <= chapter ? "bg-v4-amber" : "bg-v4-line"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* scrolling chapters */}
        <div className="relative z-10">
          <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-12">
            <Eyebrow tone="amber">{K.boot}</Eyebrow>
            <h1 className="mt-4 font-display text-6xl font-medium leading-[0.92] tracking-tighter text-v4-ink md:text-7xl">
              {K.lineA}<br />{K.lineB}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-v4-body">{K.concrete}</p>
            <CredStrip className="mt-7" />
            <LabStatus className="mt-4" />
          </section>

          <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-12">
            <Eyebrow tone="blue">{CHAPTERS[1].tag}</Eyebrow>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-v4-ink">{CHAPTERS[1].title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-v4-body">{CHAPTERS[1].body}</p>
            <ul className="mt-8 space-y-3">
              {K.systems.cards.map((c) => (
                <li key={c.n} className="flex items-baseline gap-4 border-b border-v4-line pb-3">
                  <span className="font-display text-xs text-v4-mute">{c.n}</span>
                  <span className="flex-1 font-display text-lg tracking-tight text-v4-ink">{c.name}</span>
                  <span className={`font-display text-[10px] tracking-[0.2em] ${c.status === "LIVE" ? "text-v4-amber" : "text-v4-blue"}`}>{c.status}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-12">
            <Eyebrow tone="blue">{CHAPTERS[2].tag}</Eyebrow>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-v4-ink">{CHAPTERS[2].title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-v4-body">{CHAPTERS[2].body}</p>
            <div className="mt-8 space-y-3">
              {K.professional.capabilities.slice(0, 5).map((c) => (
                <div key={c.cap} className="rounded-xl border border-v4-line bg-v4-panel p-4">
                  <h3 className="font-display text-sm text-v4-ink">{c.cap}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-v4-mute">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-12">
            <Eyebrow tone="amber">{CHAPTERS[3].tag}</Eyebrow>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-v4-ink">{CHAPTERS[3].title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-v4-body">{CHAPTERS[3].body}</p>
            <motion.div className="mt-8" initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
              <SystemCard i={1} />
            </motion.div>
          </section>

          <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-12">
            <ContactBlock />
          </section>
        </div>
      </div>
    </KFrame>
  );
}
