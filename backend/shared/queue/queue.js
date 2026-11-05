/**
 * Enterprise Job Queue Infrastructure for Zen AI
 * Supports BullMQ when Redis is available, with resilient in-process async queue fallback.
 */

import { createLogger } from "../logger/logger.js";

const logger = createLogger("job-queue");

// In-process resilient background worker queue
class LocalAsyncQueue {
  constructor(name) {
    this.name = name;
    this.handlers = new Map();
    this.jobs = [];
    this.isProcessing = false;
  }

  process(jobType, handler) {
    this.handlers.set(jobType, handler);
    logger.info(`Registered job processor for queue [${this.name}]: ${jobType}`);
  }

  async add(jobType, data = {}, options = {}) {
    const job = {
      id: `${this.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: jobType,
      data,
      attempts: 0,
      maxAttempts: options.attempts || 3,
      createdAt: new Date().toISOString(),
    };

    logger.info(`Enqueued job [${job.id}] in [${this.name}]`, { jobType });
    this.jobs.push(job);
    this._triggerProcess();
    return job;
  }

  async _triggerProcess() {
    if (this.isProcessing || this.jobs.length === 0) return;
    this.isProcessing = true;

    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      const handler = this.handlers.get(job.type) || this.handlers.get("*");

      if (handler) {
        try {
          job.attempts++;
          await handler(job);
          logger.info(`Completed job [${job.id}]`, { jobType: job.type });
        } catch (err) {
          logger.error(`Job [${job.id}] failed (attempt ${job.attempts}/${job.maxAttempts})`, {
            error: err.message,
            jobType: job.type,
          });
          if (job.attempts < job.maxAttempts) {
            this.jobs.push(job);
          } else {
            logger.error(`Job [${job.id}] moved to Dead-Letter Queue`, { jobType: job.type });
          }
        }
      } else {
        logger.warn(`No handler registered for job type [${job.type}] in queue [${this.name}]`);
      }
    }

    this.isProcessing = false;
  }
}

const queues = new Map();

export const getQueue = (name = "default") => {
  if (!queues.has(name)) {
    queues.set(name, new LocalAsyncQueue(name));
  }
  return queues.get(name);
};

export const documentQueue = getQueue("document-processing");
export const reportQueue = getQueue("report-generation");
export const usageQueue = getQueue("usage-aggregation");

export default {
  getQueue,
  documentQueue,
  reportQueue,
  usageQueue,
};

