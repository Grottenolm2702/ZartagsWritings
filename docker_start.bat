@echo off
setlocal EnableExtensions

cd /d "%~dp0"

if not exist "docker-compose.yml" (
  echo Fehler: docker-compose.yml nicht gefunden. Bitte Script im Projekt-Root ausfuehren.
  exit /b 1
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Fehler: Docker ist nicht installiert.
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo Fehler: Docker-Daemon laeuft nicht oder ist nicht erreichbar.
  echo Fix: Docker Desktop starten.
  exit /b 1
)

docker compose version >nul 2>nul
if errorlevel 1 (
  echo Fehler: Docker Compose Plugin fehlt.
  exit /b 1
)

if not exist ".env" (
  echo Fehler: .env fehlt.
  echo Bitte zuerst einmalig ausfuehren: docker_setup.bat
  exit /b 1
)

echo Pruefe Abhaengigkeiten in Docker-Volumes...
docker compose run --rm --no-deps frontend sh -c "test -x /app/node_modules/.bin/vite" >nul 2>nul
if errorlevel 1 (
  echo Frontend-Abhaengigkeiten fehlen. Fuehre npm ci aus...
  docker compose run --rm --no-deps frontend npm ci
  if errorlevel 1 exit /b 1
)

docker compose run --rm --no-deps backend sh -c "test -x /app/node_modules/.bin/tsx" >nul 2>nul
if errorlevel 1 (
  echo Backend-Abhaengigkeiten fehlen. Fuehre npm ci aus...
  docker compose run --rm --no-deps backend npm ci
  if errorlevel 1 exit /b 1
)

echo Starte Stack...
docker compose up -d
if errorlevel 1 exit /b 1

echo.
echo Aktueller Status:
docker compose ps

echo.
echo Start abgeschlossen.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000

endlocal
