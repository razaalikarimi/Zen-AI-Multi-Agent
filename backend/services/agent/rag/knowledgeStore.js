import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse } from "pdf-parse";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { createLogger } from "../../../shared/logger/logger.js";

dotenv.config();
const logger = createLogger("rag-knowledge-store");

// In-memory fallback vector storage for test & local dev environments
class InMemoryVectorCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
  }

  async addDocuments(docs) {
    for (const doc of docs) {
      this.documents.push({
        id: `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        pageContent: doc.pageContent,
        metadata: doc.metadata || {},
      });
    }
    logger.info(`Added ${docs.length} chunks to in-memory collection [${this.name}]`);
  }

  async similaritySearch(query, k = 4, filter = null) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    // Ranked term frequency keyword matching
    const scored = this.documents.map(doc => {
      let score = 0;
      const content = doc.pageContent.toLowerCase();
      queryTerms.forEach(term => {
        if (content.includes(term)) score += 1;
      });
      return { doc, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(s => s.doc);
  }
}

const memoryCollections = new Map();

export class KnowledgeStore {
  constructor() {
    this.embeddings = null;
    if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY.includes("your_")) {
      try {
        this.embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY,
          model: "gemini-embedding-001",
        });
      } catch (e) {
        logger.warn("Gemini embeddings client warning", { error: e.message });
      }
    }
  }

  getCollectionName(userId) {
    const cleanId = String(userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
    return `kb_${cleanId}`;
  }

  async ingestFile(filePath, originalFilename, mimetype, userId) {
    logger.info(`Ingesting document: ${originalFilename} (${mimetype}) for user: ${userId}`);
    let textContent = "";

    try {
      if (mimetype === "application/pdf") {
        const buffer = await fs.readFile(filePath);
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        textContent = result.text;
      } else if (
        mimetype === "text/plain" ||
        mimetype === "text/csv" ||
        mimetype === "text/markdown" ||
        originalFilename.endsWith(".txt") ||
        originalFilename.endsWith(".csv") ||
        originalFilename.endsWith(".md")
      ) {
        textContent = await fs.readFile(filePath, "utf-8");
      } else {
        // Fallback textual read
        textContent = await fs.readFile(filePath, "utf-8");
      }

      if (!textContent.trim()) {
        throw new Error("Document text extraction yielded empty content");
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 150,
      });

      const rawChunks = await splitter.createDocuments([textContent]);
      const chunks = rawChunks.map((chunk, idx) => ({
        pageContent: chunk.pageContent,
        metadata: {
          userId,
          filename: originalFilename,
          chunkIndex: idx,
          totalChunks: rawChunks.length,
          ingestedAt: new Date().toISOString(),
        },
      }));

      const collectionName = this.getCollectionName(userId);

      // Attempt Qdrant persistence if credentials available
      if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY && this.embeddings) {
        try {
          await QdrantVectorStore.fromDocuments(chunks, this.embeddings, {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName,
          });
          logger.info(`Persisted ${chunks.length} chunks into Qdrant collection [${collectionName}]`);
          return { success: true, chunks: chunks.length, filename: originalFilename, storage: "qdrant" };
        } catch (err) {
          logger.warn("Qdrant write failed, falling back to in-memory collection", { error: err.message });
        }
      }

      // Memory collection fallback
      if (!memoryCollections.has(collectionName)) {
        memoryCollections.set(collectionName, new InMemoryVectorCollection(collectionName));
      }
      const memCol = memoryCollections.get(collectionName);
      await memCol.addDocuments(chunks);

      return { success: true, chunks: chunks.length, filename: originalFilename, storage: "memory" };
    } finally {
      // Clean up temporary uploaded file from local disk
      try {
        await fs.unlink(filePath);
      } catch (e) {}
    }
  }

  async searchKnowledge(query, userId, limit = 5) {
    const collectionName = this.getCollectionName(userId);

    // Try Qdrant first if active
    if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY && this.embeddings) {
      try {
        const store = await QdrantVectorStore.fromExistingCollection(this.embeddings, {
          url: process.env.QDRANT_URL,
          apiKey: process.env.QDRANT_API_KEY,
          collectionName,
        });
        const docs = await store.similaritySearch(query, limit);
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        logger.warn("Qdrant query failed, falling back to in-memory RAG", { error: err.message });
      }
    }

    // Fallback to in-memory collection
    const memCol = memoryCollections.get(collectionName);
    if (memCol) {
      return await memCol.similaritySearch(query, limit);
    }

    return [];
  }
}

export const knowledgeStore = new KnowledgeStore();
export default knowledgeStore;
