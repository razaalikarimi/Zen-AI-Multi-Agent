import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";
import correlationIdMiddleware from "../../shared/middleware/correlationId.js";
import errorHandler from "../../shared/middleware/errorHandler.js";
import { createLogger } from "../../shared/logger/logger.js";

dotenv.config();

const logger = createLogger("agent-service");
const app = express();
const port = process.env.PORT || 8003;

app.use(express.json({ limit: "50mb" }));
app.use(correlationIdMiddleware);

// Health Probes
app.get("/health/live", (req, res) => {
  res.status(200).json({ status: "live", service: "agent", timestamp: new Date().toISOString() });
});

app.get("/health/ready", (req, res) => {
  res.status(200).json({ status: "ready", service: "agent", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({ service: "agent", status: "ok" });
});

app.use("/", router);
app.use(errorHandler);

const server = app.listen(port, async () => {
  await connectDB();
  logger.info(`Agent service running on port ${port}`);
});

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down agent service...`);
  server.close(() => {
    logger.info("Agent service HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
