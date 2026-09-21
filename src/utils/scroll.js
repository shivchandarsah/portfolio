/**
 * Shared click-intent lock used by Navigation's IntersectionObserver to
 * suppress URL-hash updates while a non-navigational interaction (e.g. skill
 * card selection) is in flight.  Skills.jsx calls lock() / unlock() around
 * its click handler; Navigation checks isLocked() before overriding the
 * active section.
 */
const clickIntent = { locked: false, stack: null };

export function setClickIntent(id) {
  clickIntent.locked = true;
  clickIntent.stack  = id;
}

export function clearClickIntent() {
  clickIntent.locked = false;
  clickIntent.stack  = null;
}

export function isClickIntentActive() {
  return clickIntent.locked;
}

/**
 * Smooth-scroll to a page section and update the browser URL hash
 * without triggering a full page reload.
 *
 * Uses an explicit nav offset (fixed header height + breathing room)
 * instead of plain scrollIntoView, so the target section always lands
 * below the fixed navbar instead of stopping at the previous section.
 *
 * May be called from any route (e.g. a /work/:slug page): it first
 * navigates home, then scrolls once HomePage has mounted.
 *
 * @param {string} id - The DOM id of the target section (e.g. "about", "work", "hero")
 * @param {function} [navigate] - react-router navigate fn; required when the
 *   caller might be on a non-home route (Navigation/Footer always pass it).
 */

export const NAV_OFFSET = 80;

export function getScrollTopForId(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  // Hero starts at the very top of the page, so no offset needed
  if (id === 'hero') return 0;
  return Math.max(0, top - NAV_OFFSET);
}

export function scrollToSection(id, navigate) {
  if (typeof window === 'undefined') return;

  /* Cross-route call (e.g. "Back to Projects" from /work/:slug): go home
     first, then scroll once HomePage has mounted. A listener-free poll
     keeps this util dependency-free. */
  if (window.location.pathname !== '/') {
    if (navigate) navigate(`/#${id}`);
    else window.location.assign(`/#${id}`);
    const poll = setInterval(() => {
      const top = getScrollTopForId(id);
      if (top !== null) {
        clearInterval(poll);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
    setTimeout(() => clearInterval(poll), 2000);
    return;
  }

  // Update the URL: "hero" maps to the clean root "/", everything else uses a hash
  const path = id === 'hero' ? '/' : `#${id}`;

  if (history.pushState) {
    history.pushState(null, '', path);
  } else {
    // Fallback for very old browsers without the History API
    window.location.hash = path;
  }

  // Smooth-scroll to the target element with nav offset
  const targetTop = getScrollTopForId(id);
  if (targetTop !== null) {
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
}
