#!/bin/bash
echo "=== Starting SmartMirror Container ==="

echo "Initializing MySQL..."
mkdir -p /run/mysqld
chown -R mysql:mysql /var/lib/mysql /run/mysqld

# MySQL einmalig initialisieren, falls noch nicht eingerichtet
if [ ! -d /var/lib/mysql/mysql ]; then
    echo "Initializing MySQL data directory..."
    mysql_install_db --user=mysql --ldata=/var/lib/mysql
fi

# MySQL im Hintergrund starten
echo "Starting MySQL..."
mysqld --user=mysql --datadir=/var/lib/mysql &
MYSQL_PID=$!

# Warten bis MySQL bereit ist
echo "Waiting for MySQL..."
until mysqladmin ping --silent; do
    sleep 1
done
echo "MySQL is ready."

# API starten
echo "Starting API..."
/app/smartmirror-api &

# nginx starten
echo "Starting nginx..."
nginx -g "daemon off;"