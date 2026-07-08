/**
 * v4 verification capture — targets /v3, scrolls to each new section id,
 * plus mobile hero/midscroll/systems/contact via playwright viewport emulation.
 * Mobile uses viewport {width:390} (NOT --window-size; headless chromium
 * enforces a 500px min window). No --virtual-time-budget (breaks the scene).
 * Usage: node scripts/tmp-capture-v3.mjs [outDir] [baseUrl]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "artifacts/verification/v9-v4";
const base = (process.argv[3] ?? "http://localhost:3211") + "/v3";
mkdirSync(out, { recursive: true });

const SECTIONS = ["top", "systems", "professional", "lab", "roots", "contact"];

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
  console.log(`ok desktop ${id}`);
}
// desktop hero mid-scroll: proves portrait rotation / step-aside
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: "instant" }));
await page.waitForTimeout(1400);
await page.screenshot({ path: `${out}/07-hero-midscroll.png` });
console.log("ok desktop hero-midscroll");
await page.close();

/* ── mobile 390x844: hero + midscroll + systems + contact ── */
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.goto(base, { waitUntil: "networkidle" });
await m.waitForTimeout(2600);
await m.screenshot({ path: `${out}/08-mobile-hero.png` });
console.log("ok mobile hero");

await m.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.6, behavior: "instant" }));
await m.waitForTimeout(1400);
await m.screenshot({ path: `${out}/09-mobile-midscroll.png` });
console.log("ok mobile hero-midscroll");

const mjump = (id) => m.evaluate((id) => {
  const el = document.getElementById(id);
  window.scrollTo({ top: (el ? el.offsetTop : 0) + 40, behavior: "instant" });
}, id);

await mjump("systems");
await m.waitForTimeout(1600);
await m.screenshot({ path: `${out}/10-mobile-systems.png` });
console.log("ok mobile systems");

await mjump("contact");
await m.waitForTimeout(1600);
await m.screenshot({ path: `${out}/11-mobile-contact.png` });
console.log("ok mobile contact");
await m.close();

await browser.close();
console.log("done");
