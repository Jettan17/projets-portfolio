---
description: passive event listeners silently ignore preventDefault - no error thrown
---

# Insight: Passive Event Listeners Silently Swallow preventDefault

**Context:** Debugging a mobile spotlight effect where `e.preventDefault()` in a `touchmove` handler was not preventing vertical scroll while the spotlight was active.

**Discovery:** Modern browsers default `touchmove` and `wheel` listeners to `passive: true` for scroll performance. A passive listener **cannot** call `e.preventDefault()` -- but instead of throwing an error, the call is silently ignored. The browser logs a console warning only if DevTools is open, which is easy to miss on real mobile devices.

This means code that looks correct:

```javascript
// THIS DOES NOT WORK - touchmove is passive by default
element.addEventListener('touchmove', (e) => {
  if (shouldBlock) {
    e.preventDefault(); // Silently ignored! No error thrown.
  }
});
```

Must explicitly opt out of passive mode:

```javascript
// THIS WORKS - explicitly non-passive
element.addEventListener('touchmove', (e) => {
  if (shouldBlock) {
    e.preventDefault(); // Now actually prevents scroll
  }
}, { passive: false });
```

**Implication:** Whenever writing a touch or wheel handler that conditionally calls `preventDefault()`, always explicitly set `{ passive: false }`. Do not rely on the default. This is especially treacherous because:

1. The code works on desktop (mouse events are not passive by default)
2. No JavaScript error is thrown on mobile
3. The console warning only appears with DevTools attached
4. The feature appears to "mostly work" -- the handler runs, the feature activates, but scroll is not blocked

**Captured:** 2026-02-06
