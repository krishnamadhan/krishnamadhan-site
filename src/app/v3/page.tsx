import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Contact, Footer, Hero, Lab, Nav, Professional, Roots, Systems,
} from "./sectionsV4";

// v4 forked scene — neutralised palette, imports only ./scene/* (never the
// originals under src/components/scene, which the live "/" page still uses).
const KMSceneV4 = dynamic(() => import("./scene/KMSceneV4"), { ssr: false });

export const metadata: Metadata = {
  title: "Krishna Madhan — Premium Kinetic Editorial (v3 preview)",
  robots: { index: false, follow: false },
};

export default function V3Page() {
  return (
    <div className="v4-root">
      {/* backdrop: flat charcoal + faint radial warmth + fine grain. No blobs,
          no photo. The forked scene canvas paints above these (z-0 sibling). */}
      <div className="v4-atmos" aria-hidden />
      <div className="v4-grain" aria-hidden />
      <KMSceneV4 />
      <Nav />
      <main className="relative z-10">
        <Hero />
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
