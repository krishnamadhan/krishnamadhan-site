/**
 * v5 verification capture — targets /v5. Captures the sticky 3-phase hero at
 * real scroll positions (phase1/2/3-slice), each section, plus laptop + mobile.
 * Real-time scrolling; NO --virtual-time-budget; mobile via playwright viewport.
 * Usage: node scripts/tmp-capture-v5.mjs [outDir] [baseUrl]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "artifacts/verification/v10-v5";
const base = (process.argv[3] ?? "http://localhost:3211") + "/v5";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });

const scrollTo = (page, y) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
const scrollToId = (page, id, off = 40) => page.evaluate(([id, off]) => {
  const el = document.getElementById(id);
  window.scrollTo({ top: (el ? el.getBoundingClientRect().top + window.scrollY : 0) + off, behavior: "instant" });
}, [id, off]);

/* ── desktop 1440x900 ── */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE-ERR:", m.text()); });
page.on("pageerror", (e) => console.log("PAGE-ERR:", e.message));
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2800);

const shots = [
  ["01-hero-phase1", () => scrollTo(page, 0)],
  ["02-hero-phase2", () => scrollTo(page, 900 * 0.62)],   // ~p .5 (name split)
  ["03-hero-phase3-slice", () => scrollTo(page, 900 * 1.05)], // ~p .87 (slice)
  ["04-systems", () => scrollToId(page, "systems")],
  ["05-professional", () => scrollToId(page, "professional")],
  ["06-lab", () => scrollToId(page, "lab")],
  ["07-roots", () => scrollToId(page, "roots")],
  ["08-contact", () => scrollToId(page, "contact")],
];
for (const [name, act] of shots) {
  await act();
  await page.waitForTimeout(1900);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log("ok desktop", name);
}
await page.close();

/* ── laptop 1280x800 hero ── */
const lp = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await lp.goto(base, { waitUntil: "networkidle" });
await lp.waitForTimeout(2800);
await lp.screenshot({ path: `${out}/09-laptop-hero.png` });
console.log("ok laptop hero 1280");
await lp.close();

/* ── mobile 390x844 ── */
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.goto(base, { waitUntil: "networkidle" });
await m.waitForTimeout(2800);
await m.screenshot({ path: `${out}/10-mobile-hero.png` });
console.log("ok mobile hero");

await scrollTo(m, 844 * 0.6);
await m.waitForTimeout(1500);
await m.screenshot({ path: `${out}/11-mobile-hero-midscroll.png` });
console.log("ok mobile hero-midscroll");

await scrollToId(m, "systems");
await m.waitForTimeout(1700);
await m.screenshot({ path: `${out}/12-mobile-systems.png` });
console.log("ok mobile systems");

await scrollToId(m, "contact");
await m.waitForTimeout(1700);
await m.screenshot({ path: `${out}/13-mobile-contact.png` });
console.log("ok mobile contact");
await m.close();

await browser.close();
console.log("done");
