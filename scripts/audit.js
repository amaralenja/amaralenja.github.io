const { chromium } = require("playwright");

const pages = [
  "index.html",
  "shop.html",
  "product.html?id=green-pill",
  "safety.html",
  "faq.html",
  "login.html",
  "privacy.html",
  "404.html",
];
const viewports = [
  { w: 1440, h: 900, name: "desktop" },
  { w: 1024, h: 800, name: "tablet" },
  { w: 390, h: 844, name: "mobile" },
  { w: 360, h: 740, name: "mobile-sm" },
];
const base = "http://127.0.0.1:8123/";

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", e => errors.push("pageerror: " + e.message));

    for (const p of pages) {
      await page.goto(base + p, { waitUntil: "networkidle" });
      // rola a página para disparar animações/lazy load
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);

      const metrics = await page.evaluate(() => {
        const iw = window.innerWidth;
        const sw = document.documentElement.scrollWidth;
        const bad = [];
        if (sw > iw + 1) {
          document.querySelectorAll("*").forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > iw + 2 || r.left < -2) {
              bad.push(el.tagName.toLowerCase() + "." + String(el.className || "").split(" ")[0] + " → " + Math.round(r.left) + ".." + Math.round(r.right));
            }
          });
        }
        const smallTargets = [];
        document.querySelectorAll("a,button").forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.width < 32 || r.height < 32)) {
            smallTargets.push((el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 24) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
        });
        return {
          sw, iw,
          overflow: bad.slice(0, 6),
          h1: [...document.querySelectorAll("h1")].map(h => h.textContent.trim().slice(0, 40)),
          broken: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute("src")),
          smallTargets: smallTargets.slice(0, 5),
          fontLoaded: document.fonts.check("16px Anton"),
        };
      });

      results.push({ page: p, vp: vp.name, ...metrics, errors: errors.splice(0) });

      const safe = p.replace(/[^a-z0-9]+/gi, "_");
      await page.screenshot({ path: `screenshots/${vp.name}-${safe}.png`, fullPage: true });
    }
    await context.close();
  }

  await browser.close();
  const problems = results.filter(r => r.sw > r.iw + 1 || r.broken.length || r.errors.length || r.h1.length === 0);
  console.log("TOTAL:", results.length, "PROBLEMAS:", problems.length);
  console.log(JSON.stringify(problems, null, 2));
  const fontFail = results.filter(r => !r.fontLoaded).map(r => r.vp + "/" + r.page);
  console.log("FONT ANTON NOT LOADED:", [...new Set(fontFail)].slice(0, 5));
})();
