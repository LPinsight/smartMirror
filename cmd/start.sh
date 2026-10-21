#!/bin/bash
# === SmartMirror Start Script mit Logs ===

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

LOG_DIR="/app/logs"
mkdir -p $LOG_DIR

echo -e "${GREEN}=== Starting SmartMirror Container ===${NC}"

# -------------------
# API starten
# -------------------
echo -e "${GREEN}Starting API...${NC}"
cd /app || exit
nohup ./smartmirror-api >"$LOG_DIR/api.log" 2>&1 &
cd - >/dev/null

# -------------------
# Fertigmeldung
# -------------------
echo ""
echo -e "${GREEN}✅ SmartMirror gestartet!${NC}"
echo "→ Logs:"
echo "   API:       $LOG_DIR/api.log"
echo "   nginx access:     $LOG_DIR/nginx_access.log"
echo "   nginx error:     $LOG_DIR/nginx_error.log"
echo ""

# -------------------
# nginx starten (Vordergrund)
# -------------------
exec nginx -g "daemon off;"