/* ============================================================
   Rick And Morty — catálogo (preços em R$)
   5 linhas: Canabis · Sintéticos · Emagrecedores · Remédios · Psicodélicos
   ============================================================ */

window.WHATSAPP = "5551981981089";

window.CATEGORIES = ["Canabis", "Sintéticos", "Emagrecedores", "Remédios", "Psicodélicos"];

window.PRODUCTS = [
  {
    id: "bud",
    name: "GRAMA DO RICK",
    tag: "COLHEITA DA C-137",
    rating: 4.7,
    reviews: 8,
    price: 150,
    unit: "1 g",
    desc: "Flor cultivada indoor, curada por 60 dias e trimada à mão. Aroma cítrico com fundo terroso, buds densos e cobertos de tricomas. Chega prensada a vácuo, dentro de um pote opaco — sem cheiro e sem identificação.",
    img: "assets/img/bud.webp",
    category: "Canabis",
    badge: "Colheita nova"
  },
  {
    id: "vape",
    name: "CANETA DO MORTY",
    tag: "SEM FUMAÇA, SEM CHEIRO",
    rating: 4.6,
    reviews: 6,
    price: 220,
    unit: "0,5 ml",
    desc: "Óleo de espectro completo em cartucho descartável, com 0,5 ml de extrato purificado. Puxada suave, efeito em menos de dois minutos e nenhum cheiro no ambiente. Ideal para quem precisa de discrição total.",
    img: "assets/img/vape.webp",
    category: "Canabis",
    badge: "Sem cheiro"
  },
  {
    id: "green-pill",
    name: "PÍLULA VERDE",
    tag: "O DRINQUE FINAL PERFEITO",
    rating: 4.5,
    reviews: 12,
    price: 90,
    unit: "10 un",
    desc: "Ótima qualidade por um preço acessível. Recomendada para encontros sociais, esta pílula verde dá a sensação de álcool sem a ressaca. Experiência pura, limpa e de alta qualidade garantida.",
    img: "assets/img/green-pill.webp",
    category: "Remédios",
    badge: "Clássico"
  },
  {
    id: "speed-racer",
    name: "CORREDOR VELOZ",
    tag: "ACELERE SUA NOITE",
    rating: 5.0,
    reviews: 15,
    price: 130,
    unit: "10 un",
    desc: "O Corredor Veloz é nossa opção premium para quem quer ir de 0 a 100 em segundos. Sinta um rush como dirigir um carro esportivo, com efeitos que duram até 6 horas. Contém 80 mg de energia pura por pílula.",
    img: "assets/img/speed-racer.webp",
    category: "Remédios",
    badge: "Mais vendido"
  },
  {
    id: "crystal",
    name: "CRISTAL C-137",
    tag: "PUREZA DE LABORATÓRIO",
    rating: 4.9,
    reviews: 9,
    price: 280,
    unit: "1 g",
    desc: "Cristal sintético de grau laboratorial, 98% de pureza verificada por reagente. Efeito limpo, subida rápida e sem o residual de lote sujo. Vendido em porções seladas de 1 g com lacre inviolável.",
    img: "assets/img/crystal.webp",
    category: "Sintéticos",
    badge: "Puro"
  },
  {
    id: "white-ghost",
    name: "FANTASMA BRANCO",
    tag: "DANÇE COM A MORTE",
    rating: 4.8,
    reviews: 11,
    price: 190,
    unit: "10 un",
    desc: "Não é para os fracos. O Fantasma Branco entrega uma experiência de outro mundo que leva você ao limite e de volta. Nossa fórmula mais forte, apenas para usuários experientes. Transcendência pura em forma de pílula.",
    img: "assets/img/white-ghost.webp",
    category: "Remédios",
    badge: "Mais forte"
  },
  {
    id: "blotter",
    name: "SELO DO PORTAL",
    tag: "MICRODOSE E VISÃO",
    rating: 4.4,
    reviews: 7,
    price: 160,
    unit: "25 selos",
    desc: "Cartela de 25 selos perfurados, dosagem uniforme e aplicada por imersão — cada quadrado carrega exatamente a mesma quantidade. Corte pela perfuração, deixe sob a língua e espere 30 minutos. A cartela viaja plana e protegida da luz.",
    img: "assets/img/blotter.webp",
    category: "Psicodélicos",
    badge: "Microdose"
  },
  {
    id: "violet-star",
    name: "ESTRELA VIOLETA",
    tag: "ALCANCE AS ESTRELAS",
    rating: 4.9,
    reviews: 10,
    price: 175,
    unit: "10 un",
    desc: "Nossa pílula violeta premium em formato de estrela, criada para elevar sua criatividade e consciência espiritual. Desbloqueie seu universo interior e conecte-se com a energia cósmica. Experiência artística e insights profundos.",
    img: "assets/img/violet-star.webp",
    category: "Psicodélicos",
    badge: "Novo"
  },
  {
    id: "pen",
    name: "SLIM QUÂNTICO",
    tag: "PERCA PESO SEM SAIR DE CASA",
    rating: 4.8,
    reviews: 21,
    price: 420,
    unit: "caneta",
    desc: "Caneta semanal de dose fixa, com aplicação subcutânea indolor. Reduz o apetite, desacelera o esvaziamento gástrico e mantém o resultado estável durante o tratamento. Acompanha 4 agulhas ultrafinas e instruções em português — sem receita.",
    img: "assets/img/pen.webp",
    category: "Emagrecedores",
    badge: "Alta procura"
  },
  {
    id: "hash",
    name: "HAXIXE DO PORTAL",
    tag: "EXTRAÇÃO ARTESANAL",
    rating: 4.8,
    reviews: 14,
    price: 180,
    unit: "5 g",
    desc: "Extração artesanal prensada a frio, textura macia e aroma intenso de resina. Rendimento alto, queima lenta e efeito prolongado. Vem em bloco único, embalado a vácuo e sem odor externo.",
    img: "assets/img/hash.webp",
    category: "Canabis",
    badge: "Artesanal"
  },
  {
    id: "drops",
    name: "ELIXIR C-137",
    tag: "GOTAS SUBLINGUAIS",
    rating: 4.6,
    reviews: 9,
    price: 190,
    unit: "30 ml",
    desc: "Óleo sublingual de dose controlada, com conta-gotas graduado. Duas gotas sob a língua e o efeito começa em 15 minutos, sem fumaça e sem cheiro. Frasco de vidro âmbar, protegido da luz.",
    img: "assets/img/drops.webp",
    category: "Remédios",
    badge: "Dose controlada"
  },
  {
    id: "mush",
    name: "ESPORO GALÁTICO",
    tag: "VIAGEM DE 4 HORAS",
    rating: 4.9,
    reviews: 17,
    price: 200,
    unit: "5 g",
    desc: "Cogumelos desidratados inteiros, secos em baixa temperatura para preservar a potência. Viagem visual de cerca de 4 horas, com sensação de euforia e cores intensas. Acompanha guia de dosagem.",
    img: "assets/img/mush.webp",
    category: "Psicodélicos",
    badge: "Potente"
  }
];

/* ---------------- carrinho ---------------- */

window.CART = JSON.parse(localStorage.getItem("rm_cart_v2") || "[]");

function saveCart() {
  localStorage.setItem("rm_cart_v2", JSON.stringify(window.CART));
  updateCartCount();
}

function addToCart(id) {
  const p = window.PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const line = window.CART.find(c => c.id === id);
  if (line) line.qty += 1;
  else window.CART.push({ id: p.id, name: p.name, price: p.price, unit: p.unit, qty: 1 });
  saveCart();
}

function removeFromCart(id) {
  window.CART = window.CART.filter(c => c.id !== id);
  saveCart();
  if (typeof renderCartLines === "function") renderCartLines();
}

function changeQty(id, delta) {
  const line = window.CART.find(c => c.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) return removeFromCart(id);
  saveCart();
  if (typeof renderCartLines === "function") renderCartLines();
}

function cartCount() { return window.CART.reduce((s, c) => s + c.qty, 0); }
function cartTotal() { return window.CART.reduce((s, c) => s + c.price * c.qty, 0); }
function money(v) { return "R$ " + Number(v).toFixed(2).replace(".", ","); }

function updateCartCount() {
  const el = document.querySelector(".cart-count");
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.style.display = n ? "flex" : "none";
}

function stars(n) { let s = ""; for (let i = 0; i < 5; i++) { s += i < Math.round(n) ? "★" : "☆"; } return s; }
