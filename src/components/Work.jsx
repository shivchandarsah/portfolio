import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { loadGsap } from '../utils/anim';
import {
  ArrowDownIcon, ArrowRightIcon, BookOpenIcon, BotIcon, BriefcaseIcon, CodeIcon,
  ExternalLinkIcon, FileTextIcon, GithubIcon, MonitorIcon, ZapIcon,
} from './icons';

/* ── Per-project preview metadata ───────────────────────────── */
const PREVIEWS = {
  1: {
    accent: '#5eead4',
    layers: ['React.js', 'Socket.IO', 'Node.js / Express', 'MongoDB', 'Pinecone RAG'],
    badge:  'AI · Real-time',
    icon:   <BotIcon size={26} strokeWidth={1.5} />,
    dots:   ['#5eead4', '#a78bfa', '#84cc16', '#47a248', '#6366f1'],
  },
  2: {
    accent: '#d99b3b',
    layers: ['React.js', 'JWT + RBAC', 'Node.js / Express', 'MySQL', 'Sequelize ORM'],
    badge:  'CRM · Automation',
    icon:   <BriefcaseIcon size={26} strokeWidth={1.5} />,
    dots:   ['#61dafb', '#f59e0b', '#84cc16', '#4479a1', '#52b0e7'],
  },
  3: {
    accent: '#3b82f6',
    layers: ['React.js', 'Node.js / Express', 'MongoDB', 'JWT Auth'],
    badge:  'LMS · Open Source',
    icon:   <BookOpenIcon size={26} strokeWidth={1.5} />,
    dots:   ['#61dafb', '#84cc16', '#47a248', '#f59e0b'],
  },
  4: {
    accent: '#5eead4',
    layers: ['Vue.js', 'Node.js / Express', 'MongoDB', 'REST APIs'],
    badge:  'Invoicing · MEVN',
    icon:   <FileTextIcon size={26} strokeWidth={1.5} />,
    dots:   ['#42b883', '#84cc16', '#47a248', '#5eead4'],
  },
  5: {
    accent: '#d99b3b',
    layers: ['C# / .NET', 'Windows Forms', 'Local Database'],
    badge:  'Desktop · Windows',
    icon:   <MonitorIcon size={26} strokeWidth={1.5} />,
    dots:   ['#9b59b6', '#3498db', '#f59e0b'],
  },
  6: {
    accent: '#5eead4',
    layers: ['React.js', 'Gemini AI', 'Node.js / Express', 'MySQL', 'TypeScript'],
    badge:  'AI · CRM · Analytics',
    icon:   <ZapIcon size={26} strokeWidth={1.5} />,
    dots:   ['#61dafb', '#ea4335', '#84cc16', '#4479a1', '#3178c6'],
  },
};

/* ── Project preview card (replaces placeholder images) ─────── */
function ProjectPreview({ project }) {
  const meta = PREVIEWS[project.id] || PREVIEWS[1];

  return (
    <div
      className="relative w-full overflow-hidden rounded-t-xl border-b border-border"
      style={{
        background: `linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-card) 100%)`,
        aspectRatio: '16 / 9',
      }}
      aria-hidden="true"
    >
      {/* Subtle radial glow in accent colour */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 40%, ${meta.accent}55 0%, transparent 65%)` }} />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${meta.accent} 1px, transparent 1px), linear-gradient(90deg, ${meta.accent} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

      {/* Stack layer diagram */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6">
        {/* Big icon */}
        <div className="mb-1 select-none" style={{ color: meta.accent }}>{meta.icon}</div>

        {/* Layer bars */}
        {meta.layers.map((layer, i) => (
          <div key={layer} className="flex items-center gap-2 w-full max-w-[220px]">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: meta.dots[i] || meta.accent }} />
            <div className="flex-1 h-[22px] rounded-md flex items-center px-2.5"
              style={{
                backgroundColor: `${meta.dots[i] || meta.accent}14`,
                border: `1px solid ${meta.dots[i] || meta.accent}28`,
              }}>
              <span className="text-[10px] font-semibold truncate"
                style={{ color: meta.dots[i] || meta.accent }}>
                {layer}
              </span>
            </div>
          </div>
        ))}

        {/* Badge */}
        <div className="mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${meta.accent}18`,
            border: `1px solid ${meta.accent}35`,
            color: meta.accent,
          }}>
          {meta.badge}
        </div>
      </div>

      {/* Top-right dots — macOS-style decoration */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {meta.dots.slice(0, 3).map((c, i) => (
          <span key={i} className="w-2 h-2 rounded-full opacity-60"
            style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

export const projects = [
  {
    id: 1,
    slug: 'support-hub-ai',
    title: 'Support Hub AI',
    inlineDetails: true, // expands in place like a form instead of opening /work/:slug
    category: 'Web Application',
    filter: 'web',
    image: '/screenshots/Ai_Agent-800.webp',
    description: 'AI-powered customer support & automation platform with real-time chat, RAG-based knowledge base (Pinecone), JWT auth, and role-based access control.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'Socket.IO'],
    extra: ['RAG / Pinecone', 'JWT + RBAC'],
    highlights: ['AI knowledge base (RAG)', 'Real-time Socket.IO chat', 'Role-based access control'],
    why: 'Why Pinecone over a Postgres vector plugin? Managed similarity search at low ops cost, the product is the AI layer, not the database.',
    detail: 'Real-time AI customer support platform. React frontend with a RAG knowledge base powered by Pinecone vector search. Node.js/Express API with MongoDB, JWT-authenticated Socket.IO chat, and role-based access control (Admin/Moderator/Agent/Customer). Live chat widget with AI suggestions, conversation history, and automated knowledge-base updates from resolved tickets. Open-source.',
    github: 'https://github.com/shivchandarsah',
    live:   'https://support-hub-ai.vercel.app/',
    featured: true,
    color: 'emerald',
  },
  {
    id: 2,
    slug: 'bolts-army',
    title: 'Bolts Army',
    category: 'Web Application',
    filter: 'web',
    image: '/screenshots/bolts_army-800.webp',
    description: 'Full-stack CRM platform with role-based dashboards, JWT auth, and MySQL data layer via Sequelize ORM.',
    tags: ['React.js', 'Node.js', 'MySQL', 'Sequelize'],
    extra: ['JWT Auth', 'Express.js'],
    highlights: ['Role-based dashboards', 'MySQL + Sequelize ORM', 'JWT authentication'],
    why: 'Why MySQL over MongoDB? CRM data is highly relational, customers, deals and invoices join constantly; Sequelize migrations kept the schema honest.',
    detail: 'A full-stack CRM platform built from scratch. React frontend with role-based dashboards feeding into a Node.js/Express REST API. MySQL data layer via Sequelize ORM. Integrated Google Gemini AI for an executive chatbot that injects live CRM context into multi-turn conversations, plus AI-powered CRM analysis, automated content generation and deal-intelligence scoring. Implements JWT authentication with fine-grained role-based access control across Admin, Manager, Sales Rep, Support Agent and User roles. Private repository.',
    /* Live product, no public repository — so this card links to the live demo
       instead of GitHub (null = no GitHub action is rendered). */
    github: null,
    live:   'https://boltsarmy.com/',
    featured: true,
    color: 'copper',
  },
  {
    id: 3,
    slug: 'sikshamantra',
    title: 'Sikshamantra',
    category: 'Web Application',
    filter: 'web',
    image: '/screenshots/Siksya_mantra-800.webp',
    description: 'Full-stack learning platform built as a university team project (team of 5). Focused on accessible, structured online education.',
    tags: ['React.js', 'Node.js', 'MongoDB'],
    extra: ['MIT License', 'Open Source'],
    highlights: ['Full-Stack', 'Team of 5', '2 GitHub stars'],
    detail: 'Open-source e-learning platform built as the front-end lead for a 5-person university capstone. React + Node.js/MongoDB stack with a MongoDB schema designed for course-progress tracking across lessons and quizzes. Implemented responsive UI with Tailwind CSS, integrated JWT session management and a REST API for course content delivery. Deployed with PM2 process management on an AWS EC2 instance. MIT licensed.',
    github: 'https://github.com/shivchandarsah/Sikshamantra',
    live:   'https://github.com/shivchandarsah/Sikshamantra',
    featured: false,
    color: 'blue',
  },
  {
    id: 4,
    slug: 'smartinvoice',
    title: 'SmartInvoice',
    category: 'Web Application',
    filter: 'web',
    image: '/screenshots/Invoice_generator-800.webp',
    description: 'Full-stack invoicing solution, invoice generation, management, and reporting. Built as a university team project (team of 4).',
    tags: ['Vue.js', 'Node.js', 'MongoDB'],
    extra: ['Full-Stack', 'Team project'],
    highlights: ['Full-Stack', 'Invoice generation', 'Team of 4'],
    detail: 'Vue.js invoicing application built as the back-end/API lead for a 4-person university project. Node.js/Express API with MongoDB/Mongoose for invoice CRUD operations, PDF generation library integration, and RESTful endpoints for invoice creation, retrieval, and reporting. Implemented role-based access for client and admin views, and built a reporting dashboard with monthly revenue statistics using MongoDB aggregation pipelines.',
    github: 'https://github.com/shivchandarsah/SmartInvoice',
    live:   'https://github.com/shivchandarsah/SmartInvoice',
    featured: false,
    color: 'blue',
  },
  {
    id: 5,
    slug: 'inventory-management',
    title: 'Inventory Management System',
    category: 'Desktop App',
    filter: 'desktop',
    image: '/screenshots/Inventory_management-800.webp',
    description: 'C# desktop application for inventory management with full CRUD operations, product tracking, and reporting functionality.',
    tags: ['C#', '.NET'],
    extra: ['Desktop App', 'Windows'],
    highlights: ['Full CRUD operations', 'Product tracking', 'C# desktop app'],
    github: 'https://github.com/shivchandarsah',
    live:   'https://github.com/shivchandarsah',
    featured: false,
    color: 'amber',
  },
  {
    id: 6,
    slug: 'business-automation-crm',
    title: 'Business Automation CRM',
    category: 'Web Application',
    filter: 'web',
    image: '/screenshots/Business_automation-800.webp',
    description: 'Full-stack business automation CRM with AI-powered insights, role-based dashboards for leads, deals, projects, tasks and invoicing, plus a Google Gemini executive chatbot with live CRM context, AI CRM analysis, content generation and deal-intelligence scoring.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'TypeScript'],
    extra: ['Google Gemini AI', 'In Progress'],
    highlights: [
      'AI executive chatbot with live CRM context',
      'Role-based dashboards (Admin → User)',
      'Time-series analytics & invoice management',
    ],
    github: 'https://github.com/shivchandarsah',
    live:   '',
    building: true,
    featured: true,
    color: 'emerald',
  },
];

export const filters = [
  { key: 'all',     label: 'All' },
  { key: 'web',     label: 'Web Apps' },
  { key: 'desktop', label: 'Desktop' },
];

export const colorMap = {
  emerald: { tag: 'tag',         dot: 'bg-accent',  icon: 'text-accent',  ring: 'ring-accent/20',  badge: 'bg-accent-dim text-accent border border-accent/20' },
  amber:   { tag: 'tag--amber',  dot: 'bg-amber',   icon: 'text-amber',   ring: 'ring-amber/20',   badge: 'bg-amber-dim text-amber border border-amber/20' },
  blue:    { tag: 'tag--blue',   dot: 'bg-blue',    icon: 'text-blue',    ring: 'ring-blue/20',    badge: 'bg-blue-dim text-blue border border-blue/20' },
  copper:  { tag: 'tag--amber',  dot: 'bg-amber',   icon: 'text-amber',   ring: 'ring-amber/20',   badge: 'bg-amber-dim text-amber border border-amber/20' },
};

/* ── Project actions (GitHub / Live Demo) — rendered identically on the
   Work card and on the dedicated Project Details page. Only rows with a
   real URL are shown, so e.g. Bolts Army shows Live Demo without GitHub. */

export function ProjectActions({ project, buttonClassName = 'px-4 py-2' }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {project.live && project.live !== project.github && (
        <a
          href={project.live}
          target="_blank" rel="noopener noreferrer"
          className={`btn-primary text-xs ${buttonClassName}`}
          aria-label={`View live demo of ${project.title}`}
        >
          <ExternalLinkIcon size={14} />
          Live Demo
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank" rel="noopener noreferrer"
          className={`text-xs ${buttonClassName} ${project.live && project.live !== project.github ? 'btn-secondary' : 'btn-primary'}`}
          aria-label={`View ${project.title} on GitHub`}
        >
          <GithubIcon size={14} />
          GitHub
        </a>
      )}
    </div>
  );
}

/* ── Project screenshot — the same large visual on the card and the
   dedicated Project Details page (real image, styled preview fallback). */

export function ProjectMedia({ project, className, imgClassName }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      {project.image && !imgError ? (
        <img
          src={project.image}
          srcSet={`${project.image.replace('-800.webp', '-480.webp')} 480w, ${project.image} 800w`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={`${project.title} — ${project.category} screenshot`}
          width="800" height="366"
          className={imgClassName}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : (
        <ProjectPreview project={project} />
      )}
    </div>
  );
}

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function CategoryIcon({ category, className }) {
  const Glyph = category === 'Desktop App' ? MonitorIcon : CodeIcon;
  return <Glyph className={className} strokeWidth={1.5} size={20} />;
}

/* ── Inline details — for projects flagged `inlineDetails` (currently only
   Support Hub AI). Renders the full detail content directly beneath the
   card, like a simple extended form, instead of navigating to /work/:slug.
   Reuses the same blocks as the dedicated page (category + status,
   description, decision note, features, technologies, write-up, actions). */

export function ProjectInlineDetails({ project }) {
  const c = colorMap[project.color] || colorMap.emerald;
  return (
    <div className="pt-5 mt-5 border-t border-border space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border flex items-center justify-center flex-shrink-0">
          <CategoryIcon category={project.category} className={`w-5 h-5 ${c.icon}`} />
        </div>
        <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">{project.category}</span>
        {project.featured && (
          <span className="copper-chip text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Featured
          </span>
        )}
        {project.building && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Building
          </span>
        )}
      </div>

      <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>

      {project.why && (
        <p className="text-xs text-text-muted leading-relaxed pl-3 border-l-2 border-accent/40 italic">
          {project.why}
        </p>
      )}

      {project.highlights && (
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2.5">
            Key Features
          </p>
          <ul className="space-y-1.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2.5">
          Technologies
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(project.tags || []).map((t) => <span key={t} className={c.tag}>{t}</span>)}
          {(project.extra || []).map((t) => <span key={t} className="tag--muted">{t}</span>)}
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">{project.detail || project.description}</p>

      <ProjectActions project={project} buttonClassName="px-4 py-2" />
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef        = useRef(null);
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  /* Deferred reveal: GSAP loads only when a card mounts (Work is lazy),
     never on the Hero critical path. */
  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let trigger = null;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !cardRef.current) return;
      trigger = ScrollTrigger.create({
        trigger: cardRef.current, start: 'top 88%', once: true,
        onEnter: () => gsap.fromTo(cardRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: (index % 3) * 0.09 }
        ),
      });
    }).catch(() => {});
    return () => { cancelled = true; if (trigger) trigger.kill(); };
  }, [project.id, index, prefersReduced]);

  return (
    <article ref={cardRef}
      className={`card flex flex-col group h-full ${project.featured ? `ring-1 ${colorMap[project.color]?.ring || colorMap.emerald.ring}` : ''}`}
    >
      <ProjectMedia
        project={project}
        className="-mx-[1.75rem] -mt-[1.75rem] mb-5 rounded-t-xl"
        imgClassName="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
      />

      {/* Project name — card shows screenshot, name, action links and the
          Project Details link only. Long description, tech stack, features
          and every other detail lives on the dedicated details page. */}
      <h3 className="font-display font-bold text-base text-text-primary mb-2 group-hover:text-accent transition-colors duration-200 tracking-tight">
        {project.title}
      </h3>

      {/* Actions — always on the card, never hidden inside details */}
      <ProjectActions project={project} buttonClassName="px-4 py-2" />

      {/* Project Details — Support Hub AI expands in place like a simple
          extended form; every other project opens /work/:slug. */}
      <div className="mt-3 pt-3 border-t border-border">
        {project.inlineDetails ? (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent transition-colors duration-200 inline-flex items-center gap-1.5"
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Show'} Project Details for ${project.title}`}
          >
            Project Details
            <ArrowDownIcon size={13} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <Link
            to={`/work/${project.slug}`}
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent transition-colors duration-200 inline-flex items-center gap-1.5"
            aria-label={`Open Project Details for ${project.title}`}
          >
            Project Details
            <ArrowRightIcon size={13} />
          </Link>
        )}
      </div>

      {project.inlineDetails && expanded && <ProjectInlineDetails project={project} />}
      </article>
  );
}

export default function Work() {
  const sectionRef     = useRef(null);
  const [active, setActive]       = useState('all');
  const [displayed, setDisplayed] = useState(projects);
  const prefersReduced = useReducedMotion();

  /* Deferred reveal: GSAP loads only when Work mounts (already lazy),
     never on the Hero critical path. */
  useEffect(() => {
    if (prefersReduced) return;
    let tween = null;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      tween = gsap.fromTo('.work-heading', { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } }
      );
    }).catch(() => {});
    return () => { cancelled = true; if (tween) tween.scrollTrigger?.kill(); if (tween) tween.kill(); };
  }, [prefersReduced]);

  const handleFilter = (key) => {
    setActive(key);
    setDisplayed(key === 'all' ? projects : projects.filter((p) => p.filter === key));
  };

  return (
    <section ref={sectionRef} id="work" className="section" aria-labelledby="work-title">
      <div className="section-inner">

        <div className="work-heading mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 id="work-title" className="section-title mb-0">
              My <span className="gradient-text">Projects</span>
            </h2>
            <a href="https://github.com/shivchandarsah" target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-sm whitespace-nowrap self-start sm:self-auto">
              All on GitHub
              <ArrowRightIcon size={15} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Project filters">
          {filters.map((f) => (
            <button key={f.key} role="tab" aria-selected={active === f.key}
              onClick={() => handleFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === f.key
                  ? 'bg-accent text-bg border-accent shadow-glow'
                  : 'bg-transparent text-text-secondary border-border hover:border-accent/40 hover:text-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          aria-label={`${filters.find(f => f.key === active)?.label ?? 'All'} projects`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>

        {displayed.length === 0 && (
          <p className="text-center py-16 text-text-muted">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
