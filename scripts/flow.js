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

  // navega para o produto
  await page.goto(base + "product.html?id=speed-racer", { waitUntil: "networkidle" });
  const title = await page.textContent("h1");
  await page.click("button:has-text('Adicionar ao carrinho')");
  await page.waitForTimeout(300);
  // modal do carrinho aberto?
  const cartOpen = await page.isVisible("#cartModal.open");
  const cartText = await page.textContent("#cartLines");
  const count = await page.textContent(".cart-count");

  // vai para checkout
  await page.click("#cartModal button:has-text('Finalizar pedido')");
  const checkoutOpen = await page.isVisible("#checkoutModal.open");
  const fields = await page.$$eval("#checkoutForm .field", els => els.map(e => e.name));

  // preenche e envia (o /api/notify não existe no server estático → deve cair no catch, sem travar)
  await page.fill("input[name=nome]", "Teste QA");
  await page.fill("input[name=endereco]", "Rua Teste 100");
  await page.fill("input[name=cidade]", "São Paulo / SP");
  await page.fill("input[name=cep]", "01000-000");
  await page.fill("input[name=telefone]", "11999999999");
  page.on("dialog", async d => { console.log("DIALOG:", d.message().slice(0, 80)); await d.dismiss(); });
  await page.click("#checkoutForm button[type=submit]");
  await page.waitForTimeout(800);

  // filtros na loja
  await page.goto(base + "shop.html", { waitUntil: "networkidle" });
  const before = await page.$$eval(".product-card", e => e.length);
  await page.click("button:has-text('Energia')");
  const after = await page.$$eval(".product-card", e => e.length);
  const price = await page.textContent(".product-card .price");

  // limpa carrinho para não sujar testes
  await page.evaluate(() => { localStorage.clear(); });

  await browser.close();
  console.log(JSON.stringify({
    menuOpen, menuClosed, title, cartOpen, cartText: cartText.trim().slice(0, 40), count,
    checkoutOpen, fields, before, after, price: price.trim().slice(0, 30), errors
  }, null, 2));
})();
