import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinetic Lab — Krishna Madhan (exploration)",
  description: "Kinetic portfolio direction exploration — 10 variants.",
  robots: { index: false, follow: false },
};

export default function KineticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
