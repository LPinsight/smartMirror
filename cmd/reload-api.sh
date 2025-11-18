#!/bin/bash

APP="smartmirror-api"
LOG_FILE="/app/logs/api.log"

echo "🔄 Reload SmartMirror API..."

# 1️⃣ PIDs korrekt finden
# PIDS=$(pidof smartmirror-api)
PIDS=$(pgrep -f "$APP")

if [ -n "$PIDS" ]; then
    echo "→ Stoppe API (PID: $PIDS)..."

    # Alle gefundenen Instanzen sauber beenden
    for PID in $PIDS; do
        kill -TERM "$PID"
    done

    # 2️⃣ Warten bis Prozess WIRKLICH beendet ist
    for i in {1..20}; do
        if ! pgrep -f "$APP" >/dev/null; then
            echo "✔ API gestoppt."
            break
        fi

        sleep 0.2
    done
else
    echo "⚠ Keine laufende API gefunden."
fi

# 3️⃣ Kurze Pause, sonst startet sie zu früh neu
sleep 0.5

# 4️⃣ Neustart
echo "🚀 Starte API neu..."
nohup /app/smartmirror-api >> "$LOG_FILE" 2>&1 &

echo "✅ API neu gestartet!"
