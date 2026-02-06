# Skill: GSAP Animation State Management

**Type:** Auto-triggered skill
**Confidence:** 75% avg
**Evolved from:** 2 instincts
**Created:** 2026-02-06

## Trigger Conditions

Activate this skill when ANY of these are detected:
- GSAP ScrollTrigger animations being implemented
- Elements appearing invisible after dynamic creation/shuffling
- Choosing between toggle-based and progress-based scroll animations
- CSS classes like `.js-animate` or `opacity: 0` initial states

## Diagnostic Checklist

### 1. Choose the Right ScrollTrigger Strategy
**Source:** `gsap-scrolltrigger-visibility-strategy` (70% confidence)

| Strategy | When to Use | How It Works |
|----------|-------------|--------------|
| **Toggle (onEnter/onLeave)** | Element enters viewport once, stays visible | `toggleActions: "play none none none"` |
| **Progress-based (scrub)** | Animation tied to scroll position | `scrub: true` with timeline |

**Toggle approach** (most common for reveal animations):
```javascript
gsap.from(element, {
  opacity: 0, y: 50,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    toggleActions: "play none none none"
  }
});
```

**Progress approach** (for parallax/depth effects):
```javascript
gsap.to(element, {
  y: -100,
  scrollTrigger: {
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

**Key decision:** If the element should be visible after scrolling past it, use toggle. If it should animate continuously with scroll position, use scrub.

### 2. Dynamic Elements Inherit Hidden States
**Source:** `gsap-dynamic-elements-inherit-animation-state` (80% confidence)

When elements are created dynamically (DOM manipulation, framework reactivity) AFTER GSAP animations have set initial CSS states, the new elements inherit the hidden/transformed state from CSS but don't get the GSAP animation to reveal them.

**The problem:**
```css
/* GSAP sets this via CSS for animation start state */
.card { opacity: 0; transform: translateY(50px); }
```
```javascript
// New card created after GSAP setup - inherits opacity:0, never animates
const newCard = document.createElement('div');
newCard.className = 'card'; // Gets hidden state, no animation
```

**The fix - use inline styles to override:**
```javascript
const newCard = document.createElement('div');
newCard.className = 'card';
newCard.style.opacity = '1';        // Override CSS hidden state
newCard.style.transform = 'none';    // Override CSS transform
container.appendChild(newCard);
```

**Alternative - re-run GSAP on new elements:**
```javascript
container.appendChild(newCard);
gsap.from(newCard, { opacity: 0, y: 50, duration: 0.5 });
```

## Decision Flow

```
GSAP animation issue?
  |
  +-- Element never becomes visible?
  |     +-- Was it created dynamically? -> Apply inline style override (#2)
  |     +-- Was it in DOM from start? -> Check ScrollTrigger config (#1)
  |
  +-- Animation timing wrong?
  |     +-- Should stay visible after scroll? -> Use toggle
  |     +-- Should track scroll position? -> Use scrub
  |
  +-- Elements flash/flicker on load?
        -> Set initial CSS state, let GSAP animate FROM that state
```

## Source Instincts

| Instinct | Confidence | Domain |
|----------|-----------|--------|
| gsap-scrolltrigger-visibility-strategy | 70% | Animation |
| gsap-dynamic-elements-inherit-animation-state | 80% | Animation |
