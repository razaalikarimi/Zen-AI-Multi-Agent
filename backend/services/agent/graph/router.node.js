import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { providerManager } from "../providers/providerManager.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("router-node");

export const routerNode = async (state) => {
  // 1. Explicit user selection
  if (state.agent && state.agent !== "auto") {
    logger.info(`User explicitly requested agent: ${state.agent}`);
    return {
      ...state,
      agent: state.agent,
    };
  }

  // 2. File-based routing
  if (state.file) {
    if (state.file.mimetype?.startsWith("image/")) {
      logger.info("Routing to vision agent based on image upload");
      return { ...state, agent: "vision" };
    }
    if (
      state.file.mimetype === "application/pdf" ||
      state.file.mimetype?.includes("text") ||
      state.file.originalname?.endsWith(".pdf") ||
      state.file.originalname?.endsWith(".docx") ||
      state.file.originalname?.endsWith(".txt") ||
      state.file.originalname?.endsWith(".csv")
    ) {
      logger.info("Routing to document RAG agent based on file upload");
      return { ...state, agent: "pdf_rag" };
    }
  }

  // 3. Intelligent LLM Intent Classification
  const prompt = state.prompt || "";
  const promptLower = prompt.toLowerCase();

  // Fast heuristics to avoid unnecessary latency
  if (promptLower.startsWith("plan ") || promptLower.includes("roadmap") || promptLower.includes("break down the steps")) {
    return { ...state, agent: "planning" };
  }
  if (promptLower.includes("research ") || promptLower.includes("deep dive into")) {
    return { ...state, agent: "research" };
  }
  if (promptLower.includes("write code") || promptLower.includes("build an app") || promptLower.includes("create a website") || promptLower.includes("debug this")) {
    return { ...state, agent: "coding" };
  }
  if (promptLower.includes("analyze this data") || promptLower.includes("statistics") || promptLower.includes("csv")) {
    return { ...state, agent: "data" };
  }
  if (promptLower.startsWith("generate pdf") || promptLower.includes("create a pdf report")) {
    return { ...state, agent: "pdf" };
  }
  if (promptLower.startsWith("create presentation") || promptLower.includes("slides on") || promptLower.includes("generate ppt")) {
    return { ...state, agent: "ppt" };
  }
  if (promptLower.startsWith("generate image") || promptLower.includes("draw an image of")) {
    return { ...state, agent: "image" };
  }

  try {
    const messages = [
      new SystemMessage(`You are the Zen AI Supervisor Intent Classifier.
Classify the user prompt into exactly ONE of the following agents:
- chat (General conversation, advice, questions, greetings)
- planning (Complex multi-step engineering roadmaps, milestone planning)
- research (In-depth multi-source technical investigation)
- coding (Writing code, debugging, HTML/CSS/JS web applications, algorithms)
- data (Data analysis, tabular metrics, calculations, CSV reasoning)
- search (Current real-time news, live sports, stock updates, internet lookup)
- pdf (Generate formal PDF document reports)
- ppt (Generate slide deck presentations)
- image (Generate visual images)

Reply with ONLY the agent name in lowercase, nothing else.`),
      new HumanMessage(prompt),
    ];

    const result = await providerManager.invoke(messages, {
      agent: "router",
      model: state.modelPreference,
    });

    const chosen = result.content?.trim().toLowerCase().split(/\s+/)[0];
    const validAgents = ["chat", "planning", "research", "coding", "data", "search", "pdf", "ppt", "image"];
    const agent = validAgents.includes(chosen) ? chosen : "chat";

    logger.info(`Classified user query -> [${agent}]`, { prompt: prompt.slice(0, 40) });
    return {
      ...state,
      agent,
    };
  } catch (err) {
    logger.warn("Intent classification fallback to chat", { error: err.message });
    return {
      ...state,
      agent: "chat",
    };
  }
};

export default routerNode;
