import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

/**
 * STYLE VARIANT B — warm paper minimal.
 * Dribbble refs: Orix "Hey There, I'm Binjan", Vishnu Prasad, Flowbase.
 * Cream paper, serif display, bento grid, arch portrait, hand-drawn accents.
 * Photos are Madhan's own with warm CSS grading only.
 */

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Krishna Madhan — Paper",
  robots: { index: false },
};

const INK = "#2b2620";

function Squiggle() {
  return (
    <svg viewBox="0 0 220 14" className="w-52 h-4 text-[#c4502e]" fill="none" aria-hidden>
      <path d="M3 10 C 30 2, 55 2, 80 9 S 135 14, 160 7 S 205 2, 217 6"
        stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PaperPage() {
  return (
    <main className={`${fraunces.variable} min-h-screen bg-[#f8f2e5] text-[#2b2620] selection:bg-[#c4502e] selection:text-white`}
          style={{ backgroundImage: "radial-gradient(rgba(43,38,32,.055) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
      {/* ── nav pill ── */}
      <nav className="sticky top-4 z-40 mx-auto flex w-fit translate-y-4 items-center gap-5 rounded-full border border-[#2b2620]/15 bg-[#fffdf7]/90 px-6 py-2.5 text-sm shadow-[0_10px_30px_-14px_rgba(43,38,32,.35)] backdrop-blur">
        <span className="font-bold" style={{ fontFamily: "var(--font-fraunces)" }}>KM.</span>
        {["Work", "About", "Life", "Contact"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="text-[#2b2620]/70 hover:text-[#c4502e] transition-colors">{l}</a>
        ))}
      </nav>

      {/* ── hero ── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <p className="mb-4 inline-block rounded-full border border-[#1f7a33]/30 bg-[#1f7a33]/10 px-4 py-1 text-xs font-semibold text-[#1f7a33]">
            ● Building in Bangalore
          </p>
          <h1 className="leading-[1.02]" style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(44px,6.5vw,84px)", fontWeight: 600 }}>
            Hey there — I&apos;m <em className="not-italic text-[#c4502e]">Madhan</em>.
            I make machines feel <em className="italic">alive</em>.
          </h1>
          <div className="mt-3"><Squiggle /></div>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#2b2620]/75">
            Software engineer on cloud &amp; data platforms by day. After hours my
            living room is a robotics lab — a robot pet with moods, a WhatsApp
            companion with opinions, and AI teammates that file their own tickets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="rounded-full bg-[#2b2620] px-7 py-3 font-semibold text-[#f8f2e5] transition-transform hover:-translate-y-0.5">
              See the work
            </a>
            <a href={`mailto:${profile.contact.email}`} className="rounded-full border-2 border-[#2b2620] px-7 py-3 font-semibold transition-colors hover:bg-[#2b2620] hover:text-[#f8f2e5]">
              Say hello
            </a>
          </div>
        </div>
        {/* arch portrait */}
        <div className="relative mx-auto w-full max-w-xs">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-[#2b2620] shadow-[10px_10px_0_#c4502e]">
            <Image src="/photos/portrait.webp" alt="Krishna Madhan" fill sizes="320px"
              className="object-cover sepia-[0.18] saturate-[1.05] contrast-[1.02]" />
          </div>
          <span className="absolute -left-8 top-10 -rotate-12 rounded-xl border-2 border-[#2b2620] bg-[#fffdf7] px-3 py-1.5 text-xs font-bold shadow-md">
            ★ Cricket captain
          </span>
          <span className="absolute -right-6 bottom-14 rotate-6 rounded-xl border-2 border-[#2b2620] bg-[#fffdf7] px-3 py-1.5 text-xs font-bold shadow-md">
            ⌁ Robot parent
          </span>
        </div>
      </section>

      {/* ── bento ── */}
      <section id="about" className="mx-auto grid max-w-6xl gap-5 px-6 pb-16 md:grid-cols-3">
        <div className="rounded-3xl border border-[#2b2620]/12 bg-[#fffdf7] p-7 shadow-[0_14px_40px_-24px_rgba(43,38,32,.4)] md:col-span-2">
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>A small civilization on one Pi</h2>
          <p className="leading-relaxed text-[#2b2620]/75">{profile.about[1]}</p>
        </div>
        <div className="rounded-3xl bg-[#2b2620] p-7 text-[#f8f2e5]">
          <h2 className="mb-4 text-lg font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>By the numbers</h2>
          <dl className="space-y-3 text-sm">
            {[["Group games shipped", "17"], ["Behavior-tree nodes", "56"], ["Fantasy platforms", "2"], ["Demanding testers", "1 friend group"]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2">
                <dt className="text-[#f8f2e5]/60">{k}</dt><dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl border border-[#2b2620]/12 bg-[#fffdf7] p-7">
          <h2 className="mb-4 text-lg font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Toolbox</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.flatMap((s) => s.items).slice(0, 14).map((t) => (
              <span key={t} className="rounded-full border border-[#2b2620]/20 bg-[#f8f2e5] px-3 py-1 text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>
        <figure className="group relative overflow-hidden rounded-3xl border border-[#2b2620]/12 md:col-span-2">
          <Image src="/photos/trophy.webp" alt="Cricket trophy at sunset" width={900} height={500}
            className="h-56 w-full object-cover sepia-[0.25] saturate-[1.1] transition-transform duration-500 group-hover:scale-[1.03]" />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#fffdf7]/90 px-4 py-1.5 text-xs font-bold">
            Off duty: trophies get kissed at sunset ★
          </figcaption>
        </figure>
      </section>

      {/* ── work ── */}
      <section id="work" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-2 text-4xl font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Things I&apos;ve built</h2>
        <Squiggle />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {profile.projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`}
               className="group rounded-3xl border border-[#2b2620]/12 bg-[#fffdf7] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_-24px_rgba(43,38,32,.45)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c4502e]">{p.id}</span>
                <span className="rounded-full border border-[#2b2620]/20 px-3 py-0.5 text-[11px] font-semibold">{p.status}</span>
              </div>
              <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2b2620]/70">{p.desc}</p>
              <span className="mt-4 inline-block text-sm font-bold text-[#c4502e] transition-transform group-hover:translate-x-1">
                Read the story →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── life strip ── */}
      <section id="life" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {[["/photos/trek.webp", "Trails"], ["/photos/ocean.webp", "Open water"], ["/photos/voyage.webp", "Travel"]].map(([src, cap]) => (
            <figure key={src} className="group relative aspect-square overflow-hidden rounded-3xl">
              <Image src={src} alt={cap} fill sizes="33vw"
                className="object-cover sepia-[0.2] saturate-[1.08] transition-transform duration-500 group-hover:scale-105" />
              <figcaption className="absolute bottom-2 left-2 rounded-full bg-[#fffdf7]/90 px-3 py-1 text-xs font-bold">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── contact ── */}
      <footer id="contact" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[2.5rem] bg-[#2b2620] px-8 py-14 text-center text-[#f8f2e5]">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: "var(--font-fraunces)" }}>
            Let&apos;s build something <em className="italic text-[#e8a13c]">useful, weird</em> and future-facing.
          </h2>
          <a href={`mailto:${profile.contact.email}`}
             className="mt-8 inline-block rounded-full bg-[#f8f2e5] px-8 py-3.5 font-bold text-[#2b2620] transition-transform hover:-translate-y-0.5">
            {profile.contact.email}
          </a>
          <p className="mt-8 text-xs text-[#f8f2e5]/50">Krishna Madhan · built with a robot watching · 2026</p>
        </div>
      </footer>
    </main>
  );
}
