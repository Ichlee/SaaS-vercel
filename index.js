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
if (message.includes("formatação")){
responseText = "A formatação do notebook custa R$ 150 e leva em média 1 dia.";
}else if(message.includes("troca de tela"){
    responseText = "A troca de tela varia de acordo com o modelo"
})


}