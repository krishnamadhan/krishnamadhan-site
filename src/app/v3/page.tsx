import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
      {/* v3.1 ALIVE hero: aurora colour field replaces the flat dark backdrop.
          MUST appear before <KMScene /> in the DOM: it is z-0, the KMScene
          canvas is also z-0 but a later sibling, so the wireframe core paints
          ABOVE the aurora. Three drifting colour blobs (screen-blended) over a
          low-opacity ocean texture for realness. Static under reduced-motion. */}
      <div className="v3-aurora" aria-hidden>
        <div className="v3-aurora-tex" style={{ backgroundImage: "url(/photos/hero-bg-ocean.webp)" }} />
        <div className="v3-blob v3-blob-violet" />
        <div className="v3-blob v3-blob-cyan" />
        <div className="v3-blob v3-blob-rose" />
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
