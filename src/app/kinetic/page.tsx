import Link from "next/link";
import { VARIANTS } from "./_shared/content";

export default function KineticIndex() {
  return (
    <main className="min-h-screen bg-v4-bg px-6 py-16 font-body text-v4-ink md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-display text-[11px] tracking-[0.3em] text-v4-mute">KINETIC EXPLORATION · 10 DIRECTIONS</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">Kinetic Lab</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-v4-body">
          Ten radically different hero + scroll ideas for krishnamadhan.com.
          Exploration first, convergence in <Link href="/kinetic/final" className="text-v4-amber underline underline-offset-4">/kinetic/final</Link>.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-v4-line bg-v4-line sm:grid-cols-2">
          {VARIANTS.map((v) => (
            <Link key={v.slug} href={`/kinetic/${v.slug}`}
              className="group bg-v4-panel p-6 transition-colors hover:bg-v4-raised">
              <span className="font-display text-xs tracking-[0.25em] text-v4-mute">{String(v.n).padStart(2, "0")}</span>
              <h2 className="mt-2 font-display text-xl tracking-tight text-v4-ink group-hover:text-v4-amber">{v.name}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-v4-mute">{v.idea}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
