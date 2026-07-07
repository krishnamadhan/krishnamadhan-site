import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";

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

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const proj = profile.projects.find((p) => p.slug === params.slug);
  if (!proj) notFound();

  return (
    <main className="relative z-10 min-h-screen px-[6vw] py-28">
      <div className="grid-floor" aria-hidden />
      <div className="max-w-3xl mx-auto">
        <Link href="/#projects"
          className="module-label inline-flex items-center gap-2 hover:text-cyan transition-colors">
          ← BACK TO LAB MODULES
        </Link>
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
        <div className="chamber mt-14 p-12 text-center">
          <p className="module-label mb-3">CASE STUDY</p>
          <p className="font-display text-2xl font-semibold">Deep dive coming soon.</p>
          <p className="text-dim text-sm mt-3 max-w-md mx-auto">
            Architecture, hard-won lessons, and what broke along the way — being written up properly.
          </p>
          <p className="coord mt-8">MODULE.DOCKED · DOCS.PENDING</p>
        </div>
      </div>
    </main>
  );
}
