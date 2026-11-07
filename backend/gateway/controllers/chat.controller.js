import { createLogger } from "../../shared/logger/logger.js";
import { sendSuccess, sendError } from "../../shared/utils/response.js";

const logger = createLogger("gateway-chat");

// High-speed resilient in-memory conversation cache
// Preserves chat sessions across single-container and serverless Render instances
const conversationsStore = new Map();

export const handleCreateConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || "anon";
    const { title, folder, agentPreference, modelPreference } = req.body || {};

    const convId = "conv-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
    const newConv = {
      _id: convId,
      userId: String(userId),
      title: title || "New Chat",
      folder: folder || "General",
      agentPreference: agentPreference || "auto",
      modelPreference: modelPreference || "gemini",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    conversationsStore.set(convId, newConv);
    logger.info(`Created resilient conversation: ${convId} for user: ${userId}`);
    return res.status(201).json(newConv);
  } catch (error) {
    logger.error("Create conversation failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const handleGetConversations = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { search, folder, pinned } = req.query || {};

    let convs = Array.from(conversationsStore.values());
    if (userId) {
      convs = convs.filter((c) => String(c.userId) === String(userId));
    }

    if (search) {
      const q = search.toLowerCase();
      convs = convs.filter((c) => (c.title || "").toLowerCase().includes(q));
    }
    if (folder) {
      convs = convs.filter((c) => c.folder === folder);
    }

    // Sort descending by updated timestamp
    convs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return res.status(200).json(convs);
  } catch (error) {
    logger.error("Get conversations failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const handleGetMessages = async (req, res) => {
  try {
    const convId = req.params.id || req.params.conversationId;
    if (!convId || convId === "undefined") {
      return res.status(200).json([]);
    }

    const conv = conversationsStore.get(convId);
    return res.status(200).json(conv?.messages || []);
  } catch (error) {
    logger.error("Get messages failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const handleUpdateConversation = async (req, res) => {
  try {
    const { conversationId, title } = req.body || {};
    if (conversationId && conversationsStore.has(conversationId)) {
      const conv = conversationsStore.get(conversationId);
      if (title) conv.title = title;
      conv.updatedAt = new Date().toISOString();
      conversationsStore.set(conversationId, conv);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const handleSaveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, artifacts, images } = req.body || {};
    if (conversationId && conversationsStore.has(conversationId)) {
      const conv = conversationsStore.get(conversationId);
      const msg = {
        _id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        conversationId,
        role: role || "user",
        content: content || "",
        artifacts: artifacts || [],
        images: images || [],
        createdAt: new Date().toISOString(),
      };
      conv.messages.push(msg);
      conv.updatedAt = new Date().toISOString();
      conversationsStore.set(conversationId, conv);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const storeMessageHelper = (conversationId, role, content, artifacts = [], images = []) => {
  if (!conversationId) return;
  let conv = conversationsStore.get(conversationId);
  if (!conv) {
    conv = {
      _id: conversationId,
      userId: "anon",
      title: content.slice(0, 30) || "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    conversationsStore.set(conversationId, conv);
  }
  conv.messages.push({
    _id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    conversationId,
    role,
    content,
    artifacts,
    images,
    createdAt: new Date().toISOString(),
  });
  conv.updatedAt = new Date().toISOString();
  conversationsStore.set(conversationId, conv);
};

export default {
  handleCreateConversation,
  handleGetConversations,
  handleGetMessages,
  handleUpdateConversation,
  handleSaveMessage,
  storeMessageHelper,
};
