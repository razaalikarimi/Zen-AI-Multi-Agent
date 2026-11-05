import express from "express";
import { chat, stream, cancel } from "../controllers/agent.controller.js";
import multer from "../config/multer.js";
import { providerManager } from "../providers/providerManager.js";
import { sendSuccess } from "../../../shared/utils/response.js";

const router = express.Router();

router.post("/chat", multer.single("file"), chat);
router.post("/stream", multer.single("file"), stream);
router.post("/cancel", cancel);

router.get("/providers", (req, res) => {
  return sendSuccess(res, {
    providers: providerManager.getAvailableProviderKeys(),
    supportedModels: [
      { id: "gemini", name: "Google Gemini 2.5 Flash", provider: "Google" },
      { id: "groq", name: "Llama 3.3 70B Versatile", provider: "Groq" },
      { id: "deepseek", name: "DeepSeek Chat", provider: "DeepSeek / OpenRouter" },
      { id: "openrouter", name: "OpenRouter Auto", provider: "OpenRouter" },
    ],
  });
});

export default router;
