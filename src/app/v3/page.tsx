import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  About, Contact, Footer, Hero, Nav, OffDuty, Projects, Roots, Skills, Timeline, Work,
} from "./sections3";
import { ChapterHUD, CommandPalette, CursorGlow, ScrollHUD, SmoothScroll } from "@/components/ui";

const KMScene = dynamic(() => import("@/components/scene/KMScene"), { ssr: false });

export const metadata: Metadata = {
  title: "Krishna Madhan — Operator Edition (v3 preview)",
  robots: { index: false, follow: false },
};

export default function V3Page() {
  return (
    <>
      {/* Hero backdrop photo + scrim. MUST appear before <KMScene /> in the
          DOM: it is z-0, the KMScene canvas is also z-0 but a later sibling, so
          the wireframe core paints ABOVE this backdrop instead of under it. */}
      <div className="v3-hero-bg" aria-hidden>
        <Image src="/photos/hero-bg-ocean.webp" alt="" fill priority
               sizes="100vw" className="object-cover object-[50%_66%] opacity-90" />
      </div>
      <div className="vignette" aria-hidden />
      <div className="grid-floor" aria-hidden />
      <KMScene />
      {/* Tames the core actor's bloom in the hero only: sits above the canvas
          (z-[5]) but below content (z-10); absolute, so it scrolls away. */}
      <div className="v3-hero-scrim" aria-hidden />
      <SmoothScroll />
      <CursorGlow />
      <ScrollHUD />
      <ChapterHUD />
      <CommandPalette />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Projects />
        <Timeline />
        <Skills />
        <OffDuty />
        <Roots />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
