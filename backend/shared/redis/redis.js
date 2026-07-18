import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const realRedis = new Redis(process.env.REDIS_URL);
let isConnected = false;

realRedis.on("connect", () => {
  isConnected = true;
  console.log("✅ Redis Connected");
});

realRedis.on("error", (err) => {
  isConnected = false;
  console.error("⚠️ Redis Connection Warning (Redis is offline):", err.message);
});

// File path for shared session/data store
const storePath = path.resolve(__dirname, "../../../temp_redis.json");

function readDb() {
  try {
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, "utf8") || "{}");
    }
  } catch (err) {
    // Ignore read errors in local dev
  }
  return {};
}

function writeDb(data) {
  try {
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Ignore write errors in local dev
  }
}

// Wrapper object that intercepts calls
const redisProxy = new Proxy(realRedis, {
  get(target, prop) {
    // If the database is connected, we use the real Redis client
    if (isConnected) {
      const val = target[prop];
      if (typeof val === "function") {
        return val.bind(target);
      }
      return val;
    }

    // Otherwise, we intercept common Redis commands and execute them on a shared JSON file
    if (prop === "get") {
      return async (key) => {
        const db = readDb();
        const val = db[key];
        return val !== undefined ? val : null;
      };
    }
    if (prop === "set") {
      return async (key, value, mode, duration) => {
        const db = readDb();
        db[key] = value;
        writeDb(db);
        if (mode === "EX" && duration) {
          setTimeout(() => {
            try {
              const currentDb = readDb();
              delete currentDb[key];
              writeDb(currentDb);
            } catch (e) {}
          }, duration * 1000);
        }
        return "OK";
      };
    }
    if (prop === "del") {
      return async (key) => {
        const db = readDb();
        if (key in db) {
          delete db[key];
          writeDb(db);
          return 1;
        }
        return 0;
      };
    }
    if (prop === "exists") {
      return async (key) => {
        const db = readDb();
        return key in db ? 1 : 0;
      };
    }
    if (prop === "incr") {
      return async (key) => {
        const db = readDb();
        const val = parseInt(db[key] || "0", 10) + 1;
        db[key] = String(val);
        writeDb(db);
        return val;
      };
    }
    if (prop === "decr") {
      return async (key) => {
        const db = readDb();
        const val = parseInt(db[key] || "0", 10) - 1;
        db[key] = String(val);
        writeDb(db);
        return val;
      };
    }

    // Default fallback for any other methods to prevent crash
    const originalVal = target[prop];
    if (typeof originalVal === "function") {
      return async (...args) => {
        console.warn(`⚠️ Redis offline: Mocked execution of method '${String(prop)}'`);
        return null;
      };
    }
    return originalVal;
  }
});

export default redisProxy;