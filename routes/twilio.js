const express = require('express');
const router = express.Router();

// Import services
const gptService = require('../services/gpt');
const elevenLabsService = require('../services/elevenlabs');
const whisperService = require('../services/whisper');

router.post('/webhook', async (req, res) => {
  try {
    // Handle incoming Twilio webhook
    res.type('text/xml');
    res.send('<Response><Say>Hello from Cold Caller!</Say></Response>');
  } catch (error) {
    console.error('Twilio webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router; 