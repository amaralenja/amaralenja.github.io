// Vercel Serverless Function — envia o pedido para o Telegram do vendedor
// Configure as variáveis de ambiente no painel da Vercel (Settings > Environment Variables):
//   TELEGRAM_BOT_TOKEN  -> token do bot (BotFather)
//   TELEGRAM_CHAT_ID    -> seu chat_id (use @userinfobot)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const esc = (v) => String(v == null ? "-" : v).slice(0, 900);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method not allowed" });
    return;
  }

  if (!TOKEN || !CHAT_ID) {
    res.status(500).json({
      ok: false,
      error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID não configurados na Vercel."
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const msg = [
    "🛒 NOVO PEDIDO — Rick And Morty",
    "",
    "Itens: " + esc(body.itens),
    "",
    "Nome: " + esc(body.nome),
    "Endereço: " + esc(body.endereco),
    "Cidade: " + esc(body.cidade),
    "CEP: " + esc(body.cep),
    "Telefone: " + esc(body.telefone),
    "Email: " + esc(body.email),
    "Obs: " + esc(body.obs)
  ].join("\n");

  try {
    const r = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        disable_web_page_preview: true
      })
    });
    const j = await r.json();
    res.status(j.ok ? 200 : 502).json({ ok: !!j.ok, error: j.ok ? undefined : (j.description || "telegram error") });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
};
