#!/bin/bash
echo "🛑 Stoppe SmartMirror..."
for PORT in 8080 4200; do
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo "→ Stoppe Prozess auf Port $PORT (PID: $PID)"
    kill -9 $PID
  fi
done
echo "✅ Alle Prozesse beendet."
