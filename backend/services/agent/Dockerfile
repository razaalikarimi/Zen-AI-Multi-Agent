# Production Multi-Stage Dockerfile for Agent Service
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/agent/package*.json ./services/agent/

RUN npm --prefix services/agent ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8003

RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY --from=builder /app/services/agent/node_modules ./services/agent/node_modules
COPY shared ./shared
COPY services/agent ./services/agent

USER appuser
EXPOSE 8003

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8003/health/live || exit 1

WORKDIR /app/services/agent
CMD ["node", "index.js"]
