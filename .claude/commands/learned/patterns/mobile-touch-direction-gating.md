---
description: Detect touch direction before activating interactive features to avoid conflicting with page scroll
---

# Mobile Touch Direction Gating

Gate touch-interactive features behind a direction check so horizontal gestures activate the feature while vertical gestures pass through as normal scroll.

## Problem

Touch-interactive features (spotlight effects, swipe carousels, drag-to-reorder, canvas drawing) often listen to `touchstart` and `touchmove`. On mobile, this conflicts with vertical page scrolling because every scroll gesture also fires these events. The feature activates during normal scrolling, causing visual glitches, unintended interactions, or scroll hijacking.

**Symptom:** Interactive effect activates (and possibly locks scroll) when the user is just trying to scroll the page vertically.

## Solution

Use a direction-detection dead zone: record the touch start position, wait for a minimum movement threshold (10px works well), then compare the X and Y deltas to determine intent.

```javascript
let touchStartX = 0;
let touchStartY = 0;
let directionDecided = false;
let isHorizontalGesture = false;

element.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  directionDecided = false;
  isHorizontalGesture = false;
}, { passive: true });

element.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const dx = Math.abs(touch.clientX - touchStartX);
  const dy = Math.abs(touch.clientY - touchStartY);

  // Wait for enough movement to determine direction
  if (!directionDecided) {
    if (dx < 10 && dy < 10) return; // Still in dead zone
    directionDecided = true;
    isHorizontalGesture = dx >= dy;
  }

  // Vertical gesture: bail out entirely, let browser scroll
  if (!isHorizontalGesture) return;

  // Horizontal gesture: activate the feature
  e.preventDefault(); // Block scroll while feature is active
  activateFeature(touch.clientX, touch.clientY);

}, { passive: false }); // MUST be passive:false to allow preventDefault

element.addEventListener('touchend', () => {
  deactivateFeature();
  directionDecided = false;
  isHorizontalGesture = false;
});
```

## Key Details

### The Dead Zone Threshold
- **10px** is the sweet spot: large enough to determine direction reliably, small enough to feel responsive.
- Below 5px, noise in finger position causes incorrect detection.
- Above 20px, the feature feels laggy to activate.

### passive: false Is Required
- `touchmove` listeners are `passive: true` by default in modern browsers.
- A passive listener **cannot** call `e.preventDefault()`.
- You must explicitly set `{ passive: false }` if you need to block scrolling during the horizontal gesture.
- Only set this on the element that needs it, not globally, to preserve scroll performance elsewhere.

### Clean State Reset
Always reset `directionDecided` and `isHorizontalGesture` on both `touchend` and `touchcancel` to prevent stale state from a previous gesture affecting the next one.

## When to Use

- Spotlight/hover effects that track finger position on mobile
- Swipe carousels embedded in scrollable pages
- Horizontal drag interactions (sliders, before/after comparisons)
- Canvas drawing tools in scrollable containers
- Any touch feature that should only activate on horizontal movement

## When NOT to Use

- Features that should activate on any touch (tap targets, buttons)
- Full-page scroll-jacking where vertical scroll IS the interaction
- Features in non-scrollable containers (no conflict to resolve)

## Common Mistakes

1. **Forgetting passive: false** -- `preventDefault()` silently fails with no error, scroll still happens
2. **Deciding direction on first pixel** -- Too sensitive, random finger jitter causes wrong detection
3. **Not resetting state on touchend** -- Next gesture inherits previous direction decision
4. **Applying to document instead of element** -- Kills scroll performance everywhere

## Related

- MDN TouchEvent: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
- MDN passive listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive
- [gsap-scrolltrigger-visibility-strategy](../gsap-scrolltrigger-visibility-strategy.md) -- Related scroll interaction pattern
