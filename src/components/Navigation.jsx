import { useState, useEffect, useRef } from 'react';
import { scrollToSection, setClickIntent, clearClickIntent, isClickIntentActive } from '../utils/scroll';

const brandName = 'Shivchandar';

const navLinks = [
  { id: 'about',     label: 'About'     },
  { id: 'education', label: 'Education' },
  { id: 'work',      label: 'Work'      },
  { id: 'skill',     label: 'Skills'    },
  { id: 'contact',   label: 'Contact'   },
];

export default function Navigation({ onOpenEngOS }) {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection]   = useState('hero');
  const navRef = useRef(null);
  const clickIntentRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Sole active-section tracker: IntersectionObserver fires only when
     a section's visibility actually changes (no per-scroll-tick layout).
     Removed the scroll-handler getBoundingClientRect() loop that forced
     reflow on every scroll event. */
  useEffect(() => {
    const ids = ['hero', 'about', 'education', 'work', 'skill', 'contact'];

    const setupObserver = () => {
      const sections = {};
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) sections[id] = el;
      });

      // Wait until ALL sections are in the DOM before setting up the observer
      if (Object.keys(sections).length < ids.length) return false;

      // Disconnect previous observer if it exists
      if (window._sectionObserver) {
        window._sectionObserver.disconnect();
      }

      const obs = new IntersectionObserver(
        (entries) => {
          if (clickIntentRef.current) return; // nav click in flight — skip
          if (isClickIntentActive()) return;    // skill-card / non-nav interaction in flight
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            const newId = visible[0].target.id;
            setActiveSection(newId);
          }
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      );
      Object.values(sections).forEach((el) => obs.observe(el));
      window._sectionObserver = obs;
      return true;
    };

    // Try to set up immediately
    const ready = setupObserver();

    // If sections aren't all loaded yet (lazy-loaded), poll until they are
    if (!ready) {
      const poll = setInterval(() => {
        if (setupObserver()) clearInterval(poll);
      }, 200);
      return () => clearInterval(poll);
    }

    return () => {
      if (window._sectionObserver) {
        window._sectionObserver.disconnect();
        window._sectionObserver = null;
      }
    };
  }, []);

  /* URL bar stays in sync with the visible section. Fires only when
     activeSection actually changes (not on every scroll tick), so there
     is no per-tick layout cost. */
  useEffect(() => {
    const newPath = activeSection === 'hero' ? '/' : `#${activeSection}`;
    const currentHash = window.location.hash || '/';
    const currentPath = currentHash === '' ? '/' : currentHash;
    if (newPath !== currentPath && newPath !== window.location.hash) {
      history.replaceState(null, '', newPath);
    }
  }, [activeSection]);

  /* CSS-only entrance (no JS paint gate): the .nav-enter animation runs in
     the stylesheet, so the bar is visible even if JS is slow or the tab is
     backgrounded. Removed the GSAP opacity tween that could stick at 0. */

  /* Smooth-scroll to a section, update the URL hash, highlight the active
     nav link immediately, and let the on-scroll handler keep it accurate as
     the page scrolls. The IntersectionObserver takes over
     once scrolling settles). */
  const scrollTo = (id) => {
    setClickIntent(id);
    scrollToSection(id);
    setActiveSection(id);
    /* Lock out IO + scroll-event overrides during smooth-scroll animation.
       1500 ms covers the longest cross-page scroll on most devices. */
    clickIntentRef.current = id;
    setTimeout(() => {
      clickIntentRef.current = null;
      clearClickIntent();
    }, 1500);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border backdrop-blur-xl py-0'
          : 'bg-transparent py-2'
      }`}
      style={scrolled ? { backgroundColor: 'rgba(10, 22, 40, 0.88)' } : {}}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-20 md:h-16">

          {/* Logo, scrolls back to hero */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
            className="flex items-center gap-0.5 group"
            aria-label="Go to top"
          >
            <span className="font-display font-bold text-xl text-text-primary group-hover:text-accent transition-colors duration-200 tracking-tight">
              {brandName}
            </span>
            <span className="text-accent font-bold text-2xl leading-none ml-0.5">.</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Engineering OS launcher */}
            <button
              onClick={onOpenEngOS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:-translate-y-px"
              style={{
                backgroundColor: 'rgba(94, 234, 212, 0.10)',
                borderColor:     'rgba(94, 234, 212, 0.30)',
                color:           '#5eead4',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(94, 234, 212, 0.18)'; e.currentTarget.style.borderColor = 'rgba(94, 234, 212, 0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(94, 234, 212, 0.10)'; e.currentTarget.style.borderColor = 'rgba(94, 234, 212, 0.30)'; }}
              aria-label="Open Engineering OS"
            >
              <span className="text-[11px]">⚙</span>
              <span>Eng OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" aria-hidden="true" />
            </button>

            <a
              href="/Shivchandar_Kumar_Sah_Resume_Updated.pdf"
              download
              className="btn-ghost text-sm"
              aria-label="Download resume"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Resume
            </a>
            <button onClick={() => scrollTo('contact')} className="btn-primary text-sm px-5 py-2">
              Hire Me
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-text-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-[min(600px,85vh)] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div className="flex flex-col gap-1.5 pt-4 px-2 border-t border-border"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
                className={`px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? 'text-accent bg-accent-dim'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 pb-1 flex flex-col gap-3 px-1">
              <button
                onClick={() => { onOpenEngOS(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold border transition-all"
                style={{ backgroundColor: 'rgba(94, 234, 212, 0.10)', borderColor: 'rgba(94, 234, 212, 0.30)', color: '#5eead4' }}
                aria-label="Open Engineering OS"
              >
                <span>⚙</span>
                <span>Engineering OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              </button>
              <a href="/Shivchandar_Kumar_Sah_Resume_Updated.pdf" download className="btn-secondary w-full justify-center py-3.5 text-sm">
                Download Resume
              </a>
              <button onClick={() => scrollTo('contact')} className="btn-primary w-full justify-center py-3.5 text-sm">
                Hire Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
