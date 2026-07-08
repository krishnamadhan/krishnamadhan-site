import { chromium } from "playwright-core";
const out = "/tmp/claude-1000/-home-pi/54a7a7ec-3f22-4d96-a503-35f029f92db2/scratchpad";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
for (const [name, url] of [
  ["ref-brittany", "https://brittanychiang.com"],
  ["ref-lynn", "https://lynnandtonic.com"],
  ["ref-jhey", "https://jhey.dev"],
]) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(4500);
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log("ok", name);
  } catch (e) { console.log("fail", name, e.message.slice(0, 60)); }
}
await browser.close();
