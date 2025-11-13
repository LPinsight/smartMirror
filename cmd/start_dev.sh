#!/bin/bash

# === SmartMirror Start Script (Background Version) ===
# Startet Go-API und Angular-Frontend im Hintergrund

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starte SmartMirror...${NC}"

# -------------------
# Alte Prozesse beenden
# -------------------
echo -e "${GREEN}Beende alte Prozesse (falls vorhanden)...${NC}"
for PORT in 8080 4200; do
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo -e "${RED}→ Prozess auf Port $PORT gefunden (PID: $PID), wird beendet...${NC}"
    kill -9 $PID
  fi
done

# -------------------
# Backend starten
# -------------------
echo -e "${GREEN}Starte Go API...${NC}"
cd ../api || exit
go mod tidy >/dev/null 2>&1
nohup go run main.go > ../logs/api.log 2>&1 &
cd ..

# -------------------
# Frontend starten
# -------------------
echo -e "${GREEN}Starte Angular Frontend...${NC}"
cd web || exit
npm install >/dev/null 2>&1
nohup npm start > ../logs/frontend.log 2>&1 &
cd ..

# -------------------
# Fertigmeldung
# -------------------
echo ""
echo -e "${GREEN}✅ SmartMirror gestartet!${NC}"
echo "API läuft auf:      http://localhost:8080"
echo "Frontend läuft auf: http://localhost:4200"
echo ""
echo "→ Logs findest du unter: ./logs/api.log und ./logs/frontend.log"
echo ""
