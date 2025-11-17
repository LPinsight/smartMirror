#!/bin/bash

PLUGIN_DIR="/app/plugins"
RELOAD_SCRIPT="/app/cmd/reload-api.sh"
LOG_FILE="/app/logs/plugin-manager.log"

# Logging: Alles (stdout + stderr) in Datei und Konsole ausgeben
exec > >(tee -a "$LOG_FILE") 2>&1

echo "==============================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starte Skript: $0 $@"
echo "==============================="

if [ ! -f "$RELOAD_SCRIPT" ]; then
    echo "Fehler: $RELOAD_SCRIPT nicht gefunden!"
    exit 1
fi

# Hilfsfunktion: GitHub Repo aus URL extrahieren
get_github_repo() {
    local url="$1"
    echo "$url" | sed -E 's|https://github.com/([^/]+/[^/]+)/?.*|\1|'
}

extract_zip_root() {
    unzip -l "$1" | awk '/\/$/ {print $4; exit}' | cut -d/ -f1
}

# Plugin installieren (immer latest Release)
install_plugin() {
    local git_url="$1"
    local repo=$(get_github_repo "$git_url")
    local plugin_name=$(basename "$repo")

    if [ -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist bereits installiert."
        return
    fi

    echo "Hole neuesten Release von $repo ..."
    local latest_tag=$(curl -s "https://api.github.com/repos/$repo/releases/latest" \
        | grep -m1 '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

    if [ -z "$latest_tag" ]; then
        echo "Fehler: Kein Release gefunden."
        exit 1
    fi

    echo "Installiere $plugin_name Version $latest_tag ..."
    mkdir -p "$PLUGIN_DIR"

    curl -L "https://github.com/$repo/archive/refs/tags/$latest_tag.zip" \
        -o "/tmp/$plugin_name.zip"

    unzip -q "/tmp/$plugin_name.zip" -d "$PLUGIN_DIR"

    extracted_dir=$(extract_zip_root "/tmp/$plugin_name.zip")

    mv "$PLUGIN_DIR/$extracted_dir" "$PLUGIN_DIR/$plugin_name"
    rm "/tmp/$plugin_name.zip"

    # Warten bis Verzeichnis existiert
    while [ ! -d "$PLUGIN_DIR/$plugin_name" ]; do
        sleep 0.1
    done
    sync

    echo "Plugin '$plugin_name' installiert."
    $RELOAD_SCRIPT
}

# Plugin entfernen
remove_plugin() {
    local plugin_name="$1"
    if [ ! -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist nicht installiert."
        return
    fi

    echo "Entferne Plugin '$plugin_name'..."
    rm -rf "$PLUGIN_DIR/$plugin_name"

    # Warten bis Plugin wirklich weg ist
    while [ -d "$PLUGIN_DIR/$plugin_name" ]; do
        sleep 0.1
    done
    sync

    echo "Plugin '$plugin_name' entfernt."
    $RELOAD_SCRIPT
}

# Plugin aktualisieren (latest Release)
update_plugin() {
    local git_url="$1"
    local repo=$(get_github_repo "$git_url")
    local plugin_name=$(basename "$repo")

    if [ -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist bereits installiert – entferne alte Version..."
        rm -rf "$PLUGIN_DIR/$plugin_name"

        while [ -d "$PLUGIN_DIR/$plugin_name" ]; do sleep 0.1; done
        sync
    fi

    echo "Hole neuesten Release von $repo ..."
    local latest_tag=$(curl -s "https://api.github.com/repos/$repo/releases/latest" \
        | grep -m1 '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

    if [ -z "$latest_tag" ]; then
        echo "Fehler: Kein Release gefunden."
        exit 1
    fi

    echo "Installiere $plugin_name Version $latest_tag ..."
    mkdir -p "$PLUGIN_DIR"
    curl -L "https://github.com/$repo/archive/refs/tags/$latest_tag.zip" \
        -o "/tmp/$plugin_name.zip"
    unzip -q "/tmp/$plugin_name.zip" -d "$PLUGIN_DIR"

    extracted_dir=$(extract_zip_root "/tmp/$plugin_name.zip")
    mv "$PLUGIN_DIR/$extracted_dir" "$PLUGIN_DIR/$plugin_name"
    rm "/tmp/$plugin_name.zip"

     # Warten bis Verzeichnis existiert
    while [ ! -d "$PLUGIN_DIR/$plugin_name" ]; do
        sleep 0.1
    done
    sync

    echo "Plugin '$plugin_name' auf neueste Version aktualisiert."
    $RELOAD_SCRIPT
}

# Hauptlogik
case "$1" in
    install)
        [ -z "$2" ] && { echo "Usage: $0 install <git-repo-url>"; exit 1; }
        install_plugin "$2"
        ;;
    remove)
        [ -z "$2" ] && { echo "Usage: $0 remove <plugin-name>"; exit 1; }
        remove_plugin "$2"
        ;;
    update)
        [ -z "$2" ] && { echo "Usage: $0 update <git-repo-url>"; exit 1; }
        update_plugin "$2"
        ;;
    *)
        echo "Usage: $0 {install|remove|update} <plugin>"
        exit 1
        ;;
esac

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Skript beendet."
echo
