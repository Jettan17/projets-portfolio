---
description: Choose correct GSAP ScrollTrigger animation timing for element visibility
---

# GSAP ScrollTrigger Visibility Strategy

Decide whether elements should appear together or staggered based on scroll position.

## Problem

When using GSAP ScrollTrigger for scroll-based animations, a common bug occurs when elements that should all be visible at once are instead tied to scroll progress. This causes only one element to show at a time as the user scrolls.

**Symptom:** Cards/elements disappear or only show one at a time when they should all be visible together.

## Solution

### Strategy 1: All Elements Visible Together (Most Common)

Use `toggleActions` with a simple trigger point. All elements animate in when the section enters viewport.

```javascript
// Cards fade in TOGETHER when section enters viewport
gsap.fromTo('.card',
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.1, // Small stagger for visual polish, but all become visible
    scrollTrigger: {
      trigger: '.cards-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  }
);
```

**When to use:**
- Card grids that should all be readable
- Feature lists
- Navigation items
- Any content where partial visibility is confusing

### Strategy 2: Progress-Based Stagger (Reveal on Scroll)

Tie individual element opacity to scroll position. Elements reveal one-by-one as user scrolls.

```javascript
// Cards fade in ONE BY ONE based on scroll progress
const cards = gsap.utils.toArray('.card');
const cardCount = cards.length;

cards.forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    scrollTrigger: {
      trigger: '.cards-section',
      start: 'top top',
      end: 'bottom bottom',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Calculate which card should be visible based on progress
        const activeIndex = Math.floor(self.progress * cardCount);
        card.style.opacity = (i === activeIndex) ? 1 : 0;
      }
    }
  });
});
```

**When to use:**
- Storytelling sequences
- Step-by-step tutorials
- Timeline/history sections
- Interactive presentations

### Strategy 3: Horizontal Scroll (All Visible, Position Changes)

For horizontal scroll sections, keep all elements visible but animate their position.

```javascript
// Horizontal scroll - all cards visible, track moves horizontally
const track = document.querySelector('.cards-track');
const trackWidth = track.scrollWidth - window.innerWidth;

gsap.to(track, {
  x: -trackWidth,
  ease: 'none',
  scrollTrigger: {
    trigger: '.cards-section',
    start: 'top top',
    end: `+=${trackWidth}`,
    pin: true,
    scrub: 1
  }
});
```

## Decision Framework

```
Q: Should all elements be visible simultaneously once revealed?
|
+-- YES --> Use Strategy 1 (toggleActions)
|
+-- NO --> Q: Should visibility be tied to scroll position?
           |
           +-- YES --> Use Strategy 2 (progress-based)
           |
           +-- NO (just position) --> Use Strategy 3 (horizontal scroll)
```

## Common Bug Pattern

**The Bug:**
```javascript
// BAD: This makes only ONE card visible at a time
onUpdate: (self) => {
  const progress = self.progress;
  cards.forEach((card, i) => {
    const cardProgress = i / cardCount;
    card.style.opacity = (Math.abs(progress - cardProgress) < threshold) ? 1 : 0;
  });
}
```

**The Fix:**
```javascript
// GOOD: All cards fade in together with stagger
gsap.fromTo(cards,
  { opacity: 0 },
  {
    opacity: 1,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.cards-section',
      start: 'top 70%'
    }
  }
);
```

## When to Use

- Debugging "cards only show one at a time" issues
- Planning new scroll-based animations
- Reviewing ScrollTrigger implementations
- Converting between animation strategies

## Related

- GSAP ScrollTrigger documentation: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- `toggleActions` values: play, pause, resume, reverse, restart, reset, complete, none
