# Production Multi-Stage Dockerfile for Chat Service
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/chat/package*.json ./services/chat/

RUN npm --prefix services/chat install --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8002
ENV NODE_PATH=/app/node_modules

RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY --from=builder /app/services/chat/node_modules ./node_modules
COPY --from=builder /app/services/chat/node_modules ./services/chat/node_modules
COPY shared ./shared
COPY services/chat ./services/chat

USER appuser
EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8002/health/live || exit 1

WORKDIR /app/services/chat
CMD ["node", "index.js"]
