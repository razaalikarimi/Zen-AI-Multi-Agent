# Zen AI — Enterprise Multi-Agent AI Orchestration Platform

[![Architecture](https://img.shields.io/badge/Architecture-Distributed%20Microservices-0891b2.svg)](docs/ARCHITECTURE.md)
[![NodeJS](https://img.shields.io/badge/Node.js-v20%2B%20ESM-green.svg?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-blue.svg?logo=react)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/AI%20Orchestration-LangGraph%20%26%20LangChain-orange.svg)](https://js.langchain.com/)
[![Vector DB](https://img.shields.io/badge/Vector%20Store-Qdrant%20Hybrid-black.svg?logo=qdrant)](https://qdrant.tech/)
[![Security](https://img.shields.io/badge/Security-OWASP%20Hardened-emerald.svg)](docs/SECURITY_AUDIT.md)

Zen AI is a world-class, enterprise-grade multi-agent AI SaaS platform. It combines autonomous agent orchestration via **LangGraph**, real-time **Server-Sent Events (SSE)** token streaming, a Claude-style **Monaco Code Artifact Studio** with live sandboxed preview, persistent multi-tenant **Qdrant RAG Knowledge Management**, and cryptographically secure service-to-service microservices.

---

## Architecture Overview

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                        |
|  React 19 + Vite 8 + Tailwind 4 SPA (Claude/Linear/Perplexity UX, Monaco Studio)      |
+-------------------------------------------+-------------------------------------------+
                                            | HTTPS / SSE / WebSockets
                                            v
+---------------------------------------------------------------------------------------+
|                                    API GATEWAY                                        |
|  - TLS Termination & Helmet Security Headers       - Distributed Rate Limiting (Redis)|
|  - Correlation ID Injection (x-correlation-id)    - Session Cookie / Token Extraction |
|  - Non-blocking Stream Proxying                    - Service Discovery & Routing      |
+-------------------+-------------------+-------------------+---------------------------+
                    |                   |                   |
                    v                   v                   v
          +-----------------+ +-----------------+ +-----------------+
          |  AUTH SERVICE   | |  CHAT SERVICE   | | BILLING SERVICE |
          | - Firebase Verif| | - Thread Storage| | - Razorpay Hub  |
          | - RBAC (Admin)  | | - Folder Mgmt   | | - Webhooks      |
          | - Session Cache | | - Message Search| | - Token Quotas  |
          | - Credit Balances | - IDOR Guard   | | - Invoicing     |
          +--------+--------+ +--------+--------+ +--------+--------+
                   |                   |                   |
                   +---------+---------+---------+---------+
                             |                   |
                             v                   v
          +---------------------------------------------------------+
          |                 MULTI-AGENT AI SERVICE                  |
          | - LangGraph Multi-Agent Orchestrator (8 Agents)         |
          | - Dynamic Planner & Intent Classifier                    |
          | - Provider Abstraction Layer (Gemini, Groq, OpenRouter) |
          | - Server-Sent Events (SSE) Streaming Engine             |
          | - Code Artifact Generator & Review Pipeline             |
          +----------------------------+----------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
+------------------------------------+  +------------------------------------+
|       ASYNC WORKER TIER            |  |       PERSISTENT DATA TIER         |
| - BullMQ Redis Distributed Queues  |  | - MongoDB Replica Set (Core Store) |
| - Document Chunking & Parsing      |  | - Redis Cluster (Cache, Pub/Sub)   |
| - Vector Indexing & Reranking      |  | - Qdrant Vector DB (RAG Embeddings)|
| - Async Notifications & Invoices   |  | - AWS S3 / Local Storage Bucket    |
+------------------------------------+  +------------------------------------+
```

---

## 8 Specialized Enterprise Agents

| Agent | Responsibility | Core Tools & Technologies |
| :--- | :--- | :--- |
| **Supervisor Agent** | Top-level coordinator routing tasks, tracking goals, and synthesizing state. | LangGraph Supervisor Graph, Dynamic Router |
| **Planning Agent** | Breaks multi-faceted initiatives into actionable engineering execution steps. | Goal Decomposer, Risk Analyzer |
| **Coding Agent** | Generates production multi-file codebases with live Monaco Studio preview. | Multi-File Extractor, Monaco Editor |
| **Research Agent** | Conducts deep recursive research and synthesizes comprehensive briefings. | Multi-Query Engine, Citation Formatter |
| **Review & Validation** | Audits peer agent output for OWASP security flaws, syntax errors, and style. | Security Auditor, QA Gate Node |
| **Document Agent** | Generates formatted multi-page PDF documents and PowerPoint presentation decks. | PDFKit, PPTXGenJS, S3 / Local Storage |
| **Data Analysis Agent**| Analyzes datasets, calculates KPIs and statistics, and builds markdown tables. | Tabular Parser, CSV Analyzer |
| **Web Search Agent** | Crawls the live internet for breaking news and technical documentation. | Tavily Search API, Source Citation Builder |

---

## Key Enterprise Capabilities

- **Resilient AI Provider Layer**: Centralized model orchestration supporting **Google Gemini 2.5 Flash**, **Groq Llama 3.3 70B**, **DeepSeek Chat**, and **OpenRouter** with automatic fallback priority and rate-limit recovery.
- **Claude-Style Code Artifact Studio**: Interactive multi-file workspace featuring Monaco Editor, syntax highlighting, diff viewing, and client-side sandboxed iframe preview (`sandbox="allow-scripts"`).
- **Persistent Multi-Tenant RAG**: Ingests PDF, DOCX, TXT, and CSV files with overlapping context chunking and user-isolated Qdrant vector collections.
- **Idempotent Billing & Subscriptions**: Razorpay integration with atomic database state transitions, webhook event listeners, and usage limits across Free, Starter, Pro, and Enterprise tiers.
- **Enterprise Security Perimeter**: Role-Based Access Control (RBAC), anti-IDOR authorization guards, cryptographic HMAC service-to-service signing, Helmet headers, and CORS isolation.

---

## Monorepo Directory Structure

```bash
zen-ai/
├── backend/
│   ├── gateway/                 # API Gateway router (Node.js/Express)
│   ├── services/
│   │   ├── agent/               # LangGraph multi-agent orchestrator & RAG
│   │   ├── auth/                # Identity, RBAC, and session manager
│   │   ├── billing/             # Razorpay payment operations & webhooks
│   │   └── chat/                # Conversation threads & message store
│   ├── shared/
│   │   ├── logger/              # Structured JSON Winston/Console logger
│   │   ├── middleware/          # Correlation IDs, Error handler, Service Auth
│   │   ├── queue/               # BullMQ & async job queue infrastructure
│   │   ├── redis/               # Resilient Redis client with in-memory fallback
│   │   └── utils/               # Standardized response envelopes
│   ├── test/                    # Automated unit, integration, & security tests
│   └── docker-compose.yml       # Local dev infrastructure
├── docs/                        # Architecture, Security, API, & Audit specs
├── frontend/                    # React 19 / Vite 8 SPA client
├── .github/workflows/           # CI, Security Audit, Docker, & Deploy pipelines
├── docker-compose.yml           # Root development stack
├── docker-compose.prod.yml      # Root production hardened stack
├── run-project.js               # Concurrency dev runner
└── package.json                 # Monorepo root scripts
```

---

## Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x+
- **Docker & Docker Compose** (Optional for local Redis, MongoDB, and Qdrant)

### 2. Installation
Install all dependencies across all monorepo packages in one command:
```bash
npm run install:all
```

### 3. Environment Configuration
Copy `.env.example` templates in each service directory:
```bash
cp backend/gateway/.env.example backend/gateway/.env
cp backend/services/auth/.env.example backend/services/auth/.env
cp backend/services/chat/.env.example backend/services/chat/.env
cp backend/services/billing/.env.example backend/services/billing/.env
cp backend/services/agent/.env.example backend/services/agent/.env
cp frontend/.env.example frontend/.env
```

### 4. Run Automated Tests
Execute the built-in automated test suite:
```bash
node --test backend/test/*.test.js
```

### 5. Build Frontend Application
```bash
npm run build:frontend
```

### 6. Start the Entire Platform
Run all 5 backend microservices and the React 19 frontend concurrently:
```bash
npm run dev
```

The application is now live at:
- **Frontend Workspace**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:8000](http://localhost:8000)
- **Auth Service**: `http://localhost:8001`
- **Chat Service**: `http://localhost:8002`
- **Agent Service**: `http://localhost:8003`
- **Billing Service**: `http://localhost:8004`

---

## Documentation Index

- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Technical Audit Report](docs/TECHNICAL_AUDIT.md)
- [Security Audit & Threat Model](docs/SECURITY_AUDIT.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Production Readiness Report](docs/PRODUCTION_READINESS_REPORT.md)

---

## License
MIT License. Developed for enterprise multi-agent artificial intelligence workloads.
