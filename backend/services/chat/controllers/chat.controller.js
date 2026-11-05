import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { createLogger } from "../../../shared/logger/logger.js";
import { sendSuccess, sendError } from "../../../shared/utils/response.js";

const logger = createLogger("chat-controller");

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return sendError(res, "Missing user identification", 401, "UNAUTHORIZED");
    }

    const { title, folder, agentPreference, modelPreference } = req.body || {};

    const conversation = await Conversation.create({
      userId,
      title: title || "New Chat",
      folder: folder || "General",
      agentPreference: agentPreference || "auto",
      modelPreference: modelPreference || "gemini",
    });

    logger.info(`Created conversation: ${conversation._id} for user ${userId}`);
    return res.status(201).json(conversation);
  } catch (error) {
    logger.error("Create conversation failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return sendError(res, "Missing user identification", 401, "UNAUTHORIZED");
    }

    const { search, folder, pinned } = req.query;
    const filter = { userId };

    if (search) {
      filter.$text = { $search: search };
    }
    if (folder) {
      filter.folder = folder;
    }
    if (pinned === "true") {
      filter.isPinned = true;
    }

    const conversations = await Conversation.find(filter).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    return res.json(conversations);
  } catch (error) {
    logger.error("Get conversations failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversationId = req.params.id || req.params.conversationId;

    if (!userId) {
      return sendError(res, "Missing user identification", 401, "UNAUTHORIZED");
    }

    // Anti-IDOR Security Guard: Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return sendError(
        res,
        "Conversation not found or access denied",
        404,
        "NOT_FOUND_OR_FORBIDDEN"
      );
    }

    const messages = await Message.find({
      conversationId,
    }).sort({
      createdAt: 1,
    });

    return res.json(messages);
  } catch (error) {
    logger.error("Get messages failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const saveMessage = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const {
      conversationId,
      role,
      content,
      reasoning,
      agent,
      images,
      artifacts,
      sources,
      tokenUsage,
    } = req.body;

    if (!conversationId || !role) {
      return sendError(res, "Missing required message fields", 400, "VALIDATION_ERROR");
    }

    // Verify conversation exists
    if (userId) {
      const conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return sendError(res, "Conversation ownership mismatch", 403, "FORBIDDEN");
      }
    }

    const message = await Message.create({
      conversationId,
      role,
      content: content || "",
      reasoning: reasoning || "",
      agent: agent || "auto",
      images: images || [],
      artifacts: artifacts || [],
      sources: sources || [],
      tokenUsage: tokenUsage || {},
    });

    // Touch conversation updatedAt timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    return res.status(201).json(message);
  } catch (error) {
    logger.error("Save message failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const updateConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversationId = req.params.id || req.body.conversationId;
    const { title, isPinned, folder } = req.body;

    if (!userId) {
      return sendError(res, "Missing user identification", 401, "UNAUTHORIZED");
    }

    // Anti-IDOR: Check ownership
    const updateFields = {};
    if (typeof title === "string") updateFields.title = title.trim();
    if (typeof isPinned === "boolean") updateFields.isPinned = isPinned;
    if (typeof folder === "string") updateFields.folder = folder.trim();

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId },
      { $set: updateFields },
      { new: true }
    );

    if (!conversation) {
      return sendError(res, "Conversation not found or unauthorized", 404, "NOT_FOUND");
    }

    return res.json(conversation);
  } catch (error) {
    logger.error("Update conversation failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversationId = req.params.id;

    if (!userId) {
      return sendError(res, "Missing user identification", 401, "UNAUTHORIZED");
    }

    // Anti-IDOR: Delete only if user owns it
    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return sendError(res, "Conversation not found or unauthorized", 404, "NOT_FOUND");
    }

    // Clean up all messages
    await Message.deleteMany({ conversationId });
    logger.info(`Deleted conversation: ${conversationId} and its messages`);

    return sendSuccess(res, { message: "Conversation deleted successfully" });
  } catch (error) {
    logger.error("Delete conversation failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const updateMessageFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      { feedback: { rating, comment } },
      { new: true }
    );

    if (!message) {
      return sendError(res, "Message not found", 404, "NOT_FOUND");
    }

    return sendSuccess(res, { message });
  } catch (error) {
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export default {
  createConversation,
  getConversations,
  getMessages,
  saveMessage,
  updateConversation,
  deleteConversation,
  updateMessageFeedback,
};
