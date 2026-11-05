import crypto from "crypto";

/**
 * Middleware that extracts or generates a unique correlation ID for every incoming request.
 * Sets the ID on the request object and the response header for distributed tracing.
 */
export const correlationIdMiddleware = (req, res, next) => {
  const incomingId =
    req.headers["x-correlation-id"] ||
    req.headers["x-request-id"] ||
    req.headers["correlation-id"];

  const correlationId = (typeof incomingId === "string" && incomingId.trim())
    ? incomingId.trim()
    : crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
};

export default correlationIdMiddleware;
