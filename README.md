# Cold Caller Backend

Backend service for automated cold calling using Twilio, GPT, and ElevenLabs integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

- `routes/` - API route handlers (Twilio webhooks, lead triggers)
- `services/` - External API integration logic (GPT, ElevenLabs, Whisper)
- `utils/` - Shared utilities
- `middlewares/` - Express middleware (future use)
- `config/` - Environment and configuration files (future use) 