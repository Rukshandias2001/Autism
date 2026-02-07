# Stage 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output (dist for Vite)
COPY --from=build /app/dist /usr/share/nginx/html

# 1. Create a template Nginx config that uses $PORT
# 2. Use 'envsubst' to replace $PORT in the config at startup
# 3. Handle React Router paths with 'try_files'
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# This is the magic part for Cloud Run:
# It tells Nginx to listen on whatever port Cloud Run assigns (usually 8080)
CMD ["sh", "-c", "sed -i 's/listen 80;/listen '\"$PORT\"';/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]