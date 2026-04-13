# ZartagsWritings

A web application for creating and managing notes for Dungeons & Dragons campaigns, designed for both Dungeon Masters and players.
Using Templates to navigate beetween all sorts of items, Caracters and places.
For more Info see the about page.

## Kriterien-Zuordnung M1
| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | about.html | Z. 30-72  & 76–132 |
| Formular mit Labels | login.html | Z. 75–95 |
| Responsives Layout (Flexbox/Grid) | src/styles/content.css | Klassen: `.items-grid`, `.items-masonry` |
| Media Query | src/styles/navigation.css | Breakpoint: `max-width: 800px` |
| URL-Struktur | pc.html, about.html | Pfade: /src/campain1/pc, /src |

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
https://github.com/Grottenolm2702/ZartagsWritings
