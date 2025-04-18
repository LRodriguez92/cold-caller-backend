const express = require('express');
const router = express.Router();
const { SignalWire } = require('@signalwire/realtime-api');

// Import services
const gptService = require('../services/gpt');
const elevenLabsService = require('../services/elevenlabs');
const whisperService = require('../services/whisper');

// Function to format phone number to E.164
function formatPhoneNumber(number) {
  // Remove all non-digits
  const cleaned = number.toString().replace(/\D/g, '');
  // For US numbers, ensure they start with +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`; // Already in E.164 format
}

// Initialize SignalWire client
let client;
let voiceClient;

// Initialize the clients
async function initializeSignalWire() {
  client = await SignalWire({
    project: process.env.SIGNALWIRE_PROJECT_ID,
    token: process.env.SIGNALWIRE_TOKEN,
    spaces_url: process.env.SIGNALWIRE_SPACE
  });
  voiceClient = client.voice;
}

// Initialize on startup
initializeSignalWire().catch(console.error);

// Route for receiving calls - root endpoint /voice
router.post('/', async (req, res) => {
  try {
    // Create a VXML response (SignalWire is compatible with TwiML)
    const response = new Voice.Response();
    response.say('Hello this is Quantum Codeworks.');

    // Send response
    res.type('text/xml');
    res.send(response.toString());
  } catch (error) {
    console.error('SignalWire webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for making outbound calls - endpoint /voice/call
router.post('/call', async (req, res) => {
  try {
    const { to } = req.body;
    const toNumber = to ? formatPhoneNumber(to) : formatPhoneNumber(process.env.DEFAULT_TO_NUMBER);
    const fromNumber = formatPhoneNumber(process.env.SIGNALWIRE_PHONE_NUMBER);

    console.log('Debug Info:');
    console.log('Project ID:', process.env.SIGNALWIRE_PROJECT_ID);
    console.log('Space URL:', process.env.SIGNALWIRE_SPACE);
    console.log('From Number:', fromNumber);
    console.log('To Number:', toNumber);
    console.log('Webhook URL:', `${process.env.BASE_URL}/voice`);

    // Make the call using voiceClient
    const call = await voiceClient.dialPhone({
      to: toNumber,
      from: fromNumber,
      timeout: 30
    });

    res.json({
      success: true,
      callId: call.id,
      message: `Call initiated from ${fromNumber} to ${toNumber}`
    });

  } catch (error) {
    console.error('Error making call:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.code ? `Error code: ${error.code}` : undefined
    });
  }
});

module.exports = router; 