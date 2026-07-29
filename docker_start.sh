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

if [[ ! -f ".env" ]]; then
  echo "Fehler: .env fehlt."
  echo "Bitte zuerst einmalig ausfuehren: ./docker_setup.sh"
  exit 1
fi

echo "Pruefe Abhaengigkeiten in Docker-Volumes..."
if ! docker compose run --rm --no-deps frontend test -x /app/node_modules/.bin/vite >/dev/null 2>&1; then
  echo "Frontend-Abhaengigkeiten fehlen. Fuehre npm ci aus..."
  docker compose run --rm --no-deps frontend npm ci
fi

if ! docker compose run --rm --no-deps backend test -x /app/node_modules/.bin/tsx >/dev/null 2>&1; then
  echo "Backend-Abhaengigkeiten fehlen. Fuehre npm ci aus..."
  docker compose run --rm --no-deps backend npm ci
fi

echo "Starte Stack..."
docker compose up -d

echo
echo "Aktueller Status:"
docker compose ps

echo
echo "Start abgeschlossen."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
