## Multi-stage Dockerfile: builds frontend then backend and serves via Node
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json frontend/
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --production

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build into backend public folder
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5050
CMD ["node", "index.js"]
