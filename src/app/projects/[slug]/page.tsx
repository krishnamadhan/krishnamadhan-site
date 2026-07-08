import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile, type CaseStudy } from "@/content/profile";
import { Reveal } from "@/components/ui";

export function generateStaticParams() {
  return profile.projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const proj = profile.projects.find((p) => p.slug === params.slug);
  return {
    title: proj ? `${proj.title} — Krishna Madhan` : "Project — Krishna Madhan",
    description: proj?.desc,
  };
}

const ACCENT_TEXT: Record<string, string> = {
  cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose",
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const idx = profile.projects.findIndex((p) => p.slug === params.slug);
  if (idx === -1) notFound();
  const proj = profile.projects[idx];
  const cs = (profile.caseStudies as Record<string, CaseStudy>)[proj.slug];
  const next = profile.projects[(idx + 1) % profile.projects.length];

  return (
    <main className="relative z-10 min-h-screen px-[6vw] py-28">
      <div className="grid-floor" aria-hidden />
      <div className="max-w-3xl mx-auto">
        <Link href="/#projects"
          className="module-label inline-flex items-center gap-2 hover:text-cyan transition-colors">
          ← BACK TO LAB MODULES
        </Link>

        {/* ── header ── */}
        <div className="mt-10 flex items-center justify-between">
          <span className="module-label">{proj.id}</span>
          <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-cyan/40 text-cyan bg-cyan/5">
            {proj.status}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 grad-text">{proj.title}</h1>
        <p className="text-dim text-lg mt-6 leading-relaxed">{proj.desc}</p>
        <div className="flex flex-wrap gap-2 mt-8">
          {proj.tags.map((t) => (
            <span key={t} className="text-[10px] tracking-[0.15em] uppercase text-dim border border-white/10 rounded-full px-3 py-1">{t}</span>
          ))}
        </div>

        {cs ? (
          <>
            {/* ── brief ── */}
            <Reveal className="mt-16">
              <p className="module-label mb-5">00 / BRIEF</p>
              <div className="space-y-5">
                {cs.brief.map((para, i) => (
                  <p key={i} className="text-dim leading-relaxed">{para}</p>
                ))}
              </div>
            </Reveal>

            {cs.classified ? (
              /* ── work project: internals withheld ── */
              <Reveal className="mt-14">
                <div className="chamber p-12 text-center">
                  <p className="module-label mb-3">01 / SYSTEM</p>
                  <p className="font-display text-2xl font-semibold">The interesting internals stay at work.</p>
                  <p className="text-dim text-sm mt-3 max-w-md mx-auto">
                    This is the professional half of the lab — broad strokes only, by design.
                    The personal projects above are where the full teardowns live.
                  </p>
                  <p className="coord mt-8">ACCESS.RESTRICTED · NDA.RESPECTED</p>
                </div>
              </Reveal>
            ) : (
              <>
                {/* ── system ── */}
                <Reveal className="mt-16">
                  <p className="module-label mb-5">01 / SYSTEM</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cs.system.map((s) => (
                      <div key={s.title} className="chamber p-6">
                        <h3 className={`font-display font-semibold text-base ${ACCENT_TEXT[proj.accent] ?? "text-cyan"}`}>{s.title}</h3>
                        <p className="text-dim text-sm mt-2.5 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* ── field notes: what broke ── */}
                <Reveal className="mt-16 field">
                  <p className="module-label mb-5">02 / FIELD NOTES — WHAT BROKE ALONG THE WAY</p>
                  <div className="space-y-4">
                    {cs.fieldNotes.map((n) => (
                      <div key={n.title} className="chamber p-6 border-l-2 border-l-amber/40">
                        <h3 className="font-display font-semibold text-base text-amber">{n.title}</h3>
                        <p className="text-dim text-sm mt-2.5 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* ── telemetry ── */}
                <Reveal className="mt-16">
                  <p className="module-label mb-5">03 / TELEMETRY</p>
                  <div className="chamber p-6 grid sm:grid-cols-3 gap-6">
                    {cs.telemetry.map((t) => (
                      <div key={t.k}>
                        <p className="coord">{t.k}</p>
                        <p className="font-display font-semibold text-sm mt-1.5">{t.v}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </>
            )}
          </>
        ) : (
          /* fallback for projects without a written case study */
          <div className="chamber mt-14 p-12 text-center">
            <p className="module-label mb-3">CASE STUDY</p>
            <p className="font-display text-2xl font-semibold">Deep dive coming soon.</p>
            <p className="text-dim text-sm mt-3 max-w-md mx-auto">
              Architecture, hard-won lessons, and what broke along the way — being written up properly.
            </p>
            <p className="coord mt-8">MODULE.DOCKED · DOCS.PENDING</p>
          </div>
        )}

        {/* ── next module ── */}
        <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link href="/#projects" className="module-label hover:text-cyan transition-colors">
            ALL MODULES
          </Link>
          <Link href={`/projects/${next.slug}`}
            className="group text-right focus-visible:outline-none">
            <span className="module-label block">NEXT MODULE</span>
            <span className="font-display font-semibold text-lg group-hover:text-cyan transition-colors">
              {next.title} →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
