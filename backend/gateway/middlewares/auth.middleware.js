import redis from "../../shared/redis/redis.js";

/**
 * Enterprise Authentication Middleware for API Gateway
 * Validates session cookie or Bearer token against Redis session cache.
 */
export const protect = async (req, res, next) => {
  try {
    let sessionId = req.cookies?.session;

    if (!sessionId && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && (parts[0] === "Bearer" || parts[0] === "Session")) {
        sessionId = parts[1];
      }
    }

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required. Please log in to proceed.",
        },
        meta: {
          correlationId: req.correlationId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        error: {
          code: "SESSION_EXPIRED",
          message: "Your session has expired. Please log in again.",
        },
        meta: {
          correlationId: req.correlationId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    req.user = typeof sessionData === "string" ? JSON.parse(sessionData) : sessionData;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "AUTH_ERROR",
        message: error.message || "Failed to authenticate session",
      },
      meta: {
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }

    const userRole = req.user.role || "user";
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Insufficient permissions. Required: [${allowedRoles.join(", ")}], Found: ${userRole}`,
        },
        meta: {
          correlationId: req.correlationId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    next();
  };
};

export default { protect, requireRole };
