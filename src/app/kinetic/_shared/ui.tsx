"use client";

/**
 * Shared chrome + primitives for /kinetic variants. Palette = v4 tokens only.
 * KFrame: fixed switcher nav + footer + Lenis smooth scroll (desktop, motion-ok).
 */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { K, VARIANTS, IDENTITY } from "./content";
import {
  WhatsAppTrace, RobotTelemetry, LiveLeaderboard, AuctionBoard, ArchitectureGrid,
} from "@/app/v5/proof";

export const PROOFS = [WhatsAppTrace, RobotTelemetry, LiveLeaderboard, AuctionBoard, ArchitectureGrid];

/** Smooth scroll via Lenis — skipped on touch devices & reduced motion. */
function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ lerp: 0.12 });
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { alive = false; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, [enabled]);
}

export function KFrame({
  variant, children, lenis = true,
}: { variant: number; children: React.ReactNode; lenis?: boolean }) {
  const reduced = useReducedMotion();
  useLenis(lenis && !reduced);
  const [open, setOpen] = useState(false);
  const v = VARIANTS[variant - 1];
  return (
    <div className="min-h-screen bg-v4-bg font-body text-v4-ink antialiased">
      {/* variant switcher — fixed, unobtrusive */}
      <div className="fixed right-3 top-3 z-[90] flex flex-col items-end gap-1.5">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-v4-line bg-v4-panel/85 px-3.5 py-1.5 font-display text-[11px] tracking-[0.14em] text-v4-body backdrop-blur transition-colors hover:text-v4-ink"
          aria-expanded={open}
        >
          KINETIC {String(variant).padStart(2, "0")} · {v?.name.toUpperCase() ?? "FINAL"}
        </button>
        {open && (
          <nav className="flex flex-col gap-px overflow-hidden rounded-xl border border-v4-line bg-v4-panel/95 backdrop-blur" aria-label="Variant switcher">
            {VARIANTS.map((x) => (
              <Link key={x.slug} href={`/kinetic/${x.slug}`} onClick={() => setOpen(false)}
                className={`px-3.5 py-1.5 text-[11px] tracking-wide transition-colors hover:bg-v4-raised ${x.n === variant ? "text-v4-amber" : "text-v4-body"}`}>
                {String(x.n).padStart(2, "0")} {x.name}
              </Link>
            ))}
            <Link href="/kinetic/final" onClick={() => setOpen(false)}
              className="border-t border-v4-line px-3.5 py-1.5 text-[11px] tracking-wide text-v4-blue hover:bg-v4-raised">
              ★ Final
            </Link>
            <Link href="/kinetic" onClick={() => setOpen(false)}
              className="px-3.5 py-1.5 text-[11px] tracking-wide text-v4-mute hover:bg-v4-raised">
              Index
            </Link>
          </nav>
        )}
      </div>
      {children}
      <KFooter />
    </div>
  );
}

export function KFooter() {
  return (
    <footer className="border-t border-v4-line px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-xs tracking-[0.18em] text-v4-mute">{K.footerSignoff}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {K.contact.socials.map((s) => (
            <a key={s.label} href={s.href} className="text-xs text-v4-body underline-offset-4 transition-colors hover:text-v4-ink hover:underline"
              {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** Mono eyebrow label with rule. */
export function Eyebrow({ children, tone = "mute", className = "" }: { children: React.ReactNode; tone?: "mute" | "blue" | "amber"; className?: string }) {
  const c = tone === "blue" ? "text-v4-blue" : tone === "amber" ? "text-v4-amber" : "text-v4-mute";
  return (
    <p className={`flex items-center gap-3 font-display text-[11px] tracking-[0.28em] ${c} ${className}`}>
      <span className="inline-block h-px w-8 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

/** Identity credibility strip — the 5-second facts. */
export function CredStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-1.5 ${className}`}>
      {IDENTITY.map((f) => (
        <li key={f} className="font-display text-[10.5px] tracking-[0.14em] text-v4-mute md:text-[11px]">
          <span className="mr-1.5 text-v4-amber" aria-hidden>▪</span>{f}
        </li>
      ))}
    </ul>
  );
}

/** Live lab status pills. */
export function LabStatus({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      <span className="flex items-center gap-1.5 font-display text-[10px] tracking-[0.2em] text-v4-amber">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-v4-amber/60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-v4-amber" />
        </span>
        {K.liveLabel}
      </span>
      {K.live.map((s) => (
        <span key={s.k} className="font-display text-[10px] tracking-[0.12em] text-v4-mute">
          {s.k}<span className="text-v4-blue"> {s.v}</span>
        </span>
      ))}
    </div>
  );
}

/** One systems card with its live proof module. */
export function SystemCard({ i, flat = false }: { i: number; flat?: boolean }) {
  const c = K.systems.cards[i];
  const Proof = PROOFS[i];
  return (
    <article className={`group grid gap-5 rounded-2xl border border-v4-line bg-v4-panel p-5 md:grid-cols-[1.15fr_1fr] md:p-6 ${flat ? "" : "transition-transform duration-300 hover:-translate-y-1"}`}>
      <div className="flex flex-col">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-display text-xs tracking-[0.25em] text-v4-mute">{c.n}</span>
          <span className={`font-display text-[10px] tracking-[0.2em] ${c.status === "LIVE" ? "text-v4-amber" : "text-v4-blue"}`}>● {c.status}</span>
        </div>
        <h3 className="font-display text-xl tracking-tight text-v4-ink md:text-2xl">{c.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-v4-body">{c.what}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-v4-mute">{c.why}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {c.stack.map((t) => (
            <span key={t} className="rounded-full border border-v4-line px-2.5 py-0.5 font-display text-[10px] tracking-wide text-v4-body">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex min-h-[180px] flex-col">
        <div className="relative flex-1 overflow-hidden rounded-xl border border-v4-line bg-v4-bg">
          <Proof />
        </div>
        <p className="mt-2 font-display text-[9.5px] tracking-[0.22em] text-v4-mute">{K.proofCaptions[i]}</p>
      </div>
    </article>
  );
}

/** Professional credibility block (JPMC capabilities) — compact. */
export function ProfessionalBlock() {
  const p = K.professional;
  return (
    <div>
      <Eyebrow tone="blue">{p.label}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">{p.title}</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">{p.intro}</p>
      <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-v4-line bg-v4-line sm:grid-cols-2 lg:grid-cols-3">
        {p.capabilities.slice(0, 6).map((c) => (
          <div key={c.cap} className="bg-v4-panel p-5">
            <h3 className="font-display text-sm tracking-wide text-v4-ink">{c.cap}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-v4-mute">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Contact block. */
export function ContactBlock() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow tone="amber" className="justify-center">{K.contact.label}</Eyebrow>
      <h2 className="mt-5 font-display text-3xl leading-tight tracking-tight text-v4-ink md:text-5xl">{K.contact.heading}</h2>
      <a href={`mailto:${K.contact.email}`}
        className="mt-8 inline-block rounded-full bg-v4-ink px-8 py-3.5 font-display text-sm tracking-[0.12em] text-v4-bg transition-transform hover:scale-[1.03]">
        {K.contact.email}
      </a>
    </div>
  );
}
