# Checkpoint: ui-cleanup-stratos-removal

Created: 2026-03-06
Git SHA: 8f6a714
Branch: main

## Summary
Major UI cleanup and content removal pass on the portfolio homepage.

## Changes Made
- **Stratos project removed** — config entry, hue mapping, sync-logos mapping, logo SVG deleted
- **WhatIDo section removed** — horizontal scroll panel, GSAP block, initial-state CSS
- **Blacklist updated** — `claude-input-watcher` (Watcher) now excluded from featured projects
- **CTA section removed** — eliminated "View My GitHub" redundant dark section from homepage
- **Social links cleaned** — removed Twitter (placeholder) and Email entries from SocialLinks
- **Hero simplified** — single "View My GitHub" primary CTA (removed "View My Work" as redundant with featured section below)
- **Footer stripped** — removed copyright bar, "Built with Astro" line, reddish nebula decoration, ::before gradient wash
- **Footer padding increased** — more breathing room (space-20 top, space-16 bottom)
- **Section boundary clipping fixed** — removed overflow: hidden and decorative elements causing hard clip edges

## Files Changed
- `public/logos/stratos.svg` (deleted)
- `src/components/Footer.astro` (modified — stripped to essentials)
- `src/components/Hero.astro` (modified — single CTA)
- `src/components/SocialLinks.astro` (modified — GitHub + LinkedIn only)
- `src/components/WhatIDo.astro` (deleted)
- `src/config/github-projects.ts` (modified — Stratos removed, blacklist updated)
- `src/lib/github/image-generator.ts` (modified — Stratos hue removed)
- `src/pages/index.astro` (modified — CTA section removed)
- `src/scripts/scrolljack.ts` (modified — WhatIDo GSAP block removed)
- `src/styles/global.css` (modified — WhatIDo initial-state CSS removed)

## Test Status
- No automated tests — visual verification in browser
