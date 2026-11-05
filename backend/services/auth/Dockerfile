# Production Multi-Stage Dockerfile for Auth Service
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/auth/package*.json ./services/auth/

RUN npm --prefix services/auth ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8001

RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY --from=builder /app/services/auth/node_modules ./services/auth/node_modules
COPY shared ./shared
COPY services/auth ./services/auth

USER appuser
EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8001/health/live || exit 1

WORKDIR /app/services/auth
CMD ["node", "index.js"]
