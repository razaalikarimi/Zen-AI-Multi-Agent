import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
import { searchTool } from "../utils/tavily.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("search-agent");

export const searchAgent = async (state) => {
  logger.info("Executing Web Search Agent", { query: state.prompt?.slice(0, 50) });

  if (state.userId) {
    try {
      await checkAgentLimit(state.userId, "search");
      await deductCredits(state.userId, "search");
    } catch (e) {
      logger.warn("Search agent credit/limit notice", { error: e.message });
    }
  }

  try {
    const results = await searchTool.invoke({ query: state.prompt });
    let formattedResults = "";
    let citations = [];

    if (typeof results === "string") {
      formattedResults = results;
    } else if (Array.isArray(results)) {
      formattedResults = results.map(r => `[${r.title || "Web Source"}]: ${r.content || r.snippet || ""}`).join("\n\n");
      citations = results.map(r => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 150) }));
    }

    return {
      ...state,
      searchResults: formattedResults || results,
      sources: citations,
    };
  } catch (error) {
    logger.warn("Tavily search tool error, proceeding without web context", { error: error.message });
    return {
      ...state,
      searchResults: "No live web results available.",
      sources: [],
    };
  }
};

export default searchAgent;
