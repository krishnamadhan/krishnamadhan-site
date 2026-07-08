import type { Metadata } from "next";
import { Anton } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

/**
 * STYLE VARIANT A — editorial brutalist.
 * Dribbble refs: Devanta Ebison "PRODUCT DESIGNER", Gil Huybrecht, Floyd Miles.
 * Ink on paper, giant condensed type, stamps, index rows, B/W photo strip.
 * Photos are Madhan's own, treated with CSS grading only.
 */

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "Krishna Madhan — Editorial",
  robots: { index: false },
};

const PHOTOS = [
  { src: "/photos/trophy.webp", cap: "CHAMPION.MODE", loc: "SUNSET, TROPHY" },
  { src: "/photos/trek.webp", cap: "TREK.MODE", loc: "WESTERN GHATS" },
  { src: "/photos/ocean.webp", cap: "SALTWATER.IO", loc: "BAY OF BENGAL" },
  { src: "/photos/voyage.webp", cap: "VOYAGE.EXE", loc: "IN TRANSIT" },
];

const MARQUEE = "AI-NATIVE SYSTEMS ✦ ROBOTICS ✦ CLOUD PLATFORMS ✦ WHATSAPP COMPANIONS ✦ FANTASY CRICKET ✦ REAL HARDWARE ✦ ";

export default function EditorialPage() {
  return (
    <main className={`${anton.variable} min-h-screen bg-[#f0ede4] text-[#141311] selection:bg-[#141311] selection:text-[#f0ede4]`}>
      {/* ── top strip ── */}
      <header className="flex items-center justify-between border-b-2 border-[#141311] px-5 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase">
        <span>Krishna Madhan — Portfolio</span>
        <span className="hidden md:block">Bangalore · 12.97°N 77.59°E</span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1f7a33] animate-pulse" />
          Open to weird ideas
        </span>
      </header>

      {/* ── hero ── */}
      <section className="relative px-5 pt-10 pb-6 border-b-2 border-[#141311] overflow-hidden">
        <h1 className="uppercase leading-[0.86] tracking-tight"
            style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(64px, 13.5vw, 210px)" }}>
          <span className="block">Krishna</span>
          <span className="block text-transparent"
                style={{ WebkitTextStroke: "2.5px #141311" }}>
            Madhan
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md text-sm leading-relaxed font-medium">
            Software engineer building AI-native systems, robotic companions and
            real-world automation. Cloud &amp; data platforms by day — a living
            robotics lab after hours.
          </p>
          {/* rotating stamp */}
          <div className="relative w-32 h-32 shrink-0 mr-4">
            <svg viewBox="0 0 120 120" className="w-full h-full animate-[spin_14s_linear_infinite]">
              <defs>
                <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text className="uppercase" style={{ fontSize: 11.2, letterSpacing: "0.22em", fontWeight: 700 }}>
                <textPath href="#circ">AI · Robotics · Cloud — ships real things ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center text-3xl">✦</span>
          </div>
        </div>
        <span className="absolute right-5 top-8 rotate-6 border-2 border-[#141311] px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase">
          Est. Tiruvannamalai
        </span>
        {/* tilted operator portrait */}
        <figure className="absolute right-32 top-24 hidden w-60 -rotate-2 border-2 border-[#141311] bg-[#f0ede4] p-2 pb-8 shadow-[8px_8px_0_#141311] lg:block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src="/photos/portrait.webp" alt="Krishna Madhan" fill sizes="240px"
              className="object-cover grayscale contrast-[1.12]" />
          </div>
          <figcaption className="absolute bottom-2 left-2 text-[10px] font-bold tracking-[0.25em] uppercase">
            The Operator · BLR
          </figcaption>
        </figure>
      </section>

      {/* ── marquee ── */}
      <div className="overflow-hidden border-b-2 border-[#141311] bg-[#141311] text-[#f0ede4] py-2.5"
           aria-hidden>
        <div className="flex whitespace-nowrap animate-[ticker_26s_linear_infinite]"
             style={{ fontFamily: "var(--font-anton)" }}>
          {[0, 1].map((i) => (
            <span key={i} className="text-xl tracking-wide uppercase shrink-0">{MARQUEE}</span>
          ))}
        </div>
      </div>

      {/* ── selected work: index rows ── */}
      <section className="border-b-2 border-[#141311]">
        <p className="px-5 pt-8 pb-4 text-[11px] font-bold tracking-[0.3em] uppercase">Selected Work / 2024 — 2026</p>
        {profile.projects.map((p, i) => (
          <Link key={p.slug} href={`/projects/${p.slug}`}
             className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-8 px-5 py-6 border-t border-[#141311]/30 transition-colors hover:bg-[#141311] hover:text-[#f0ede4]">
            <span className="text-sm font-bold tabular-nums">0{i + 1}</span>
            <span className="uppercase leading-none group-hover:translate-x-2 transition-transform"
                  style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(26px, 4.6vw, 64px)" }}>
              {p.title}
            </span>
            <span className="hidden md:flex flex-col items-end gap-1 text-[10px] font-semibold tracking-[0.2em] uppercase">
              <span>{p.tags.slice(0, 2).join(" / ")}</span>
              <span className="opacity-60">{p.status} → </span>
            </span>
          </Link>
        ))}
      </section>

      {/* ── photo strip: B/W → colour on hover ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-[#141311]">
        {PHOTOS.map((ph) => (
          <figure key={ph.src} className="group relative aspect-[3/4] overflow-hidden border-r border-[#141311]/30 last:border-r-0">
            <Image src={ph.src} alt={ph.cap} fill sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover grayscale contrast-[1.15] brightness-[0.95] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]" />
            <figcaption className="absolute bottom-0 inset-x-0 flex justify-between px-3 py-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#f0ede4] bg-[#141311]/70">
              <span>{ph.cap}</span><span>{ph.loc}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* ── stack + trajectory ── */}
      <section className="grid md:grid-cols-2 border-b-2 border-[#141311]">
        <div className="px-5 py-8 border-b md:border-b-0 md:border-r border-[#141311]/30">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-5">Stack</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.flatMap((s) => s.items).map((item) => (
              <span key={item} className="border border-[#141311] px-3 py-1 text-xs font-semibold uppercase tracking-wider hover:bg-[#141311] hover:text-[#f0ede4] transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="px-5 py-8">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-5">Trajectory</p>
          <ol>
            {profile.timeline.map((t) => (
              <li key={t.title} className="flex gap-4 items-baseline py-1.5 border-b border-dotted border-[#141311]/40 last:border-0">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase w-28 shrink-0">{t.era}</span>
                <span className="text-sm font-medium">{t.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="relative px-5 pt-10 pb-16">
        <a href={`mailto:${profile.contact.email}`}
           className="block uppercase leading-[0.9] hover:italic"
           style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(56px, 12vw, 180px)" }}>
          Let&apos;s Talk →
        </a>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-[11px] font-semibold tracking-[0.2em] uppercase">
          <span>{profile.contact.email}</span>
          <span className="-rotate-3 border-2 border-[#141311] px-3 py-1">End of file · KM 2026</span>
        </div>
      </footer>

      <style>{`
        @keyframes ticker { to { transform: translateX(-50%); } }
      `}</style>
    </main>
  );
}
