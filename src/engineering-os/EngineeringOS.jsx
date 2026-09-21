import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { PROJECTS, DECISIONS, CHALLENGES } from './data.js';
import { AppIcon, ArrowRightIcon, ArrowUpDownIcon, ChevronLeftIcon, CloseIcon, EnterIcon, SearchIcon } from '../components/icons';

/* Lazy-load heavy modules to keep initial portfolio load fast */
const ArchitectureExplorer = lazy(() => import('./ArchitectureExplorer.jsx'));
const ProjectXRay          = lazy(() => import('./ProjectXRay.jsx'));
const EngineeringLab       = lazy(() => import('./EngineeringLab.jsx'));
const KnowledgeGraph       = lazy(() => import('./KnowledgeGraph.jsx'));
const TechnicalChallenges  = lazy(() => import('./TechnicalChallenges.jsx'));
const DecisionJournal      = lazy(() => import('./DecisionJournal.jsx'));

/* ── Module registry ─────────────────────────────────────────── */
const MODULES = [
  {
    id:          'architecture',
    title:       'Architecture Explorer',
    tagline:     'See how each application is structured, layer by layer.',
    icon:        'layers',
    color:       '#3b82f6',
    badge:       `${PROJECTS.length} projects`,
    description: 'Interactive architecture diagrams with animated connection lines. Click any node for technical details.',
    component:   ArchitectureExplorer,
  },
  {
    id:          'xray',
    title:       'Project X-Ray',
    tagline:     'Decompose every project from UI down to the database.',
    icon:        'inspect',
    color:       '#10b981',
    badge:       `${PROJECTS.length} projects`,
    description: 'Peel back each system layer, frontend, API, auth, services, database, and understand the engineering decisions at each level.',
    component:   ProjectXRay,
  },
  {
    id:          'lab',
    title:       'Engineering Lab',
    tagline:     'Interact with live simulations of real engineering flows.',
    icon:        'flask',
    color:       '#a78bfa',
    badge:       '4 experiments',
    description: 'Auth flow visualiser, API request pipeline, database operation tracer, and rate limiter simulator.',
    component:   EngineeringLab,
  },
  {
    id:          'graph',
    title:       'Knowledge Graph',
    tagline:     'Explore how projects and technologies interconnect.',
    icon:        'network',
    color:       '#f59e0b',
    badge:       `${PROJECTS.length + 11} nodes`,
    description: 'Drag-and-drop force graph. Click a project to highlight its tech. Click a technology to see every project using it.',
    component:   KnowledgeGraph,
  },
  {
    id:          'challenges',
    title:       'Technical Challenges',
    tagline:     'Test engineering knowledge across real-world scenarios.',
    icon:        'target',
    color:       '#ef4444',
    badge:       `${CHALLENGES.length} challenges`,
    description: 'Security, architecture, database, and backend debugging challenges with XP scoring and detailed explanations.',
    component:   TechnicalChallenges,
  },
  {
    id:          'decisions',
    title:       'Decision Journal',
    tagline:     'The reasoning behind every major technical choice.',
    icon:        'book',
    color:       '#06b6d4',
    badge:       `${DECISIONS.length} decisions`,
    description: 'Why Socket.IO? Why MySQL vs MongoDB? Why JWT? Read the real engineering thinking behind each decision.',
    component:   DecisionJournal,
  },
];

/* ── Search index ────────────────────────────────────────────── */
const SEARCH_INDEX = [
  ...MODULES.map(m  => ({ type: 'Module',    label: m.title,       sub: m.tagline,      action: m.id,    color: m.color })),
  ...PROJECTS.map(p => ({ type: 'Project',   label: p.title,       sub: p.tagline,      action: 'xray',  color: p.color })),
  ...DECISIONS.map(d=> ({ type: 'Decision',  label: d.title,       sub: d.project,      action: 'decisions', color: '#06b6d4' })),
  { type: 'Tech', label: 'React.js',   sub: 'Frontend framework',   action: 'graph', color: '#61dafb' },
  { type: 'Tech', label: 'Vue.js',     sub: 'Progressive framework', action: 'graph', color: '#42b883' },
  { type: 'Tech', label: 'Node.js',    sub: 'JavaScript runtime',    action: 'graph', color: '#84cc16' },
  { type: 'Tech', label: 'MongoDB',    sub: 'Document database',      action: 'graph', color: '#47a248' },
  { type: 'Tech', label: 'MySQL',      sub: 'Relational database',    action: 'graph', color: '#4479a1' },
  { type: 'Tech', label: 'Socket.IO',  sub: 'Real-time engine',       action: 'graph', color: '#a78bfa' },
  { type: 'Tech', label: 'JWT',        sub: 'Authentication',         action: 'lab',   color: '#f59e0b' },
  { type: 'Tech', label: 'WebRTC',     sub: 'Peer-to-peer video',     action: 'graph', color: '#f55f00' },
];

/* ── Module loading fallback ─────────────────────────────────── */
function ModuleLoader() {
  return (
    <div className="flex-1 flex items-center justify-center" aria-label="Loading module">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <p className="text-xs text-text-muted">Loading module…</p>
      </div>
    </div>
  );
}

/* ── Command Palette ─────────────────────────────────────────── */
function CommandPalette({ onNavigate, onClose }) {
  const [query,   setQuery]   = useState('');
  const inputRef              = useRef(null);
  const [cursor,  setCursor]  = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.trim()
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : MODULES.map(m => ({ type: 'Module', label: m.title, sub: m.tagline, action: m.id, color: m.color }));

  /* Clamp the highlight cursor to the current result list — derived during
     render instead of resetting cursor via setState-in-effect on query change. */
  const safeCursor = Math.min(cursor, Math.max(results.length - 1, 0));

  const go = useCallback((item) => {
    onNavigate(item.action);
    onClose();
  }, [onNavigate, onClose]);

  const onQueryChange = (e) => {
    // Reset the highlight with the query change (same event) so no
    // setState-in-effect is needed to keep the cursor in range.
    setCursor(0);
    setQuery(e.target.value);
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && results[safeCursor]) go(results[safeCursor]);
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.15)' }}
        onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <SearchIcon size={16} className="text-text-muted flex-shrink-0" />
          <input ref={inputRef} value={query} onChange={onQueryChange} onKeyDown={handleKey}
            placeholder="Search Engineering OS…"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-text-muted"
            aria-label="Search commands and modules"
          />
          <kbd className="text-[10px] text-text-muted font-mono px-1.5 py-0.5 rounded border border-border">Esc</kbd>
        </div>

        {/* Results */}
        <ul className="py-2 max-h-72 overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-text-muted">No results found</li>
          )}
          {results.map((item, i) => (
            <li key={i}>
              <button onClick={() => go(item)}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors"
                style={{ backgroundColor: safeCursor === i ? 'rgba(148,163,184,0.07)' : 'transparent' }}
                onMouseEnter={() => setCursor(i)}>
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.label}</p>
                  <p className="text-xs text-text-muted truncate">{item.sub}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                  {item.type}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="font-mono inline-flex items-center"><ArrowUpDownIcon size={12} /></kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="font-mono inline-flex items-center"><EnterIcon size={12} /></kbd>
            open
          </span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

/* ── Home screen ─────────────────────────────────────────────── */
function HomeScreen({ onNavigate }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="px-6 md:px-10 pt-10 pb-8 border-b border-border">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">Engineering OS · v1.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
            How I Build Software
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
            An interactive exploration of my engineering, architecture, technical decisions, live system simulations, and the reasoning behind every major choice.
          </p>
          <p className="text-text-muted text-xs mt-3">
            Press <kbd className="font-mono text-text-muted border border-border px-1 py-0.5 rounded text-[10px]">Ctrl K</kbd> to search across all modules
          </p>
        </div>
      </div>

      {/* Module grid */}
      <div className="px-6 md:px-10 py-8">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-5">Modules</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(mod => (
            <button key={mod.id} onClick={() => onNavigate(mod.id)}
              className="group text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(148,163,184,0.1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${mod.color}40`; e.currentTarget.style.boxShadow = `0 8px 32px ${mod.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
              aria-label={`Open ${mod.title}`}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ color: mod.color, backgroundColor: `${mod.color}18` }}>
                  <AppIcon name={mod.icon} size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${mod.color}12`, color: mod.color }}>
                  {mod.badge}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mb-1 leading-snug">{mod.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4">{mod.description}</p>

              <div className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                style={{ color: mod.color }}>
                <span>Explore</span>
                <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="px-6 md:px-10 pb-10">
        <div className="rounded-2xl border border-border p-5"
          style={{ backgroundColor: '#172026' }}>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">At a Glance</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: PROJECTS.length,   label: 'Projects',            color: '#10b981' },
              { value: DECISIONS.length,  label: 'Documented Decisions',color: '#06b6d4' },
              { value: CHALLENGES.length, label: 'Challenges',          color: '#ef4444' },
              { value: '4',               label: 'Lab Experiments',     color: '#a78bfa' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main EngineeringOS overlay ──────────────────────────────── */
export default function EngineeringOS({ onClose }) {
  const [activeModule, setActiveModule] = useState(null);
  const [paletteOpen,  setPaletteOpen]  = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const overlayRef  = useRef(null);
  const closebtnRef = useRef(null);

  const currentMod   = MODULES.find(m => m.id === activeModule);
  const ModComponent = currentMod?.component;

  /* Move focus into overlay on mount */
  useEffect(() => { closebtnRef?.current?.focus(); }, []);

  /* Focus trap — keep Tab/Shift+Tab cycling inside the overlay */
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = Array.from(el.querySelectorAll(FOCUSABLE)).filter(n => !n.closest('[aria-hidden="true"]'));
      if (!nodes.length) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    /* Move focus to close button when overlay mounts */
    closebtnRef?.current?.focus();
    return () => el.removeEventListener('keydown', trap);
  }, []);

  /* Ctrl+K + Escape */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(p => !p); }
      if (e.key === 'Escape') {
        if (paletteOpen) { setPaletteOpen(false); return; }
        if (activeModule) { setActiveModule(null); return; }
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [paletteOpen, activeModule, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Search results */
  const searchResults = searchQuery.trim()
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navigate = useCallback((id) => {
    setActiveModule(id);
    setPaletteOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 z-50 flex flex-col"
        style={{ backgroundColor: '#141b1f' }}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Engineering OS">

        {/* ── Top header bar ── */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 h-14 border-b border-border"
          style={{ backgroundColor: '#172026' }}>

          {/* Left: back / logo */}
          <div className="flex items-center gap-3 min-w-0">
            {activeModule ? (
              <button onClick={() => setActiveModule(null)}
                className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors text-sm font-medium"
                aria-label="Back to home">
                <ChevronLeftIcon size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>
            ) : null}

            <div className="flex items-center gap-2">
              <span className="text-accent font-bold text-sm tracking-wide font-mono">ENG_OS</span>
              {activeModule && (
                <>
                  <span className="text-text-muted">/</span>
                  <span className="text-white font-semibold text-sm truncate max-w-40 sm:max-w-none">
                    {currentMod?.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Centre: module breadcrumb tabs (desktop) */}
          {!activeModule && (
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Module navigation">
              {MODULES.map(m => (
                <button key={m.id} onClick={() => setActiveModule(m.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-bg-secondary transition-all">
                  <AppIcon name={m.icon} size={14} />
                  <span>{m.title}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right: search + palette + close */}
          <div className="ml-auto flex items-center gap-2">
            {/* Inline search toggle */}
            <div className="relative">
              <button onClick={() => { setSearchOpen(s => !s); setSearchQuery(''); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white border border-border hover:border-border transition-all bg-bg/60"
                aria-label="Search Engineering OS">
                <SearchIcon size={14} />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Inline search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-1 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border overflow-hidden z-20 shadow-2xl"
                  style={{ backgroundColor: '#0f172a' }}>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                    <SearchIcon size={14} className="text-text-muted" />
                    <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                      placeholder="Search…"
                      className="flex-1 bg-transparent text-white text-xs outline-none placeholder-text-muted"
                      aria-label="Search query"
                    />
                  </div>
                  {searchResults.length > 0 ? (
                    <ul className="py-1 max-h-56 overflow-y-auto">
                      {searchResults.map((item, i) => (
                        <li key={i}>
                          <button onClick={() => navigate(item.action)}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 hover:bg-bg-secondary transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                              <p className="text-[10px] text-text-muted truncate">{item.sub}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery ? (
                    <p className="px-3 py-4 text-xs text-text-muted text-center">No results</p>
                  ) : (
                    <p className="px-3 py-4 text-[10px] text-text-muted text-center">Type to search modules, projects, technologies…</p>
                  )}
                </div>
              )}
            </div>

            {/* Palette trigger */}
            <button onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted border border-border hover:border-border hover:text-text-secondary transition-all bg-bg/60"
              aria-label="Open command palette (Ctrl K)">
              <kbd className="font-mono text-[10px]">Ctrl K</kbd>
            </button>

            {/* Close */}
            <button onClick={onClose}
              ref={closebtnRef}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-bg-secondary transition-all"
              aria-label="Close Engineering OS">
              <CloseIcon size={16} />
            </button>
          </div>
        </header>

        {/* ── Content area ── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeModule && currentMod ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Module header */}
              <div className="flex-shrink-0 px-6 md:px-10 py-5 border-b border-border"
                style={{ backgroundColor: '#172026' }}>
                <div className="flex items-center gap-3 max-w-5xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ color: currentMod.color, backgroundColor: `${currentMod.color}18` }}>
                    <AppIcon name={currentMod.icon} size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base leading-tight">{currentMod.title}</h2>
                    <p className="text-xs text-text-muted mt-0.5">{currentMod.tagline}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:block"
                    style={{ backgroundColor: `${currentMod.color}15`, color: currentMod.color }}>
                    {currentMod.badge}
                  </span>
                </div>
              </div>

              {/* Module content */}
              <div className="flex-1 overflow-hidden px-6 md:px-10 py-6">
                <Suspense fallback={<ModuleLoader />}>
                  <ModComponent />
                </Suspense>
              </div>
            </div>
          ) : (
            <HomeScreen onNavigate={navigate} />
          )}
        </div>

        {/* ── Bottom status bar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 h-7 border-t border-border"
          style={{ backgroundColor: '#11161a' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              Online
            </span>
            <span className="text-[10px] text-text-muted">{MODULES.length} modules loaded</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span>Shivchandar Kumar Sah</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Engineering OS</span>
          </div>
        </div>
      </div>

      {/* Command palette */}
      {paletteOpen && (
        <CommandPalette onNavigate={navigate} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}
