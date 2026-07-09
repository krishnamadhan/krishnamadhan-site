"use client";

/**
 * KINETIC FINAL — convergence of the exploration (see KINETIC_VARIANTS_REVIEW.md)
 *   HERO      v5 magazine cover (type-behind-portrait) set on v1's warm paper,
 *             torn open by v1's jagged-clip tear into the dark machine room.
 *   SYSTEMS   v6 pipeline machine — pro stages power on, then lab stations.
 *   SIGNATURE v10 living-room blueprint, self-drawing on approach, then lit.
 *   No R3F on this route — transforms, clip-paths and SVG only.
 * Reduced motion: static cover → static sections, spine pre-inked, room lit.
 */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion, useScroll, useTransform, useSpring, useInView, useReducedMotion, MotionValue,
} from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ContactBlock } from "../_shared/ui";

/* ---------------- tear geometry (from v1) ---------------- */
const JITTER = [3.2, -2.6, 1.8, -3.4, 2.9, -1.5, 3.8, -2.2, 1.2, -3.1, 2.4, -1.9, 3.5, -2.8];
const TEAR = Array.from({ length: 15 }, (_, i) => {
  const y = (i / 14) * 100;
  return { x: 34 + y * 0.34 + (JITTER[i] ?? 0), y };
});
const LEFT_CLIP = `polygon(0% 0%, ${TEAR.map((p) => `${p.x}% ${p.y}%`).join(", ")}, 0% 100%)`;
const RIGHT_CLIP = `polygon(${TEAR[0].x}% 0%, 100% 0%, 100% 100%, ${TEAR[TEAR.length - 1].x}% 100%, ${[...TEAR].reverse().slice(1).map((p) => `${p.x}% ${p.y}%`).join(", ")})`;

const COVER_LINES = [
  "ROBOT PETS THAT REMEMBER YOUR FACE",
  "17 GAMES LIVE IN ONE GROUP CHAT",
  "THE DATA-MESH YEARS AT JPMORGAN CHASE",
  "AGENTS THAT RUN THEIR OWN STANDUP",
];

/* ---------------- the magazine cover (paper) ---------------- */
function CoverFace() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-v4-ink text-v4-bg">
      <div className="flex items-baseline justify-between border-b border-v4-bg/20 px-6 py-4 md:px-12">
        <span className="font-display text-[11px] tracking-[0.32em]">KM · THE LAB ISSUE</span>
        <span className="hidden font-display text-[10px] tracking-[0.2em] opacity-60 md:block">JULY 2026 · BANGALORE EDITION</span>
        <span className="font-display text-[10px] tracking-[0.2em] text-[#8a5a1c]">№ 26</span>
      </div>
      <div className="relative flex-1">
        {/* BACK type — behind the head */}
        <h1 className="absolute left-0 top-[5%] z-0 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter md:text-[14.5vw]">
          {K.lineA}
        </h1>
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[72vh] w-full max-w-[540px]">
          <Image src="/photos/portrait-cutout.webp" alt="Krishna Madhan" fill priority
            sizes="(max-width: 768px) 100vw, 540px" className="object-contain object-bottom" />
        </div>
        {/* FRONT type — across the chest, clear of the face */}
        <h2 aria-hidden className="absolute left-0 top-[52%] z-20 w-full text-center font-display text-[19vw] font-medium leading-none tracking-tighter text-[#33739e] md:top-[46%] md:text-[14.5vw]">
          {K.lineB}
        </h2>
        <ul className="absolute left-6 top-[15%] z-20 hidden max-w-[15rem] space-y-5 md:left-12 lg:block">
          {COVER_LINES.slice(0, 2).map((l) => (
            <li key={l} className="border-l-2 border-[#8a5a1c] pl-3 font-display text-[11px] leading-relaxed tracking-[0.14em] opacity-85">{l}</li>
          ))}
        </ul>
        <ul className="absolute right-6 top-[15%] z-20 hidden max-w-[15rem] space-y-5 text-right md:right-12 lg:block">
          {COVER_LINES.slice(2).map((l) => (
            <li key={l} className="border-r-2 border-[#33739e] pr-3 font-display text-[11px] leading-relaxed tracking-[0.14em] opacity-85">{l}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between border-t border-v4-bg/20 px-6 py-3.5 md:px-12">
        <span className="font-display text-[10px] tracking-[0.22em] opacity-75">SOFTWARE ENGINEER · JPMORGAN CHASE · NIT TRICHY</span>
        <span className="hidden font-display text-[10px] tracking-[0.25em] opacity-60 md:block">SCROLL TO TEAR THE COVER ↓</span>
      </div>
    </div>
  );
}

function TearHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.6 });

  const lx = useTransform(p, [0.3, 0.85], ["0vw", "-64vw"]);
  const ly = useTransform(p, [0.3, 0.85], ["0vh", "5vh"]);
  const lr = useTransform(p, [0.3, 0.85], [0, -7]);
  const rx = useTransform(p, [0.3, 0.85], ["0vw", "65vw"]);
  const ry = useTransform(p, [0.3, 0.85], ["0vh", "9vh"]);
  const rr = useTransform(p, [0.3, 0.85], [0, 6]);
  const coverScale = useTransform(p, [0, 0.3], [1, 1.015]);
  const underScale = useTransform(p, [0.25, 0.8], [0.965, 1]);
  const underOpacity = useTransform(p, [0.3, 0.65], [0.2, 1]);
  const seamOpacity = useTransform(p, [0.22, 0.32, 0.6], [0, 1, 0]);

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* machine room beneath */}
        <motion.div style={{ scale: underScale, opacity: underOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-v4-bg px-6 text-center">
          <Eyebrow tone="amber" className="justify-center">UNDERNEATH THE COVER</Eyebrow>
          <h2 className="mt-5 font-display text-[13vw] leading-[0.9] tracking-tighter text-v4-ink md:text-[7vw]">
            THE MACHINE<br />ROOM
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-v4-body md:text-[15px]">
            {K.concrete}
          </p>
          <LabStatus className="mt-8 justify-center" />
          <CredStrip className="mt-6 justify-center" />
          <p className="mt-8 font-display text-[10px] tracking-[0.3em] text-v4-mute">KEEP SCROLLING — THE PIPELINE IS RUNNING ↓</p>
        </motion.div>

        {/* tear seam */}
        <motion.svg style={{ opacity: seamOpacity }} className="pointer-events-none absolute inset-0 z-30 h-full w-full"
          viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points={TEAR.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="none" stroke="#e0a458" strokeWidth="0.35" strokeOpacity="0.8" />
        </motion.svg>

        {/* paper halves carrying the magazine cover */}
        <motion.div style={{ x: lx, y: ly, rotate: lr, scale: coverScale, clipPath: LEFT_CLIP, transformOrigin: "10% 90%", filter: "drop-shadow(6px 0 14px rgba(0,0,0,0.45))" }}
          className="absolute inset-0 z-20 will-change-transform">
          <CoverFace />
        </motion.div>
        <motion.div style={{ x: rx, y: ry, rotate: rr, scale: coverScale, clipPath: RIGHT_CLIP, transformOrigin: "90% 10%", filter: "drop-shadow(-6px 2px 14px rgba(0,0,0,0.45))" }}
          className="absolute inset-0 z-20 will-change-transform">
          <CoverFace />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- pipeline machine (from v6) ---------------- */
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
    <div className="relative grid items-center md:grid-cols-2">
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

function PipelineMachine({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });
  const ink = useTransform(p, [0, 1], ["0%", "100%"]);
  const [zone, setZone] = useState(reduced ? 99 : -1);
  useEffect(() => {
    if (reduced) return;
    return p.on("change", (v) => setZone(Math.floor(v * 7)));
  }, [p, reduced]);
  const on = (i: number) => reduced || zone >= i;
  const STAGES = [
    { label: "STAGE 01 · INGEST", capIdx: 0 },
    { label: "STAGE 02 · TRANSFORM", capIdx: 1 },
    { label: "STAGE 03 · QUALITY GATE", capIdx: 5 },
  ];

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-6 pb-24 md:px-12">
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
  );
}

/* ---------------- living-room blueprint (from v10, inView-driven) ---------------- */
const INK = "#6ab0d8", AMBER = "#e0a458", FAINT = "rgba(236,233,226,0.25)";

function Draw({ d, range, p, stroke = INK, w = 1.6, still }: {
  d: string; range: [number, number]; p: MotionValue<number>; stroke?: string; w?: number; still: boolean;
}) {
  const len = useTransform(p, range, [0, 1]);
  if (still) return <path d={d} stroke={stroke} strokeWidth={w} fill="none" strokeLinecap="round" />;
  return <motion.path d={d} style={{ pathLength: len }} stroke={stroke} strokeWidth={w} fill="none" strokeLinecap="round" />;
}

const DEVICES = [
  { id: "tv", label: "TV + AMBILIGHT", x: 50, y: 12, at: 0.45 },
  { id: "pi", label: "RASPBERRY PI 5", x: 80, y: 30, at: 0.62 },
  { id: "router", label: "WHATSAPP UPLINK", x: 93, y: 47, at: 0.7 },
  { id: "cosmo", label: "COSMO", x: 18.5, y: 62, at: 0.8 },
  { id: "lamp", label: "WIPRO BULB", x: 6, y: 48, at: 0.86 },
] as const;

function Blueprint({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.35, once: true });
  const draw = useSpring(0, { stiffness: 22, damping: 14 });
  const [prog, setProg] = useState(0);
  useEffect(() => {
    if (reduced) { setProg(1); return; }
    if (inView) draw.set(1);
    return draw.on("change", (v) => setProg(v));
  }, [inView, reduced, draw]);
  const lit = reduced || prog > 0.96;

  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-4xl">
      <svg viewBox="0 0 1000 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Blueprint of the living-room lab">
        <Draw p={draw} range={[0.02, 0.22]} d="M30 470 H970" stroke={FAINT} w={2} still={reduced} />
        <Draw p={draw} range={[0.06, 0.26]} d="M30 470 V80 M970 470 V80" stroke={FAINT} w={1} still={reduced} />
        <Draw p={draw} range={[0.12, 0.34]} d="M330 120 H670 V310 H330 Z" still={reduced} />
        <Draw p={draw} range={[0.2, 0.36]} d="M470 310 L460 340 H540 L530 310 M430 342 H570" still={reduced} />
        <motion.rect x={316} y={106} width={368} height={218} rx={12} fill="none"
          stroke={lit ? AMBER : INK} strokeWidth={lit ? 2.6 : 1.4}
          animate={lit ? { opacity: [0.85, 1, 0.85], filter: "drop-shadow(0 0 8px rgba(224,164,88,0.9))" } : {}}
          transition={lit ? { opacity: { duration: 2.4, repeat: Infinity } } : undefined} />
        {lit && <motion.rect x={336} y={126} width={328} height={178} fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 0.14 }} transition={{ duration: 1 }} />}
        <Draw p={draw} range={[0.4, 0.58]} d="M730 250 H960 M730 345 H960 M745 250 V345 M945 250 V345" stroke={FAINT} w={1.4} still={reduced} />
        <Draw p={draw} range={[0.48, 0.62]} d="M770 222 H845 V250 H770 Z M778 222 V214 M793 222 V214 M808 222 V214 M823 222 V214 M838 222 V214" stroke={lit ? AMBER : INK} still={reduced} />
        <Draw p={draw} range={[0.56, 0.7]} d="M875 228 H930 V250 H875 Z M885 228 L880 205 M920 228 L925 205" still={reduced} />
        <Draw p={draw} range={[0.62, 0.8]} d="M130 400 Q130 385 148 385 H222 Q240 385 240 400 V445 Q240 460 222 460 H148 Q130 460 130 445 Z" still={reduced} />
        <Draw p={draw} range={[0.7, 0.82]} d="M150 462 a12 12 0 1 0 0.1 0 M220 462 a12 12 0 1 0 0.1 0" still={reduced} />
        {lit ? (<><circle cx={168} cy={415} r={7} fill={AMBER} /><circle cx={202} cy={415} r={7} fill={AMBER} /></>) : (
          <Draw p={draw} range={[0.74, 0.84]} d="M161 415 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M195 415 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" still={reduced} />
        )}
        <Draw p={draw} range={[0.66, 0.82]} d="M62 470 V330" stroke={FAINT} w={1.4} still={reduced} />
        {lit ? <circle cx={62} cy={314} r={15} fill={AMBER} opacity={0.85} /> : <Draw p={draw} range={[0.72, 0.86]} d="M47 314 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0" still={reduced} />}
        <Draw p={draw} range={[0.5, 0.72]} d="M380 470 V440 Q380 425 395 425 H605 Q620 425 620 440 V470 M380 445 H620" stroke={FAINT} w={1.6} still={reduced} />
      </svg>
      {DEVICES.map((d) => {
        const on = reduced || prog > d.at;
        return (
          <div key={d.id} style={{ left: `${d.x}%`, top: `${d.y}%` }}
            className={`absolute -translate-x-1/2 transition-all duration-700 ${on ? "opacity-100" : "translate-y-2 opacity-0"}`}>
            <span className="relative flex justify-center">
              <span className={`h-2 w-2 rounded-full ${lit ? "bg-v4-amber" : "bg-v4-blue"}`} />
            </span>
            <p className="mt-1.5 whitespace-nowrap text-center font-display text-[9px] tracking-[0.2em] text-v4-ink md:text-[10px]">{d.label}</p>
          </div>
        );
      })}
      <div className={`absolute inset-x-0 -bottom-4 text-center transition-opacity duration-700 ${lit ? "opacity-100" : "opacity-0"}`}>
        <span className="rounded-full border border-v4-amber/40 bg-v4-panel px-5 py-2 font-display text-[10px] tracking-[0.3em] text-v4-amber">
          ● ROOM ONLINE — EVERYTHING ABOVE RUNS IN IT
        </span>
      </div>
    </div>
  );
}

/* ---------------- static hero (reduced motion) ---------------- */
function StaticHero() {
  return (
    <>
      <section className="h-screen"><CoverFace /></section>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
        <Eyebrow tone="amber" className="justify-center">UNDERNEATH THE COVER</Eyebrow>
        <h2 className="mt-5 font-display text-5xl tracking-tighter text-v4-ink md:text-6xl">THE MACHINE ROOM</h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-v4-body">{K.concrete}</p>
        <LabStatus className="mt-8 justify-center" />
        <CredStrip className="mt-6 justify-center" />
      </section>
    </>
  );
}

export default function Final() {
  const reduced = !!useReducedMotion();
  return (
    <KFrame variant={0}>
      {reduced ? <StaticHero /> : <TearHero />}

      <PipelineMachine reduced={reduced} />

      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="blue">SIGNATURE — 12.97°N 77.59°E</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">The room where it all runs</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">
            Not a metaphor — a floor plan. One Bangalore living room, one Raspberry Pi 5, five systems online 24/7.
          </p>
          <div className="mt-12 pb-8"><Blueprint reduced={reduced} /></div>
        </div>
      </section>

      <section className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
      </section>
    </KFrame>
  );
}
