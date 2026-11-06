/* ============================================================
   Rick And Morty — navegação, rodapé, carrinho e checkout WhatsApp
   ============================================================ */

function waLink(text) {
  return "https://wa.me/" + window.WHATSAPP + "?text=" + encodeURIComponent(text || "");
}

function renderNav(active) {
  const link = (href, key, label) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;

  const html = `
  <div class="nav"><div class="container">
    <div class="nav-inner">
      <div class="nav-links">
        ${link("/loja/", "shop", "Loja")}
      </div>
      <a href="/" class="nav-logo" aria-label="Rick And Morty — início">
        <img src="/assets/img/logo-rm.webp" alt="Rick And Morty" width="1000" height="307">
      </a>
      <div class="nav-actions">
        <a href="${waLink("Olá! Quero fazer um pedido.")}" target="_blank" rel="noopener" class="cart-btn" aria-label="Falar no WhatsApp" title="Falar no WhatsApp">
          <i data-lucide="message-circle"></i>
        </a>
        <a href="#" class="cart-btn" onclick="openCart(event)" aria-label="Abrir carrinho" title="Carrinho">
          <i data-lucide="shopping-cart"></i><span class="cart-count" style="display:none">0</span>
        </a>
      </div>
    </div>
  </div></div>`;

  document.body.insertAdjacentHTML("afterbegin", html);
}

function toggleMenu() {
  /* sem menu sanduíche: a navegação fica no ícone de WhatsApp e no carrinho */
}

function renderFooter() {
  document.body.insertAdjacentHTML("beforeend", `
  <footer><div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="/assets/img/logo-rm.webp" alt="Rick And Morty" width="1000" height="307">
        <p>Substâncias de outro universo. Envio rápido e atendimento em português.</p>
      </div>
      <div class="footer-col">
        <h5>Loja</h5>
        <a href="/loja/">Todos os produtos</a>
        ${(window.CATEGORIES || []).map(c => `<a href="/loja/#${c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")}">${c}</a>`).join("")}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Rick And Morty. Todos os direitos reservados.</span>
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
        <textarea class="field" name="obs" placeholder="Observações (opcional)"></textarea>
        <button type="submit" class="btn" style="width:100%">Enviar pedido no WhatsApp</button>
      </form>
      <div class="form-status" id="checkoutStatus" hidden></div>
      <p class="form-note" id="checkoutNote">O pedido abre no WhatsApp com todos os itens, o total e o seu endereço já preenchidos.</p>
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
  if (!lines || !total) return;
  if (!window.CART.length) {
    lines.innerHTML = "<p style='color:var(--muted)'>Seu carrinho está vazio.</p>";
    total.textContent = "";
    return;
  }
  lines.innerHTML = window.CART.map(c => `
    <div class="cart-line">
      <div class="cart-line-info">
        <span class="cart-line-name">${c.name}</span>
        <span class="cart-line-unit">${c.unit || ""} · ${money(c.price)}</span>
      </div>
      <div class="cart-line-qty">
        <button type="button" onclick="changeQty('${c.id}', -1)" aria-label="Diminuir">−</button>
        <span>${c.qty}</span>
        <button type="button" onclick="changeQty('${c.id}', 1)" aria-label="Aumentar">+</button>
      </div>
      <span class="cart-line-price">${money(c.price * c.qty)}</span>
      <button type="button" class="cart-line-del" onclick="removeFromCart('${c.id}')" aria-label="Remover">×</button>
    </div>`).join("");
  total.innerHTML = `<span>Total</span><strong>${money(cartTotal())}</strong>`;
}

function openCheckout() {
  if (!window.CART.length) { alert("Seu carrinho está vazio."); return; }
  closeCart();
  retryCheckout();
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("open");
  const status = document.getElementById("checkoutStatus");
  const form = document.getElementById("checkoutForm");
  if (status) { status.hidden = true; status.innerHTML = ""; }
  if (form) form.hidden = false;
}

function lastOrderUrl() { return window.__lastOrderUrl || waLink("Olá! Quero fazer um pedido."); }

function showCheckoutStatus(kind, title, text) {
  const form = document.getElementById("checkoutForm");
  const status = document.getElementById("checkoutStatus");
  if (!form || !status) return;
  form.hidden = true;
  status.hidden = false;
  const note = document.getElementById("checkoutNote");
  if (note) note.hidden = true;
  status.className = "form-status " + kind;
  const icon = kind === "ok" ? "party-popper" : "wifi-off";
  status.innerHTML = `
    <i data-lucide="${icon}"></i>
    <h3>${title}</h3>
    <p>${text}</p>
    <a class="btn" href="${lastOrderUrl()}" target="_blank" rel="noopener">
      ${kind === "ok" ? "Abrir WhatsApp" : "Tentar de novo"}
    </a>`;
  if (window.lucide) lucide.createIcons();
}

function retryCheckout() {
  const status = document.getElementById("checkoutStatus");
  const form = document.getElementById("checkoutForm");
  if (status) { status.hidden = true; status.className = "form-status"; status.innerHTML = ""; }
  if (form) form.hidden = false;
  const note = document.getElementById("checkoutNote");
  if (note) note.hidden = false;
}

function buildOrderText(d) {
  const itens = window.CART.map(c =>
    `• ${c.qty}x ${c.name}${c.unit ? " (" + c.unit + ")" : ""} — ${money(c.price * c.qty)}`
  ).join("\n");

  return [
    "*NOVO PEDIDO — RICK AND MORTY*",
    "",
    "*Itens:*",
    itens,
    "",
    `*Total: ${money(cartTotal())}*`,
    "",
    "*Dados de envio:*",
    `Nome: ${d.nome}`,
    `Endereço: ${d.endereco}`,
    `Cidade/UF: ${d.cidade}`,
    `CEP: ${d.cep}`,
    `Telefone: ${d.telefone}`,
    d.obs ? `Observações: ${d.obs}` : "Observações: —"
  ].join("\n");
}

function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const d = {
    nome: data.get("nome"),
    endereco: data.get("endereco"),
    cidade: data.get("cidade"),
    cep: data.get("cep"),
    telefone: data.get("telefone"),
    obs: data.get("obs")
  };

  window.__lastOrderUrl = waLink(buildOrderText(d));

  const win = window.open(window.__lastOrderUrl, "_blank");
  if (!win) {
    showCheckoutStatus("err", "Bloqueio de pop-up", "Toque no botão abaixo para abrir o WhatsApp e enviar o pedido.");
    return;
  }

  window.CART = [];
  saveCart();
  updateCartCount();
  form.reset();
  showCheckoutStatus(
    "ok",
    "Pedido montado",
    "Se o WhatsApp não abriu, toque no botão abaixo. Só falta enviar a mensagem — respondemos em até 30 minutos."
  );
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
