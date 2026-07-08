/**
 * Scroll-driven scene verification: drives system chromium via CDP,
 * scrolls to each section, waits for the actor handoff to settle, and
 * screenshots. Also captures mid-transition frames (the seed in flight).
 *
 * Usage: node scripts/capture-scene.mjs [outDir] [baseUrl]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "artifacts/verification/v6-actors";
const base = process.argv[3] ?? "http://localhost:3210";
mkdirSync(out, { recursive: true });

const SECTIONS = ["top", "about", "work", "projects", "timeline", "skills", "offduty", "contact"];

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // let the scene lerp in

const jump = (id, offset = 0) => page.evaluate(([id, offset]) => {
  const el = document.getElementById(id);
  window.scrollTo({ top: (el ? el.offsetTop : 0) + offset, behavior: "instant" });
}, [id, offset]);

let i = 0;
for (const id of SECTIONS) {
  i += 1;
  await jump(id, 40);
  await page.waitForTimeout(2200); // actor bloom + reveals settle
  await page.screenshot({ path: `${out}/${String(i).padStart(2, "0")}-${id}.png` });
  console.log(`✓ ${id}`);
}

// mid-transition: freeze the seed in flight between projects → timeline
await page.evaluate(() => {
  const a = document.getElementById("projects"), b = document.getElementById("timeline");
  const span = b.offsetTop - a.offsetTop;
  // centre lands at 85% through the projects section → frac ≈ 0.5
  window.scrollTo({ top: a.offsetTop + span * 0.85 - window.innerHeight * 0.5 + span * 0, behavior: "instant" });
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/09-seed-inflight.png` });
console.log("✓ seed-inflight");

// rocket mid-section (half altitude)
await page.evaluate(() => {
  const a = document.getElementById("timeline"), b = document.getElementById("skills");
  window.scrollTo({ top: a.offsetTop + (b.offsetTop - a.offsetTop) * 0.5 - window.innerHeight * 0.5, behavior: "instant" });
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/10-rocket-midflight.png` });
console.log("✓ rocket-midflight");

await browser.close();
