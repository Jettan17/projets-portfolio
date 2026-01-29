# Plan: Stack-Based Unique Colors for Projects

## Requirements Restatement

Generate unique colors for each project based on its **full tech stack** (tags array) rather than just the primary language. This creates more visual variety and better represents multi-technology projects.

## Current State

- `src/lib/github/image-generator.ts` - Has `languageColors` map with ~17 language colors
- `GeneratedImage.astro` - Uses `getLanguageColor(language)` for single-language glow
- Projects have both `language` (primary) and `tags` (full stack) available

## Implementation Approach

**Color Blending Strategy**: Blend colors from multiple technologies in the stack to create a unique composite color for each project.

### Algorithm
1. Take the project's `tags` array (e.g., `["TypeScript", "React", "Node.js", "PostgreSQL"]`)
2. Map each recognized tag to its color
3. Blend the first 2-3 colors using weighted averaging (primary tag gets more weight)
4. Fallback to language color if no tags match, then to default gray

## Implementation Plan

### Phase 1: Add Stack Color Mapping

**File:** `src/lib/github/image-generator.ts`

Add more technology colors (frameworks, databases, tools):
```typescript
export const techColors: Record<string, string> = {
  // Languages (existing)
  TypeScript: '#007ACC',
  JavaScript: '#F0DB4F',
  Python: '#4B8BBE',
  Go: '#00ADD8',
  Rust: '#CE422B',
  // ... etc

  // Frameworks
  React: '#61DAFB',
  Vue: '#42b883',
  Angular: '#DD0031',
  Svelte: '#FF3E00',
  Next: '#000000',
  Astro: '#FF5D01',
  Express: '#000000',
  FastAPI: '#009688',
  Django: '#092E20',

  // Databases
  PostgreSQL: '#336791',
  MongoDB: '#47A248',
  Redis: '#DC382D',
  MySQL: '#4479A1',

  // Cloud/Tools
  Docker: '#2496ED',
  Kubernetes: '#326CE5',
  AWS: '#FF9900',
  Vercel: '#000000',

  // Default
  default: '#6e7681',
};
```

Add new function:
```typescript
export function getStackColor(tags: string[], language?: string | null): string {
  // Find matching colors from tags
  const matchedColors = tags
    .map(tag => techColors[tag])
    .filter(Boolean)
    .slice(0, 3);

  // Fallback chain: tags → language → default
  if (matchedColors.length === 0) {
    return techColors[language ?? 'default'] ?? techColors.default;
  }

  if (matchedColors.length === 1) {
    return matchedColors[0];
  }

  // Blend 2-3 colors with weights
  return blendColors(matchedColors);
}

function blendColors(colors: string[]): string {
  // Convert hex to RGB, weighted average, back to hex
  // First color gets 50% weight, others split remaining 50%
}
```

### Phase 2: Update GeneratedImage Component

**File:** `src/components/GeneratedImage.astro`

```diff
interface Props {
  title: string;
  language?: string | null;
  repoName?: string;
+ tags?: string[];
}

-const glowColor = getLanguageColor(language);
+const glowColor = getStackColor(tags ?? [], language);
```

### Phase 3: Pass Tags to GeneratedImage

**File:** `src/components/ProjectCard.astro`

```diff
<GeneratedImage
  title={title}
  language={language}
  repoName={repoName}
+ tags={tags}
/>
```

## Files to Modify

1. `src/lib/github/image-generator.ts` - Add `techColors`, `getStackColor()`, `blendColors()`
2. `src/components/GeneratedImage.astro` - Add `tags` prop, use `getStackColor()`
3. `src/components/ProjectCard.astro` - Pass `tags` to GeneratedImage

## Complexity

**MEDIUM** - Color blending logic requires hex↔RGB conversion, but straightforward implementation

## Risks

- **LOW**: Some tech names may not match tags exactly (case sensitivity, abbreviations)
- **LOW**: Blended colors might look muddy - mitigated by limiting to 2-3 colors

## Verification

1. Run `npm run dev`
2. View projects page
3. Confirm projects with different stacks show different glow colors
4. Verify TypeScript+React project looks different from TypeScript+Vue project
5. Check fallback works for projects with no recognized tags

---

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
