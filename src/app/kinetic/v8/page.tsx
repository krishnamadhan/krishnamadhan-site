"use client";

/**
 * KINETIC V8 — OS Window Physics (KM·OS)
 * Six app windows float scattered across the desktop, gently adrift. Scroll
 * docks them — every window glides on its own spring path into a tidy grid.
 * Each is draggable with real momentum (flick one, it coasts and settles).
 * Menu bar carries live lab status. Elegant chrome, no terminal cosplay.
 * Mobile & reduced motion: windows render pre-docked.
 */
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from "framer-motion";
import { K, IDENTITY } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, SystemCard, ProfessionalBlock, ContactBlock, PROOFS } from "../_shared/ui";
import { useIsMobile } from "../_shared/three";

type Win = { title: string; scatter: [number, number, number]; dock: [number, number]; body: React.ReactNode };

function windows(): Win[] {
  const WhatsApp = PROOFS[0], Telemetry = PROOFS[1], Arch = PROOFS[4];
  return [
    {
      title: "identity.app",
      scatter: [8, 14, -5], dock: [3, 10],
      body: (
        <div className="flex gap-3 p-4">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md">
            <Image src="/photos/portrait-mono.webp" alt="Krishna Madhan" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <p className="font-display text-base leading-tight text-v4-ink">{K.lineA} {K.lineB}</p>
            <p className="mt-1 text-[11px] leading-snug text-v4-body">SWE · JPMorgan Chase<br />B.Tech · NIT Trichy</p>
          </div>
        </div>
      ),
    },
    { title: "banter.trace", scatter: [55, 6, 4], dock: [36, 10], body: <div className="h-44"><WhatsApp /></div> },
    { title: "cosmo.telemetry", scatter: [70, 48, -3], dock: [69, 10], body: <div className="h-44"><Telemetry /></div> },
    { title: "stack.map", scatter: [12, 58, 3], dock: [3, 55], body: <div className="h-44"><Arch /></div> },
    {
      title: "career.log",
      scatter: [40, 34, -2], dock: [36, 55],
      body: (
        <ul className="space-y-1.5 p-4">
          {K.professional.timeline.map((t) => (
            <li key={t.era} className="flex gap-3 text-[11px] leading-snug">
              <span className="w-14 shrink-0 font-display tracking-wide text-v4-amber">{t.era}</span>
              <span className="text-v4-body">{t.title}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "contact.sh",
      scatter: [78, 22, 6], dock: [69, 55],
      body: (
        <div className="p-4">
          <p className="font-display text-[11px] text-v4-mute">$ open a conversation</p>
          <a href={`mailto:${K.contact.email}`} className="mt-2 inline-block rounded-lg bg-v4-ink px-4 py-2 font-display text-xs text-v4-bg">
            {K.contact.email}
          </a>
        </div>
      ),
    },
  ];
}

function OSWindow({ w, p, i }: { w: Win; p: MotionValue<number>; i: number }) {
  const range: [number, number] = [0.08 + i * 0.05, 0.55 + i * 0.05];
  const left = useTransform(p, range, [`${w.scatter[0]}%`, `${w.dock[0]}%`]);
  const top = useTransform(p, range, [`${w.scatter[1]}%`, `${w.dock[1]}%`]);
  const rot = useTransform(p, range, [w.scatter[2], 0]);
  return (
    <motion.div style={{ left, top, rotate: rot }} className="absolute w-[28%] min-w-[240px] will-change-transform">
      <motion.div
        drag dragMomentum dragElastic={0.18}
        dragTransition={{ power: 0.25, timeConstant: 180 }}
        whileDrag={{ scale: 1.03, zIndex: 50, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
        className="cursor-grab overflow-hidden rounded-xl border border-v4-line bg-v4-panel shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 border-b border-v4-line bg-v4-raised px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-v4-mute/40" />
            <span className="h-2 w-2 rounded-full bg-v4-mute/40" />
            <span className="h-2 w-2 rounded-full bg-v4-amber/70" />
          </span>
          <span className="font-display text-[10px] tracking-[0.18em] text-v4-body">{w.title}</span>
        </div>
        {w.body}
      </motion.div>
    </motion.div>
  );
}

export default function V8() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 19 });
  const heroCopyOp = useTransform(p, [0, 0.25], [1, 0]);
  const dockLabelOp = useTransform(p, [0.6, 0.8], [0, 1]);
  const flat = reduced || isMobile;
  const wins = windows();

  return (
    <KFrame variant={8}>
      {/* menu bar */}
      <div className="fixed inset-x-0 top-0 z-[80] border-b border-v4-line bg-v4-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-2">
          <span className="font-display text-[11px] tracking-[0.25em] text-v4-ink">KM·OS 26.7</span>
          <span className="hidden font-display text-[10px] tracking-[0.12em] text-v4-mute md:block">
            {K.live.map((s) => `${s.k}: ${s.v}`).join("  ·  ")}
          </span>
          <span className="ml-auto font-display text-[10px] tracking-[0.2em] text-v4-amber">● ONLINE</span>
        </div>
      </div>

      {flat ? (
        /* pre-docked static desktop */
        <section className="px-5 pb-10 pt-20">
          <div className="mx-auto max-w-2xl">
            <Eyebrow tone="amber">{K.boot}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[0.95] tracking-tighter text-v4-ink">{K.lineA}<br />{K.lineB}</h1>
            <p className="mt-4 text-sm leading-relaxed text-v4-body">{K.concrete}</p>
            <CredStrip className="mt-6" />
            <div className="mt-8 space-y-4">
              {wins.map((w) => (
                <div key={w.title} className="overflow-hidden rounded-xl border border-v4-line bg-v4-panel">
                  <div className="border-b border-v4-line bg-v4-raised px-3 py-2 font-display text-[10px] tracking-[0.18em] text-v4-body">{w.title}</div>
                  {w.body}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section ref={ref} className="relative h-[300vh]" aria-label="Hero desktop">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* desktop wallpaper name */}
            <motion.div style={{ opacity: heroCopyOp }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h1 className="font-display text-[10vw] font-medium leading-[0.9] tracking-tighter text-v4-ink/[0.16]">{K.lineA}<br />{K.lineB}</h1>
              <p className="mt-4 max-w-md text-sm text-v4-mute">{K.positioning}</p>
              <p className="mt-6 font-display text-[10px] tracking-[0.3em] text-v4-mute">SCROLL TO DOCK · DRAG ANY WINDOW</p>
            </motion.div>
            <motion.p style={{ opacity: dockLabelOp }} className="absolute inset-x-0 top-16 z-0 text-center font-display text-[10px] tracking-[0.3em] text-v4-mute">
              WORKSPACE DOCKED — THE LAB AT A GLANCE
            </motion.p>
            {wins.map((w, i) => <OSWindow key={w.title} w={w} p={p} i={i} />)}
          </div>
        </section>
      )}

      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">{K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">Open in full screen</h2>
          <div className="mt-10 space-y-5">
            {[0, 1].map((i) => <SystemCard key={i} i={i} />)}
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
