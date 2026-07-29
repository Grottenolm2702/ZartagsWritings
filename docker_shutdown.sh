#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "docker-compose.yml" ]]; then
  echo "Fehler: docker-compose.yml nicht gefunden. Bitte Script im Projekt-Root ausfuehren."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Fehler: Docker ist nicht installiert."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Fehler: Docker-Daemon laeuft nicht oder ist nicht erreichbar."
  echo "Fix (Linux): sudo systemctl start docker"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Fehler: Docker Compose Plugin fehlt."
  exit 1
fi

echo "Stoppe Stack..."
docker compose down --remove-orphans

echo
echo "Aktueller Status:"
docker compose ps

echo
echo "Shutdown abgeschlossen."
