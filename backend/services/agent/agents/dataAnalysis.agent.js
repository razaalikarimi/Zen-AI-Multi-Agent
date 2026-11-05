import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { providerManager } from "../providers/providerManager.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("data-analysis-agent");

export const dataAnalysisAgent = async (state) => {
  logger.info("Executing Data Analysis Agent", { prompt: state.prompt?.slice(0, 50) });

  const messages = [
    new SystemMessage(`You are the Zen AI Data Analysis & Computational Agent.
Your responsibility is to analyze numerical data, metrics, business KPIs, CSV structures, or statistical problems.

Guidelines:
- Provide an Executive Summary of Key Findings.
- Compute descriptive statistics, trends, and correlations where applicable.
- Present data using clean Markdown tables.
- Suggest actionable data-driven recommendations.
- Keep calculations precise and transparent.`),
    new HumanMessage(state.prompt),
  ];

  const result = await providerManager.invoke(messages, {
    agent: "data",
    model: state.modelPreference,
  });

  return {
    ...state,
    response: result.content,
    tokenUsage: result.tokenUsage,
  };
};

export default dataAnalysisAgent;
