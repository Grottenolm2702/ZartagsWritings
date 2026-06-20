# ZartagsWritings

A web application for creating and managing notes for Dungeons & Dragons campaigns, designed for both Dungeon Masters and players.
Using Templates to navigate beetween all sorts of items, Caracters and places.
For more Info see the about page.

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

**SPA + Backend-API Modell:**

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React SPA)                                         │
│ - Vite Dev Server (Port 3000)                               │
│ - React Router Navigation                                    │
│ - JWTAuthContext für Auth-State                              │
│ - Komponenten: Login, Register, Users, Layout               │
└────────────────────┬────────────────────────────────────────┘
                     │ fetch() + HttpOnly Cookies
                     │ (credentials: "include")
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend (Node.js/Express + SQLite)                           │
│ - API Endpoints: POST/GET/DELETE                             │
│ - authenticateToken Middleware                              │
│ - JWT Token in HttpOnly Cookie                               │
│ - Prisma ORM ↔ SQLite DB                                     │
└─────────────────────────────────────────────────────────────┘
```

**Warum kein SSR/SSG:**

- **Interaktive SPA ideal**: React Router ermöglicht schnelle Client-seitige Navigation ohne Page-Reload
- **Echte API-Integration**: Backend-API wird bewusst eingesetzt (nicht als Fallback), HttpOnly Cookies für sichere Auth
- **SSR/SSG unnötig**: Keine statischen oder Server-gerendertem HTML nötig; alle Daten werden dynamisch via API geladen
- **SEO kein Fokus**: D&D-Kampagnen-Manager ist keine öffentliche Website, sondern interne Anwendung für angemeldete User

## Setup

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

## Development

Start both the backend and frontend dev servers:

### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

**Note:** Frontend has a Vite proxy configured to `/api` → `http://localhost:3000` for development.

## Build

### Frontend

Create a production build:

```bash
cd frontend
npm run build
```

Preview the production build:

```bash
cd frontend
npm run preview
```

### Backend

The backend runs as a Node.js server. For production deployment, ensure `NODE_ENV=production` is set.

## Testing

### Run Tests

Both frontend and backend have test suites:

```bash
# Frontend tests (Vitest + React Testing Library)
cd frontend
npm test

# Backend tests (Vitest + Supertest)
cd backend
npm test
```

## Authors

Melissa Armbruster (313275),
Ronny Wittmer(313387)

## Repository Link

<https://github.com/Grottenolm2702/ZartagsWritings>
