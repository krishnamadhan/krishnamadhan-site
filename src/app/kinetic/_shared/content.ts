/**
 * Kinetic exploration — content adapter. Every /kinetic variant reads ONLY
 * from here so hero facts / systems / contact stay consistent and editable
 * in src/content/profile.ts. No variant hardcodes copy.
 */
import { profile } from "@/content/profile";

export const K = {
  name: profile.v4.hero.lineA + " " + profile.v4.hero.lineB,
  lineA: profile.v4.hero.lineA,
  lineB: profile.v4.hero.lineB,
  positioning: profile.v4.hero.positioning,
  concrete: profile.v4.hero.concrete,
  credibility: profile.v4.hero.credibility,
  heroCards: profile.v4.hero.cards,
  ctaPrimary: profile.v4.hero.ctaPrimary,
  ctaGhost: profile.v4.hero.ctaGhost,
  boot: profile.v5.boot,
  live: profile.v4.lab.live,
  liveLabel: profile.v4.lab.liveLabel,
  operator: profile.v4.operator,
  systems: profile.v4.systems,
  proofCaptions: profile.v5.proofCaptions,
  professional: profile.v4.professional,
  labSection: profile.v4.labSection,
  contact: { ...profile.v4.contact, email: profile.contact.email, socials: profile.contact.socials },
  footerSignoff: profile.v4.contact.footerSignoff,
} as const;

/** Five-second identity facts every hero must surface. */
export const IDENTITY = [
  "Software Engineer · JPMorgan Chase",
  "B.Tech · NIT Trichy",
  "AI systems · Data platforms",
  "Raspberry Pi robot pet · Banter Agent",
  "Living-room lab · online 24/7",
] as const;

export const VARIANTS = [
  { n: 1, slug: "v1", name: "Page Tear", idea: "The editorial cover rips open to the lab beneath" },
  { n: 2, slug: "v2", name: "Fabric", idea: "The identity banner ripples like heavy silk" },
  { n: 3, slug: "v3", name: "Particles", idea: "A core detonates into typography" },
  { n: 4, slug: "v4", name: "Lab Core", idea: "One object becomes every chapter" },
  { n: 5, slug: "v5", name: "Magazine", idea: "A cover that deconstructs into proof" },
  { n: 6, slug: "v6", name: "Pipeline", idea: "Scrolling runs the data machine" },
  { n: 7, slug: "v7", name: "Field Log", idea: "Narrated by the robot, and it watches you" },
  { n: 8, slug: "v8", name: "OS Physics", idea: "Windows with weight, docking on scroll" },
  { n: 9, slug: "v9", name: "Horizontal", idea: "Scenes hand off like film cuts" },
  { n: 10, slug: "v10", name: "Living Room", idea: "His actual lab, drawn as the site map" },
] as const;
