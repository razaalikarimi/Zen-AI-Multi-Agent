import { StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { routerNode } from "./router.node.js";

// Specialized Agents
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageAgent } from "../agents/imageGen.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRagAgent } from "../agents/pdfRag.agent.js";
import { planningAgent } from "../agents/planning.agent.js";
import { researchAgent } from "../agents/research.agent.js";
import { reviewAgent } from "../agents/review.agent.js";
import { dataAnalysisAgent } from "../agents/dataAnalysis.agent.js";

const workflow = new StateGraph(AgentState);

// Add Graph Nodes
workflow.addNode("router", routerNode);
workflow.addNode("planning", planningAgent);
workflow.addNode("research", researchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("data", dataAnalysisAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("image", imageAgent);
workflow.addNode("vision", visionAgent);
workflow.addNode("pdf_rag", pdfRagAgent);
workflow.addNode("chat", chatAgent);
workflow.addNode("review", reviewAgent);

// Graph Starting Point
workflow.addEdge("__start__", "router");

// Dynamic Routing Conditional Edges
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "planning":
        return "planning";
      case "research":
        return "research";
      case "coding":
        return "coding";
      case "data":
        return "data";
      case "search":
        return "search";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "image":
        return "image";
      case "vision":
        return "vision";
      case "pdf_rag":
        return "pdf_rag";
      default:
        return "chat";
    }
  },
  {
    planning: "planning",
    research: "research",
    coding: "coding",
    data: "data",
    search: "search",
    pdf: "pdf",
    ppt: "ppt",
    image: "image",
    vision: "vision",
    pdf_rag: "pdf_rag",
    chat: "chat",
  }
);

// Review & Validation Interceptions
workflow.addEdge("coding", "review");
workflow.addEdge("research", "review");
workflow.addEdge("data", "review");
workflow.addEdge("review", "__end__");

// Direct Terminal Edges
workflow.addEdge("planning", "__end__");
workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("image", "__end__");
workflow.addEdge("vision", "__end__");
workflow.addEdge("pdf_rag", "__end__");

export const graph = workflow.compile();
export default graph;
