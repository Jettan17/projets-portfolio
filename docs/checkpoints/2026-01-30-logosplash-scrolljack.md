# Checkpoint: LogoSplash + GSAP Scrolljack

Created: 2026-01-30
Git SHA: 2cab695
Branch: main

## Summary

Major visual overhaul with new logo splash screen and scroll-based animations.

## Changes

### New Components
- `LogoSplash.astro` - Connected PJ monogram with "ro" and "ets" text overlay
- `IntroSplash.astro` - Introduction text with scroll-triggered animations
- `WhatIDo.astro` - Horizontal scroll cards with secondary color gradients
- `MyApproach.astro` - Philosophy/approach section
- `ScrollTransition.astro` - Transition bridge section

### Animation System
- `src/scripts/scrolljack.ts` - GSAP ScrollTrigger controller
  - Pinned sections with scrub animations
  - Horizontal scroll on desktop
  - Mobile-friendly fallbacks

### Logo System
- `public/logos/` - Dynamic logo loading
- Updated Prizm logo with white text for dark background contrast
- Added Learnex, Stratos logos

### SDK Updates
- Removed deprecated commands (e2e, eval, no-stubs, plan, etc.)
- Added evolve, instinct, release commands
- Added learned patterns for GSAP visibility and visual centering

## Files Changed
- 39 files changed
- +2781 insertions, -1125 deletions

## Learned Patterns
1. `gsap-scrolltrigger-visibility-strategy` - Fix cards showing one-at-a-time
2. `visual-centering-absolute-children` - Center elements with overflow

## Notes
- Logo contrast check: All logos now use white text on dark backgrounds
- Card animations fixed: All 3 cards visible together on section enter
