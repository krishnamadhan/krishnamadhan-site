import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import RetroDesktop from "./RetroDesktop";

/**
 * STYLE VARIANT C — KM·OS retro desktop.
 * Dribbble ref: Daniel Sun's XP-bliss hero. A desktop OS as a portfolio:
 * CSS-drawn bliss hills (no imagery generated), draggable windows,
 * taskbar with live clock. Ties into the existing KM·OS brand.
 */

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-retro-serif" });

export const metadata: Metadata = {
  title: "Krishna Madhan — KM·OS Desktop",
  robots: { index: false },
};

export default function RetroOSPage() {
  return (
    <div className={serif.variable}>
      <RetroDesktop />
    </div>
  );
}
