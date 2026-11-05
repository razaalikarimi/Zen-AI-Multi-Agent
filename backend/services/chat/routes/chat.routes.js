import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  saveMessage,
  updateConversation,
  deleteConversation,
  updateMessageFeedback,
} from "../controllers/chat.controller.js";

const router = express.Router();

// RESTful resource paths
router.post("/conversations", createConversation);
router.get("/conversations", getConversations);
router.get("/conversations/:id/messages", getMessages);
router.patch("/conversations/:id", updateConversation);
router.delete("/conversations/:id", deleteConversation);
router.post("/messages/:id/feedback", updateMessageFeedback);

// Legacy backward-compatible endpoints
router.post("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/update-conversation", updateConversation);
router.post("/save-message", saveMessage);
router.get("/get-messages/:id", getMessages);

export default router;
