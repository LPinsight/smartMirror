#!/bin/bash

PLUGIN_DIR="../plugins"
RELOAD_SCRIPT="./reload-api.sh"

if [ ! -f "$RELOAD_SCRIPT" ]; then
    echo "Fehler: $RELOAD_SCRIPT nicht gefunden!"
    exit 1
fi

# Hilfsfunktion: GitHub Repo aus URL extrahieren
# Hilfsfunktion: GitHub Repo aus URL extrahieren
get_github_repo() {
    local url="$1"
    # Entfernt .git und alles davor, außerdem abschließenden Slash
    echo "$url" | sed -E 's|https://github.com/([^/]+/[^/]+)/?.*|\1|'
}

# Installieren: immer den latest Release
install_plugin() {
    local git_url="$1"
    local repo
    repo=$(get_github_repo "$git_url")
    local plugin_name
    plugin_name=$(basename "$repo")
    
    if [ -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist bereits installiert."
        return
    fi

    echo "Hole neuesten Release von $repo ..."
    local latest_tag
    latest_tag=$(curl -s "https://api.github.com/repos/$repo/releases/latest" | grep -m1 '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    if [ -z "$latest_tag" ]; then
        echo "Fehler: Kein Release gefunden."
        exit 1
    fi

    echo "Installiere $plugin_name Version $latest_tag ..."
    mkdir -p "$PLUGIN_DIR"
    curl -L "https://github.com/$repo/archive/refs/tags/$latest_tag.zip" -o "/tmp/$plugin_name.zip"
    unzip -q "/tmp/$plugin_name.zip" -d "$PLUGIN_DIR"

    # Den automatisch entpackten Ordner herausfinden
    extracted_dir=$(unzip -Z -1 "/tmp/$plugin_name.zip" | head -n1 | cut -d/ -f1)

    mv "$PLUGIN_DIR/$extracted_dir" "$PLUGIN_DIR/$plugin_name"
    rm "/tmp/$plugin_name.zip"

    echo "Plugin '$plugin_name' installiert."
    $RELOAD_SCRIPT
}

# Entfernen
remove_plugin() {
    local plugin_name="$1"
    if [ ! -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist nicht installiert."
        return
    fi

    echo "Entferne Plugin '$plugin_name'..."
    rm -rf "$PLUGIN_DIR/$plugin_name"
    echo "Plugin '$plugin_name' entfernt."
    $RELOAD_SCRIPT
}

# Aktualisieren = latest Release herunterladen und altes Plugin ersetzen
update_plugin() {
    local git_url="$1"
    local repo
    repo=$(get_github_repo "$git_url")
    local plugin_name
    plugin_name=$(basename "$repo")

    # Wenn das Plugin bereits existiert, altes löschen
    if [ -d "$PLUGIN_DIR/$plugin_name" ]; then
        echo "Plugin '$plugin_name' ist bereits installiert – entferne alte Version..."
        rm -rf "$PLUGIN_DIR/$plugin_name"
    fi

    echo "Hole neuesten Release von $repo ..."
    local latest_tag
    latest_tag=$(curl -s "https://api.github.com/repos/$repo/releases/latest" | grep -m1 '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    if [ -z "$latest_tag" ]; then
        echo "Fehler: Kein Release gefunden."
        exit 1
    fi

    echo "Installiere $plugin_name Version $latest_tag ..."
    mkdir -p "$PLUGIN_DIR"
    curl -L "https://github.com/$repo/archive/refs/tags/$latest_tag.zip" -o "/tmp/$plugin_name.zip"
    unzip -q "/tmp/$plugin_name.zip" -d "$PLUGIN_DIR"

    # Automatisch entpackten Ordner herausfinden
    extracted_dir=$(unzip -Z -1 "/tmp/$plugin_name.zip" | head -n1 | cut -d/ -f1)

    # Umbenennen in nur den Plugin-Namen
    mv "$PLUGIN_DIR/$extracted_dir" "$PLUGIN_DIR/$plugin_name"
    rm "/tmp/$plugin_name.zip"

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