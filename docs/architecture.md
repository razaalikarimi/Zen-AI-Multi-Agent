# Zen AI Architecture Notes

## Request Flow

1. Client sends request to API Gateway (port 8000)
2. Gateway validates JWT token via Redis session cache
3. If session miss, Gateway calls Auth Service to verify Firebase token
4. Validated request is proxied to target microservice
5. Response returned to client

## Agent Decision Flow

1. User sends a message with selected agent mode
2. Supervisor Graph (LangGraph) receives the message
3. Router Node classifies intent and selects specialist agent
4. Specialist agent (chat/code/pdf/ppt/search/vision) processes request
5. Response streamed back through Gateway to frontend

## Session Management

- Firebase ID tokens are verified by Auth Service on first request
- Session stored in Redis with TTL
- Subsequent requests use cached session (faster, no Firebase roundtrip)
