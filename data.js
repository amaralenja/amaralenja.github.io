window.PRODUCTS = [
  {
    id: "green-pill",
    name: "PÍLULA VERDE",
    tag: "O DRINQUE FINAL PERFEITO",
    rating: 4.5,
    reviews: 4,
    btc: "0.0013 BTC",
    eth: "0.0523 ETH",
    desc: "Ótima qualidade por um preço acessível. Recomendada para encontros sociais, esta pílula verde dá a sensação de álcool sem a ressaca. Experiência pura, limpa e de alta qualidade garantida.",
    img: "assets/img/green-pill.webp",
    category: "Auxílio ao Sono",
    badge: "Clássico"
  },
  {
    id: "speed-racer",
    name: "CORREDOR VELOZ",
    tag: "ACELERE SUA NOITE",
    rating: 5.0,
    reviews: 4,
    btc: "0.0021 BTC",
    eth: "0.0802 ETH",
    desc: "O Corredor Veloz é nossa opção premium para quem quer ir de 0 a 100 em segundos. Sinta um rush como dirigir um carro esportivo, com efeitos que duram até 6 horas. Contém 80mg de energia pura por pílula.",
    img: "assets/img/speed-racer.webp",
    category: "Energia",
    badge: "Mais vendido"
  },
  {
    id: "white-ghost",
    name: "FANTASMA BRANCO",
    tag: "DANÇE COM A MORTE",
    rating: 4.8,
    reviews: 4,
    btc: "0.0025 BTC",
    eth: "0.0950 ETH",
    desc: "Não é para os fracos. O Fantasma Branco entrega uma experiência de outro mundo que leva você ao limite e de volta. Nossa fórmula mais forte, apenas para usuários experientes. Transcendência pura em forma de pílula.",
    img: "assets/img/white-ghost.webp",
    category: "Alívio da Dor",
    badge: "Mais forte"
  },
  {
    id: "violet-star",
    name: "ESTRELA VIOLETA",
    tag: "ALCANCE AS ESTRELAS",
    rating: 4.9,
    reviews: 4,
    btc: "0.0030 BTC",
    eth: "0.1100 ETH",
    desc: "Nossa pílula violeta premium em formato de estrela, criada para elevar sua criatividade e consciência espiritual. Desbloqueie seu universo interior e conecte-se com a energia cósmica. Experiência artística e insights profundos.",
    img: "assets/img/violet-star.webp",
    category: "Auxílio ao Sono",
    badge: "Novo"
  }
];

window.CART = JSON.parse(localStorage.getItem("md_cart") || "[]");
function saveCart(){ localStorage.setItem("md_cart", JSON.stringify(window.CART)); updateCartCount(); }
function addToCart(id){ const p = window.PRODUCTS.find(x=>x.id===id); if(!p) return; window.CART.push({id:p.id,name:p.name,btc:p.btc}); saveCart(); }
function updateCartCount(){
  const el = document.querySelector(".cart-count");
  if(!el) return;
  const n = window.CART.length;
  el.textContent = n;
  el.style.display = n ? "flex" : "none";
}
function stars(n){ let s=""; for(let i=0;i<5;i++){ s += i < Math.round(n) ? "★" : "☆"; } return s; }