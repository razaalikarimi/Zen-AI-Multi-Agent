import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { providerManager } from "../providers/providerManager.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("coding-agent");

function cleanCode(code = "") {
  return code
    .replace(/^```[\w-]*\n?/gm, "")
    .replace(/```$/gm, "")
    .trim();
}

export const codingAgent = async (state) => {
  logger.info("Executing Coding Agent", { prompt: state.prompt?.slice(0, 50) });

  if (state.userId) {
    try {
      await checkAgentLimit(state.userId, "coding");
      await deductCredits(state.userId, "coding");
    } catch (e) {
      logger.warn("Rate limit or credit warning in coding agent", { error: e.message });
    }
  }

  const messages = [
    new SystemMessage(`You are the Zen AI Senior Staff Software Engineer & Coding Agent.

Instructions:
1. If the user asks for code explanation, debugging, or code review:
   - Provide an in-depth, structured explanation using Markdown.
   - Use Markdown code blocks with language identifiers.
   - Do NOT use the FILE: format for purely explanatory queries.

2. If the user asks to build, create, or generate an application, component, website, or script:
   - Always return complete, production-ready code with NO placeholders.
   - For web projects, provide multi-file artifacts using this exact format:

FILE: index.html
<!DOCTYPE html>
<html>
...
</html>

FILE: style.css
...

FILE: script.js
...

- For standalone backend/algorithmic code (Python, Go, Node, Java, Rust):
FILE: main.py (or appropriate filename)
...

Rules:
- High quality, responsive design with clean typography.
- Never truncate code with "...existing code...".
- Return clean code that can immediately run in a browser or runtime.`),
    new HumanMessage(state.prompt),
  ];

  const result = await providerManager.invoke(messages, {
    agent: "coding",
    model: state.modelPreference,
  });

  const content = result.content?.trim() || "";
  const files = [];

  const matches = [
    ...content.matchAll(/FILE:\s*([^\n]+)\n([\s\S]*?)(?=\nFILE:\s*[^\n]+\n|$)/g),
  ];

  if (matches.length > 0) {
    matches.forEach((match) => {
      files.push({
        name: match[1].trim(),
        content: cleanCode(match[2]),
      });
    });
  }

  if (files.length > 0) {
    return {
      ...state,
      response: "Generated complete multi-file project. Open the Artifact Studio on the right to edit and preview.",
      artifacts: [
        {
          id: Date.now(),
          type: "project",
          title: state.prompt.slice(0, 50),
          files,
          createdAt: new Date().toISOString(),
        },
      ],
      tokenUsage: result.tokenUsage,
    };
  }

  return {
    ...state,
    response: content,
    artifacts: [],
    tokenUsage: result.tokenUsage,
  };
};

export default codingAgent;
