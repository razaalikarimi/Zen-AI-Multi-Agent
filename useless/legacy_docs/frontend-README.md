# Zen AI - Frontend Client

[![React Version](https://img.shields.io/badge/React-19.2.6-blue.svg?logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.0.12-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.1-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![State Management](https://img.shields.io/badge/Redux_Toolkit-v2.12.0-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

Zen AI's frontend is a high-performance, single-page application (SPA) built using **React 19**, **Vite 8**, and **Tailwind CSS v4**. It features a modern, fluid user interface inspired by premium AI platforms, offering features like real-time multi-agent chat, a Claude-like interactive **Artifacts Panel** with Monaco Editor support, Firebase-authenticated session management, and a seamless Razorpay subscription system.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Environment Variables](#environment-variables)
5. [Getting Started](#getting-started)
6. [Key Components](#key-components)
7. [State Management](#state-management)
8. [API Integration](#api-integration)

---

## Features

- **Interactive Chat Interface**: Sleek message list with markdown parsing, syntax highlighting for code blocks, and dynamic responses.
- **Claude-style Artifacts Panel**: Intercepts AI-generated code blocks and renders them in a dedicated split-screen view. Includes:
  - Live preview of static HTML/JS code.
  - Interactive code editing using Monaco Editor.
- **Micro-Animations**: Built with Framer Motion for organic UI transitions.
- **Flexible Model Selection**: Instant model switching (Gemini, Groq, DeepSeek, OpenRouter).
- **Secure Authentication**: Firebase Client SDK for Google OAuth login.
- **Razorpay Subscription Flow**: Checkout drawer linked to Razorpay's API.

---

## Tech Stack

- **Core Framework**: React 19 & Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **State Management**: Redux Toolkit & react-redux
- **Auth**: Firebase JS SDK (Client Authentication)
- **Editor**: @monaco-editor/react (Visual code editing)
- **Animations**: Framer Motion v12
- **Icons**: lucide-react & react-icons
- **Markdown & Code Rendering**: react-markdown, react-syntax-highlighter, remark-gfm
- **API Client**: axios with interceptors

---

## Directory Structure

```bash
frontend/
├── src/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── AiBanner.jsx         # Premium AI capabilities banner
│   │   ├── ArtifactPanel.jsx    # Code sandbox with Monaco Editor & iframe preview
│   │   ├── BillingDrawer.jsx    # Razorpay subscription drawer
│   │   ├── ChatArea.jsx         # Chat messages + input wrapper
│   │   ├── ChatInput.jsx        # Input with file attach, voice, agent selector
│   │   ├── MessageBubble.jsx    # User & assistant message renderer
│   │   ├── MessageList.jsx      # Chronological message display
│   │   ├── ModelSelector.jsx    # LLM model dropdown
│   │   ├── Navbar.jsx           # Top header bar
│   │   └── Sidebar.jsx          # Conversation history sidebar
│   ├── features/
│   │   ├── agent.api.js         # Agent API calls
│   │   ├── billing.api.js       # Payment order/verify APIs
│   │   ├── conversation.api.js  # Thread CRUD
│   │   └── message.api.js       # Message fetch/send
│   ├── hooks/
│   │   └── useCurrentUser.jsx   # Auth user hook
│   ├── redux/
│   │   ├── store.js             # Redux store
│   │   ├── user.slice.js        # User auth state
│   │   ├── message.slice.js     # Active messages state
│   │   └── conversation.slice.js # Conversation list state
│   ├── utils/
│   │   ├── axios.js             # Axios client with base URL & interceptors
│   │   └── detectLanguage.js    # Monaco syntax language detection
│   ├── App.jsx                  # Root router & layout
│   ├── index.css                # Global Tailwind theme variables
│   └── main.jsx                 # React DOM mount
├── .env                         # Environment config
├── index.html                   # HTML entrypoint
├── package.json                 # Dependencies
└── vite.config.js               # Vite config
```

---

## Environment Variables

Create `.env` in the `frontend/` root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_SERVER_URL=http://localhost:8000
VITE_RAZORPAY_KEY=rzp_test_your_razorpay_key_id
```

- **`VITE_FIREBASE_API_KEY`**: Google Firebase web client key.
- **`VITE_SERVER_URL`**: API Gateway base URL (default: `http://localhost:8000`).
- **`VITE_RAZORPAY_KEY`**: Razorpay public key for checkout.

---

## Getting Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Opens at **http://localhost:5173**

### Production Build
```bash
npm run build
```

---

## Key Components

### ArtifactPanel.jsx
Split-screen code panel triggered by AI code block responses:
- **Monaco Editor**: Real-time code editing in-browser.
- **Sandboxed iframe Preview**: Renders HTML/CSS/JS output in a sandboxed `<iframe>` using `srcDoc`.

### BillingDrawer.jsx
Razorpay-integrated subscription flow:
- Fetches Order ID from backend.
- Opens native Razorpay checkout.
- Submits payment response to `/api/billing/verify-payment`.

### App.jsx
Core shell combining Navbar, collapsible Sidebar, ChatArea, and ArtifactPanel. Layout adapts dynamically on artifact activation.

---

## State Management

Redux Toolkit slices:
- **`userSlice`**: Login state, user metadata, plan/credits.
- **`conversationSlice`**: Thread list, active thread.
- **`messageSlice`**: Active conversation messages + artifacts.

---

## API Integration

Custom `axios.js` client:
- Base URL from `VITE_SERVER_URL`.
- Interceptor attaches Firebase ID Token as `Authorization: Bearer <token>` on every request.
