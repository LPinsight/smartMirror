#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔄 Reload SmartMirror API...${NC}"

PORT=8080
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo -e "${RED}→ Stoppe alte API (PID: $PID)...${NC}"
  kill -HUP $PID
  sleep 1
fi

cd ../api || exit
go mod tidy >/dev/null 2>&1
nohup go run main.go > ../logs/api.log 2>&1 &
cd ..

echo -e "${GREEN}✅ API neu gestartet!${NC}"
echo "Läuft auf: http://localhost:$PORT"
echo "Logs: ./logs/api.log"
