---
description: Add a new project to the portfolio website
---

# Add Portfolio Project

Add a new project to the portfolio by configuring it in the GitHub projects config file.

## Problem

When adding a new project to the portfolio, you need to:
- Decide between GitHub integration or manual markdown content
- Gather project details (title, description, tech stack, live URL)
- Configure the project entry with correct fields
- Ensure the project displays correctly with proper metadata

## Solution

### Step 1: Choose the Integration Method

**Use GitHub config (`src/config/github-projects.ts`) when:**
- Project is hosted on GitHub
- You want automatic updates from GitHub API (description, stars, topics)
- You want the GitHub repo link displayed

**Use Markdown content (`src/content/projects/*.md`) when:**
- Project is not on GitHub
- You need full control over all content
- Project requires custom long-form description

For most cases, **GitHub config is preferred** as it auto-syncs metadata.

### Step 2: Verify the Repository Exists

```bash
gh repo view <username>/<repo-name>
```

This confirms the repo is public and accessible.

### Step 3: Gather Project Details from README

Check the project's README.md for:
- **Description**: One-line summary of what the project does
- **Tech stack**: Languages, frameworks, libraries used
- **Live URL**: Deployed demo link (often in README header or badges)
- **Key features**: For tags if not obvious from topics

```bash
gh repo view <username>/<repo-name> --json description,topics,homepageUrl
```

### Step 4: Add Entry to GitHub Config

Edit `src/config/github-projects.ts`:

```typescript
export const githubProjects: GitHubProjectConfig[] = [
  // Existing projects...

  {
    repo: 'your-repo-name',        // Required: exact repo name
    title: 'Display Title',         // Optional: custom title (default: formatted repo name)
    featured: true,                 // Optional: show in featured section
    tags: ['TypeScript', 'React'],  // Optional: override auto-detected tags
    liveUrl: 'https://example.com', // Optional: live demo URL
  },
];
```

### Step 5: Verify Display

Run the dev server and check:
- Project appears in the projects grid
- If featured, appears in featured section
- Tags display correctly
- Live URL link works
- GitHub link works

## Config Field Reference

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `repo` | Yes | - | Exact GitHub repository name |
| `title` | No | Formatted from repo name | Display title |
| `description` | No | From GitHub API | Project description |
| `tags` | No | Language + topics from GitHub | Technology tags |
| `image` | No | Generated placeholder | Custom image URL |
| `featured` | No | `false` | Show in featured section |
| `liveUrl` | No | GitHub homepage if set | Live demo URL |

## Example

Adding "prizm-photo-album" project:

```typescript
{
  repo: 'prizm-photo-album',
  title: 'Prizm',
  featured: true,
  tags: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
  liveUrl: 'https://prizm-photo-album.vercel.app',
},
```

## When to Use

- "Add a new project to the portfolio"
- "I have a new repo to showcase"
- "How do I add projects to the site?"
- "Include my latest project"
- "Update portfolio with new work"

## Related

- `src/config/github-projects.ts` - Main config file
- `src/lib/github/types.ts` - TypeScript interfaces
- `src/content/config.ts` - Astro content collection schema (for markdown approach)

## Tips

1. **Minimal config works**: Just `{ repo: 'name' }` is valid - GitHub API fills the rest
2. **Override selectively**: Only specify fields you want to customize
3. **Check README first**: Live URLs and tech stack are usually documented there
4. **Verify with `gh` CLI**: Ensures repo exists and is public before adding
