## Microservice Design Notes

- This cold calling microservice is designed to run standalone, with LangChain + Pinecone logic abstracted into their own folders (`services/`, `vectorstore/`).
- All logic is callable via API endpoints (e.g., `POST /start-call`, `GET /lead-history/:id`) so a higher-level agentic AI system (LangGraph, CrewAI, AutoGen) can treat this as a tool or autonomous sub-agent.
- This allows us to plug this service into future orchestrators without tight coupling.

### System Overview
The cold calling microservice is a Node.js application that orchestrates AI-powered phone calls using SignalWire for voice infrastructure, OpenAI for conversation management, and Pinecone for context storage and retrieval. The system is designed to be modular, scalable, and easily integrable with other AI orchestration systems.

### Key Components

1. **Voice Infrastructure (SignalWire)**
   - Handles real-time voice calls
   - Manages call state and events
   - Provides webhook endpoints for call control

2. **AI Services**
   - OpenAI: Powers conversation generation and analysis
   - ElevenLabs: Handles text-to-speech conversion
   - Whisper: Provides speech-to-text capabilities

3. **Vector Storage (Pinecone)**
   - Stores conversation embeddings
   - Enables context-aware conversation retrieval
   - Maintains lead history and call context

4. **Core Services**
   - Call Planner: Determines call strategy and flow
   - Follow-up Analyzer: Processes call outcomes
   - Lead Manager: Handles lead data and history

### Data Flow

1. **Call Initiation**
   - API request received → Call Planner generates strategy
   - SignalWire initiates call → Voice stream established
   - Real-time transcription begins

2. **During Call**
   - Speech → Text (Whisper)
   - Text → Context (Pinecone)
   - Context → Response (OpenAI)
   - Response → Speech (ElevenLabs)

3. **Call Completion**
   - Call summary generated
   - Results stored in vector store
   - Follow-up actions determined

### Error Handling & Monitoring

- All external service calls are wrapped in error handling middleware
- Call state is persisted to handle disconnections
- Logging middleware tracks API requests and responses
- Health check endpoints monitor service status

### Scalability Considerations

- Stateless design allows horizontal scaling
- Vector store queries are optimized for performance
- Voice infrastructure scales independently
- Rate limiting implemented for API endpoints

### Deployment

- Containerized using Docker
- Environment variables for configuration
- Health checks and monitoring endpoints
- Logging and metrics collection

### Summary:
ColdCallerAgent = "specialist agent" ➝ callable via HTTP ➝ abstracts away voice handling, context recall, and call result analysis.
