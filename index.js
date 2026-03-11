// index.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Rota básica para testar se o servidor está rodando
app.get("/", (req, res) => {
  res.send("TechAssistBot rodando 🚀 - Chatbot de manutenção de computadores e notebooks");
});

// Webhook para receber mensagens do WhatsApp
app.post("/webhook", (req, res) => {
  const message = req.body.message; // mensagem recebida do cliente
  let responseText = "Olá! Obrigado por entrar em contato.";

  // Respostas automáticas básicas
  if (message.includes("formatação")) {
    responseText = "A formatação de notebook custa R$150 e leva em média 1 dia.";
  } else if (message.includes("troca de tela")) {
    responseText = "A troca de tela varia conforme o modelo. Envie a marca e modelo para orçamento.";
  } else if (message.includes("limpeza")) {
    responseText = "A limpeza interna custa R$100 e ajuda a evitar superaquecimento.";
  } else if (message.includes("horário")) {
    responseText = "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.";
  }

  // Aqui você enviaria a resposta de volta via API do WhatsApp (Twilio/Zenvia/Meta)
  console.log("Mensagem recebida:", message);
  console.log("Resposta enviada:", responseText);

  res.json({ reply: responseText });
});

// Porta de execução
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
