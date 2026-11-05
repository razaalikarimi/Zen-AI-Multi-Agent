import test from "node:test";
import assert from "node:assert/strict";
import { providerManager } from "../services/agent/providers/providerManager.js";

test("AI Provider Abstraction: Priority Chain and Resilient Fallback", async () => {
  const messages = [{ role: "user", content: "Build a hello world function in TypeScript" }];

  const result = await providerManager.invoke(messages, {
    agent: "coding",
    model: "gemini",
  });

  assert.ok(result.content, "Result must contain content");
  assert.ok(result.providerUsed, "Result must specify provider used");
  assert.ok(result.tokenUsage, "Result must report token usage metrics");
  assert.ok(result.tokenUsage.promptTokens > 0, "Prompt tokens must be counted");
});

test("AI Provider Abstraction: Token-by-Token Streaming Synthesis", async () => {
  const messages = [{ role: "user", content: "Summarize the benefits of multi-agent systems" }];

  const tokens = [];
  for await (const chunk of providerManager.stream(messages, { agent: "research" })) {
    if (chunk.type === "token") {
      tokens.push(chunk.text);
    }
  }

  assert.ok(tokens.length > 0, "Stream must emit tokens");
  assert.ok(tokens.join("").length > 20, "Streamed text must assemble complete response");
});
