# Frontend Codemap

> **Freshness**: 2026-01-29T16:00:00Z
> **Version**: 2.1.0

## Overview

Astro v5.2 static site with vanilla CSS styling. High-Key colorful/creative design with dark mode support.

**Live Site**: [projets-portfolio.vercel.app](https://projets-portfolio.vercel.app)

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Homepage with hero, featured projets, skills |
| `/projets` | `src/pages/projets/index.astro` | All projets grid |
| `/projets/[slug]` | `src/pages/projets/[...slug].astro` | Individual projet detail |
| `/about` | `src/pages/about.astro` | About page |
| `/styles` | `src/pages/styles.astro` | Design system showcase (Style Guide) |

## Components

| Component | Purpose |
|-----------|---------|
| `Header.astro` | Navigation with mobile menu, theme toggle |
| `Footer.astro` | Site footer with nav, social links |
| `Hero.astro` | Homepage hero with animated blobs |
| `ProjectCard.astro` | Individual projet card display |
| `ProjectGrid.astro` | Responsive projets grid layout |
| `GeneratedImage.astro` | Dynamic placeholder image with 6 visual styles |
| `SocialLinks.astro` | Social media icon links (sizes: sm/md/lg, variants: default/light) |
| `SkillBadge.astro` | Technology/skill badge (variants: default/primary/secondary/accent) |
| `Button.astro` | Reusable button (variants: primary/secondary/outline/ghost, sizes: sm/md/lg) |
| `ThemeToggle.astro` | Dark/light mode toggle |
| `CursorGlow.astro` | Cursor glow effect |

## Layouts

| Layout | Purpose |
|--------|---------|
| `BaseLayout.astro` | Main layout with head, header, footer, global styles |

## Styles

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Design tokens, base styles, CSS reset |

## Design System

### Colors (High-Key Palette)
```css
--color-primary: #FF6B6B;    /* Coral red */
--color-secondary: #4ECDC4;  /* Teal */
--color-accent: #FFE66D;     /* Bright yellow */
--color-highlight: #95E1D3;  /* Mint */
--color-pop: #F38181;        /* Soft coral */
```

### Dark Mode
```css
[data-theme="dark"] {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --text-primary: #e6edf3;
  --color-primary: #7b68ee;  /* Purple accent */
}
```

### Typography
- Primary Font: Plus Jakarta Sans
- Fallback: system-ui, sans-serif
- Mono: JetBrains Mono
- Display Fonts (for GeneratedImage): Playfair Display, Poppins, Space Grotesk, Outfit, DM Sans

### Spacing Scale
- Base: 4px (0.25rem)
- Scale: 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px), 20(80px), 24(96px)

### Shadows
- Standard: sm, md, lg, xl, 2xl
- Colorful: primary, secondary, accent

### Border Radius
- sm(0.25rem), md(0.5rem), lg(0.75rem), xl(1rem), 2xl(1.5rem), full(9999px)

### Transitions
- fast: 150ms
- base: 250ms
- slow: 350ms

## GeneratedImage Component

Dynamic placeholder images for project cards. Uses deterministic style and color assignment.

### Visual Styles (6 total)

| Style | Class | Description |
|-------|-------|-------------|
| Orb | `style-orb` | Refined gradient ellipse with smooth blur effect |
| Waves | `style-waves` | Bold 3-layer SVG waves with gradient colors |
| Corners | `style-corners` | Dual corner accents with glow effects |
| Grain | `style-grain` | Noise texture overlay with gradient (opacity 0.4, baseFrequency 0.65) |
| Diagonal | `style-diagonal` | Single bold diagonal accent line with glow |
| Duotone | `style-duotone` | Two-tone vertical split with smooth blend |

### Color Generation

Colors are generated per-project using golden angle hue distribution:
- **Primary**: HSL with 80% saturation, 60% lightness
- **Secondary**: +40 degrees hue shift
- **Accent**: +180 degrees (complementary)

### Style Assignment

Style is deterministically assigned via hash of repo name:
```typescript
getProjectStyle(repoName) // Returns: 'orb' | 'waves' | 'corners' | 'grain' | 'diagonal' | 'duotone'
```

### CSS Custom Properties

Each project image sets:
```css
--primary: hsl(h, 80%, 60%);
--secondary: hsl(h+40, 75%, 50%);
--accent: hsl(h+180, 85%, 55%);
--hue: number;
--display-font: 'FontName', system-ui, sans-serif;
```

## Routing

Astro file-based routing:
```
src/pages/index.astro           -> /
src/pages/about.astro           -> /about
src/pages/styles.astro          -> /styles
src/pages/projets/index.astro   -> /projets
src/pages/projets/[...slug].astro -> /projets/:slug
```

## Assets

| Directory | Purpose |
|-----------|---------|
| `public/` | Static assets (favicon) |
| `public/fonts/` | Plus Jakarta Sans font files |

## Import Graph

```
index.astro
├── BaseLayout.astro
│   ├── Header.astro
│   │   └── ThemeToggle.astro
│   ├── Footer.astro
│   │   └── SocialLinks.astro
│   └── global.css
├── Hero.astro
│   ├── Button.astro
│   └── SocialLinks.astro
├── ProjectGrid.astro
│   └── ProjectCard.astro
│       └── GeneratedImage.astro
│           └── lib/github/image-generator.ts
└── SkillBadge.astro

styles.astro
├── BaseLayout.astro
├── Button.astro
├── SkillBadge.astro
├── SocialLinks.astro
├── ThemeToggle.astro
└── GeneratedImage.astro

projets/index.astro
├── BaseLayout.astro
└── ProjectGrid.astro
    └── ProjectCard.astro

projets/[...slug].astro
├── BaseLayout.astro
├── Button.astro
├── SkillBadge.astro
└── GeneratedImage.astro
```

## Data Flow

```
GitHub API -> getGitHubProjects() -> mergeProjects() -> ProjectGrid -> ProjectCard -> GeneratedImage
                                          |
Content Collection -> getCollection('projets') ─┘
```

## Library: Image Generator

Located at `src/lib/github/image-generator.ts`

### Exports

| Function | Purpose |
|----------|---------|
| `getUniqueProjectColors(repoName)` | Generate unique HSL colors for a project |
| `getProjectStyle(repoName)` | Deterministically assign visual style |
| `getFontForRepo(repoName)` | Select display font from rotation |
| `getLanguageGradient(language)` | Get language-specific colors (legacy) |
| `getStackColors(tags, language)` | Get tech stack colors (legacy) |
| `generatePlaceholderDataUrl(...)` | Generate SVG data URL (legacy) |

### Constants

| Constant | Purpose |
|----------|---------|
| `imageStyles` | Array of 6 style names |
| `displayFonts` | Array of 5 display fonts |
| `languageColors` | Language to gradient color mapping |
| `techColors` | Technology to color mapping |
