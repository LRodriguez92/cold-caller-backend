# Cold Caller Backend

Backend service for AI-powered cold calling using SignalWire, OpenAI, ElevenLabs, and Pinecone integration. This service provides a modular, scalable solution for automated phone calls with context-aware conversation management.

## Features

- Real-time voice calls using SignalWire
- AI-powered conversation management with OpenAI
- Natural-sounding voice synthesis via ElevenLabs
- Context-aware conversation retrieval using Pinecone
- Automated call planning and follow-up analysis
- RESTful API for integration with AI orchestration systems

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
# SignalWire Configuration
SIGNALWIRE_PROJECT_ID=your_project_id
SIGNALWIRE_API_TOKEN=your_api_token
SIGNALWIRE_SPACE_URL=your_space_url
SIGNALWIRE_PHONE_NUMBER=your_phone_number

# AI Services
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Vector Storage
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX=your_index_name

# Server Configuration
PORT=3000
BASE_URL=your_public_url
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `POST /start-call` - Initiate a new cold call
- `GET /lead-history/:id` - Retrieve call history for a lead
- `POST /webhook/signalwire` - Handle SignalWire call events
- `GET /health` - Service health check

## Project Structure

- `routes/` - API route handlers (SignalWire webhooks, lead triggers, call endpoints)
- `services/` - External API integration logic (OpenAI, ElevenLabs, Whisper, SignalWire, Pinecone)
- `agents/` - LangChain or custom logic agents for decision-making
- `utils/` - Shared utilities (phone formatting, logging, error handling)
- `middlewares/` - Express middleware (auth, rate limiting, request logging)
- `config/` - Environment setup and service clients
- `vectorstore/` - Embedding and vector search logic
- `scripts/` - Standalone tasks (batch lead embedding, test call routines)

## Development

- The service is containerized using Docker for consistent deployment
- All external service calls are wrapped in error handling middleware
- Logging middleware tracks API requests and responses
- Health check endpoints monitor service status

## Integration

This service is designed to be integrated with higher-level AI orchestration systems (LangGraph, CrewAI, AutoGen) as a specialized agent. All functionality is exposed via RESTful API endpoints.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 