const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", e => errs.push(String(e)));

  await page.goto("https://amaralenja.github.io/rick-and-morty/shop.html", { waitUntil: "networkidle" });
  const price = await page.textContent(".product-card .price");
  const cards = await page.locator(".product-card").count();
  await page.evaluate(() => addToCart("bud"));
  await page.click(".cart-btn[title='Carrinho']");
  await page.waitForTimeout(400);
  const total = (await page.textContent("#cartTotal")).trim();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log({ cards, price, total, overflow, errs });
  await browser.close();
  process.exit(0);
})();
