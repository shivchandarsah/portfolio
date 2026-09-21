import { useEffect, useState, lazy, Suspense, Component } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation       from './components/Navigation';
import Hero             from './components/Hero';
import { prefetchGsapIdle } from './utils/anim';

/* Deferred below-the-fold sections + heavy background: code-split so the
   initial bundle only contains nav + hero (guarantees immediate FCP). */
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));
const About            = lazy(() => import('./components/About'));
const Education        = lazy(() => import('./components/Education'));
const Work             = lazy(() => import('./components/Work'));
const Skills          = lazy(() => import('./components/Skills'));
const Contact          = lazy(() => import('./components/Contact'));
const Footer           = lazy(() => import('./components/Footer'));

/* Lazy-load Engineering OS, keeps initial bundle lean */
const EngineeringOS = lazy(() => import('./engineering-os/EngineeringOS.jsx'));

/* Dedicated project page — lazy so it never touches the initial bundle */
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <div className="text-center px-6">
            <p className="font-display font-bold text-4xl text-text-primary mb-4">Something went wrong</p>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">An unexpected error occurred. Please refresh.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  /* Disable browser's native scroll restoration — we manage it ourselves */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const id = hash.replace('#', '');

    /* The target section may not be in the DOM yet because below-the-fold
       sections are lazy-loaded inside <Suspense>. Poll until the element
       appears (max ~1.5 s) then smooth-scroll to it with the nav offset. */
    let attempts = 0;
    const MAX   = 30;   // 30 × 50 ms = 1500 ms max wait
    const DELAY = 50;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: id === 'hero' ? 0 : Math.max(0, top - 80), behavior: 'smooth' });
        return;
      }
      attempts++;
      if (attempts < MAX) setTimeout(tryScroll, DELAY);
    };

    requestAnimationFrame(tryScroll);
  }, [pathname, hash]);

  return null;
}

/* ── Single-page: all sections live on one page; nav links scroll to them.
      Hero renders synchronously for immediate FCP; below-the-fold sections
      are code-split and hydrate right after first paint. ── */
function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Education />
        <Work />
        <Skills />
        <Contact />
      </Suspense>
    </main>
  );
}

function App() {
  const [engOSOpen, setEngOSOpen] = useState(false);

  /* Idle-warm the GSAP chunk cache only AFTER first paint (never on the
     critical path). Sections import GSAP themselves when they mount; this
     prefetch just means the download is likely done by scroll time. */
  useEffect(() => {
    prefetchGsapIdle();
  }, []);

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        {/* Decorative background loads after first paint; null fallback keeps FCP instant */}
        <Suspense fallback={null}>
          <ThreeBackground />
        </Suspense>
      </ErrorBoundary>
      <header>
        <Navigation onOpenEngOS={() => setEngOSOpen(true)} />
      </header>
      <Routes>
        <Route path="/work/:slug" element={
          <Suspense fallback={null}>
            <ProjectDetails />
          </Suspense>
        } />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {/* Footer is below the fold, streamed in after the hero paints */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Engineering OS, fullscreen overlay, lazy loaded */}
      {engOSOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent animate-spin" />
              <p className="text-xs text-text-muted font-mono">Loading Engineering OS…</p>
            </div>
          </div>
        }>
          <EngineeringOS onClose={() => setEngOSOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default App;
