import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://krishnamadhan.com"),
  title: "Krishna Madhan — AI, Robotics & Systems Builder",
  description:
    "Software engineer building AI-native systems, robotic companions, and real-world automation. Bangalore · Tiruvannamalai · NIT Trichy.",
  openGraph: {
    title: "Krishna Madhan — Builder of Future-Facing Systems",
    description:
      "AI-native systems, robotic companions, and real-world automation.",
    url: "https://krishnamadhan.com",
    siteName: "Krishna Madhan",
    images: ["/og.png"], // TODO: generate real OG image before publish
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#04060d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="vignette">
        <a href="#about" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
