# Frontend Codemap

> **Freshness**: 2026-01-27T19:20:00Z
> **Version**: 1.0.0

## Overview

Astro static site with vanilla CSS styling. High-Key colorful/creative design.

## Pages

| Route | File | Status |
|-------|------|--------|
| `/` | `src/pages/index.astro` | Minimal template |
| `/projects` | - | Planned |
| `/projects/[slug]` | - | Planned |
| `/about` | - | Planned |
| `/contact` | - | Planned |

## Components

**Current**: None

**Planned**:
| Component | Purpose |
|-----------|---------|
| Header.astro | Navigation with mobile menu |
| Footer.astro | Site footer with social links |
| Hero.astro | Homepage hero section |
| ProjectCard.astro | Individual project display |
| ProjectGrid.astro | Projects grid layout |
| ContactForm.astro | Contact form |
| SocialLinks.astro | Social media icons |
| SkillBadge.astro | Technology badge |
| Button.astro | Reusable button |

## Layouts

**Current**: None

**Planned**:
| Layout | Purpose |
|--------|---------|
| BaseLayout.astro | Main layout with head/header/footer |

## Styles

**Current**: None (inline only)

**Planned**:
| File | Purpose |
|------|---------|
| global.css | Design tokens & base styles |

## Design System (Planned)

### Colors (High-Key Palette)
```css
--color-primary: #FF6B6B;    /* Coral red */
--color-secondary: #4ECDC4;  /* Teal */
--color-accent: #FFE66D;     /* Bright yellow */
--color-highlight: #95E1D3;  /* Mint */
```

### Typography
- Font: Inter (system fallback)
- Headings: Bold with gradient/color effects

### Spacing Scale
- Base: 4px
- Scale: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(48), 3xl(64)

## Routing

Astro file-based routing:
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/projects/index.astro` → `/projects`
- `src/pages/projects/[...slug].astro` → `/projects/:slug`

## Assets

| Directory | Purpose |
|-----------|---------|
| `public/` | Static assets (favicon, images) |
| `public/images/projects/` | Project screenshots (planned) |

## Current index.astro

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>Astro</h1>
  </body>
</html>
```

## Import Graph

**Current**: No imports (minimal template)

**Planned**:
```
index.astro
└── BaseLayout.astro
    ├── Header.astro
    │   └── SocialLinks.astro
    ├── Footer.astro
    │   └── SocialLinks.astro
    └── global.css

projects/index.astro
└── BaseLayout.astro
    └── ProjectGrid.astro
        └── ProjectCard.astro
```
