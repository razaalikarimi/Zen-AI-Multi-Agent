const { spawn } = require("child_process");
const path = require("path");

const services = [
  { name: "gateway", dir: "backend/gateway", command: "npm", args: ["run", "dev"], color: "\x1b[32m" }, // green
  { name: "auth", dir: "backend/services/auth", command: "npm", args: ["run", "dev"], color: "\x1b[35m" }, // magenta
  { name: "chat", dir: "backend/services/chat", command: "npm", args: ["run", "dev"], color: "\x1b[33m" }, // yellow
  { name: "agent", dir: "backend/services/agent", command: "npm", args: ["run", "dev"], color: "\x1b[34m" }, // blue
  { name: "billing", dir: "backend/services/billing", command: "npm", args: ["run", "dev"], color: "\x1b[31m" }, // red
  { name: "frontend", dir: "frontend", command: "npm", args: ["run", "dev"], color: "\x1b[36m" } // cyan
];

const RESET = "\x1b[0m";

console.log("🚀 Starting all services concurrently...\n");

const children = [];

services.forEach(service => {
  const fullPath = path.resolve(__dirname, service.dir);
  console.log(`Starting ${service.name} in ${service.dir}...`);
  
  const child = spawn(service.command, service.args, {
    cwd: fullPath,
    shell: true,
    env: { ...process.env, FORCE_COLOR: "true" }
  });

  child.stdout.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${RESET} ${line.trim()}`);
      }
    });
  });

  child.stderr.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${service.color}[${service.name} ERROR]${RESET} \x1b[31m${line.trim()}\x1b[0m`);
      }
    });
  });

  child.on("close", code => {
    console.log(`🔴 [${service.name}] process exited with code ${code}`);
  });

  children.push(child);
});

// Graceful cleanup
function cleanup() {
  console.log("\nStopping all running child processes...");
  children.forEach(child => {
    if (child && !child.killed) {
      try {
        // On Windows, spawned processes in shell might need taskkill or sending SIGTERM to kill process tree
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", child.pid, "/f", "/t"]);
        } else {
          child.kill("SIGTERM");
        }
      } catch (err) {
        // ignore errors on exit
      }
    }
  });
}

process.on("exit", cleanup);

process.on("SIGINT", () => {
  cleanup();
  process.exit();
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit();
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception in runner:", err);
  cleanup();
  process.exit(1);
});
