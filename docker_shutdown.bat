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

echo Stoppe Stack...
docker compose down --remove-orphans
if errorlevel 1 exit /b 1

echo.
echo Aktueller Status:
docker compose ps

echo.
echo Shutdown abgeschlossen.

endlocal
