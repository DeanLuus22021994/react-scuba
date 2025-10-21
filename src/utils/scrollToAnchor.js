/**
 * Scroll utilities for smooth anchor navigation
 */

/**
 * Smoothly scroll to an element with optional offset
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset in pixels (default: 80 for fixed header)
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // Update URL without triggering navigation
  if (window.history.pushState) {
    window.history.pushState(null, null, `#${elementId}`);
  }

  // Focus the element for accessibility
  element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
};

/**
 * Handle anchor clicks with smooth scrolling
 * @param {Event} event - Click event
 * @param {string} targetId - ID of target element
 */
export const handleAnchorClick = (event, targetId) => {
  event.preventDefault();
  scrollToElement(targetId);
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Percentage of element that should be visible (0-1)
 * @returns {boolean}
 */
export const isInViewport = (element, threshold = 0.5) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView =
    rect.top <= windowHeight && rect.top + rect.height * threshold >= 0;
  const horInView =
    rect.left <= windowWidth && rect.left + rect.width * threshold >= 0;

  return vertInView && horInView;
};

/**
 * Intersection Observer for scroll reveal animations
 * @param {string} selector - CSS selector for elements to observe
 * @param {Function} callback - Optional callback function
 * @param {Object} options - IntersectionObserver options
 */
export const observeScrollReveal = (
  selector = ".reveal-on-scroll",
  callback = null,
  options = {}
) => {
  const defaultOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
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
 * @returns {Array} Array of anchor IDs
 */
export const getSectionAnchors = () => {
  const sections = document.querySelectorAll("[id]");
  return Array.from(sections)
    .filter((section) => section.id && !section.id.startsWith("headlessui"))
    .map((section) => section.id);
};

/**
 * Get the currently active section based on scroll position
 * @param {Array} sectionIds - Array of section IDs to check
 * @returns {string|null} ID of active section
 */
export const getActiveSection = (sectionIds) => {
  const scrollPosition = window.scrollY + 100; // Offset for fixed header

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const section = document.getElementById(sectionIds[i]);
    if (section && section.offsetTop <= scrollPosition) {
      return sectionIds[i];
    }
  }

  return null;
};

/**
 * Handle hash change and scroll to anchor on page load
 */
export const handleHashNavigation = () => {
  const hash = window.location.hash;
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
export const initScrollReveal = () => {
  // Observe elements with reveal class
  observeScrollReveal(".reveal-on-scroll");

  // Handle hash navigation on load
  handleHashNavigation();

  // Handle hash changes
  window.addEventListener("hashchange", handleHashNavigation);
};

/**
 * Create a "back to top" button
 * @param {string} buttonId - ID for the back to top button
 * @param {number} showAfter - Scroll distance in pixels before showing button
 */
export const initBackToTop = (buttonId = "back-to-top", showAfter = 300) => {
  const button = document.getElementById(buttonId);
  if (!button) return;

  const handleScroll = () => {
    if (window.pageYOffset > showAfter) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScroll);
  button.addEventListener("click", scrollToTop);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    button.removeEventListener("click", scrollToTop);
  };
};
