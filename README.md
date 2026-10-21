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
- Docker + Docker Compose

## 📥 Installation

SmartMirror Container nach erfolgreicher Docker installation starten.

``` docker
services:
  smartmirror:
    image: fabian01/smartmirror:latest
    restart: unless-stopped
    container_name: smartmirror
    environment:
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
