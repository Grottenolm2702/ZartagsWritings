# ZartagsWritings

Web-App zum Verwalten von D\&D-Kampagnennotizen mit Rollen- und Rechtekonzept für DM, Editor und Player.

## Beschreibung

ZartagsWritings bietet pro Campaign eine eigene Arbeitsumgebung mit:

- PC-, NPC-, Location- und Magic-Item-Entities
- strukturierten Karten (Text, Listen, Attribute, Bilder per URL)
- Campaign-Mitgliedern und Rollen (DM, EDITOR, PLAYER)
- Login/Registrierung mit JWT in HttpOnly-Cookies

## Kriterien-Zuordnung M1

| Kriterium                         | Datei                     | Zeile / Hinweis                          |
| --------------------------------- | ------------------------- | ---------------------------------------- |
| Semantische HTML-Struktur         | about.html                | Z. 30-72 & 76–132                        |
| Formular mit Labels               | login.html                | Z. 75–95                                 |
| Responsives Layout (Flexbox/Grid) | src/styles/content.css    | Klassen: `.items-grid`, `.items-masonry` |
| Media Query                       | src/styles/navigation.css | Breakpoint: `max-width: 800px`           |
| URL-Struktur                      | pc.html, about.html       | Pfade: /src/campain1/pc, /src            |

## Kriterien-Zuordnung M2

| Kriterium                 | Datei                                                                                              | Zeile / Hinweis                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| npm + Vite                | package.json, vite.config.js                                                                       | package.json — Skripte & deps (Z.16–23; Z.25–31); vite.config.js — Server-Konfig (Z.1–7)                                                   |
| TypeScript aktiv genutzt  | tsconfig.json, src/context/AuthContext.tsx                                                         | tsconfig.json — CompilerOptions (Z.2–7, Z.11–15); AuthContext — Typ-Definition AuthContextType (Z.4–11) & Props (Z.15)                     |
| Komponentenzerlegung      | src/components/Layout.tsx, src/components/Header.tsx, src/components/campaign/\*                   | ItemCard, ItemsGrid, EditableCardContent, CampaignDetail etc.                                                                              |
| Props-Übergabe            | src/components/campaign/ItemCard.tsx                                                               | Props‑Interface (Z.7–16) und Destructuring/Usage (Z.18–27)                                                                                 |
| useState                  | src/context/AuthContext.tsx; src/pages/CampaignOverview.tsx; src/pages/campaign/ManageCampaign.tsx | isEditor / isDungeonMaster State (Z.16, Z.26); items-State (Z.91) / query (Z.41); players-State (Z.13)                                     |
| useEffect                 | src/context/AuthContext.tsx, src/components/Layout.tsx                                             | localStorage speichern (Z.36–49); Layout useEffect Blöcke (z.B. Z.7, Z.51)                                                                 |
| Durchgängige Nutzeraktion | src/pages/CampaignOverview.tsx, src/pages/campaign/ManageCampaign.tsx                              | Modal „New“ → Save fügt Eintrag zur Liste hinzu (Z.252–266, SetItems Z.265); ManageCampaign save() schreibt storage + setPlayers (Z.46–53) |

## Kriterien-Zuordnung M3

| Kriterium                   | Status | Datei / Hinweis                                                                                                   |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| **React Router**            |        |                                                                                                                   |
| 2–3 Routen vorhanden        | ✅     | `frontend/src/App.tsx` Z.20–23: `/`, `/login`, `/register`, `/users` (4 Routen)                                   |
| Navigation über `<Link>`    | ✅     | `frontend/src/components/Layout.tsx` Z.18–30: `<Link>` in Header; `useNavigate()` in Login/Register/Users Pages   |
| **Datenfetching & REST**    |        |                                                                                                                   |
| Fetch gegen eigenes Backend | ✅     | `frontend/src/context/JWTAuthContext.tsx` Z.31–50: POST `/api/login`, Z.52–72: POST `/api/register`               |
| GET Methode                 | ✅     | `backend/src/server.ts` Z.134–146: GET `/api/user` (Daten anzeigen); `frontend/src/pages/Users.tsx` Z.11–13       |
| Schreibende Methode         | ✅     | `backend/src/server.ts` Z.58–87: POST `/api/login`, Z.115–131: DELETE `/api/user`, Z.155–162: POST `/api/logout`  |
| **Fehler- & Ladezustände**  |        |                                                                                                                   |
| Ladeindikator               | ✅     | `frontend/src/pages/Login.tsx` Z.56–58: Button disabled mit "Logging in..." Text                                  |
| Fehlermeldung               | ✅     | `frontend/src/pages/Login.tsx` Z.59: Error-Box mit `.errorMessage` CSS; `JWTAuthContext.tsx` Z.42–44: Error-State |
| **Geteilter State**         |        |                                                                                                                   |
| React Context               | ✅     | `frontend/src/context/JWTAuthContext.tsx`: Provider (Z.140–156), `useJWTAuth()` Hook (Z.159–163)                  |
| Feature: Eingeloggter User  | ✅     | JWTAuthContext speichert `user` State (Z.22), `isLoggedIn` (Z.143), `login()`, `logout()` (Z.26–88)               |
| **Tests**                   |        |                                                                                                                   |
| 3–5 Tests vorhanden         | ✅     | 7 Tests: 4 Backend (`backend/src/server.test.ts`), 3 Frontend (`frontend/src/__tests__/auth.test.tsx`)            |
| Vitest + Testing Library    | ✅     | `vitest.config.ts` beide Projekte; `frontend/package.json` Z.47–49: `vitest`, `@testing-library/react`            |
| Kernlogik getestet          | ✅     | Backend: POST/GET/DELETE Endpoints; Frontend: Login/Logout API Calls, HttpOnly Cookie Handling                    |
| `npm test` Befehl           | ✅     | `backend/package.json` Z.8, `frontend/package.json` Z.25: `"test": "vitest"`                                      |
| **Backend**                 |        |                                                                                                                   |
| Node.js + Express           | ✅     | `backend/src/server.ts` Z.1–10: Express Setup, CORS, Cookie-Parser; Routes Z.58–162                               |
| Frontend spricht Backend an | ✅     | `frontend/src/context/JWTAuthContext.tsx` Z.31–50: Fetch zu `/api/login`, `/api/register`, `/api/user`            |
| **Datenbank**               |        |                                                                                                                   |
| Persistente Datenhaltung    | ✅     | `backend/src/server.ts` Z.44–50: Prisma Client mit SQLite; `.prisma/migrations/` vorhanden                        |
| Nicht data.json             | ✅     | SQLite DB via Prisma ORM; DB-Schema in `schema.prisma`                                                            |
| **Authentifizierung**       |        |                                                                                                                   |
| Login & Registrierung       | ✅     | `backend/src/server.ts` Z.58–87 POST `/api/login`, Z.148–153 POST `/api/register`                                 |
| JWT implementiert           | ✅     | `backend/src/server.ts` Z.70–76: `jwt.sign()` token generieren; Cookie httpOnly, sameSite, secure Flags           |
| Geschützte Route            | ✅     | `backend/src/server.ts` Z.90–113: `authenticateToken` Middleware; GET `/api/user` & DELETE `/api/user` geschützt  |
| **Architektur**             |        |                                                                                                                   |
| README Architekturskizze    | ✅     | Siehe Abschnitt **Architektur** unten                                                                             |
| Begründung: kein SSR/SSG    | ✅     | Siehe Abschnitt **Architektur** unten                                                                             |

## Architektur

```text
Frontend (React + Vite + React Router)
  ├─ Seiten: Overview, Campaign-Detail, Manage, Auth
  ├─ API-Aufrufe über /api (Vite Proxy)
  └─ Auth-State via JWTAuthContext
          │
          ▼
Backend (Express + Prisma + SQLite)
  ├─ Auth-Routen: /api/register, /api/login, /api/logout
  ├─ User-Route: /api/user
  ├─ Campaign-/Entity-/Member-Routen
  └─ Rollenlogik:
      - DM/Owner: Campaign verwalten (Mitgliederrollen, Join-Code regenerieren)
      - DM/Owner/Editor: Entities bearbeiten
      - Player: lesen (sichtbare Inhalte)
```

### Frontend-Struktur

- `frontend/src/App.tsx`: Routing und Seitenzuordnung.
- `frontend/src/context/JWTAuthContext.tsx`: Login/Logout, User-Session, Fehler-/Ladezustände.
- `frontend/src/pages/*`: Feature-Seiten (Campaign Overview, Type-Detail, Manage, Auth).
- `frontend/src/components/*`: wiederverwendbare UI-Bausteine.
- `frontend/src/lib/api.ts`: zentraler Fetch-Wrapper für `/api` mit Fehlerbehandlung.

### Backend-Struktur

- `backend/src/server/app.ts`: Express-App, Middleware, Registrierung der Routen.
- `backend/src/server/routes/authRoutes.ts`: Registrierung, Login, Logout.
- `backend/src/server/routes/userRoutes.ts`: eingeloggten User lesen/löschen.
- `backend/src/server/routes/campaignRoutes.ts`: Campaign erstellen/laden/joinen/Join-Code erneuern.
- `backend/src/server/routes/entityRoutes.ts`: CRUD für Entities je Campaign und Typ.
- `backend/src/server/routes/memberRoutes.ts`: Rollenverwaltung von Mitgliedern.
- `backend/src/server/auth.ts`: JWT-Cookie-Prüfung (`authenticateToken`).

### Datenmodell (Prisma + SQLite)

Kernbeziehungen:

- `User` 1:n `CampaignMember`
- `Campaign` 1:n `CampaignMember`
- `Campaign` 1:n `Entity`
- `Entity` 1:n `EntityField`
- `Entity` 1:n `ContentBlock`
- `ContentBlock` 1:n `ContentListItem` und 1:n `ContentAttribute`

Damit werden sowohl Membership/Rollen als auch flexible Entity-Inhalte abgebildet.

### Rechte- und Sicherheitsmodell

| Bereich                 | PLAYER | EDITOR | DM / Owner |
| ----------------------- | ------ | ------ | ---------- |
| Campaign lesen          | ✅     | ✅     | ✅         |
| Entities bearbeiten     | ❌     | ✅     | ✅         |
| Mitgliederrollen ändern | ❌     | ❌     | ✅         |
| Join-Code regenerieren  | ❌     | ❌     | ✅         |

Sicherheit:

- JWT im **HttpOnly Cookie** (kein Zugriff aus JS).
- geschützte API-Routen über Middleware.
- Passwort-Hashing mit `bcrypt`.
- CORS auf konfigurierte Origins begrenzt.

### Request-Flow (vereinfacht)

1. Nutzer meldet sich über `/api/login` an.
2. Backend setzt JWT-Cookie.
3. Frontend lädt `/api/user` und hält Session im Context.
4. Fachseiten rufen Campaign-/Entity-Endpunkte auf.
5. Backend prüft bei Schreibzugriffen Rollen und verweigert unzulässige Aktionen mit `403`.

## Setup

### 1. Mit Docker Compose (empfohlen)

```bash
cp .env.example .env
docker compose up
```

Oder interaktiv (funktioniert auch nach frischem Pull):

```bash
./docker_setup.sh
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- Health: <http://localhost:3000/api/health>

### 2. Lokal ohne Docker

1. Backend `.env` anlegen (`backend/.env`), z. B.:

```env
DATABASE_URL="file:./dev.db"
PORT="3000"
JWT_SECRET="replace-with-a-long-random-secret"
CORS_ORIGIN="http://localhost:5173"
```

1. Backend starten:

```bash
cd backend
npm ci
npx prisma migrate deploy
npm run dev
```

1. Frontend starten (zweites Terminal):

```bash
cd frontend
npm ci
npm run dev
```

Wichtig: Das Backend startet nur mit gesetztem `JWT_SECRET`, und der Wert
`dev-secret-change-me` ist absichtlich blockiert.

## Deployment (minimal)

Der aktuelle Stack ist primär auf Development/Demo ausgelegt. Für einen
minimalen Deploy sollten mindestens folgende Variablen gesetzt sein:

```env
PORT=3000
JWT_SECRET=<long-random-secret>
CORS_ORIGIN=https://deine-frontend-domain.tld
DATABASE_URL=file:./data/dev.db
VITE_API_PROXY_TARGET=https://dein-backend-host.tld
```

Startbefehle (ohne Docker):

```bash
# Backend
cd backend
npm ci
npx prisma migrate deploy
npm run dev
```

```bash
# Frontend (zweites Terminal)
cd frontend
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```

Health-Check:

- `GET /api/health` liefert `ok`, `message`, `version` und `uptimeSeconds`.

## Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Testuser

Es gibt aktuell **keinen fest hinterlegten Seed-Testuser**.  
Nach einem DB-Reset registrierst du Testnutzer über die App unter `/register`.

Beispiel-Credentials (gültig zur Passwortregel):

- E-Mail: `dm@example.com`
- Passwort: `Testpass1`

Passwortregel im Backend: 8–30 Zeichen, mindestens 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl, nur Buchstaben/Zahlen.

## Einschränkungen

- SQLite als lokale Datenbank (kein Multi-Node-/Cloud-Setup).
- Keine Passwort-Reset- oder E-Mail-Verifizierung.
- Keine Datei-Uploads für Bilder (nur Bild-URLs).
- Keine Echtzeit-Kollaboration oder Konfliktauflösung bei paralleler Bearbeitung.
- Rollenverwaltung nur für DM/Owner auf der Manage-Seite.

## Autoren

- Melissa Armbruster (313275)
- Ronny Wittmer (313387)

## Repository

<https://github.com/Grottenolm2702/ZartagsWritings>
