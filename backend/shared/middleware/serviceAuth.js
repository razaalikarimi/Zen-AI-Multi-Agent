import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const CLUSTER_SECRET = process.env.INTERNAL_SERVICE_SECRET || "zen-internal-cluster-secret-key-2025";
const MAX_DRIFT_SECONDS = 120; // 2 minute clock-drift tolerance

/**
 * Generate HMAC SHA-256 signature headers for service-to-service calls.
 */
export const createServiceAuthHeaders = (targetPath = "") => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `${timestamp}:${targetPath}`;
  const signature = crypto
    .createHmac("sha256", CLUSTER_SECRET)
    .update(payload)
    .digest("hex");

  return {
    "x-service-timestamp": timestamp,
    "x-service-signature": signature,
  };
};

/**
 * Middleware to require valid service-to-service signature on internal routes.
 */
export const requireServiceAuth = (req, res, next) => {
  // In pure local dev if bypass flag is set, allow, but in production enforce strictly
  if (process.env.DISABLE_SERVICE_AUTH === "true" && process.env.NODE_ENV === "development") {
    return next();
  }

  const timestamp = req.headers["x-service-timestamp"];
  const signature = req.headers["x-service-signature"];

  if (!timestamp || !signature) {
    return res.status(401).json({
      success: false,
      error: {
        code: "SERVICE_UNAUTHORIZED",
        message: "Missing internal service authentication credentials",
      },
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const reqTime = parseInt(timestamp, 10);
  if (isNaN(reqTime) || Math.abs(now - reqTime) > MAX_DRIFT_SECONDS) {
    return res.status(401).json({
      success: false,
      error: {
        code: "SERVICE_AUTH_EXPIRED",
        message: "Service authentication timestamp is outside the allowable window",
      },
    });
  }

  const path = req.originalUrl?.split("?")[0] || req.path || "";
  const expectedPayload = `${timestamp}:${path}`;
  const expectedSignature = crypto
    .createHmac("sha256", CLUSTER_SECRET)
    .update(expectedPayload)
    .digest("hex");

  // Constant-time comparison
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expectedSignature, "hex");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return res.status(403).json({
      success: false,
      error: {
        code: "SERVICE_FORBIDDEN",
        message: "Invalid internal service signature",
      },
    });
  }

  next();
};

export default {
  createServiceAuthHeaders,
  requireServiceAuth,
};
