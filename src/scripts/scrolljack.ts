/**
 * ScrollJack Controller
 * Uses GSAP ScrollTrigger for TRUE scrolljacking with pinned sections
 *
 * Features:
 * - Screen locking (pin: true) - viewport stays fixed while content transforms
 * - Horizontal scrolling - cards slide left/right tied to vertical scroll
 * - Content rising from below - elements animate into view while pinned
 * - Scrub animations - animation progress tied to scroll position
 * - Mobile-friendly - disables complex effects on small screens
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
gsap.registerPlugin(ScrollTrigger);

export function initScrollJack() {
  // Wait for DOM to be ready
  if (typeof window === 'undefined') return;

  // Kill any existing ScrollTriggers (for hot reload)
  ScrollTrigger.getAll().forEach(t => t.kill());

  // Mark that JS is running - must be before GSAP setup for correct initial states
  document.body.classList.add('js-animate');

  // Mobile detection
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // =========================================================================
  // SECTION 0: LogoSplash - FIRST THING USERS SEE, fades out on scroll
  // =========================================================================
  const logoSection = document.querySelector('.logo-splash');
  if (logoSection) {
    const logoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.logo-splash',
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=80%', // Pin for 80vh of scroll
        scrub: 0.5,
        anticipatePin: 1,
      }
    });

    // Logo starts visible, fades out as user scrolls
    logoTl
      .to('.logo-projets', {
        opacity: 0,
        scale: 0.9,
        y: -30,
        duration: 0.6,
      }, 0.3)
      .to('.logo-tagline', {
        opacity: 0,
        y: -20,
        duration: 0.4,
      }, 0.2)
      .to('.logo-scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.3,
      }, 0);
  }

  // =========================================================================
  // SECTION 1: IntroSplash - PINNED, content animates in
  // =========================================================================
  const introSection = document.querySelector('.intro-splash');
  if (introSection) {
    // Create a timeline that scrubs with scroll while section is pinned
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.intro-splash',
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=100%', // Pin for 100vh of scroll
        scrub: 0.5,
        anticipatePin: 1,
      }
    });

    // Animate elements in sequence as user scrolls
    introTl
      .to('.intro-greeting', {
        opacity: 1,
        y: 0,
        duration: 0.2,
      }, 0)
      .to('.line-1', {
        opacity: 1,
        y: 0,
        duration: 0.2,
      }, 0.15)
      .to('.line-2', {
        opacity: 1,
        y: 0,
        duration: 0.2,
      }, 0.3)
      .to('.line-3', {
        opacity: 1,
        y: 0,
        duration: 0.2,
      }, 0.45)
      .to('.intro-splash .scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 0.15,
      }, 0.6);
  }

  // =========================================================================
  // SECTION 2: WhatIDo - HORIZONTAL SCROLL (desktop) or FADE IN (mobile)
  // =========================================================================
  const whatSection = document.querySelector('.what-i-do');
  if (whatSection) {
    const cards = gsap.utils.toArray('.focus-card');
    const track = document.querySelector('.focus-cards-track');

    // Title fades in for both mobile and desktop
    gsap.to('.what-title', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.what-i-do',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    if (isMobile) {
      // MOBILE: Trigger all cards together when section enters viewport
      // Use the section as trigger, not individual cards, to prevent off-screen issues
      gsap.to('.focus-card', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.what-i-do',
          start: 'top 95%', // Trigger earlier
          toggleActions: 'play none none none',
        }
      });
    } else if (cards.length > 0 && track) {
      // DESKTOP: Horizontal scroll with pinning
      const cardWidth = 350;
      const gap = 32; // var(--space-8) = 2rem = 32px
      const totalWidth = (cardWidth + gap) * (cards.length - 1);

      // Pin section and scroll cards horizontally
      gsap.to('.focus-cards-track', {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: '.what-i-do',
          pin: true,
          start: 'top top',
          end: `+=${totalWidth + 200}`,
          scrub: 1,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (cards.length - 1),
            duration: 0.3,
            ease: 'power1.inOut',
          },
        }
      });

      // Fade in ALL cards together when section enters viewport
      gsap.to('.focus-card', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.what-i-do',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    }
  }

  // =========================================================================
  // SECTION 3: MyApproach - PINNED with zoom/rise from below
  // =========================================================================
  const approachSection = document.querySelector('.my-approach');
  if (approachSection) {
    if (isMobile) {
      // MOBILE: Simple fade-in, no pin
      gsap.to('.quote-block', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.my-approach',
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });

      gsap.to('.approach-description', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.approach-description',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    } else {
      // DESKTOP: Pinned zoom/rise effect
      const approachTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.my-approach',
          pin: true,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          anticipatePin: 1,
        }
      });

      approachTl
        .to('.quote-block', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
        }, 0)
        .to('.approach-description', {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, 0.4);
    }
  }

  // =========================================================================
  // SECTION 4: Hero - Light parallax (no hard pin for smooth transition)
  // =========================================================================
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    // Fade in content
    gsap.to('.hero-content', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });

    // Parallax effect on blobs - they move slower creating depth
    if (!isMobile) {
      gsap.to('.hero .blob', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }
  }

  // =========================================================================
  // SECTION 5: ScrollTransition - Simple fade (bridge to normal content)
  // =========================================================================
  const transitionSection = document.querySelector('.scroll-transition');
  if (transitionSection) {
    gsap.to('.transition-content', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.scroll-transition',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  // =========================================================================
  // NORMAL CONTENT SECTIONS - Standard fade-in animations
  // =========================================================================

  // Section headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.to(header as Element, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: header as Element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Project cards - trigger earlier for faster perceived loading
  if (document.querySelector('.project-card')) {
    gsap.to('.project-card', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.featured-projets .project-grid',
        start: 'top 95%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Skills grid
  if (document.querySelector('.skill-badge')) {
    gsap.to('.skill-badge', {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      stagger: 0.05,
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  // CTA section
  if (document.querySelector('.cta-content')) {
    gsap.to('.cta-content', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Refresh ScrollTrigger after setup
  ScrollTrigger.refresh();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollJack);
  } else {
    // Use requestAnimationFrame for smoother initialization
    requestAnimationFrame(initScrollJack);
  }
}
