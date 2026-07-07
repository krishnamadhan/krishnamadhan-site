import {
  About, Contact, Footer, Hero, Nav, OffDuty, Projects, Roots, Skills, Timeline, Work,
} from "@/components/sections";
import { CommandPalette, CursorGlow, ScrollHUD, SmoothScroll } from "@/components/ui";

export default function Home() {
  return (
    <>
      <div className="grid-floor" aria-hidden />
      <SmoothScroll />
      <CursorGlow />
      <ScrollHUD />
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
