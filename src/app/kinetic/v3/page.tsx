"use client";

/**
 * KINETIC V3 — Particle Explosion → Tech Stack
 * ~4k particles form a procedural torus-knot "lab core". Scroll detonates it
 * — every particle flies outward on its own damped trajectory — then the
 * debris reassembles into the word SYSTEMS (rasterized from an offscreen
 * canvas, no font assets). Per-particle stagger keeps the motion organic.
 * Sticky 380vh hero; phase HUD narrates. Reduced motion / no WebGL: static hero.
 */
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ContactBlock } from "../_shared/ui";
import { SafeCanvas, useIsMobile } from "../_shared/three";

/* deterministic pseudo-random */
function prand(i: number) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

function sampleText(count: number): Float32Array {
  const c = document.createElement("canvas");
  c.width = 480; c.height = 120;
  const ctx = c.getContext("2d")!;
  ctx.font = "700 96px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("SYSTEMS", 8, 64);
  const img = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: number[] = [];
  for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
    if (img[(y * c.width + x) * 4 + 3] > 128) pts.push(x, y);
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = Math.floor(prand(i * 3 + 7) * (pts.length / 2)) * 2;
    out[i * 3] = (pts[j] / 480 - 0.5) * 7.4;
    out[i * 3 + 1] = -(pts[j + 1] / 120 - 0.5) * 1.85;
    out[i * 3 + 2] = (prand(i * 5 + 1) - 0.5) * 0.25;
  }
  return out;
}

function CoreParticles({ prog }: { prog: React.MutableRefObject<number> }) {
  const isMobile = useIsMobile();
  const COUNT = isMobile ? 1800 : 4200;
  const ref = useRef<THREE.Points>(null);

  const { core, burst, text, colors, seeds } = useMemo(() => {
    const core = new Float32Array(COUNT * 3);
    const burst = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const blue = new THREE.Color("#6ab0d8"), amber = new THREE.Color("#e0a458"), ink = new THREE.Color("#ece9e2");
    for (let i = 0; i < COUNT; i++) {
      // torus knot (p=2,q=3) with radial fuzz
      const t = prand(i) * Math.PI * 2;
      const r = 0.9 + 0.35 * Math.cos(3 * t) + (prand(i + 1) - 0.5) * 0.16;
      core[i * 3] = r * Math.cos(2 * t) * 1.35;
      core[i * 3 + 1] = r * Math.sin(2 * t) * 1.35;
      core[i * 3 + 2] = (0.5 * Math.sin(3 * t) + (prand(i + 2) - 0.5) * 0.16) * 1.35;
      const len = Math.hypot(core[i * 3], core[i * 3 + 1], core[i * 3 + 2]) || 1;
      const blast = 4.2 + prand(i + 3) * 4.5;
      burst[i * 3] = (core[i * 3] / len) * blast + (prand(i + 4) - 0.5) * 2.2;
      burst[i * 3 + 1] = (core[i * 3 + 1] / len) * blast + (prand(i + 5) - 0.5) * 2.2;
      burst[i * 3 + 2] = (core[i * 3 + 2] / len) * blast + (prand(i + 6) - 0.5) * 2.2;
      const c = prand(i + 8) < 0.14 ? amber : prand(i + 9) < 0.5 ? blue : ink;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      seeds[i] = prand(i + 10);
    }
    return { core, burst, text: sampleText(COUNT), colors, seeds };
  }, [COUNT]);

  const positions = useMemo(() => core.slice(), [core]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = prog.current; // 0..1
    const pos = ref.current!.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      // per-particle staggered phases: 0→1 core→burst, 1→2 burst→text
      const ph = Math.min(Math.max(p * 2.3 - s * 0.3, 0), 2);
      let tx: number, ty: number, tz: number;
      if (ph <= 1) {
        const e = ph * ph * (3 - 2 * ph);
        tx = core[i * 3] + (burst[i * 3] - core[i * 3]) * e;
        ty = core[i * 3 + 1] + (burst[i * 3 + 1] - core[i * 3 + 1]) * e;
        tz = core[i * 3 + 2] + (burst[i * 3 + 2] - core[i * 3 + 2]) * e;
      } else {
        const q = ph - 1, e = q * q * (3 - 2 * q);
        tx = burst[i * 3] + (text[i * 3] - burst[i * 3]) * e;
        ty = burst[i * 3 + 1] + (text[i * 3 + 1] - burst[i * 3 + 1]) * e;
        tz = burst[i * 3 + 2] + (text[i * 3 + 2] - burst[i * 3 + 2]) * e;
      }
      // idle breathing on the core, shimmer on the text
      const j = (p < 0.1 ? 0.03 : 0.008) * Math.sin(t * 1.7 + s * 40);
      pos[i * 3] += (tx + j - pos[i * 3]) * 0.09;
      pos[i * 3 + 1] += (ty + j - pos[i * 3 + 1]) * 0.09;
      pos[i * 3 + 2] += (tz - pos[i * 3 + 2]) * 0.09;
    }
    ref.current!.geometry.attributes.position.needsUpdate = true;
    ref.current!.rotation.y = p < 0.5 ? t * 0.12 * (1 - p * 2) : 0;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={isMobile ? 0.05 : 0.038} vertexColors sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

const PHASES = ["IDENTITY CORE", "DECONSTRUCTION", "REASSEMBLY → SYSTEMS"];

export default function V3() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => { prog.current = v; });
  const phaseIdx = useTransform(scrollYProgress, (v) => (v < 0.3 ? 0 : v < 0.62 ? 1 : 2));
  const copyOpacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 0.95], [1, 0.35, 0.35, 0]);
  const [phase, setPhase] = React.useState(0);
  useMotionValueEvent(phaseIdx, "change", (v) => setPhase(v));

  return (
    <KFrame variant={3}>
      <section ref={ref} className={reduced ? "" : "relative h-[380vh]"} aria-label="Hero">
        <div className={reduced ? "relative flex min-h-screen flex-col justify-end" : "sticky top-0 flex h-screen flex-col justify-end overflow-hidden"}>
          <SafeCanvas className="absolute inset-0" camera={{ position: [0, 0, 6.4], fov: 46 }}
            fallback={<div className="flex h-full items-center justify-center"><span className="font-display text-[9vw] tracking-tighter text-v4-panel">SYSTEMS</span></div>}>
            <CoreParticles prog={prog} />
          </SafeCanvas>

          {/* phase HUD */}
          <div className="pointer-events-none absolute right-5 top-20 z-10 hidden flex-col items-end gap-1.5 md:flex" aria-hidden>
            {PHASES.map((p, i) => (
              <span key={p} className={`font-display text-[10px] tracking-[0.25em] transition-colors duration-300 ${i === phase ? "text-v4-amber" : "text-v4-mute/50"}`}>
                {i === phase ? "▸ " : ""}{p}
              </span>
            ))}
          </div>

          <motion.div style={{ opacity: reduced ? 1 : copyOpacity }} className="relative z-10 px-6 pb-12 md:px-12">
            <Eyebrow tone="amber">{K.boot}</Eyebrow>
            <h1 className="mt-4 font-display text-[11vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[6.4vw]">
              {K.lineA} {K.lineB}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-v4-body md:text-[15px]">{K.concrete}</p>
            <CredStrip className="mt-6" />
            <LabStatus className="mt-4" />
            {!reduced && <p className="mt-6 font-display text-[10px] tracking-[0.3em] text-v4-mute">SCROLL — DETONATE THE CORE ↓</p>}
          </motion.div>
        </div>
      </section>

      {/* STACK GRID — where the debris landed */}
      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="blue">REASSEMBLED — THE STACK</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">Every particle lands somewhere</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-v4-line bg-v4-line sm:grid-cols-2 lg:grid-cols-4">
            {K.professional.skillGroups.map((g) => (
              <div key={g.group} className="bg-v4-panel p-5">
                <h3 className="font-display text-[11px] tracking-[0.25em] text-v4-amber">{g.group.toUpperCase()}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-full border border-v4-line px-2.5 py-1 font-display text-[11px] text-v4-body">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">{K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">{K.systems.title}</h2>
          <div className="mt-10 space-y-5">
            {[0, 1].map((i) => (
              <motion.div key={i} initial={reduced ? false : { opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 90, damping: 17 }}>
                <SystemCard i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
      </section>
    </KFrame>
  );
}
