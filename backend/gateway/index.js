import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";

import { proxyWithUser } from "./utils/proxyWithHeaders.js";
import { protect, requireRole } from "./middlewares/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import correlationIdMiddleware from "../shared/middleware/correlationId.js";
import errorHandler from "../shared/middleware/errorHandler.js";
import { createLogger } from "../shared/logger/logger.js";
import redis from "../shared/redis/redis.js";

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

// Correlation ID & Cookies
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

// Proxied Routes
const AUTH_SERVICE = process.env.AUTH_SERVICE || "http://localhost:8001";
const CHAT_SERVICE = process.env.CHAT_SERVICE || "http://localhost:8002";
const AGENT_SERVICE = process.env.AGENT_SERVICE || "http://localhost:8003";
const BILLING_SERVICE = process.env.BILLING_SERVICE || "http://localhost:8004";

// Auth routes (public login/logout)
app.use("/api/auth", proxy(AUTH_SERVICE, {
  parseReqBody: true,
  proxyReqOptDecorator: (opts, req) => {
    opts.headers["x-correlation-id"] = req.correlationId;
    return opts;
  },
}));

// User profile
app.get("/api/me", protect, getCurrentUser);

// Protected service proxies
app.use("/api/chat", protect, proxyWithUser(CHAT_SERVICE));
app.use("/api/agent", protect, proxyWithUser(AGENT_SERVICE));
app.use("/api/billing", protect, proxyWithUser(BILLING_SERVICE));

// Admin proxy routes
app.use("/api/admin", protect, requireRole("admin"), proxyWithUser(AUTH_SERVICE));

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
