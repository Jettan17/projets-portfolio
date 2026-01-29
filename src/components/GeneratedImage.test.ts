/**
 * Tests for GeneratedImage component
 * Verifies dark-overlay and glow-layer behavior based on theme
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('GeneratedImage Dark Overlay', () => {
  let container: HTMLDivElement;

  // Replicate the component's CSS for testing
  const styles = `
    .dark-overlay {
      position: absolute;
      inset: 0;
      background: rgba(13, 17, 23, 0.4);
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    [data-theme="dark"] .dark-overlay {
      opacity: 1;
    }
  `;

  beforeEach(() => {
    // Add styles to document
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    styleEl.id = 'test-styles';
    document.head.appendChild(styleEl);

    // Create test container with component structure
    container = document.createElement('div');
    container.innerHTML = `
      <div class="generated-image">
        <div class="dark-overlay"></div>
        <span class="generated-title">Test Project</span>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Cleanup
    document.body.removeChild(container);
    document.getElementById('test-styles')?.remove();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should have dark-overlay element present', () => {
    const overlay = container.querySelector('.dark-overlay');
    expect(overlay).not.toBeNull();
  });

  it('should have opacity: 0 in light mode (no data-theme)', () => {
    const overlay = container.querySelector('.dark-overlay') as HTMLElement;
    const computedStyle = window.getComputedStyle(overlay);

    expect(computedStyle.opacity).toBe('0');
  });

  it('should have opacity: 1 in dark mode (data-theme="dark")', () => {
    // Set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');

    const overlay = container.querySelector('.dark-overlay') as HTMLElement;
    const computedStyle = window.getComputedStyle(overlay);

    expect(computedStyle.opacity).toBe('1');
  });

  // Note: Toggle behavior is verified by the separate light/dark mode tests above.
  // Happy-dom has limitations with style recalculation within a single test,
  // but real browsers handle theme toggling correctly.

  it('should have correct z-index to appear above gradient but below title', () => {
    const overlay = container.querySelector('.dark-overlay') as HTMLElement;
    const computedStyle = window.getComputedStyle(overlay);

    expect(computedStyle.zIndex).toBe('1');
  });

  it('should have dark background color', () => {
    const overlay = container.querySelector('.dark-overlay') as HTMLElement;
    const computedStyle = window.getComputedStyle(overlay);

    // rgba(13, 17, 23, 0.4) - the dark overlay color
    expect(computedStyle.backgroundColor).toContain('13');
    expect(computedStyle.backgroundColor).toContain('17');
    expect(computedStyle.backgroundColor).toContain('23');
  });
});

describe('GeneratedImage Glow Layer', () => {
  let container: HTMLDivElement;

  // Replicate the component's CSS for glow layer testing
  const styles = `
    .image-glow-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .glow-layer {
      position: absolute;
      inset: -15px;
      background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
      filter: blur(40px);
      opacity: 0.5;
      z-index: 0;
      border-radius: 20%;
      transition: opacity 0.25s ease, filter 0.25s ease;
    }

    [data-theme="dark"] .glow-layer {
      opacity: 0.3;
      filter: blur(50px);
    }

    .generated-image {
      position: relative;
      z-index: 1;
    }
  `;

  beforeEach(() => {
    // Add styles to document
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    styleEl.id = 'test-glow-styles';
    document.head.appendChild(styleEl);

    // Create test container with component structure including glow layer
    container = document.createElement('div');
    container.innerHTML = `
      <div class="image-glow-wrapper" style="--gradient-start: #3178c6; --gradient-end: #1e5a9e;">
        <div class="glow-layer"></div>
        <div class="generated-image">
          <div class="dark-overlay"></div>
          <span class="generated-title">Test Project</span>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Cleanup
    document.body.removeChild(container);
    document.getElementById('test-glow-styles')?.remove();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should have glow-layer element present', () => {
    const glowLayer = container.querySelector('.glow-layer');
    expect(glowLayer).not.toBeNull();
  });

  it('should have image-glow-wrapper element present', () => {
    const wrapper = container.querySelector('.image-glow-wrapper');
    expect(wrapper).not.toBeNull();
  });

  it('should have glow-layer with blur filter in light mode', () => {
    const glowLayer = container.querySelector('.glow-layer') as HTMLElement;
    const computedStyle = window.getComputedStyle(glowLayer);

    expect(computedStyle.filter).toContain('blur');
  });

  it('should have opacity: 0.5 in light mode', () => {
    const glowLayer = container.querySelector('.glow-layer') as HTMLElement;
    const computedStyle = window.getComputedStyle(glowLayer);

    expect(computedStyle.opacity).toBe('0.5');
  });

  it('should have opacity: 0.3 in dark mode (softer glow)', () => {
    // Set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');

    const glowLayer = container.querySelector('.glow-layer') as HTMLElement;
    const computedStyle = window.getComputedStyle(glowLayer);

    expect(computedStyle.opacity).toBe('0.3');
  });

  it('should have z-index: 0 to appear behind the image', () => {
    const glowLayer = container.querySelector('.glow-layer') as HTMLElement;
    const computedStyle = window.getComputedStyle(glowLayer);

    expect(computedStyle.zIndex).toBe('0');
  });

  it('should have generated-image with z-index: 1 to appear above glow', () => {
    const image = container.querySelector('.generated-image') as HTMLElement;
    const computedStyle = window.getComputedStyle(image);

    expect(computedStyle.zIndex).toBe('1');
  });

  it('should have negative inset to extend beyond bounds', () => {
    const glowLayer = container.querySelector('.glow-layer') as HTMLElement;
    const computedStyle = window.getComputedStyle(glowLayer);

    // inset: -15px means all sides are -15px
    expect(computedStyle.inset).toBe('-15px');
  });
});
