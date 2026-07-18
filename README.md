# Zen AI - Enterprise Multi-Agent Orchestration Platform

[![Microservices](https://img.shields.io/badge/Architecture-Microservices-orange.svg)](https://microservices.io/)
[![NodeJS](https://img.shields.io/badge/Node.js-ESM-green.svg?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%26%20Redis-red.svg?logo=mongodb)](https://www.mongodb.com/)
[![AI Orchestration](https://img.shields.io/badge/Orchestration-LangChain%20%26%20LangGraph-blue.svg)](https://js.langchain.com/docs/introduction/)
[![Vector Search](https://img.shields.io/badge/Vector%20DB-Qdrant-black.svg?logo=qdrant)](https://qdrant.tech/)

Zen AI is an enterprise-grade multi-agent orchestration platform designed for real-time AI capabilities, interactive code sandbox rendering (Claude-like Artifacts), dynamic payments, and secure user management. Built using a decoupled, highly-scalable **microservices architecture** on **Node.js (ESM)**, the system manages distinct workloads through specialized backend services routed via a central API Gateway, backed by a fast **React 19** frontend client.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Microservices Breakdown](#microservices-breakdown)
3. [Tech Stack](#tech-stack)
4. [Monorepo Directory Layout](#monorepo-directory-layout)
5. [Prerequisites](#prerequisites)
6. [Environment Configuration](#environment-configuration)
7. [Local Setup & Getting Started](#local-setup--getting-started)
8. [Production Deployment](#production-deployment)

---

## System Architecture

Zen AI uses a hub-and-spoke API gateway design to distribute requests cleanly. All client interactions hit the Gateway, which manages authentication validation and proxies traffic to the target microservices.

```
React 19 Frontend  <-->  API Gateway (:8000)
                              |
              ┌───────────────┼───────────────┐────────────────┐
              |               |               |                |
         Auth (:8001)   Chat (:8002)   Agent (:8003)   Billing (:8004)
              |               |               |                |
         MongoDB         MongoDB         MongoDB          MongoDB
        (zen_auth)      (zen_chat)      (zen_agent)     (zen_billing)
                                            |
                              ┌─────────────┼──────────────┐
                           Qdrant       Tavily          AWS S3
                        (Vector DB)  (Web Search)   (File Storage)
```

---

## Microservices Breakdown

### 1. API Gateway (`port 8000`)
- Single entrypoint for the client application.
- Integrates `helmet`, `morgan` and standard rate limiters.
- Resolves Firebase user authorization headers through standard middleware before forwarding requests.
- Proxies `/api/auth`, `/api/chat`, `/api/agent`, and `/api/billing` to the appropriate downstream service.

### 2. Authentication Service (`port 8001`)
- Connects securely with Firebase Admin SDK to perform server-side verification of user tokens.
- Manages local user database sync in MongoDB (`zen_auth`).
- Returns session details and manages user profile modifications.

### 3. Chat Service (`port 8002`)
- Manages discussion rooms, thread creations, thread deletions, and query histories.
- Implements MongoDB database (`zen_chat`) to persist conversation indices.

### 4. Agent Orchestration Service (`port 8003`)
- Built using **LangChain** and **LangGraph** for multi-agent workflows.
- Handles document uploads, PDF parsing, PPTX parsing, and generates structured document formats (PDFKit).
- Integrates **Qdrant Vector Database** for Retrieval-Augmented Generation (RAG).
- Queries Tavily Web Search API to allow agents to search the web in real-time.
- Calls inference engines: Google Gemini, Groq (Llama models), DeepSeek, and OpenRouter.

### 5. Billing & Subscriptions Service (`port 8004`)
- Implements subscription plans (Free vs. Premium).
- Integrates **Razorpay Node SDK** to generate orders and verify cryptographic signatures from payment webhooks.
- Persists transaction records in MongoDB (`zen_billing`).

---

## Tech Stack

### Core Platform
- **Runtime**: Node.js (v18+)
- **HTTP Server**: Express.js
- **Database / Cache**: MongoDB (Mongoose ODM) & Redis (ioredis client)
- **Containerization**: Docker & Docker Compose

### Orchestration & AI
- **Framework**: LangChain (`@langchain/core`) & LangGraph (`@langchain/langgraph`)
- **Web Search**: Tavily Search SDK
- **File Parsing**: AWS S3 SDK, Multer, PDF-Parse, PPTXGenJS, PDFKit
- **Vector Search**: Qdrant Vector DB

### Client App
- **UI Stack**: React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, Framer Motion, Monaco Editor.

---

## Monorepo Directory Layout

```bash
zen-ai/
├── backend/
│   ├── gateway/                 # API Gateway router (Node.js/Express)
│   ├── services/
│   │   ├── agent/               # LangGraph multi-agent LLM worker
│   │   ├── auth/                # Firebase user sync & JWT authentication
│   │   ├── billing/             # Razorpay payment operations
│   │   └── chat/                # Discussion log store & metadata manager
│   ├── shared/
│   │   └── redis/               # Shared client connection for Redis caching
│   ├── docker-compose.yml       # Local development services configurations
│   └── package.json
├── frontend/                    # React 19 / Vite client SPA
├── run-project.js               # Concurrency script to run all modules
└── package.json
```

---

## Prerequisites

Before running this application, ensure you have:
1. **Node.js** (v18.x or above) installed.
2. **Docker Desktop** installed (used to spin up Redis).
3. A **MongoDB Atlas** cluster URL or a local MongoDB database.
4. A **Firebase Project** with Authentication enabled.
5. **API Keys** for:
   - Google Gemini API
   - Groq API (Optional)
   - OpenRouter API (Optional)
   - Tavily API
   - AWS S3 (Bucket, Access Key, Secret)
   - Razorpay Sandbox account

---

## Environment Configuration

### 1. API Gateway (`backend/gateway/.env`)
```env
PORT=8000
REDIS_URL="redis://localhost:6379"
AUTH_SERVICE="http://localhost:8001"
CHAT_SERVICE="http://localhost:8002"
AGENT_SERVICE="http://localhost:8003"
BILLING_SERVICE="http://localhost:8004"
```

### 2. Auth Service (`backend/services/auth/.env`)
```env
PORT=8001
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/zen_auth"
FRONTEND_URL="http://localhost:5173"
```
> **Note**: Place your Firebase Service Account JSON inside `backend/services/auth/` as `serviceAccount.json`.

### 3. Chat Service (`backend/services/chat/.env`)
```env
PORT=8002
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/zen_chat"
```

### 4. Agent Service (`backend/services/agent/.env`)
```env
PORT=8003
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/zen_agent"
GOOGLE_API_KEY="your_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
TAVILY_API_KEY="your_tavily_api_key"
GATEWAY_URL="http://localhost:8000"
AWS_ACCESS_KEY_ID="your_aws_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_REGION="ap-south-1"
AWS_BUCKET_NAME="your_s3_bucket_name"
QDRANT_URL="your_qdrant_url"
QDRANT_API_KEY="your_qdrant_api_key"
```

### 5. Billing Service (`backend/services/billing/.env`)
```env
PORT=8004
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/zen_billing"
AUTH_SERVICE="http://localhost:8001"
RAZORPAY_KEY_ID="rzp_test_your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### 6. Frontend (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY="your_firebase_web_client_key"
VITE_SERVER_URL="http://localhost:8000"
VITE_RAZORPAY_KEY="rzp_test_your_razorpay_key"
```

---

## Local Setup & Getting Started

### Step 1: Start Redis
```bash
cd backend
docker-compose up -d
```

### Step 2: Install Dependencies
```bash
cd backend/gateway && npm install
cd ../services/auth && npm install
cd ../chat && npm install
cd ../agent && npm install
cd ../billing && npm install
cd ../../../frontend && npm install
```

### Step 3: Run All Services
```bash
node run-project.js
```

Color-coded logs per service:
- `[gateway]` Green
- `[auth]` Magenta
- `[chat]` Yellow
- `[agent]` Blue
- `[billing]` Red
- `[frontend]` Cyan

Open **http://localhost:5173** in your browser.

---

## Production Deployment

### Docker Build
```bash
cd backend/services/chat
docker build -t zen-chat-service:1.0.0 .
```

### Best Practices
- Use **Kubernetes / ECS** for container orchestration.
- Store secrets in **AWS Secrets Manager** or **HashiCorp Vault**.
- Deploy frontend `dist/` to **Vercel**, **Netlify**, or **AWS S3 + CloudFront**.
