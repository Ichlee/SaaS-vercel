// index.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Health check
app.get('/', (req, res) => {
  res.send('OK');
});

// Webhook verification for Meta (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  console.warn('Webhook verification failed');
  return res.sendStatus(403);
});

// Receive messages from WhatsApp (POST)
app.post('/webhook', (req, res) => {
  try {
    const body = req.body;
    console.log('Webhook payload:', JSON.stringify(body));

    // Basic safe checks for message structure
    if (body.object && body.entry && Array.isArray(body.entry)) {
      body.entry.forEach(entry => {
        const changes = entry.changes || [];
        changes.forEach(change => {
          const value = change.value || {};
          const messages = value.messages || [];
          messages.forEach(async message => {
            const from = message.from; // phone number
            const msgBody = message.text && message.text.body ? message.text.body : null;
            console.log(`Message from ${from}: ${msgBody}`);

            // Example: auto-reply echo
            if (msgBody) {
              const reply = `Recebi sua mensagem: "${msgBody}"`;
              try {
                await sendMessage(from, reply);
                console.log(`Replied to ${from}`);
              } catch (err) {
                console.error('Error sending reply:', err?.response?.data || err.message);
              }
            }
          });
        });
      });
    }

    // Acknowledge quickly
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook handling error:', err);
    res.sendStatus(500);
  }
});

// Send message via WhatsApp Cloud API
async function sendMessage(to, text) {
  if (!PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
    throw new Error('Missing PHONE_NUMBER_ID or WHATSAPP_TOKEN environment variables');
  }

  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to,
    text: { body: text }
  };

  const headers = {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const resp = await axios.post(url, body, { headers });
  return resp.data;
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
