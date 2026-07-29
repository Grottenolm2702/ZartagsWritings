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

read_with_default() {
  local prompt="$1"
  local default="$2"
  local value
  read -r -p "$prompt [$default]: " value
  if [[ -z "$value" ]]; then
    value="$default"
  fi
  printf '%s' "$value"
}

PORT="$(read_with_default "PORT" "3000")"
while ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); do
  echo "Ungueltiger Port. Bitte Wert zwischen 1 und 65535 angeben."
  PORT="$(read_with_default "PORT" "3000")"
done

JWT_SECRET="$(read_with_default "JWT_SECRET" "dev-local-super-secret-change-this-2026")"
while [[ "$JWT_SECRET" == "dev-secret-change-me" || ${#JWT_SECRET} -lt 16 ]]; do
  echo "JWT_SECRET muss mindestens 16 Zeichen lang sein und darf nicht 'dev-secret-change-me' sein."
  JWT_SECRET="$(read_with_default "JWT_SECRET" "dev-local-super-secret-change-this-2026")"
done

CORS_ORIGIN="$(read_with_default "CORS_ORIGIN" "http://localhost:5173")"
DATABASE_URL="$(read_with_default "DATABASE_URL" "file:./data/dev.db")"
VITE_API_PROXY_TARGET="$(read_with_default "VITE_API_PROXY_TARGET" "http://backend:3000")"

if [[ -f ".env" ]]; then
  OVERWRITE="$(read_with_default ".env existiert. Ueberschreiben? (y/n)" "y")"
  if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
    echo "Abgebrochen. Bestehende .env bleibt unveraendert."
    exit 1
  fi
fi

cat > .env <<EOF
PORT=$PORT
NODE_ENV=development
JWT_SECRET=$JWT_SECRET
CORS_ORIGIN=$CORS_ORIGIN
DATABASE_URL=$DATABASE_URL
VITE_API_PROXY_TARGET=$VITE_API_PROXY_TARGET
EOF

echo
echo "Stoppe und bereinige bestehende Container/Volumes..."
docker compose down -v --remove-orphans || true

echo "Baue Images..."
docker compose build

echo "Installiere Abhaengigkeiten in Container-Volumes (fresh-pull-safe)..."
docker compose run --rm --no-deps backend npm ci
docker compose run --rm --no-deps frontend npm ci

echo "Starte Stack..."
docker compose up -d

echo
echo "Aktueller Status:"
docker compose ps

echo
echo "Setup abgeschlossen."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
