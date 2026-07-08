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
      <div className="vignette" aria-hidden />
      <div className="grid-floor" aria-hidden />
      <KMScene />
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
