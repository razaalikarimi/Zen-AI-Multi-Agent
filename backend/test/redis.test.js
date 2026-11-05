import test from "node:test";
import assert from "node:assert/strict";
import redis from "../shared/redis/redis.js";

test("Redis Infrastructure: Set, Get, and Exists Operations", async () => {
  const testKey = `test:key:${Date.now()}`;
  const testVal = "zen-ai-enterprise-session";

  await redis.set(testKey, testVal);
  const fetched = await redis.get(testKey);
  assert.equal(fetched, testVal, "Fetched value must match stored value");

  const exists = await redis.exists(testKey);
  assert.equal(exists, 1, "Key should exist in store");

  await redis.del(testKey);
  const deleted = await redis.get(testKey);
  assert.equal(deleted, null, "Deleted key should return null");
});

test("Redis Infrastructure: Distributed Lock Concurrency", async () => {
  const lockKey = `resource:${Date.now()}`;

  const lock1 = await redis.acquireLock(lockKey, 5);
  assert.equal(lock1, true, "First acquireLock must succeed");

  const lock2 = await redis.acquireLock(lockKey, 5);
  assert.equal(lock2, false, "Concurrent acquireLock on active lock must fail");

  await redis.releaseLock(lockKey);
  const lock3 = await redis.acquireLock(lockKey, 5);
  assert.equal(lock3, true, "AcquireLock after release must succeed");

  await redis.releaseLock(lockKey);
});

test("Redis Infrastructure: Atomic Increment", async () => {
  const counterKey = `test:counter:${Date.now()}`;
  const val1 = await redis.incr(counterKey);
  const val2 = await redis.incr(counterKey);
  assert.equal(val1, 1, "First increment should be 1");
  assert.equal(val2, 2, "Second increment should be 2");
  await redis.del(counterKey);
});

