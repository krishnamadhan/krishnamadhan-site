import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Contact, Footer, Hero, Lab, Nav, Operator, Professional, Roots, Systems,
} from "./sections";

// v5 "Kinetic Lab OS" — the persistent particle field (KM Core). Client-only.
const KMCore = dynamic(() => import("./scene/KMCore"), { ssr: false });

export const metadata: Metadata = {
  title: "Krishna Madhan — Kinetic Lab OS (v5 preview)",
  robots: { index: false, follow: false },
};

export default function V5Page() {
  return (
    <div className="v4-root">
      {/* flat charcoal + faint radial warmth + fine grain (reused v4 shell).
          The KM Core particle canvas paints above these as a z-0 sibling. */}
      <div className="v4-atmos" aria-hidden />
      <div className="v4-grain" aria-hidden />
      <KMCore />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Operator />
        <Systems />
        <Professional />
        <Lab />
        <Roots />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
