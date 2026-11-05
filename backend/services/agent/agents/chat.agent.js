import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMemory } from "../utils/memory.js";
import { providerManager } from "../providers/providerManager.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("chat-agent");

export const chatAgent = async (state) => {
  logger.info("Executing General Chat Agent", { prompt: state.prompt?.slice(0, 50) });

  if (state.userId) {
    try {
      await checkAgentLimit(state.userId, "chat");
      await deductCredits(state.userId, "chat");
    } catch (e) {
      logger.warn("Chat agent limit or credit check notice", { error: e.message });
    }
  }

  const history = (await getMemory(state.conversationId)) || [];

  const searchContext = state.searchResults
    ? `\n\nReal-Time Web Search Context:\n${JSON.stringify(state.searchResults)}\nAnswer using this verified web context.`
    : "";

  const messages = [
    new SystemMessage(`You are Zen AI, a world-class enterprise AI assistant.
${searchContext}

Formatting Rules:
- Answer directly with high intellectual density.
- Use clean GitHub-flavored Markdown for structure.
- For code snippets, always specify the language in fenced code blocks.
- Format lists cleanly with bullet points.
- Do not mention internal routing tools or implementation details.`),
  ];

  history.slice(-10).forEach((msg) => {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  messages.push(new HumanMessage(state.prompt));

  const result = await providerManager.invoke(messages, {
    agent: "chat",
    model: state.modelPreference,
  });

  return {
    ...state,
    response: result.content,
    images: state.searchResults?.images || [],
    tokenUsage: result.tokenUsage,
  };
};

export default chatAgent;
