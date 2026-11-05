import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { knowledgeStore } from "../rag/knowledgeStore.js";
import { providerManager } from "../providers/providerManager.js";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("pdf-rag-agent");

export const pdfRagAgent = async (state) => {
  logger.info("Executing PDF/Document RAG Agent", {
    prompt: state.prompt?.slice(0, 50),
    hasFile: !!state.file,
  });

  try {
    // 1. If a file was uploaded in this turn, ingest it persistently
    if (state.file) {
      await knowledgeStore.ingestFile(
        state.file.path,
        state.file.originalname,
        state.file.mimetype,
        state.userId || "anonymous"
      );
    }

    // 2. Retrieve relevant context from user's persistent knowledge base
    const relevantDocs = await knowledgeStore.searchKnowledge(
      state.prompt,
      state.userId || "anonymous",
      5
    );

    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n---\n\n");
    const citations = relevantDocs.map((doc) => ({
      title: doc.metadata?.filename || "Uploaded Document",
      snippet: doc.pageContent.slice(0, 150),
      chunkIndex: doc.metadata?.chunkIndex,
    }));

    const messages = [
      new SystemMessage(`You are the Zen AI Enterprise Knowledge & Document RAG Agent.
Answer the user's inquiry based strictly on the provided document context.

Rules:
- Cite exact excerpts or sections where possible.
- If the answer is not present in the context, clearly state: "I could not find information about that in the uploaded documents."
- Use Markdown formatting with headings and bullet points.`),
      new HumanMessage(`Document Context:\n${context || "No context found."}\n\nUser Question:\n${state.prompt}`),
    ];

    const result = await providerManager.invoke(messages, {
      agent: "document-rag",
      model: state.modelPreference,
    });

    return {
      ...state,
      response: result.content,
      sources: citations,
      tokenUsage: result.tokenUsage,
    };
  } catch (error) {
    logger.error("RAG Agent execution failed", { error: error.message });
    return {
      ...state,
      response: `Failed to process document context: ${error.message}`,
    };
  }
};

export default pdfRagAgent;
