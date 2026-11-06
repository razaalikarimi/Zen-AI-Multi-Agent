import { createLogger } from "../logger/logger.js";

const logger = createLogger("redis");
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let isConnected = false;
let realRedis = null;

try {
  let Redis = null;
  try {
    const mod = await import("ioredis");
    Redis = mod.default || mod;
  } catch (modErr) {
    logger.info("Optional ioredis module not present in runtime. Activating resilient in-memory tier.");
  }

  if (Redis && process.env.REDIS_URL) {
    realRedis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop trying indefinitely in offline environments
        }
        return Math.min(times * 100, 2000);
      },
      lazyConnect: true,
    });

    realRedis.on("connect", () => {
      isConnected = true;
      logger.info("Connected to Redis server", { url: redisUrl });
    });

    realRedis.on("ready", () => {
      isConnected = true;
    });

    realRedis.on("error", (err) => {
      isConnected = false;
      // Log as warn so offline local dev does not fail loudly
      logger.warn("Redis client warning", { error: err.message });
    });

    // Attempt non-blocking connection
    realRedis.connect().catch(() => {
      logger.warn("Redis unavailable, activating robust in-memory fallback tier.");
    });
  }
} catch (e) {
  logger.warn("Redis initialization skipped, activating in-memory fallback.", { error: e.message });
}

// In-memory memory map for zero-dependency local dev / test resilience
const memoryStore = new Map();
const ttlTimers = new Map();

function setMemory(key, value, mode, duration) {
  memoryStore.set(key, String(value));
  if (ttlTimers.has(key)) {
    clearTimeout(ttlTimers.get(key));
    ttlTimers.delete(key);
  }
  if (mode === "EX" && duration) {
    const timer = setTimeout(() => {
      memoryStore.delete(key);
      ttlTimers.delete(key);
    }, duration * 1000);
    ttlTimers.set(key, timer);
  }
}

const redisProxy = new Proxy(realRedis || {}, {
  get(target, prop) {
    // If Redis is active and connected, delegate
    if (isConnected && target && typeof target[prop] !== "undefined") {
      const val = target[prop];
      if (typeof val === "function") {
        return val.bind(target);
      }
      return val;
    }

    // High-performance In-Memory Fallback implementations
    if (prop === "get") {
      return async (key) => {
        return memoryStore.has(key) ? memoryStore.get(key) : null;
      };
    }

    if (prop === "set") {
      return async (key, value, mode, duration) => {
        setMemory(key, value, mode, duration);
        return "OK";
      };
    }

    if (prop === "del") {
      return async (key) => {
        if (ttlTimers.has(key)) {
          clearTimeout(ttlTimers.get(key));
          ttlTimers.delete(key);
        }
        return memoryStore.delete(key) ? 1 : 0;
      };
    }

    if (prop === "exists") {
      return async (key) => (memoryStore.has(key) ? 1 : 0);
    }

    if (prop === "incr") {
      return async (key) => {
        const val = parseInt(memoryStore.get(key) || "0", 10) + 1;
        memoryStore.set(key, String(val));
        return val;
      };
    }

    if (prop === "decr") {
      return async (key) => {
        const val = parseInt(memoryStore.get(key) || "0", 10) - 1;
        memoryStore.set(key, String(val));
        return val;
      };
    }

    if (prop === "expire") {
      return async (key, seconds) => {
        if (!memoryStore.has(key)) return 0;
        if (ttlTimers.has(key)) clearTimeout(ttlTimers.get(key));
        const timer = setTimeout(() => {
          memoryStore.delete(key);
          ttlTimers.delete(key);
        }, seconds * 1000);
        ttlTimers.set(key, timer);
        return 1;
      };
    }

    if (prop === "ttl") {
      return async () => 60; // Approximate fallback TTL
    }

    if (prop === "acquireLock") {
      return async (lockKey, ttlSeconds = 10) => {
        if (isConnected && target?.set) {
          const res = await target.set(`lock:${lockKey}`, "locked", "NX", "EX", ttlSeconds);
          return res === "OK";
        }
        const fullKey = `lock:${lockKey}`;
        if (memoryStore.has(fullKey)) return false;
        setMemory(fullKey, "locked", "EX", ttlSeconds);
        return true;
      };
    }

    if (prop === "releaseLock") {
      return async (lockKey) => {
        if (isConnected && target?.del) {
          return await target.del(`lock:${lockKey}`);
        }
        return memoryStore.delete(`lock:${lockKey}`) ? 1 : 0;
      };
    }

    if (prop === "status") {
      return isConnected ? "ready" : "in-memory-fallback";
    }

    // Default safe fallback for methods like quit, disconnect, etc.
    return async () => null;
  },
});

export default redisProxy;
