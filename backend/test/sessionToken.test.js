import { test } from "node:test";
import assert from "node:assert";
import { signSessionToken, verifySessionToken } from "../shared/utils/sessionToken.js";

test("Session Token: Sign and Verify Valid Token", () => {
  const payload = {
    userId: "user-123",
    email: "test@zen.ai",
    role: "admin",
    plan: "pro",
  };

  const token = signSessionToken(payload, 3600);
  assert.ok(typeof token === "string" && token.includes("."));

  const verified = verifySessionToken(token);
  assert.ok(verified !== null);
  assert.strictEqual(verified.userId, "user-123");
  assert.strictEqual(verified.email, "test@zen.ai");
  assert.strictEqual(verified.role, "admin");
});

test("Session Token: Reject Tampered Token", () => {
  const payload = { userId: "user-999" };
  const token = signSessionToken(payload, 3600);
  const tampered = token + "tamper";

  const verified = verifySessionToken(tampered);
  assert.strictEqual(verified, null);
});

test("Session Token: Reject Expired Token", () => {
  const payload = { userId: "user-old" };
  const expiredToken = signSessionToken(payload, -10); // Expired 10 seconds ago

  const verified = verifySessionToken(expiredToken);
  assert.strictEqual(verified, null);
});

