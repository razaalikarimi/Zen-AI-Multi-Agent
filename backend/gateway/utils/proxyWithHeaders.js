import proxy from "express-http-proxy";
import { createServiceAuthHeaders } from "../../shared/middleware/serviceAuth.js";

/**
 * Enterprise Gateway Proxy with User Context & HMAC Service Authentication
 */
export const proxyWithUser = (serviceUrl) => {
  return proxy(serviceUrl, {
    parseReqBody: true,
    timeout: 120000, // 2-minute timeout for LLM workflows

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Strip any client-supplied spoofed internal headers
      delete proxyReqOpts.headers["x-user-id"];
      delete proxyReqOpts.headers["x-user-email"];
      delete proxyReqOpts.headers["x-user-role"];
      delete proxyReqOpts.headers["x-user-avatar"];

      // Inject correlation ID for distributed tracing
      proxyReqOpts.headers["x-correlation-id"] = srcReq.correlationId || "req-" + Date.now();

      // Inject verified authenticated user headers
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = String(srcReq.user.userId || srcReq.user._id || "");
        proxyReqOpts.headers["x-user-email"] = String(srcReq.user.email || "");
        proxyReqOpts.headers["x-user-role"] = String(srcReq.user.role || "user");
        proxyReqOpts.headers["x-user-avatar"] = String(srcReq.user.avatar || "");
      }

      // Inject cryptographic HMAC service-to-service authentication
      const pathOnly = srcReq.originalUrl?.split("?")[0] || "";
      const authHeaders = createServiceAuthHeaders(pathOnly);
      Object.assign(proxyReqOpts.headers, authHeaders);

      return proxyReqOpts;
    },

    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      // If express.json() already parsed the body into an object, re-serialize it as JSON
      if (srcReq.body && typeof srcReq.body === "object" && !(srcReq.body instanceof Buffer)) {
        return JSON.stringify(srcReq.body);
      }
      return bodyContent;
    },

    proxyErrorHandler: (err, res, next) => {
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        return res.status(503).json({
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: `Target service is temporarily unavailable (${serviceUrl})`,
          },
          meta: {
            correlationId: res.req?.correlationId,
            timestamp: new Date().toISOString(),
          },
        });
      }
      next(err);
    },
  });
};

export default proxyWithUser;
