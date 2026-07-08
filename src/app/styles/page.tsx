import type { Metadata } from "next";
import Link from "next/link";

/** Private index of style variants for review — not linked from the site. */

export const metadata: Metadata = {
  title: "Style Lab — Krishna Madhan",
  robots: { index: false },
};

const VARIANTS = [
  { href: "/styles/editorial", name: "A · Editorial Brutalist", note: "Ink on paper, giant condensed type, stamps, index rows. Refs: Devanta Ebison, Gil Huybrecht, Floyd Miles." },
  { href: "/styles/paper", name: "B · Warm Paper Minimal", note: "Cream, serif, bento grid, arch portrait, hand-drawn accents. Refs: Orix 'Binjan', Vishnu Prasad." },
  { href: "/styles/retro-os", name: "C · KM·OS Retro Desktop", note: "CSS bliss wallpaper, draggable windows, taskbar. Ref: Daniel Sun. Fits the KM·OS brand." },
  { href: "/", name: "Current · Dark Lab (KM·OS v2)", note: "The live design — 3D actor troupe, scroll narrative." },
];

export default function StylesIndex() {
  return (
    <main className="min-h-screen bg-void px-6 py-20 text-ink">
      <div className="mx-auto max-w-2xl">
        <p className="module-label mb-3">STYLE LAB / PRIVATE REVIEW</p>
        <h1 className="font-display text-4xl font-bold">Pick a direction</h1>
        <p className="mt-3 text-dim text-sm">Board tasks AB-040 – AB-043. Same content, four skins.</p>
        <ul className="mt-10 space-y-4">
          {VARIANTS.map((v) => (
            <li key={v.href}>
              <Link href={v.href} className="block rounded-2xl border border-white/10 bg-panel/80 p-6 transition-colors hover:border-cyan/50">
                <span className="font-display text-xl font-semibold">{v.name}</span>
                <p className="mt-1.5 text-sm text-dim">{v.note}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
