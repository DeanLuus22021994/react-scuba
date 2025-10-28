/**
 * Scroll utilities for smooth anchor navigation
 */

/**
 * Smoothly scroll to an element with optional offset
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset in pixels (default: 80 for fixed header)
 */
export const scrollToElement = (elementId: string, offset = 80): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  // Update URL without triggering navigation
  if (window.history.pushState) {
    window.history.pushState({}, '', `#${elementId}`);
  }

  // Focus the element for accessibility
  element.setAttribute('tabindex', '-1');
  element.focus({ preventScroll: true });
};

/**
 * Handle anchor clicks with smooth scrolling
 * @param event - Click event
 * @param targetId - ID of target element
 */
export const handleAnchorClick = (event: Event, targetId: string): void => {
  event.preventDefault();
  scrollToElement(targetId);
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Check if element is in viewport
 * @param element - Element to check
 * @param threshold - Percentage of element that should be visible (0-1)
 * @returns True if element is in viewport
 */
export const isInViewport = (element: HTMLElement | null, threshold = 0.5): boolean => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height * threshold >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width * threshold >= 0;

  return vertInView && horInView;
};

/**
 * Intersection Observer for scroll reveal animations
 * @param selector - CSS selector for elements to observe
 * @param callback - Optional callback function
 * @param options - IntersectionObserver options
 */
export const observeScrollReveal = (
  selector = '.reveal-on-scroll',
  callback: ((element: Element) => void) | null = null,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px',
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (callback) callback(entry.target);
        // Optionally unobserve after revealing
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));

  return observer;
};

/**
 * Get all section anchors on the page
 * @returns Array of anchor IDs
 */
export const getSectionAnchors = (): string[] => {
  const sections = document.querySelectorAll<HTMLElement>('[id]');
  return Array.from(sections)
    .filter((section) => section.id && !section.id.startsWith('headlessui'))
    .map((section) => section.id);
};

/**
 * Get the currently active section based on scroll position
 * @param sectionIds - Array of section IDs to check
 * @returns ID of active section
 */
export const getActiveSection = (sectionIds: string[]): string | null => {
  const scrollPosition = window.scrollY + 100; // Offset for fixed header

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const section = document.getElementById(sectionIds[i]!);
    if (section && section.offsetTop <= scrollPosition) {
      return sectionIds[i]!;
    }
  }

  return null;
};

/**
 * Handle hash change and scroll to anchor on page load
 */
export const handleHashNavigation = (): void => {
  const { hash } = window.location;
  if (hash) {
    const elementId = hash.substring(1);
    // Small delay to ensure page is fully loaded
    setTimeout(() => {
      scrollToElement(elementId);
    }, 100);
  }
};

/**
 * Initialize scroll reveal animations on page
 */
export const initScrollReveal = (): void => {
  // Observe elements with reveal class
  observeScrollReveal('.reveal-on-scroll');

  // Handle hash navigation on load
  handleHashNavigation();

  // Handle hash changes
  window.addEventListener('hashchange', handleHashNavigation);
};

/**
 * Create a "back to top" button
 * @param buttonId - ID for the back to top button
 * @param showAfter - Scroll distance in pixels before showing button
 * @returns Cleanup function
 */
export const initBackToTop = (buttonId = 'back-to-top', showAfter = 300): (() => void) | void => {
  const button = document.getElementById(buttonId);
  if (!button) return;

  const handleScroll = (): void => {
    if (window.pageYOffset > showAfter) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  button.addEventListener('click', scrollToTop);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    button.removeEventListener('click', scrollToTop);
  };
};
