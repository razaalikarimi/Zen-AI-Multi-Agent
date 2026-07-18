# Zen AI API Reference

## Base URL
`http://localhost:8000`

## Authentication
All protected routes require a Bearer token:
`Authorization: Bearer <firebase_id_token>`

---

## Auth Endpoints

### POST /api/auth/login
Login or register a user via Firebase token.

**Body:**
`json
{ "token": "firebase_id_token" }
`

**Response:**
`json
{ "user": { "_id": "...", "name": "...", "email": "...", "plan": "free" } }
`

### GET /api/auth/logout
Clears the session cookie and Redis session.

### GET /api/me
Returns currently authenticated user data.

---

## Chat Endpoints

### GET /api/chat/conversations
Returns all conversations for the authenticated user.

### POST /api/chat/conversations
Creates a new conversation thread.

### DELETE /api/chat/conversations/:id
Deletes a conversation and its messages.

### GET /api/chat/messages/:conversationId
Returns all messages for a conversation.

---

## Agent Endpoints

### POST /api/agent/chat
Send a message to the multi-agent system.

**Body:**
`json
{
  "message": "Write a bubble sort in Python",
  "conversationId": "...",
  "agent": "coding",
  "model": "gemini"
}
`

---

## Billing Endpoints

### GET /api/billing/plans
Returns available subscription plans.

### POST /api/billing/create-order
Creates a Razorpay payment order.

### POST /api/billing/verify-payment
Verifies Razorpay payment signature.
