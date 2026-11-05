import axios from "axios";
import { graph } from "../graph/supervisor.graph.js";
import { addMessage } from "../utils/memory.js";
import { createLogger } from "../../../shared/logger/logger.js";
import { createServiceAuthHeaders } from "../../../shared/middleware/serviceAuth.js";
import { sendSuccess, sendError } from "../../../shared/utils/response.js";
import { providerManager } from "../providers/providerManager.js";

const logger = createLogger("agent-controller");
const CHAT_SERVICE = process.env.CHAT_SERVICE || "http://localhost:8002";

// Active SSE client cancellation abort controllers
const activeAborts = new Map();

/**
 * Standard Synchronous Multi-Agent Execution Endpoint
 */
export const chat = async (req, res, next) => {
  try {
    const { prompt, conversationId, agent, model } = req.body;
    const userId = req.headers["x-user-id"];

    if (!prompt) {
      return sendError(res, "Missing prompt parameter", 400, "VALIDATION_ERROR");
    }

    logger.info(`Received multi-agent task for conversation: ${conversationId}`, {
      agent,
      model,
      userId,
    });

    // 1. Persist user prompt in conversation memory and Chat Service
    if (conversationId) {
      await addMessage(conversationId, "user", prompt);
      const authPath = "/save-message";
      const authHeaders = createServiceAuthHeaders(authPath);
      await axios.post(
        `${CHAT_SERVICE}${authPath}`,
        { conversationId, role: "user", content: prompt },
        { headers: authHeaders, timeout: 5000 }
      ).catch(e => logger.warn("Failed to persist user message in chat service", { error: e.message }));
    }

    // 2. Execute Supervisor Multi-Agent LangGraph Workflow
    const result = await graph.invoke({
      prompt,
      conversationId,
      userId,
      agent: agent || "auto",
      modelPreference: model || "gemini",
      file: req.file,
    });

    // 3. Persist assistant output
    if (conversationId) {
      await addMessage(conversationId, "assistant", result.response || "");
      const authPath = "/save-message";
      const authHeaders = createServiceAuthHeaders(authPath);
      await axios.post(
        `${CHAT_SERVICE}${authPath}`,
        {
          conversationId,
          role: "assistant",
          content: result.response || "",
          images: result.images || [],
          artifacts: result.artifacts || [],
          sources: result.sources || [],
          tokenUsage: result.tokenUsage || {},
        },
        { headers: authHeaders, timeout: 5000 }
      ).catch(e => logger.warn("Failed to persist assistant message in chat service", { error: e.message }));
    }

    return res.json({
      success: true,
      answer: result.response,
      agentUsed: result.agent,
      images: result.images || [],
      artifacts: result.artifacts || [],
      sources: result.sources || [],
      tokenUsage: result.tokenUsage || {},
    });
  } catch (error) {
    logger.error("Agent chat execution error", { error: error.message });
    next(error);
  }
};

/**
 * Enterprise Server-Sent Events (SSE) Real-Time Streaming Endpoint
 */
export const stream = async (req, res) => {
  const { prompt, conversationId, agent, model } = req.body;
  const userId = req.headers["x-user-id"];

  // Configure Server-Sent Events headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent("status", { message: "Initializing multi-agent pipeline...", agent: "supervisor" });

  const abortController = new AbortController();
  const cancelKey = `${userId || "anon"}_${conversationId || Date.now()}`;
  activeAborts.set(cancelKey, abortController);

  req.on("close", () => {
    logger.info(`Client disconnected from SSE stream: ${cancelKey}`);
    abortController.abort();
    activeAborts.delete(cancelKey);
  });

  try {
    sendEvent("status", { message: "Classifying intent and planning execution...", agent: "router" });

    // Execute supervisor graph
    const result = await graph.invoke({
      prompt,
      conversationId,
      userId,
      agent: agent || "auto",
      modelPreference: model || "gemini",
      file: req.file,
    });

    sendEvent("status", { message: `Executed specialized agent: ${result.agent}`, agent: result.agent });

    // Stream the final response smoothly
    const responseText = result.response || "";
    const words = responseText.split(" ");
    for (const word of words) {
      if (abortController.signal.aborted) break;
      sendEvent("token", { token: word + " " });
      await new Promise(r => setTimeout(r, 15));
    }

    if (result.artifacts && result.artifacts.length > 0) {
      sendEvent("artifacts", { artifacts: result.artifacts });
    }

    if (result.sources && result.sources.length > 0) {
      sendEvent("sources", { sources: result.sources });
    }

    // Persist to Chat Service
    if (conversationId) {
      await addMessage(conversationId, "assistant", responseText);
      const authPath = "/save-message";
      const authHeaders = createServiceAuthHeaders(authPath);
      await axios.post(
        `${CHAT_SERVICE}${authPath}`,
        {
          conversationId,
          role: "assistant",
          content: responseText,
          images: result.images || [],
          artifacts: result.artifacts || [],
          sources: result.sources || [],
          tokenUsage: result.tokenUsage || {},
        },
        { headers: authHeaders, timeout: 5000 }
      ).catch(() => {});
    }

    sendEvent("done", {
      success: true,
      agent: result.agent,
      tokenUsage: result.tokenUsage || {},
    });

    res.end();
  } catch (error) {
    logger.error("SSE Streaming error", { error: error.message });
    sendEvent("error", { message: error.message || "Execution error in multi-agent pipeline" });
    res.end();
  } finally {
    activeAborts.delete(cancelKey);
  }
};

/**
 * Cancel an Active Execution
 */
export const cancel = async (req, res) => {
  const { conversationId } = req.body;
  const userId = req.headers["x-user-id"];
  const cancelKey = `${userId || "anon"}_${conversationId}`;

  if (activeAborts.has(cancelKey)) {
    const controller = activeAborts.get(cancelKey);
    controller.abort();
    activeAborts.delete(cancelKey);
    logger.info(`Cancelled active execution for: ${cancelKey}`);
    return sendSuccess(res, { message: "Execution cancelled successfully" });
  }

  return sendSuccess(res, { message: "No active execution found for this conversation" });
};

export default {
  chat,
  stream,
  cancel,
};
