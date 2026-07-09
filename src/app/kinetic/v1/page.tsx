"use client";

/**
 * KINETIC V1 — Editorial Page Tear
 * A warm-paper editorial cover sits over the dark machine room. Scrolling
 * tears the cover open along a procedural jagged diagonal: the two halves
 * peel apart with rotation + drop-shadow (the shadow follows the clip-path
 * silhouette, selling the torn-paper edge). Reduced motion: static cover,
 * then content.
 */
import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ProfessionalBlock, ContactBlock } from "../_shared/ui";

/* Deterministic jagged tear line, top→bottom, drifting right. */
const JITTER = [3.2, -2.6, 1.8, -3.4, 2.9, -1.5, 3.8, -2.2, 1.2, -3.1, 2.4, -1.9, 3.5, -2.8];
const TEAR = Array.from({ length: 15 }, (_, i) => {
  const y = (i / 14) * 100;
  return { x: 34 + y * 0.34 + (JITTER[i] ?? 0), y };
});
const LEFT_CLIP = `polygon(0% 0%, ${TEAR.map((p) => `${p.x}% ${p.y}%`).join(", ")}, 0% 100%)`;
const RIGHT_CLIP = `polygon(${TEAR[0].x}% 0%, 100% 0%, 100% 100%, ${TEAR[TEAR.length - 1].x}% 100%, ${[...TEAR].reverse().slice(1).map((p) => `${p.x}% ${p.y}%`).join(", ")})`;

function PaperFace() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-v4-ink px-6 py-8 text-v4-bg md:px-14 md:py-12">
      {/* masthead */}
      <div className="flex items-baseline justify-between border-b border-v4-bg/20 pb-4">
        <span className="font-display text-[11px] tracking-[0.3em]">KM · THE LAB ISSUE</span>
        <span className="font-display text-[11px] tracking-[0.2em] opacity-60">BANGALORE · 2026</span>
      </div>
      {/* cover */}
      <div className="grid flex-1 items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-[12px] tracking-[0.3em] opacity-70">SOFTWARE ENGINEER · JPMORGAN CHASE · NIT TRICHY</p>
          <h1 className="mt-4 font-display text-[17vw] font-medium leading-[0.86] tracking-tighter md:text-[9.5vw]">
            {K.lineA}<br />{K.lineB}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed opacity-80 md:text-[15px]">{K.concrete}</p>
        </div>
        <div className="relative mx-auto hidden aspect-[3/4] w-full max-w-[300px] md:block">
          <Image src="/photos/portrait-editorial.webp" alt="Krishna Madhan" fill sizes="300px"
            className="rounded-sm object-cover grayscale-[35%]" priority />
          <span className="absolute -bottom-6 left-0 font-display text-[10px] tracking-[0.25em] opacity-60">FIG. 01 — THE OPERATOR</span>
        </div>
      </div>
      {/* footer strip */}
      <div className="flex items-end justify-between border-t border-v4-bg/20 pt-4">
        <p className="font-display text-[11px] tracking-[0.18em] opacity-70">
          AI SYSTEMS · DATA PLATFORMS · ROBOT PET · BANTER AGENT · LIVING-ROOM LAB
        </p>
        <p className="hidden font-display text-[11px] tracking-[0.25em] opacity-60 md:block">SCROLL TO TEAR ↓</p>
      </div>
    </div>
  );
}

function TearHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.6 });

  const lx = useTransform(p, [0.05, 0.85], ["0vw", "-62vw"]);
  const ly = useTransform(p, [0.05, 0.85], ["0vh", "5vh"]);
  const lr = useTransform(p, [0.05, 0.85], [0, -7]);
  const rx = useTransform(p, [0.05, 0.85], ["0vw", "63vw"]);
  const ry = useTransform(p, [0.05, 0.85], ["0vh", "9vh"]);
  const rr = useTransform(p, [0.05, 0.85], [0, 6]);
  const underScale = useTransform(p, [0, 0.7], [0.965, 1]);
  const underOpacity = useTransform(p, [0.08, 0.5], [0.25, 1]);
  const seamOpacity = useTransform(p, [0, 0.06, 0.5], [0, 1, 0]);

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* dark machine room beneath */}
        <motion.div style={{ scale: underScale, opacity: underOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-v4-bg px-6 text-center">
          <Eyebrow tone="amber" className="justify-center">UNDERNEATH THE COVER</Eyebrow>
          <h2 className="mt-5 font-display text-[13vw] leading-[0.9] tracking-tighter text-v4-ink md:text-[7vw]">
            THE MACHINE<br />ROOM
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-v4-body md:text-[15px]">
            {K.positioning} Five systems online 24/7 — keep scrolling for the proof.
          </p>
          <LabStatus className="mt-8 justify-center" />
          <CredStrip className="mt-6 justify-center" />
        </motion.div>

        {/* tear seam glow while slit is fresh */}
        <motion.svg style={{ opacity: seamOpacity }} className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points={TEAR.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="none" stroke="#e0a458" strokeWidth="0.35" strokeOpacity="0.8" />
        </motion.svg>

        {/* paper halves */}
        <motion.div style={{ x: lx, y: ly, rotate: lr, clipPath: LEFT_CLIP, transformOrigin: "10% 90%", filter: "drop-shadow(6px 0 14px rgba(0,0,0,0.45))" }}
          className="absolute inset-0 will-change-transform">
          <PaperFace />
        </motion.div>
        <motion.div style={{ x: rx, y: ry, rotate: rr, clipPath: RIGHT_CLIP, transformOrigin: "90% 10%", filter: "drop-shadow(-6px 2px 14px rgba(0,0,0,0.45))" }}
          className="absolute inset-0 will-change-transform">
          <PaperFace />
        </motion.div>
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <>
      <section className="min-h-screen">
        <div className="h-screen"><PaperFace /></div>
      </section>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <Eyebrow tone="amber" className="justify-center">UNDERNEATH THE COVER</Eyebrow>
        <h2 className="mt-5 font-display text-5xl tracking-tighter text-v4-ink md:text-6xl">THE MACHINE ROOM</h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-v4-body">{K.positioning}</p>
        <LabStatus className="mt-8 justify-center" />
        <CredStrip className="mt-6 justify-center" />
      </section>
    </>
  );
}

export default function V1() {
  const reduced = useReducedMotion();
  return (
    <KFrame variant={1}>
      {reduced ? <StaticHero /> : <TearHero />}

      <section className="px-6 py-20 md:px-12 md:py-28" id="systems">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">{K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">{K.systems.title}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">{K.systems.intro}</p>
          <div className="mt-10 space-y-5">
            {[0, 1, 2].map((i) => (
              <motion.div key={i}
                initial={reduced ? false : { opacity: 0, y: 40, rotate: i % 2 ? 0.6 : -0.6 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}>
                <SystemCard i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl"><ProfessionalBlock /></div>
      </section>

      <section className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
      </section>
    </KFrame>
  );
}
