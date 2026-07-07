"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { Magnetic, Marquee, Reveal, SectionHeading, TiltCard } from "./ui";

const ACCENT: Record<string, string> = {
  cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber", rose: "bg-rose",
};

/* ── nav ── */
export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-[4vw] py-4 bg-gradient-to-b from-void/90 to-transparent backdrop-blur-sm">
      <a href="#top" className="font-display font-bold tracking-[0.25em] text-sm text-cyan">
        KM<span className="text-ink">·</span>LAB
      </a>
      <ul className="hidden md:flex gap-8 text-[11px] tracking-[0.2em] uppercase">
        {["About", "Work", "Projects", "Timeline", "Skills", "Contact"].map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="text-dim hover:text-cyan transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── hero ── */
export function Hero() {
  const reduced = useReducedMotion();
  const fade = (d: number) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1, delay: d, ease: [0.2, 0.8, 0.2, 1] as const },
    };
  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="hud-corners absolute inset-x-[6vw] inset-y-[14vh] hidden md:block pointer-events-none" />
      <motion.p {...fade(0.1)} className="text-cyan text-xs md:text-sm tracking-[0.5em] uppercase">
        Engineer · Builder · Futurist
      </motion.p>
      <motion.h1
        {...fade(0.3)}
        className="font-display grad-text font-extrabold leading-[1.02] text-[clamp(3rem,10vw,7.5rem)] my-5"
      >
        Krishna<br />Madhan
      </motion.h1>
      <motion.p {...fade(0.55)} className="max-w-2xl text-dim text-base md:text-xl">
        {profile.subheadline}
      </motion.p>
      <motion.div {...fade(0.75)} className="flex flex-wrap justify-center gap-4 mt-10">
        <Magnetic href="#work" primary>Explore Work</Magnetic>
        <Magnetic href="#projects">View Projects</Magnetic>
        <Magnetic href="#contact">Contact</Magnetic>
      </motion.div>
      <motion.p {...fade(0.95)} className="mt-10 text-[11px] tracking-[0.3em] uppercase text-dim/70">
        {profile.microcopy.join(" · ")}
      </motion.p>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dim/60 text-[10px] tracking-[0.3em] uppercase animate-pulse">
        scroll
        <span className="block w-px h-9 mx-auto mt-2 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}

/* ── about ── */
export function About() {
  return (
    <section id="about" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading idx="01">About</SectionHeading>
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center">
          <div className="space-y-5 text-dim text-[1.05rem] leading-relaxed">
            {profile.about.map((p, i) => (
              <Reveal key={i} delay={i * 0.12}><p>{p}</p></Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="glass relative overflow-hidden rounded-2xl aspect-[4/5] group">
              <div className="absolute -inset-[40%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(75,225,255,.3),transparent_78%)] animate-spin-slow z-10 pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/portrait.webp" alt="Krishna Madhan"
                className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-2xl grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
              />
              <span className="absolute bottom-3 left-4 z-20 font-mono text-[9px] tracking-[0.3em] uppercase text-cyan/80">
                ID.VERIFIED · BLR
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── work / engineering ── */
export function Work() {
  return (
    <section id="work" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading idx="02">Engineering</SectionHeading>
        <Reveal><p className="text-dim max-w-3xl mb-12">{profile.work.intro}</p></Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          {profile.work.areas.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="glass rounded-2xl p-7 h-full hover:border-cyan/40 transition-colors group">
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-cyan transition-colors">{a.title}</h3>
                <p className="text-dim text-sm mb-4">{a.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span key={t} className="text-[10px] tracking-[0.15em] uppercase text-cyan/80 border border-cyan/20 rounded-full px-3 py-1">{t}</span>
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

/* ── projects ── */
export function Projects() {
  return (
    <section id="projects" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="03">The Machines</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {profile.projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.09}>
              <TiltCard className="glass relative overflow-hidden rounded-2xl p-8 h-full group">
                <div className={`absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-40 ${ACCENT[p.accent]}`} />
                {/* animated emblem */}
                <div className="relative w-11 h-11 mb-6" style={{ transform: "translateZ(30px)" }}>
                  <span className={`absolute inset-0 rounded-lg border border-white/20 ${ACCENT[p.accent]}/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700`} />
                  <span className={`absolute inset-[7px] rounded-full ${ACCENT[p.accent]} opacity-70 group-hover:scale-110 transition-transform duration-700`} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ transform: "translateZ(24px)" }}>{p.title}</h3>
                <p className="text-dim text-sm mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] tracking-[0.15em] uppercase text-dim border border-white/10 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-cyan/70">{p.status} →</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── timeline ── */
export function Timeline() {
  return (
    <section id="timeline" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-4xl mx-auto">
        <SectionHeading idx="04">Trajectory</SectionHeading>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan/50 via-violet/40 to-rose/40" />
          {profile.timeline.map((t, i) => (
            <Reveal key={t.title} delay={0.05}>
              <div className={`relative pl-12 md:pl-0 pb-14 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
                <span className={`absolute top-1 w-3 h-3 rounded-full bg-cyan shadow-[0_0_18px_rgba(75,225,255,.9)] left-[10.5px] md:left-auto ${i % 2 ? "md:-left-[6.5px]" : "md:-right-[6.5px]"}`} />
                <span className="text-[10px] tracking-[0.3em] uppercase text-cyan/80">{t.era}</span>
                <h3 className="font-display text-lg font-semibold mt-1">{t.title}</h3>
                <p className="text-dim text-sm mt-1">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── skills ── */
export function Skills() {
  return (
    <section id="skills" className="relative py-[16vh] px-[6vw]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading idx="05">The Stack</SectionHeading>
        <div className="space-y-8">
          {profile.skills.map((c, ci) => (
            <Reveal key={c.cluster} delay={ci * 0.06}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="w-28 shrink-0 text-[10px] tracking-[0.3em] uppercase text-cyan/70">{c.cluster}</span>
                {c.items.map((s, i) => (
                  <span
                    key={s}
                    className="glass rounded-full px-5 py-2 text-sm text-dim hover:text-cyan hover:border-cyan/40 transition-colors cursor-default"
                    style={{ animation: `chipFloat ${3 + (i % 3)}s ease-in-out ${i * 0.25}s infinite` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── beyond the terminal: cricket + adventure + travel ── */
export function OffDuty() {
  const life = profile.life;
  return (
    <section id="offduty" className="relative py-[14vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="06">{life.heading}</SectionHeading>
        <Reveal><p className="text-dim max-w-3xl mb-12">{life.intro}</p></Reveal>

        {/* featured: cricket */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 mb-6 grid md:grid-cols-2 glass">
            <div className="relative min-h-[320px] md:min-h-[440px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={life.cricket.img} alt={life.cricket.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent md:to-panel/95 to-transparent" />
              <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.3em] text-amber bg-void/60 rounded px-2.5 py-1.5 backdrop-blur-sm border border-amber/30">
                {life.cricket.tag}
              </span>
            </div>
            <div className="relative p-8 md:p-12 flex flex-col justify-center">
              <h3 className="font-display text-3xl md:text-4xl font-bold grad-text mb-4">{life.cricket.title}</h3>
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

        {/* adventure / water / travel tiles */}
        <div className="grid sm:grid-cols-3 gap-5">
          {life.tiles.map((s, i) => (
            <Reveal key={s.img} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img} alt={s.title} loading="lazy"
                  className="w-full aspect-[3/4] object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.07] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/20 to-transparent" />
                <span className="absolute top-3 left-3 font-mono text-[8px] tracking-[0.25em] text-cyan/90 bg-void/50 rounded px-2 py-1 backdrop-blur-sm">
                  {s.tag}
                </span>
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
        <Reveal><p className="text-dim/80 text-sm text-center mt-10 italic">{life.outro}</p></Reveal>
      </div>
    </section>
  );
}

/* ── roots ── */
export function Roots() {
  return (
    <section id="roots" className="relative py-[14vh] px-[6vw]">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading idx="07">Roots</SectionHeading>
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
    <section id="contact" className="relative py-[18vh] px-[6vw]">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading idx="08">Contact</SectionHeading>
        <Reveal>
          <div className="glass rounded-3xl px-8 md:px-16 py-14 hud-corners relative">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 text-center text-dim/50 text-[11px] tracking-[0.25em] uppercase py-12">
      Krishna Madhan · built with a robot watching · {new Date().getFullYear()}
    </footer>
  );
}

export function KeywordStrip() {
  return (
    <Marquee
      words={["AI-native systems", "Robotic companions", "Cloud platforms", "Agentic workflows", "Real-world automation", "Data engineering"]}
    />
  );
}
