# Production Multi-Stage Dockerfile for Zen AI Gateway
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY gateway/package*.json ./gateway/

RUN npm --prefix gateway ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY --from=builder /app/gateway/node_modules ./gateway/node_modules
COPY shared ./shared
COPY gateway ./gateway

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health/live || exit 1

WORKDIR /app/gateway
CMD ["node", "index.js"]
