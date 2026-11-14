import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/index.js";
import correlationIdMiddleware from "../shared/middleware/correlationId.js";
import errorHandler from "../shared/middleware/errorHandler.js";
import { createLogger } from "../shared/logger/logger.js";
import redis from "../shared/redis/redis.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const logger = createLogger("gateway");
const app = express();
const port = process.env.PORT || 8000;

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://zen-ai-multi-agent.vercel.app",
];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows iframe preview for artifacts
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false, // Prevents COOP from breaking Firebase / Google Auth / Razorpay popups
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === "development" ||
        /\.(vercel\.app|onrender\.com|netlify\.app)$/.test(new URL(origin).hostname)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-ID", "Accept"],
  })
);

// Correlation ID, Cookies, Logger
app.use(correlationIdMiddleware);
app.use(cookieParser());
app.use(morgan("combined"));

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// JSON parser for Gateway endpoints
app.use(express.json({ limit: "20mb" }));

// Liveness & Readiness Probes
app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "live",
    service: "gateway",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/ready", async (req, res) => {
  const redisStatus = redis.status;
  res.status(200).json({
    status: "ready",
    service: "gateway",
    dependencies: {
      redis: redisStatus,
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    service: "Zen AI API Gateway",
    version: "2.0.0",
    status: "healthy",
  });
});

// Centralized API Routes (/api/auth, /api/chat, /api/agent, /api/billing, /api/me)
app.use("/api", apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(port, () => {
  logger.info(`Zen AI Gateway running on port ${port}`, {
    port,
    env: process.env.NODE_ENV || "development",
  });
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  server.close(() => {
    logger.info("Gateway HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Forced gateway shutdown due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
