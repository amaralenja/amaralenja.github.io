function renderNav(active){
  const html = `
  <div class="nav"><div class="container">
    <div class="nav-inner">
      <div class="nav-links desktop-only">
        <a href="login.html" class="${active==='login'?'active':''}">ENTRAR</a>
        <a href="shop.html" class="${active==='shop'?'active':''}">LOJA</a>
        <a href="faq.html" class="${active==='faq'?'active':''}">PERGUNTAS</a>
      </div>
      <a href="index.html" class="nav-logo"><img src="assets/img/logo-rm.jpg" alt="Rick And Morty logo"><span>Rick And Morty</span></a>
      <div class="nav-links desktop-only">
        <a href="safety.html" class="${active==='safety'?'active':''}">SEGURANÇA</a>
      </div>
      <div class="nav-actions" style="display:flex;align-items:center;gap:12px;">
        <a href="#" class="cart-btn" onclick="openCart(event)" aria-label="Carrinho"><i data-lucide="shopping-cart"></i><span class="cart-count">0</span></a>
        <button class="menu-btn" onclick="toggleMenu()" aria-label="Menu"><i data-lucide="menu"></i></button>
      </div>
    </div>
    <nav class="mobile-menu" id="mobileMenu">
      <a href="login.html">ENTRAR</a>
      <a href="shop.html">LOJA</a>
      <a href="faq.html">PERGUNTAS</a>
      <a href="safety.html">SEGURANÇA</a>
    </nav>
  </div></div>`;
  document.body.insertAdjacentHTML("afterbegin", html);
}
function toggleMenu(){ document.getElementById("mobileMenu").classList.toggle("open"); }
function renderFooter(){
  document.body.insertAdjacentHTML("beforeend", `
  <footer><div class="container">
    <div class="links"><a href="privacy.html">Política de Privacidade</a><a href="safety.html">Segurança</a><a href="faq.html">Perguntas</a></div>
    <p>© 2025 Rick And Morty. Todos os direitos reservados.</p>
  </div></footer>
  <div class="modal" id="cartModal"><div class="modal-box">
    <button class="modal-close" onclick="closeCart()">×</button>
    <h2>Carrinho de Compras</h2>
    <div id="cartLines"></div>
    <div class="cart-total" id="cartTotal"></div>
    <button class="detail btn" style="width:100%" onclick="openCheckout()">Finalizar Pedido</button>
  </div></div>
  <div class="modal" id="checkoutModal"><div class="modal-box">
    <button class="modal-close" onclick="closeCheckout()">×</button>
    <h2>Dados para Envio</h2>
    <form id="checkoutForm" onsubmit="submitOrder(event)">
      <input type="text" name="nome" placeholder="Nome completo" required style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <input type="text" name="endereco" placeholder="Endereço completo" required style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <input type="text" name="cidade" placeholder="Cidade / Estado" required style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <input type="text" name="cep" placeholder="CEP" required style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <input type="tel" name="telefone" placeholder="Telefone / WhatsApp" required style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <input type="email" name="email" placeholder="E-mail (opcional)" style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:10px;font-size:14px;">
      <textarea name="obs" placeholder="Observações (opcional)" style="width:100%;padding:11px 12px;background:#000;border:1px solid #2a2a2a;border-radius:8px;color:#ededed;margin-bottom:12px;font-size:14px;min-height:60px;"></textarea>
      <button type="submit" class="detail btn" style="width:100%">Enviar Pedido</button>
    </form>
    <p style="margin-top:12px;font-size:11px;opacity:.5;">Compra anônima. Seus dados são enviados apenas para processar o envio.</p>
  </div></div>`);
}
function openCart(e){ if(e) e.preventDefault(); renderCartLines(); document.getElementById("cartModal").classList.add("open"); }
function closeCart(){ document.getElementById("cartModal").classList.remove("open"); }
function renderCartLines(){
  const lines = document.getElementById("cartLines");
  if(!window.CART.length){ lines.innerHTML = "<p style='opacity:.6'>Seu carrinho está vazio.</p>"; document.getElementById("cartTotal").textContent=""; return; }
  lines.innerHTML = window.CART.map(c=>`<div class="cart-line"><span>${c.name}</span><span>${c.btc}</span></div>`).join("");
  document.getElementById("cartTotal").textContent = "Total: " + window.CART.length + " item(s)";
}
function openCheckout(){
  if(!window.CART.length){ alert("Carrinho vazio."); return; }
  closeCart();
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout(){ document.getElementById("checkoutModal").classList.remove("open"); }
async function submitOrder(e){
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
    itens: window.CART.map(c=>c.name+" ("+c.btc+")").join(", ")
  };
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Enviando...";
  try {
    const r = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await r.json();
    if(j.ok){ 
      window.CART = []; saveCart(); closeCheckout();
      alert("Pedido enviado com sucesso! O vendedor foi notificado.");
    } else {
      alert("Pedido registrado, mas a notificação falhou. Verifique a configuração do bot Telegram.");
    }
  } catch(err){
    alert("Erro ao enviar: " + err);
  } finally {
    btn.disabled = false; btn.textContent = "Enviar Pedido";
  }
}
function initCommon(active){
  renderNav(active);
  renderFooter();
  if(window.lucide) lucide.createIcons();
  updateCartCount();
}
function heroCarousel(){
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots button");
  if(!slides.length) return;
  let i = 0;
  function go(n){ slides.forEach((s,idx)=>s.classList.toggle("active", idx===n)); dots.forEach((d,idx)=>d.classList.toggle("active", idx===n)); i=n; }
  document.querySelector(".hero-nav.next")?.addEventListener("click", ()=>go((i+1)%slides.length));
  document.querySelector(".hero-nav.prev")?.addEventListener("click", ()=>go((i-1+slides.length)%slides.length));
  dots.forEach((d,idx)=>d.addEventListener("click", ()=>go(idx)));
  setInterval(()=>go((i+1)%slides.length), 5000);
}