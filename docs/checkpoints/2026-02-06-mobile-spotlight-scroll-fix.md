# Checkpoint: Mobile Spotlight Scroll Lock

Created: 2026-02-06
Git SHA: 486d988
Branch: main

## Summary
Fixed the green cursor spotlight on mobile: (1) direction detection prevents spotlight from activating during vertical scrolls, and (2) page scrolling is now fully blocked while the spotlight is active.

## Files Changed (since last checkpoint)
- src/layouts/BaseLayout.astro (modified) - Touch handler direction detection + scroll lock

## What Changed
### Phase 1 - Direction detection (c2f9098)
- Touch handlers record start position, wait for 10px of movement, then check direction
- Vertical dominant (dy > dx) = scroll gesture, spotlight stays hidden
- Horizontal dominant (dx >= dy) = exploration gesture, spotlight activates

### Phase 2 - Scroll lock (486d988)
- `touchmove` listener changed from `passive: true` to `passive: false`
- `e.preventDefault()` called when spotlight is active, blocking page scroll
- Normal vertical scrolling is unaffected (handler bails out early for scroll gestures)

## Notes
- `touchstart` remains `{ passive: true }` - only `touchmove` is non-passive
- Direction threshold of 10px provides responsive detection without false positives
- No CSS changes needed - fix is purely in the JavaScript touch handlers
