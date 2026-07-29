@echo off
setlocal EnableExtensions EnableDelayedExpansion

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

set "GENERATED_JWT="
for /f %%i in ('powershell -NoProfile -Command "[Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')"') do set "GENERATED_JWT=%%i"
if "!GENERATED_JWT!"=="" set "GENERATED_JWT=dev-local-super-secret-change-this-2026"

set /p PORT=PORT [3000]:
if "!PORT!"=="" set "PORT=3000"

:validate_port
echo(!PORT!| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
  echo Ungueltiger Port. Bitte Wert zwischen 1 und 65535 angeben.
  set /p PORT=PORT [3000]:
  if "!PORT!"=="" set "PORT=3000"
  goto validate_port
)
if !PORT! LSS 1 (
  echo Ungueltiger Port. Bitte Wert zwischen 1 und 65535 angeben.
  set /p PORT=PORT [3000]:
  if "!PORT!"=="" set "PORT=3000"
  goto validate_port
)
if !PORT! GTR 65535 (
  echo Ungueltiger Port. Bitte Wert zwischen 1 und 65535 angeben.
  set /p PORT=PORT [3000]:
  if "!PORT!"=="" set "PORT=3000"
  goto validate_port
)

set /p JWT_SECRET=JWT_SECRET ^(leer = zufaellig generiert^) [!GENERATED_JWT!]:
if "!JWT_SECRET!"=="" set "JWT_SECRET=!GENERATED_JWT!"

:validate_jwt
if "!JWT_SECRET!"=="dev-secret-change-me" (
  echo JWT_SECRET darf nicht 'dev-secret-change-me' sein.
  set /p JWT_SECRET=JWT_SECRET ^(leer = zufaellig generiert^) [!GENERATED_JWT!]:
  if "!JWT_SECRET!"=="" set "JWT_SECRET=!GENERATED_JWT!"
  goto validate_jwt
)
if "!JWT_SECRET:~15,1!"=="" (
  echo JWT_SECRET muss mindestens 16 Zeichen lang sein.
  set /p JWT_SECRET=JWT_SECRET ^(leer = zufaellig generiert^) [!GENERATED_JWT!]:
  if "!JWT_SECRET!"=="" set "JWT_SECRET=!GENERATED_JWT!"
  goto validate_jwt
)

set /p CORS_ORIGIN=CORS_ORIGIN [http://localhost:5173]:
if "!CORS_ORIGIN!"=="" set "CORS_ORIGIN=http://localhost:5173"

set /p DATABASE_URL=DATABASE_URL [file:./data/dev.db]:
if "!DATABASE_URL!"=="" set "DATABASE_URL=file:./data/dev.db"

set /p VITE_API_PROXY_TARGET=VITE_API_PROXY_TARGET [http://backend:3000]:
if "!VITE_API_PROXY_TARGET!"=="" set "VITE_API_PROXY_TARGET=http://backend:3000"

if exist ".env" (
  set /p OVERWRITE=.env existiert. Ueberschreiben? ^(y/n^) [y]:
  if "!OVERWRITE!"=="" set "OVERWRITE=y"
  if /I not "!OVERWRITE!"=="y" (
    echo Abgebrochen. Bestehende .env bleibt unveraendert.
    exit /b 1
  )
)

(
  echo PORT=!PORT!
  echo NODE_ENV=development
  echo JWT_SECRET=!JWT_SECRET!
  echo CORS_ORIGIN=!CORS_ORIGIN!
  echo DATABASE_URL=!DATABASE_URL!
  echo VITE_API_PROXY_TARGET=!VITE_API_PROXY_TARGET!
) > .env

echo.
echo Stoppe und bereinige bestehende Container/Volumes...
docker compose down -v --remove-orphans

echo Baue Images...
docker compose build
if errorlevel 1 exit /b 1

echo Installiere Abhaengigkeiten in Container-Volumes (fresh-pull-safe)...
docker compose run --rm --no-deps backend npm ci
if errorlevel 1 exit /b 1
docker compose run --rm --no-deps frontend npm ci
if errorlevel 1 exit /b 1

echo Starte Stack...
docker compose up -d
if errorlevel 1 exit /b 1

echo.
echo Aktueller Status:
docker compose ps

echo.
echo Setup abgeschlossen.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000

endlocal
