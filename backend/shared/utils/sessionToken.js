import crypto from "crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.INTERNAL_SERVICE_SECRET ||
  "zen-internal-cluster-secret-key-2025";

/**
 * Sign a session payload into a tamper-proof session token.
 * Format: base64url(payload).base64url(signature)
 */
export const signSessionToken = (payload, expiresInSeconds = 60 * 60 * 24 * 7) => {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const data = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
};

/**
 * Verify and decode an HMAC-signed session token.
 */
export const verifySessionToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
};

export default {
  signSessionToken,
  verifySessionToken,
};
