# Checkpoint: Pointer Coarse Text Detection

Created: 2026-02-07
Git SHA: 70585c2
Branch: main

## Summary

Fixed mobile/desktop text switching in MyApproach section to use `pointer: coarse` media query instead of `max-width: 768px`. iPad Pro (1024px) and iPad Air (820px) were incorrectly showing "Move your cursor to focus" because their viewport exceeds 768px despite being touch devices.

## Files Changed (since last checkpoint)

- `src/components/MyApproach.astro` (modified) - Split media query:
  - `@media (pointer: coarse)` for text switching (input-method based)
  - `@media (max-width: 768px)` for `.hidden-skill` font size (layout-based)

## Technical Details

- `pointer: coarse` detects touch as primary input (phones, tablets)
- `pointer: fine` matches mouse/trackpad (desktops, laptops)
- The scroll lock and spotlight touch handlers were already input-based (touch events), so only the CSS text visibility needed fixing

## Build Status

- Build: PASS

## Notes

- Previous breakpoint: `max-width: 768px` (viewport-based, missed iPads)
- New detection: `pointer: coarse` (input-method-based, correct for all touch devices)
