/**
 * Kinetic variant capture: for each /kinetic/vN, screenshot hero (top),
 * mid-hero-transformation, and content section at 3 widths.
 * Usage: node scripts/capture-kinetic.mjs [baseUrl] [outDir] [only]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3210";
const out = process.argv[3] ?? "artifacts/kinetic";
const only = process.argv[4]; // e.g. "v3" to recapture one variant
mkdirSync(out, { recursive: true });

const WIDTHS = [
  { tag: "1440", width: 1440, height: 900 },
  { tag: "1280", width: 1280, height: 800 },
  { tag: "390", width: 390, height: 844 },
];
const VARIANTS = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]
  .filter((v) => !only || v === only);

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w.width, height: w.height } });
  for (const v of VARIANTS) {
    await page.goto(`${base}/kinetic/${v}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${out}/${v}-${w.tag}-1hero.png` });
    // mid-transformation: 55% through the first sticky span
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.7, behavior: "instant" }));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${out}/${v}-${w.tag}-2mid.png` });
    // content zone: 62% of the document
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.62, behavior: "instant" }));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${out}/${v}-${w.tag}-3content.png` });
    console.log(`✓ ${v} @ ${w.tag}`);
  }
  await page.close();
}
await browser.close();
console.log("done");
