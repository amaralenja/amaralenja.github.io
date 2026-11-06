const { chromium } = require("playwright");
const base = "http://127.0.0.1:8123/";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push("pageerror: " + e.message));

  await page.goto(base + "index.html", { waitUntil: "networkidle" });

  // menu mobile
  await page.click("#menuBtn");
  const menuOpen = await page.isVisible("#mobileMenu.open");
  await page.click("#menuBtn");
  const menuClosed = !(await page.isVisible("#mobileMenu.open"));

  // produto -> carrinho
  await page.goto(base + "product.html?id=speed-racer", { waitUntil: "networkidle" });
  const title = await page.textContent("h1");
  await page.click("button:has-text('Adicionar ao carrinho')");
  await page.waitForTimeout(300);
  const cartOpen = await page.isVisible("#cartModal.open");
  const count = await page.textContent(".cart-count");

  // checkout
  await page.click("#cartModal button:has-text('Finalizar pedido')");
  const checkoutOpen = await page.isVisible("#checkoutModal.open");
  const fields = await page.$$eval("#checkoutForm .field", els => els.map(e => e.name));

  await page.fill("input[name=nome]", "Teste QA");
  await page.fill("input[name=endereco]", "Rua Teste 100");
  await page.fill("input[name=cidade]", "São Paulo / SP");
  await page.fill("input[name=cep]", "01000-000");
  await page.fill("input[name=telefone]", "11999999999");
  await page.click("#checkoutForm button[type=submit]");
  await page.waitForTimeout(1200);

  const statusVisible = await page.isVisible("#checkoutStatus");
  const statusText = (await page.textContent("#checkoutStatus"))?.replace(/\s+/g, " ").trim().slice(0, 90);
  const formHidden = await page.isHidden("#checkoutForm");
  await page.screenshot({ path: "screenshots/checkout-status.png" });

  // retry restores the form
  const retryBtn = await page.$("#checkoutStatus button");
  if (retryBtn) await retryBtn.click();
  const formBack = await page.isVisible("#checkoutForm");

  // filtros
  await page.goto(base + "shop.html", { waitUntil: "networkidle" });
  const before = await page.$$eval(".product-card", e => e.length);
  await page.click("button:has-text('Energia')");
  const after = await page.$$eval(".product-card", e => e.length);

  await page.evaluate(() => localStorage.clear());
  await browser.close();

  console.log(JSON.stringify({
    menuOpen, menuClosed, title, cartOpen, count, checkoutOpen, fields,
    statusVisible, statusText, formHidden, formBack, before, after, errors
  }, null, 2));
})();
