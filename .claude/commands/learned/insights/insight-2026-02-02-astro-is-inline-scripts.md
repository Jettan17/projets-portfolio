---
description: Astro scripts need is:inline for immediate DOM-dependent execution
---

# Insight: Astro Script Bundling Breaks Immediate DOM Access

**Context:** A cursor spotlight effect script was not initializing on page load in an Astro project. The script created a spotlight element that followed the mouse cursor, but nothing appeared on screen despite no console errors.

**Discovery:** Astro bundles and defers `<script>` tags by default, which means:
1. Scripts are processed by Vite and bundled together
2. Execution timing changes - scripts may run before or after expected
3. DOM-dependent initialization can fail silently

The fix was adding the `is:inline` directive:

```astro
<!-- Before: Script bundled, timing unpredictable -->
<script>
  const spotlight = document.createElement('div');
  document.body.appendChild(spotlight);
  // Never appeared on screen
</script>

<!-- After: Script runs immediately where placed in HTML -->
<script is:inline>
  const spotlight = document.createElement('div');
  document.body.appendChild(spotlight);
  // Works correctly
</script>
```

**Implication:** When writing Astro scripts that:
- Create DOM elements immediately on page load
- Need to run in a specific order relative to other scripts
- Depend on global variables from other inline scripts
- Initialize visual effects that must appear instantly

Always use `is:inline` to prevent bundling interference. The tradeoff is losing Vite processing (no TypeScript, no imports), but for simple initialization scripts, this is the correct choice.

**Related Astro Directives:**
- `is:inline` - No processing, runs immediately
- `is:global` - Styles apply globally (for CSS)
- `define:vars` - Pass server variables to client scripts

**Captured:** 2026-02-02
