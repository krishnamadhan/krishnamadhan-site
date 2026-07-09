"use client";

/**
 * KINETIC V6 — Data Pipeline Scroll Machine
 * The page IS a processing system. A luminous spine runs the full length;
 * scrolling pumps data packets down it (motion values only — zero React
 * re-renders in the hot path). Stations hang off the spine — professional
 * ETL stages first, then the lab systems — and each powers on as the flow
 * reaches it. A live flow-meter HUD counts packets processed. Reduced
 * motion: spine static, stations always powered.
 */
import React, { useRef } from "react";
import {
  motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue,
} from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ContactBlock } from "../_shared/ui";

function Packet({ p, lag }: { p: MotionValue<number>; lag: number }) {
  const y = useTransform(p, (v) => `${Math.max(0, Math.min(1, v - lag)) * 100}%`);
  const op = useTransform(p, (v) => (v - lag <= 0.005 || v - lag >= 0.995 ? 0 : 1));
  return (
    <motion.span style={{ top: y, opacity: op }}
      className="absolute left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-v4-amber shadow-[0_0_12px_2px_rgba(224,164,88,0.55)] will-change-[top]" aria-hidden />
  );
}

function Station({ side, label, powered, children }: {
  side: "l" | "r"; label: string; powered: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`relative grid items-center gap-0 md:grid-cols-2`}>
      {/* connector */}
      <div aria-hidden className={`absolute top-1/2 hidden h-px w-[8%] md:block ${side === "l" ? "left-[46%]" : "right-[46%]"} ${powered ? "bg-v4-amber/70" : "bg-v4-line"} transition-colors duration-700`} />
      <div className={`${side === "l" ? "md:col-start-1 md:pr-[12%]" : "md:col-start-2 md:pl-[12%]"} pl-10 md:pl-0`}>
        <p className={`mb-2 font-display text-[10px] tracking-[0.28em] transition-colors duration-500 ${powered ? "text-v4-amber" : "text-v4-mute"}`}>
          {powered ? "● " : "○ "}{label}
        </p>
        <div className={`transition-all duration-700 ${powered ? "opacity-100" : "opacity-40 saturate-50"}`}>{children}</div>
      </div>
    </div>
  );
}

const STAGES = [
  { label: "STAGE 01 · INGEST", capIdx: 0 },
  { label: "STAGE 02 · TRANSFORM", capIdx: 1 },
  { label: "STAGE 03 · QUALITY GATE", capIdx: 5 },
];

export default function V6() {
  const reduced = useReducedMotion();
  const machineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: machineRef, offset: ["start 0.7", "end 0.6"] });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });
  const ink = useTransform(p, [0, 1], ["0%", "100%"]);
  const meter = useTransform(p, (v) => String(Math.floor(v * 47)).padStart(2, "0"));
  const [zone, setZone] = React.useState(reduced ? 99 : -1);
  React.useEffect(() => {
    if (reduced) return;
    const unsub = p.on("change", (v) => setZone(Math.floor(v * 7)));
    return unsub;
  }, [p, reduced]);
  const on = (i: number) => reduced || zone >= i;

  return (
    <KFrame variant={6}>
      {/* HERO — the intake */}
      <section className="flex min-h-[92vh] flex-col justify-center px-6 pt-20 md:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <Eyebrow tone="amber">{K.boot}</Eyebrow>
          <h1 className="mt-5 font-display text-[13vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[7.5vw]">
            {K.lineA} {K.lineB}
          </h1>
          <div className="mt-6 grid gap-6 md:grid-cols-[1.3fr_1fr]">
            <p className="max-w-xl text-[15px] leading-relaxed text-v4-body">{K.concrete}</p>
            <div className="rounded-xl border border-v4-line bg-v4-panel p-4">
              <p className="font-display text-[10px] tracking-[0.25em] text-v4-mute">FLOW METER</p>
              <p className="mt-1 font-display text-3xl text-v4-amber">
                {reduced ? "47" : <motion.span>{meter}</motion.span>}
                <span className="text-sm text-v4-mute"> / 47 packets</span>
              </p>
              <p className="mt-1 text-[11px] text-v4-mute">scroll to run the machine ↓</p>
            </div>
          </div>
          <CredStrip className="mt-7" />
          <LabStatus className="mt-4" />
        </div>
      </section>

      {/* THE MACHINE */}
      <div ref={machineRef} className="relative mx-auto max-w-6xl px-6 pb-24 md:px-12">
        {/* spine */}
        <div aria-hidden className="absolute bottom-0 left-[1.35rem] top-0 w-px bg-v4-line md:left-1/2">
          <motion.div style={{ height: reduced ? "100%" : ink }} className="w-full bg-gradient-to-b from-v4-blue via-v4-blue to-v4-amber" />
          {!reduced && [0, 0.09, 0.18].map((lag) => <Packet key={lag} p={p} lag={lag} />)}
        </div>

        <div className="space-y-24 py-16 md:space-y-32">
          <div className="relative md:text-center">
            <span className="inline-block rounded-full border border-v4-line bg-v4-panel px-5 py-2 font-display text-[11px] tracking-[0.3em] text-v4-blue">
              PROFESSIONAL PIPELINE — JPMORGAN CHASE
            </span>
          </div>

          {STAGES.map((s, i) => {
            const c = K.professional.capabilities[s.capIdx];
            return (
              <Station key={s.label} side={i % 2 ? "r" : "l"} label={s.label} powered={on(i)}>
                <div className="rounded-2xl border border-v4-line bg-v4-panel p-5">
                  <h3 className="font-display text-lg tracking-tight text-v4-ink">{c.cap}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-v4-body">{c.desc}</p>
                </div>
              </Station>
            );
          })}

          <div className="relative md:text-center">
            <span className="inline-block rounded-full border border-v4-line bg-v4-panel px-5 py-2 font-display text-[11px] tracking-[0.3em] text-v4-amber">
              OUTPUT — THE LIVING-ROOM LAB
            </span>
          </div>

          {[0, 1, 2].map((i) => (
            <Station key={i} side={i % 2 ? "l" : "r"} label={`SYSTEM 0${i + 1} · ${K.systems.cards[i].name.toUpperCase()}`} powered={on(3 + i)}>
              <SystemCard i={i} flat />
            </Station>
          ))}
        </div>
      </div>

      <section className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
      </section>
    </KFrame>
  );
}
