"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── section reveal wrapper ── */
export function Reveal({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── numbered section heading with beam ── */
export function SectionHeading({ idx, children }: { idx: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="font-display text-3xl md:text-5xl font-bold flex items-center gap-4 mb-12">
        <span className="text-cyan text-sm tracking-[0.3em] font-normal">{idx}</span>
        {children}
        <span className="beam flex-1" />
      </h2>
    </Reveal>
  );
}

/* ── magnetic CTA button ── */
export function Magnetic({
  children, href, primary = false,
}: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.28,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      className={
        primary
          ? "inline-block rounded-full px-8 py-3.5 font-semibold text-void bg-gradient-to-r from-cyan to-violet shadow-[0_12px_45px_-10px_rgba(75,225,255,.55)] hover:shadow-[0_18px_60px_-10px_rgba(157,107,255,.65)] transition-shadow"
          : "inline-block rounded-full px-8 py-3.5 font-medium text-ink glass hover:border-cyan/50 transition-colors"
      }
    >
      {children}
    </motion.a>
  );
}

/* ── top scroll progress + HUD readout ── */
export function ScrollHUD() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
    return () => unsub();
  }, [scrollYProgress]);
  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-gradient-to-r from-cyan via-violet to-rose"
      />
      <div className="fixed bottom-5 right-5 z-50 hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-[0.25em] text-dim/70 pointer-events-none">
        <span>SYS.ONLINE</span>
        <span className="text-cyan">{String(pct).padStart(3, "0")}% TRAVERSED</span>
      </div>
    </>
  );
}

/* ── cursor glow (desktop) ── */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <div id="cursor-glow" ref={ref} aria-hidden />;
}

/* ── keyword marquee divider ── */
export function Marquee({ words }: { words: readonly string[] }) {
  const row = (key: string) => (
    <div key={key} className="marquee-track" aria-hidden={key === "b"}>
      {words.map((w, i) => (
        <span key={i} className="font-display text-sm tracking-[0.35em] uppercase text-dim/50 whitespace-nowrap">
          {w} <span className="text-cyan/60 mx-3">✦</span>
        </span>
      ))}
    </div>
  );
  return <div className="marquee py-8 border-y border-white/5">{row("a")}{row("b")}</div>;
}

/* ── 3D tilt card ── */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [t, setT] = useState({ rx: 0, ry: 0 });
  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({
      ry: ((e.clientX - r.left) / r.width - 0.5) * 10,
      rx: -((e.clientY - r.top) / r.height - 0.5) * 10,
    });
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setT({ rx: 0, ry: 0 })}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
