"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { KineticText, Magnetic, Reveal, SectionHeading, TiltCard } from "@/components/ui";
import { sceneStore } from "@/lib/sceneChapters";

const ACCENT: Record<string, string> = {
  cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber", rose: "bg-rose",
};
const ACCENT_TEXT: Record<string, string> = {
  cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose",
};

const v3 = profile.v3;

/* ── nav (boot line added) ── */
const NAV_LINKS = ["About", "Work", "Projects", "Timeline", "Skills", "Contact"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.toLowerCase());
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="fixed top-0 inset-x-0 z-40 px-[4vw] pt-4 pb-3 bg-gradient-to-b from-void/95 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <a href="#top" className="font-display font-bold tracking-[0.25em] text-sm text-cyan">
          KM<span className="text-ink">·</span>OS
        </a>
        <ul className="hidden md:flex gap-8 text-[11px] tracking-[0.2em] uppercase">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.toLowerCase();
            return (
              <li key={l} className="relative">
                <a href={`#${l.toLowerCase()}`}
                   className={`transition-colors ${isActive ? "text-cyan" : "text-[#c3cde0] hover:text-cyan"}`}>{l}</a>
                {isActive && (
                  <motion.span layoutId="nav-glide-v3"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-cyan shadow-[0_0_8px_rgba(75,225,255,.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
              </li>
            );
          })}
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
      </div>
      <p className="v3-mono text-[10px] tracking-[0.12em] text-[#8fa0c4] mt-1.5 hidden sm:block">
        {v3.bootLine}
      </p>
      {open && (
        <div className="md:hidden absolute top-full inset-x-3 mt-1 glass rounded-2xl p-4 grid gap-1">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
               className="px-4 py-3 rounded-xl text-sm tracking-[0.15em] uppercase text-[#c3cde0] hover:text-cyan hover:bg-white/5 transition-colors">
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── LIVE FROM THE LAB status strip ── */
function LabStatus() {
  return (
    <div className="v3-panel v3-mono text-[11px] px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span className="v3-mlabel">LIVE FROM THE LAB</span>
      {v3.labStatus.map((s) => (
        <span key={s.k} className="inline-flex items-center gap-2 text-[#c3cde0]">
          <span className="v3-led" aria-hidden />
          <span className="text-[#8fa0c4]">{s.k}:</span> {s.v}
        </span>
      ))}
    </div>
  );
}

/* ── HERO: real dusk environment + scroll-reactive portrait cutout ── */
export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // progress 0→1 over first viewport; portrait "turns / steps aside"
  const rotateY = useTransform(scrollYProgress, [0, 1], [-10, -2]);
  const tX = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const tY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const gray = useTransform(scrollYProgress, [0, 1], [0.65, 0]);
  const filter = useTransform(gray, (g) => `grayscale(${g}) saturate(1.05)`);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  const fade = (d: number) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 26 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.9, delay: d, ease: [0.2, 0.8, 0.2, 1] as const },
    };

  return (
    <section ref={ref} id="top" className="relative min-h-screen flex items-center px-[6vw] pt-32 pb-16 overflow-hidden">
      {/* Hero backdrop is rendered in page.tsx (before <KMScene />) so the 3D
          core paints above it. The <main> here is z-10; keeping the backdrop
          here would cover the fixed z-0 canvas. */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center">
        {/* left: editorial */}
        <div>
          <motion.p {...fade(0.05)} className="v3-mlabel mb-6">
            KM·OS 26.2 — personal operating system
          </motion.p>
          <motion.h1
            {...fade(0.2)}
            className="font-display font-extrabold leading-[0.98] text-[clamp(3.2rem,7.5vw,6.2rem)] [text-shadow:0_2px_30px_rgba(4,6,13,.8)]"
          >
            <KineticText delay={0.15}>Krishna</KineticText><br />
            <span className="grad-text"><KineticText delay={0.3}>Madhan</KineticText></span>
          </motion.h1>
          <motion.p {...fade(0.4)} className="mt-6 max-w-xl v3-body text-lg md:text-xl leading-relaxed [text-shadow:0_1px_16px_rgba(4,6,13,.9)]">
            {profile.subheadline}
          </motion.p>

          {/* coordinate chips */}
          <motion.div {...fade(0.5)} className="flex flex-wrap gap-2 mt-7">
            {v3.places.map((p) => (
              <span key={p.name} className="v3-mono text-[10px] tracking-[0.14em] text-[#c3cde0] v3-panel px-3.5 py-1.5 inline-flex items-center gap-2">
                <span className="text-cyan">{p.name}</span>
                <span className="text-[#8fa0c4]">{p.coord}</span>
              </span>
            ))}
          </motion.div>

          <motion.div {...fade(0.6)} className="flex flex-wrap gap-4 mt-8">
            <Magnetic href="#work" primary>Explore Work</Magnetic>
            <Magnetic href="#projects">View Projects</Magnetic>
            <Magnetic href="#contact">Contact</Magnetic>
          </motion.div>

          <motion.div {...fade(0.72)} className="mt-8 max-w-xl">
            <LabStatus />
          </motion.div>
        </div>

        {/* right: portrait cutout, bottom-anchored, scroll-reactive */}
        <div className="relative hidden lg:block self-end" style={{ perspective: 900 }}>
          <motion.div
            className="relative mx-auto"
            style={reduced ? {} : { rotateY, x: tX, y: tY, opacity, transformOrigin: "bottom center" }}
          >
            <div className="v3-ground-glow" aria-hidden />
            <motion.div className="v3-cutout relative w-full max-w-[380px] mx-auto" style={reduced ? {} : { filter }}>
              <Image src="/photos/portrait-cutout.webp" alt="Krishna Madhan"
                     width={779} height={1093} priority
                     className="w-full h-auto object-contain" style={{ maxHeight: "46vh", width: "auto", margin: "0 auto" }} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* mobile: smaller cutout, far behind-right — sits under the scrim + panels, never over text */}
      <div className="lg:hidden absolute right-[-16%] bottom-0 z-[1] pointer-events-none opacity-45" aria-hidden>
        <Image src="/photos/portrait-cutout.webp" alt=""
               width={779} height={1093}
               className="v3-cutout w-auto" style={{ height: "34vh" }} />
      </div>

      {/* Left-aligned with the copy column and lifted above the ChapterHUD pill
          (bottom-center) so they no longer overlap. */}
      <div className="absolute bottom-24 left-[6vw] z-10 hidden md:flex items-center">
        <span className="v3-mono coord animate-pulse text-cyan/70">SCROLL TO BOOT THE STORY ↓</span>
      </div>
    </section>
  );
}

/* ── ABOUT: two-column sticky (brittanychiang pattern) ── */
export function About() {
  return (
    <section id="about" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="01" label="MODULE / IDENTITY">About</SectionHeading>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-start">
          {/* left: sticky identity card */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="v3-panel-strong overflow-hidden">
                <figure className="relative">
                  <div className="relative aspect-[4/5]" style={{ WebkitMaskImage: "linear-gradient(180deg,#000 82%,transparent)", maskImage: "linear-gradient(180deg,#000 82%,transparent)" }}>
                    <Image
                      src="/photos/portrait.webp" alt="Krishna Madhan" fill sizes="(max-width: 1024px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-5 pb-5 -mt-4 relative">
                    <div className="flex justify-between items-end">
                      <span className="v3-mlabel">OPERATOR</span>
                      <span className="v3-mono coord">BLR · IST +05:30</span>
                    </div>
                  </figcaption>
                </figure>
                <div className="divide-y divide-white/5 border-t border-white/10">
                  {profile.identityStack.map((r) => (
                    <div key={r.k} className="flex items-baseline gap-5 px-5 py-3">
                      <span className="v3-mlabel w-24 shrink-0">{r.k}</span>
                      <span className="text-sm text-[#c3cde0]">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          {/* right: readable prose */}
          <div className="space-y-6 v3-body text-base md:text-[1.08rem] leading-relaxed max-w-[65ch]">
            {profile.about.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── WORK: systems map, higher node contrast, panel behind intro ── */
export function Work() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="work" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="02" label="MODULE / SYSTEMS">Systems Map</SectionHeading>
        <Reveal>
          <div className="v3-panel px-6 py-5 mb-14 max-w-3xl">
            <p className="v3-body text-base leading-relaxed">{profile.work.intro}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="relative">
            <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-16 hidden lg:block" aria-hidden>
              <line x1="2%" y1="50%" x2="98%" y2="50%" className="map-line" />
            </svg>
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
              {profile.workMap.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setActive(active === n.id ? null : n.id)}
                  onMouseEnter={() => setActive(n.id)}
                  className={`relative text-left rounded-xl border p-4 transition-all duration-300 bg-void/75 backdrop-blur-sm
                    ${active === n.id ? "border-cyan/60 -translate-y-1.5 shadow-[0_16px_40px_-16px_rgba(75,225,255,.35)]" : "border-white/12 hover:border-white/30"}`}
                >
                  <span className="v3-mono coord block mb-2 !text-[#8fa0c4]">N{String(i + 1).padStart(2, "0")}</span>
                  <span className={`block font-display text-sm font-semibold ${active === n.id ? "text-cyan" : "text-white"}`}>{n.title}</span>
                  <span className={`block text-[13px] leading-snug text-[#c3cde0] mt-2 transition-all duration-300 ${active === n.id ? "opacity-100 max-h-24" : "opacity-0 max-h-0 lg:opacity-0"} overflow-hidden`}>
                    {n.desc}
                  </span>
                  <span className={`absolute top-4 right-3 w-1.5 h-1.5 rounded-full transition-colors ${active === n.id ? "bg-cyan shadow-[0_0_10px_rgba(75,225,255,.9)]" : "bg-white/30"}`} />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="v3-mono coord mt-8 text-center">OPERATED DAILY · NO INTERNALS EXPOSED · SEE CONTACT FOR THE REST</p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-center mt-4 text-sm italic text-[#8fa0c4]">{v3.tanglish.work}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── PROJECTS: lab modules, readable body + clearer CTA ── */
export function Projects() {
  return (
    <section id="projects" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="03" label="MODULE / LAB">Lab Modules</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {profile.projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <a href={`/projects/${p.slug}`} className="block h-full focus-visible:outline-none group/link"
                 onPointerEnter={() => { sceneStore.hotModule = i; }}
                 onPointerLeave={() => { sceneStore.hotModule = -1; }}
                 onFocus={() => { sceneStore.hotModule = i; }}
                 onBlur={() => { sceneStore.hotModule = -1; }}>
              <TiltCard
                className={`relative overflow-hidden rounded-2xl p-8 h-full group border transition-colors
                  ${p.featured
                    ? "border-white/20 bg-void/80 backdrop-blur-xl group-hover/link:border-cyan/50 group-focus-visible/link:border-cyan/60 group-hover/link:shadow-[0_0_60px_-18px_rgba(75,225,255,.4)]"
                    : "border-white/12 bg-void/75 backdrop-blur-sm group-hover/link:border-cyan/40 group-focus-visible/link:border-cyan/50"}`}
              >
                {p.featured && (
                  <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-25 ${ACCENT[p.accent]}`} />
                )}
                <div className="flex items-center justify-between mb-6" style={{ transform: "translateZ(26px)" }}>
                  <span className="v3-mlabel">{p.id}</span>
                  <span className={`text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border
                    ${p.status === "Active"
                      ? "border-cyan/40 text-cyan bg-cyan/5"
                      : "border-white/20 text-[#c3cde0]"}`}>
                    {p.status === "Active" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mr-1.5 animate-pulse align-middle" />}
                    {p.status}
                  </span>
                </div>
                <div className="relative w-11 h-11 mb-6" style={{ transform: "translateZ(30px)" }}>
                  <span className={`absolute inset-0 rounded-lg border border-white/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700`} />
                  <span className={`absolute inset-[7px] rounded-full ${ACCENT[p.accent]} opacity-70 group-hover:scale-110 transition-transform duration-700`} />
                </div>
                <h3 className={`font-display font-semibold mb-2 text-white ${p.featured ? "text-2xl" : "text-xl"}`} style={{ transform: "translateZ(24px)" }}>
                  {p.title}
                </h3>
                <p className="v3-body text-[15px] leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[11px] tracking-[0.12em] uppercase text-[#c3cde0] border border-white/15 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[12px] tracking-[0.15em] uppercase font-medium ${ACCENT_TEXT[p.accent]}`}>
                  {p.featured ? "Flagship module" : "Open case study"} <span aria-hidden>→</span>
                </span>
              </TiltCard>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TIMELINE: trajectory console, era markers at full contrast ── */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const beam = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="timeline" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-4xl mx-auto">
        <SectionHeading idx="04" label="MODULE / TRAJECTORY">Trajectory</SectionHeading>
        <div ref={ref} className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/12" />
          <motion.div
            style={{ height: beam }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-cyan via-violet to-amber shadow-[0_0_12px_rgba(75,225,255,.5)]"
          />
          {profile.timeline.map((t, i) => (
            <Reveal key={t.title} delay={0.04}>
              <div className={`relative pl-12 md:pl-0 pb-10 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"}`}>
                <span className={`absolute top-6 w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_14px_rgba(75,225,255,.9)] left-[11.5px] md:left-auto ${i % 2 ? "md:-left-[5.5px]" : "md:-right-[5.5px]"}`} />
                <div className="v3-panel p-5 hover:border-cyan/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="v3-mlabel">{t.era}</span>
                    <span className="v3-mono coord">T{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{t.title}</h3>
                  <p className="v3-body text-[15px] leading-relaxed mt-1.5">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS: orbital stack map, 16px chips, no float on reduced motion ── */
export function Skills() {
  return (
    <section id="skills" className="relative py-[15vh] px-[6vw]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading idx="05" label="MODULE / STACK">The Stack</SectionHeading>
        <Reveal>
          <div className="flex justify-center mb-12">
            <div className="v3-panel rounded-full px-8 py-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_12px_rgba(75,225,255,.9)]" />
              <span className="font-display font-bold tracking-[0.25em] text-sm text-white">KRISHNA·OS CORE</span>
            </div>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.skills.map((c, ci) => (
            <Reveal key={c.cluster} delay={ci * 0.05}>
              <div className="v3-panel p-5 h-full hover:border-cyan/30 transition-colors">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-display font-semibold text-white">{c.cluster}</span>
                  <span className="v3-mono coord">{String(c.items.length).padStart(2, "0")}</span>
                </div>
                <p className="text-[13px] text-[#8fa0c4] mb-4 italic">{c.note}</p>
                <div className="flex flex-wrap gap-2">
                  {c.items.map((s) => (
                    <span key={s} className="v3-chip rounded-full px-3.5 py-1.5 text-[#c3cde0] border border-white/15 hover:text-cyan hover:border-cyan/40 transition-colors cursor-default">
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

/* ── FIELD LOG: cricket + adventure + travel (warm), captions on scrim ── */
export function OffDuty() {
  const life = profile.life;
  return (
    <section id="offduty" className="relative py-[11vh] px-[6vw] field">
      <div className="max-w-6xl mx-auto">
        <SectionHeading idx="06" label="FIELD LOG / OFF DUTY" accent="amber">{life.heading}</SectionHeading>
        <Reveal>
          <div className="v3-panel px-6 py-5 mb-10 max-w-3xl">
            <p className="v3-body text-base leading-relaxed">{life.intro}</p>
            <p className="v3-mlabel mt-3 !text-amber/90">“{life.motto}”</p>
          </div>
        </Reveal>

        {/* featured: cricket */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl border border-amber/25 mb-6 grid md:grid-cols-2 bg-void/70">
            <div className="relative min-h-[320px] md:min-h-[460px] overflow-hidden">
              <motion.div className="absolute -inset-y-8 inset-x-0"
                initial={{ y: 20 }} whileInView={{ y: -20 }}
                viewport={{ amount: 0.2 }} transition={{ duration: 1.4, ease: "linear" }}>
                <Image
                  src={life.cricket.img} alt={life.cricket.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-1000"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent md:to-void/90 to-transparent" />
              <span className="absolute top-4 left-4 v3-mlabel v3-panel rounded px-2.5 py-1.5 !text-amber/90 border-amber/30">
                {life.cricket.tag}
              </span>
              <span className="v3-mono coord absolute bottom-4 left-4">LOG.001 · GOLDEN HOUR</span>
            </div>
            <div className="relative p-8 md:p-12 flex flex-col justify-center">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-4"
                  style={{ background: "linear-gradient(115deg,#fff 20%,#ffb454 70%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {life.cricket.title}
              </h3>
              <p className="v3-body text-base leading-relaxed mb-5">{life.cricket.body}</p>
              {/* Single amber stat row — the old 3-bullet list was a duplicate
                  and has been removed; the "arguments settled: ∞" joke is
                  appended to the end of this row so it survives. */}
              <p className="v3-mono text-[12px] text-amber/90 tracking-[0.06em] mb-2">{v3.cricketLine}</p>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {life.tiles.map((s, i) => (
            <Reveal key={s.img} delay={i * 0.09}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/12">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={s.img} alt={s.title} fill sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.06] transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                <span className="absolute top-3 left-3 v3-mlabel v3-panel rounded px-2 py-1">
                  {s.tag}
                </span>
                <span className="v3-mono coord absolute top-3 right-3">LOG.{String(i + 2).padStart(3, "0")}</span>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="v3-panel px-3.5 py-3 rounded-xl">
                    <h4 className="font-display font-semibold text-lg text-white">{s.title}</h4>
                    <p className="text-[13px] text-[#c3cde0] mt-1 leading-relaxed">{s.cap}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="v3-body text-sm text-center mt-10 italic opacity-90">Tested outside the keyboard. {life.outro}</p></Reveal>
        <Reveal delay={0.1}><p className="text-center mt-3 text-sm italic text-amber/70">{v3.tanglish.offduty}</p></Reveal>
      </div>
    </section>
  );
}

/* ── roots ── */
export function Roots() {
  return (
    <section id="roots" className="relative py-[9vh] px-[6vw] field">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading idx="07" label="FIELD LOG / ORIGIN" accent="amber">Roots</SectionHeading>
        <Reveal>
          <div className="v3-panel px-6 md:px-10 py-8">
            <p className="v3-body text-lg leading-relaxed">
              I {v3.rootsHill}, and staying useful to the place you come from matters to me.
              I care about community-oriented, real-world impact — and I&apos;m working out what
              that looks like when you can build software, AI and machines.
            </p>
          </div>
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
          <div className="v3-panel-strong px-8 md:px-16 py-14">
            <p className="font-display text-2xl md:text-3xl font-semibold mb-3 grad-text">
              {profile.contact.heading}
            </p>
            <p className="v3-body mb-9 text-base leading-relaxed max-w-xl mx-auto">
              Robots, AI companions, data platforms, or something weirder — inbox is open.
            </p>
            <a href={`mailto:${profile.contact.email}`}
               className="v3-mono inline-block text-lg md:text-xl text-cyan hover:text-white transition-colors underline decoration-cyan/40 underline-offset-8 hover:decoration-white">
              {profile.contact.email}
            </a>
            <div className="flex flex-wrap justify-center gap-7 mt-9">
              {profile.contact.socials.map((s) => (
                <a key={s.label} href={s.href} className="text-[#c3cde0] text-xs tracking-[0.15em] uppercase hover:text-cyan transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
            <p className="v3-mono coord mt-8">SIGNAL READY · CHANNEL.OPEN · RESPONSE.T+24H</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 text-center py-12 space-y-2">
      <p className="v3-mono text-[12px] tracking-[0.14em] text-[#c3cde0]">{v3.footerSignoff}</p>
      <p className="text-[#8fa0c4]/70 text-[11px] tracking-[0.25em] uppercase">
        Krishna Madhan · KM·OS · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
