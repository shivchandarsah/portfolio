import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { loadGsap } from '../utils/anim';
import { setClickIntent, clearClickIntent } from '../utils/scroll';

/* ─────────────────────────────────────────────────────────────
   CATEGORIES, defines order, colour, and description shown
   in the grouped view
   ───────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id:    'Frontend',
    label: 'Frontend Development',
    color: '#61dafb',
    description: 'Building polished, reactive UIs with React and Vue across full-stack projects.',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id:    'Backend',
    label: 'Backend & APIs',
    color: '#5eead4',
    description: 'Node.js + Express REST APIs with JWT auth and role-based access control.',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
      </svg>
    ),
  },
  {
    id:    'Database',
    label: 'Database',
    color: '#f59e0b',
    description: 'MongoDB with Mongoose for NoSQL data, MySQL with Sequelize ORM for relational data.',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    id:    'Real-time',
    label: 'Real-time & AI',
    color: '#a78bfa',
    description: 'Live features with Socket.IO, peer video via WebRTC, and RAG-based AI integrations.',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id:    'DevOps',
    label: 'DevOps & Tooling',
    color: '#f05032',
    description: 'Git-based workflows, CI-style deploys to Vercel and Render, API testing with Postman.',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   TECHNOLOGIES, every card with brand colour + linked projects
   ───────────────────────────────────────────────────────────── */
const technologies = [
  /* Frontend */
  { id: 'js',       name: 'JavaScript',   category: 'Frontend',  level: 88, color: '#f7df1e', projects: ['Support Hub AI', 'Sikshamantra', 'SmartInvoice', 'ER Note'] },
  { id: 'react',    name: 'React.js',     category: 'Frontend',  level: 85, color: '#61dafb', projects: ['Support Hub AI', 'Bolts Army'] },
  { id: 'vue',      name: 'Vue.js',       category: 'Frontend',  level: 80, color: '#42b883', projects: ['SmartInvoice'] },
  { id: 'html',     name: 'HTML5 & CSS3', category: 'Frontend',  level: 92, color: '#e34c26', projects: ['Support Hub AI', 'Bolts Army', 'Sikshamantra', 'SmartInvoice'] },
  { id: 'ts',       name: 'TypeScript',   category: 'Frontend',  level: 65, color: '#3178c6', projects: [] },

  /* Backend */
  { id: 'node',     name: 'Node.js',      category: 'Backend',   level: 85, color: '#84cc16', projects: ['Support Hub AI', 'Bolts Army', 'Sikshamantra', 'SmartInvoice'] },
  { id: 'express',  name: 'Express.js',   category: 'Backend',   level: 83, color: '#e2e8f0', projects: ['Support Hub AI', 'Bolts Army', 'Sikshamantra', 'SmartInvoice'] },
  { id: 'rest',     name: 'REST APIs',    category: 'Backend',   level: 88, color: '#5eead4', projects: ['Support Hub AI', 'Bolts Army', 'Sikshamantra'] },
  { id: 'jwt',      name: 'JWT & RBAC',   category: 'Backend',   level: 82, color: '#f59e0b', projects: ['Support Hub AI', 'Bolts Army'] },

  /* Database */
  { id: 'mongo',    name: 'MongoDB',      category: 'Database',  level: 82, color: '#47a248', projects: ['Support Hub AI', 'Sikshamantra', 'SmartInvoice'] },
  { id: 'mysql',    name: 'MySQL',        category: 'Database',  level: 75, color: '#4479a1', projects: ['Bolts Army', 'Inventory System'] },
  { id: 'mongoose', name: 'Mongoose ODM', category: 'Database',  level: 80, color: '#a52a2a', projects: ['Support Hub AI', 'Sikshamantra'] },
  { id: 'seq',      name: 'Sequelize',    category: 'Database',  level: 72, color: '#52b0e7', projects: ['Bolts Army'] },

  /* Real-time & AI */
  { id: 'socket',   name: 'Socket.IO',    category: 'Real-time', level: 78, color: '#a78bfa', projects: ['Support Hub AI'] },
  { id: 'webrtc',   name: 'WebRTC',       category: 'Real-time', level: 68, color: '#f55f00', projects: ['Support Hub AI'] },
  { id: 'rag',      name: 'RAG / Pinecone',category:'Real-time', level: 65, color: '#6366f1', projects: ['Support Hub AI'] },

  /* DevOps */
  { id: 'git',      name: 'Git & GitHub', category: 'DevOps',    level: 90, color: '#f05032', projects: ['Support Hub AI', 'Bolts Army', 'Sikshamantra', 'SmartInvoice', 'ER Note'] },
  { id: 'vercel',   name: 'Vercel',       category: 'DevOps',    level: 85, color: '#e2e8f0', projects: ['Support Hub AI', 'Sikshamantra'] },
  { id: 'render',   name: 'Render',       category: 'DevOps',    level: 82, color: '#46e3b7', projects: ['Bolts Army', 'SmartInvoice'] },
  { id: 'postman',  name: 'Postman',      category: 'DevOps',    level: 80, color: '#ff6c37', projects: ['Support Hub AI', 'Bolts Army'] },
];

/* ─────────────────────────────────────────────────────────────
   SVG ring arc
   ───────────────────────────────────────────────────────────── */
function RingProgress({ level, color, size = 52, animate }) {
  const r         = (size - 8) / 2;
  const circ      = 2 * Math.PI * r;
  const fill      = (level / 100) * circ;

  /* Ring fill animation: CSS transition on stroke-dashoffset runs on the
     compositor (no layout/paint main-thread work) and starts immediately on
     mount — no GSAP load, no requestIdleCallback, no fallback timer. The
     initial painted state is the *final* filled ring so LCP sees a complete
     ring; the CSS animation then reveals the fill progressively for visual
     polish only. */
  const circleRef = useRef(null);

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    // Kick off a CSS transition by setting the final dashoffset on the next
    // frame; the browser interpolates stroke-dashoffset on the compositor.
    const el = circleRef.current;
    const startOffset = circ; // full circumference = empty ring visually
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = String(circ - fill);
    });
    return () => { el.style.strokeDashoffset = ''; };
  }, [animate, fill, circ]);

  return (
    <svg width={size} height={size} className="-rotate-90 flex-shrink-0" aria-hidden="true">
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="4" />
      {/* Fill — animated via CSS transition on stroke-dashoffset */}
      <circle ref={circleRef} cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={String(circ - fill)}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 1.1s cubic-bezier(0.27,0.77,0.22,1.13) 0.15s',
        }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated counter
   ───────────────────────────────────────────────────────────── */
function Counter({ target, run }) {
  const [val, setVal] = useState(target); // start at target; animate down‑up if needed, but render target immediately when not running
  const raf = useRef(null);

  useEffect(() => {
    if (!run) {
      setVal(target); // ensure correct value when animation is disabled
      return;
    }
    setVal(0); // reset to 0 before animating up
    const start = performance.now();
    const dur   = 950;
    const tick  = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setVal(Math.round(t * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, target]);

  return <>{val}</>;
}

/* ─────────────────────────────────────────────────────────────
   Single tech card
   ───────────────────────────────────────────────────────────── */
function TechCard({ tech, selected, dimmed, onClick, visible }) {
  const isActive = selected === tech.id;

  return (
    <button
      onClick={() => onClick(tech.id)}
      tabIndex={dimmed ? -1 : 0}
      aria-pressed={isActive}
      aria-label={`${tech.name}, ${tech.level}% proficiency`}
      aria-disabled={dimmed}
      className={`relative w-full text-left rounded-xl border p-3.5 transition-all duration-250 cursor-pointer
        ${isActive
          ? 'scale-[1.03] -translate-y-0.5'
          : dimmed
          ? 'opacity-25 scale-[0.97] pointer-events-none'
          : 'hover:scale-[1.02] hover:-translate-y-0.5'
        }`}
      style={{
        backgroundColor: isActive ? `${tech.color}12` : 'var(--color-bg-card)',
        borderColor:     isActive ? `${tech.color}55` : 'var(--color-border)',
        boxShadow:       isActive ? `0 0 20px ${tech.color}22` : 'none',
      }}
    >
      {/* Active glow ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1.5px ${tech.color}55` }}
          aria-hidden="true"
        />
      )}

      <div className="flex items-center gap-3">
        {/* Ring */}
        <RingProgress level={tech.level} color={tech.color} animate={visible} />

        {/* Name + proficiency */}
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-[0.8125rem] text-text-primary leading-tight tracking-tight truncate">
            {tech.name}
          </p>
          <p className="text-[11px] font-bold mt-0.5 text-text-primary" style={{ color: tech.color }}>
            <Counter target={tech.level} run={visible} />%
          </p>
        </div>
      </div>


    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function Skills() {
  const sectionRef     = useRef(null);
  const prefersReduced = useReducedMotion();

  const [visible,  setVisible]  = useState(false);
  const [selected, setSelected] = useState(null);   // tech.id or null
  const [filter,   setFilter]   = useState('All');  // category filter

  /* Deferred reveal: GSAP loads only when Skills mounts (already lazy),
     never on the Hero critical path. Rings fall back to their final static
     state (strokeDasharray below) if GSAP never loads. */
  useEffect(() => {
    let ctx = null;
    let cancelled = false;

    // If the section is already in view when the component mounts,
    // mark everything as visible immediately so rings/counters render.
    const sectionEl = sectionRef.current;
    if (sectionEl) {
      const rect = sectionEl.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      if (isInView) setVisible(true);
    }

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
          onEnter: () => {
            setVisible(true);
            if (prefersReduced) return;
            // Animate only the category sections (not the header/tabs/footer),
            // so the heading and filter chips are visible immediately.
            gsap.fromTo(
              '.skills-category-group',
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.035 }
            );
          },
        });
      }, sectionRef);
    }).catch(() => { if (!cancelled) setVisible(true); });
    return () => { cancelled = true; if (ctx) ctx.revert(); };
  }, [prefersReduced]);

  const handleClick = (id) => {
    setClickIntent(id);
    setSelected((prev) => (prev === id ? null : id));
    // Release the lock after the card hover animation settles so the
    // IntersectionObserver can resume normal section tracking.
    setTimeout(clearClickIntent, 350);
  };

  /* Which categories to show based on filter */
  const visibleCategories = filter === 'All'
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === filter);

  return (
    <section ref={sectionRef} id="skill" className="section section-alt" aria-labelledby="skills-title">
      <div className="section-inner">

        {/* ── Header ── */}
        <div className="sv-item mb-4">
          <h2 id="skills-title" className="section-title">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-xl mt-2 leading-relaxed">
            Proficiency rings animate on scroll. Each card shows my skill level across the full stack.
          </p>
        </div>


        {/* ── Category filter tabs ── */}
        <div className="sv-item flex flex-wrap gap-2 mb-10"
          role="tablist" aria-label="Filter by technology category">
          {['All', ...CATEGORIES.map((c) => c.id)].map((cat) => {
            const count = cat === 'All'
              ? technologies.length
              : technologies.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => { setFilter(cat); setSelected(null); }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                  filter === cat
                    ? 'bg-accent text-bg border-accent shadow-glow'
                    : 'bg-transparent text-text-secondary border-border hover:border-accent/40 hover:text-accent'
                }`}
              >
                {cat}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === cat ? 'bg-bg/20 text-bg' : 'bg-bg-elevated text-text-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grouped category sections ── */}
        <div role="tabpanel" aria-label={`${filter} technologies`} className="space-y-12">
          {visibleCategories.map((cat) => {
            const catTechs = technologies.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="sv-item skills-category-group">

                {/* Category header */}
                <div className="flex items-start gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-text-primary tracking-tight">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed max-w-lg">
                      {cat.description}
                    </p>
                  </div>
                  {/* Subtle divider line */}
                  <div className="hidden sm:block flex-1 h-px bg-border mt-4 ml-4" aria-hidden="true" />
                </div>

                {/* Tech cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pl-0 sm:pl-12">
                  {catTechs.map((tech) => (
                    <TechCard
                      key={tech.id}
                      tech={tech}
                      selected={selected}
                      dimmed={selected !== null && selected !== tech.id}
                      onClick={handleClick}
                      visible={visible}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer hint ── */}
        <p className="sv-item text-center text-[11px] text-text-muted mt-12">
          Ring fill represents proficiency level · Hover to highlight individual cards
        </p>

      </div>
    </section>
  );
}
