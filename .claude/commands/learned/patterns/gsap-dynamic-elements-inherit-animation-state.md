---
description: Dynamically created elements inherit CSS animation hidden states - use inline styles to override
---

# GSAP Dynamic Elements Inherit Animation State

When creating elements dynamically after GSAP animations have run, new elements inherit CSS hidden states.

## Problem

GSAP scroll animations often use CSS to set initial hidden state:

```css
/* Global animation setup */
body.js-animate .project-card {
  opacity: 0;
  transform: translateY(50px);
}
```

When GSAP runs, it animates these elements to `opacity: 1`. But if you later create new elements dynamically (e.g., shuffle/reorder cards), the **new elements inherit the CSS `opacity: 0`** and GSAP has no knowledge of them.

**Symptom:** Cards/elements disappear when shuffled, reordered, or dynamically recreated. They don't come back because GSAP already ran its animation and won't re-animate the new elements.

## Solution

When dynamically creating elements that should be visible, **apply inline styles to override the CSS animation state**:

```javascript
// BAD: New card inherits opacity: 0 from CSS
const newCard = document.createElement('div');
newCard.className = 'project-card';
container.appendChild(newCard);
// Card is invisible!

// GOOD: Inline style overrides CSS animation state
const newCard = document.createElement('div');
newCard.className = 'project-card';
newCard.style.opacity = '1';
newCard.style.transform = 'translateY(0)';
container.appendChild(newCard);
// Card is visible!
```

## Real-World Example: Shuffle Cards

```javascript
function shuffleCards() {
  const container = document.querySelector('.cards-grid');
  const cards = Array.from(container.querySelectorAll('.project-card'));

  // Shuffle array
  const shuffled = cards.sort(() => Math.random() - 0.5);

  // Clear container
  container.innerHTML = '';

  // Re-append with inline visibility
  shuffled.forEach((card, index) => {
    // CRITICAL: Override CSS animation state
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';

    // Optional: Add entrance animation
    card.style.animation = `fadeIn 0.3s ease ${index * 0.05}s both`;

    container.appendChild(card);
  });
}
```

## Alternative: Reset Body Class

If you control the animation class, remove and re-add it:

```javascript
function shuffleWithReanimation() {
  document.body.classList.remove('js-animate');

  // Shuffle logic here...

  // Force reflow
  void document.body.offsetHeight;

  // Re-enable animations (GSAP ScrollTrigger will re-evaluate)
  document.body.classList.add('js-animate');

  // Manually trigger ScrollTrigger refresh
  ScrollTrigger.refresh();
}
```

## When to Use

- Implementing shuffle/sort functionality on animated elements
- Dynamically adding cards to an animated grid
- Filtering that removes and re-adds elements
- Any scenario where elements are removed from DOM and re-inserted

## Related

- [gsap-scrolltrigger-visibility-strategy.md](../gsap-scrolltrigger-visibility-strategy.md) - Choosing the right animation strategy
- GSAP `ScrollTrigger.refresh()` - Force ScrollTrigger to recalculate triggers
