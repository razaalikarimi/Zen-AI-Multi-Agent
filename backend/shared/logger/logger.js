/**
 * Structured Logger for Zen AI Enterprise Platform
 * Provides standardized JSON logging with correlation IDs and timestamps.
 */

const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const currentLevelName = (process.env.LOG_LEVEL || "info").toLowerCase();
const currentLevel = LOG_LEVELS[currentLevelName] || LOG_LEVELS.info;

export const createLogger = (serviceName = "zen-ai") => {
  const log = (level, message, meta = {}) => {
    if (LOG_LEVELS[level] < currentLevel) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      service: serviceName,
      level: level.toUpperCase(),
      message,
      correlationId: meta.correlationId || meta.req?.correlationId || "system",
      ...meta,
    };

    if (meta.error instanceof Error) {
      logEntry.error = {
        message: meta.error.message,
        stack: meta.error.stack,
        name: meta.error.name,
      };
    }

    const output = JSON.stringify(logEntry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  };

  return {
    debug: (msg, meta) => log("debug", msg, meta),
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta),
  };
};

export default createLogger("zen-ai");
