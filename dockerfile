# --- 1️⃣ Build GO Backend ---
FROM golang:1.23-alpine AS go-builder
WORKDIR /app/api
COPY api/ .
RUN go mod tidy && go build -o /smartmirror-api .

# --- 2️⃣ Build Angular Frontend ---
FROM node:22-alpine AS ng-builder
WORKDIR /app/web

# 2️⃣:1️⃣ Nur Lockfile + package.json kopieren für Cache
COPY web/package*.json ./

# 2️⃣:2️⃣ Abhängigkeiten installieren
RUN npm ci

# 2️⃣:3️⃣ Restlichen Frontend-Code kopieren
COPY web/ ./

# 2️⃣:4️⃣ Build Angular (production)
RUN npm run build
# RUN npm run build -- --output-path=dist/web

# --- 3️⃣ Final Image ---
FROM alpine:3.20

# Install dependencies
RUN apk add --no-cache bash nginx mysql mysql-client

# Create directories
WORKDIR /app
RUN mkdir -p /app/logs /app/plugins /app/cmd /var/lib/mysql /run/mysqld

# Copy built binaries & frontend
COPY --from=go-builder /smartmirror-api /app/
COPY --from=ng-builder /app/web/dist/web/browser/ /var/www/html/

# Copy scripts
COPY cmd/ /app/cmd/

# Set permissions
RUN chmod +x /app/cmd/*.sh


# Nginx config
RUN echo 'server { \
  listen 80; \
  root /var/www/html; \
  index index.html; \
  access_log /app/logs/nginx_access.log; \
  error_log /app/logs/nginx_error.log; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
  location /api/ { \
    proxy_pass http://127.0.0.1:8080/; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
  } \
  location /ws { \
    proxy_pass http://127.0.0.1:8080/ws; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "Upgrade"; \
    proxy_set_header Host $host; \
  } \
}' > /etc/nginx/http.d/default.conf

# Environment vars
ENV USE_INTERNAL_DB=true

# Ports
EXPOSE 80

# Volumes
VOLUME ["/app/logs", "/app/plugins", "/var/lib/mysql"]

ENTRYPOINT ["/app/cmd/start.sh"]