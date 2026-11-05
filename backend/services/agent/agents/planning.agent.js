import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { providerManager } from "../providers/providerManager.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("planning-agent");

export const planningAgent = async (state) => {
  logger.info("Executing Planning Agent", { prompt: state.prompt?.slice(0, 50) });

  const messages = [
    new SystemMessage(`You are the Zen AI Planning Agent.
Your responsibility is to take complex user queries and break them down into structured, actionable engineering execution steps.

Format your output strictly in clean Markdown:
# Execution Plan

## 1. Goal Definition
[Clear statement of what needs to be achieved]

## 2. Technical Requirements
- Requirement 1
- Requirement 2

## 3. Step-by-Step Milestones
1. **Phase 1: Architecture & Foundation**
2. **Phase 2: Implementation Details**
3. **Phase 3: Testing & Verification**

## 4. Potential Risks & Edge Cases
- Risk / Mitigation

Keep it concise, actionable, and professional.`),
    new HumanMessage(state.prompt),
  ];

  const result = await providerManager.invoke(messages, {
    agent: "planning",
    model: state.modelPreference,
  });

  return {
    ...state,
    plan: result.content,
    response: result.content,
    tokenUsage: result.tokenUsage,
  };
};

export default planningAgent;
