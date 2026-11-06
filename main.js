/* ============================================================
   Rick And Morty — navegação, rodapé, carrinho e checkout
   ============================================================ */

function renderNav(active) {
  const link = (href, key, label) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;

  const html = `
  <div class="nav"><div class="container">
    <div class="nav-inner">
      <div class="nav-links">
        ${link("shop.html", "shop", "Loja")}
        ${link("safety.html", "safety", "Segurança")}
        ${link("faq.html", "faq", "Perguntas")}
      </div>
      <a href="index.html" class="nav-logo" aria-label="Rick And Morty — início">
        <img src="assets/img/logo-rm.webp" alt="Rick And Morty" width="1000" height="307">
      </a>
      <div class="nav-actions">
        <a href="login.html" class="cart-btn" aria-label="Entrar" title="Entrar">
          <i data-lucide="user-round"></i>
        </a>
        <a href="#" class="cart-btn" onclick="openCart(event)" aria-label="Abrir carrinho" title="Carrinho">
          <i data-lucide="shopping-cart"></i><span class="cart-count" style="display:none">0</span>
        </a>
        <button class="menu-btn" onclick="toggleMenu()" aria-label="Abrir menu" aria-expanded="false" id="menuBtn">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>
    <nav class="mobile-menu" id="mobileMenu">
      ${link("index.html", "home", "Início")}
      ${link("shop.html", "shop", "Loja")}
      ${link("safety.html", "safety", "Segurança")}
      ${link("faq.html", "faq", "Perguntas")}
      ${link("login.html", "login", "Entrar")}
    </nav>
  </div></div>`;

  document.body.insertAdjacentHTML("afterbegin", html);
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("menuBtn");
  const open = menu.classList.toggle("open");
  if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
}

function renderFooter() {
  document.body.insertAdjacentHTML("beforeend", `
  <footer><div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/img/logo-rm.webp" alt="Rick And Morty" width="1000" height="307">
        <p>Pílulas premium de outro universo. Envio discreto, pagamento em cripto e atendimento em português.</p>
      </div>
      <div class="footer-col">
        <h5>Loja</h5>
        <a href="shop.html">Todos os produtos</a>
        <a href="index.html#como-funciona">Como funciona</a>
        <a href="faq.html">Dúvidas frequentes</a>
      </div>
      <div class="footer-col">
        <h5>Informações</h5>
        <a href="safety.html">Segurança</a>
        <a href="privacy.html">Política de privacidade</a>
        <a href="login.html">Minha conta</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Rick And Morty. Todos os direitos reservados.</span>
      <div class="pay-chips">
        <span class="pay-chip"><i data-lucide="bitcoin"></i> BTC</span>
        <span class="pay-chip"><i data-lucide="gem"></i> ETH</span>
        <span class="pay-chip"><i data-lucide="shield-check"></i> Compra anônima</span>
      </div>
    </div>
  </div></footer>

  <div class="modal" id="cartModal" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <div class="modal-box">
      <button class="modal-close" onclick="closeCart()" aria-label="Fechar carrinho">×</button>
      <h2 id="cartTitle">Carrinho</h2>
      <div id="cartLines"></div>
      <div class="cart-total" id="cartTotal"></div>
      <button class="btn" style="width:100%" onclick="openCheckout()">Finalizar pedido</button>
    </div>
  </div>

  <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
    <div class="modal-box">
      <button class="modal-close" onclick="closeCheckout()" aria-label="Fechar">×</button>
      <h2 id="checkoutTitle">Dados para envio</h2>
      <form id="checkoutForm" onsubmit="submitOrder(event)">
        <input class="field" type="text" name="nome" placeholder="Nome completo" required autocomplete="name">
        <input class="field" type="text" name="endereco" placeholder="Endereço completo" required autocomplete="street-address">
        <input class="field" type="text" name="cidade" placeholder="Cidade / Estado" required autocomplete="address-level2">
        <input class="field" type="text" name="cep" placeholder="CEP" required autocomplete="postal-code" inputmode="numeric">
        <input class="field" type="tel" name="telefone" placeholder="Telefone / WhatsApp" required autocomplete="tel">
        <input class="field" type="email" name="email" placeholder="E-mail (opcional)" autocomplete="email">
        <textarea class="field" name="obs" placeholder="Observações (opcional)"></textarea>
        <button type="submit" class="btn" style="width:100%">Enviar pedido</button>
      </form>
      <p class="form-note">Compra anônima. Os dados são usados apenas para processar o envio.</p>
    </div>
  </div>`);
}

function openCart(e) {
  if (e) e.preventDefault();
  renderCartLines();
  document.getElementById("cartModal").classList.add("open");
}
function closeCart() { document.getElementById("cartModal").classList.remove("open"); }

function renderCartLines() {
  const lines = document.getElementById("cartLines");
  const total = document.getElementById("cartTotal");
  if (!window.CART.length) {
    lines.innerHTML = "<p style='color:var(--muted)'>Seu carrinho está vazio.</p>";
    total.textContent = "";
    return;
  }
  lines.innerHTML = window.CART.map(c => `<div class="cart-line"><span>${c.name}</span><span>${c.btc}</span></div>`).join("");
  total.textContent = "Total: " + window.CART.length + " item(ns)";
}

function openCheckout() {
  if (!window.CART.length) { alert("Seu carrinho está vazio."); return; }
  closeCart();
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout() { document.getElementById("checkoutModal").classList.remove("open"); }

async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const payload = {
    nome: data.get("nome"),
    endereco: data.get("endereco"),
    cidade: data.get("cidade"),
    cep: data.get("cep"),
    telefone: data.get("telefone"),
    email: data.get("email"),
    obs: data.get("obs"),
    itens: window.CART.map(c => c.name + " (" + c.btc + ")").join(", ")
  };
  const btn = form.querySelector("button[type=submit]");
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Enviando...";
  try {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    let j = {};
    try { j = JSON.parse(await r.text()); } catch (_) { j = {}; }
    if (r.ok && j.ok) {
      window.CART = [];
      saveCart();
      closeCheckout();
      form.reset();
      alert("Pedido enviado! O vendedor foi notificado.");
    } else {
      alert("Não conseguimos enviar o pedido agora. Tente novamente em instantes ou fale com o suporte.");
    }
  } catch (err) {
    alert("Falha de conexão ao enviar o pedido. Verifique sua internet e tente de novo.");
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}

function initCommon(active) {
  renderNav(active);
  renderFooter();
  if (window.lucide) lucide.createIcons();
  updateCartCount();

  // animações de entrada (só quando há suporte, sem esconder conteúdo se falhar)
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("in"); });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }

  // fecha menu ao clicar em um link
  document.querySelectorAll("#mobileMenu a").forEach(a =>
    a.addEventListener("click", () => document.getElementById("mobileMenu")?.classList.remove("open"))
  );
}

/* Compat: mantido para páginas antigas que ainda chamam o carrossel */
function heroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;
  const dots = document.querySelectorAll(".hero-dots button");
  let i = 0;
  const go = n => {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === n));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === n));
    i = n;
  };
  document.querySelector(".hero-nav.next")?.addEventListener("click", () => go((i + 1) % slides.length));
  document.querySelector(".hero-nav.prev")?.addEventListener("click", () => go((i - 1 + slides.length) % slides.length));
  dots.forEach((d, idx) => d.addEventListener("click", () => go(idx)));
  setInterval(() => go((i + 1) % slides.length), 5000);
}
