# Data Codemap

> **Freshness**: 2026-01-27T19:20:00Z
> **Version**: 1.0.0

## Overview

Content management via Astro Content Collections and static JSON data.

## Current State

**No data structures implemented yet.**

## Planned Data Models

### Project Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
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
  projects: projectsCollection,
};
```

### Project Frontmatter

```yaml
---
title: "Project Name"
description: "Brief description"
image: "/images/projects/screenshot.png"
tags: ["Astro", "TypeScript", "CSS"]
liveUrl: "https://example.com"
repoUrl: "https://github.com/user/repo"
featured: true
publishDate: 2024-01-15
---
```

### Personal Data Schema

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
  };
  skills: string[];
}
```

### Example personal.json

```json
{
  "name": "Your Name",
  "title": "Web Developer",
  "bio": "I build creative digital experiences.",
  "email": "hello@example.com",
  "location": "City, Country",
  "social": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "skills": [
    "JavaScript",
    "TypeScript",
    "Astro",
    "React",
    "CSS"
  ]
}
```

## Content Collections Structure

```
src/content/
├── config.ts           # Schema definitions
└── projects/
    ├── project-1.md
    ├── project-2.md
    └── project-3.md
```

## Data Flow

```
Content Collections (Markdown)
        ↓
    Astro Build
        ↓
    Static HTML
        ↓
    Browser
```

## Querying Content

```astro
---
import { getCollection } from 'astro:content';

// Get all projects
const projects = await getCollection('projects');

// Get featured projects
const featured = await getCollection('projects',
  ({ data }) => data.featured === true
);

// Sort by date
const sorted = projects.sort((a, b) =>
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);
---
```

## Static Data Import

```astro
---
import personal from '../data/personal.json';
---

<h1>{personal.name}</h1>
<p>{personal.bio}</p>
```
