# Architecture Codemap

> **Freshness**: 2026-01-27T19:20:00Z
> **Version**: 1.0.0

## Overview

Astro-based static portfolio website with High-Key colorful/creative visual style.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Astro | ^5.2.5 |
| Language | TypeScript | (via Astro) |
| Styling | Vanilla CSS | - |
| Build | Vite | (bundled) |

## Project Structure

```
projets-portfolio/
├── src/
│   └── pages/
│       └── index.astro          # Homepage (minimal template)
├── public/                      # Static assets
├── astro.config.mjs             # Astro configuration (default)
├── tsconfig.json                # TypeScript strict mode
└── package.json                 # Dependencies
```

## Current State: MINIMAL

- **Pages**: 1 (index.astro - empty template)
- **Components**: 0
- **Layouts**: 0
- **Styles**: 0
- **Content**: 0

## Planned Architecture

```
src/
├── components/     # Reusable UI components (9 planned)
├── layouts/        # Page layouts (1 planned)
├── pages/          # Route pages (5 planned)
├── content/        # Markdown content collections
├── styles/         # Global CSS & design tokens
└── data/           # Static JSON data
```

## Dependencies

```json
{
  "astro": "^5.2.5"
}
```

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:4321) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Configuration

### astro.config.mjs
- Default configuration (no integrations yet)

### tsconfig.json
- Extends `astro/tsconfigs/strict`
- `strictNullChecks: true`
