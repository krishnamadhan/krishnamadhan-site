"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS, sceneStore } from "@/lib/sceneChapters";

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

/* ── numbered section heading with module label ── */
export function SectionHeading({
  idx, label, accent = "cyan", children,
}: { idx: string; label?: string; accent?: "cyan" | "amber"; children: React.ReactNode }) {
  const c = accent === "amber" ? "text-amber" : "text-cyan";
  return (
    <Reveal>
      {label && <p className={`module-label mb-3 ${accent === "amber" ? "!text-amber/70" : ""}`}>{label}</p>}
      <h2 className="font-display text-4xl md:text-6xl font-bold flex items-center gap-5 mb-12 tracking-tight">
        <span className={`${c} text-sm tracking-[0.3em] font-normal`}>{idx}</span>
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

/* ── Lenis smooth scroll (respects reduced motion) ── */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | undefined;
    let raf = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const loop = (time: number) => { lenis!.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}

/* ── ⌘K command palette ── */
const PALETTE = [
  { label: "Go: About", href: "#about" },
  { label: "Go: Systems Map", href: "#work" },
  { label: "Go: Lab Modules", href: "#projects" },
  { label: "Go: Trajectory", href: "#timeline" },
  { label: "Go: Stack", href: "#skills" },
  { label: "Go: Field Log", href: "#offduty" },
  { label: "Go: Contact", href: "#contact" },
  { label: "Action: Say hello (email)", href: "mailto:hello@krishnamadhan.com" },
  { label: "Action: Back to top", href: "#top" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = PALETTE.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => !o); setQ(""); setSel(0);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else window.location.href = href;
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-5 left-5 z-50 hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 text-[11px] text-dim hover:text-cyan hover:border-cyan/40 transition-colors"
      aria-label="Open command palette"
    >
      <span className="font-mono">⌘K</span> command
    </button>
  );

  return (
    <div className="fixed inset-0 z-[70] grid place-items-start justify-center pt-[18vh] bg-void/70 backdrop-blur-sm"
         onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="w-[min(560px,92vw)] glass rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef} value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && hits[sel]) go(hits[sel].href);
          }}
          placeholder="Type a command or section…"
          className="w-full bg-transparent px-5 py-4 text-ink placeholder:text-dim/60 outline-none border-b border-white/10"
        />
        <ul className="max-h-72 overflow-y-auto py-2" role="listbox">
          {hits.map((h, i) => (
            <li key={h.label} role="option" aria-selected={i === sel}>
              <button
                onClick={() => go(h.href)} onMouseEnter={() => setSel(i)}
                className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${i === sel ? "bg-cyan/10 text-cyan" : "text-dim"}`}
              >
                {h.label}
              </button>
            </li>
          ))}
          {!hits.length && <li className="px-5 py-3 text-sm text-dim/60">No matches.</li>}
        </ul>
        <div className="px-5 py-2.5 border-t border-white/10 font-mono text-[9px] tracking-[0.2em] text-dim/50 uppercase">
          ↑↓ navigate · ↵ go · esc close
        </div>
      </div>
    </div>
  );
}

/* ── kinetic masked text reveal (words) ── */
export function KineticText({ children, className = "", delay = 0 }:
  { children: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;
  return (
    <span className={className} aria-label={children}>
      {children.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {w}
          </motion.span>
          {i < children.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ── chapter HUD: live readout of the scene state ── */
export function ChapterHUD() {
  const [label, setLabel] = useState(CHAPTERS[0].label);
  useEffect(() => {
    const fn = () => setLabel(CHAPTERS[sceneStore.chapterIndex].label);
    sceneStore.listeners.add(fn);
    return () => { sceneStore.listeners.delete(fn); };
  }, []);
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 hidden lg:block pointer-events-none">
      <span className="module-label bg-void/60 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
