"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { Magnetic, Reveal, SectionHeading, TiltCard } from "./ui";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const ACCENT: Record<string, string> = {
  cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber", rose: "bg-rose",
};
const ACCENT_TEXT: Record<string, string> = {
  cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose",
};

/* ── nav ── */
const NAV_LINKS = ["About", "Work", "Projects", "Timeline", "Skills", "Contact"];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-[4vw] py-4 bg-gradient-to-b from-void/90 to-transparent backdrop-blur-sm">
      <a href="#top" className="font-display font-bold tracking-[0.25em] text-sm text-cyan">
        KM<span className="text-ink">·</span>OS
      </a>
      <ul className="hidden md:flex gap-8 text-[11px] tracking-[0.2em] uppercase">
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="text-dim hover:text-cyan transition-colors">{l}</a>
          </li>
        ))}
      </ul>
      <button
        aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="md:hidden relative w-9 h-9 grid place-items-center rounded-lg glass"
      >
        <span className={`block w-4 h-px bg-cyan transition-transform ${open ? "rotate-45 translate-y-[1px]" : "-translate-y-1"}`} />
        <span className={`block w-4 h-px bg-cyan transition-opacity absolute ${open ? "opacity-0" : ""}`} />
        <span className={`block w-4 h-px bg-cyan transition-transform ${open ? "-rotate-45 -translate-y-[1px]" : "translate-y-1"}`} />
      </button>
      {open && (
        <div className="md:hidden absolute top-full inset-x-3 mt-1 glass rounded-2xl p-4 grid gap-1">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
               className="px-4 py-3 rounded-xl text-sm tracking-[0.15em] uppercase text-dim hover:text-cyan hover:bg-white/5 transition-colors">
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── HERO: split editorial + contained lab chamber ── */
const HUD_LABELS = [
  { t: "AI Agents", pos: "top-4 left-4" },
  { t: "Robotics", pos: "top-4 right-4" },
  { t: "Cloud Systems", pos: "bottom-16 left-4" },
  { t: "Data Mesh", pos: "bottom-16 right-4" },
  { t: "Automation", pos: "top-1/2 -translate-y-1/2 left-4" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const fade = (d: number) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 26 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.9, delay: d, ease: [0.2, 0.8, 0.2, 1] as const },
    };
  return (
    <section id="top" className="relative min-h-screen flex items-center px-[6vw] pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
        {/* left: editorial */}
        <div>
          <motion.p {...fade(0.05)} className="module-label mb-6">
            KM·OS v2.0 — personal operating system
          </motion.p>
          <motion.h1
            {...fade(0.2)}
            className="font-display font-extrabold leading-[0.98] text-[clamp(3.2rem,7.5vw,6.2rem)]"
          >
            Krishna<br /><span className="grad-text">Madhan</span>
          </motion.h1>
          <motion.p {...fade(0.4)} className="mt-6 max-w-xl text-dim text-lg md:text-xl leading-relaxed">
            {profile.subheadline}
          </motion.p>
          <motion.div {...fade(0.55)} className="flex flex-wrap gap-2 mt-7">
            {profile.microcopy.map((m) => (
              <span key={m} className="text-[10px] tracking-[0.18em] uppercase text-dim border border-white/10 rounded-full px-3.5 py-1.5">
                {m}
              </span>
            ))}
          </motion.div>
          <motion.div {...fade(0.7)} className="flex flex-wrap gap-4 mt-9">
            <Magnetic href="#work" primary>Explore Work</Magnetic>
            <Magnetic href="#projects">View Projects</Magnetic>
            <Magnetic href="#contact">Contact</Magnetic>
          </motion.div>
        </div>

        {/* right: the KM Lab Engine in its chamber */}
        <motion.div {...fade(0.5)} className="relative">
          <div className="chamber aspect-square max-w-[480px] mx-auto">
            <Scene />
            {HUD_LABELS.map((h) => (
              <span key={h.t} className={`absolute ${h.pos} module-label bg-void/60 rounded px-2 py-1 backdrop-blur-sm border border-white/5`}>
                {h.t}
              </span>
            ))}
            <span className="coord absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">ENGINE.ONLINE · 12.97°N 77.59°E</span>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-dim/60 text-[10px] tracking-[0.3em] uppercase animate-pulse">
        scroll
        <span className="block w-px h-8 mx-auto mt-2 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}

/* ── ABOUT: editorial + identity stack + metadata photo ── */
export function About() {
  return (
    <section id="about" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="01" label="MODULE / IDENTITY">About</SectionHeading>
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-14 items-start">
          <div>
            <div className="space-y-5 text-dim text-[1.06rem] leading-relaxed">
              {profile.about.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}><p className="[&>strong]:text-ink">{p}</p></Reveal>
              ))}
            </div>
            {/* identity stack */}
            <Reveal delay={0.25}>
              <div className="mt-10 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
                {profile.identityStack.map((r) => (
                  <div key={r.k} className="flex items-baseline gap-6 px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                    <span className="module-label w-28 shrink-0">{r.k}</span>
                    <span className="text-sm text-ink/90">{r.v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <figure className="relative rounded-2xl overflow-hidden border border-white/10 group">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/photos/portrait.webp" alt="Krishna Madhan" fill sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-void/95 to-transparent">
                <div className="flex justify-between items-end">
                  <span className="module-label">OPERATOR</span>
                  <span className="coord">BLR · IST +05:30</span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── WORK: systems map ── */
export function Work() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="work" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="02" label="MODULE / SYSTEMS">Systems Map</SectionHeading>
        <Reveal><p className="text-dim max-w-3xl mb-14">{profile.work.intro}</p></Reveal>
        <Reveal>
          <div className="relative">
            {/* connector spine */}
            <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-16 hidden lg:block" aria-hidden>
              <line x1="2%" y1="50%" x2="98%" y2="50%" className="map-line" />
            </svg>
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
              {profile.workMap.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setActive(active === n.id ? null : n.id)}
                  onMouseEnter={() => setActive(n.id)}
                  className={`relative text-left rounded-xl border p-4 transition-all duration-300 bg-panel/60 backdrop-blur-sm
                    ${active === n.id ? "border-cyan/60 -translate-y-1.5 shadow-[0_16px_40px_-16px_rgba(75,225,255,.35)]" : "border-white/10 hover:border-white/25"}`}
                >
                  <span className="coord block mb-2">N{String(i + 1).padStart(2, "0")}</span>
                  <span className={`block font-display text-sm font-semibold ${active === n.id ? "text-cyan" : "text-ink"}`}>{n.title}</span>
                  <span className={`block text-[12px] leading-snug text-dim mt-2 transition-all duration-300 ${active === n.id ? "opacity-100 max-h-24" : "opacity-0 max-h-0 lg:opacity-0"} overflow-hidden`}>
                    {n.desc}
                  </span>
                  <span className={`absolute top-4 right-3 w-1.5 h-1.5 rounded-full transition-colors ${active === n.id ? "bg-cyan shadow-[0_0_10px_rgba(75,225,255,.9)]" : "bg-white/20"}`} />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="coord mt-8 text-center">OPERATED DAILY · NO INTERNALS EXPOSED · SEE CONTACT FOR THE REST</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── PROJECTS: lab modules ── */
export function Projects() {
  return (
    <section id="projects" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="03" label="MODULE / LAB">Lab Modules</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {profile.projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <TiltCard
                className={`relative overflow-hidden rounded-2xl p-8 h-full group border transition-colors
                  ${p.featured
                    ? "border-white/20 bg-gradient-to-br from-panel/90 to-panel/50 backdrop-blur-xl"
                    : "border-white/10 bg-panel/50 backdrop-blur-sm"}`}
              >
                {p.featured && (
                  <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-30 ${ACCENT[p.accent]}`} />
                )}
                <div className="flex items-center justify-between mb-6" style={{ transform: "translateZ(26px)" }}>
                  <span className="module-label">{p.id}</span>
                  <span className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border
                    ${p.status === "Active"
                      ? "border-cyan/40 text-cyan bg-cyan/5"
                      : "border-white/15 text-dim"}`}>
                    {p.status === "Active" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mr-1.5 animate-pulse align-middle" />}
                    {p.status}
                  </span>
                </div>
                <div className="relative w-11 h-11 mb-6" style={{ transform: "translateZ(30px)" }}>
                  <span className={`absolute inset-0 rounded-lg border border-white/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700`} />
                  <span className={`absolute inset-[7px] rounded-full ${ACCENT[p.accent]} opacity-70 group-hover:scale-110 transition-transform duration-700`} />
                </div>
                <h3 className={`font-display font-semibold mb-2 ${p.featured ? "text-2xl" : "text-xl"}`} style={{ transform: "translateZ(24px)" }}>
                  {p.title}
                </h3>
                <p className="text-dim text-sm mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] tracking-[0.15em] uppercase text-dim border border-white/10 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                <span className={`text-[11px] tracking-[0.2em] uppercase ${ACCENT_TEXT[p.accent]} opacity-80`}>
                  {p.featured ? "Flagship module →" : "Case study soon →"}
                </span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TIMELINE: trajectory console ── */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const beam = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="timeline" className="relative py-[15vh] px-[6vw] scanline">
      <div className="max-w-4xl mx-auto">
        <SectionHeading idx="04" label="MODULE / TRAJECTORY">Trajectory</SectionHeading>
        <div ref={ref} className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            style={{ height: beam }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-cyan via-violet to-amber shadow-[0_0_12px_rgba(75,225,255,.5)]"
          />
          {profile.timeline.map((t, i) => (
            <Reveal key={t.title} delay={0.04}>
              <div className={`relative pl-12 md:pl-0 pb-10 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"}`}>
                <span className={`absolute top-6 w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_14px_rgba(75,225,255,.9)] left-[11.5px] md:left-auto ${i % 2 ? "md:-left-[5.5px]" : "md:-right-[5.5px]"}`} />
                <div className="rounded-xl border border-white/10 bg-panel/50 backdrop-blur-sm p-5 hover:border-cyan/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="module-label">{t.era}</span>
                    <span className="coord">T{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                  <p className="text-dim text-sm mt-1">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS: orbital stack map ── */
export function Skills() {
  return (
    <section id="skills" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading idx="05" label="MODULE / STACK">The Stack</SectionHeading>
        <Reveal>
          <div className="flex justify-center mb-12">
            <div className="chamber rounded-full px-8 py-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_12px_rgba(75,225,255,.9)]" />
              <span className="font-display font-bold tracking-[0.25em] text-sm">KRISHNA·OS CORE</span>
            </div>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.skills.map((c, ci) => (
            <Reveal key={c.cluster} delay={ci * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-panel/40 p-5 h-full hover:border-cyan/30 transition-colors">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-display font-semibold">{c.cluster}</span>
                  <span className="coord">{String(c.items.length).padStart(2, "0")}</span>
                </div>
                <p className="text-[12px] text-dim/80 mb-4 italic">{c.note}</p>
                <div className="flex flex-wrap gap-2">
                  {c.items.map((s) => (
                    <span key={s} className="rounded-full px-3.5 py-1.5 text-[13px] text-dim border border-white/10 hover:text-cyan hover:border-cyan/40 transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FIELD LOG: cricket + adventure + travel (warm) ── */
export function OffDuty() {
  const life = profile.life;
  return (
    <section id="offduty" className="relative py-[15vh] px-[6vw] field">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="06" label="FIELD LOG / OFF DUTY" accent="amber">{life.heading}</SectionHeading>
        <Reveal>
          <p className="text-dim max-w-3xl mb-2">{life.intro}</p>
          <p className="module-label mb-12">“{life.motto}”</p>
        </Reveal>

        {/* featured: cricket */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl border border-amber/20 mb-6 grid md:grid-cols-2 bg-panel/50">
            <div className="relative min-h-[320px] md:min-h-[440px] overflow-hidden">
              <Image
                src={life.cricket.img} alt={life.cricket.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent md:to-panel/95 to-transparent" />
              <span className="absolute top-4 left-4 module-label bg-void/60 rounded px-2.5 py-1.5 backdrop-blur-sm border border-amber/30">
                {life.cricket.tag}
              </span>
              <span className="coord absolute bottom-4 left-4">LOG.001 · GOLDEN HOUR</span>
            </div>
            <div className="relative p-8 md:p-12 flex flex-col justify-center">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-4"
                  style={{ background: "linear-gradient(115deg,#fff 20%,#ffb454 70%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {life.cricket.title}
              </h3>
              <p className="text-dim mb-7">{life.cricket.body}</p>
              <ul className="space-y-2.5">
                {life.cricket.stats.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-ink/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_10px_rgba(255,180,84,.9)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {life.tiles.map((s, i) => (
            <Reveal key={s.img} delay={i * 0.09}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={s.img} alt={s.title} fill sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.06] transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/15 to-transparent" />
                <span className="absolute top-3 left-3 module-label bg-void/50 rounded px-2 py-1 backdrop-blur-sm">
                  {s.tag}
                </span>
                <span className="coord absolute top-3 right-3">LOG.{String(i + 2).padStart(3, "0")}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="font-display font-semibold text-lg">{s.title}</h4>
                  <p className="text-xs text-dim mt-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {s.cap}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="text-dim/80 text-sm text-center mt-10 italic">Tested outside the keyboard. {life.outro}</p></Reveal>
      </div>
    </section>
  );
}

/* ── roots ── */
export function Roots() {
  return (
    <section id="roots" className="relative py-[13vh] px-[6vw] field">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading idx="07" label="FIELD LOG / ORIGIN" accent="amber">Roots</SectionHeading>
        <Reveal>
          <p className="text-dim text-lg leading-relaxed">{profile.roots.text}</p>
          {/* TODO(public-verification): see content/profile.review.md */}
        </Reveal>
      </div>
    </section>
  );
}

/* ── contact ── */
export function Contact() {
  return (
    <section id="contact" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading idx="08" label="MODULE / UPLINK">Contact</SectionHeading>
        <Reveal>
          <div className="chamber px-8 md:px-16 py-14">
            <p className="font-display text-2xl md:text-3xl font-semibold mb-3 grad-text">
              {profile.contact.heading}
            </p>
            <p className="text-dim mb-9 text-sm">
              Robots, AI companions, data platforms, or something weirder — inbox is open.
            </p>
            <Magnetic href={`mailto:${profile.contact.email}`} primary>Say hello</Magnetic>
            <div className="flex justify-center gap-7 mt-9">
              {profile.contact.socials.map((s) => (
                <a key={s.label} href={s.href} className="text-dim text-xs tracking-[0.15em] uppercase hover:text-cyan transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
            <p className="coord mt-8">CHANNEL.OPEN · RESPONSE.T+24H</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 text-center text-dim/50 text-[11px] tracking-[0.25em] uppercase py-12">
      Krishna Madhan · KM·OS · built with a robot watching · {new Date().getFullYear()}
    </footer>
  );
}
