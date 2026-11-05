// Vercel Serverless Function - envia pedido para o Telegram do vendedor
// Configure as variáveis de ambiente (ou edite os placeholders abaixo):
//   TELEGRAM_BOT_TOKEN  -> token do bot (BotFather)
//   TELEGRAM_CHAT_ID    -> seu chat_id (use @userinfobot)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "COLE_SEU_BOT_TOKEN_AQUI";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "COLE_SEU_CHAT_ID_AQUI";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method not allowed" });
    return;
  }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){ body = {}; } }
  body = body || {};
  const itens = body.itens || "-";
  const msg = [
    "🛒 NOVO PEDIDO - Rick And Morty",
    "",
    "Itens: " + itens,
    "",
    "Nome: " + (body.nome || "-"),
    "Endereço: " + (body.endereco || "-"),
    "Cidade: " + (body.cidade || "-"),
    "CEP: " + (body.cep || "-"),
    "Telefone: " + (body.telefone || "-"),
    "Email: " + (body.email || "-"),
    "Obs: " + (body.obs || "-")
  ].join("\n");

  try {
    const r = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    });
    const j = await r.json();
    res.status(200).json({ ok: !!j.ok, result: j });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
};