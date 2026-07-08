"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/* ── window registry ── */

type Win = { id: string; title: string; x: number; y: number; z: number; open: boolean };

const INITIAL: Win[] = [
  { id: "about", title: "About.txt — Notepad", x: 60, y: 120, z: 1, open: true },
  { id: "projects", title: "My Projects", x: 480, y: 200, z: 2, open: true },
  { id: "photos", title: "Photos — IMG_2019.WEBP", x: 880, y: 110, z: 3, open: true },
  { id: "terminal", title: "cosmo — km-pi5: ~", x: 260, y: 420, z: 4, open: false },
  { id: "contact", title: "Contact.exe", x: 720, y: 470, z: 5, open: false },
];

const PHOTO_ROLL = [
  { src: "/photos/trophy.webp", name: "IMG_2019.WEBP" },
  { src: "/photos/trek.webp", name: "IMG_2214.WEBP" },
  { src: "/photos/ocean.webp", name: "IMG_2380.WEBP" },
  { src: "/photos/voyage.webp", name: "IMG_2544.WEBP" },
];

export default function RetroDesktop() {
  const [wins, setWins] = useState(INITIAL);
  const [clock, setClock] = useState("--:--");
  const [photo, setPhoto] = useState(0);
  const zTop = useRef(10);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 10_000);
    return () => clearInterval(t);
  }, []);

  const focus = (id: string) =>
    setWins((w) => w.map((x) => (x.id === id ? { ...x, z: ++zTop.current, open: true } : x)));
  const close = (id: string) =>
    setWins((w) => w.map((x) => (x.id === id ? { ...x, open: false } : x)));
  const toggle = (id: string) =>
    setWins((w) => w.map((x) => (x.id === id ? { ...x, open: !x.open, z: ++zTop.current } : x)));

  const onDown = (e: React.PointerEvent, id: string) => {
    const win = wins.find((w) => w.id === id)!;
    drag.current = { id, dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    focus(id);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { id, dx, dy } = drag.current;
    setWins((w) => w.map((x) => (x.id === id
      ? { ...x, x: Math.max(-200, Math.min(e.clientX - dx, window.innerWidth - 120)), y: Math.max(0, Math.min(e.clientY - dy, window.innerHeight - 120)) }
      : x)));
  };
  const onUp = () => { drag.current = null; };

  const winByid = (id: string) => wins.find((w) => w.id === id)!;

  const chrome = (id: string, body: React.ReactNode, width: string) => {
    const w = winByid(id);
    if (!w.open) return null;
    return (
      <section key={id}
        className="absolute select-none rounded-lg border border-[#0a2a6b]/40 bg-[#ece9d8] shadow-[6px_10px_30px_rgba(10,20,60,.45)]"
        style={{ left: w.x, top: w.y, zIndex: w.z, width }}
        onPointerDown={() => focus(id)}>
        <header
          className="flex cursor-grab items-center justify-between rounded-t-[7px] bg-gradient-to-b from-[#3a7bd5] via-[#2361c4] to-[#1b4fae] px-3 py-1.5 text-[13px] font-bold text-white active:cursor-grabbing"
          onPointerDown={(e) => onDown(e, id)} onPointerMove={onMove} onPointerUp={onUp}>
          <span className="drop-shadow">{w.title}</span>
          <span className="flex gap-1.5">
            <button aria-label="Minimize" onClick={() => close(id)} onPointerDown={(e) => e.stopPropagation()}
              className="grid h-5 w-5 place-items-center rounded bg-[#2f6ecb] text-[11px] leading-none border border-white/50 hover:bg-[#4a86e0]">_</button>
            <button aria-label="Close" onClick={() => close(id)} onPointerDown={(e) => e.stopPropagation()}
              className="grid h-5 w-5 place-items-center rounded bg-[#d64541] text-[11px] leading-none border border-white/50 hover:bg-[#e85853]">✕</button>
          </span>
        </header>
        {body}
      </section>
    );
  };

  return (
    <main className="fixed inset-0 overflow-hidden font-sans text-[#1a1a1a]"
          onPointerMove={onMove} onPointerUp={onUp}>
      {/* ── CSS bliss: sky + hills, no imagery ── */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2f7dd8_0%,#5aa7ec_38%,#9fd2f5_62%,#cfeafc_74%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[46%]">
        <div className="absolute -left-[18%] bottom-[-38%] h-[130%] w-[85%] rounded-[50%] bg-[radial-gradient(ellipse_at_38%_18%,#8ecb3a_0%,#5da424_55%,#3c7d12_100%)]" />
        <div className="absolute -right-[22%] bottom-[-48%] h-[125%] w-[90%] rounded-[50%] bg-[radial-gradient(ellipse_at_55%_15%,#7bbc2f_0%,#4f951c_60%,#356f0e_100%)]" />
      </div>
      {/* clouds */}
      <div className="absolute left-[12%] top-[9%] h-10 w-44 rounded-full bg-white/85 blur-[6px]" />
      <div className="absolute left-[19%] top-[6.5%] h-10 w-28 rounded-full bg-white/80 blur-[7px]" />
      <div className="absolute right-[18%] top-[16%] h-8 w-36 rounded-full bg-white/75 blur-[6px]" />

      {/* ── giant serif name over the wallpaper ── */}
      <h1 className="pointer-events-none absolute inset-x-0 top-[7%] text-center leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(20,50,120,.45)]"
          style={{ fontFamily: "var(--font-retro-serif)", fontSize: "clamp(56px,9vw,150px)" }}>
        Krishna Madhan
      </h1>
      <p className="pointer-events-none absolute inset-x-0 top-[7%] mt-[clamp(64px,10vw,168px)] text-center text-sm font-semibold tracking-[0.35em] text-white/90 uppercase">
        KM·OS 26.2 — engineer of machines with feelings
      </p>

      {/* ── desktop icons ── */}
      <div className="absolute left-4 top-4 flex flex-col gap-5">
        {[
          ["about", "TXT", "About.txt"], ["projects", "DIR", "My Projects"],
          ["photos", "IMG", "Photos"], ["terminal", ">_", "cosmo.term"], ["contact", "@", "Contact.exe"],
        ].map(([id, glyph, label]) => (
          <button key={id} onDoubleClick={() => toggle(id)} onClick={() => toggle(id)}
            className="group flex w-20 flex-col items-center gap-1 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/20 font-mono text-sm font-black tracking-tight backdrop-blur-sm transition-transform group-hover:scale-110 group-active:scale-95 border border-white/30">
              {glyph}
            </span>
            <span className="rounded px-1 text-[11px] font-semibold drop-shadow group-hover:bg-[#1b4fae]/80">{label}</span>
          </button>
        ))}
      </div>

      {/* ── windows ── */}
      {chrome("about", (
        <div className="max-h-72 overflow-y-auto bg-white px-4 py-3 font-mono text-[12.5px] leading-relaxed rounded-b-lg">
          {profile.about.map((p, i) => <p key={i} className="mb-3">{p}</p>)}
          <p className="text-[#666]">— EOF —</p>
        </div>
      ), "min(400px, 88vw)")}

      {chrome("projects", (
        <ul className="bg-white rounded-b-lg py-1">
          {profile.projects.map((p) => (
            <li key={p.slug}>
              <a href={`/projects/${p.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2361c4] hover:text-white">
                <span className={`h-2.5 w-2.5 rounded-full ${p.status === "Active" ? "bg-[#3fae2a]" : "bg-[#e0a51e]"}`} />
                <span className="text-[13px] font-semibold">{p.title}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wider opacity-60">{p.status}</span>
              </a>
            </li>
          ))}
        </ul>
      ), "min(360px, 85vw)")}

      {chrome("photos", (
        <div className="rounded-b-lg bg-[#3b3b3b] p-2">
          <div className="relative h-52 w-full overflow-hidden rounded">
            <Image src={PHOTO_ROLL[photo].src} alt={PHOTO_ROLL[photo].name} fill sizes="340px"
              className="object-cover saturate-[1.12] contrast-[1.03]" />
          </div>
          <div className="flex items-center justify-between px-2 pt-2 pb-1 text-[11px] font-semibold text-white/85">
            <button onClick={() => setPhoto((photo + PHOTO_ROLL.length - 1) % PHOTO_ROLL.length)} className="rounded bg-white/15 px-3 py-1 hover:bg-white/25">◀ Prev</button>
            <span className="font-mono">{PHOTO_ROLL[photo].name} · {photo + 1}/{PHOTO_ROLL.length}</span>
            <button onClick={() => setPhoto((photo + 1) % PHOTO_ROLL.length)} className="rounded bg-white/15 px-3 py-1 hover:bg-white/25">Next ▶</button>
          </div>
        </div>
      ), "min(340px, 85vw)")}

      {chrome("terminal", (
        <div className="rounded-b-lg bg-[#0c1220] px-4 py-3 font-mono text-[12px] leading-relaxed text-[#4be1ff]">
          <p className="text-white">$ cosmo status</p>
          <p>KM·OS 26.2 LTS · raspberry-pi-5 · up 214 days</p>
          <p>personality: <span className="text-[#8ecb3a]">curious</span> · mood 0.72 · energy 0.64</p>
          <p>services: banteragent ✓ · cosmo ✓ · agentboard ✓</p>
          <p>memory: 17 games · 56 bt-nodes · ∞ arguments settled</p>
          <p className="text-white">$ <span className="animate-pulse">▌</span></p>
        </div>
      ), "min(420px, 88vw)")}

      {chrome("contact", (
        <div className="rounded-b-lg bg-white px-5 py-4 text-center">
          <p className="text-sm font-semibold">Establish uplink with Krishna?</p>
          <p className="mt-1 text-xs text-[#555]">Robots, AI companions, data platforms, or something weirder.</p>
          <div className="mt-4 flex justify-center gap-2">
            <a href={`mailto:${profile.contact.email}`} className="rounded border border-[#1b4fae] bg-gradient-to-b from-[#3a7bd5] to-[#1b4fae] px-5 py-1.5 text-sm font-bold text-white shadow hover:brightness-110">
              Send email
            </a>
            <button onClick={() => close("contact")} className="rounded border border-[#999] bg-gradient-to-b from-white to-[#dcd9c8] px-5 py-1.5 text-sm font-bold shadow hover:brightness-105">
              Cancel
            </button>
          </div>
        </div>
      ), "min(340px, 85vw)")}

      {/* ── taskbar ── */}
      <footer className="absolute inset-x-0 bottom-0 z-[9999] flex h-11 items-center gap-2 border-t border-white/40 bg-gradient-to-b from-[#2565c7] to-[#173f8f] px-2 text-white">
        <button className="flex h-8 items-center gap-1.5 rounded-md bg-gradient-to-b from-[#8ecb3a] to-[#4f951c] px-4 text-sm font-black italic shadow-inner">
          ⊞ KM
        </button>
        <span className="mx-1 h-7 w-px bg-white/25" />
        <div className="flex flex-1 gap-1.5 overflow-x-auto">
          {wins.map((w) => (
            <button key={w.id} onClick={() => (w.open ? close(w.id) : toggle(w.id))}
              className={`h-8 shrink-0 rounded px-3 text-[11.5px] font-semibold transition-colors ${w.open ? "bg-white/25 shadow-inner" : "bg-white/10 hover:bg-white/20"}`}>
              {w.title.split(" — ")[0]}
            </button>
          ))}
        </div>
        <span className="rounded bg-[#12336f] px-3 py-1.5 text-xs font-bold tabular-nums shadow-inner">{clock} IST</span>
      </footer>
    </main>
  );
}
