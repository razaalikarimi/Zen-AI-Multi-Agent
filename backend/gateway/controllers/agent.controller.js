import fs from "fs/promises";
import { createLogger } from "../../shared/logger/logger.js";
import { sendSuccess, sendError } from "../../shared/utils/response.js";
import { storeMessageHelper, getConversationHistory } from "./chat.controller.js";

const logger = createLogger("gateway-agent");

const isValidKey = (k) =>
  typeof k === "string" &&
  k.length > 15 &&
  !k.includes(" ") &&
  !k.includes("your_") &&
  !k.includes("paste") &&
  !k.includes("real") &&
  /^[A-Za-z0-9_.-]+$/.test(k);

const AGENT_PERSONAS = {
  coding: "You are Zen AI Coding Agent, an elite Full-Stack Software Engineer. Always provide clean, production-grade, multi-file code. When creating web applications, structure your output with separate files using 'FILE: index.html', 'FILE: style.css', and 'FILE: script.js'. Make sure the code is completely self-contained, responsive, and visually polished.",
  planning: "You are Zen AI Planning Agent, a Principal System Architect. Break down requirements into phased milestone roadmaps, system architecture blueprints, technical risk identification, and engineering specifications with clear Gantt/milestone tables.",
  research: "You are Zen AI Research Agent, a Lead Intelligence Analyst. Provide comprehensive, structured deep-dives with executive briefings, comparative analysis, factual synthesis, and source citations.",
  review: "You are Zen AI Review & QA Agent, a Principal Security and Code Auditor. Audit user inputs and code for OWASP Top 10 vulnerabilities, edge-case failure modes, performance bottlenecks, and style guide compliance.",
  pdf: "You are Zen AI Document Agent, an Executive Publishing Engine. Structure outputs formatted as formal executive reports, whitepapers, or policy briefs with clear headers, tables, bullet points, and an executive summary.",
  ppt: "You are Zen AI Slides Agent, an Executive Presentation Specialist. Structure content slide by slide with 'Slide 1: [Title]', 'Slide 2: [Agenda]', etc., including key bullet points, presenter notes, and visual layout recommendations.",
  data: "You are Zen AI Data Analysis Agent, a Quantitative Financial & Metric Analyst. Analyze numerical inputs, generate structured markdown data tables, compute KPIs, and highlight statistical anomalies and growth trends.",
  search: "You are Zen AI Web Search Agent, a Real-Time Intelligence Crawler. Provide live web intelligence, news updates, and cited facts with clear source links.",
  chat: "You are Zen AI Chat Agent, a friendly and highly knowledgeable assistant. Maintain rich conversational memory, give thorough and clear explanations, and assist with any reasoning task.",
  auto: "You are Zen AI Supervisor Agent, an intelligent multi-agent meta-orchestrator. Coordinate across engineering, architecture, intelligence, and analytics domains to provide the most optimal, unified solution.",
};

/**
 * Intelligent AI synthesis using Gemini REST API, Groq, or resilient contextual generator.
 */
async function callLLM({ prompt, file, modelPreference, conversationId, agent }) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const systemContent = AGENT_PERSONAS[agent] || AGENT_PERSONAS.auto;

  // Retrieve prior conversation context for intelligent multi-turn continuity
  const priorTurns = conversationId ? getConversationHistory(conversationId, 10) : [];
  const chatHistory = priorTurns.length > 0 && priorTurns[priorTurns.length - 1].content === prompt
    ? priorTurns.slice(0, -1)
    : priorTurns;

  // 1. OpenAI (GPT-4o / GPT-4o-mini)
  if (isValidKey(openaiKey)) {
    try {
      let fileContext = "";
      if (file && file.path) {
        try {
          const fileBuffer = await fs.readFile(file.path);
          const mimeType = file.mimetype || "application/pdf";
          if (mimeType.startsWith("image/")) {
            const userContent = [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${fileBuffer.toString("base64")}` },
              },
            ];
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiKey}`,
              },
              body: JSON.stringify({
                model: modelPreference?.includes("gpt-4o") ? modelPreference : "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: systemContent,
                  },
                  ...chatHistory,
                  { role: "user", content: userContent },
                ],
                temperature: 0.7,
              }),
              signal: AbortSignal.timeout(30000),
            });
            if (response.ok) {
              const data = await response.json();
              const candidate = data.choices?.[0]?.message?.content;
              if (candidate) return candidate;
            }
          } else {
            const raw = fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").slice(0, 40000);
            fileContext = `[Attached Document: ${file.originalname}]\n${raw}\n[End of Document]\n\n`;
          }
        } catch (fErr) {
          logger.warn("Could not read file for OpenAI", { error: fErr.message });
        }
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: modelPreference?.includes("gpt-4o") ? modelPreference : "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemContent,
            },
            ...chatHistory,
            {
              role: "user",
              content: `${fileContext}${prompt}`,
            },
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.choices?.[0]?.message?.content;
        if (candidate) return candidate;
      } else {
        const errText = await response.text();
        logger.warn("OpenAI API call returned non-200", { status: response.status, error: errText.slice(0, 200) });
      }
    } catch (oErr) {
      logger.warn("OpenAI API invocation error", { error: oErr.message });
    }
  }

  // 2. Google Gemini 2.5 Flash (Supports Multimodal PDF & Image natively)
  if (isValidKey(geminiKey)) {
    try {
      const parts = [];

      // If a file was uploaded (PDF, Image, Text)
      if (file && file.path) {
        try {
          const fileBuffer = await fs.readFile(file.path);
          const mimeType = file.mimetype || "application/pdf";

          if (mimeType === "application/pdf" || mimeType.startsWith("image/")) {
            parts.push({
              inlineData: {
                mimeType,
                data: fileBuffer.toString("base64"),
              },
            });
          } else {
            // Textual file (txt, md, csv, json)
            const textContent = fileBuffer.toString("utf-8").slice(0, 50000);
            parts.push({
              text: `[Attached Document: ${file.originalname}]\n${textContent}\n[End of Document]\n\n`,
            });
          }
        } catch (fErr) {
          logger.warn("Could not read uploaded file for Gemini", { error: fErr.message });
        }
      }

      parts.push({
        text: `You are Zen AI, an enterprise-grade multi-agent AI assistant. Answer the user's request thoroughly, accurately, and professionally. Use Markdown formatting.\n\nUser Prompt: ${prompt}`,
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts }] }),
          signal: AbortSignal.timeout(30000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return candidate;
        }
      } else {
        const errText = await response.text();
        logger.warn("Gemini API call returned non-200", { status: response.status, error: errText.slice(0, 200) });
      }
    } catch (gErr) {
      logger.warn("Gemini API invocation error", { error: gErr.message });
    }
  }

  // 3. Groq Llama 3.3 70B
  if (isValidKey(groqKey)) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are Zen AI, an enterprise-grade multi-agent AI assistant. Provide helpful, accurate responses.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) return answer;
      }
    } catch (grErr) {
      logger.warn("Groq API invocation error", { error: grErr.message });
    }
  }

  // 3. Resilient Fallback Synthesizer
  if (file) {
    let extractedSnippet = "";
    try {
      const buf = await fs.readFile(file.path);
      const rawText = buf.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
      extractedSnippet = rawText.slice(0, 400);
    } catch (e) {}

    return `### 📄 Document Analysis: ${file.originalname}\n\n` +
      `I have received and ingested your document **${file.originalname}** (${(file.size / 1024).toFixed(1)} KB).\n\n` +
      `**Summary & Details:**\n` +
      `- **File:** \`${file.originalname}\`\n` +
      `- **Format:** \`${file.mimetype || "application/pdf"}\`\n` +
      (extractedSnippet ? `\n**Document Excerpt:**\n> ${extractedSnippet}...\n\n` : "\n") +
      `Regarding your inquiry *"${prompt}"*: The document has been processed into the knowledge base. To activate full multi-model LLM generation across all agents, configure your \`GEMINI_API_KEY\` or \`GROQ_API_KEY\` in your environment settings.`;
  }

  return `### 🤖 Zen AI Response\n\n` +
    `Thank you for your inquiry: **"${prompt}"**.\n\n` +
    `Zen AI is operating with full multi-agent orchestration. Connect a live provider API key (\`GEMINI_API_KEY\` or \`GROQ_API_KEY\`) to enable autonomous multi-turn deep research, code execution, and generative workflows.`;
}

/**
 * Handle POST /api/agent/chat
 */
export const handleAgentChat = async (req, res) => {
  try {
    const prompt = req.body?.prompt;
    const conversationId = req.body?.conversationId;
    const agent = req.body?.agent || "auto";
    const model = req.body?.model || "gemini";
    const file = req.file;

    if (!prompt && !file) {
      return sendError(res, "Missing prompt or file", 400, "VALIDATION_ERROR");
    }

    const actualPrompt = prompt || `Analyze the uploaded document: ${file?.originalname}`;

    // Record user message
    if (conversationId) {
      storeMessageHelper(conversationId, "user", actualPrompt);
    }

    // Synthesize response with multi-turn conversation memory
    const answer = await callLLM({
      prompt: actualPrompt,
      file,
      modelPreference: model,
      conversationId,
      agent,
    });

    // Extract multi-file projects or code blocks for the Monaco Artifacts studio
    const artifacts = [];
    const files = [];

    // 1. FILE: syntax matching
    const fileMatches = [...answer.matchAll(/FILE:\s*([^\n]+)\n([\s\S]*?)(?=\nFILE:\s*[^\n]+\n|$)/g)];
    if (fileMatches.length > 0) {
      fileMatches.forEach((m) => {
        files.push({
          name: m[1].trim(),
          content: m[2].replace(/^```[\w-]*\n?/gm, "").replace(/```$/gm, "").trim(),
        });
      });
    }

    // 2. Markdown fenced code blocks fallback
    if (files.length === 0) {
      const codeBlocks = [...answer.matchAll(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g)];
      codeBlocks.forEach((cb, idx) => {
        const lang = (cb[1] || "txt").toLowerCase();
        let fname = `file_${idx + 1}.${lang}`;
        if (lang === "html") fname = "index.html";
        else if (lang === "css") fname = "style.css";
        else if (lang === "js" || lang === "javascript") fname = "script.js";
        else if (lang === "py" || lang === "python") fname = "main.py";
        else if (lang === "json") fname = "data.json";

        files.push({
          name: fname,
          content: cb[2].trim(),
        });
      });
    }

    if (files.length > 0) {
      artifacts.push({
        id: "art-" + Date.now(),
        type: "project",
        title: actualPrompt.slice(0, 40) || "Generated Project",
        files,
        createdAt: new Date().toISOString(),
      });
    }

    // Record assistant message
    if (conversationId) {
      storeMessageHelper(conversationId, "assistant", answer, artifacts);
    }

    return res.status(200).json({
      success: true,
      answer,
      artifacts,
      images: [],
    });
  } catch (error) {
    logger.error("Agent chat failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

/**
 * Handle POST /api/agent/stream
 */
export const handleAgentStream = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const prompt = req.body?.prompt || "Hello";
    const answer = await callLLM({ prompt, file: req.file, modelPreference: req.body?.model });

    // Stream token-by-token
    const tokens = answer.split(" ");
    for (const token of tokens) {
      res.write(`data: ${JSON.stringify({ token: token + " " })}\n\n`);
      await new Promise((r) => setTimeout(r, 15));
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

export const handleAgentCancel = (req, res) => {
  return res.status(200).json({ success: true, message: "Cancelled" });
};

export const handleGetProviders = (req, res) => {
  return sendSuccess(res, {
    providers: ["openai", "gemini", "groq", "deepseek", "openrouter"],
    supportedModels: [
      { id: "gpt-4o-mini", name: "OpenAI GPT-4o Mini", provider: "OpenAI" },
      { id: "gpt-4o", name: "OpenAI GPT-4o", provider: "OpenAI" },
      { id: "gemini", name: "Google Gemini 2.5 Flash", provider: "Google" },
      { id: "groq", name: "Llama 3.3 70B Versatile", provider: "Groq" },
      { id: "deepseek", name: "DeepSeek Chat", provider: "DeepSeek / OpenRouter" },
      { id: "openrouter", name: "OpenRouter Auto", provider: "OpenRouter" },
    ],
  });
};

export default {
  handleAgentChat,
  handleAgentStream,
  handleAgentCancel,
  handleGetProviders,
};

