import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { providerManager } from "../providers/providerManager.js";
import { searchTool } from "../utils/tavily.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("research-agent");

export const researchAgent = async (state) => {
  logger.info("Executing Research Agent", { prompt: state.prompt?.slice(0, 50) });

  let webFindings = "";
  let citations = [];

  try {
    const rawSearch = await searchTool.invoke({ query: state.prompt });
    if (typeof rawSearch === "string") {
      webFindings = rawSearch;
    } else if (Array.isArray(rawSearch)) {
      webFindings = rawSearch.map(r => `[${r.title || "Source"}]: ${r.content || r.snippet || ""}`).join("\n\n");
      citations = rawSearch.map(r => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 150) }));
    }
  } catch (err) {
    logger.warn("Tavily research search skipped or failed", { error: err.message });
  }

  const messages = [
    new SystemMessage(`You are the Zen AI Lead Research Agent.
Synthesize deep, fact-based technical research on the requested topic.

${webFindings ? `Available Real-Time Findings:\n${webFindings}\n\n` : ""}

Rules:
- Provide an Executive Summary.
- Dive into In-Depth Analysis with comparative evaluation.
- Include Current Industry Trends & Future Outlook.
- List Key References and Citations.
- Use professional Markdown formatting with short readable sections.`),
    new HumanMessage(state.prompt),
  ];

  const result = await providerManager.invoke(messages, {
    agent: "research",
    model: state.modelPreference,
  });

  return {
    ...state,
    response: result.content,
    sources: citations,
    tokenUsage: result.tokenUsage,
  };
};

export default researchAgent;

