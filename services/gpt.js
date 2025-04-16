const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('GPT API error:', error);
    throw error;
  }
}

module.exports = {
  generateResponse
}; 