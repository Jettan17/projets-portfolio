# Checkpoint: portfolio-improvements

Created: 2026-03-05
Git SHA: 0a4e0fb
Branch: main

## Summary

Major portfolio improvements session covering project card UI, featured section shuffle,
sort controls, new projects (Chromax, Watcher), and several bug fixes.

## Files Changed

### Source
- `src/components/GeneratedImage.astro` — Fix JetFlux orb centering (55% → 50%)
- `src/components/ProjectCard.astro` — "View Projet" text; data-title/created/updated attributes
- `src/config/github-projects.ts` — Add featuredBlacklist; add Chromax, Watcher projects
- `src/lib/github/transformer.ts` — publishDate → created_at; add pushedAt field
- `src/lib/github/types.ts` — Add pushedAt to GitHubProjectData interface
- `src/pages/about.astro` — Add HiddenWords component
- `src/pages/index.astro` — Featured blacklist filter; DOM-reorder shuffle script
- `src/pages/projets/index.astro` — Sort controls UI (recently updated/created/A→Z/Z→A)
- `src/utils/projects.ts` — Pass pushedAt through pipeline
- `src/utils/types.ts` — Add pushedAt?: Date to ProjectData

### SDK Update
- `.claude/agents/` — 9 agent files updated via /sdk --update
- `.claude/commands/` — 16 command files updated via /sdk --update
- `CLAUDE.md` — Updated (now includes /wordlist command)

## Changes Made

| Feature | Status |
|---------|--------|
| "View Projet" hover button text | ✓ |
| JetFlux orb gradient centered | ✓ |
| Featured project blacklist (Stratos excluded) | ✓ |
| Client-side featured shuffle (DOM reorder) | ✓ |
| Sort controls on /projets | ✓ |
| publishDate = created_at for correct ordering | ✓ |
| pushedAt pipeline fix (was silently dropped) | ✓ |
| Chromax added to portfolio | ✓ |
| Watcher (claude-input-watcher) added | ✓ |
| Chromax live demo link removed | ✓ |
| Sort button font (inherit) | ✓ |
| SDK update (/sdk --update) | ✓ |

## Notes

- Featured blacklist lives in `src/config/github-projects.ts` as `featuredBlacklist[]`
- Sort state resets on page reload (client-side only, acceptable for portfolio)
- Watcher set as featured: false (tool, not showcase project)
