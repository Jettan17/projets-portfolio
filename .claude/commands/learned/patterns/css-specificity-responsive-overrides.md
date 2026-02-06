---
description: Fix CSS specificity conflicts in responsive designs where utility classes override media query rules
---

# CSS Specificity Conflicts in Responsive Overrides

Identify and fix cases where CSS class specificity prevents media query responsive rules from working correctly.

## Problem

Responsive designs use media queries to show/hide or restyle elements at different breakpoints. These fail silently when another CSS rule with equal or higher specificity sets a conflicting property. The element appears correct on desktop but breaks on mobile (or vice versa), with no console errors.

**Symptom:** An element that should be hidden on mobile is still visible, or a mobile-only style is not applying, despite the media query being correct.

## Common Failure Patterns

### Pattern 1: Utility Class Overrides Responsive Rule

```css
/* Responsive rule - specificity: 0,1,0 */
@media (max-width: 768px) {
  .desktop-text { display: none; }
}

/* Utility class applied to same element - specificity: 0,1,0 */
.hint { display: block; }
```

```html
<!-- .hint's display:block overrides .desktop-text's display:none -->
<!-- because they have equal specificity and .hint comes later -->
<span class="desktop-text hint">This stays visible on mobile</span>
```

**Fix:** Use `!important` on the responsive rule, or increase specificity:

```css
/* Option A: !important (clearest intent) */
@media (max-width: 768px) {
  .desktop-text { display: none !important; }
}

/* Option B: Increase specificity */
@media (max-width: 768px) {
  .desktop-text.hint { display: none; }
}
```

### Pattern 2: Combined Class vs. Descendant Selector

```css
/* This matches: <div class="quote-line accent"> (both classes on SAME element) */
.quote-line.accent { color: var(--accent); }

/* But the actual markup is a CHILD element: */
/* <div class="quote-line"><span class="accent">text</span></div> */
```

**Fix:** Add the descendant selector:

```css
/* Matches both: element with both classes AND child with .accent */
.quote-line.accent,
.quote-line .accent {
  color: var(--accent);
}
```

### Pattern 3: Positional Conflict with Fixed Elements

```css
/* Floating elements positioned at top of viewport */
.floating-word.top-zone { top: 3%; }

/* But a fixed header occupies the top 4rem with z-index: 100 */
.header { position: fixed; height: 4rem; z-index: 100; }
```

**Fix:** Account for fixed UI elements in positioning:

```css
/* Ensure content starts below fixed header */
.floating-word.top-zone { top: 15%; }

/* Or use CSS custom properties for maintainability */
:root { --header-clearance: 15%; }
.floating-word.top-zone { top: var(--header-clearance); }
```

## Debugging Workflow

1. **Inspect the element** in DevTools at the target breakpoint
2. **Check Computed tab** for the actual property value
3. **Check Styles tab** for which rule is winning (crossed-out rules lost)
4. **Look for:** same-specificity conflicts, source order issues, `!important` elsewhere
5. **Search for the property** across the codebase: `grep -r "display:" --include="*.css"` to find all competing declarations

## Decision Framework

```
Q: Is the responsive override not applying?
|
+-- Check: Is another rule with same/higher specificity setting the property?
    |
    +-- YES, same specificity --> Source order matters. Either:
    |   a) Move media query AFTER the conflicting rule
    |   b) Use !important on the media query rule
    |   c) Increase specificity of media query selector
    |
    +-- YES, higher specificity --> Increase media query specificity to match or exceed
    |
    +-- NO --> Check if media query conditions are correct (breakpoint values, syntax)
```

## Prevention

- **Name responsive classes clearly:** `.desktop-only`, `.mobile-only` with `!important` baked in
- **Audit combined selectors:** When writing `.foo.bar`, verify the HTML actually has both classes on the same element
- **Reserve z-index layers:** Document fixed/sticky elements and their spatial footprint
- **Test at breakpoints during development**, not just at the end

## When to Use

- "This element should be hidden on mobile but it's still showing"
- "My media query styles aren't being applied"
- Debugging layout differences between desktop and mobile
- Reviewing responsive CSS for a component with multiple utility classes

## Related

- MDN Specificity: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
- MDN Cascade: https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade
- [visual-centering-absolute-children](../visual-centering-absolute-children.md) -- Related layout debugging pattern
