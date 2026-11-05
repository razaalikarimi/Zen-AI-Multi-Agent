import test from "node:test";
import assert from "node:assert/strict";
import { routerNode } from "../services/agent/graph/router.node.js";

test("Supervisor Router: Explicit User Agent Selection Override", async () => {
  const state = {
    prompt: "Show me current news",
    agent: "coding", // User explicitly picked coding
  };

  const routed = await routerNode(state);
  assert.equal(routed.agent, "coding", "Explicit agent override must be honored");
});

test("Supervisor Router: File-Type Heuristic Routing", async () => {
  const imageState = {
    prompt: "What is this?",
    file: { mimetype: "image/png", originalname: "diagram.png" },
  };
  const routedImage = await routerNode(imageState);
  assert.equal(routedImage.agent, "vision", "Image file must route to vision agent");

  const pdfState = {
    prompt: "Summarize this report",
    file: { mimetype: "application/pdf", originalname: "report.pdf" },
  };
  const routedPdf = await routerNode(pdfState);
  assert.equal(routedPdf.agent, "pdf_rag", "PDF file must route to pdf_rag agent");
});

test("Supervisor Router: Intent Heuristics (Code, Plan, Research)", async () => {
  const planState = { prompt: "Plan the engineering roadmap for our search feature" };
  const routedPlan = await routerNode(planState);
  assert.equal(routedPlan.agent, "planning", "Roadmap inquiry must route to planning");

  const codeState = { prompt: "Write code to implement a binary search tree in Java" };
  const routedCode = await routerNode(codeState);
  assert.equal(routedCode.agent, "coding", "Write code inquiry must route to coding");
});

