## 🪞 SmartMirror

Ein modulares, Docker-basiertes Smart-Mirror-System für den Raspberry Pi

SmartMirror ist ein flexibles Informationsdisplay, das aus einer modernen Weboberfläche, einer modularen Plugin-Architektur und einer leistungsfähigen API besteht.

## 🚀 Features

- API & Web-Service containerisiert (Docker + Docker Compose)
- Moderne Weboberfläche (Frontend)
- Plugin-System für dynamische Inhalte
- API zur Kommunikation mit allen Komponenten

## 🛠️ Voraussetzungen

### Hardware

- Raspberry Pi 4 oder Pi 5 (empfohlen)
- MicroSD Karte (16 GB oder mehr)
- Monitor
- Optional: Rahmen & Spiegelfolie

### Software

- Raspberry Pi OS (Desktop empfohlen)
- Docker + Docker Compose (Installer übernimmt das)

## 📥 Installation

### Docker installieren

erstellen der "intall_docker.sh" Datei:
``` bash
#!/bin/bash
set -e

echo "🚀 Starte Docker + Docker Compose Installation auf Raspberry Pi..."

# 1️⃣ System aktualisieren
echo "🔄 Update & Upgrade..."
sudo apt update
sudo apt upgrade -y

# 2️⃣ Docker installieren
echo "🐳 Docker wird installiert..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3️⃣ Docker-Gruppe für aktuellen Benutzer
echo "👤 Benutzer zur Docker-Gruppe hinzufügen..."
sudo usermod -aG docker $USER

# 4️⃣ Docker Compose Plugin installieren
echo "🛠 Docker Compose Plugin installieren..."
sudo apt install -y docker-compose-plugin

# 5️⃣ Docker Version prüfen
echo "🔎 Prüfe Docker Installation..."
docker --version
docker compose version

# 6️⃣ Testcontainer starten
echo "📦 Testcontainer wird gestartet..."
docker run --rm hello-world

echo "✅ Fertig! Docker und Docker Compose sind installiert."
echo "ℹ️ Hinweis: Melde dich ab und wieder an, damit Docker ohne 'sudo' funktioniert."
```

Datei ausführbar machen mittels `chmod +x install_docker.sh` sowie anschließend ausführen `./install_docker.sh`

### 🐳 Docker Setup

SmartMirror Container nach erfolgreicher Docker installation starten.

``` docker
services:
  smartmirror:
    image: fabian01/smartmirror:latest
    restart: unless-stopped
    container_name: smartmirror
    environment:
      - USE_INTERNAL_DB=false
      - DB_USER=USERNAME
      - DB_PASSWORD=PASSWORD
      - DB_HOST=IP-ADRESSE
      - DB_PORT=PORT
      - DB_NAME=DATENBANK-NAME
    ports:
      - 80:80
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /logs:/app/logs
      - /plugins:/app/plugins
      - /database:/var/lib/mysql
```

Wenn eine interne Datenbank bentuzt wird reicht als Variable `USE_INTERNAL_DB=true`.
Soll eine externe MySQL Datenbank benutzt werden, bitte die Variable auf `false` ändern und entsprechend die Logindaten mit übergeben.
```
- DB_USER=USERNAME
- DB_PASSWORD=PASSWORD
- DB_HOST=IP-ADRESSE
- DB_PORT=PORT
- DB_NAME=DATENBANK-NAME
```

Nach erfolgreicher Installation erreichst du das Interface unter:
`http://<IP-des-Pi>`

## 🧩 Plugins

Plugins werden im container unter `/app/plugins` gespeichert. Die API lädt die Plugins dynamisch und stellt sie dem Frontend bereit.

### vorhandene Plugins (Stand 18.11.2025)

- [Wetter-Plugin](https://github.com/LPinsight/smartMirror-plugin-weather)

### Plugins selber entwerfen

Plugins können auch selber entworfen werden, dazu gibt es ein [Templat-Plugin](https://github.com/LPinsight/smartMirror-plugin-template).

## 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**.
