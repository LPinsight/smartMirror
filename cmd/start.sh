#!/bin/bash
# === SmartMirror Start Script mit Logs ===

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

LOG_DIR="/app/logs"
mkdir -p $LOG_DIR

echo -e "${GREEN}=== Starting SmartMirror Container ===${NC}"

# -------------------
# MySQL starten
# -------------------
echo -e "${GREEN}Initializing MySQL...${NC}"
mkdir -p /run/mysqld
chown -R mysql:mysql /var/lib/mysql /run/mysqld

# MySQL einmalig initialisieren, falls noch nicht eingerichtet
if [ ! -d /var/lib/mysql/mysql ]; then
    echo -e "${GREEN}Initializing MySQL data directory...${NC}"
    mysql_install_db --user=mysql --ldata=/var/lib/mysql
fi

# MySQL im Hintergrund starten
echo -e "${GREEN}Starting MySQL...${NC}"
mysqld --user=mysql --datadir=/var/lib/mysql >"$LOG_DIR/mysql.log" 2>&1 &
MYSQL_PID=$!

# Warten bis MySQL bereit ist
echo -e "${GREEN}Waiting for MySQL...${NC}"
until mysqladmin ping --silent; do
    sleep 1
done
echo -e "${GREEN}MySQL is ready.${NC}"

# -------------------
# API starten
# -------------------
echo -e "${GREEN}Starting API...${NC}"
cd /app || exit
nohup ./smartmirror-api >"$LOG_DIR/api.log" 2>&1 &
cd - >/dev/null

# -------------------
# nginx starten (Vordergrund)
# -------------------
echo -e "${GREEN}Starting nginx in foreground...${NC}"
exec nginx -g "daemon off;"

# -------------------
# Fertigmeldung
# -------------------
echo ""
echo -e "${GREEN}✅ SmartMirror gestartet!${NC}"
echo "→ Logs:"
echo "   MySQL:     $LOG_DIR/mysql.log"
echo "   API:       $LOG_DIR/api.log"
echo "   nginx:     $LOG_DIR/nginx.log"
echo ""