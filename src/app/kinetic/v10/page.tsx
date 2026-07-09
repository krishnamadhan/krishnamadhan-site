"use client";

/**
 * KINETIC V10 — Wildcard: "The Living Room"
 * The most personal direction possible: the portfolio IS a blueprint of the
 * actual Bangalore living room where everything runs. As you scroll, the
 * room draws itself line by line (pathLength), device callouts surface one
 * by one, and at the end the room POWERS ON — the LED strip glows amber,
 * the TV lights, Cosmo's eyes wake. Every labelled device maps to a real
 * system below. Reduced motion: room pre-drawn and lit.
 */
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useReducedMotion, MotionValue } from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ProfessionalBlock, ContactBlock } from "../_shared/ui";

const INK = "#6ab0d8", AMBER = "#e0a458", FAINT = "rgba(236,233,226,0.25)";

function Draw({ d, range, p, stroke = INK, w = 1.6, still }: {
  d: string; range: [number, number]; p: MotionValue<number> | null; stroke?: string; w?: number; still?: boolean;
}) {
  const fallback = useSpring(1);
  const len = useTransform(p ?? fallback, range, [0, 1]);
  if (still || !p) return <path d={d} stroke={stroke} strokeWidth={w} fill="none" strokeLinecap="round" />;
  return <motion.path d={d} style={{ pathLength: len }} stroke={stroke} strokeWidth={w} fill="none" strokeLinecap="round" />;
}

const DEVICES = [
  { id: "tv", label: "TV + AMBILIGHT", desc: "camera-sampled sync lighting", x: 50, y: 14, at: 0.42 },
  { id: "pi", label: "RASPBERRY PI 5", desc: "the whole lab runs here — 24/7", x: 80, y: 33, at: 0.6 },
  { id: "router", label: "WHATSAPP UPLINK", desc: "Banter Agent lives on this link", x: 91.5, y: 47, at: 0.68 },
  { id: "cosmo", label: "COSMO", desc: "robot pet — moods, memory, eyes", x: 18.5, y: 63, at: 0.76 },
  { id: "lamp", label: "WIPRO BULB", desc: "music-mode colour sync", x: 6, y: 50, at: 0.82 },
] as const;

function Room({ p, lit, still }: { p: MotionValue<number> | null; lit: boolean; still?: boolean }) {
  const fallback = useSpring(1);
  const ledLen = useTransform(p ?? fallback, [0.3, 0.52], [0, 1]);
  return (
    <svg viewBox="0 0 1000 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Blueprint of the living-room lab">
      {/* floor + skirting */}
      <Draw p={p} range={[0.02, 0.22]} d="M30 470 H970" stroke={FAINT} w={2} still={still} />
      <Draw p={p} range={[0.06, 0.26]} d="M30 470 V80 M970 470 V80" stroke={FAINT} w={1} still={still} />
      {/* TV */}
      <Draw p={p} range={[0.12, 0.34]} d="M330 120 H670 V310 H330 Z" still={still} />
      <Draw p={p} range={[0.2, 0.36]} d="M470 310 L460 340 H540 L530 310 M430 342 H570" still={still} />
      {/* LED strip around TV — glows when lit */}
      <motion.rect x={316} y={106} width={368} height={218} rx={12} fill="none"
        stroke={lit ? AMBER : INK} strokeWidth={lit ? 2.6 : 1.4}
        style={still || !p ? undefined : { pathLength: ledLen }}
        animate={lit ? { filter: "drop-shadow(0 0 8px rgba(224,164,88,0.9))", opacity: [0.85, 1, 0.85] } : { filter: "none" }}
        transition={lit ? { opacity: { duration: 2.4, repeat: Infinity } } : undefined}
      />
      {/* TV screen fill when lit */}
      {lit && <motion.rect x={336} y={126} width={328} height={178} fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 0.14 }} transition={{ duration: 1 }} />}
      {/* shelf + Pi + router */}
      <Draw p={p} range={[0.4, 0.58]} d="M730 250 H960 M730 345 H960 M745 250 V345 M945 250 V345" stroke={FAINT} w={1.4} still={still} />
      <Draw p={p} range={[0.48, 0.62]} d="M770 222 H845 V250 H770 Z M778 222 V214 M793 222 V214 M808 222 V214 M823 222 V214 M838 222 V214" stroke={lit ? AMBER : INK} still={still} />
      <Draw p={p} range={[0.56, 0.7]} d="M875 228 H930 V250 H875 Z M885 228 L880 205 M920 228 L925 205" still={still} />
      {/* Cosmo */}
      <Draw p={p} range={[0.62, 0.8]} d="M130 400 Q130 385 148 385 H222 Q240 385 240 400 V445 Q240 460 222 460 H148 Q130 460 130 445 Z" still={still} />
      <Draw p={p} range={[0.7, 0.82]} d="M150 462 a12 12 0 1 0 0.1 0 M220 462 a12 12 0 1 0 0.1 0" still={still} />
      {lit ? (
        <>
          <circle cx={168} cy={415} r={7} fill={AMBER} />
          <circle cx={202} cy={415} r={7} fill={AMBER} />
        </>
      ) : (
        <Draw p={p} range={[0.74, 0.84]} d="M161 415 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M195 415 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" still={still} />
      )}
      {/* lamp */}
      <Draw p={p} range={[0.66, 0.82]} d="M62 470 V330" stroke={FAINT} w={1.4} still={still} />
      {lit
        ? <circle cx={62} cy={314} r={15} fill={AMBER} opacity={0.85} />
        : <Draw p={p} range={[0.72, 0.86]} d="M47 314 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0" still={still} />}
      {/* sofa */}
      <Draw p={p} range={[0.5, 0.72]} d="M380 470 V440 Q380 425 395 425 H605 Q620 425 620 440 V470 M380 445 H620" stroke={FAINT} w={1.6} still={still} />
    </svg>
  );
}

export default function V10() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });
  const [prog, setProg] = useState(0);
  useMotionValueEvent(p, "change", (v) => setProg(v));
  const lit = reduced || prog > 0.88;
  const titleOp = useTransform(p, [0, 0.14], [1, 0.25]);

  return (
    <KFrame variant={10}>
      {/* HERO — the room draws itself */}
      <section ref={ref} className={reduced ? "" : "relative h-[380vh]"} aria-label="Hero">
        <div className={reduced ? "flex min-h-screen flex-col px-4 pt-20" : "sticky top-0 flex h-screen flex-col overflow-hidden px-4 pt-20"}>
          <motion.div style={reduced ? undefined : { opacity: titleOp }} className="px-2 md:px-8">
            <Eyebrow tone="amber">BLUEPRINT — 12.97°N 77.59°E · A BANGALORE LIVING ROOM</Eyebrow>
            <h1 className="mt-3 font-display text-[11vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[6vw]">
              {K.lineA} {K.lineB}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-v4-body md:text-[15px]">
              {K.positioning} The lab is real — this is a map of it. {reduced ? "" : "Scroll to draw the room."}
            </p>
            <CredStrip className="mt-4" />
          </motion.div>

          <div className="relative mx-auto w-full max-w-5xl flex-1">
            <Room p={reduced ? null : p} lit={lit} still={!!reduced} />
            {/* device callouts */}
            {DEVICES.map((d) => {
              const on = reduced || prog > d.at;
              return (
                <div key={d.id} style={{ left: `${d.x}%`, top: `${d.y}%` }}
                  className={`absolute -translate-x-1/2 transition-all duration-700 ${on ? "opacity-100" : "translate-y-2 opacity-0"}`}>
                  <span className="relative flex justify-center">
                    <span className={`absolute -top-1 h-2 w-2 rounded-full ${lit ? "bg-v4-amber" : "bg-v4-blue"} ${on && !reduced ? "animate-ping" : ""}`} />
                    <span className={`h-2 w-2 rounded-full ${lit ? "bg-v4-amber" : "bg-v4-blue"}`} />
                  </span>
                  <p className="mt-1.5 whitespace-nowrap text-center font-display text-[9px] tracking-[0.2em] text-v4-ink md:text-[10px]">{d.label}</p>
                  <p className="hidden whitespace-nowrap text-center text-[10px] text-v4-mute md:block">{d.desc}</p>
                </div>
              );
            })}
            {/* power-on banner */}
            <div className={`absolute inset-x-0 bottom-2 text-center transition-opacity duration-700 ${lit ? "opacity-100" : "opacity-0"}`}>
              <span className="rounded-full border border-v4-amber/40 bg-v4-panel px-5 py-2 font-display text-[10px] tracking-[0.3em] text-v4-amber">
                ● ROOM ONLINE — EVERYTHING BELOW RUNS IN IT
              </span>
            </div>
          </div>
          <LabStatus className="justify-center pb-4" />
        </div>
      </section>

      {/* WHAT EACH DEVICE RUNS */}
      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">FROM THE FLOOR PLAN — {K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">What each device runs</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">{K.systems.intro}</p>
          <div className="mt-10 space-y-5">
            {[1, 0, 2].map((i) => (
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
