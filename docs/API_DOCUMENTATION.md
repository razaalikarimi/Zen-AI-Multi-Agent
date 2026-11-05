# Zen AI — Enterprise API Specification

**Version:** 2.0.0  
**Base URL:** `http://localhost:5000` (or `http://localhost:8000` depending on configuration)  
**Protocol:** HTTPS / HTTP 1.1 / Server-Sent Events (SSE)  
**Content-Type:** `application/json` (unless multipart/form-data for uploads or text/event-stream for SSE)

---

## 1. Authentication & Common Headers

### Request Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Cookie` | String | `session=<session_id>` (Session cookie issued on login) |
| `Authorization` | String | `Bearer <firebase_id_token>` (Optional alternative token) |
| `X-Correlation-ID` | UUID | Client request correlation ID (auto-generated if omitted) |

### Common Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": []
  },
  "meta": {
    "correlationId": "c1f7b82e-9d2a-4b6e-821f-1c4b92a3f019",
    "timestamp": "2025-03-30T12:00:00.000Z"
  }
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 User Login
- **Method / Path:** `POST /api/auth/login`
- **Description:** Verifies Firebase token or mock token (dev only) and initiates a 7-day secure session.
- **Request Body:**
  ```json
  {
    "token": "firebase_id_token_string"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "67412fa0b91e123456789abc",
      "firebaseUid": "FIREBASE_UID_123",
      "email": "user@example.com",
      "name": "Jane Doe",
      "avatar": "https://avatar.iran.liara.run/public/38",
      "role": "user",
      "plan": "free",
      "credits": 100,
      "totalCredits": 100
    }
  }
  ```

### 2.2 User Logout
- **Method / Path:** `POST /api/auth/logout` (or `GET /api/auth/logout`)
- **Description:** Invalidates Redis session and clears HTTP cookie.
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

### 2.3 Current User Profile
- **Method / Path:** `GET /api/me`
- **Description:** Retrieves the profile, role, subscription tier, and remaining credits for the authenticated user.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "userId": "67412fa0b91e123456789abc",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "user",
      "plan": "free",
      "credits": 95,
      "totalCredits": 100
    }
  }
  ```

---

## 3. Chat & Conversation Endpoints (`/api/chat`)

### 3.1 List User Conversations
- **Method / Path:** `GET /api/chat/conversations` (and legacy `GET /api/chat/get-conversations`)
- **Query Parameters:**
  - `page` (optional, default 1)
  - `limit` (optional, default 20)
  - `pinned` (optional, boolean filter)
  - `folder` (optional, string)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "conversations": [
      {
        "_id": "674201fa0b91e987654321ab",
        "title": "React Dashboard Setup",
        "isPinned": false,
        "folder": "Work",
        "createdAt": "2025-03-30T10:00:00.000Z",
        "updatedAt": "2025-03-30T10:30:00.000Z"
      }
    ],
    "total": 1
  }
  ```

### 3.2 Create Conversation
- **Method / Path:** `POST /api/chat/conversations` (and legacy `POST /api/chat/create-conversation`)
- **Request Body:**
  ```json
  {
    "title": "New Chat",
    "folder": "General"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "conversation": {
      "_id": "674201fa0b91e987654321ab",
      "userId": "67412fa0b91e123456789abc",
      "title": "New Chat",
      "isPinned": false
    }
  }
  ```

### 3.3 Get Conversation Messages (Anti-IDOR Enforced)
- **Method / Path:** `GET /api/chat/conversations/:id/messages` (and legacy `GET /api/chat/get-messages/:id`)
- **Description:** Returns chronological messages for the verified conversation owner only.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "messages": [
      {
        "_id": "674312fa0b91e456789012cd",
        "conversationId": "674201fa0b91e987654321ab",
        "role": "user",
        "content": "Create an enterprise auth hook in React",
        "createdAt": "2025-03-30T10:05:00.000Z"
      },
      {
        "_id": "674312fa0b91e456789012ce",
        "conversationId": "674201fa0b91e987654321ab",
        "role": "assistant",
        "content": "Here is the implementation...",
        "artifacts": [],
        "createdAt": "2025-03-30T10:05:05.000Z"
      }
    ]
  }
  ```

### 3.4 Update Conversation (Title / Pin / Folder)
- **Method / Path:** `PATCH /api/chat/conversations/:id` (and legacy `POST /api/chat/update-conversation`)
- **Request Body:**
  ```json
  {
    "title": "Refactored React Auth Hook",
    "isPinned": true,
    "folder": "Frontend"
  }
  ```

### 3.5 Delete Conversation
- **Method / Path:** `DELETE /api/chat/conversations/:id`
- **Description:** Deletes conversation and all associated messages securely for the authenticated owner.

---

## 4. Multi-Agent AI Endpoints (`/api/agent`)

### 4.1 Execute Multi-Agent Workflow (Streaming SSE)
- **Method / Path:** `POST /api/agent/stream` (and `POST /api/agent/chat`)
- **Accept:** `text/event-stream` or `application/json`
- **Content-Type:** `multipart/form-data` or `application/json`
- **Parameters / Form Fields:**
  - `prompt`: String (user question / instructions)
  - `conversationId`: String (target conversation ID)
  - `agent`: String (`auto` | `chat` | `coding` | `research` | `data` | `document` | `pdf` | `ppt` | `search` | `vision`)
  - `model`: String (`gemini` | `groq` | `deepseek` | `openrouter`)
  - `file`: File binary (optional PDF, DOCX, image)
- **SSE Stream Events:**
  - `event: thinking` -> `{ "agent": "supervisor", "thought": "Analyzing intent..." }`
  - `event: tool_call` -> `{ "tool": "tavily_search", "query": "..." }`
  - `event: token` -> `{ "delta": "Here " }`
  - `event: artifact` -> `{ "artifact": { "id": 1, "type": "project", "files": [...] } }`
  - `event: done` -> `{ "cost": 0.002, "tokens": 1420, "creditsRemaining": 92 }`

### 4.2 Cancel Active Workflow Execution
- **Method / Path:** `POST /api/agent/cancel`
- **Request Body:**
  ```json
  {
    "conversationId": "674201fa0b91e987654321ab"
  }
  ```

---

## 5. Billing & Subscription Endpoints (`/api/billing`)

### 5.1 Create Razorpay Order
- **Method / Path:** `POST /api/billing/create-order`
- **Request Body:**
  ```json
  {
    "plan": "pro"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "order": {
      "id": "order_EKf3352fs982jK",
      "amount": 49900,
      "currency": "INR"
    },
    "plan": {
      "id": "pro",
      "name": "Pro Plan",
      "credits": 1000
    }
  }
  ```

### 5.2 Verify Payment (Idempotent)
- **Method / Path:** `POST /api/billing/verify-payment`
- **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_EKf3352fs982jK",
    "razorpay_payment_id": "pay_29QQoUBi66xm2f",
    "razorpay_signature": "9ef4b22c7d9..."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment verified and plan activated successfully",
    "plan": "pro",
    "credits": 1000
  }
  ```

### 5.3 Razorpay Webhook Receiver
- **Method / Path:** `POST /api/billing/webhook`
- **Headers:** `X-Razorpay-Signature: <HMAC_SHA256>`
- **Description:** Verifies webhook payload signature and updates payment status asynchronously.

### 5.4 User Transaction & Invoice History
- **Method / Path:** `GET /api/billing/transactions`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "transactions": [
      {
        "orderId": "order_EKf3352fs982jK",
        "paymentId": "pay_29QQoUBi66xm2f",
        "plan": "pro",
        "amount": 499,
        "credits": 1000,
        "status": "paid",
        "createdAt": "2025-03-30T11:00:00.000Z"
      }
    ]
  }
  ```

---

## 6. Admin Endpoints (`/api/admin`)

### 6.1 Platform Metrics & Health
- **Method / Path:** `GET /api/admin/overview`
- **Headers:** Requires user with role `admin`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "metrics": {
      "totalUsers": 1420,
      "activeSubscriptions": 380,
      "totalTokensProcessed": 89400230,
      "estimatedMonthlyCostUSD": 142.50
    }
  }
  ```

### 6.2 User List & Role Management
- **Method / Path:** `GET /api/admin/users` & `PATCH /api/admin/users/:id/role`

---

*API Documentation conforms to OpenAPI 3.1 specification.*
