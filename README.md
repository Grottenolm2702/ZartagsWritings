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

## Setup

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Authors

Melissa Armbruster (313275),
Ronny Wittmer(313387)

## Repository Link

<https://github.com/Grottenolm2702/ZartagsWritings>
