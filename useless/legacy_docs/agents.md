# Zen AI - Agent Types

Zen AI uses a supervisor-based multi-agent architecture powered by LangGraph.

## Available Agents

### 1. Auto Agent (default)
- Automatically routes to the best specialist agent based on user intent.
- Uses a Router Node to classify the request.

### 2. Chat Agent
- General conversational AI with full context memory.
- Supports multi-turn conversations with history injection.
- Uses: Gemini, Groq (Llama), DeepSeek, or OpenRouter.

### 3. Coding Agent
- Specialized for code generation, debugging, and explanation.
- Returns structured code blocks detected by the Artifacts panel.

### 4. PDF Agent
- Generates structured PDF documents from natural language prompts.
- Uploads generated PDF to AWS S3 and returns a presigned download URL.

### 5. PPT Agent
- Creates PowerPoint presentations with multiple slides.
- Uses PPTXGenJS for slide layout and content generation.

### 6. Search Agent
- Performs real-time web searches via Tavily API.
- Returns summarized results with source citations.

### 7. Vision Agent
- Accepts image uploads and answers questions about the image content.
- Uses Google Gemini Vision (multimodal).

### 8. PDF RAG Agent
- Upload a PDF document and ask questions about its content.
- Uses Qdrant vector DB for semantic chunking and retrieval.
