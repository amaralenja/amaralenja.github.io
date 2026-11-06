const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", e => errs.push(String(e)));

  await page.goto("http://127.0.0.1:8123/shop.html", { waitUntil: "networkidle" });
  await page.screenshot({ path: "screenshots/x-shop.png", fullPage: false });

  await page.evaluate(() => { addToCart("bud"); addToCart("bud"); addToCart("pen"); });
  await page.click(".cart-btn[title='Carrinho']");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "screenshots/x-cart.png" });

  const total = await page.textContent("#cartTotal");
  await page.click("#cartModal .btn");
  await page.waitForTimeout(300);
  await page.fill("input[name=nome]", "João da Silva");
  await page.fill("input[name=endereco]", "Rua das Flores, 120, apto 32");
  await page.fill("input[name=cidade]", "Porto Alegre / RS");
  await page.fill("input[name=cep]", "90000-000");
  await page.fill("input[name=telefone]", "51999998888");
  await page.fill("textarea[name=obs]", "Entregar após 18h");

  let opened = null;
  await page.exposeFunction("__capture", url => { opened = url; });
  await page.evaluate(() => { window.open = url => { window.__capture(url); return {}; }; });

  await page.click("#checkoutForm button[type=submit]");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "screenshots/x-checkout.png" });

  const countAfter = await page.evaluate(() => cartCount());
  const msg = opened ? decodeURIComponent(opened.split("&text=")[1] || opened.split("?text=")[1]) : null;

  await page.goto("http://127.0.0.1:8123/index.html", { waitUntil: "networkidle" });
  await page.screenshot({ path: "screenshots/x-home.png", fullPage: true });

  const m = await ctx.newPage();
  await m.setViewportSize({ width: 390, height: 844 });
  await m.goto("http://127.0.0.1:8123/shop.html", { waitUntil: "networkidle" });
  await m.screenshot({ path: "screenshots/x-shop-mobile.png", fullPage: false });
  await m.goto("http://127.0.0.1:8123/index.html", { waitUntil: "networkidle" });
  await m.screenshot({ path: "screenshots/x-home-mobile.png", fullPage: true });

  console.log("URL:", opened);
  console.log("TOTAL:", total);
  console.log("COUNT AFTER:", countAfter);
  console.log("MSG:\n" + msg);
  console.log("ERROS:", errs);
  await browser.close();
  process.exit(0);
})();
