# Production Multi-Stage Dockerfile for Billing Service
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/billing/package*.json ./services/billing/

RUN npm --prefix services/billing ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8004

RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY --from=builder /app/services/billing/node_modules ./services/billing/node_modules
COPY shared ./shared
COPY services/billing ./services/billing

USER appuser
EXPOSE 8004

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8004/health/live || exit 1

WORKDIR /app/services/billing
CMD ["node", "index.js"]
