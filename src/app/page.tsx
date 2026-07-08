import dynamic from "next/dynamic";
import {
  About, Contact, Footer, Hero, Nav, OffDuty, Projects, Roots, Skills, Timeline, Work,
} from "@/components/sections";
import { ChapterHUD, CommandPalette, CursorGlow, ScrollHUD, SmoothScroll } from "@/components/ui";

const KMScene = dynamic(() => import("@/components/scene/KMScene"), { ssr: false });

export default function Home() {
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
