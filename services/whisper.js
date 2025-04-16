const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function transcribeAudio(audioBuffer) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
    });
    return transcription.text;
  } catch (error) {
    console.error('Whisper API error:', error);
    throw error;
  }
}

module.exports = {
  transcribeAudio
}; 