# Checkpoint: Mobile Spotlight Scroll Fix

Created: 2026-02-06
Git SHA: c2f9098
Branch: main

## Summary
Fixed the green cursor spotlight causing lag/interference during vertical scrolling on mobile devices. The spotlight now uses direction detection to distinguish between vertical scrolling (ignored) and horizontal finger movement (activates spotlight).

## Files Changed (since last checkpoint)
- src/layouts/BaseLayout.astro (modified) - Touch handler direction detection

## What Changed
- **Before**: `touchstart` immediately showed the spotlight; `touchmove` tracked it during all gestures including vertical scrolls
- **After**: Touch handlers record start position, wait for 10px of movement, then check direction:
  - Vertical dominant (dy > dx) = scroll gesture, spotlight stays hidden
  - Horizontal dominant (dx >= dy) = exploration gesture, spotlight activates
  - State resets on `touchend` for the next gesture

## Notes
- Event listeners remain `{ passive: true }` preserving browser scroll optimizations
- Direction threshold of 10px provides responsive detection without false positives
- No CSS changes needed - fix is purely in the JavaScript touch handlers
