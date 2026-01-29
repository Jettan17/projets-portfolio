# Architecture Codemap

> **Freshness**: 2026-01-29T16:00:00Z
> **Version**: 2.1.0

## Overview

Astro-based static portfolio website with High-Key colorful/creative visual style. Features dark/light theme toggle, responsive design, and dynamic project loading from GitHub.

**Live Site**: [projets-portfolio.vercel.app](https://projets-portfolio.vercel.app)

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Astro | ^5.2.5 |
| Language | TypeScript | (via Astro) |
| Styling | Vanilla CSS | Custom design system |
| Build | Vite | (bundled) |
| Deployment | Vercel | - |
| Data Source | GitHub API | REST v3 |

## Project Structure

```
projets-portfolio/
├── src/
│   ├── components/           # Reusable UI components (11)
│   │   ├── Button.astro
│   │   ├── CursorGlow.astro
│   │   ├── Footer.astro
│   │   ├── GeneratedImage.astro  # 6 visual styles
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectGrid.astro
│   │   ├── SkillBadge.astro
│   │   ├── SocialLinks.astro
│   │   └── ThemeToggle.astro
│   ├── config/               # Configuration
│   │   └── github-projects.ts
│   ├── content/              # Content collections
│   │   ├── config.ts
│   │   └── projets/          # Markdown projects
│   ├── data/                 # Static data
│   │   └── personal.json
│   ├── layouts/              # Page layouts
│   │   └── BaseLayout.astro
│   ├── lib/                  # Libraries
│   │   └── github/           # GitHub integration
│   │       ├── client.ts
│   │       ├── image-generator.ts
│   │       ├── transformer.ts
│   │       └── types.ts
│   ├── pages/                # Route pages (5)
│   │   ├── index.astro       # Homepage
│   │   ├── about.astro       # About page
│   │   ├── styles.astro      # Design system showcase
│   │   └── projets/
│   │       ├── index.astro   # All projects
│   │       └── [...slug].astro # Project detail
│   ├── styles/               # Global styles
│   │   └── global.css
│   └── utils/                # Utility functions
│       ├── projects.ts
│       └── types.ts
├── public/                   # Static assets
│   └── fonts/                # Plus Jakarta Sans
├── codemaps/                 # Architecture documentation
├── astro.config.mjs          # Astro configuration
├── tsconfig.json             # TypeScript config
├── vercel.json               # Vercel deployment config
└── package.json
```

## Current State: COMPLETE

- **Pages**: 5 (index, about, styles, projets/index, projets/[slug])
- **Components**: 11
- **Layouts**: 1
- **Styles**: 1 (global.css with full design system)
- **Content**: Markdown + GitHub API

## Dependencies

```json
{
  "astro": "^5.2.5"
}

Dev Dependencies:
- typescript
- vitest (testing)
```

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:4321) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Configuration

### astro.config.mjs
- Output: static
- No integrations (vanilla CSS)

### tsconfig.json
- Extends `astro/tsconfigs/strict`
- `strictNullChecks: true`

### vercel.json
- Framework preset: astro
- Build command: `npm run build`

## Key Features

### Theme System
- Dark/light mode toggle
- System preference detection
- Persistent preference (localStorage)
- CSS custom properties for theming

### GeneratedImage Styles
6 unique visual styles for project cards:
1. **Orb** - Gradient ellipse with blur
2. **Waves** - 3-layer SVG waves
3. **Corners** - Dual corner accents
4. **Grain** - Noise texture overlay
5. **Diagonal** - Bold accent line
6. **Duotone** - Two-tone split

### Project Data
- GitHub API for live project data
- Content Collections for markdown projects
- Merged at build time

## Architecture Diagram

```
+------------------+
|    Browser       |
+------------------+
         |
         v
+------------------+
|  Static HTML     |  <-- Vercel CDN
|  (dist/)         |
+------------------+
         ^
         |
+------------------+
|  Astro Build     |
+------------------+
    |         |
    v         v
+--------+ +--------+
|Markdown| |GitHub  |
|Content | |API     |
+--------+ +--------+
    |         |
    v         v
+------------------+
|  mergeProjects() |
+------------------+
         |
         v
+------------------+
|  Components      |
|  (ProjectCard,   |
|   GeneratedImage)|
+------------------+
```
