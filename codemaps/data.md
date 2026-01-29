# Data Codemap

> **Freshness**: 2026-01-29T16:00:00Z
> **Version**: 2.1.0

## Overview

Dual data source architecture: Astro Content Collections (Markdown) + GitHub API for dynamic projet loading.

## Data Sources

| Source | Type | Location |
|--------|------|----------|
| Content Collections | Markdown | `src/content/projets/` |
| GitHub API | REST API | `src/lib/github/` |
| Static Data | JSON | `src/data/personal.json` |
| Configuration | TypeScript | `src/config/github-projects.ts` |
| Image Generator | TypeScript | `src/lib/github/image-generator.ts` |

## GitHub Integration

### Configuration

```typescript
// src/config/github-projects.ts
export const githubUsername = 'Jettan17';

export const githubProjects: GitHubProjectConfig[] = [
  {
    repo: 'learnex-course-tutor',
    title: 'Learnex',
    featured: true,
    tags: ['TypeScript', 'AI'],
  },
  // ...
];
```

### API Client

| File | Purpose |
|------|---------|
| `src/lib/github/client.ts` | GitHub API fetch functions |
| `src/lib/github/transformer.ts` | Transform API data to ProjectEntry |
| `src/lib/github/types.ts` | TypeScript interfaces |
| `src/lib/github/image-generator.ts` | Project image style and color generation |

### Rate Limiting

- Unauthenticated: 60 requests/hour
- Authenticated (GITHUB_TOKEN): 5,000 requests/hour
- Token configured via `.env` file

## Image Generator Module

Located at `src/lib/github/image-generator.ts`

### Purpose

Generates unique visual styles and colors for project placeholder images. Uses deterministic algorithms so the same project always gets the same appearance.

### Types

```typescript
type ImageStyle = 'orb' | 'waves' | 'corners' | 'grain' | 'diagonal' | 'duotone';

interface ProjectColors {
  primary: string;    // HSL color string
  secondary: string;  // HSL color string
  accent: string;     // HSL color string
  hue: number;        // Base hue value (0-360)
}
```

### Functions

| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| `getUniqueProjectColors(repoName)` | string | ProjectColors | Generate unique colors using golden angle distribution |
| `getProjectStyle(repoName)` | string | ImageStyle | Assign one of 6 visual styles |
| `getFontForRepo(repoName)` | string | string | Select display font from 5-font rotation |
| `getUniqueProjectHue(repoName)` | string | number | Get base hue (0-360) |

### Visual Styles

| Style | Effect |
|-------|--------|
| `orb` | Gradient ellipse with blur |
| `waves` | 3-layer SVG wave pattern |
| `corners` | Dual corner accents with glow |
| `grain` | Noise texture overlay (opacity 0.4, baseFrequency 0.65) |
| `diagonal` | Bold diagonal accent line |
| `duotone` | Two-tone vertical split with smooth blend |

### Color Algorithm

Uses golden angle (137.508 degrees) for hue distribution:
```typescript
hue = (hash * 137.508) % 360;
primary = hsl(hue, 80%, 60%);
secondary = hsl((hue + 40) % 360, 75%, 50%);
accent = hsl((hue + 180) % 360, 85%, 55%);
```

### Legacy Functions (Tech Stack Based)

| Function | Purpose |
|----------|---------|
| `getLanguageGradient(language)` | Get language-specific gradient colors |
| `getLanguageColor(language)` | Get primary color for a language |
| `getStackColors(tags, language)` | Get up to 4 colors from tech stack |
| `getStackGradient(tags, language)` | Generate radial gradient CSS |
| `generatePlaceholderDataUrl(...)` | Generate inline SVG data URL |

## Content Collections

### Projets Collection Schema

```typescript
// src/content/config.ts
const projetsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    publishDate: z.date(),
  }),
});

export const collections = {
  projets: projetsCollection,
};
```

### Projet Frontmatter

```yaml
---
title: "Projet Name"
description: "Brief description"
image: "/images/projets/screenshot.png"
tags: ["Astro", "TypeScript", "CSS"]
liveUrl: "https://example.com"
repoUrl: "https://github.com/user/repo"
featured: true
publishDate: 2024-01-15
---
```

## Project Entry Type

```typescript
// src/utils/types.ts
interface ProjectData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  publishDate: Date;
  source?: 'markdown' | 'github';
  stars?: number;
  language?: string | null;
}

interface ProjectEntry {
  slug: string;
  data: ProjectData;
}
```

## Personal Data Schema

```typescript
// src/data/personal.json
interface PersonalData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
  };
  skills: string[];
}
```

## Data Flow

```
+-------------------------------------------------------------+
|                      BUILD TIME                              |
+-------------------------------------------------------------+
|                                                              |
|  Content Collection          GitHub API                     |
|  (src/content/projets/)      (api.github.com)               |
|         |                          |                         |
|         v                          v                         |
|  getCollection('projets')    getGitHubProjects()            |
|         |                          |                         |
|         +----------+---------------+                         |
|                    v                                         |
|              mergeProjects()                                 |
|                    |                                         |
|                    v                                         |
|              sortByDate()                                    |
|                    |                                         |
|                    v                                         |
|           getFeaturedProjects()                              |
|                    |                                         |
|                    v                                         |
|           ProjectCard.astro                                  |
|                    |                                         |
|                    v                                         |
|           GeneratedImage.astro                               |
|                    |                                         |
|                    v                                         |
|           image-generator.ts                                 |
|           (getProjectStyle, getUniqueProjectColors)          |
|                    |                                         |
|                    v                                         |
|              Static HTML                                     |
|                                                              |
+-------------------------------------------------------------+
```

## Utility Functions

| Function | File | Purpose |
|----------|------|---------|
| `getGitHubProjects()` | `utils/projects.ts` | Fetch projets from GitHub |
| `getGitHubProjectsWithStatus()` | `utils/projects.ts` | Fetch with error tracking |
| `mergeProjects()` | `utils/projects.ts` | Combine markdown + GitHub |
| `sortByDate()` | `utils/projects.ts` | Sort by publishDate desc |
| `getFeaturedProjects()` | `utils/projects.ts` | Filter featured only |
| `filterByTag()` | `utils/projects.ts` | Filter by tag |
| `searchProjects()` | `utils/projects.ts` | Search title/description |

## Querying Content

```astro
---
import { getCollection } from 'astro:content';
import { getGitHubProjectsWithStatus, mergeProjects } from '../utils/projects';

// Get markdown projets
const markdownProjets = await getCollection('projets');

// Get GitHub projets with error handling
const githubResult = await getGitHubProjectsWithStatus();

// Merge all projets
const allProjets = mergeProjects(
  markdownProjets.map(p => ({
    slug: p.slug,
    data: { ...p.data, source: 'markdown' as const },
  })),
  githubResult.projects
);

// Check for errors
const hasErrors = githubResult.hasErrors;
---
```

## Error Handling

```typescript
interface GitHubProjectsResult {
  projects: ProjectEntry[];
  errors: string[];
  hasErrors: boolean;
}
```

When GitHub API fails:
- Errors are logged to console
- `hasErrors` flag is set
- UI displays error banner if all projets fail to load
