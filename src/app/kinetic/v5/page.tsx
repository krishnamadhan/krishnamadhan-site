"use client";

/**
 * KINETIC V5 — Editorial Portrait Magazine Cover
 * A premium cover: giant KRISHNA threads BEHIND the portrait cutout while
 * MADHAN sits in front of it (z-sandwich), masthead + cover lines around.
 * On scroll the cover deconstructs — type lines slide apart, the portrait
 * glides into a column card, and three proof panels rise and settle with
 * stagger. Sections read as editorial spreads. Reduced motion: static cover.
 */
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ProfessionalBlock, ContactBlock, PROOFS } from "../_shared/ui";

const COVER_LINES = [
  "ROBOT PETS THAT REMEMBER YOUR FACE",
  "17 GAMES LIVE IN ONE GROUP CHAT",
  "THE DATA-MESH YEARS AT JPMORGAN CHASE",
  "AGENTS THAT RUN THEIR OWN STANDUP",
];

function RisingPanel({ p, i, range }: { p: MotionValue<number>; i: number; range: [number, number] }) {
  const y = useTransform(p, range, ["105vh", "0vh"]);
  const rot = useTransform(p, range, [i % 2 ? 4 : -4, 0]);
  const Proof = PROOFS[i];
  return (
    <motion.div style={{ y, rotate: rot }} className="will-change-transform">
      <div className="overflow-hidden rounded-xl border border-v4-line bg-v4-panel">
        <div className="h-44 md:h-52"><Proof /></div>
        <div className="flex items-baseline justify-between px-4 py-2.5">
          <span className="font-display text-[11px] tracking-[0.2em] text-v4-ink">{K.systems.cards[i].name}</span>
          <span className="font-display text-[9px] tracking-[0.2em] text-v4-mute">{K.proofCaptions[i]}</span>
        </div>
      </div>
    </motion.div>
  );
}

function CoverHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });

  const backX = useTransform(p, [0.08, 0.5], ["0vw", "-38vw"]);
  const frontX = useTransform(p, [0.08, 0.5], ["0vw", "34vw"]);
  const typeOp = useTransform(p, [0.3, 0.55], [1, 0]);
  const portraitScale = useTransform(p, [0.1, 0.55], [1, 0.5]);
  const portraitX = useTransform(p, [0.1, 0.55], ["0vw", "-32vw"]);
  const portraitY = useTransform(p, [0.1, 0.55], ["0vh", "-6vh"]);
  const linesOp = useTransform(p, [0.05, 0.3], [1, 0]);
  const mastY = useTransform(p, [0.05, 0.35], ["0%", "-160%"]);
  const introOp = useTransform(p, [0.5, 0.68], [0, 1]);
  const introX = useTransform(p, [0.5, 0.68], ["4vw", "0vw"]);

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="Hero">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* masthead */}
        <motion.div style={{ y: mastY }} className="relative z-30 flex items-baseline justify-between border-b border-v4-line px-6 py-4 md:px-12">
          <span className="font-display text-[11px] tracking-[0.32em] text-v4-ink">KM · THE LAB ISSUE</span>
          <span className="hidden font-display text-[10px] tracking-[0.2em] text-v4-mute md:block">JULY 2026 · BANGALORE EDITION</span>
          <span className="font-display text-[10px] tracking-[0.2em] text-v4-amber">№ 26</span>
        </motion.div>

        <div className="relative flex-1">
          {/* BACK type — behind the head */}
          <motion.h1 style={{ x: backX, opacity: typeOp }}
            className="absolute left-0 top-[6%] z-0 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter text-v4-ink md:text-[15vw]">
            {K.lineA}
          </motion.h1>
          {/* portrait cutout */}
          <motion.div style={{ scale: portraitScale, x: portraitX, y: portraitY }}
            className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[74vh] w-full max-w-[560px] will-change-transform">
            <Image src="/photos/portrait-cutout.webp" alt="Krishna Madhan" fill priority
              sizes="(max-width: 768px) 100vw, 560px" className="object-contain object-bottom" />
          </motion.div>
          {/* FRONT type — in front of the chest */}
          <motion.h2 style={{ x: frontX, opacity: typeOp }} aria-hidden
            className="absolute left-0 top-[38%] z-20 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter text-v4-blue/90 md:text-[15vw]">
            {K.lineB}
          </motion.h2>
          {/* cover lines */}
          <motion.ul style={{ opacity: linesOp }} className="absolute left-6 top-[16%] z-20 hidden max-w-[15rem] space-y-5 md:left-12 md:block">
            {COVER_LINES.slice(0, 2).map((l) => (
              <li key={l} className="border-l-2 border-v4-amber pl-3 font-display text-[11px] leading-relaxed tracking-[0.14em] text-v4-body">{l}</li>
            ))}
          </motion.ul>
          <motion.ul style={{ opacity: linesOp }} className="absolute right-6 top-[16%] z-20 hidden max-w-[15rem] space-y-5 text-right md:right-12 md:block">
            {COVER_LINES.slice(2).map((l) => (
              <li key={l} className="border-r-2 border-v4-blue pr-3 font-display text-[11px] leading-relaxed tracking-[0.14em] text-v4-body">{l}</li>
            ))}
          </motion.ul>
          {/* deconstructed state: intro column + rising proof panels */}
          <motion.div style={{ opacity: introOp, x: introX }}
            className="absolute right-6 top-[16%] z-20 hidden w-[38%] max-w-md md:right-12 md:block">
            <Eyebrow tone="amber">THE OPERATOR</Eyebrow>
            <p className="mt-4 text-[15px] leading-relaxed text-v4-body">{K.concrete}</p>
            <CredStrip className="mt-5" />
            <LabStatus className="mt-4" />
          </motion.div>
          <div className="absolute inset-x-6 bottom-6 z-20 grid grid-cols-1 gap-4 md:inset-x-12 md:grid-cols-3">
            <RisingPanel p={p} i={0} range={[0.55, 0.78]} />
            <div className="hidden md:block"><RisingPanel p={p} i={1} range={[0.63, 0.86]} /></div>
            <div className="hidden md:block"><RisingPanel p={p} i={2} range={[0.71, 0.94]} /></div>
          </div>
        </div>

        {/* cover footer */}
        <motion.div style={{ opacity: linesOp }} className="relative z-30 flex items-center justify-between border-t border-v4-line px-6 py-3.5 md:px-12">
          <span className="font-display text-[10px] tracking-[0.22em] text-v4-mute">SOFTWARE ENGINEER · JPMORGAN CHASE · NIT TRICHY</span>
          <span className="hidden font-display text-[10px] tracking-[0.25em] text-v4-mute md:block">SCROLL TO OPEN THE ISSUE ↓</span>
        </motion.div>
      </div>
    </section>
  );
}

function StaticCover() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="flex items-baseline justify-between border-b border-v4-line px-6 py-4 md:px-12">
        <span className="font-display text-[11px] tracking-[0.32em] text-v4-ink">KM · THE LAB ISSUE</span>
        <span className="font-display text-[10px] tracking-[0.2em] text-v4-amber">№ 26</span>
      </div>
      <div className="relative flex-1">
        <h1 className="absolute left-0 top-[6%] z-0 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter text-v4-ink md:text-[15vw]">{K.lineA}</h1>
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[74vh] w-full max-w-[560px]">
          <Image src="/photos/portrait-cutout.webp" alt="Krishna Madhan" fill priority sizes="560px" className="object-contain object-bottom" />
        </div>
        <h2 className="absolute left-0 top-[38%] z-20 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter text-v4-blue/90 md:text-[15vw]" aria-hidden>{K.lineB}</h2>
      </div>
      <div className="border-t border-v4-line px-6 py-4 md:px-12">
        <CredStrip />
      </div>
    </section>
  );
}

export default function V5() {
  const reduced = useReducedMotion();
  return (
    <KFrame variant={5}>
      {reduced ? <StaticCover /> : <CoverHero />}

      {/* editorial spreads */}
      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">{K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">{K.systems.title}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">{K.systems.intro}</p>
          <div className="mt-10 space-y-5">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} initial={reduced ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
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
