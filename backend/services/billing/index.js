import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/billing.routes.js";
import correlationIdMiddleware from "../../shared/middleware/correlationId.js";
import errorHandler from "../../shared/middleware/errorHandler.js";
import { createLogger } from "../../shared/logger/logger.js";

dotenv.config();

const logger = createLogger("billing-service");
const app = express();
const port = process.env.PORT || 8004;

app.use(express.json());
app.use(correlationIdMiddleware);

// Health Probes
app.get("/health/live", (req, res) => {
  res.status(200).json({ status: "live", service: "billing", timestamp: new Date().toISOString() });
});

app.get("/health/ready", (req, res) => {
  res.status(200).json({ status: "ready", service: "billing", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({ service: "billing", status: "ok" });
});

app.use("/", router);
app.use(errorHandler);

const server = app.listen(port, async () => {
  await connectDB();
  logger.info(`Billing service running on port ${port}`);
});

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down billing service...`);
  server.close(() => {
    logger.info("Billing service HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
