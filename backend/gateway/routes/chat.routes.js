import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { proxyWithUser } from "../utils/proxyWithHeaders.js";
import {
  handleCreateConversation,
  handleGetConversations,
  handleGetMessages,
  handleUpdateConversation,
  handleSaveMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();
const CHAT_SERVICE = process.env.CHAT_SERVICE;

// Direct resilient endpoints
router.post("/create-conversation", protect, handleCreateConversation);
router.get("/get-conversations", protect, handleGetConversations);
router.get("/get-messages/:id", protect, handleGetMessages);
router.post("/update-conversation", protect, handleUpdateConversation);
router.post("/save-message", protect, handleSaveMessage);

// RESTful aliases
router.get("/conversations", protect, handleGetConversations);
router.post("/conversations", protect, handleCreateConversation);

// Remote proxy if external microservice configured
if (CHAT_SERVICE && !CHAT_SERVICE.includes("localhost") && CHAT_SERVICE !== "self") {
  router.use("/", protect, proxyWithUser(CHAT_SERVICE));
}

export default router;

