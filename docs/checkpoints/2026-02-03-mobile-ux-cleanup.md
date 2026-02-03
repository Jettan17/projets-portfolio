# Checkpoint: Mobile UX Cleanup + ScrollJack Fixes

Created: 2026-02-03
Branch: main

## Summary

Major mobile UX improvements and scrolljack animation fixes:

1. **Mobile blob styles** - Applied smaller, dimmer blobs positioned at edges for Hero and IntroSplash sections
2. **Touch support for hidden words** - Added touchstart/touchmove/touchend handlers for cursor spotlight
3. **Horizontal scroll on mobile** - WhatIDo section now scrolls horizontally on both mobile and desktop
4. **MyApproach scrolljack fix** - Unified mobile/desktop animation behavior with pinned timeline
5. **Content cleanup** - Removed various text elements per user requests:
   - Removed About page links (kept file for future)
   - Removed "I'm Jethro" from IntroSplash
   - Changed "What I Build" to "What I've Built"
   - Updated platform cycling list: ['the web', 'mobile', 'desktop', 'fun', 'myself']
   - Added mobile/desktop text switching for "cursor/finger" instruction

## Files Changed

### Components
- `Hero.astro` - Mobile blob styles (smaller, dimmer, edge-positioned)
- `IntroSplash.astro` - Mobile blob styles, removed name line, updated platforms
- `WhatIDo.astro` - Title change, mobile horizontal layout
- `MyApproach.astro` - Desktop/mobile text switching
- `Header.astro` - Removed About link
- `Footer.astro` - Removed About link

### Scripts
- `scrolljack.ts` - Unified mobile/desktop horizontal scroll for WhatIDo, fixed MyApproach animation
- `BaseLayout.astro` - Added touch event handlers for cursor spotlight

### Styles
- `global.css` - Removed unused .line-3 hidden state

### Pages
- `index.astro` - Removed description text, featuredWords, ctaWords
- `projets/index.astro` - Updated projectWords list

## Key Technical Changes

### Mobile Blob Pattern
```css
@media (max-width: 768px) {
  .blob { opacity: 0.4; }
  .blob-1 { top: 5%; right: -10%; width: 200px; height: 200px; }
  /* etc... */
}
```

### Touch Support for Hidden Words
```javascript
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd);
```

### Unified Horizontal Scroll
```javascript
// BOTH MOBILE & DESKTOP: Horizontal scroll with pinning
const cardWidth = isMobile ? 200 : 280;
const gap = isMobile ? 16 : 32;
```

## Notes

- All scrolljack sections now work consistently on both mobile and desktop
- Touch-based cursor spotlight enables hidden word discovery on mobile
- Blob backgrounds no longer overwhelm content on small screens
