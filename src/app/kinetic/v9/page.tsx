"use client";

/**
 * KINETIC V9 — Cinematic Horizontal Scroll
 * Vertical scroll drives a 400vw film strip through four scenes: IDENTITY →
 * PROFESSIONAL → THE LAB → CONTACT. Giant ghost numerals drift slower than
 * the track (parallax), titles drift faster — scenes hand off like cuts.
 * A progress rail tracks the reel. Mobile & reduced motion: the same four
 * scenes as native vertical sections. No horizontal-scroll jank on touch.
 */
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ContactBlock } from "../_shared/ui";
import { useIsMobile } from "../_shared/three";

function Numeral({ n, p, i }: { n: string; p: MotionValue<number>; i: number }) {
  const x = useTransform(p, [(i - 1) / 3, (i + 1) / 3], ["18vw", "-18vw"]);
  return (
    <motion.span style={{ x }} aria-hidden
      className="pointer-events-none absolute -bottom-8 right-0 select-none font-display text-[38vh] font-medium leading-none text-v4-ink/[0.05]">
      {n}
    </motion.span>
  );
}

function SceneTitle({ children, p, i }: { children: React.ReactNode; p: MotionValue<number>; i: number }) {
  const x = useTransform(p, [(i - 1) / 3, (i + 1) / 3], ["9vw", "-9vw"]);
  return (
    <motion.h2 style={{ x }} className="font-display text-[8.5vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[5.2vw]">
      {children}
    </motion.h2>
  );
}

function IdentityScene({ p }: { p: MotionValue<number> | null }) {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden px-6 md:px-16">
      {p && <Numeral n="01" p={p} i={0} />}
      <div className="grid w-full items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow tone="amber">{K.boot}</Eyebrow>
          <h1 className="mt-5 font-display text-[13vw] font-medium leading-[0.88] tracking-tighter text-v4-ink md:text-[7.5vw]">
            {K.lineA}<br />{K.lineB}
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-v4-body">{K.concrete}</p>
          <CredStrip className="mt-6" />
          <LabStatus className="mt-4" />
        </div>
        <div className="relative hidden aspect-[3/4] max-h-[64vh] overflow-hidden rounded-2xl border border-v4-line md:block">
          <Image src="/photos/portrait-duotone.webp" alt="Krishna Madhan" fill priority sizes="30vw" className="object-cover" />
          <span className="absolute bottom-3 left-3 font-display text-[10px] tracking-[0.25em] text-v4-ink/80">SCENE 01 — THE OPERATOR</span>
        </div>
      </div>
    </div>
  );
}

function ProfessionalScene({ p }: { p: MotionValue<number> | null }) {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden border-l border-v4-line px-6 md:px-16">
      {p && <Numeral n="02" p={p} i={1} />}
      <div className="w-full">
        <Eyebrow tone="blue">SCENE 02 · {K.professional.label}</Eyebrow>
        <div className="mt-4">{p ? <SceneTitle p={p} i={1}>{K.professional.title}</SceneTitle> : <h2 className="font-display text-4xl tracking-tight text-v4-ink">{K.professional.title}</h2>}</div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {K.professional.capabilities.slice(0, 3).map((c) => (
            <div key={c.cap} className="rounded-xl border border-v4-line bg-v4-panel p-5">
              <h3 className="font-display text-sm text-v4-ink">{c.cap}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-v4-mute">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          {K.professional.timeline.map((t) => (
            <span key={t.era} className="font-display text-[11px] tracking-[0.14em] text-v4-mute">
              <span className="text-v4-amber">{t.era}</span> {t.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabScene({ p }: { p: MotionValue<number> | null }) {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden border-l border-v4-line px-6 md:px-16">
      {p && <Numeral n="03" p={p} i={2} />}
      <div className="w-full">
        <Eyebrow tone="amber">SCENE 03 · {K.systems.label}</Eyebrow>
        <div className="mt-4">{p ? <SceneTitle p={p} i={2}>The living-room lab</SceneTitle> : <h2 className="font-display text-4xl tracking-tight text-v4-ink">The living-room lab</h2>}</div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => <SystemCard key={i} i={i} flat />)}
        </div>
      </div>
    </div>
  );
}

function ContactScene({ p }: { p: MotionValue<number> | null }) {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden border-l border-v4-line px-6">
      {p && <Numeral n="04" p={p} i={3} />}
      <ContactBlock />
    </div>
  );
}

export default function V9() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const flat = reduced || isMobile;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });
  const x = useTransform(p, [0, 1], ["0vw", "-300vw"]);
  const rail = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <KFrame variant={9} lenis={!flat}>
      {flat ? (
        <div className="[&>div]:min-h-screen [&>div]:w-full [&>div]:py-16">
          <IdentityScene p={null} />
          <ProfessionalScene p={null} />
          <LabScene p={null} />
          <ContactScene p={null} />
        </div>
      ) : (
        <section ref={ref} className="relative h-[400vh]" aria-label="Cinematic reel">
          <div className="sticky top-0 h-screen overflow-hidden">
            <motion.div style={{ x }} className="flex h-full w-[400vw] will-change-transform">
              <IdentityScene p={p} />
              <ProfessionalScene p={p} />
              <LabScene p={p} />
              <ContactScene p={p} />
            </motion.div>
            {/* progress rail */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-5 md:px-16">
              <div className="flex items-center justify-between pb-2">
                {["IDENTITY", "PROFESSIONAL", "THE LAB", "CONTACT"].map((s) => (
                  <span key={s} className="font-display text-[9px] tracking-[0.25em] text-v4-mute">{s}</span>
                ))}
              </div>
              <div className="h-px w-full bg-v4-line">
                <motion.div style={{ width: rail }} className="h-full bg-v4-amber" />
              </div>
            </div>
          </div>
        </section>
      )}
    </KFrame>
  );
}
