import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  ArrowRightIcon, AwardIcon, BotIcon, CheckIcon, CodeIcon, DatabaseIcon, DeployIcon,
  GlobeIcon, GraduationCapIcon, InspectIcon, LayersIcon, LightbulbIcon, LocationIcon,
  LockIcon, MailIcon, PackageIcon, PhoneIcon, SettingsIcon, ZapIcon,
} from './icons';
import { loadGsap } from '../utils/anim';


const aboutData = {
  summary: [
    "I'm Shivchandar Sah, a Full-Stack Engineer and Computer Engineering graduate from Kathmandu, Nepal. I ship production applications, not just side projects. From AI-powered customer support platforms with real-time chat to business management CRMs with fine-grained role-based access control.",
    'My stack is Node.js + Express on the back, React or Vue on the front, MongoDB or MySQL for data, and Socket.IO when things need to happen live. I take auth seriously, JWT, RBAC, and secure API design are non-negotiable defaults in everything I build.',
    "Degree done, appetite for building: unlimited. When I'm not pushing commits I'm exploring open-source, sharpening system design, and finding better ways to solve problems that actually matter.",
  ],
  stats: [
    { value: '5+',  label: 'Projects Shipped', icon: <PackageIcon size={24} strokeWidth={1.5} /> },
    { value: '4+',  label: 'Years Coding',      icon: <CodeIcon    size={24} strokeWidth={1.5} /> },
    { value: '2',   label: 'Stacks Mastered',   icon: <LayersIcon  size={24} strokeWidth={1.5} /> },
    { value: '10+', label: 'Technologies',      icon: <GlobeIcon   size={24} strokeWidth={1.5} /> },
  ],
  contact: {
    email:    'sahshivchandar14@gmail.com',
    phone:    '+977-9825808450',
    location: 'Sitapaila, Kathmandu, Nepal',
  },
  /* Full-stack focused, no mobile */
  coreSkills: [
    'JavaScript (ES6+)',
    'React.js',
    'Vue.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'MySQL',
    'Socket.IO',
    'JWT Auth',
    'REST APIs',
    'Git & GitHub',
    'Vercel / Render',
  ],
};

export default function About() {
  const sectionRef     = useRef(null);
  const prefersReduced = useReducedMotion();

  /* Deferred reveal: GSAP loads only when About mounts (already lazy),
     never on the Hero critical path. */
  useEffect(() => {
    if (prefersReduced) return;
    let ctx = null;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray('.about-reveal').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el, start: 'top 84%', once: true,
            onEnter: () =>
              gsap.fromTo(el, { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: i * 0.07 }
              ),
          });
        });
      }, sectionRef);
    }).catch(() => {});
    return () => { cancelled = true; if (ctx) ctx.revert(); };
  }, [prefersReduced]);

  return (
    <section ref={sectionRef} id="about" className="section section-alt" aria-labelledby="about-title">
      <div className="section-inner">

        {/* Header */}
        <div className="about-reveal mb-14">
          <h2 id="about-title" className="section-title max-w-xl">
            Building software that <span className="gradient-text">matters</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* ── Bio, 3 cols ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* Summary paragraphs */}
            <div className="about-reveal space-y-4">
              {aboutData.summary.map((text, i) => (
                <p key={i} className="text-text-secondary leading-relaxed text-[0.9375rem]">
                  {text}
                </p>
              ))}
            </div>

            {/* Core skills, Full-stack focused */}
            <div className="about-reveal">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">
                Core Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.coreSkills.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>

            {/* What I build card, moved from sidebar to balance columns */}
            <div className="about-reveal card">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4">
                What I Build
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { icon: <ZapIcon      size={16} />, text: 'Real-time apps with Socket.IO & WebRTC' },
                  { icon: <LockIcon     size={16} />, text: 'JWT auth & role-based access control' },
                  { icon: <DatabaseIcon size={16} />, text: 'MongoDB / MySQL data layers' },
                  { icon: <BotIcon      size={16} />, text: 'AI integrations with RAG pipelines' },
                  { icon: <SettingsIcon size={16} />, text: 'Business automation & CRM platforms' },
                  { icon: <DeployIcon   size={16} />, text: 'Deployed on Vercel & Render' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact snippets */}
            <div className="about-reveal grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Email',    value: aboutData.contact.email,    icon: <MailIcon size={14} className="text-accent" /> },
                { label: 'Phone',    value: aboutData.contact.phone,    icon: <PhoneIcon size={14} className="text-accent" /> },
                { label: 'Location', value: aboutData.contact.location, icon: <LocationIcon size={14} className="text-accent" /> },
              ].map((c) => (
                <div key={c.label} className="card--flat rounded-xl p-4">
                  <p className="text-[10px] text-text-muted mb-1 inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide">
                    <span className="w-5 h-5 rounded-md border border-border flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(94,234,212,0.10)' }}>
                      {c.icon}
                    </span>
                    {c.label}
                  </p>
                  <p className="text-xs font-semibold text-text-primary break-words leading-snug">
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar, 2 cols ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Profile card, moved from Hero, mobile responsive */}
            <div className="about-reveal relative w-full max-w-[340px] mx-auto lg:max-w-none">

              {/* Glow ring behind card */}
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(94, 234, 212, 0.35) 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Main card */}
              <div className="relative card p-6 shadow-glow">
                {/* Photo: click to view full size in a new tab */}
                <div className="flex justify-center mb-5">
                  <a
                    href="/profile-full-1024.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View profile photo in full size"
                    title="View profile photo in full size"
                    className="relative block rounded-2xl cursor-zoom-in group/avatar"
                  >
                    <div className="absolute inset-0 rounded-2xl blur-md opacity-40"
                      style={{ background: 'linear-gradient(135deg,#5eead4,#d99b3b)', transform: 'scale(1.08)' }}
                      aria-hidden="true"
                    />
                    <img
                      src="/profile-512.webp"
                      srcSet="/profile-512.webp 512w, /profile-1024.webp 1024w"
                      sizes="112px"
                      alt="Shivchandar Sah, Full-Stack Engineer from Nepal. Click to view full size"
                      className="relative w-28 h-28 rounded-2xl object-cover ring-2 ring-accent/30 group-hover/avatar:ring-accent group-hover/avatar:opacity-90 transition-all duration-200"
                      width="112" height="112" loading="lazy" decoding="async" fetchPriority="low"
                    />
                    <span
                      className="absolute bottom-1.5 right-1.5 z-10 w-6 h-6 rounded-full hidden items-center justify-center border border-border group-hover/avatar:flex"
                      style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                      aria-hidden="true"
                    >
                      <InspectIcon size={12} className="text-accent" />
                    </span>
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-accent border-2 border-bg-card group-hover/avatar:hidden"
                      aria-label="Available" />
                  </a>
                </div>

                {/* Name */}
                <div className="text-center mb-5">
                  <p className="font-display font-bold text-text-primary text-sm tracking-tight">Shivchandar Sah</p>
                  <p className="text-xs text-text-secondary mt-0.5">Full-Stack Engineer</p>
                  <p className="inline-flex items-center gap-1 text-xs text-text-muted mt-0.5">
                    <LocationIcon size={13} className="text-accent flex-shrink-0" />
                    Kathmandu, Nepal
                  </p>
                </div>

                {/* Stack */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2.5 text-center">Core Stack</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['React.js', 'Vue.js', 'Node.js', 'MongoDB', 'MySQL'].map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

                <div className="divider mb-5" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { value: '6+',  label: 'Projects' },
                    { value: '4+',  label: 'Yrs coding' },
                    { value: '10+', label: 'Technologies' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-display font-bold text-lg text-accent leading-none">{s.value}</p>
                      <p className="text-[10px] text-text-muted mt-1 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating chips — safe inset positioning to avoid viewport clip */}
              <div className="absolute -top-3 -right-2 px-3 py-1.5 rounded-lg text-xs font-bold text-bg shadow-glow flex items-center gap-1"
                style={{ background: 'linear-gradient(135deg,#5eead4,#d99b3b)' }} aria-hidden="true">
                Open to Work
                <CheckIcon size={12} strokeWidth={3} />
              </div>
              <div className="absolute -bottom-3 -left-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary border border-border max-w-[200px] flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--color-bg-elevated)' }} aria-hidden="true">
                <GraduationCapIcon size={13} className="text-accent flex-shrink-0" />
                <span className="truncate">BCE Graduate · Cosmos College</span>
              </div>
            </div>

            {/* Stats */}
            <div className="about-reveal grid grid-cols-2 gap-3">
              {aboutData.stats.map((stat) => (
                <div key={stat.label} className="card text-center py-6 px-3">
                  <span className="flex justify-center text-accent mb-2" aria-hidden="true">{stat.icon}</span>
                  <p className="font-display font-bold text-2xl text-accent leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-text-muted mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Engineering Mindset Card */}
            <div className="about-reveal card--flat p-4 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true">
                  <LightbulbIcon size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs font-bold text-text-primary mb-1">Engineering Mindset</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Prioritising clean architecture, strict auth defaults, and scalable code that solves real business problems.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Hackathon certificate, full width below the grid ── */}
        <div className="about-reveal card overflow-hidden p-0 mt-12">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <AwardIcon size={16} className="text-accent" />
                <p className="text-xs font-bold text-text-primary">Hackathon Certificate</p>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">
                Recognised at a college hackathon for building a complete, working solution under
                time pressure, from architecture to a demo-ready product.
              </p>
              <a
                href="/hackathon-880.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm"
                aria-label="View hackathon certificate"
              >
                View Certificate
                <ArrowRightIcon size={15} />
              </a>
            </div>
            <a
              href="/hackathon-880.webp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View hackathon certificate"
              className="block border-t md:border-t-0 md:border-l border-border"
            >
              <img
                src="/hackathon-880.webp"
                srcSet="/hackathon-640.webp 640w, /hackathon-880.webp 880w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Shivchandar Sah holding his hackathon certificate for a software project"
                className="w-full h-48 md:h-72 object-cover object-top hover:opacity-80 transition-opacity duration-200"
                width="880" height="611"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
