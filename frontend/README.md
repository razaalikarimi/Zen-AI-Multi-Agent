# ðŸ§  Zen AI - Frontend Client

[![React Version](https://img.shields.io/badge/React-19.2.6-blue.svg?logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.0.12-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.1-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![State Management](https://img.shields.io/badge/Redux_Toolkit-v2.12.0-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

Zen AI's frontend is a high-performance, single-page application (SPA) built using **React 19**, **Vite 8**, and **Tailwind CSS v4**. It features a modern, fluid user interface inspired by premium AI platforms, offering features like real-time multi-agent chat, a Claude-like interactive **Artifacts Panel** with Monaco Editor support, Firebase-authenticated session management, and a seamless Razorpay subscription system.

---

## ðŸ“‹ Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Directory Structure](#-directory-structure)
4. [Environment Variables](#-environment-variables)
5. [Getting Started](#-getting-started)
6. [Key Components & Core Logic](#-key-components--core-logic)
7. [State Management (Redux)](#-state-management-redux)
8. [API Integration Layer](#-api-integration-layer)

---

## âœ¨ Features

- **Interactive Chat Interface**: Sleek message list with markdown parsing, syntax highlighting for code blocks, and dynamic responses.
- **Claude-style Artifacts Panel**: Intercepts AI-generated code blocks and renders them in a dedicated split-screen view. Includes:
  - Live preview of static HTML/JS code.
  - Interactive code editing using the integration of Monaco Editor.
- **Micro-Animations**: Built with Framer Motion for organic UI transitions, sidebar collapses, billing drawer slides, and modal popups.
- **Flexible Model Selection**: Instant model switching (Gemini, Groq, DeepSeek, OpenRouter) via a simple UI dropdown.
- **Secure Authentication**: Uses Firebase Client SDK for password-based or social authentication, integrated with a backend JWT validation middleware.
- **Razorpay Subscription Flow**: Sleek checkout drawer linked to Razorpay's API to upgrade user plans to premium tiers.

---

## ðŸ› ï¸ Tech Stack

- **Core Framework**: [React 19](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json) & [Vite 8](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json)
- **Styling**: [Tailwind CSS v4](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json) (PostCSS & `@tailwindcss/vite` plugin)
- **State Management**: [@reduxjs/toolkit](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json) & [react-redux](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json)
- **Auth**: [Firebase JS SDK](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json) (Client Authentication)
- **Editor**: [@monaco-editor/react](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json) (Visual code editing)
- **Animations**: [Framer Motion v12](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/package.json)
- **Icons**: `lucide-react` & `react-icons`
- **Markdown & Code Rendering**: `react-markdown`, `react-syntax-highlighter`, `remark-gfm`
- **API Client**: `axios` with interceptors for authorization handling

---

## ðŸ“‚ Directory Structure

Below is the directory tree of the frontend codebase:

```bash
zen-ai/frontend/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ assets/             # Static assets (images, logos, etc.)
â”‚   â”œâ”€â”€ components/         # Reusable UI components
â”‚   â”‚   â”œâ”€â”€ AiBanner.jsx    # UI banner promoting premium capabilities
â”‚   â”‚   â”œâ”€â”€ ArtifactPanel.jsx # Interactive panel to view/edit generated code
â”‚   â”‚   â”œâ”€â”€ BillingDrawer.jsx # Subscription/billing popup UI (Razorpay integration)
â”‚   â”‚   â”œâ”€â”€ ChatArea.jsx    # Wrapper for messages list and chat input
â”‚   â”‚   â”œâ”€â”€ ChatInput.jsx   # Input text area with file attachment and submit controls
â”‚   â”‚   â”œâ”€â”€ MessageBubble.jsx# Render bubbles for user and assistant messages
â”‚   â”‚   â”œâ”€â”€ MessageList.jsx  # Lists message bubbles chronologically
â”‚   â”‚   â”œâ”€â”€ ModelSelector.jsx# Dropdown to choose LLM models
â”‚   â”‚   â”œâ”€â”€ Navbar.jsx      # Top application header with profile/auth controls
â”‚   â”‚   â””â”€â”€ Sidebar.jsx     # Side menu holding previous conversations and settings
â”‚   â”œâ”€â”€ features/           # API endpoints and network handlers
â”‚   â”‚   â”œâ”€â”€ agent.api.js    # Multi-agent process communications
â”‚   â”‚   â”œâ”€â”€ billing.api.js  # Subscription order & payment verification requests
â”‚   â”‚   â”œâ”€â”€ conversation.api.js # Thread list fetching, creating, and deleting
â”‚   â”‚   â””â”€â”€ message.api.js  # Message history fetching and sending API calls
â”‚   â”œâ”€â”€ hooks/              # Custom React Hooks
â”‚   â”‚   â””â”€â”€ useCurrentUser.jsx# Hook retrieving user state from store
â”‚   â”œâ”€â”€ redux/              # Redux slices and store configuration
â”‚   â”‚   â”œâ”€â”€ store.js        # Configured Redux store
â”‚   â”‚   â”œâ”€â”€ user.slice.js   # User session and auth state
â”‚   â”‚   â”œâ”€â”€ message.slice.js# Active messages list state
â”‚   â”‚   â””â”€â”€ conversation.slice.js # Active thread list state
â”‚   â”œâ”€â”€ utils/              # Utility helper functions
â”‚   â”‚   â”œâ”€â”€ axios.js        # Custom Axios client with base URL & interceptors
â”‚   â”‚   â””â”€â”€ detectLanguage.js# Language auto-detection for Monaco syntax highlighting
â”‚   â”œâ”€â”€ App.jsx             # Main application router and core layout wrapper
â”‚   â”œâ”€â”€ index.css           # Global stylesheet defining custom Tailwind theme variables
â”‚   â””â”€â”€ main.jsx            # React root mount point
â”œâ”€â”€ .env                    # Local environment config variables
â”œâ”€â”€ eslint.config.js        # Code quality and style lint rules
â”œâ”€â”€ index.html              # Core HTML entrypoint
â”œâ”€â”€ package.json            # NPM project dependencies and scripts
â””â”€â”€ vite.config.js          # Vite configuration
```

---

## ðŸ”‘ Environment Variables

Create a file named `.env` in the root of the `frontend/` directory (see [.env](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/.env) for layout):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_SERVER_URL=http://localhost:8000
VITE_RAZORPAY_KEY=rzp_test_your_razorpay_key_id
```

### Configuration Details:
- **`VITE_FIREBASE_API_KEY`**: Authenticates requests to the Google Firebase project.
- **`VITE_SERVER_URL`**: Point this to the API Gateway port. Default local development value is `http://localhost:8000`.
- **`VITE_RAZORPAY_KEY`**: Needed for the client SDK to launch the checkout script.

---

## ðŸš€ Getting Started

To run the frontend module in a local environment:

### 1. Install Dependencies
Navigate to the frontend folder and run npm install:
```bash
cd frontend
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
By default, the application runs on [http://localhost:5173](http://localhost:5173).

### 3. Build for Production
To bundle the files into static assets (`dist` folder) optimized for CDN deployment:
```bash
npm run build
```

---

## ðŸ§© Key Components & Core Logic

### 1. Artifact Rendering ([ArtifactPanel.jsx](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/components/ArtifactPanel.jsx))
This component splits the screen and renders rich content when code block markers are returned by the agent. It integrates:
- **Monaco Editor**: Embedded React Monaco editor letting users inspect and alter code in real time.
- **Sandboxed Preview**: Renders code directly into an `<iframe>` container using a `srcDoc` template to run custom HTML/CSS/JS without polluting the main window environment.

### 2. Subscriptions ([BillingDrawer.jsx](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/components/BillingDrawer.jsx))
Integrated directly with Razorpay SDK:
- Fetches checkout payload (Order ID, Amount, Currency) from the backend.
- Opens the native Razorpay payment screen.
- Handles success callbacks, submitting the checkout response to `/api/billing/verify` for validation.

### 3. Responsive Shell Layout ([App.jsx](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/App.jsx))
Combines the [Navbar](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/components/Navbar.jsx) and collapsible [Sidebar](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/components/Sidebar.jsx) with main chat areas. The layout adapts dynamically when artifacts are activated, shrinking the chat area to display a split panel.

---

## ðŸ“Š State Management (Redux)

The project leverages Redux Toolkit ([store.js](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/redux/store.js)) for high-frequency user actions:
- **`userSlice`**: Tracks whether a user is logged in, their JWT token, user metadata, and subscription details.
- **`conversationSlice`**: Tracks available chat threads, active thread indicators, and handles naming updates.
- **`messageSlice`**: Stores the chronological array of active messages in the current conversation thread.

---

## ðŸ“¡ API Integration Layer

All API requests pass through the custom [axios.js](file:///e:/01%20Major%20Project/Multi_agent/zen-ai/frontend/src/utils/axios.js) client which implements:
- Base configuration linking to `VITE_SERVER_URL`.
- An interceptor that reads the Firebase ID Token (JWT) from local state or cookies, attaching it automatically under the `Authorization: Bearer <Token>` header for all backend communication.

