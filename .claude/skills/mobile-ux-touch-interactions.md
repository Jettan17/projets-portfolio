# Skill: Mobile UX & Touch Interactions

**Type:** Auto-triggered skill
**Confidence:** 87% avg
**Evolved from:** 3 instincts
**Created:** 2026-02-06

## Trigger Conditions

Activate this skill when ANY of these are detected:
- Touch event handlers (`touchstart`, `touchmove`, `touchend`) being written or debugged
- Mobile interaction issues (spotlight, carousel, slider, drag, canvas drawing)
- `preventDefault()` not working on touch events
- Responsive styles not applying on mobile
- Interactive features interfering with page scroll

## Diagnostic Checklist

### 1. Touch Direction Gating
**Source:** `mobile-touch-direction-gating` (90% confidence)

Before activating any interactive touch feature on a scrollable page:

```javascript
// Record start position on touchstart (don't activate yet)
var touchStartX, touchStartY;
var touchDecided = false, touchIsScroll = false;
var DIRECTION_THRESHOLD = 10; // px

function handleTouchStart(e) {
  var touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchDecided = false;
  touchIsScroll = false;
}

function handleTouchMove(e) {
  if (touchDecided && touchIsScroll) return; // scroll - bail out

  if (!touchDecided) {
    var dx = Math.abs(touch.clientX - touchStartX);
    var dy = Math.abs(touch.clientY - touchStartY);
    if (dx < DIRECTION_THRESHOLD && dy < DIRECTION_THRESHOLD) return; // not enough data
    touchDecided = true;
    touchIsScroll = dy > dx; // vertical = scroll
    if (touchIsScroll) return;
  }

  e.preventDefault(); // only block scroll when feature is active
  // ... activate feature
}
```

### 2. Passive Listener Trap
**Source:** `passive-listeners-preventdefault` (90% confidence)

`e.preventDefault()` is **silently ignored** in passive event listeners. No error is thrown.

- `{ passive: true }` = browser optimizes scroll, but `preventDefault()` does nothing
- `{ passive: false }` = required if you need to call `preventDefault()`
- Chrome shows a console warning, but only with DevTools open
- `touchstart` can stay passive if you only need `preventDefault()` in `touchmove`

```javascript
// WRONG - preventDefault silently fails
document.addEventListener('touchmove', handler, { passive: true });

// CORRECT - preventDefault works
document.addEventListener('touchmove', handler, { passive: false });
```

### 3. CSS Specificity on Mobile
**Source:** `css-specificity-responsive-overrides` (80% confidence)

When responsive styles don't apply on mobile, check these failure modes:

**a) Utility class overriding media query:**
```css
/* Both have same specificity - .hint wins if declared later */
.desktop-text { display: none; }  /* media query */
.hint { display: block; }          /* utility class */

/* Fix: use !important in media query */
@media (max-width: 768px) {
  .desktop-text { display: none !important; }
}
```

**b) Combined vs nested selector mismatch:**
```css
/* .quote-line.accent matches <span class="quote-line accent"> */
/* but NOT <span class="quote-line"><span class="accent">...</span></span> */

/* Fix: add both selectors */
.quote-line.accent,
.quote-line .accent { /* covers both combined and nested */ }
```

**c) Absolute elements behind fixed header:**
```css
/* top: 3% on mobile = behind 4rem fixed header */
/* Fix: increase minimum top to 15%+ on mobile */
```

## Decision Flow

```
Touch issue on mobile?
  |
  +-- Feature conflicts with scroll?
  |     -> Apply direction gating (#1)
  |
  +-- preventDefault not working?
  |     -> Check passive listener (#2)
  |
  +-- Styles not applying on mobile?
        -> Check specificity (#3)
```

## Source Instincts

| Instinct | Confidence | Domain |
|----------|-----------|--------|
| mobile-touch-direction-gating | 90% | Mobile UX |
| passive-listeners-preventdefault | 90% | Mobile UX |
| css-specificity-responsive-overrides | 80% | CSS / Mobile |
