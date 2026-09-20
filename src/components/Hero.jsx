import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scrollToSection } from '../utils/scroll';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, LocationIcon } from './icons';

const heroData = {
  name: 'Shivchandar Sah',
  nameShort: 'Shivchandar',
  location: 'Kathmandu, Nepal',
  tagline: 'I enjoy turning ideas into real products, whether that’s a web app, a real-time platform, or an AI-powered tool. I care about building interfaces that feel good to use and backends that are reliable, secure, and ready to scale.',
  description: "I’m a Computer Engineering graduate from Cosmos College, with a focus on full-stack development. I work with technologies like React, Node.js, Express, and MongoDB, and I’ve built everything from JWT-based authentication and REST APIs to real-time applications using Socket.IO.",
  resumeFile: '/Shivchandar_Kumar_Sah_Resume_Updated.pdf',
  stack: ['React.js', 'Vue.js', 'Node.js', 'MongoDB', 'MySQL'],
  stats: [
    { value: '6+', label: 'Projects' },
    { value: '4+', label: 'Yrs coding' },
    { value: '15+', label: 'Technologies' },
  ],
};

const roles = [
  'Full-Stack Engineer',
  'CRM & Automation Developer',
  'AI Integration Engineer',
  'Real-Time Systems Developer',
];

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/shivchandarsah',
    icon: <GithubIcon size={17} />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shivchandar-sah-394250296',
    icon: <LinkedinIcon size={17} />,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/shivchandar_sah33',
    icon: <InstagramIcon size={17} />,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/Sahprince0',
    icon: <FacebookIcon size={17} />,
  },
];

const marqueeTech = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'Vue.js',
  'Socket.IO', 'TypeScript', 'JWT Auth', 'REST APIs', 'Google Gemini AI',
  'Sequelize ORM', 'Pinecone RAG', 'Vercel', 'Render',
];

export default function Hero() {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();

  /* Typewriter: the FIRST role renders as static text immediately on mount
     (LCP-friendly). The typing loop runs when the component mounts, with no
     idle-callback or fallback-timer gating on the critical path. */
  const [typed, setTyped] = useState(roles[0]);
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showCaret, setShowCaret] = useState(true);

  /* Typewriter orchestration: schedules delete-after-type and role-advance.
     This effect only *plans* the next phase; the actual character typing is
     handled by the second effect below so the dependency graph stays small. */
  useEffect(() => {
    if (prefersReduced) return;
    const full = roles[roleIdx];

    if (!deleting && typed === full) {
      const t = setTimeout(() => {
        setDeleting(true);
        setShowCaret(false); // hide caret during delete phase
      }, 1900);
      return () => clearTimeout(t);
    }
    if (deleting && typed === '') {
      const t = setTimeout(() => {
        setRoleIdx((i) => (i + 1) % roles.length);
        setDeleting(false);
        setShowCaret(true); // show caret for new role
      }, 200);
      return () => clearTimeout(t);
    }
  }, [typed, deleting, roleIdx, prefersReduced]);

  /* Typewriter body: types or deletes one character per tick. The effect
     only re-runs when the role changes (roleIdx), the phase flips (deleting),
     or the typed text changes — never on every character typed longer than
     needed; each tick is a cheap setState. */
  useEffect(() => {
    if (prefersReduced) return;
    const full = roles[roleIdx];
    if (typed === full && !deleting) return;
    if (deleting && typed === '') return;
    const delay = deleting ? 35 : 75;
    const t = setTimeout(() => {
      setTyped(deleting
        ? full.slice(0, typed.length - 1)
        : full.slice(0, typed.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
  }, [typed, deleting, roleIdx, prefersReduced]);

  /* Build the visible portion of the current role string */

  const scrollTo = (id) => scrollToSection(id);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-20 md:pt-16 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 w-full pt-8 pb-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">

          {/* ── Content ── */}
          <div className="space-y-7">

            <div className="hero-el flex justify-center">
              <span className="badge-available">Open to opportunities</span>
            </div>

            <div className="hero-el space-y-3">
              <h1 id="hero-title" className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-text-primary leading-[1.08] tracking-tight">
                Hi, I&apos;m{' '}
                <span className="gradient-text">{heroData.name}</span>
              </h1>
              <div className="flex justify-center">
                <span className="text-base md:text-lg font-semibold text-text-primary font-mono">
                  <span className="gradient-text">{typed}</span>
                </span>
                {showCaret && (
                  <span className="hero-caret ml-0.5" aria-hidden="true">|</span>
                )}
              </div>
              <p className="flex items-center justify-center gap-1.5 text-sm text-text-muted">
                <LocationIcon size={15} className="flex-shrink-0 text-accent" />
                {heroData.location}
              </p>
            </div>

            <p className="hero-el text-text-secondary text-base md:text-[1.0625rem] leading-relaxed max-w-xl mx-auto">
              {heroData.tagline}
            </p>
            <p className="hero-el text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
              {heroData.description}
            </p>

            <div className="hero-el flex flex-wrap justify-center gap-3">
              <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo('work'); }} className="btn-primary"
                aria-label="View my software projects in the work section">
                View My Software Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} className="btn-secondary"
                aria-label="Get in touch through the contact section">
                Get In Touch
              </a>
            </div>

            <div className="hero-el flex items-center justify-center gap-5 pt-1">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors duration-200 text-sm font-medium"
                  aria-label={`Shivchandar Kumar Sah on ${s.name}`}
                >
                  <span className="w-[28px] h-[28px] rounded-lg border border-border flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(94,234,212,0.10)' }}>
                    {s.icon}
                  </span>
                  <span className="hidden sm:inline">{s.name}</span>
                </a>
              ))}
            </div>

            {/* Inline stats — single gap source, dividers as siblings, wraps on tiny screens */}
            <div className="hero-el flex flex-wrap items-center justify-center pt-2">
              {heroData.stats.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  {i > 0 && <span className="block w-px h-8 bg-border mx-5 sm:mx-8 flex-shrink-0" aria-hidden="true" />}
                  <div className="text-center px-1">
                    <p className="font-display font-bold text-xl md:text-2xl text-accent leading-none">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech ticker ── */}
        <div className="hero-el mt-16 lg:mt-20 relative overflow-hidden"
          style={{ animationDelay: '0.65s' }}
          aria-hidden="true">
          <div className="hero-marquee flex gap-10 w-max">
            {[...marqueeTech, ...marqueeTech].map((t, i) => (
              <span key={i} className="flex items-center gap-10 text-sm font-medium text-text-muted whitespace-nowrap">
                {t}
                <span className="w-1 h-1 rounded-full bg-accent/50" />
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
