import { createLogger } from "../logger/logger.js";

const logger = createLogger("error-handler");

/**
 * Centralized Enterprise Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const correlationId = req.correlationId || "unknown";
  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || (statusCode === 404 ? "NOT_FOUND" : statusCode === 400 ? "BAD_REQUEST" : statusCode === 401 ? "UNAUTHORIZED" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR");

  logger.error(`[${req.method}] ${req.originalUrl || req.url} Error: ${err.message}`, {
    correlationId,
    statusCode,
    errorCode,
    error: err,
    path: req.originalUrl,
  });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || "An unexpected error occurred",
      details: err.data || err.details || null,
    },
    meta: {
      correlationId,
      timestamp: new Date().toISOString(),
    },
  });
};

export default errorHandler;
