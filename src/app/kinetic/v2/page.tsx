"use client";

/**
 * KINETIC V2 — Fabric / Flag Hero
 * The portrait hangs as a woven banner: an R3F plane whose vertices ride a
 * sine field. Idle, it breathes; scroll fast and the velocity feeds the wave
 * amplitude so the whole banner flutters like heavy silk, then spring-settles.
 * The headline letters ride the same wind (per-letter phase offset) and the
 * headline skews with scroll velocity. Fallback: static portrait, CSS-waved type.
 */
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  motion, useScroll, useVelocity, useSpring, useTransform, useTime,
  useMotionValueEvent, useReducedMotion,
} from "framer-motion";
import { K } from "../_shared/content";
import { KFrame, Eyebrow, CredStrip, LabStatus, SystemCard, ProfessionalBlock, ContactBlock } from "../_shared/ui";
import { SafeCanvas, useIsMobile, damp } from "../_shared/three";

/* ---------- cloth ---------- */
function ClothBanner({ gust }: { gust: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const isMobile = useIsMobile();
  const seg = isMobile ? [22, 28] : [36, 46];
  const tex = useLoader(THREE.TextureLoader, "/photos/portrait-hero.webp");
  tex.colorSpace = THREE.SRGBColorSpace;
  const geo = useMemo(() => new THREE.PlaneGeometry(3.1, 4.1, seg[0], seg[1]), [seg[0], seg[1]]);
  const base = useMemo(() => geo.attributes.position.array.slice() as Float32Array, [geo]);
  const amp = useRef(0.055);

  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime;
    amp.current = damp(amp.current, 0.055 + gust.current * 0.42, 3.2, dt);
    const pos = mesh.current!.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i], y = base[i + 1];
      const pin = (x + 1.55) / 3.1; // left edge pinned like a flag on a pole
      arr[i + 2] =
        (Math.sin(x * 2.4 + t * 2.1 + y * 0.9) * 0.55 +
          Math.sin(y * 3.1 - t * 1.4 + x * 1.2) * 0.3 +
          Math.sin(x * 0.9 + t * 0.7) * 0.6) * amp.current * (0.25 + pin * 0.75);
    }
    pos.needsUpdate = true;
    mesh.current!.rotation.y = damp(mesh.current!.rotation.y, pointer.x * 0.16, 2.5, dt);
    mesh.current!.rotation.x = damp(mesh.current!.rotation.x, -pointer.y * 0.06, 2.5, dt);
  });

  return (
    <mesh ref={mesh} geometry={geo}>
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/* ---------- waving headline ---------- */
function WindLetter({ ch, i, on }: { ch: string; i: number; on: boolean }) {
  const time = useTime();
  const y = useTransform(time, (t) => (on ? Math.sin(t / 380 + i * 0.55) * 6 : 0));
  const r = useTransform(time, (t) => (on ? Math.sin(t / 500 + i * 0.55) * 1.2 : 0));
  return (
    <motion.span style={{ y, rotate: r }} className="inline-block will-change-transform">
      {ch === " " ? " " : ch}
    </motion.span>
  );
}

export default function V2() {
  const reduced = useReducedMotion();
  const gust = useRef(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const velSpring = useSpring(vel, { stiffness: 120, damping: 30 });
  const skew = useTransform(velSpring, [-1600, 0, 1600], [5, 0, -5]);
  const stretch = useTransform(velSpring, [-1600, 0, 1600], [1.04, 1, 1.04]);
  const cardSkew = useTransform(velSpring, [-1600, 0, 1600], [0.8, 0, -0.8]);
  useMotionValueEvent(vel, "change", (v) => {
    gust.current = Math.min(Math.abs(v) / 1400, 1.4);
  });

  const name = `${K.lineA} ${K.lineB}`;
  return (
    <KFrame variant={2}>
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-24 md:px-12">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[46%]">
          <SafeCanvas
            className="h-full w-full opacity-90"
            camera={{ position: [0, 0, 4.6], fov: 42 }}
            fallback={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/photos/portrait-hero.webp" alt="" className="h-full w-full object-cover opacity-80" />
            }
          >
            <ClothBanner gust={gust} />
          </SafeCanvas>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-v4-bg via-v4-bg/70 to-transparent md:via-v4-bg/40" aria-hidden />

        <div className="relative z-10">
          <Eyebrow tone="amber">{K.boot}</Eyebrow>
        </div>
        <div className="relative z-10 max-w-5xl">
          <motion.h1 style={reduced ? undefined : { skewX: skew, scaleY: stretch, transformOrigin: "left bottom" }}
            className="font-display text-[13.5vw] font-medium leading-[0.9] tracking-tighter text-v4-ink md:text-[8.2vw]">
            {name.split("").map((ch, i) => (
              <WindLetter key={i} ch={ch} i={i} on={!reduced} />
            ))}
          </motion.h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-v4-body">{K.concrete}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href="#systems" className="rounded-full bg-v4-ink px-7 py-3 font-display text-sm tracking-[0.1em] text-v4-bg transition-transform hover:scale-[1.03]">
              {K.ctaPrimary}
            </a>
            <a href={`mailto:${K.contact.email}`} className="rounded-full border border-v4-line px-7 py-3 font-display text-sm tracking-[0.1em] text-v4-body hover:text-v4-ink">
              {K.ctaGhost}
            </a>
            <span className="hidden font-display text-[10px] tracking-[0.25em] text-v4-mute lg:block">
              SCROLL FAST — THE BANNER CATCHES THE WIND
            </span>
          </div>
          <CredStrip className="mt-8" />
          <LabStatus className="mt-4" />
        </div>
      </section>

      {/* SYSTEMS */}
      <section id="systems" className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow tone="amber">{K.systems.label}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-v4-ink md:text-4xl">{K.systems.title}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-v4-body">{K.systems.intro}</p>
          <div className="mt-10 space-y-5">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} style={reduced ? undefined : { skewY: cardSkew }}
                initial={reduced ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
                <SystemCard i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-v4-line px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl"><ProfessionalBlock /></div>
      </section>

      <section className="border-t border-v4-line px-6 py-24 md:px-12 md:py-32">
        <ContactBlock />
      </section>
    </KFrame>
  );
}
