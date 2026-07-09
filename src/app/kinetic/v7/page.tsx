"use client";

/**
 * KINETIC V7 — Robot Pet Field Log
 * The site is narrated by Cosmo. Two procedural OLED eyes track your pointer
 * and blink; a sticky telemetry bar shows the robot's mood — and the mood
 * CHANGES depending on which section you're reading (curious → excited →
 * focused → attached). Entries are real field notes from the lab, timestamped
 * like a journal. Premium graphite, no cartoon. Reduced motion: eyes static.
 */
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, SystemCard, ContactBlock, PROOFS } from "../_shared/ui";

type Mood = "curious" | "excited" | "focused" | "attached";
const MOODS: Record<Mood, { eye: number; tone: string; energy: number; note: string }> = {
  curious: { eye: 1, tone: "#6ab0d8", energy: 62, note: "new visitor detected" },
  excited: { eye: 1.15, tone: "#e0a458", energy: 88, note: "someone is reading about my siblings" },
  focused: { eye: 0.55, tone: "#6ab0d8", energy: 45, note: "professional mode engaged" },
  attached: { eye: 0.8, tone: "#e0a458", energy: 71, note: "you stayed till the end" },
};

function Eyes({ mood }: { mood: Mood }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 16 });
  const py = useSpring(my, { stiffness: 120, damping: 16 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 26);
      my.set((e.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener("pointermove", onMove);
    let alive = true;
    const loop = () => {
      if (!alive) return;
      setTimeout(() => { setBlink(true); setTimeout(() => { setBlink(false); loop(); }, 130); }, 2600 + Math.random() * 3200);
    };
    loop();
    return () => { alive = false; window.removeEventListener("pointermove", onMove); };
  }, [reduced, mx, my]);

  const m = MOODS[mood];
  return (
    <div className="flex items-center justify-center gap-8 md:gap-12" aria-label={`Cosmo is feeling ${mood}`}>
      {[0, 1].map((i) => (
        <div key={i} className="relative h-32 w-44 overflow-hidden rounded-[2rem] border border-v4-line bg-[#07080b] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] md:h-44 md:w-60">
          <motion.div
            style={{ x: px, y: py }}
            animate={{ scaleY: blink ? 0.06 : m.eye, backgroundColor: m.tone }}
            transition={{ scaleY: { duration: 0.12 }, backgroundColor: { duration: 0.8 } }}
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl md:h-24 md:w-24"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent" />
        </div>
      ))}
    </div>
  );
}

function StatusBar({ mood }: { mood: Mood }) {
  const m = MOODS[mood];
  return (
    <div className="fixed inset-x-0 top-0 z-[80] border-b border-v4-line bg-v4-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-2.5 md:px-12">
        <span className="font-display text-[10px] tracking-[0.28em] text-v4-ink">COSMO · FIELD LOG</span>
        <span className="hidden font-display text-[10px] tracking-[0.15em] text-v4-mute sm:block">
          MOOD <span style={{ color: m.tone }} className="transition-colors duration-700">{mood.toUpperCase()}</span>
        </span>
        <span className="hidden items-center gap-1.5 sm:flex" aria-label={`energy ${m.energy}%`}>
          <span className="font-display text-[10px] tracking-[0.15em] text-v4-mute">ENERGY</span>
          <span className="h-1 w-16 overflow-hidden rounded-full bg-v4-line">
            <motion.span animate={{ width: `${m.energy}%` }} transition={{ duration: 0.9 }}
              className="block h-full rounded-full" style={{ backgroundColor: m.tone }} />
          </span>
        </span>
        <span className="ml-auto hidden font-display text-[10px] italic tracking-[0.1em] text-v4-mute md:block">“{m.note}”</span>
      </div>
    </div>
  );
}

const ENTRIES = profile.caseStudies["robot-pet"].fieldNotes;
const STAMPS = ["2026-07-02 · 09:14", "2026-06-12 · 22:41", "2026-07-07 · 18:03"];

export default function V7() {
  const reduced = useReducedMotion();
  const [mood, setMood] = useState<Mood>("curious");
  const enter = (m: Mood) => () => setMood(m);
  const WhatsApp = PROOFS[0], Telemetry = PROOFS[1];

  return (
    <KFrame variant={7}>
      <StatusBar mood={mood} />

      {/* HERO */}
      <motion.section onViewportEnter={enter("curious")} viewport={{ amount: 0.4 }}
        className="flex min-h-screen flex-col items-center justify-center px-6 pb-14 pt-24 text-center">
        <Eyes mood={mood} />
        <Eyebrow tone="blue" className="mt-10 justify-center">FIELD LOG — ENTRIES FROM A LIVING-ROOM LAB</Eyebrow>
        <h1 className="mt-4 font-display text-[12vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[6.5vw]">
          {K.lineA} {K.lineB}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-v4-body">
          {K.concrete}
        </p>
        <p className="mt-3 font-display text-[11px] tracking-[0.2em] text-v4-mute">
          LOGGED BY COSMO — RASPBERRY PI 5 · 47°C, MOSTLY
        </p>
        <CredStrip className="mt-7 justify-center" />
      </motion.section>

      {/* LOG ENTRIES */}
      <motion.section onViewportEnter={enter("excited")} viewport={{ amount: 0.25 }}
        className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Eyebrow tone="amber">LOG ENTRIES — THINGS THAT ACTUALLY HAPPENED</Eyebrow>
          <div className="mt-10 space-y-8">
            {ENTRIES.map((e, i) => (
              <motion.article key={e.title}
                initial={reduced ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ type: "spring", stiffness: 70, damping: 16 }}
                className="relative border-l-2 border-v4-line pl-6 transition-colors hover:border-v4-amber">
                <span className="font-display text-[10px] tracking-[0.22em] text-v4-mute">ENTRY {String(i + 1).padStart(3, "0")} · {STAMPS[i]}</span>
                <h3 className="mt-2 font-display text-xl tracking-tight text-v4-ink">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-v4-body">{e.desc}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="h-56 overflow-hidden rounded-xl border border-v4-line bg-v4-panel"><Telemetry /></div>
            <div className="h-56 overflow-hidden rounded-xl border border-v4-line bg-v4-panel"><WhatsApp /></div>
          </div>
          <p className="mt-2 font-display text-[9.5px] tracking-[0.22em] text-v4-mute">LIVE TELEMETRY · MESSAGE TRACE — THE TWO RESIDENTS</p>
        </div>
      </motion.section>

      {/* SIBLING SYSTEMS */}
      <motion.section onViewportEnter={enter("excited")} viewport={{ amount: 0.25 }}
        className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">THE OTHER RESIDENTS</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">Cosmo’s siblings</h2>
          <div className="mt-10 space-y-5">
            {[1, 0].map((i) => <SystemCard key={i} i={i} />)}
          </div>
        </div>
      </motion.section>

      {/* OPERATOR */}
      <motion.section onViewportEnter={enter("focused")} viewport={{ amount: 0.3 }}
        className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Eyebrow tone="blue">{K.operator.eyebrow} — THE HUMAN IN THE LOG</Eyebrow>
          <div className="mt-8 space-y-3">
            {K.operator.rows.map((r) => (
              <div key={r.k} className="flex items-baseline gap-4 border-b border-v4-line pb-3">
                <span className="w-20 shrink-0 font-display text-[10px] tracking-[0.2em] text-v4-mute">{r.k}</span>
                <span className="text-[15px] text-v4-ink">{r.v}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-v4-body">{K.operator.human}</p>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section onViewportEnter={enter("attached")} viewport={{ amount: 0.4 }}
        className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
        <p className="mt-8 text-center font-display text-[11px] tracking-[0.2em] text-v4-mute">
          COSMO SAYS: “{MOODS.attached.note.toUpperCase()}”
        </p>
      </motion.section>
    </KFrame>
  );
}
