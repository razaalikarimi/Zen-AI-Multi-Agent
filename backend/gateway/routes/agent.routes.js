import express from "express";
import multer from "multer";
import os from "os";
import { protect } from "../middlewares/auth.middleware.js";
import { proxyWithUser } from "../utils/proxyWithHeaders.js";
import {
  handleAgentChat,
  handleAgentStream,
  handleAgentCancel,
  handleGetProviders,
} from "../controllers/agent.controller.js";

const router = express.Router();
const AGENT_SERVICE = process.env.AGENT_SERVICE;

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Direct AI orchestration endpoints
router.post("/chat", protect, upload.single("file"), handleAgentChat);
router.post("/stream", protect, upload.single("file"), handleAgentStream);
router.post("/cancel", protect, handleAgentCancel);
router.get("/providers", handleGetProviders);

// Remote proxy if external microservice configured
if (AGENT_SERVICE && !AGENT_SERVICE.includes("localhost") && AGENT_SERVICE !== "self") {
  router.use("/", protect, proxyWithUser(AGENT_SERVICE));
}

export default router;
