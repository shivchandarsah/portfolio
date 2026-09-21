import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { scrollToSection } from '../utils/scroll';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';
import {
  CategoryIcon,
  ProjectActions,
  ProjectMedia,
  colorMap,
  getProjectBySlug,
  projects,
} from './Work';

/* Dedicated project page — /work/:slug.

   Reuses the single project record in Work.jsx (no duplicated data) plus
   the shared custom icon system and existing visual language (section,
   card, copper-chip, tag/tag--muted, divider, badge-available). */

export default function ProjectDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const goToSection = (id) => (e) => { e.preventDefault(); scrollToSection(id, navigate); };
  const project = getProjectBySlug(slug);

  /* Each project gets its own document title while the page is open. */
  useEffect(() => {
    if (!project) return;
    const prev = document.title;
    document.title = `${project.title} | Project Details | Shivchandar Sah`;
    return () => { document.title = prev; };
  }, [project]);

  if (!project) {
    return (
      <main className="section" aria-labelledby="project-not-found">
        <div className="section-inner max-w-2xl text-center">
          <h1 id="project-not-found" className="section-title">
            Project <span className="gradient-text">not found</span>
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            This project does not exist or may have been moved.
          </p>
          <Link
            to="/#work"
            onClick={goToSection('work')}
            className="btn-secondary"
            aria-label="Back to projects"
          >
            <ArrowLeftIcon size={16} />
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const c = colorMap[project.color] || colorMap.emerald;

  return (
    <main className="section" aria-labelledby="project-details-title">
      <div className="section-inner max-w-5xl">
        {/* Back to Work */}
        <Link
          to="/#work"
          onClick={goToSection('work')}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent transition-colors duration-200 mb-8"
          aria-label="Back to projects"
        >
          <ArrowLeftIcon size={13} />
          Back to Projects
        </Link>

        {/* Title + category + status */}
        <div className="flex items-start gap-4 mb-6 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center flex-shrink-0">
            <CategoryIcon category={project.category} className={`w-6 h-6 ${c.icon}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1">
              Project Details · {project.category}
            </p>
            <h1 id="project-details-title" className="font-display font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
              {project.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {project.featured && (
              <span className="copper-chip text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {project.building ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Building
              </span>
            ) : (
              <span className="badge-available text-xs">Available for new projects</span>
            )}
          </div>
        </div>

        {/* Large screenshot */}
        <div className="card overflow-hidden p-0 mb-8">
          <ProjectMedia
            project={project}
            className="rounded-t-2xl"
            imgClassName="w-full aspect-[16/9] object-cover object-top"
          />
        </div>

        {/* Overview + technologies */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="card" aria-labelledby="project-overview">
              <h2 id="project-overview" className="font-display font-bold text-lg text-text-primary tracking-tight mb-3">
                Overview
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{project.description}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{project.detail || project.description}</p>
              {project.why && (
                <p className="text-xs text-text-muted leading-relaxed mt-4 pl-3 border-l-2 border-accent/40 italic">
                  {project.why}
                </p>
              )}
            </section>

            {project.highlights && (
              <section className="card" aria-labelledby="project-features">
                <h2 id="project-features" className="font-display font-bold text-lg text-text-primary tracking-tight mb-4">
                  Key Features
                </h2>
                <ul className="space-y-2.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${c.dot}`} aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className="card" aria-labelledby="project-tech">
              <h2 id="project-tech" className="font-display font-bold text-lg text-text-primary tracking-tight mb-4">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(project.tags || []).map((t) => <span key={t} className={c.tag}>{t}</span>)}
                {(project.extra || []).map((t) => <span key={t} className="tag--muted">{t}</span>)}
              </div>
            </section>

            <section className="card" aria-labelledby="project-links">
              <h2 id="project-links" className="font-display font-bold text-lg text-text-primary tracking-tight mb-4">
                Project Links
              </h2>
              <ProjectActions project={project} buttonClassName="px-4 py-2" />
            </section>
          </div>
        </div>

        <div className="divider my-10" />

        <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Project navigation">
          {(() => {
            const idx  = projects.findIndex((p) => p.id === project.id);
            const prev = projects[(idx - 1 + projects.length) % projects.length];
            const next = projects[(idx + 1) % projects.length];
            return (
              <>
                <Link
                  to={`/work/${prev.slug}`}
                  className="btn-secondary text-sm"
                  aria-label={`Open Project Details for ${prev.title}`}
                >
                  <ArrowLeftIcon size={15} />
                  {prev.title}
                </Link>
                <Link
                  to="/#work"
                  onClick={goToSection('work')}
                  className="btn-ghost text-sm"
                  aria-label="Back to projects"
                >
                  All Projects
                  <ArrowRightIcon size={15} />
                </Link>
                <Link
                  to={`/work/${next.slug}`}
                  className="btn-secondary text-sm"
                  aria-label={`Open Project Details for ${next.title}`}
                >
                  {next.title}
                  <ArrowRightIcon size={15} />
                </Link>
              </>
            );
          })()}
        </nav>
      </div>
    </main>
  );
}
