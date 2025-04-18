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

  // Set up voice client to listen for incoming calls
  await voiceClient.listen({
    topics: ["office"],
    onCallReceived: async (call) => {
      try {
        // Answer the call
        await call.answer();
        
        // Start voice detection before TTS
        await call.detectVoice({
          timeout: 5,  // Wait up to 5 seconds for voice detection
          listen: {
            onStarted: () => console.log("Voice detection started"),
            onVoiceDetected: async () => {
              console.log("Voice detected - caller is speaking");
              // You can handle the case when the caller speaks first
            },
            onEnded: async () => {
              // If no voice detected after timeout, play the TTS
              await call.playTTS({
                text: "Hello, this is Quantum Codeworks. Thank you for calling. How may we assist you today?",
                listen: {
                  onStarted: () => console.log("TTS started"),
                  onFailed: () => console.log("TTS failed"),
                  onUpdated: (tts) => console.log("TTS state:", tts.state),
                  onEnded: () => {
                    console.log("TTS ended");
                  }
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Error handling call:', error);
      }
    }
  });
}

// Initialize on startup
initializeSignalWire().catch(console.error);

// Route for receiving calls - root endpoint /voice
router.post('/', async (req, res) => {
  try {
    // Create a simple XML response
    const response = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Hello, this is Quantum Codeworks. Thank you for your call.</Say>
      </Response>`;

    // Send response
    res.type('text/xml');
    res.send(response);
  } catch (error) {
    console.error('SignalWire webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for making outbound calls - endpoint /voice/call
router.post('/call', async (req, res) => {
  try {
    const { to, message } = req.body;
    const toNumber = to ? formatPhoneNumber(to) : formatPhoneNumber(process.env.DEFAULT_TO_NUMBER);
    const fromNumber = formatPhoneNumber(process.env.SIGNALWIRE_PHONE_NUMBER);

    console.log('Debug Info:');
    console.log('Project ID:', process.env.SIGNALWIRE_PROJECT_ID);
    console.log('Space URL:', process.env.SIGNALWIRE_SPACE);
    console.log('From Number:', fromNumber);
    console.log('To Number:', toNumber);

    // Make the call using voiceClient
    const call = await voiceClient.dialPhone({
      to: toNumber,
      from: fromNumber,
      timeout: 30,
      listen: {
        onStateChanged: async (call) => {
          console.log('Call state changed to:', call.state);
          
          // If the call is answered, play the TTS
          if (call.state === 'answered') {
            console.log('Call was answered');
            try {
              // Wait a brief moment to ensure the call is fully established
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Start recording to detect voice
              await call.recordAudio({
                direction: "speak",  // Only record incoming audio
                endSilenceTimeout: 1.0,  // End recording after 1 second of silence
                initialTimeout: 3.0,  // Wait up to 3 seconds for voice to start
                listen: {
                  onStarted: () => console.log("Recording started - listening for voice"),
                  onEnded: async (recording) => {
                    console.log("Recording ended");
                    if (recording.duration > 0) {
                      // Voice was detected, wait a moment then play response
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      const ttsMessage = message || "Hello, I heard you speaking. This is Quantum Codeworks. How may we assist you today?";
                      await call.playTTS({
                        text: ttsMessage,
                        listen: {
                          onStarted: () => console.log('TTS started'),
                          onEnded: () => console.log('TTS completed'),
                          onFailed: (error) => console.error('TTS failed:', error),
                          onUpdated: (tts) => console.log('TTS state:', tts.state)
                        }
                      });
                    } else {
                      // No voice detected, play standard greeting
                      const ttsMessage = message || "Hello, this is Quantum Codeworks. Thank you for answering our call. How may we assist you today?";
                      await call.playTTS({
                        text: ttsMessage,
                        listen: {
                          onStarted: () => console.log('TTS started'),
                          onEnded: () => console.log('TTS completed'),
                          onFailed: (error) => console.error('TTS failed:', error),
                          onUpdated: (tts) => console.log('TTS state:', tts.state)
                        }
                      });
                    }
                  }
                }
              });
            } catch (error) {
              console.error('Error during audio recording or TTS playback:', error);
            }
          }
        }
      }
    });

    console.log('Call initiated:', call.id);

    // Set up additional call state monitoring if needed
    await call.waitFor('ended').then(() => {
      console.log('Call ended');
    });

    res.json({
      callId: call.id,
      message: `Call initiated to ${toNumber}`
    });

  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

module.exports = router; 