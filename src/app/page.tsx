import dynamic from "next/dynamic";
import {
  About, Contact, Footer, Hero, KeywordStrip, Nav, OffDuty, Projects, Roots, Skills, Timeline, Work,
} from "@/components/sections";
import { CursorGlow, ScrollHUD } from "@/components/ui";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <>
      <div className="grid-floor" aria-hidden />
      <Scene />
      <CursorGlow />
      <ScrollHUD />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <KeywordStrip />
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
