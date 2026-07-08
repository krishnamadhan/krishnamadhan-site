/**
 * v3 verification capture — targets /v3, scrolls to each section id,
 * plus mobile hero + one content section via playwright viewport emulation.
 * Usage: node scripts/tmp-capture-v3.mjs [outDir] [baseUrl]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "artifacts/verification/v8-v3";
const base = (process.argv[3] ?? "http://localhost:3211") + "/v3";
mkdirSync(out, { recursive: true });

const SECTIONS = ["top", "about", "work", "projects", "timeline", "skills", "offduty", "roots", "contact"];

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });

/* ── desktop 1440x900 at every section ── */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);

const jump = (id, offset = 0) => page.evaluate(([id, offset]) => {
  const el = document.getElementById(id);
  window.scrollTo({ top: (el ? el.offsetTop : 0) + offset, behavior: "instant" });
}, [id, offset]);

let i = 0;
for (const id of SECTIONS) {
  i += 1;
  await jump(id, id === "top" ? 0 : 40);
  await page.waitForTimeout(1900);
  await page.screenshot({ path: `${out}/${String(i).padStart(2, "0")}-${id}.png` });
  console.log(`✓ desktop ${id}`);
}
// hero mid-scroll: show portrait "stepping aside"
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.55, behavior: "instant" }));
await page.waitForTimeout(1400);
await page.screenshot({ path: `${out}/10-hero-midscroll.png` });
console.log("✓ desktop hero-midscroll");
await page.close();

/* ── mobile 390x844: hero + one content section (offduty) ── */
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.goto(base, { waitUntil: "networkidle" });
await m.waitForTimeout(2600);
await m.screenshot({ path: `${out}/11-mobile-hero.png` });
console.log("✓ mobile hero");
// mobile hero mid-scroll (~60vh): must visibly show the portrait rotation vs 11
await m.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.6, behavior: "instant" }));
await m.waitForTimeout(1400);
await m.screenshot({ path: `${out}/13-mobile-midscroll.png` });
console.log("✓ mobile hero-midscroll");

await m.evaluate(() => {
  const el = document.getElementById("offduty");
  window.scrollTo({ top: (el ? el.offsetTop : 0) + 40, behavior: "instant" });
});
await m.waitForTimeout(1600);
await m.screenshot({ path: `${out}/12-mobile-offduty.png` });
console.log("✓ mobile offduty");
await m.close();

await browser.close();
console.log("done");
