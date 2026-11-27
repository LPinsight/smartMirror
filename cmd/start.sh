#!/bin/bash

set -u

LOG_DIR="/app/logs"
API_LOG="$LOG_DIR/api.log"
mkdir -p "$LOG_DIR"

echo "=== Starting SmartMirror Container ==="

echo "Starting API..."
cd /app || exit 1
./smartmirror-api >"$API_LOG" 2>&1 &
API_PID=$!

echo "Waiting for API health check..."
for i in {1..30}; do
    if ! kill -0 "$API_PID" 2>/dev/null; then
        echo "API exited before becoming ready. See $API_LOG"
        exit 1
    fi

    if curl --fail --silent http://127.0.0.1:8080/health >/dev/null; then
        echo "API is ready."
        break
    fi

    if [ "$i" -eq 30 ]; then
        echo "API did not become ready within 30 seconds. See $API_LOG"
        exit 1
    fi

    sleep 1
done

echo "Starting Nginx..."
exec nginx -g "daemon off;"