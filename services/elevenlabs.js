const axios = require('axios');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

async function textToSpeech(text, voiceId = 'premade/adam') {
  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer'
      }
    );
    return response.data;
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    throw error;
  }
}

module.exports = {
  textToSpeech
}; 