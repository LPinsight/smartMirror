#!/bin/bash

API_RELOAD_URL="http://127.0.0.1:8080/plugins/reload"

echo "🔄 Lade Plugins über die API neu..."

if ! curl --fail --silent --show-error \
    --request POST \
    "$API_RELOAD_URL"; then
    echo "❌ Plugin-Reload über die API fehlgeschlagen."
    exit 1
fi

echo
echo "✅ Plugins wurden neu geladen."
