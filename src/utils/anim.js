/* Lazy GSAP loader — keeps GSAP + ScrollTrigger OFF the initial bundle.
   Below-the-fold sections call loadGsap() inside their own effects, so the
   ~113 KB gsap chunk only downloads when a lazy section actually mounts,
   never before Hero's first paint. The promise is cached (single download). */

let cached = null;

export function loadGsap() {
  if (!cached) {
    cached = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapMod, stMod]) => {
        const gsap = gsapMod.gsap || gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }
  return cached;
}

/* Idle prefetch — warms the GSAP chunk cache after first paint without
   blocking FCP/LCP. Safe to call once from App. */
export function prefetchGsapIdle() {
  const prefetch = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => { loadGsap().catch(() => {}); }, { timeout: 4000 });
    } else {
      setTimeout(() => { loadGsap().catch(() => {}); }, 3000);
    }
  };
  // Wait for first paint + a beat before even scheduling the prefetch.
  if (document.readyState === 'complete') {
    setTimeout(prefetch, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(prefetch, 1500), { once: true });
  }
}
