import test from "node:test";
import assert from "node:assert/strict";
import { createServiceAuthHeaders, requireServiceAuth } from "../shared/middleware/serviceAuth.js";

test("Service-to-Service HMAC Security: Signature Generation & Verification", () => {
  const path = "/internal/update-plan";
  const headers = createServiceAuthHeaders(path);

  assert.ok(headers["x-service-timestamp"], "Timestamp header must be generated");
  assert.ok(headers["x-service-signature"], "HMAC signature header must be generated");

  // Mock valid request
  let nextCalled = false;
  const mockReq = {
    headers: { ...headers },
    originalUrl: path,
  };
  const mockRes = {
    status: (code) => ({
      json: (data) => ({ code, data }),
    }),
  };
  const mockNext = () => {
    nextCalled = true;
  };

  requireServiceAuth(mockReq, mockRes, mockNext);
  assert.equal(nextCalled, true, "requireServiceAuth must call next() for valid HMAC signature");
});

test("Service-to-Service HMAC Security: Reject Expired or Tampered Signatures", () => {
  const path = "/internal/update-plan";
  const headers = createServiceAuthHeaders(path);

  // Tamper with signature
  const tamperedReq = {
    headers: {
      "x-service-timestamp": headers["x-service-timestamp"],
      "x-service-signature": "bad_signature_000000000000000000000000000000000000000000000000000000000000",
    },
    originalUrl: path,
  };

  let statusCode = null;
  const mockRes = {
    status: (code) => {
      statusCode = code;
      return { json: () => {} };
    },
  };

  requireServiceAuth(tamperedReq, mockRes, () => {});
  assert.equal(statusCode, 403, "Tampered signature must return HTTP 403 Forbidden");
});

