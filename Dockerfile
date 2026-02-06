# Multi-stage Dockerfile to build the Vite frontend and run the Express backend

# --- Build frontend ---
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/ ./
RUN npm ci --silent && npm run build


# --- Prepare backend with production deps and include frontend build ---
FROM node:20 AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev --silent
COPY backend/ ./
# copy the built frontend into backend/public
COPY --from=frontend-builder /app/frontend/dist ./public


# --- Final image ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-builder /app/backend /app
EXPOSE 5050
CMD ["node", "index.js"]
