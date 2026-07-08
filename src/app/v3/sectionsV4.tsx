"use client";

/**
 * v4 "Premium Kinetic Editorial" — /v3 route sections.
 *
 * Self-contained: all motion helpers are local so this file never depends on
 * the neon-styled ui.tsx (which the live "/" page still imports). Palette is
 * the v4 graphite/off-white/blue/amber system from tailwind + globals.css.
 */

import {
  motion, useReducedMotion, useScroll, useTransform, useSpring, MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/content/profile";

const v4 = profile.v4;

/* ══════════════ local motion helpers ══════════════ */

/** fade + rise, once, in-view */
function Reveal({
  children, delay = 0, y = 16, className = "",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** word-by-word clip-rise reveal for section titles */
function KineticTitle({ children, className = "" }: { children: string; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;
  const words = children.split(" ");
  return (
    <motion.span
      className={className}
      aria-label={children}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, show: { y: 0 } }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

/** magnetic wrapper — pulls any interactive element toward the pointer */
function Magnetic({
  children, href, className = "", strength = 0.28, external = false,
}: { children: React.ReactNode; href: string; className?: string; strength?: number; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
    });
  };
  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/** section heading: micro-label + big kinetic title, with slow parallax drift */
function SectionHead({
  label, title, intro, progress,
}: { label: string; title: string; intro?: string; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const drift = useTransform(progress, [0, 1], [20, -20]);
  return (
    <div className="mb-14">
      <Reveal><p className="v4-mlabel mb-4">{label}</p></Reveal>
      <motion.h2
        style={reduced ? {} : { y: drift }}
        className="v4-display text-[clamp(2.2rem,5vw,4rem)] text-v4-ink max-w-[16ch]"
      >
        <KineticTitle>{title}</KineticTitle>
      </motion.h2>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-v4-body">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ══════════════ NAV ══════════════ */

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-v4-bg/80 backdrop-blur-md border-b border-v4-line" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="v4-mono text-[13px] tracking-[0.18em] text-v4-ink">
          KM<span className="text-v4-amber">·</span>OS
        </a>
        <ul className="hidden md:flex items-center gap-7">
          {v4.nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="text-[13px] text-v4-body hover:text-v4-ink transition-colors">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <Magnetic href="#contact" className="v4-mono text-[12px] tracking-[0.14em] text-v4-bg bg-v4-ink rounded-full px-4 py-2 hidden sm:inline-block">
          {">_"} SAY HELLO
        </Magnetic>
      </nav>
      <p className="mx-auto max-w-6xl px-5 md:px-8 pb-2 v4-mono text-[10px] tracking-[0.1em] text-v4-mute hidden md:block">
        {v4.boot}
      </p>
    </header>
  );
}

/* ══════════════ HERO ══════════════ */

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // v4.1 portrait scroll reaction — calmer: presence first, motion second.
  // rest pose is 0° (face toward viewer on load), full opacity until 0.75.
  const rotY = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const pY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const pScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);
  const pOpacity = useTransform(scrollYProgress, [0, 0.75, 1.1], [1, 1, 0]);

  // desktop pointer parallax ±6px
  const px = useSpring(0, { stiffness: 120, damping: 20 });
  const py = useSpring(0, { stiffness: 120, damping: 20 });
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 12);
      py.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  const cardTone = (t: string) =>
    t === "amber" ? "v4-led" : t === "blue" ? "v4-led v4-led-blue" : "v4-led v4-led-blue";

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-end md:items-center">
      {/* MOBILE portrait — portrait-first: top-right under the nav, face fully
          visible in the first screen. Sits behind the name/copy (z-0). The
          scrim below covers only the TEXT band, never his face. */}
      <motion.div
        style={reduced ? {} : { x: px, y: py }}
        className="md:hidden pointer-events-none absolute z-0 right-0 top-14
                   h-[48vh] flex items-start justify-end"
        aria-hidden
      >
        <motion.div
          style={reduced ? {} : { rotateY: rotY, y: pY, scale: pScale, opacity: pOpacity }}
          className="v4-portrait v4-portrait-scrim origin-top h-full"
          transformTemplate={(_, gen) => `perspective(1100px) ${gen}`}
        >
          <Image
            src="/photos/portrait-hero.webp"
            alt=""
            width={779}
            height={1093}
            priority
            className="h-full w-auto object-contain select-none"
          />
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-6xl w-full px-5 md:px-8 pt-[42vh] pb-24 md:pt-28 md:pb-28 relative">
        {/* mobile-only scrim: sits UNDER the text band (starts below the face
            zone) so the copy always wins at 390px without dimming his face. */}
        <div
          className="md:hidden pointer-events-none absolute -inset-x-5 -bottom-12 top-[-4vh] z-[5]"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,13,16,.55) 14%, rgba(12,13,16,.88) 34%, rgba(12,13,16,.96) 60%)" }}
          aria-hidden
        />
        {/* DESKTOP portrait — bigger (~82vh), right-of-center, bottom-anchored,
            FULL opacity, black drop-shadow depth (no fade mask). z-sandwich:
            KRISHNA behind (z-0), portrait (z-10), MADHAN stroke in front (z-20). */}
        <motion.div
          style={reduced ? {} : { x: px, y: py }}
          className="hidden md:flex pointer-events-none absolute z-10 right-[7%] bottom-0
                     h-[82vh] max-h-[760px] items-end justify-end"
          aria-hidden
        >
          <motion.div
            style={reduced ? {} : { rotateY: rotY, y: pY, scale: pScale, opacity: pOpacity }}
            className="v4-portrait origin-bottom h-full"
            transformTemplate={(_, gen) => `perspective(1100px) ${gen}`}
          >
            <Image
              src="/photos/portrait-hero.webp"
              alt=""
              width={779}
              height={1093}
              priority
              className="h-full w-auto object-contain select-none"
            />
          </motion.div>
        </motion.div>

        {/* giant name — z-sandwich: KRISHNA behind portrait (desktop), MADHAN
            in front. On mobile the name sits ABOVE the scrim (z-10) so it reads
            over the portrait's lower third. */}
        <div className="relative z-10 md:z-0">
          <h1 className="v4-display text-v4-ink text-[clamp(3.8rem,15vw,9rem)] leading-[0.9]">
            <span className={`block ${reduced ? "" : "v4-rise"}`} style={{ animationDelay: "0.15s" }}>
              {v4.hero.lineA}
            </span>
          </h1>
        </div>
        <div className="relative z-20 -mt-[0.14em]">
          <h1 aria-hidden className="v4-display text-[clamp(3.8rem,15vw,9rem)] leading-[0.9]"
              style={{ WebkitTextStroke: "1px #ece9e2", color: "transparent" }}>
            <span className={`block ${reduced ? "" : "v4-rise"}`} style={{ animationDelay: "0.24s" }}>
              {v4.hero.lineB}
            </span>
          </h1>
          <span className="sr-only">{v4.hero.lineA} {v4.hero.lineB}</span>
        </div>

        {/* positioning + concrete line — constrained so copy clears the
            portrait's left edge at 1280–1600 (never runs under the arm). */}
        <div className="relative z-20 mt-8 max-w-xl md:max-w-[29rem]">
          <Reveal delay={0.35}>
            <p className="text-[19px] md:text-[21px] text-v4-ink leading-snug">
              {v4.hero.positioning}
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="mt-4 text-[15px] md:text-[16px] text-v4-body leading-relaxed">
              {v4.hero.concrete}
            </p>
          </Reveal>
        </div>

        {/* credibility strip — same clear-of-portrait width as the copy */}
        <Reveal delay={0.55} className="relative z-20 mt-7 max-w-2xl md:max-w-[29rem]">
          <div className="v4-hairline mb-3" />
          <p className="v4-mono text-[11px] tracking-[0.08em] text-v4-mute leading-relaxed">
            {v4.hero.credibility.join("  ·  ")}
          </p>
          <div className="v4-hairline mt-3" />
        </Reveal>

        {/* CTA row */}
        <Reveal delay={0.65} className="relative z-20 mt-8 flex flex-wrap items-center gap-4">
          <Magnetic href="#systems"
            className="v4-mono text-[13px] tracking-[0.1em] text-v4-bg bg-v4-ink rounded-full px-7 py-3.5 hover:bg-white transition-colors">
            {v4.hero.ctaPrimary} →
          </Magnetic>
          <Magnetic href="#contact"
            className="v4-mono text-[13px] tracking-[0.1em] text-v4-ink rounded-full px-7 py-3.5 border border-v4-line hover:border-v4-blue/50 transition-colors">
            {v4.hero.ctaGhost}
          </Magnetic>
        </Reveal>

        {/* floating status cards.
            Mobile: a single horizontal-scroll row below the CTA (chips).
            Desktop: positioned AROUND the portrait, never over his face —
            A + B float top-right above/right of the head, C drops low near
            his crossed arms. Each card is individually placed. */}
        <div className="relative z-20 mt-8 md:mt-0 md:static flex md:block gap-3 overflow-x-auto md:overflow-visible pb-1">
          {v4.hero.cards.map((c, i) => {
            // desktop placement per card — resolves against the hero container
            // (md:static wrapper), keeping the whole face clear at 1280–1600.
            const deskPos =
              i === 0 ? "md:top-[64px] md:right-0 md:w-[232px]"    // A: top-right, clear of the nav button
              : i === 1 ? "md:top-[156px] md:right-0 md:w-[232px]" // B: just below A, same right edge
              : "md:top-auto md:bottom-2 md:right-1 md:w-[232px]"; // C: low, over his crossed arms
            return (
              <motion.div
                key={c.k}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                className={`v4-raised px-4 py-3 shrink-0 min-w-[210px] md:min-w-0 md:absolute md:z-20 ${deskPos} ${reduced ? "" : "v4-float"}`}
                style={reduced ? {} : { animationDelay: `${i * 1.4}s` }}
              >
                <p className="v4-mono text-[10px] tracking-[0.14em] text-v4-mute flex items-center gap-2">
                  <span className={cardTone(c.tone)} aria-hidden /> {c.k}
                </p>
                <p className="mt-1 text-[13px] text-v4-ink">{c.v}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <LiveLab />
    </section>
  );
}

/* LIVE FROM THE LAB strip — restyled to v4 amber LEDs */
function LiveLab() {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 px-5 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="v4-raised v4-mono text-[11px] px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="v4-mlabel !text-v4-amber">{v4.lab.liveLabel}</span>
          {v4.lab.live.map((s, i) => (
            <span key={s.k} className="inline-flex items-center gap-1.5 text-v4-body">
              <span className="v4-led v4-led-pulse" style={{ animationDelay: `${i * 0.5}s` }} aria-hidden />
              <span className="text-v4-mute">{s.k}</span> <span className="text-v4-ink">{s.v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ OPERATOR — compact magazine identity block ══════════════ */

export function Operator() {
  const o = v4.operator;
  return (
    <section id="operator" className="relative z-20 mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-24 md:min-h-[70vh] md:flex md:items-center">
      <div className="grid md:grid-cols-[minmax(0,20rem)_1fr] gap-10 md:gap-16 items-center w-full">
        {/* portrait in a tall graphite frame; image breaks ~24px out of the top */}
        <Reveal>
          <div className="v4-opframe h-[380px] md:h-[440px] w-full max-w-[20rem] mx-auto md:mx-0">
            <div className="absolute inset-0 -top-6 overflow-hidden rounded-[16px]">
              <Image
                src="/photos/portrait-editorial.webp"
                alt="Krishna Madhan"
                width={779}
                height={1093}
                className="w-full h-full object-cover object-top select-none"
              />
            </div>
          </div>
        </Reveal>

        {/* credibility rows + human line */}
        <div>
          <Reveal><p className="v4-mlabel mb-6">{o.eyebrow}</p></Reveal>
          <div>
            {o.rows.map((r, i) => (
              <Reveal key={r.k} delay={i * 0.06}>
                <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-[8rem_1fr] gap-4 sm:gap-8 py-4 border-t border-v4-line items-baseline">
                  <p className="v4-mono text-[11px] tracking-[0.16em] text-v4-mute">{r.k}</p>
                  <p className="text-[15px] md:text-[17px] text-v4-ink leading-snug">{r.v}</p>
                </div>
              </Reveal>
            ))}
            <div className="v4-hairline" />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-[15px] md:text-[16px] text-v4-body leading-relaxed">{o.human}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════ SYSTEMS — editorial list-cards ══════════════ */

export function Systems() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const s = v4.systems;
  return (
    <section id="systems" ref={ref} className="relative z-20 mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
      <SectionHead label={s.label} title={s.title} intro={s.intro} progress={scrollYProgress} />
      <div>
        {s.cards.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.05}>
            <SystemCard card={c} proofCaption={s.proofCaption} />
          </Reveal>
        ))}
        <div className="v4-hairline" />
      </div>
    </section>
  );
}

function SystemCard({
  card, proofCaption,
}: {
  card: (typeof v4.systems.cards)[number];
  proofCaption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lift, setLift] = useState(false);
  const statusClass =
    card.status === "LIVE" ? "v4-status v4-status-live"
    : card.status === "IN LAB" ? "v4-status v4-status-lab"
    : "v4-status v4-status-shipped";
  const hasCase = card.slug !== "";
  const inner = (
    <motion.div
      ref={ref}
      onPointerEnter={() => setLift(true)}
      onPointerLeave={() => setLift(false)}
      animate={reduced ? {} : { y: lift ? -4 : 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="v4-listcard grid grid-cols-1 md:grid-cols-[7rem_1fr_16rem] gap-6 md:gap-8 py-9 md:py-12 items-start"
    >
      <div className="v4-numeral text-[3.4rem] md:text-[4.5rem] leading-none">{card.n}</div>
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="v4-display text-2xl md:text-3xl text-v4-ink">{card.name}</h3>
          <span className={statusClass}>{card.status}</span>
        </div>
        <p className="mt-3 text-[16px] text-v4-ink/90 leading-relaxed">{card.what}</p>
        <p className="mt-2 text-[15px] text-v4-body leading-relaxed max-w-2xl">{card.why}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {card.stack.map((t) => (
            <span key={t} className="v4-mono text-[11px] tracking-[0.05em] text-v4-mute border border-v4-line rounded-md px-2 py-1">
              {t}
            </span>
          ))}
        </div>
        {hasCase && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-v4-blue">
            Read the case study →
          </span>
        )}
      </div>
      <div className="v4-proof">
        <span className="v4-mono text-[10px] tracking-[0.18em] text-v4-mute">{proofCaption}</span>
      </div>
    </motion.div>
  );
  if (hasCase) {
    return (
      <a href={`/projects/${card.slug}`} className="block group">
        {inner}
      </a>
    );
  }
  return inner;
}

/* ══════════════ PROFESSIONAL — capabilities + timeline + skills ══════════════ */

export function Professional() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = v4.professional;
  return (
    <section id="professional" ref={ref} className="relative z-20 mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
      <SectionHead label={p.label} title={p.title} intro={p.intro} progress={scrollYProgress} />

      <div className="grid md:grid-cols-[1fr_18rem] gap-12">
        {/* capability rows */}
        <div>
          {p.capabilities.map((c, i) => (
            <Reveal key={c.cap} delay={i * 0.05}>
              <div className="grid grid-cols-1 sm:grid-cols-[13rem_1fr] gap-2 sm:gap-6 py-4 border-t border-v4-line">
                <p className="v4-mono text-[13px] tracking-[0.04em] text-v4-blue">{c.cap}</p>
                <p className="text-[15px] text-v4-body leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
          <div className="v4-hairline" />
        </div>

        {/* timeline rail */}
        <div>
          <p className="v4-mlabel mb-5">TRAJECTORY</p>
          <ol className="relative border-l border-v4-line pl-5 space-y-7">
            {p.timeline.map((t) => (
              <Reveal key={t.title}>
                <li className="relative">
                  <span className="absolute -left-[1.42rem] top-1.5 w-2 h-2 rounded-full bg-v4-amber" aria-hidden />
                  <p className="v4-mono text-[11px] tracking-[0.1em] text-v4-mute">{t.era}</p>
                  <p className="text-[15px] text-v4-ink mt-0.5">{t.title}</p>
                  <p className="text-[13px] text-v4-body mt-1 leading-relaxed">{t.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      {/* skills — quiet chip cloud grouped by domain */}
      <div className="mt-16">
        <p className="v4-mlabel mb-6">STACK</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.skillGroups.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06}>
              <p className="v4-mono text-[11px] tracking-[0.12em] text-v4-mute mb-3">{g.group}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s} className="v4-chip v4-mono">{s}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ LAB — personal lab, field log ══════════════ */

export function Lab() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const l = v4.labSection;
  return (
    <section id="lab" ref={ref} className="relative z-20 mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
      <SectionHead label={l.label} title={l.title} intro={l.intro} progress={scrollYProgress} />

      <Reveal>
        <p className="v4-mono text-[13px] text-v4-amber/90 mb-8">{l.tanglish}</p>
      </Reveal>

      {/* field-log editorial strip */}
      <div className="grid sm:grid-cols-3 gap-4 md:gap-5">
        {l.fieldLog.map((f, i) => (
          <Reveal key={f.img} delay={i * 0.07}>
            <figure className="relative overflow-hidden rounded-xl border border-v4-line group">
              <Image
                src={f.img} alt={f.cap} width={640} height={800}
                className="w-full h-64 object-cover grayscale-[.25] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
                <span className="v4-mono text-[9px] tracking-[0.2em] text-v4-amber">{f.tag}</span>
                <p className="text-[13px] text-v4-ink mt-1 leading-snug">{f.cap}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="v4-panel mt-8 px-6 py-5">
          <p className="v4-mono text-[12px] text-v4-amber/90 tracking-[0.03em]">{l.cricketLine}</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-8 text-[15px] text-v4-body leading-relaxed max-w-2xl">{l.outro}</p>
      </Reveal>
    </section>
  );
}

/* ══════════════ ROOTS — mature, brief ══════════════ */

export function Roots() {
  const r = v4.roots;
  return (
    <section id="roots" className="relative z-20 mx-auto max-w-4xl px-5 md:px-8 py-28 md:py-40 text-center">
      <Reveal><p className="v4-mlabel mb-6">{r.label}</p></Reveal>
      <Reveal delay={0.05}>
        <p className="v4-display text-[clamp(1.6rem,3.6vw,2.6rem)] text-v4-ink leading-[1.2] max-w-3xl mx-auto">
          {r.text}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {r.places.map((p) => (
            <span key={p.name} className="v4-mono text-[11px] tracking-[0.14em] text-v4-mute border border-v4-line rounded-full px-4 py-2">
              <span className="text-v4-body">{p.name}</span> <span className="text-v4-blue">{p.coord}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════ CONTACT ══════════════ */

export function Contact() {
  const c = v4.contact;
  return (
    <section id="contact" className="relative z-20 mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-36">
      <Reveal><p className="v4-mlabel mb-6">{c.label}</p></Reveal>
      <Reveal delay={0.05}>
        <h2 className="v4-display text-[clamp(2rem,4.6vw,3.4rem)] text-v4-ink leading-[1.08] max-w-4xl">
          <KineticTitle>{c.heading}</KineticTitle>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <Magnetic href={`mailto:${profile.contact.email}`}
          className="inline-block mt-10 v4-mono text-xl md:text-3xl text-v4-blue hover:text-v4-ink transition-colors underline decoration-v4-blue/40 underline-offset-8 hover:decoration-v4-ink">
          {profile.contact.email}
        </Magnetic>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap gap-3">
          {profile.contact.socials.map((sc) => (
            <Magnetic key={sc.label} href={sc.href} strength={0.2}
              className="v4-mono text-[13px] tracking-[0.06em] text-v4-body border border-v4-line rounded-full px-5 py-2.5 hover:text-v4-ink hover:border-v4-blue/50 transition-colors">
              {sc.label}
            </Magnetic>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════ FOOTER ══════════════ */

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-v4-line">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-8 flex flex-wrap items-center justify-between gap-3">
        <p className="v4-mono text-[12px] tracking-[0.1em] text-v4-body">{v4.contact.footerSignoff}</p>
        <p className="v4-mono text-[11px] tracking-[0.14em] text-v4-mute">
          KM<span className="text-v4-amber">·</span>OS 26.2 · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
