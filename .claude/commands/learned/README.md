# Learned Patterns and Insights

This directory contains patterns, techniques, and insights extracted from debugging sessions and development work using the `/learn` command.

## Directory Structure

```
learned/
├── patterns/      # Reusable techniques and approaches
├── insights/      # Breakthrough discoveries (eureka moments)
└── README.md      # This index
```

## Patterns

| Pattern | Description |
|---------|-------------|
| [gsap-dynamic-elements-inherit-animation-state](patterns/gsap-dynamic-elements-inherit-animation-state.md) | Dynamically created elements inherit CSS animation hidden states - use inline styles to override |
| [vscode-extension-state-persistence](patterns/vscode-extension-state-persistence.md) | VS Code extension state must persist to settings, not just memory or flag files |
| [mobile-touch-direction-gating](patterns/mobile-touch-direction-gating.md) | Detect touch direction before activating interactive features to avoid conflicting with page scroll |
| [css-specificity-responsive-overrides](patterns/css-specificity-responsive-overrides.md) | Fix CSS specificity conflicts in responsive designs where utility classes override media query rules |

## Root-Level Patterns

| Pattern | Description |
|---------|-------------|
| [gsap-scrolltrigger-visibility-strategy](gsap-scrolltrigger-visibility-strategy.md) | Choose correct GSAP ScrollTrigger animation timing for element visibility |
| [visual-centering-absolute-children](visual-centering-absolute-children.md) | Center elements visually when children overflow with absolute positioning |
| [add-portfolio-project](add-portfolio-project.md) | Add a new project to the portfolio website |

## Insights

| Date | Insight | Summary |
|------|---------|---------|
| 2026-02-06 | [Passive Listeners and preventDefault](insights/insight-2026-02-06-passive-listeners-preventdefault.md) | Passive event listeners silently ignore `preventDefault()` -- no error thrown |
| 2026-02-02 | [Astro is:inline Scripts](insights/insight-2026-02-02-astro-is-inline-scripts.md) | Astro scripts need `is:inline` for immediate DOM-dependent execution |
| 2026-02-02 | [/design Command Behavior](insights/insight-2026-02-02-design-command-behavior.md) | /design command should consistently overwrite, use explicit flags for clarity |
| 2025-01-31 | [VS Code Fork Extension Paths](insights/insight-2025-01-31-vscode-fork-extension-paths.md) | VS Code forks store extensions in different directories |

## Usage

These patterns are automatically available as slash commands:
- `/learned:patterns:mobile-touch-direction-gating` - Touch direction detection for mobile interactions
- `/learned:patterns:css-specificity-responsive-overrides` - Debug responsive CSS specificity conflicts
- `/learned:patterns:gsap-dynamic-elements-inherit-animation-state` - Reference the dynamic element pattern
- `/learned:patterns:vscode-extension-state-persistence` - Reference the state persistence pattern

Use `/learn` to capture new patterns from your debugging sessions.

## Related Patterns

The GSAP patterns work together:
1. **gsap-scrolltrigger-visibility-strategy** - Choosing the RIGHT animation strategy (toggle vs progress-based)
2. **gsap-dynamic-elements-inherit-animation-state** - Handling dynamically created elements AFTER animation setup

The mobile UX patterns work together:
1. **mobile-touch-direction-gating** - Detecting horizontal vs vertical intent before activating features
2. **css-specificity-responsive-overrides** - Ensuring responsive styles actually apply at each breakpoint
3. **Passive listeners insight** - Understanding why `preventDefault()` fails silently on touch events
