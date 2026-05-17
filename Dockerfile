# Multi-Stage Production Dockerfile for LexGuard Split Architecture
# Base alpine node image
FROM node:20-alpine AS base

# Stage 1: Install dependencies using workspaces caching
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN npm ci

# Stage 2: Compile backend TypeScript and build Next.js frontend
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: High-efficiency production runner container
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy project package configurations, child process supervisor, and compiled codes
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/runner.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend ./frontend
COPY --from=builder /app/backend ./backend

# Expose standard Cloud Run traffic ports
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV BACKEND_URL="http://localhost:5000"

# Boot the unified supervisor runner
CMD ["node", "runner.js"]
