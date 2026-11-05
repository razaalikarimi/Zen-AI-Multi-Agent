import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  prompt: Annotation(),
  conversationId: Annotation(),
  userId: Annotation(),
  agent: Annotation(),
  modelPreference: Annotation(),
  response: Annotation(),
  reasoning: Annotation(),
  plan: Annotation(),
  images: Annotation(),
  file: Annotation(),
  artifacts: Annotation(),
  searchResults: Annotation(),
  sources: Annotation(),
  codeContext: Annotation(),
  pdfContext: Annotation(),
  tokenUsage: Annotation(),
  reviewed: Annotation(),
});

export default AgentState;
